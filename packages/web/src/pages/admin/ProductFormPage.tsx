import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Checkbox } from "../../components/ui/checkbox";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import {
  Save,
  ArrowLeft,
  Eye,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";
import { GET_PRODUCT } from "../../lib/graphql/queries";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../lib/graphql/mutations";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../../lib/graphql/types";
import { ImageUpload } from "../../components/admin/ImageUpload";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  price: z
    .number()
    .positive("Price must be positive")
    .max(999999, "Price must be less than $999,999"),
  category: z.string().min(1, "Category is required"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be a non-negative integer"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  availableSizes: z.array(z.string()).optional(),
  availableColors: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

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

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id, storeId } = useParams<{ id: string; storeId: string }>();
  const isEdit = !!id;

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stockQuantity: 0,
      images: [],
      availableSizes: [],
      availableColors: [],
      isActive: true,
    },
    mode: "onChange",
  });

  // Debug form values
  const watchedValues = form.watch();
  console.log("Form watched values:", watchedValues);
  console.log("Form getValues():", form.getValues());
  console.log("Form formState:", form.formState);

  // Ensure form is properly initialized
  useEffect(() => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      category: "",
      stockQuantity: 0,
      images: [],
      availableSizes: [],
      availableColors: [],
      isActive: true,
    });
  }, [form]);

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id: id! },
    skip: !isEdit,
  });

  const [createProduct, { loading: createLoading }] = useMutation<{
    createProduct: { id: string };
  }>(CREATE_PRODUCT, {
    onCompleted: (data) => {
      toast.success("Product created successfully");
      navigate(`/admin/products/${data.createProduct.id}/edit`);
    },
    onError: (error) => {
      toast.error("Failed to create product", { description: error.message });
    },
  });

  const [updateProduct, { loading: updateLoading }] = useMutation(
    UPDATE_PRODUCT,
    {
      onCompleted: () => {
        toast.success("Product updated successfully");
        setHasUnsavedChanges(false);
      },
      onError: (error) => {
        toast.error("Failed to update product", { description: error.message });
      },
    }
  );

  // Load product data for edit mode
  useEffect(() => {
    if (productData?.product) {
      const product = productData.product;
      form.reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
        stockQuantity: product.stockQuantity || 0,
        images: product.images || [],
        availableSizes: product.availableSizes || [],
        availableColors: product.availableColors || [],
        isActive: product.isActive ?? true,
      });
    }
  }, [productData, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: ProductFormData) => {
    console.log("handleSubmit called with data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Form is valid:", form.formState.isValid);
    try {
      // Ensure all required fields have values
      const formData = {
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        category: data.category || "",
        images: data.images || [],
        availableSizes: data.availableSizes || [],
        availableColors: data.availableColors || [],
        stockQuantity: data.stockQuantity || 0,
        isActive: data.isActive ?? true,
      };

      if (isEdit) {
        const input: UpdateProductInput = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          images: formData.images,
          availableSizes: formData.availableSizes,
          availableColors: formData.availableColors,
          stockQuantity: formData.stockQuantity,
          isActive: formData.isActive,
        };
        await updateProduct({ variables: { id: id!, input } });
      } else {
        const input: CreateProductInput = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          images: formData.images,
          availableSizes: formData.availableSizes,
          availableColors: formData.availableColors,
          stockQuantity: formData.stockQuantity,
          isActive: formData.isActive,
        };
        await createProduct({ variables: { input } });
      }
    } catch (error) {
      console.error("Product save error:", error);
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a preview modal or navigate to preview page
    toast.info("Preview functionality coming soon");
  };

  const handleCancel = async () => {
    if (hasUnsavedChanges) {
      const confirmed = await confirm({
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Are you sure you want to leave?",
        variant: "destructive",
        confirmLabel: "Leave",
        cancelLabel: "Stay",
      });
      if (!confirmed) return;
    }
    navigate(`/stores/${storeId}/admin/products`);
  };

  const loading = productLoading || createLoading || updateLoading;

  if (isEdit && productLoading) {
    return <LoadingState showSpinner message="Loading product..." />;
  }

  if (isEdit && productError) {
    return (
      <ErrorState
        error={productError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update product details"
                : "Add a new product to your catalog"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => {
              console.log("Button clicked!");
              console.log("Form state:", {
                isValid: form.formState.isValid,
                errors: form.formState.errors,
                values: form.getValues(),
                isDirty: form.formState.isDirty,
                isSubmitting: form.formState.isSubmitting,
              });
              form.handleSubmit(handleSubmit, (errors) => {
                console.log("Form validation errors:", errors);
              })();
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  {...form.register("name", { required: true })}
                  placeholder="Enter product name"
                  onChange={(e) => {
                    console.log("Name input changed:", e.target.value);
                    form.setValue("name", e.target.value);
                  }}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  {...form.register("category", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    console.log("Category input changed:", e.target.value);
                    form.setValue("category", e.target.value);
                  }}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register("description", { required: true })}
                placeholder="Describe your product"
                rows={4}
                onChange={(e) => {
                  console.log("Description input changed:", e.target.value);
                  form.setValue("description", e.target.value);
                }}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register("price", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  onChange={(e) => {
                    console.log("Price input changed:", e.target.value);
                    form.setValue("price", parseFloat(e.target.value) || 0);
                  }}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  {...form.register("stockQuantity", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  placeholder="0"
                  onChange={(e) => {
                    console.log(
                      "Stock quantity input changed:",
                      e.target.value
                    );
                    form.setValue(
                      "stockQuantity",
                      parseInt(e.target.value) || 0
                    );
                  }}
                />
                {form.formState.errors.stockQuantity && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.stockQuantity.message}
                  </p>
                )}
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
          <CardContent>
            <ImageUpload
              value={form.watch("images")}
              onChange={(images) => form.setValue("images", images as string[])}
              multiple={true}
              maxFiles={10}
              maxSize={5}
              preview={true}
            />
            {form.formState.errors.images && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.images.message}
              </p>
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
                      checked={
                        form.watch("availableSizes")?.includes(size) || false
                      }
                      onCheckedChange={(checked: boolean) => {
                        const currentSizes = form.watch("availableSizes") || [];
                        if (checked) {
                          form.setValue("availableSizes", [
                            ...currentSizes,
                            size,
                          ]);
                        } else {
                          form.setValue(
                            "availableSizes",
                            currentSizes.filter((s) => s !== size)
                          );
                        }
                      }}
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
                      checked={
                        form.watch("availableColors")?.includes(color) || false
                      }
                      onCheckedChange={(checked: boolean) => {
                        const currentColors =
                          form.watch("availableColors") || [];
                        if (checked) {
                          form.setValue("availableColors", [
                            ...currentColors,
                            color,
                          ]);
                        } else {
                          form.setValue(
                            "availableColors",
                            currentColors.filter((c) => c !== color)
                          );
                        }
                      }}
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
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive" className="text-base font-medium">
                  Product Status
                </Label>
                <p className="text-sm text-gray-500">
                  {form.watch("isActive")
                    ? "Product is active and visible to customers"
                    : "Product is inactive and hidden from customers"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked: boolean) =>
                  form.setValue("isActive", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  You have unsaved changes
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </form>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          open={confirmDialog.isOpen}
          onOpenChange={() => {}}
          title={confirmDialog.options.title}
          description={confirmDialog.options.description}
          confirmLabel={confirmDialog.options.confirmLabel}
          cancelLabel={confirmDialog.options.cancelLabel}
          variant={confirmDialog.options.variant}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
}
