import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Save,
  ArrowLeft,
  Loader2,
  Eye,
  Image as ImageIcon,
  AlertCircle,
  FileText,
} from "lucide-react";
import { GET_ABOUT } from "../../lib/graphql/queries";
import { UPDATE_ABOUT } from "../../lib/graphql/mutations";
import { About } from "../../lib/graphql/types";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { ImageUpload } from "../../components/admin/ImageUpload";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const aboutSchema = z.object({
  philosophy: z.string().min(10, "Philosophy must be at least 10 characters"),
  vision: z.string().min(10, "Vision must be at least 10 characters"),
  offerings: z.string().min(10, "Offerings must be at least 10 characters"),
  heroImageUrl: z.string().optional(),
  metaTitle: z
    .string()
    .max(60, "Meta title must be less than 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be less than 160 characters")
    .optional(),
});

type AboutFormData = z.infer<typeof aboutSchema>;

export function AboutEditPage() {
  const navigate = useNavigate();

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      philosophy: "",
      vision: "",
      offerings: "",
      heroImageUrl: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const {
    data: aboutData,
    loading: aboutLoading,
    error: aboutError,
  } = useQuery<{ about: About }>(GET_ABOUT);

  const [updateAbout, { loading: updateLoading }] = useMutation(UPDATE_ABOUT, {
    onCompleted: () => {
      toast.success("About page updated successfully");
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      toast.error("Failed to update about page", {
        description: error.message,
      });
    },
  });

  // Load about data
  useEffect(() => {
    if (aboutData?.about) {
      const about = aboutData.about;
      form.reset({
        philosophy: about.philosophy || "",
        vision: about.vision || "",
        offerings: about.offerings || "",
        heroImageUrl: about.heroImageUrl || "",
        metaTitle: about.metaTitle || "",
        metaDescription: about.metaDescription || "",
      });
    }
  }, [aboutData, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: AboutFormData) => {
    try {
      await updateAbout({
        variables: {
          input: {
            philosophy: data.philosophy,
            vision: data.vision,
            offerings: data.offerings,
            heroImageUrl: data.heroImageUrl,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
          },
        },
      });
    } catch (error) {
      console.error("About page save error:", error);
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
    navigate("/admin");
  };

  const loading = aboutLoading || updateLoading;

  if (aboutLoading) {
    return <LoadingState showSpinner message="Loading about page..." />;
  }

  if (aboutError) {
    return (
      <ErrorState error={aboutError} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Page</h1>
            <p className="text-gray-600">
              Edit your company's about page content
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Hero Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Hero Image
            </CardTitle>
            <CardDescription>
              Upload a hero image for your about page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={form.watch("heroImageUrl") || ""}
              onChange={(url) => form.setValue("heroImageUrl", url as string)}
              multiple={false}
              maxFiles={1}
              maxSize={5}
              preview={true}
            />
          </CardContent>
        </Card>

        {/* Company Philosophy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Company Philosophy
            </CardTitle>
            <CardDescription>
              Describe your company's core philosophy and values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={form.watch("philosophy")}
              onChange={(content) => form.setValue("philosophy", content)}
              placeholder="Write about your company's philosophy..."
              minHeight="200px"
              maxHeight="400px"
              features={{
                headings: true,
                bold: true,
                italic: true,
                underline: true,
                lists: true,
                links: true,
                code: true,
              }}
            />
            {form.formState.errors.philosophy && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.philosophy.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Company Vision */}
        <Card>
          <CardHeader>
            <CardTitle>Company Vision</CardTitle>
            <CardDescription>
              Share your company's vision and future goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={form.watch("vision")}
              onChange={(content) => form.setValue("vision", content)}
              placeholder="Write about your company's vision..."
              minHeight="200px"
              maxHeight="400px"
              features={{
                headings: true,
                bold: true,
                italic: true,
                underline: true,
                lists: true,
                links: true,
                code: true,
              }}
            />
            {form.formState.errors.vision && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.vision.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* What We Offer */}
        <Card>
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
            <CardDescription>
              Describe your products, services, and offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={form.watch("offerings")}
              onChange={(content) => form.setValue("offerings", content)}
              placeholder="Write about your products and services..."
              minHeight="200px"
              maxHeight="400px"
              features={{
                headings: true,
                bold: true,
                italic: true,
                underline: true,
                lists: true,
                links: true,
                code: true,
              }}
            />
            {form.formState.errors.offerings && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.offerings.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize your about page for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                {...form.register("metaTitle")}
                placeholder="Enter meta title for SEO"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.watch("metaTitle")?.length || 0}/60 characters
              </p>
              {form.formState.errors.metaTitle && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.metaTitle.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...form.register("metaDescription")}
                placeholder="Enter meta description for SEO"
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.watch("metaDescription")?.length || 0}/160 characters
              </p>
              {form.formState.errors.metaDescription && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.metaDescription.message}
                </p>
              )}
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
