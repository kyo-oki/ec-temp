import { ProductCard } from "../components/ProductCard";
import { ReviewCard } from "../components/ReviewCard";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useQuery } from "@apollo/client/react";
import { GET_ACTIVE_PROMOTIONS } from "../lib/graphql/queries";
import { Promotion } from "../lib/graphql/types";

export function HomePage() {
  // Fetch featured products (first 3 active products)
  const { products: featuredProducts, loading: featuredLoading } = useProducts({
    isActive: true,
    limit: 3,
  });

  // Fetch new arrivals (products sorted by creation date)
  const { products: newArrivals, loading: arrivalsLoading } = useProducts({
    isActive: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 3,
  });

  // Fetch active promotions
  const { data: promotionsData, loading: promotionsLoading } = useQuery<{ activePromotions: Promotion[] }>(GET_ACTIVE_PROMOTIONS);

  // Mock reviews for now (could be replaced with real reviews query)
  const reviews = [
    {
      rating: 5,
      title: "Excellent Quality!",
      text: "The soccer ball I purchased exceeded my expectations. Great grip and durability.",
      reviewerName: "Sarah M.",
      date: "October 12, 2025",
    },
    {
      rating: 4,
      title: "Fast Delivery",
      text: "Order arrived quickly and well-packaged. The tennis racket is perfect for my skill level.",
      reviewerName: "James P.",
      date: "October 10, 2025",
    },
    {
      rating: 5,
      title: "Great Customer Service",
      text: "Had a question about sizing and the team was super helpful. Highly recommend!",
      reviewerName: "Michael R.",
      date: "October 8, 2025",
    },
  ];

  const activePromotion = promotionsData?.activePromotions?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1706736828642-17dec58ed7e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBoZXJvJTIwYXRobGV0ZXxlbnwxfHx8fDE3NjA2MjgzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Sports Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="mb-6">Welcome to ProGear Hub</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your trusted source for premium sports equipment. Quality gear for
            athletes of all levels.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" variant="secondary">
                Shop Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal Sales Banner */}
      {activePromotion && (
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 mb-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-3">{activePromotion.title}</h2>
            <p className="text-lg opacity-90">
              {activePromotion.description}
            </p>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container mx-auto px-4 mb-20">
        <div className="mb-8 text-center">
          <h2 className="mb-2">Featured Products</h2>
          <p className="text-gray-600">
            Our most popular items chosen by athletes
          </p>
        </div>
        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 mb-20">
        <div className="mb-8 text-center">
          <h2 className="mb-2">New Arrivals</h2>
          <p className="text-gray-600">
            Just in - the latest gear for your sport
          </p>
        </div>
        {arrivalsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="container mx-auto px-4 mb-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2">What Our Customers Say</h2>
          <p className="text-gray-600">Real reviews from real athletes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </section>
    </div>
  );
}
