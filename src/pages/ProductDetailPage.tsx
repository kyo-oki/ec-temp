import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { siteConfig } from "../config/site";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "../styles/swiper.css";

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: "1",
    category: "Soccer",
    name: "Professional Soccer Ball",
    description:
      "Premium match quality ball with superior grip and durability for all playing conditions. Made with high-quality materials and designed for professional use.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1663683181863-7bd34db211d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1663683181863-7bd34db211d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue"],
    features: [
      "Premium leather construction",
      "FIFA approved for match play",
      "Superior grip and control",
      "Durable and long-lasting",
      "Suitable for all weather conditions",
    ],
    specifications: {
      Material: "Premium Leather",
      Weight: "410-450g",
      Circumference: "68-70cm",
      Pressure: "0.6-1.1 bar",
      "FIFA Approved": "Yes",
    },
  },
  // Add more mock products as needed
];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/order");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image Swiper */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, Thumbs]}
                spaceBetween={10}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                thumbs={{ swiper: thumbsSwiper }}
                className="h-full product-gallery-swiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnail Swiper */}
            <div className="h-20">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={4}
                watchSlidesProgress={true}
                className="h-full thumbnail-swiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square bg-white rounded overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-600 transition-colors">
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="text-sm text-blue-600 mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-blue-600 mb-6">
                {siteConfig.currency.symbol}
                {product.price.toFixed(2)}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Color
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1"
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>

            {/* Action Icons */}
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2" />
                Free shipping on orders over {siteConfig.currency.symbol}
                {siteConfig.shipping.freeShippingThreshold}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Easy returns and exchanges
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Specifications
          </h2>
          <div className="bg-white rounded-lg p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <dt className="font-medium text-gray-900">{key}</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
