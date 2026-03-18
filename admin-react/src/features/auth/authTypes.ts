/**
 * File: authTypes.ts
 * Purpose: Define interfaces for the Authentication module.
 * Includes User model, payloads, and API responses.
 */

// Interface for the primary User model
export interface User {
    id: number;
    email: string;
    role: string;
}

// Payload structure for login request
export interface LoginPayload {
    email: string;
    password: string;
}

// Success response structure from the login API
export interface LoginSuccessResponse {
    success: true;
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Failure response structure from the login API
export interface LoginFailureResponse {
    success: false;
    message: string;
}

// Combined type for login API response
export type LoginResponse = LoginSuccessResponse | LoginFailureResponse;

// Structure for refreshing tokens response
export interface RefreshTokenResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
}

// Redux state structure for authentication feature
export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
