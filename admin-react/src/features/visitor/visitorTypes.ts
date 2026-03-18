/**
 * File: visitorTypes.ts
 * Purpose: Define all TypeScript interfaces and types for the Visitor management module.
 */

// Interface for the primary Visitor data model
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

// Payload for adding a new visitor
export interface AddVisitorPayload {
    name: string;
    phone: string;
    unitNumber: string;
    visitDate: string;
}

// Payload for updating an existing visitor record
export interface UpdateVisitorPayload extends AddVisitorPayload {
    id: number;
}

// Query parameters for fetching and filtering visitor lists
export interface VisitorQueryParams {
    search?: string;
    status?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Standard pagination structure for visitor list responses
export interface VisitorPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// API response structure for multiple visitor records
export interface FetchVisitorsResponse {
    success: boolean;
    data: Visitor[];
    pagination: VisitorPagination;
}

// Standard API response for a single visitor operation
export interface VisitorApiResponse {
    success: boolean;
    data: Visitor;
    message?: string;
}

// Redux state structure for the visitor feature
export interface VisitorsState {
    list: Visitor[];
    total: number;
    loading: boolean;
    success: boolean;
    error: string | null;
    params: VisitorQueryParams;
}
