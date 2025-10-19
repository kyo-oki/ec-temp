import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  HelpCircle,
  Edit,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GET_FAQS } from "../../lib/graphql/queries";
import { DELETE_FAQ, UPDATE_FAQ } from "../../lib/graphql/mutations";
import { FAQ as Faq } from "../../lib/graphql/types";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const ItemType = "FAQ_ITEM";

interface DraggableFAQItemProps {
  faq: Faq;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

function DraggableFAQItem({
  faq,
  index,
  onMove,
  onDelete,
  onEdit,
}: DraggableFAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { confirm } = useConfirm();

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete FAQ",
      description:
        "Are you sure you want to delete this FAQ? This action cannot be undone.",
      variant: "destructive",
      confirmLabel: "Delete",
    });

    if (confirmed) {
      onDelete(faq.id);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 transition-all duration-200 ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="flex-shrink-0 mt-1 cursor-move text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* FAQ Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                #{faq.displayOrder || index + 1}
              </Badge>
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {faq.question}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(faq.id)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Answer */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div
                className="text-sm text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FAQListPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const { data, loading, error, refetch } = useQuery<{ faqs: Faq[] }>(GET_FAQS);

  const [deleteFaq] = useMutation(DELETE_FAQ, {
    onCompleted: () => {
      toast.success("FAQ deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete FAQ", { description: error.message });
    },
  });

  const [updateFaq] = useMutation(UPDATE_FAQ, {
    onError: (error) => {
      toast.error("Failed to update FAQ order", { description: error.message });
    },
  });

  // Update local state when data changes
  useState(() => {
    if (data?.faqs) {
      setFaqs(data.faqs);
    }
  }, [data?.faqs]);

  const moveFAQ = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      setFaqs((prevFaqs) => {
        const newFaqs = [...prevFaqs];
        const draggedFaq = newFaqs[dragIndex];

        // Remove the dragged item
        newFaqs.splice(dragIndex, 1);
        // Insert it at the new position
        newFaqs.splice(hoverIndex, 0, draggedFaq);

        // Update displayOrder for all items
        const updatedFaqs = newFaqs.map((faq, index) => ({
          ...faq,
          displayOrder: index + 1,
        }));

        return updatedFaqs;
      });

      // Update the display order in the backend
      try {
        const newFaqs = [...faqs];
        const draggedFaq = newFaqs[dragIndex];
        newFaqs.splice(dragIndex, 1);
        newFaqs.splice(hoverIndex, 0, draggedFaq);

        // Update each FAQ's display order
        for (let i = 0; i < newFaqs.length; i++) {
          if (newFaqs[i].displayOrder !== i + 1) {
            await updateFaq({
              variables: {
                id: newFaqs[i].id,
                input: { displayOrder: i + 1 },
              },
            });
          }
        }
      } catch (error) {
        console.error("Error updating FAQ order:", error);
        // Revert local state on error
        refetch();
      }
    },
    [faqs, updateFaq, refetch]
  );

  const handleDeleteFAQ = (faqId: string) => {
    deleteFaq({ variables: { id: faqId } });
  };

  const handleEditFAQ = (faqId: string) => {
    // Navigate to edit page
    window.location.href = `/admin/faq/${faqId}/edit`;
  };

  if (loading) {
    return <LoadingState rows={5} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
            <p className="text-gray-600">
              Manage frequently asked questions and their order
            </p>
          </div>
          <Link to="/admin/faq/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </Link>
        </div>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Drag & Drop to Reorder
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Drag the grip handle to reorder FAQs. The order will be
              automatically saved.
            </p>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first FAQ.
                </p>
                <Link to="/admin/faq/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <DraggableFAQItem
                  key={faq.id}
                  faq={faq}
                  index={index}
                  onMove={moveFAQ}
                  onDelete={handleDeleteFAQ}
                  onEdit={handleEditFAQ}
                />
              ))}
            </div>
          )}
        </div>

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
    </DndProvider>
  );
}
