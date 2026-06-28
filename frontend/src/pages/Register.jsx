import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

import {
  UserPlus,
  Mail,
  Lock,
  User,
  Sprout,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", form);

      alert("Account created successfully!");

      navigate("/login");

    } catch (error) {
      
      alert("Registration failed. Email might already exist.");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">

      <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-xl text-white shadow-2xl">

        <CardHeader className="space-y-1 text-center">

          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an Account
          </CardTitle>

          <CardDescription className="text-gray-400">
            Your Companion for Plant Health Monitoring
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="space-y-2">

              <Label htmlFor="name">Full Name</Label>

              <div className="relative">

                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />

                <Input
                  id="name"
                  placeholder="Ben Stokes"
                  className="pl-10 bg-white/5 border-white/10 focus:border-emerald-500 text-white"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">

              <Label htmlFor="email">Email</Label>

              <div className="relative">

                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />

                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className="pl-10 bg-white/5 border-white/10 focus:border-emerald-500 text-white"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">

              <Label htmlFor="password">Password</Label>

              <div className="relative">

                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-emerald-500 text-white"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">

              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>

              <div className="relative">

                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />

                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-emerald-500 text-white"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}

              Create Account
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-center gap-1 text-sm text-gray-400">

          Already have an account?

          <Link
            to="/login"
            className="text-emerald-500 hover:underline font-medium"
          >
            Login
          </Link>

        </CardFooter>
      </Card>
    </div>
  );
}