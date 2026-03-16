export interface User {
    id: number;
    email: string;
    role: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginSuccessResponse {
    success: true;
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginFailureResponse {
    success: false;
    message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginFailureResponse;

export interface RefreshTokenResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    forgotPasswordSuccess: boolean;
    resetPasswordSuccess: boolean;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}

export interface AuthApiResponse {
    success: boolean;
    message: string;
}
