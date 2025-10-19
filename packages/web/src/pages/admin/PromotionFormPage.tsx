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
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import {
  Save,
  ArrowLeft,
  Loader2,
  Percent,
  Calendar,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { GET_PROMOTION } from "../../lib/graphql/queries";
import {
  CREATE_PROMOTION,
  UPDATE_PROMOTION,
} from "../../lib/graphql/mutations";
import {
  Promotion,
  CreatePromotionInput,
  UpdatePromotionInput,
} from "../../lib/graphql/types";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const promotionSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters"),
    discountPercentage: z
      .number()
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type PromotionFormData = z.infer<typeof promotionSchema>;

export function PromotionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      description: "",
      discountPercentage: 10,
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  const {
    data: promotionData,
    loading: promotionLoading,
    error: promotionError,
  } = useQuery<{ promotion: Promotion }>(GET_PROMOTION, {
    variables: { id: id! },
    skip: !isEdit,
  });

  const [createPromotion, { loading: createLoading }] = useMutation(
    CREATE_PROMOTION,
    {
      onCompleted: (data) => {
        toast.success("Promotion created successfully");
        navigate(`/admin/promotions/${data.createPromotion.id}/edit`);
      },
      onError: (error) => {
        toast.error("Failed to create promotion", {
          description: error.message,
        });
      },
    }
  );

  const [updatePromotion, { loading: updateLoading }] = useMutation(
    UPDATE_PROMOTION,
    {
      onCompleted: () => {
        toast.success("Promotion updated successfully");
        setHasUnsavedChanges(false);
      },
      onError: (error) => {
        toast.error("Failed to update promotion", {
          description: error.message,
        });
      },
    }
  );

  // Load promotion data for edit mode
  useEffect(() => {
    if (promotionData?.promotion) {
      const promotion = promotionData.promotion;
      form.reset({
        title: promotion.title,
        description: promotion.description,
        discountPercentage: promotion.discountPercentage,
        startDate: promotion.startDate.split("T")[0], // Convert to YYYY-MM-DD format
        endDate: promotion.endDate.split("T")[0],
        isActive: promotion.isActive,
      });
    }
  }, [promotionData, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: PromotionFormData) => {
    try {
      if (isEdit) {
        const input: UpdatePromotionInput = {
          title: data.title,
          description: data.description,
          discountPercentage: data.discountPercentage,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          isActive: data.isActive,
        };
        await updatePromotion({ variables: { id: id!, input } });
      } else {
        const input: CreatePromotionInput = {
          title: data.title,
          description: data.description,
          discountPercentage: data.discountPercentage,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          isActive: data.isActive,
        };
        await createPromotion({ variables: { input } });
      }
    } catch (error) {
      console.error("Promotion save error:", error);
    }
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
    navigate("/admin/promotions");
  };

  const generatePromoCode = () => {
    const codes = [
      "SAVE20",
      "DISCOUNT15",
      "SPECIAL10",
      "DEAL25",
      "OFFER30",
      "PROMO20",
      "SAVINGS15",
      "DEAL10",
      "SPECIAL25",
      "OFFER20",
    ];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomCode}${randomNumber}`;
  };

  const loading = promotionLoading || createLoading || updateLoading;

  if (isEdit && promotionLoading) {
    return <LoadingState showSpinner message="Loading promotion..." />;
  }

  if (isEdit && promotionError) {
    return (
      <ErrorState
        error={promotionError}
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
            Back to Promotions
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Promotion" : "Create Promotion"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update your promotion"
                : "Create a new discount promotion"}
            </p>
          </div>
        </div>

        <Button onClick={form.handleSubmit(handleSubmit)} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Update Promotion" : "Create Promotion"}
            </>
          )}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Promotion Details
            </CardTitle>
            <CardDescription>
              Basic information about your promotion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter promotion title"
                className="mt-1"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your promotion"
                rows={3}
                className="mt-1"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountPercentage">
                  Discount Percentage *
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="1"
                    max="100"
                    {...form.register("discountPercentage", {
                      valueAsNumber: true,
                    })}
                    placeholder="10"
                    className="pr-8"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Percent className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                {form.formState.errors.discountPercentage && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.discountPercentage.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Promotion Period
            </CardTitle>
            <CardDescription>
              Set when this promotion will be active
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register("startDate")}
                  className="mt-1"
                />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register("endDate")}
                  className="mt-1"
                />
                {form.formState.errors.endDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Promotion Status</CardTitle>
            <CardDescription>
              Control whether this promotion is active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive" className="text-base font-medium">
                  Active Status
                </Label>
                <p className="text-sm text-gray-500">
                  {form.watch("isActive")
                    ? "Promotion is active and can be used by customers"
                    : "Promotion is inactive and cannot be used"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked) =>
                  form.setValue("isActive", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Promotion Preview
            </CardTitle>
            <CardDescription>
              How this promotion will appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-dashed border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {form.watch("title") || "Your promotion title"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {form.watch("description") || "Your promotion description"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      {form.watch("discountPercentage") || 0}% OFF
                    </Badge>
                    <Badge variant="outline">
                      {form.watch("startDate") && form.watch("endDate")
                        ? `${new Date(form.watch("startDate")).toLocaleDateString()} - ${new Date(form.watch("endDate")).toLocaleDateString()}`
                        : "Set date range"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {form.watch("discountPercentage") || 0}%
                  </div>
                  <div className="text-sm text-gray-500">discount</div>
                </div>
              </div>
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
