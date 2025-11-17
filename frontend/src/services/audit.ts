import api from './api';

export interface AuditLog {
  id: string;
  user_type: string;
  user_id: string;
  event: string;
  auditable_type: string;
  auditable_id: string;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  url: string;
  ip_address: string;
  user_agent: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuditPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface AuditPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface AuditListResponse {
  data: AuditLog[];
  meta: AuditPaginationMeta;
  links: AuditPaginationLinks;
}

export interface AuditDetailResponse {
  data: AuditLog;
}

export const auditService = {
  /**
   * Get paginated audit logs for the authenticated user
   */
  async getAuditLogs(page: number = 1, perPage: number = 15): Promise<AuditListResponse> {
    const response = await api.get('/v1/audits', {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  /**
   * Get a specific audit log by ID
   */
  async getAuditLog(id: string): Promise<AuditDetailResponse> {
    const response = await api.get(`/v1/audits/${id}`);
    return response.data;
  },
};
