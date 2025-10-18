import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface StoreFormData {
  name: string;
  slug: string;
  subdomain: string;
  description: string;
}

export function CreateStorePage() {
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    slug: "",
    subdomain: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!slugAvailable) {
      setError("Please choose an available slug");
      return;
    }

    if (!subdomainAvailable) {
      setError("Please choose an available subdomain");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement store creation with GraphQL
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to store settings
      navigate("/stores/1/settings");
    } catch (err) {
      setError("Failed to create store. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check availability for slug and subdomain
    if (name === "slug") {
      // TODO: Implement slug availability check with GraphQL
      setSlugAvailable(value.length > 0 ? Math.random() > 0.5 : null);
    }
    
    if (name === "subdomain") {
      // TODO: Implement subdomain availability check with GraphQL
      setSubdomainAvailable(value.length > 0 ? Math.random() > 0.5 : null);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, slug }));
    setSlugAvailable(slug.length > 0 ? Math.random() > 0.5 : null);
  };

  const generateSubdomain = () => {
    const subdomain = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .substring(0, 20);
    setFormData(prev => ({ ...prev, subdomain }));
    setSubdomainAvailable(subdomain.length > 0 ? Math.random() > 0.5 : null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Store</h1>
          <p className="mt-2 text-gray-600">
            Set up your new e-commerce store
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Choose a name and URL for your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                />
              </div>

              <div>
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your store and what you sell"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="slug">Store Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="my-store"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
                {slugAvailable !== null && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {slugAvailable ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Slug is available</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Slug is not available</span>
                      </>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  This will be your store's URL: yourstore.com/{formData.slug || "my-store"}
                </p>
              </div>

              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex gap-2">
                  <Input
                    id="subdomain"
                    name="subdomain"
                    type="text"
                    required
                    value={formData.subdomain}
                    onChange={handleChange}
                    placeholder="mystore"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={generateSubdomain}>
                    Generate
                  </Button>
                </div>
                {subdomainAvailable !== null && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {subdomainAvailable ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Subdomain is available</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Subdomain is not available</span>
                      </>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  This will be your store's subdomain: {formData.subdomain || "mystore"}.localhost:3000
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !slugAvailable || !subdomainAvailable}
                  className="flex-1"
                >
                  {isLoading ? "Creating Store..." : "Create Store"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
