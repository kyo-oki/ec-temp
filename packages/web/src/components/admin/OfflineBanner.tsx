import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { Alert, AlertDescription } from "../ui/alert";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You are currently offline. Some features may not be available until
          you reconnect to the internet.
        </AlertDescription>
      </Alert>
    </div>
  );
}
