import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { CREATE_PRODUCT } from "../../lib/graphql/mutations";
import { CreateProductInput } from "../../lib/graphql/types";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  availableSizes: string[];
  availableColors: string[];
  stockQuantity: string;
  isActive: boolean;
}

const categories = [
  "Soccer",
  "Cricket",
  "Tennis",
  "Swimming",
  "Apparel",
  "Gear",
  "Accessories",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
];

export function CreateProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    availableSizes: [],
    availableColors: [],
    stockQuantity: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createProduct, { loading }] = useMutation<{ createProduct: any }>(
    CREATE_PRODUCT
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const input: CreateProductInput = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images,
        availableSizes: formData.availableSizes,
        availableColors: formData.availableColors,
        stockQuantity: parseInt(formData.stockQuantity),
        isActive: formData.isActive,
      };

      const { data } = await createProduct({ variables: { input } });

      if (data?.createProduct) {
        setSuccess("Product created successfully!");
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Product creation error:", err);
      setError(err.message || "Failed to create product. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (
    name: keyof Pick<
      ProductFormData,
      "availableSizes" | "availableColors" | "images"
    >,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
          <p className="text-gray-600">Add a new product to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your product"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Add images to showcase your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={addImageUrl}>
              Add Image URL
            </Button>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Available sizes and colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Available Sizes</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.availableSizes.includes(size)}
                      onCheckedChange={() =>
                        handleArrayChange("availableSizes", size)
                      }
                    />
                    <Label htmlFor={`size-${size}`} className="text-sm">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Available Colors</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={formData.availableColors.includes(color)}
                      onCheckedChange={() =>
                        handleArrayChange("availableColors", color)
                      }
                    />
                    <Label htmlFor={`color-${color}`} className="text-sm">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
            <CardDescription>Control product visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: !!checked }))
                }
              />
              <Label htmlFor="isActive">
                Product is active and visible to customers
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
