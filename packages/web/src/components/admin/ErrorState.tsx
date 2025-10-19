import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function ErrorState({
  error,
  onRetry,
  title = "Something went wrong",
  description,
  className,
}: ErrorStateProps) {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <Card className={className}>
      <CardContent className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description || errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
