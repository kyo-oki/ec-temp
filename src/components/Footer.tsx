import { Link } from 'react-router-dom';
import { LogoWithText } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <div className="text-white">
                <LogoWithText />
              </div>
            </div>
            <p className="text-sm">
              Your trusted source for premium sports equipment and gear.
            </p>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop?category=soccer" className="hover:text-white transition-colors">
                  Soccer
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cricket" className="hover:text-white transition-colors">
                  Cricket
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tennis" className="hover:text-white transition-colors">
                  Tennis
                </Link>
              </li>
              <li>
                <Link to="/shop?category=swimming" className="hover:text-white transition-colors">
                  Swimming
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog & Resources
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2025 ProGear Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
