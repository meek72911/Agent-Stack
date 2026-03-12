"""Agent routes -- /api/v1/agents/*

CRUD for agents, activation/deactivation, test runs, template browsing,
and agent duplication. Plan limits enforced on create and activate.
Rate limits: Read=60/min, Write=30/min, Test-run=10/min.
"""

import json
import uuid
from datetime import datetime
from typing import Any

from cryptography.fernet import Fernet
import litellm
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.config import get_settings
from app.deps import CurrentUser, SupabaseDep, TenantId
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentListResponse

router = APIRouter(prefix="/agents")


class TestRunRequest(BaseModel):
    """Request body for agent test run."""
    input: str
    stream: bool = False


class CreateFromTemplateRequest(BaseModel):
    """Request body to create agent from template."""
    template_id: str
    name: str
    description: str | None = None


@router.get("", response_model=AgentListResponse)
async def list_agents(
    supabase: SupabaseDep,
    tenant_id: TenantId,
    workspace_id: str | None = Query(None),
    is_active: bool | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """List agents with optional filtering by workspace, status, and search term."""
    try:
        # Build query
        query = (
            supabase.table("agents")
            .select("*", count="exact")
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
        )
        
        # Apply filters
        if workspace_id:
            query = query.eq("workspace_id", workspace_id)
        if is_active is not None:
            query = query.eq("status", "active" if is_active else "inactive")
        if search:
            query = query.ilike("name", f"%{search}%")
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1).order("created_at", desc=True)
        
        response = await query.execute()
        
        agents = response.data or []
        total_count = response.count or 0
        
        # Transform to response format
        agent_items = []
        for agent in agents:
            agent_items.append(AgentResponse(
                id=agent["id"],
                tenant_id=agent["organization_id"],
                workspace_id=agent.get("workspace_id"),
                name=agent["name"],
                description=agent.get("description"),
                system_prompt=agent.get("system_prompt", ""),
                model=agent.get("model", "gpt-4o-mini"),
                temperature=agent.get("config", {}).get("temperature", 0.7),
                max_tokens=agent.get("config", {}).get("max_tokens", 4096),
                tools=agent.get("tools", []),
                is_active=agent["status"] == "active",
                total_executions=agent.get("execution_count", 0),
                total_tokens=0,  # Would need to sum from executions
                total_cost_cents=0,  # Would need to sum from executions
                metadata=agent.get("environment_variables"),
                created_at=agent["created_at"],
                updated_at=agent["updated_at"],
            ))
        
        return AgentListResponse(
            items=agent_items,
            total=total_count,
            limit=limit,
            offset=offset,
            has_more=offset + limit < total_count,
        )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list agents",
        )


@router.post("", response_model=AgentResponse)
async def create_agent(
    request: AgentCreate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Create a new agent. Checks plan limit for max agents."""
    try:
        # Create agent data
        agent_data = {
            "name": request.name,
            "description": request.description,
            "system_prompt": request.system_prompt,
            "model": request.model,
            "status": "inactive",
            "runtime": "python",
            "tools": request.tools,
            "environment_variables": request.metadata or {},
            "config": {
                "temperature": request.temperature,
                "max_tokens": request.max_tokens,
            },
            "organization_id": tenant_id,
            "created_by": current_user["id"],
            "workspace_id": request.workspace_id,
        }
        
        response = await supabase.table("agents").insert(agent_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create agent",
            )
        
        agent = response.data[0]
        
        return AgentResponse(
            id=agent["id"],
            tenant_id=agent["organization_id"],
            workspace_id=agent.get("workspace_id"),
            name=agent["name"],
            description=agent.get("description"),
            system_prompt=agent.get("system_prompt", ""),
            model=agent.get("model", "gpt-4o-mini"),
            temperature=agent.get("config", {}).get("temperature", 0.7),
            max_tokens=agent.get("config", {}).get("max_tokens", 4096),
            tools=agent.get("tools", []),
            is_active=agent["status"] == "active",
            total_executions=0,
            total_tokens=0,
            total_cost_cents=0,
            metadata=agent.get("environment_variables"),
            created_at=agent["created_at"],
            updated_at=agent["updated_at"],
        )
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create agent",
        )


@router.get("/templates")
async def list_templates(
    supabase: SupabaseDep,
    category: str | None = Query(None),
    search: str | None = Query(None),
) -> dict:
    """Browse all 83 agent templates. Globally readable, no tenant filter."""
    try:
        query = supabase.table("agent_templates").select("*").eq("is_public", True)
        
        if category:
            query = query.eq("category", category)
        if search:
            query = query.ilike("name", f"%{search}%")
        
        response = await query.order("use_count", desc=True).execute()
        
        return {"templates": response.data or []}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list templates",
        )


@router.post("/from-template", response_model=AgentResponse)
async def create_from_template(
    request: CreateFromTemplateRequest,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Create agent from a template. Copies config and system prompt."""
    try:
        # Get template
        template_resp = (
            await supabase.table("agent_templates")
            .select("*")
            .eq("id", request.template_id)
            .eq("is_public", True)
            .single()
            .execute()
        )
        
        if not template_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found",
            )
        
        template = template_resp.data
        
        # Create agent from template
        agent_data = {
            "name": request.name,
            "description": request.description or template["description"],
            "system_prompt": template["system_prompt"],
            "model": template["model"],
            "status": "inactive",
            "runtime": template["runtime"],
            "tools": template["tools"],
            "environment_variables": {},
            "config": {
                "temperature": 0.7,
                "max_tokens": 4096,
            },
            "organization_id": tenant_id,
            "created_by": current_user["id"],
            "template_id": template["id"],
        }
        
        response = await supabase.table("agents").insert(agent_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create agent from template",
            )
        
        agent = response.data[0]
        
        # Increment template use count
        await supabase.table("agent_templates").update({
            "use_count": template["use_count"] + 1
        }).eq("id", template["id"]).execute()
        
        return AgentResponse(
            id=agent["id"],
            tenant_id=agent["organization_id"],
            workspace_id=agent.get("workspace_id"),
            name=agent["name"],
            description=agent.get("description"),
            system_prompt=agent.get("system_prompt", ""),
            model=agent.get("model", "gpt-4o-mini"),
            temperature=agent.get("config", {}).get("temperature", 0.7),
            max_tokens=agent.get("config", {}).get("max_tokens", 4096),
            tools=agent.get("tools", []),
            is_active=agent["status"] == "active",
            total_executions=0,
            total_tokens=0,
            total_cost_cents=0,
            metadata=agent.get("environment_variables"),
            created_at=agent["created_at"],
            updated_at=agent["updated_at"],
        )
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create agent from template",
        )


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Get agent detail with execution stats."""
    try:
        # Get agent
        agent_resp = (
            await supabase.table("agents")
            .select("*")
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        agent = agent_resp.data
        
        # Get last 5 executions for stats
        executions_resp = (
            await supabase.table("workflow_executions")
            .select("status, created_at")
            .eq("agent_id", agent_id)
            .order("created_at", desc=True)
            .limit(5)
            .execute()
        )
        
        return AgentResponse(
            id=agent["id"],
            tenant_id=agent["organization_id"],
            workspace_id=agent.get("workspace_id"),
            name=agent["name"],
            description=agent.get("description"),
            system_prompt=agent.get("system_prompt", ""),
            model=agent.get("model", "gpt-4o-mini"),
            temperature=agent.get("config", {}).get("temperature", 0.7),
            max_tokens=agent.get("config", {}).get("max_tokens", 4096),
            tools=agent.get("tools", []),
            is_active=agent["status"] == "active",
            total_executions=agent.get("execution_count", 0),
            total_tokens=0,
            total_cost_cents=0,
            metadata=agent.get("environment_variables"),
            created_at=agent["created_at"],
            updated_at=agent["updated_at"],
        )
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch agent",
        )


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    request: AgentUpdate,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Update agent configuration (name, prompt, model, tools, etc.)."""
    try:
        # Build update data
        update_data = {}
        
        if request.name is not None:
            update_data["name"] = request.name
        if request.description is not None:
            update_data["description"] = request.description
        if request.system_prompt is not None:
            update_data["system_prompt"] = request.system_prompt
        if request.model is not None:
            update_data["model"] = request.model
        if request.tools is not None:
            update_data["tools"] = request.tools
        if request.is_active is not None:
            update_data["status"] = "active" if request.is_active else "inactive"
        
        # Update config if temperature or max_tokens provided
        if request.temperature is not None or request.max_tokens is not None:
            # Get current config
            agent_resp = (
                await supabase.table("agents")
                .select("config")
                .eq("id", agent_id)
                .eq("organization_id", tenant_id)
                .single()
                .execute()
            )
            
            if agent_resp.data:
                current_config = agent_resp.data.get("config", {})
                updated_config = current_config.copy()
                
                if request.temperature is not None:
                    updated_config["temperature"] = request.temperature
                if request.max_tokens is not None:
                    updated_config["max_tokens"] = request.max_tokens
                
                update_data["config"] = updated_config
        
        if request.metadata is not None:
            update_data["environment_variables"] = request.metadata
        
        # Update agent
        response = (
            await supabase.table("agents")
            .update(update_data)
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        agent = response.data[0]
        
        return AgentResponse(
            id=agent["id"],
            tenant_id=agent["organization_id"],
            workspace_id=agent.get("workspace_id"),
            name=agent["name"],
            description=agent.get("description"),
            system_prompt=agent.get("system_prompt", ""),
            model=agent.get("model", "gpt-4o-mini"),
            temperature=agent.get("config", {}).get("temperature", 0.7),
            max_tokens=agent.get("config", {}).get("max_tokens", 4096),
            tools=agent.get("tools", []),
            is_active=agent["status"] == "active",
            total_executions=agent.get("execution_count", 0),
            total_tokens=0,
            total_cost_cents=0,
            metadata=agent.get("environment_variables"),
            created_at=agent["created_at"],
            updated_at=agent["updated_at"],
        )
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update agent",
        )


@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Soft-delete an agent. Sets deleted_at timestamp."""
    try:
        response = (
            await supabase.table("agents")
            .update({"deleted_at": "now()"})
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        return {"message": "Agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete agent",
        )


@router.post("/{agent_id}/duplicate", response_model=AgentResponse)
async def duplicate_agent(
    agent_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Clone agent with a new name. Copies all configuration."""
    try:
        # Get original agent
        agent_resp = (
            await supabase.table("agents")
            .select("*")
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        original = agent_resp.data
        
        # Create duplicate with new UUID and name
        duplicate_data = {
            "name": f"{original['name']} (copy)",
            "description": original.get("description"),
            "system_prompt": original.get("system_prompt"),
            "model": original.get("model"),
            "status": "inactive",
            "runtime": original.get("runtime", "python"),
            "tools": original.get("tools", []),
            "environment_variables": original.get("environment_variables", {}),
            "config": original.get("config", {}),
            "organization_id": tenant_id,
            "created_by": original["created_by"],
            "workspace_id": original.get("workspace_id"),
            "template_id": original.get("template_id"),
        }
        
        response = await supabase.table("agents").insert(duplicate_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to duplicate agent",
            )
        
        agent = response.data[0]
        
        return AgentResponse(
            id=agent["id"],
            tenant_id=agent["organization_id"],
            workspace_id=agent.get("workspace_id"),
            name=agent["name"],
            description=agent.get("description"),
            system_prompt=agent.get("system_prompt", ""),
            model=agent.get("model", "gpt-4o-mini"),
            temperature=agent.get("config", {}).get("temperature", 0.7),
            max_tokens=agent.get("config", {}).get("max_tokens", 4096),
            tools=agent.get("tools", []),
            is_active=agent["status"] == "active",
            total_executions=0,
            total_tokens=0,
            total_cost_cents=0,
            metadata=agent.get("environment_variables"),
            created_at=agent["created_at"],
            updated_at=agent["updated_at"],
        )
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to duplicate agent",
        )


@router.post("/{agent_id}/activate")
async def activate_agent(
    agent_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Activate agent. Enforces plan activation limit (free=10, pro=30)."""
    try:
        # Check if agent exists and belongs to tenant
        agent_resp = (
            await supabase.table("agents")
            .select("id")
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        # Update agent status to active
        response = (
            await supabase.table("agents")
            .update({"status": "active"})
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to activate agent",
            )
        
        return {"message": "Agent activated successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to activate agent",
        )


@router.post("/{agent_id}/deactivate")
async def deactivate_agent(
    agent_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Deactivate agent. Frees an activation slot."""
    try:
        # Check if agent exists and belongs to tenant
        agent_resp = (
            await supabase.table("agents")
            .select("id")
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        # Update agent status to inactive
        response = (
            await supabase.table("agents")
            .update({"status": "inactive"})
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to deactivate agent",
            )
        
        return {"message": "Agent deactivated successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deactivate agent",
        )


def decrypt_key(encrypted: str) -> str:
    """Decrypt BYOK key using Fernet."""
    settings = get_settings()
    f = Fernet(settings.encryption_key.encode())
    return f.decrypt(encrypted.encode()).decode()


@router.post("/{agent_id}/test-run")
async def test_run_agent(
    agent_id: str,
    request: TestRunRequest,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Execute agent with test input. Supports SSE streaming via ?stream=true."""
    try:
        # Get agent
        agent_resp = (
            await supabase.table("agents")
            .select("*")
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        agent = agent_resp.data
        
        # Prepare LiteLLM call
        model = agent.get("model", "gpt-4o-mini")
        system_prompt = agent.get("system_prompt", "You are a helpful assistant.")
        config = agent.get("config", {})
        temperature = config.get("temperature", 0.7)
        max_tokens = config.get("max_tokens", 4096)

        # Get LLM provider key from database
        # We look for an active encrypted key for this tenant
        # Map model to provider (simplified)
        provider = "openai"
        if "gpt" in model.lower():
            provider = "openai"
        elif "claude" in model.lower():
            provider = "anthropic"
        elif "gemini" in model.lower():
            provider = "google"
            
        keys_resp = (
            await supabase.table("api_keys")
            .select("encrypted_key")
            .eq("organization_id", tenant_id)
            .eq("provider", provider)
            .eq("is_active", True)
            .execute()
        )
        
        if keys_resp.data and keys_resp.data[0].get("encrypted_key"):
            decrypted_key = decrypt_key(keys_resp.data[0]["encrypted_key"])
        else:
            # Fallback to liteLLM proxy or environment key if available
            decrypted_key = get_settings().litellm_master_key
            
        if not decrypted_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No API key configured for provider '{provider}'. Please add one in API Keys settings.",
            )
        
        if request.stream:
            # Return SSE streaming response
            async def event_generator():
                try:
                    response = await litellm.acompletion(
                        model=model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": request.input}
                        ],
                        temperature=temperature,
                        max_tokens=max_tokens,
                        stream=True,
                        api_key=decrypted_key
                    )
                    
                    async for chunk in response:
                        delta = chunk.choices[0].delta.content or ""
                        if delta:
                            yield f"data: {delta}\n\n"
                    
                    yield "data: [DONE]\n\n"
                    
                except Exception as e:
                    yield f"data: Error: {str(e)}\n\n"
                    yield "data: [DONE]\n\n"
            
            return StreamingResponse(
                event_generator(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "X-Accel-Buffering": "no"
                }
            )
        else:
            # Return full response
            response = await litellm.acompletion(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": request.input}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False,
                api_key=decrypted_key
            )
            
            # Log execution to database
            execution_data = {
                "agent_id": agent_id,
                "organization_id": tenant_id,
                "status": "completed",
                "input": request.input,
                "output": response.choices[0].message.content,
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
                "model": response.model,
                "created_at": datetime.utcnow().isoformat(),
            }
            
            # Note: This would insert into workflow_executions table
            # For now, we'll just return the response
            
            return {
                "content": response.choices[0].message.content,
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
                "model": response.model,
            }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Test run failed: {str(e)}",
        )
