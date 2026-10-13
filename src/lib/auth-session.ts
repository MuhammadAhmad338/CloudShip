export type AuthUser = {
  id: string;
  login: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export type AuthSession = { user: AuthUser };
