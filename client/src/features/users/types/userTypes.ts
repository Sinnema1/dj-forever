/**
 * Represents a user in the system.
 */
export interface UserType {
  _id: string;
  fullName: string;
  email: string;
  isAdmin?: boolean; // Optional: used if admin roles are supported
  isInvited: boolean;
}

/**
 * Shape of the authentication context for the React Context API.
 */
export interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Input type for creating a new user.
 */
export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  username?: string; // Optional: include if usernames are implemented
}

/**
 * Input type for updating an existing user.
 */
export interface UpdateUserInput {
  _id: string; // ID of the user to update (required)
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
}
