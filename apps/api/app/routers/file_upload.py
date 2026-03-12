"""File Upload Router for R2/S3 Storage."""

import uuid
from datetime import datetime
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import boto3
from botocore.config import Config

from app.deps import SupabaseDep, TenantId, SettingsDep, get_current_user

router = APIRouter(prefix="/files", tags=["Files"])

class FileResponse(BaseModel):
    id: str
    filename: str
    size: int
    url: str
    created_at: datetime

class FileListResponse(BaseModel):
    files: List[FileResponse]
    count: int

# R2 upload using boto3
async def upload_to_r2(file: UploadFile, user_id: str, tenant_id: str, settings: SettingsDep) -> str:
    """Upload file to R2 storage using Cloudflare R2."""
    import os
    
    # Get R2 credentials from environment
    account_id = settings.r2_account_id
    bucket_name = settings.r2_bucket_name
    access_key_id = settings.r2_access_key_id
    secret_access_key = settings.r2_secret_access_key
    
    if not all([account_id, bucket_name, access_key_id, secret_access_key]):
        raise HTTPException(status_code=500, detail="R2 credentials not configured")
    
    # Create S3 client for R2
    s3_client = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{tenant_id}/{user_id}/{file_id}_{file.filename}"
    
    # Upload file to R2
    try:
        s3_client.upload_fileobj(
            file.file,
            bucket_name,
            filename,
            ExtraArgs={'ContentType': file.content_type}
        )
        
        # Generate public URL
        # Note: R2 requires custom domains for public access
        # For now, return the object key and let the frontend construct the URL
        return f"https://pub-{account_id}.r2.dev/{filename}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.post("", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
    settings: SettingsDep,
    file: UploadFile = File(...),
):
    """Upload a file to R2 storage."""
    # Validate file size (max 100MB)
    file.file.seek(0, 2)  # Seek to end
    size = file.file.tell()
    file.file.seek(0)  # Reset

    if size > 100 * 1024 * 1024:  # 100MB
        raise HTTPException(status_code=400, detail="File size exceeds 100MB limit")

    # Validate file type
    allowed_types = ["application/pdf", "text/plain", "image/png", "image/jpeg", "application/json"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")

    # Upload to R2
    url = await upload_to_r2(file, current_user["id"], tenant_id, settings)

    # Store metadata in database
    result = await supabase.table("files").insert({
        "user_id": current_user["id"],
        "organization_id": tenant_id,
        "filename": file.filename,
        "size": size,
        "content_type": file.content_type,
        "url": url,
    }).execute()

    return FileResponse(
        id=result.data[0]["id"],
        filename=file.filename if file.filename else "unnamed",
        size=size,
        url=url,
        created_at=datetime.fromisoformat(result.data[0]["created_at"]),
    )

@router.get("", response_model=FileListResponse)
async def list_files(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """List all files for the organization."""
    result = await supabase.table("files").select("*").eq("organization_id", tenant_id).execute()

    files = [
        FileResponse(
            id=f["id"],
            filename=f["filename"],
            size=f["size"],
            url=f["url"],
            created_at=datetime.fromisoformat(f["created_at"]),
        )
        for f in result.data
    ]

    return FileListResponse(files=files, count=len(files))

@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Delete a file."""
    await supabase.table("files").delete().eq("id", file_id).eq("organization_id", tenant_id).execute()
    return {"status": "deleted"}
