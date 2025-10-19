import { useState } from "react";
import { Menu, ShoppingCart, ChevronDown, X, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LogoWithText } from "./Logo";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";
import { ShoppingCart as CartComponent } from "./ShoppingCart";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const location = useLocation();
  const { state, toggleCart } = useCart();
  const { isAuthenticated, signOut } = useAuth();

  const isActivePage = (path: string) => location.pathname === path;

  const productCategories = [
    { name: "Soccer", href: "/shop?category=soccer" },
    { name: "Cricket", href: "/shop?category=cricket" },
    { name: "Tennis", href: "/shop?category=tennis" },
    { name: "Swimming", href: "/shop?category=swimming" },
    { name: "Apparel", href: "/shop?category=apparel" },
    { name: "Gear", href: "/shop?category=gear" },
    { name: "Accessories", href: "/shop?category=accessories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <LogoWithText />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              // Shop Owner Navigation
              <>
                <Link
                  to="/dashboard"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/dashboard") ? "text-blue-600" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/stores/create"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/stores/create") ? "text-blue-600" : ""
                  }`}
                >
                  Create Store
                </Link>
                <Link
                  to="/admin"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/admin") ? "text-blue-600" : ""
                  }`}
                >
                  Admin Panel
                </Link>
              </>
            ) : (
              // Customer Navigation
              <>
                <div
                  className="relative"
                  onMouseEnter={() => setProductsDropdownOpen(true)}
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 hover:text-gray-600 transition-colors ${
                      isActivePage("/shop") ? "text-blue-600" : ""
                    }`}
                  >
                    Products
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {productsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.href}
                          className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  to="/orders"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/orders") ? "text-blue-600" : ""
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/about"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/about") ? "text-blue-600" : ""
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/blog"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/blog") ? "text-blue-600" : ""
                  }`}
                >
                  Blog
                </Link>
                <Link
                  to="/contact"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/contact") ? "text-blue-600" : ""
                  }`}
                >
                  Contact
                </Link>
                <Link
                  to="/faq"
                  className={`hover:text-gray-600 transition-colors ${
                    isActivePage("/faq") ? "text-blue-600" : ""
                  }`}
                >
                  FAQ
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {isAuthenticated ? (
                // Shop Owner Mobile Navigation
                <>
                  <Link
                    to="/dashboard"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/stores/create"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Store
                  </Link>
                  <Link
                    to="/admin"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </>
              ) : (
                // Customer Mobile Navigation
                <>
                  <Link
                    to="/shop"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    to="/orders"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/about"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/blog"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/contact"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/faq"
                    className="hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCart}
                  className="relative"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {state.itemCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.itemCount}
                    </span>
                  )}
                </Button>

                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Shopping Cart Component */}
      <CartComponent />
    </header>
  );
}
