import React, { useState } from "react";
import { User, Settings, LogOut, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUser } from "./hooks/use-user";
import { AuthForm } from "./auth-form";
import { cn } from "~/lib/utils";

interface UserManagerProps {
  className?: string;
}

export function UserManager({ className }: UserManagerProps) {
  const userHook = useUser();
  const [showUserList, setShowUserList] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleSwitchUser = (userId: string) => {
    userHook.loginUserById(userId);
    setShowUserList(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      userHook.logoutUser();
    }
  };

  if (!userHook.isReady) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>;
  }

  // Show auth form if no user is logged in
  if (!userHook.currentUser) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Authentication
          </h3>
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <AuthForm onClose={() => setShowAuthForm(false)} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">User Account</h3>
        <User className="w-5 h-5 text-gray-600" />
      </div>

      {/* Current User Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-800">
              {userHook.currentUser?.name || "No user"}
            </div>
            <div className="text-sm text-gray-600">
              {userHook.currentUser?.email || "No email"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Active since{" "}
              {userHook.currentUser?.lastActiveAt
                ? new Date(
                    userHook.currentUser.lastActiveAt
                  ).toLocaleDateString()
                : "Unknown"}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowUserList(!showUserList)}
              variant="outline"
              size="sm"
            >
              Switch User
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User List */}
      {showUserList && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Available Users</h4>
          <div className="space-y-2">
            {userHook.users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors",
                  user.id === userHook.currentUser?.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
                onClick={() => handleSwitchUser(user.id)}
              >
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-600">
                  {user.email || "No email"}
                </div>
                <div className="text-xs text-gray-500">
                  Created {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowAuthForm(true)}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create New Account
          </Button>
        </div>
      )}

      {/* Auth Form Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full m-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Create New Account</h3>
              <button
                onClick={() => setShowAuthForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <AuthForm onClose={() => setShowAuthForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div className="text-sm text-gray-600">
        <div>Total users: {userHook.users.length}</div>
        <div>Current user: {userHook.currentUser?.name}</div>
      </div>
    </div>
  );
}
