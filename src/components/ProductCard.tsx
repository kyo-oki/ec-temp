import { Link } from "react-router-dom";
import { ImageWithFallback } from "./ImageWithFallback";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface ProductCardProps {
  id: string;
  category: string;
  name: string;
  description: string;
  price?: number;
  image?: string;
}

export function ProductCard({
  id,
  category,
  name,
  description,
  price,
  image,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (price) {
      addItem({
        id,
        name,
        price,
        image,
        category,
      });
    }
  };

  return (
    <div className="group">
      <Link to={`/product/${id}`} className="block">
        <div className="bg-white border rounded-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 overflow-hidden relative">
            <ImageWithFallback
              src={image || ""}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Add to Cart Button Overlay */}
            {price && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="text-sm text-blue-600 mb-1">{category}</div>
            <h3 className="mb-2 line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>
            {price && (
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-semibold">
                  ${price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
