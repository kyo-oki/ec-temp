import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Percent,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { GET_PROMOTIONS } from "../../lib/graphql/queries";
import { DELETE_PROMOTION } from "../../lib/graphql/mutations";
import {
  Promotion,
  PromotionFilterInput,
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

export function PromotionListPage() {
  const [filters, setFilters] = useState<PromotionFilterInput>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    page: 1,
    pageSize: 20,
  });
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const { data, loading, error, refetch } = useQuery<{
    promotions: {
      items: Promotion[];
      total: number;
      page: number;
      pageSize: number;
    };
  }>(GET_PROMOTIONS, {
    variables: {
      filter: filters,
      pagination,
      sortBy,
      sortOrder,
    },
  });

  const [deletePromotion] = useMutation(DELETE_PROMOTION, {
    onCompleted: () => {
      toast.success("Promotion deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete promotion", { description: error.message });
    },
  });

  const promotions = data?.promotions?.items || [];
  const total = data?.promotions?.total || 0;

  const filterConfigs: FilterConfig[] = [
    {
      id: "search",
      label: "Search",
      type: "search",
      placeholder: "Search promotions...",
    },
    {
      id: "isActive",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
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

  const handleDeletePromotion = async (promotionId: string) => {
    const confirmed = await confirm({
      title: "Delete Promotion",
      description:
        "Are you sure you want to delete this promotion? This action cannot be undone.",
      variant: "destructive",
      confirmLabel: "Delete",
    });

    if (confirmed) {
      deletePromotion({ variables: { id: promotionId } });
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    switch (action) {
      case "activate":
        // In a real app, you'd have a bulk update mutation
        toast.info("Bulk activate functionality coming soon");
        break;
      case "deactivate":
        // In a real app, you'd have a bulk update mutation
        toast.info("Bulk deactivate functionality coming soon");
        break;
      case "delete":
        const confirmed = await confirm({
          title: "Delete Promotions",
          description: `Are you sure you want to delete ${selectedIds.length} promotions? This action cannot be undone.`,
          variant: "destructive",
          confirmLabel: "Delete",
        });
        if (confirmed) {
          // Delete promotions one by one (in a real app, you'd have a bulk delete mutation)
          for (const id of selectedIds) {
            await deletePromotion({ variables: { id } });
          }
        }
        break;
    }
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (now < startDate) {
      return <Badge variant="outline">Scheduled</Badge>;
    }

    if (now > endDate) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return <Badge variant="default">Active</Badge>;
  };

  const getStatusIcon = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <XCircle className="w-4 h-4 text-gray-400" />;
    }

    if (now < startDate) {
      return <Calendar className="w-4 h-4 text-blue-400" />;
    }

    if (now > endDate) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }

    return <CheckCircle className="w-4 h-4 text-green-400" />;
  };

  const bulkActions: BulkAction[] = [
    {
      label: "Activate",
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (ids) => handleBulkAction("activate", ids),
    },
    {
      label: "Deactivate",
      icon: <XCircle className="w-4 h-4" />,
      onClick: (ids) => handleBulkAction("deactivate", ids),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
      onClick: (ids) => handleBulkAction("delete", ids),
    },
  ];

  const columns: ColumnDef<Promotion>[] = [
    {
      id: "title",
      header: "Title",
      accessor: "title",
      sortable: true,
      cell: (title: string, promotion: Promotion) => (
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500 line-clamp-1">
            {promotion.description}
          </div>
        </div>
      ),
    },
    {
      id: "discount",
      header: "Discount",
      accessor: "discountPercentage",
      sortable: true,
      cell: (discount: number) => (
        <div className="flex items-center gap-1">
          <Percent className="w-4 h-4 text-green-600" />
          <span className="font-medium text-green-600">{discount}%</span>
        </div>
      ),
    },
    {
      id: "period",
      header: "Period",
      accessor: "startDate",
      cell: (startDate: string, promotion: Promotion) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Date(startDate).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            to {new Date(promotion.endDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: "isActive",
      sortable: true,
      cell: (isActive: boolean, promotion: Promotion) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(promotion)}
          {getStatusBadge(promotion)}
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600">
            Manage discount promotions and special offers
          </p>
        </div>
        <Link to="/admin/promotions/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
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
        data={promotions}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={(promotion) => {
          // Navigate to promotion detail or edit page
          window.location.href = `/admin/promotions/${promotion.id}/edit`;
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
          selectedRows: selectedPromotions,
          onSelectionChange: setSelectedPromotions,
        }}
        bulkActions={bulkActions}
        emptyMessage="No promotions found. Create your first promotion to get started."
        emptyIcon={<Percent className="w-12 h-12 text-gray-400" />}
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
