import React, { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUser } from "./hooks/use-user";
import { cn } from "~/lib/utils";

interface AuthFormProps {
  onClose?: () => void;
}

export function AuthForm({ onClose }: AuthFormProps) {
  const userHook = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password =
        "Password should be at least 8 characters for better security";
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6)
      return { strength: 1, text: "Too short", color: "text-red-500" };
    if (password.length < 8)
      return { strength: 2, text: "Weak", color: "text-orange-500" };
    if (password.length < 12)
      return { strength: 3, text: "Good", color: "text-yellow-500" };
    return { strength: 4, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await userHook.loginUser(formData.email, formData.password);
      } else {
        await userHook.createUser(
          formData.name,
          formData.email,
          formData.password
        );
      }

      // Reset form
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
      onClose?.();
    } catch (error: any) {
      setErrors({ submit: error.message || "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {isLogin ? (
              <LogIn className="w-6 h-6 text-blue-600" />
            ) : (
              <UserPlus className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Sign in to access your sticky notes"
              : "Sign up to get started with sticky notes"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (signup only) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.name ? "border-red-500" : "border-gray-300"
                  )}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className={cn(
                  "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.email ? "border-red-500" : "border-gray-300"
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                className={cn(
                  "w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.password ? "border-red-500" : "border-gray-300"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            {!isLogin && formData.password && !errors.password && (
              <div className="mt-1 flex items-center justify-between">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 w-6 rounded-full transition-colors",
                        level <= passwordStrength.strength
                          ? passwordStrength.strength === 1
                            ? "bg-red-400"
                            : passwordStrength.strength === 2
                            ? "bg-orange-400"
                            : passwordStrength.strength === 3
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className={cn("text-xs", passwordStrength.color)}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password field (signup only) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
