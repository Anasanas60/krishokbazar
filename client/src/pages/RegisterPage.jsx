"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/slices/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
} from "react-icons/fa";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "consumer",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [passwordError, setPasswordError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      address: formData.address,
    };

    dispatch(register(userData));
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              sign in to your existing account
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

        {passwordError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{passwordError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <Input id="name" name="name" label="Full Name" type="text" value={formData.name} onChange={handleChange} placeholder="Full name" icon={<FaUser className="text-gray-400" />} />
            </div>

            <div className="mb-4">
              <Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} placeholder="Email address" icon={<FaEnvelope className="text-gray-400" />} />
            </div>

            <div className="mb-4">
              <Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" icon={<FaLock className="text-gray-400" />} minLength={6} />
            </div>

            <div className="mb-4">
              <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" icon={<FaLock className="text-gray-400" />} minLength={6} />
            </div>

            <div className="mb-4">
              <Input id="role" name="role" label="I am a:" as="select" value={formData.role} onChange={handleChange} options={[{value:'consumer',label:'Consumer'},{value:'farmer',label:'Farmer'}]} />
            </div>

            {formData.role === "farmer" && (
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Phone number"
                    required={formData.role === "farmer"}
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    id="street"
                    name="address.street"
                    type="text"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="city"
                    name="address.city"
                    type="text"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="form-input pl-3"
                    placeholder="City"
                  />
                  <input
                    id="state"
                    name="address.state"
                    type="text"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="form-input pl-3"
                    placeholder="State"
                  />
                </div>

                <input
                  id="zipCode"
                  name="address.zipCode"
                  type="text"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="form-input pl-3"
                  placeholder="ZIP / Postal code"
                />
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" variant="pill" className="w-full" ariaLabel="Create Account" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
