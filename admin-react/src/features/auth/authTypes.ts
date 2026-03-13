export interface User {
    id: number;
    name: string;
    email: string;
    role: string | null;
    user_type: string;
    is_master: boolean;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginData {
    access: string;
    refresh: string;
    user: User;
}

export interface LoginResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: LoginData;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
