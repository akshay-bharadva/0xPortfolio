"use client"; // This hook is intended for client-side use

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"; // Ensure path is correct

const TOAST_LIMIT = 1; // Only show one toast at a time
const TOAST_REMOVE_DELAY = 5000; // Auto-remove toast after 5 seconds (adjust as needed)

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId)); // Clear existing timeout if any
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    // This dispatch should happen to actually remove the toast from UI after delay
    dispatch({
      type: "REMOVE_TOAST", // Changed from DISMISS_TOAST to REMOVE_TOAST for clarity
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // If limit is 1, replace existing toasts. Otherwise, prepend.
      const newToasts =
        TOAST_LIMIT === 1 ? [action.toast] : [action.toast, ...state.toasts];
      return {
        ...state,
        toasts: newToasts.slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;
      // If toastId is provided, dismiss that specific toast.
      // Otherwise, dismiss all toasts.
      if (toastId) {
        addToRemoveQueue(toastId); // Add to remove queue for auto-dismissal
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Trigger animation out
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [], // Remove all toasts
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId), // Remove specific toast
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (
    newProps: Partial<ToasterToast>, // Use Partial for updates
  ) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...newProps, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          // When Radix toast closes (e.g. via swipe), remove it from state
          dispatch({ type: "REMOVE_TOAST", toastId: id });
        }
      },
    },
  });

  // Automatically dismiss after a delay
  if (TOAST_REMOVE_DELAY !== Infinity && TOAST_REMOVE_DELAY > 0) {
    // Check for Infinity or non-positive delay
    addToRemoveQueue(id);
  }

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]); // state dependency is correct here for re-subscription if state instance changes, though unlikely

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
