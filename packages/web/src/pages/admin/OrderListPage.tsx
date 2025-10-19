import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ShoppingCart, Download } from "lucide-react";
import { GET_ORDERS } from "../../lib/graphql/queries";
import {
  Order,
  OrderFilterInput,
  PaginationInput,
  OrderStatus,
} from "../../lib/graphql/types";
import { DataTable, ColumnDef } from "../../components/admin/DataTable";
import { FilterBar, FilterConfig } from "../../components/admin/FilterBar";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";

const orderStatusOptions = [
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Processing", value: OrderStatus.PROCESSING },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

export function OrderListPage() {
  const [filters, setFilters] = useState<OrderFilterInput>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    page: 1,
    pageSize: 20,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery<{
    orders: { items: Order[]; total: number; page: number; pageSize: number };
  }>(GET_ORDERS, {
    variables: {
      filter: filters,
      pagination,
      sortBy,
      sortOrder,
    },
  });

  const orders = data?.orders?.items || [];
  const total = data?.orders?.total || 0;

  const filterConfigs: FilterConfig[] = [
    {
      id: "search",
      label: "Search",
      type: "search",
      placeholder: "Search orders, customers...",
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: orderStatusOptions,
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

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    toast.info("Export functionality coming soon");
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: {
        variant: "secondary" as const,
        label: "Pending",
      },
      [OrderStatus.PROCESSING]: {
        variant: "default" as const,
        label: "Processing",
      },
      [OrderStatus.SHIPPED]: { variant: "default" as const, label: "Shipped" },
      [OrderStatus.DELIVERED]: {
        variant: "default" as const,
        label: "Delivered",
      },
      [OrderStatus.CANCELLED]: {
        variant: "destructive" as const,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: ColumnDef<Order>[] = [
    {
      id: "orderNumber",
      header: "Order #",
      accessor: "orderNumber",
      sortable: true,
      cell: (orderNumber: string, order: Order) => (
        <div>
          <div className="font-medium text-gray-900">#{orderNumber}</div>
          <div className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      accessor: "customerName",
      sortable: true,
      cell: (customerName: string, order: Order) => (
        <div>
          <div className="font-medium text-gray-900">{customerName}</div>
          <div className="text-sm text-gray-500">{order.customerEmail}</div>
        </div>
      ),
    },
    {
      id: "items",
      header: "Items",
      accessor: "items",
      cell: (items: any[]) => (
        <div className="text-sm">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      id: "total",
      header: "Total",
      accessor: "totalAmount",
      sortable: true,
      cell: (total: number) => (
        <div className="font-medium text-green-600">${total.toFixed(2)}</div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      sortable: true,
      cell: (status: OrderStatus) => getStatusBadge(status),
    },
    {
      id: "createdAt",
      header: "Order Date",
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Manage customer orders and track fulfillment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
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
        data={orders}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={(order) => {
          // Navigate to order detail page
          window.location.href = `/admin/orders/${order.id}`;
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
        emptyMessage="No orders found. Orders will appear here when customers make purchases."
        emptyIcon={<ShoppingCart className="w-12 h-12 text-gray-400" />}
      />
    </div>
  );
}
