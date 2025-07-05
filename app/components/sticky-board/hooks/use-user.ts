import { useSharedState } from "@airstate/react";
import { useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Store hashed password for security
  createdAt: string;
  lastActiveAt: string;
  [key: string]: any; // Index signature for useSharedState compatibility
}

// Simple hash function for demo purposes (in production, use proper bcrypt or similar)
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
};

export function useUser() {
  // Store current user info
  const [currentUser, setCurrentUser, isUserReady] =
    useSharedState<User | null>(null, {
      key: "current-user",
    });

  // Store all users (for future multi-user support)
  const [users, setUsers, isUsersReady] = useSharedState<User[]>([], {
    key: "all-users",
  });

  const isReady = isUserReady && isUsersReady;

  // Migrate existing users to ensure they have proper email fields
  useEffect(() => {
    if (isReady && users.length > 0) {
      const needsMigration = users.some(
        (user) => !user.email || !user.passwordHash
      );
      if (needsMigration) {
        // Clear invalid users and reset to clean state
        setUsers([]);
        setCurrentUser(null);
      }
    }
  }, [isReady, users]);

  // Create a new user (signup)
  const createUser = (name: string, email: string, password: string) => {
    // Validate inputs
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    // Check if user with this email already exists
    const existingUser = users.find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  // Login with email and password
  const loginUser = (email: string, password: string) => {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = users.find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.passwordHash || user.passwordHash !== simpleHash(password)) {
      throw new Error("Invalid password");
    }

    const updatedUser = { ...user, lastActiveAt: new Date().toISOString() };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  // Login by user ID (for switching between users)
  const loginUserById = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const updatedUser = { ...user, lastActiveAt: new Date().toISOString() };
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      setCurrentUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  // Logout current user
  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Update current user
  const updateUser = (updates: Partial<Omit<User, "id" | "createdAt">>) => {
    if (!currentUser) return null;

    const updatedUser = {
      ...currentUser,
      ...updates,
      lastActiveAt: new Date().toISOString(),
    };

    setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  // Initialize default user if none exists (optional - for development)
  const initializeDefaultUser = () => {
    // Commented out to require explicit login/signup
    // if (isReady && !currentUser && users.length === 0) {
    //   return createUser("Default User", "default@example.com", "password");
    // }

    if (isReady && !currentUser && users.length > 0) {
      // Don't auto-login, let user choose
      return null;
    }

    return currentUser;
  };

  // Get user ID for storage keys
  const getUserId = () => {
    return currentUser?.id || "default-user";
  };

  return {
    currentUser,
    users,
    isReady,
    createUser,
    loginUser,
    loginUserById,
    logoutUser,
    updateUser,
    initializeDefaultUser,
    getUserId,
  };
}
