"use client";

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // Auto-remove toast after 5 seconds

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

function genId(): string {
  // Explicit return type
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
    clearTimeout(toastTimeouts.get(toastId) as ReturnType<typeof setTimeout>); // Clear existing timeout
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST", // Changed from DISMISS_TOAST to ensure removal
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Close existing toasts before adding a new one if limit is 1
      if (TOAST_LIMIT === 1 && state.toasts.length > 0) {
        state.toasts.forEach((t) => {
          if (toastTimeouts.has(t.id)) {
            clearTimeout(
              toastTimeouts.get(t.id) as ReturnType<typeof setTimeout>,
            );
            toastTimeouts.delete(t.id);
          }
        });
      }
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
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((currentToast) => {
          // Renamed toast to currentToast
          addToRemoveQueue(currentToast.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        state.toasts.forEach((t) => {
          // Clear any timeouts for removed toasts
          if (toastTimeouts.has(t.id)) {
            clearTimeout(
              toastTimeouts.get(t.id) as ReturnType<typeof setTimeout>,
            );
            toastTimeouts.delete(t.id);
          }
        });
        return {
          ...state,
          toasts: [],
        };
      }
      if (toastTimeouts.has(action.toastId)) {
        // Clear timeout for specific removed toast
        clearTimeout(
          toastTimeouts.get(action.toastId) as ReturnType<typeof setTimeout>,
        );
        toastTimeouts.delete(action.toastId);
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default: // Add default case for exhaustiveness
      return state;
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

type ToastInput = Omit<ToasterToast, "id">; // Renamed Toast to ToastInput to avoid conflict

interface ToastReturn {
  // Define return type for toast function
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToasterToast>) => void;
}

function toast({ ...props }: ToastInput): ToastReturn {
  const id = genId();

  const update = (newProps: Partial<ToasterToast>) =>
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
          // If toast is closed by user (swipe, close button), remove it immediately
          dispatch({ type: "REMOVE_TOAST", toastId: id });
        }
      },
    },
  });

  if (TOAST_REMOVE_DELAY !== Infinity && TOAST_REMOVE_DELAY > 0) {
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
  }, []); // Empty dependency array, setState instance doesn't change

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
