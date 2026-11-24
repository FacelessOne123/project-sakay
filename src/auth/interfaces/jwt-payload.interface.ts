export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface AuthenticatedUser {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
}
