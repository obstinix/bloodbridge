export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'hospital' | 'admin' | 'ngo' | 'blood_bank';
  token?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
