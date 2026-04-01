export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: 'USER' | 'ADMIN';
}
