import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plus, Store, Settings, ExternalLink } from "lucide-react";
import { Store as StoreType } from "../lib/graphql/types";
import { GET_MY_STORES } from "../lib/graphql/mutations";

export function StoreListPage() {
  const { data, loading, error } = useQuery<{ myStores: StoreType[] }>(
    GET_MY_STORES
  );

  const stores = data?.myStores || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Stores
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Stores</h1>
          <p className="mt-2 text-gray-600">
            Manage your e-commerce stores and settings
          </p>
        </div>

        <div className="mb-6">
          <Link to="/stores/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Store
            </Button>
          </Link>
        </div>

        {stores.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No stores yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first store to start selling online
              </p>
              <Link to="/stores/create">
                <Button>Create Your First Store</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card
                key={store.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {store.subdomain}.localhost:3000
                      </CardDescription>
                    </div>
                    <Badge variant={store.isActive ? "default" : "secondary"}>
                      {store.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {store.customDomain && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                        <span>{store.customDomain}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/stores/${store.id}/settings`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </Link>
                      <Link to={`/stores/${store.id}/admin`} className="flex-1">
                        <Button className="w-full">
                          <Store className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
