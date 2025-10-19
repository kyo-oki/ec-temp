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
  Eye,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { GET_BLOG_POST } from "../../lib/graphql/queries";
import {
  CREATE_BLOG_POST,
  UPDATE_BLOG_POST,
} from "../../lib/graphql/mutations";
import {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "../../lib/graphql/types";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { ImageUpload } from "../../components/admin/ImageUpload";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const blogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  thumbnailUrl: z.string().optional(),
  isPublished: z.boolean(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const blogCategories = [
  "Sports",
  "Equipment",
  "Training",
  "Health",
  "News",
  "Reviews",
  "Tips",
];

export function BlogFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: "",
      thumbnailUrl: "",
      isPublished: false,
    },
  });

  const {
    data: blogData,
    loading: blogLoading,
    error: blogError,
  } = useQuery<{ blogPost: BlogPost }>(GET_BLOG_POST, {
    variables: { id: id! },
    skip: !isEdit,
  });

  const [createBlogPost, { loading: createLoading }] = useMutation(
    CREATE_BLOG_POST,
    {
      onCompleted: (data) => {
        toast.success("Blog post created successfully");
        navigate(`/admin/blog/${data.createBlogPost.id}/edit`);
      },
      onError: (error) => {
        toast.error("Failed to create blog post", {
          description: error.message,
        });
      },
    }
  );

  const [updateBlogPost, { loading: updateLoading }] = useMutation(
    UPDATE_BLOG_POST,
    {
      onCompleted: () => {
        toast.success("Blog post updated successfully");
        setHasUnsavedChanges(false);
      },
      onError: (error) => {
        toast.error("Failed to update blog post", {
          description: error.message,
        });
      },
    }
  );

  // Load blog post data for edit mode
  useEffect(() => {
    if (blogData?.blogPost) {
      const post = blogData.blogPost;
      form.reset({
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category,
        thumbnailUrl: post.thumbnailUrl || "",
        isPublished: post.isPublished,
      });
    }
  }, [blogData, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      if (isEdit) {
        const input: UpdateBlogPostInput = {
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category,
          thumbnailUrl: data.thumbnailUrl,
          isPublished: data.isPublished,
        };
        await updateBlogPost({ variables: { id: id!, input } });
      } else {
        const input: CreateBlogPostInput = {
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category,
          thumbnailUrl: data.thumbnailUrl,
          isPublished: data.isPublished,
        };
        await createBlogPost({ variables: { input } });
      }
    } catch (error) {
      console.error("Blog post save error:", error);
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
    navigate("/admin/blog");
  };

  const loading = blogLoading || createLoading || updateLoading;

  if (isEdit && blogLoading) {
    return <LoadingState showSpinner message="Loading blog post..." />;
  }

  if (isEdit && blogError) {
    return (
      <ErrorState error={blogError} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Blog Post" : "Create Blog Post"}
            </h1>
            <p className="text-gray-600">
              {isEdit ? "Update your blog post" : "Write a new blog post"}
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
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Update Post" : "Create Post"}
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
              Essential details about your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter blog post title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  {...form.register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {blogCategories.map((category) => (
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
                {...form.register("description")}
                placeholder="Write a brief description of your blog post"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Image */}
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail Image</CardTitle>
            <CardDescription>
              Add a featured image for your blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={form.watch("thumbnailUrl") || ""}
              onChange={(url) => form.setValue("thumbnailUrl", url as string)}
              multiple={false}
              maxFiles={1}
              maxSize={5}
              preview={true}
            />
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Write your blog post content</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={form.watch("content")}
              onChange={(content) => form.setValue("content", content)}
              placeholder="Start writing your blog post..."
              minHeight="400px"
              maxHeight="600px"
              features={{
                headings: true,
                bold: true,
                italic: true,
                underline: true,
                lists: true,
                links: true,
                images: true,
                code: true,
              }}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.content.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Publication Status</CardTitle>
            <CardDescription>
              Control when your blog post is visible to readers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublished" className="text-base font-medium">
                  Publication Status
                </Label>
                <p className="text-sm text-gray-500">
                  {form.watch("isPublished")
                    ? "Blog post is published and visible to readers"
                    : "Blog post is saved as draft and not visible to readers"}
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={form.watch("isPublished")}
                onCheckedChange={(checked) =>
                  form.setValue("isPublished", checked)
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
