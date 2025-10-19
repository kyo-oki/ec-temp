import { useState, useCallback } from "react";

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState) {
      confirmState.resolve(true);
      setConfirmState(null);
    }
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    if (confirmState) {
      confirmState.resolve(false);
      setConfirmState(null);
    }
  }, [confirmState]);

  return {
    confirm,
    confirmDialog: confirmState
      ? {
          isOpen: confirmState.isOpen,
          options: confirmState.options,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        }
      : null,
  };
};
