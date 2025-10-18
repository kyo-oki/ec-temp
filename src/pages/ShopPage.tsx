import { useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
// import { useSearchParams } from "react-router-dom";

export function ShopPage() {
  // const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = [
    "Soccer",
    "Cricket",
    "Tennis",
    "Swimming",
    "Apparel",
    "Gear",
    "Accessories",
  ];

  const products = [
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
    {
      id: "7",
      category: "Soccer",
      name: "Soccer Cleats Premium",
      description:
        "High-performance cleats with enhanced traction and comfort for all field conditions",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1663683181863-7bd34db211d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "8",
      category: "Tennis",
      name: "Tennis Ball Can (3 Pack)",
      description:
        "Pressurized tennis balls designed for optimal bounce and longevity",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjByYWNrZXR8ZW58MXx8fHwxNzYwNjIzNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "9",
      category: "Accessories",
      name: "Sports Water Bottle",
      description:
        "Insulated stainless steel bottle keeps drinks cold for 24 hours",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1694437590805-cf944ceb41c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8">Shop All Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-20 shadow-sm">
              <h3 className="mb-6">Filters</h3>

              {/* Category Checkboxes */}
              <div className="mb-8">
                <h4 className="mb-4">Category</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <h4 className="mb-4">Price Range</h4>
                <div className="mb-4">
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
