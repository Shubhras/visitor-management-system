export interface Visitor {
    id: string;
    name: string;
    phone: string;
    unit: string;
    visitDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AddVisitorPayload {
    name: string;
    phone: string;
    unit: string;
    visitDate: string;
}

export interface UpdateVisitorPayload extends AddVisitorPayload {
    id: string;
}

export interface VisitorQueryParams {
    search?: string;
    status?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface VisitorsState {
    list: Visitor[];
    total: number;
    loading: boolean;
    success: boolean;
    error: string | null;
    params: VisitorQueryParams;
}
