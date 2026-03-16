export interface Visitor {
    id: number;
    name: string;
    phone: string;
    unitNumber: string;
    visitDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddVisitorPayload {
    name: string;
    phone: string;
    unitNumber: string;
    visitDate: string;
}

export interface UpdateVisitorPayload extends AddVisitorPayload {
    id: number;
}

export interface VisitorQueryParams {
    search?: string;
    status?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface VisitorPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface FetchVisitorsResponse {
    success: boolean;
    data: Visitor[];
    pagination: VisitorPagination;
}

export interface VisitorApiResponse {
    success: boolean;
    data: Visitor;
    message?: string;
}

export interface VisitorsState {
    list: Visitor[];
    total: number;
    loading: boolean;
    success: boolean;
    error: string | null;
    params: VisitorQueryParams;
}
