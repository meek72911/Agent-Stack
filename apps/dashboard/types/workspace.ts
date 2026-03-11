export interface WorkspaceMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string;
}

export interface Branding {
  logo?: string;
  favicon?: string;
  primaryColor: string;
  accentColor: string;
  fontFamily?: string;
  customCss?: string;
}

export interface ClientConfig {
  enabledFeatures: string[];
  maintenanceMode: boolean;
  apiRateLimit: number;
  maxFileUploadMb: number;
  allowedOrigins: string[];
  webhookSecret?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
  scopes: string[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  branding: Branding;
  config: ClientConfig;
  members: WorkspaceMember[];
  apiKeys: ApiKey[];
  planId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceInvite {
  id: string;
  email: string;
  role: WorkspaceMember["role"];
  invitedBy: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired" | "revoked";
}
