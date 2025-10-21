"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-10 rounded-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <FaLeaf className="text-green-500 text-4xl" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Input id="email" label="Email Address" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address" icon={<FaEnvelope className="text-gray-400" />} />
            </div>

            <div className="mb-4">
              <Input id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" icon={<FaLock className="text-gray-400" />} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" label="Remember me" checked={false} onChange={()=>{}} />
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" variant="pill" className="w-full" ariaLabel="Sign in" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
