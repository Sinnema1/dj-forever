export interface UserType {
  _id: string;
  fullName: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
