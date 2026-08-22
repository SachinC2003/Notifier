export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
};

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
  apiKey: AuthApiKey;
};

export type AuthApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  apiKey?: string;
};
