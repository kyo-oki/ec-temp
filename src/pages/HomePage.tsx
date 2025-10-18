import { ProductCard } from "../components/ProductCard";
import { ReviewCard } from "../components/ReviewCard";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomePage() {
  const featuredProducts = [
    {
      id: "1",
      category: "Soccer",
      name: "Professional Soccer Ball",
      description:
        "Premium match quality ball with superior grip and durability for all playing conditions",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1663683181863-7bd34db211d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "2",
      category: "Tennis",
      name: "Tennis Racket Pro",
      description:
        "Lightweight carbon fiber racket designed for power and precision in every shot",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjByYWNrZXR8ZW58MXx8fHwxNzYwNjIzNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "3",
      category: "Swimming",
      name: "Competition Goggles",
      description:
        "Anti-fog racing goggles with UV protection and comfortable silicone seal",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1533060629428-48484ce98a74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMGdvZ2dsZXN8ZW58MXx8fHwxNzYwNjI4MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const newArrivals = [
    {
      id: "4",
      category: "Cricket",
      name: "Cricket Bat Elite",
      description:
        "Professional grade willow bat with perfect balance and exceptional stroke play",
      price: 159.99,
      image:
        "https://images.unsplash.com/photo-1646282814550-f521d9b57a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwYmF0fGVufDF8fHx8MTc2MDYyODMzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "5",
      category: "Apparel",
      name: "Performance Jersey",
      description:
        "Moisture-wicking athletic jersey with breathable fabric for maximum comfort",
      price: 44.99,
      image:
        "https://images.unsplash.com/photo-1649520937981-763d6a14de7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBqZXJzZXl8ZW58MXx8fHwxNzYwNjI4MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "6",
      category: "Gear",
      name: "Training Equipment Set",
      description:
        "Complete training kit including cones, agility ladder, and resistance bands",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1676989121400-63ba765d7f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjA2MjgzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

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
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-3">Seasonal Sale - Up to 30% Off!</h2>
          <p className="text-lg opacity-90">
            Limited time offer on selected items. Don't miss out!
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mb-20">
        <div className="mb-8 text-center">
          <h2 className="mb-2">Featured Products</h2>
          <p className="text-gray-600">
            Our most popular items chosen by athletes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 mb-20">
        <div className="mb-8 text-center">
          <h2 className="mb-2">New Arrivals</h2>
          <p className="text-gray-600">
            Just in - the latest gear for your sport
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
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
