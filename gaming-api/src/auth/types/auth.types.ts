export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile: any;
    isVerified: boolean;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
} 