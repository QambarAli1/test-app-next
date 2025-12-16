export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: "user";
  password?: string;
  isImpersonated?: boolean;
  phone?: string;
  gender?: string;
  dob?: string;
};

export type StoredAdmin = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

export type AuthState = {
  user: StoredUser | null;
  admin: StoredAdmin | null;
};
