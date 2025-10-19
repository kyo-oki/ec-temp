import { useQuery } from "@apollo/client/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  GET_DASHBOARD_STATS,
  GET_RECENT_ORDERS,
  GET_LOW_STOCK_PRODUCTS,
} from "../lib/graphql/queries";
import {
  DashboardStats,
  RecentOrders,
  LowStockProducts,
} from "../lib/graphql/types";

export function AdminDashboardPage() {
  const { storeId } = useParams<{ storeId: string }>();

  // Fetch dashboard data
  const { data: statsData, loading: statsLoading } = useQuery<DashboardStats>(
    GET_DASHBOARD_STATS,
    {
      skip: !storeId,
    }
  );

  const { data: ordersData, loading: ordersLoading } = useQuery<RecentOrders>(
    GET_RECENT_ORDERS,
    {
      variables: { limit: 5 },
      skip: !storeId,
    }
  );

  const { data: productsData, loading: productsLoading } =
    useQuery<LowStockProducts>(GET_LOW_STOCK_PRODUCTS, {
      variables: { limit: 5 },
      skip: !storeId,
    });

  // Calculate stats from real data
  const products = statsData?.products || [];
  const orders = statsData?.orders || [];
  const recentOrders = ordersData?.orders || [];
  const lowStockProducts =
    productsData?.products?.filter(
      (product: any) => product.stockQuantity < 10
    ) || [];

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
      0
    ),
    totalCustomers: new Set(orders.map((order: any) => order.customerEmail))
      .size,
    recentOrders: recentOrders.length,
    lowStockProducts: lowStockProducts.length,
  };

  const loading = statsLoading || ordersLoading || productsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your customers
                </CardDescription>
              </div>
              <Link to={`/stores/${storeId}/admin/orders`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No recent orders
                </p>
              ) : (
                recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Products</CardTitle>
                <CardDescription>
                  Products running low on inventory
                </CardDescription>
              </div>
              <Link to={`/stores/${storeId}/admin/products`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  All products are well stocked
                </p>
              ) : (
                lowStockProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.stockQuantity === 0
                          ? "Out of stock"
                          : `${product.stockQuantity} left`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stockQuantity === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.stockQuantity === 0
                          ? "Out of Stock"
                          : "Low Stock"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={`/stores/${storeId}/admin/products/create`}>
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link to={`/stores/${storeId}/admin/blog/create`}>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Write Blog Post
              </Button>
            </Link>
            <Link to={`/stores/${storeId}/admin/promotions/create`}>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
