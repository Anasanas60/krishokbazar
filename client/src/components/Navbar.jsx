"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FaLeaf,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 app-navbar backdrop-blur-sm" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center nav-logo">
              <img src="/logo.png" alt="KrishokBazar Logo" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">KrishokBazar</h1>
              <p className="text-xs text-gray-500">Farm to table marketplace</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/farmers" className="nav-link">Farmers</Link>
            <Link to="/about" className="nav-link">About</Link>

            {isAuthenticated && user?.role === "consumer" && (
              <Link to="/checkout" className="relative" aria-label="Cart">
                <div className="w-10 h-10 rounded-full flex items-center justify-center nav-logo">
                  <FaShoppingCart className="text-green-600 text-lg" />
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItems.length}</span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleProfile} className="flex items-center gap-3 focus:outline-none" aria-haspopup="true" aria-expanded={isProfileOpen}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center nav-logo">
                    <FaUser className="text-green-600" />
                  </div>
                  <div className="text-sm font-medium">{user?.name?.split(" ")[0]}</div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-md p-2 z-10" role="menu">
                    {user?.role === "admin" && <Link to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-50" role="menuitem">Admin Dashboard</Link>}
                    {user?.role === "farmer" && <Link to="/farmer/dashboard" className="block px-3 py-2 rounded hover:bg-gray-50" role="menuitem">Farmer Dashboard</Link>}
                    {user?.role !== "admin" && (
                      <>
                        <Link to="/profile" className="block px-3 py-2 rounded hover:bg-gray-50" role="menuitem">Profile</Link>
                        <Link to="/orders" className="block px-3 py-2 rounded hover:bg-gray-50" role="menuitem">Orders</Link>
                      </>
                    )}
                    <Link to="/messages" className="block px-3 py-2 rounded hover:bg-gray-50" role="menuitem">Messages</Link>
                    <button onClick={() => { handleLogout(); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50" role="menuitem">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="m3-btn-floating">Register</Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md focus:outline-none" aria-label="Toggle menu">
              {isMenuOpen ? <FaTimes className="text-2xl text-gray-700"/> : <FaBars className="text-2xl text-gray-700"/>}
            </button>
          </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden mt-4">
            <div className="m3-card p-4 space-y-3">
              <Link to="/" className="block nav-link" onClick={toggleMenu}>Home</Link>
              <Link to="/products" className="block nav-link" onClick={toggleMenu}>Products</Link>
              <Link to="/farmers" className="block nav-link" onClick={toggleMenu}>Farmers</Link>
              <Link to="/about" className="block nav-link" onClick={toggleMenu}>About</Link>
              {isAuthenticated && user?.role === "consumer" && <Link to="/checkout" className="block nav-link" onClick={toggleMenu}>Cart ({cartItems.length})</Link>}
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && <Link to="/admin/dashboard" className="block nav-link" onClick={toggleMenu}>Admin Dashboard</Link>}
                  {user?.role === "farmer" && <Link to="/farmer/dashboard" className="block nav-link" onClick={toggleMenu}>Farmer Dashboard</Link>}
                  <Link to="/profile" className="block nav-link" onClick={toggleMenu}>Profile</Link>
                  <Link to="/orders" className="block nav-link" onClick={toggleMenu}>Orders</Link>
                  <Link to="/messages" className="block nav-link" onClick={toggleMenu}>Messages</Link>
                  <button onClick={() => { handleLogout(); toggleMenu(); }} className="block text-left nav-link">Logout</button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="block nav-link" onClick={toggleMenu}>Login</Link>
                  <Link to="/register" className="m3-btn-floating text-center" onClick={toggleMenu}>Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
