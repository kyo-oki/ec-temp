import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  rows?: number;
  columns?: number;
  showSpinner?: boolean;
  message?: string;
  className?: string;
}

export function LoadingState({
  rows = 5,
  columns = 4,
  showSpinner = false,
  message = "Loading...",
  className,
}: LoadingStateProps) {
  if (showSpinner) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">{message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="space-y-4 p-6">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton
                  key={j}
                  className={`h-4 ${
                    j === 0 ? "w-4" : j === columns - 1 ? "w-20" : "w-1/4"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
