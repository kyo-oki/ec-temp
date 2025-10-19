import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, AlertCircle, Save } from "lucide-react";
import { UPDATE_STORE } from "../lib/graphql/mutations";
import { GET_MY_STORES } from "../lib/graphql/mutations";
import { Store, UpdateStoreInput } from "../lib/graphql/types";

interface StoreSettings {
  name: string;
  description: string;
  customDomain: string;
  settings: {
    theme: string;
    currency: string;
    timezone: string;
  };
}

export function StoreSettingsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<StoreSettings>({
    name: "",
    description: "",
    customDomain: "",
    settings: {
      theme: "modern",
      currency: "USD",
      timezone: "UTC",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // GraphQL queries and mutations
  const { data: storesData, loading: storesLoading } = useQuery<{
    myStores: Store[];
  }>(GET_MY_STORES);
  const [updateStore, { loading: updateLoading }] = useMutation<{
    updateStore: Store;
  }>(UPDATE_STORE);

  const currentStore = storesData?.myStores?.find(
    (store) => store.id === storeId
  );
  const isLoading = storesLoading || updateLoading;

  useEffect(() => {
    if (currentStore) {
      setSettings({
        name: currentStore.name,
        description: currentStore.description || "",
        customDomain: currentStore.customDomain || "",
        settings: JSON.parse(currentStore.settings || "{}"),
      });
    }
  }, [currentStore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!storeId) {
      setError("Store ID is required");
      return;
    }

    try {
      const input: UpdateStoreInput = {
        id: storeId,
        name: settings.name,
        settings: JSON.stringify(settings.settings),
        customDomain: settings.customDomain || null,
      };

      await updateStore({ variables: { input } });
      setSuccess("Store settings updated successfully!");
    } catch (err: any) {
      console.error("Store update error:", err);
      setError(
        err.message || "Failed to update store settings. Please try again."
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("settings.")) {
      const settingKey = name.split(".")[1];
      setSettings((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: value,
        },
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your store configuration and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>
                    Basic information about your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="name">Store Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={settings.name}
                      onChange={handleChange}
                      placeholder="Enter your store name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Store Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={settings.description}
                      onChange={handleChange}
                      placeholder="Describe your store and what you sell"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domain">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Domain</CardTitle>
                  <CardDescription>
                    Set up a custom domain for your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customDomain">Custom Domain</Label>
                    <Input
                      id="customDomain"
                      name="customDomain"
                      type="text"
                      value={settings.customDomain}
                      onChange={handleChange}
                      placeholder="yourstore.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your custom domain without http:// or https://
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      DNS Configuration
                    </h4>
                    <p className="text-sm text-blue-800 mb-2">
                      To verify your domain, add the following DNS record:
                    </p>
                    <code className="text-sm bg-blue-100 px-2 py-1 rounded">
                      CNAME www yourstore.vercel.app
                    </code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance & Localization</CardTitle>
                  <CardDescription>
                    Customize your store's appearance and regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="settings.theme">Theme</Label>
                    <select
                      id="settings.theme"
                      name="settings.theme"
                      value={settings.settings.theme}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="settings.currency">Currency</Label>
                    <select
                      id="settings.currency"
                      name="settings.currency"
                      value={settings.settings.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="settings.timezone">Timezone</Label>
                    <select
                      id="settings.timezone"
                      name="settings.timezone"
                      value={settings.settings.timezone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}
