import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "./useConfirm";

interface UseUnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  message?: string;
}

export function useUnsavedChangesWarning({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: UseUnsavedChangesWarningProps) {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handlePopState = async (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();

        const confirmed = await confirm({
          title: "Unsaved Changes",
          description: message,
          variant: "destructive",
          confirmLabel: "Leave",
          cancelLabel: "Stay",
        });

        if (confirmed) {
          // Allow navigation
          window.history.pushState(null, "", window.location.href);
          navigate(-1);
        } else {
          // Prevent navigation
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, message, confirm, navigate]);
}
