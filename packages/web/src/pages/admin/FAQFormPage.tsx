import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { GET_FAQ } from "../../lib/graphql/queries";
import { CREATE_FAQ, UPDATE_FAQ } from "../../lib/graphql/mutations";
import { Faq, CreateFaqInput, UpdateFaqInput } from "../../lib/graphql/types";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const faqSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .max(200, "Question must be less than 200 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  displayOrder: z
    .number()
    .min(1, "Display order must be at least 1")
    .optional(),
});

type FAQFormData = z.infer<typeof faqSchema>;

export function FAQFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      displayOrder: 1,
    },
  });

  const {
    data: faqData,
    loading: faqLoading,
    error: faqError,
  } = useQuery<{ faq: Faq }>(GET_FAQ, {
    variables: { id: id! },
    skip: !isEdit,
  });

  const [createFaq, { loading: createLoading }] = useMutation(CREATE_FAQ, {
    onCompleted: (data) => {
      toast.success("FAQ created successfully");
      navigate(`/admin/faq/${data.createFaq.id}/edit`);
    },
    onError: (error) => {
      toast.error("Failed to create FAQ", { description: error.message });
    },
  });

  const [updateFaq, { loading: updateLoading }] = useMutation(UPDATE_FAQ, {
    onCompleted: () => {
      toast.success("FAQ updated successfully");
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      toast.error("Failed to update FAQ", { description: error.message });
    },
  });

  // Load FAQ data for edit mode
  useEffect(() => {
    if (faqData?.faq) {
      const faq = faqData.faq;
      form.reset({
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder || 1,
      });
    }
  }, [faqData, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: FAQFormData) => {
    try {
      if (isEdit) {
        const input: UpdateFaqInput = {
          question: data.question,
          answer: data.answer,
          displayOrder: data.displayOrder,
        };
        await updateFaq({ variables: { id: id!, input } });
      } else {
        const input: CreateFaqInput = {
          question: data.question,
          answer: data.answer,
          displayOrder: data.displayOrder,
        };
        await createFaq({ variables: { input } });
      }
    } catch (error) {
      console.error("FAQ save error:", error);
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
    navigate("/admin/faq");
  };

  const loading = faqLoading || createLoading || updateLoading;

  if (isEdit && faqLoading) {
    return <LoadingState showSpinner message="Loading FAQ..." />;
  }

  if (isEdit && faqError) {
    return (
      <ErrorState error={faqError} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to FAQs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit FAQ" : "Create FAQ"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update your FAQ"
                : "Add a new frequently asked question"}
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
              {isEdit ? "Update FAQ" : "Create FAQ"}
            </>
          )}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* FAQ Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              FAQ Content
            </CardTitle>
            <CardDescription>
              Enter the question and answer for this FAQ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                {...form.register("question")}
                placeholder="What is your frequently asked question?"
                className="mt-1"
              />
              {form.formState.errors.question && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.question.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="answer">Answer *</Label>
              <div className="mt-1">
                <RichTextEditor
                  value={form.watch("answer")}
                  onChange={(content) => form.setValue("answer", content)}
                  placeholder="Provide a detailed answer to the question..."
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
              </div>
              {form.formState.errors.answer && (
                <p className="text-sm text-red-600 mt-2">
                  {form.formState.errors.answer.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="1"
                  {...form.register("displayOrder", { valueAsNumber: true })}
                  placeholder="1"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Leave empty for auto-assignment.
                </p>
                {form.formState.errors.displayOrder && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.displayOrder.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How this FAQ will appear to users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {form.watch("question") ||
                        "Your question will appear here..."}
                    </h3>
                  </div>
                </div>

                {form.watch("answer") && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600">
                        A
                      </span>
                    </div>
                    <div
                      className="flex-1 text-sm text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          form.watch("answer") ||
                          "Your answer will appear here...",
                      }}
                    />
                  </div>
                )}
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
