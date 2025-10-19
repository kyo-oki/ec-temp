import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Plus, FileText, Trash2, EyeOff, CheckCircle } from "lucide-react";
import { GET_ALL_BLOG_POSTS } from "../../lib/graphql/queries";
import { DELETE_BLOG_POST } from "../../lib/graphql/mutations";
import {
  BlogPost,
  BlogFilterInput,
  PaginationInput,
} from "../../lib/graphql/types";
import {
  DataTable,
  ColumnDef,
  BulkAction,
} from "../../components/admin/DataTable";
import { FilterBar, FilterConfig } from "../../components/admin/FilterBar";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const blogCategories = [
  "Sports",
  "Equipment",
  "Training",
  "Health",
  "News",
  "Reviews",
  "Tips",
];

export function BlogListPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [filters, setFilters] = useState<BlogFilterInput>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    page: 1,
    pageSize: 20,
  });
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const { data, loading, error, refetch } = useQuery<{
    blogPosts: {
      items: BlogPost[];
      total: number;
      page: number;
      pageSize: number;
    };
  }>(GET_ALL_BLOG_POSTS, {
    variables: {
      filter: filters,
      pagination,
      sortBy,
      sortOrder,
    },
  });

  const [deleteBlogPost] = useMutation(DELETE_BLOG_POST, {
    onCompleted: () => {
      toast.success("Blog post deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete blog post", { description: error.message });
    },
  });

  const blogPosts = data?.blogPosts?.items || [];
  const total = data?.blogPosts?.total || 0;

  const filterConfigs: FilterConfig[] = [
    {
      id: "search",
      label: "Search",
      type: "search",
      placeholder: "Search blog posts...",
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      options: blogCategories.map((cat) => ({ label: cat, value: cat })),
    },
    {
      id: "isPublished",
      label: "Status",
      type: "select",
      options: [
        { label: "Published", value: "true" },
        { label: "Draft", value: "false" },
      ],
    },
    {
      id: "dateRange",
      label: "Date Range",
      type: "date-range",
    },
  ];

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = await confirm({
      title: "Delete Blog Post",
      description:
        "Are you sure you want to delete this blog post? This action cannot be undone.",
      variant: "destructive",
      confirmLabel: "Delete",
    });

    if (confirmed) {
      deleteBlogPost({ variables: { id: postId } });
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    switch (action) {
      case "publish":
        // In a real app, you'd have a bulk update mutation
        toast.info("Bulk publish functionality coming soon");
        break;
      case "unpublish":
        // In a real app, you'd have a bulk update mutation
        toast.info("Bulk unpublish functionality coming soon");
        break;
      case "delete":
        const confirmed = await confirm({
          title: "Delete Blog Posts",
          description: `Are you sure you want to delete ${selectedIds.length} blog posts? This action cannot be undone.`,
          variant: "destructive",
          confirmLabel: "Delete",
        });
        if (confirmed) {
          // Delete posts one by one (in a real app, you'd have a bulk delete mutation)
          for (const id of selectedIds) {
            await deleteBlogPost({ variables: { id } });
          }
        }
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      label: "Publish",
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (ids) => handleBulkAction("publish", ids),
    },
    {
      label: "Unpublish",
      icon: <EyeOff className="w-4 h-4" />,
      onClick: (ids) => handleBulkAction("unpublish", ids),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
      onClick: (ids) => handleBulkAction("delete", ids),
    },
  ];

  const columns: ColumnDef<BlogPost>[] = [
    {
      id: "thumbnail",
      header: "Thumbnail",
      accessor: "thumbnailUrl",
      width: "80px",
      cell: (thumbnailUrl: string) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Blog thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "title",
      header: "Title",
      accessor: "title",
      sortable: true,
      cell: (title: string, post: BlogPost) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2">{title}</div>
          <div className="text-sm text-gray-500 mt-1 line-clamp-1">
            {post.description}
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessor: "category",
      sortable: true,
      cell: (category: string) => <Badge variant="outline">{category}</Badge>,
    },
    {
      id: "status",
      header: "Status",
      accessor: "isPublished",
      sortable: true,
      cell: (isPublished: boolean) => (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      accessor: "createdAt",
      sortable: true,
      cell: (date: string) => (
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "updatedAt",
      header: "Updated",
      accessor: "updatedAt",
      sortable: true,
      cell: (date: string) => (
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState rows={5} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog content and articles</p>
        </div>
        <Link to={`/stores/${storeId}/admin/blog/create`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        values={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters({})}
      />

      {/* Data Table */}
      <DataTable
        data={blogPosts}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={(post) => {
          // Navigate to blog post detail or edit page
          window.location.href = `/stores/${storeId}/admin/blog/${post.id}/edit`;
        }}
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: total,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSortChange: handleSortChange,
        }}
        selection={{
          selectedRows: selectedPosts,
          onSelectionChange: setSelectedPosts,
        }}
        bulkActions={bulkActions}
        emptyMessage="No blog posts found. Create your first blog post to get started."
        emptyIcon={<FileText className="w-12 h-12 text-gray-400" />}
      />

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
