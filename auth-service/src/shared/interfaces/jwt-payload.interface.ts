// This is the shape of data we store inside the JWT token.
// Every protected route will decode this from the token to know who is making the request.
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}