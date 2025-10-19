import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { GET_ORDER } from "../../lib/graphql/queries";
import { UPDATE_ORDER } from "../../lib/graphql/mutations";
import { Order, OrderStatus } from "../../lib/graphql/types";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const statusConfig = {
  [OrderStatus.PENDING]: {
    variant: "secondary" as const,
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
  },
  [OrderStatus.PROCESSING]: {
    variant: "default" as const,
    label: "Processing",
    icon: Package,
    color: "text-blue-600",
  },
  [OrderStatus.SHIPPED]: {
    variant: "default" as const,
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600",
  },
  [OrderStatus.DELIVERED]: {
    variant: "default" as const,
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
  },
  [OrderStatus.CANCELLED]: {
    variant: "destructive" as const,
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
  },
};

const statusOptions = [
  { value: OrderStatus.PENDING, label: "Pending" },
  { value: OrderStatus.PROCESSING, label: "Processing" },
  { value: OrderStatus.SHIPPED, label: "Shipped" },
  { value: OrderStatus.DELIVERED, label: "Delivered" },
  { value: OrderStatus.CANCELLED, label: "Cancelled" },
];

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const { data, loading, error, refetch } = useQuery<{ order: Order }>(
    GET_ORDER,
    {
      variables: { id: id! },
      skip: !id,
    }
  );

  const [updateOrder, { loading: updateLoading }] = useMutation(UPDATE_ORDER, {
    onCompleted: () => {
      toast.success("Order status updated successfully");
      setSelectedStatus(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update order status", {
        description: error.message,
      });
    },
  });

  const order = data?.order;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    const confirmed = await confirm({
      title: "Update Order Status",
      description: `Are you sure you want to change this order status to "${statusConfig[newStatus].label}"?`,
      confirmLabel: "Update Status",
    });

    if (confirmed) {
      updateOrder({
        variables: {
          id: order.id,
          input: { status: newStatus },
        },
      });
    }
  };

  const handlePrintInvoice = () => {
    // In a real app, this would generate and print an invoice
    toast.info("Print invoice functionality coming soon");
  };

  const handleSendNotification = () => {
    // In a real app, this would send an email notification to the customer
    toast.info("Send notification functionality coming soon");
  };

  if (loading) {
    return <LoadingState showSpinner message="Loading order details..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!order) {
    return (
      <ErrorState
        error="Order not found"
        onRetry={() => navigate("/admin/orders")}
      />
    );
  }

  const currentStatusConfig = statusConfig[order.status];
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintInvoice}>
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <Button variant="outline" onClick={handleSendNotification}>
            <Mail className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon
                  className={`w-5 h-5 ${currentStatusConfig.color}`}
                />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={currentStatusConfig.variant}>
                    {currentStatusConfig.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        order.status === option.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusChange(option.value)}
                      disabled={updateLoading || order.status === option.value}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.productName}
                      </h4>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.customerName}
                </p>
                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-sm text-gray-500">{order.customerPhone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium text-gray-900">
                  {order.deliveryAddress}
                </p>
                <p className="text-gray-500">
                  {order.city}, {order.stateRegion} {order.postcode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order Placed
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.status !== OrderStatus.PENDING && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Status Updated
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
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
  );
}
