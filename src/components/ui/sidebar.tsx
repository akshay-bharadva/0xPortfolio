"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SIDEBAR_WIDTH = "16rem"; // Standard width
const SIDEBAR_WIDTH_MOBILE = "18rem"; // Width for mobile sheet
const SIDEBAR_WIDTH_ICON = "3.5rem"; // Width when collapsed to icons (includes padding for icons)
const SIDEBAR_KEYBOARD_SHORTCUT = "b"; // Ctrl/Cmd + B to toggle

type SidebarContextValue = {
  // Renamed from SidebarContext to avoid conflict
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(() => {
      if (typeof window !== "undefined") {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
        if (cookieValue) return cookieValue.split("=")[1] === "true";
      }
      return defaultOpen;
    });

    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((currentOpen: boolean) => boolean)) => {
        // Changed value type
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        if (typeof window !== "undefined") {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      },
      [setOpenProp, open],
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((currentOpenMobile) => !currentOpenMobile) // Use functional update
        : setOpen((currentOpen) => !currentOpen); // Use functional update
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      ],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              // "has-[[data-variant=inset]]:bg-sidebar", // This might be too broad, apply bg on Sidebar or SidebarInset directly
              className,
            )}
            ref={ref} // Removed 'as any'
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement, // Changed to HTMLDivElement as it's a div
  React.ComponentProps<"aside"> & {
    // Changed to aside for semantic HTML
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon", // Default to icon collapse
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <aside // Changed to aside
          className={cn(
            "flex h-svh w-[--sidebar-width] flex-col bg-background text-foreground border-2 border-black rounded-none shadow-[4px_4px_0px_#000]",
            side === "left" ? "border-r-2" : "border-l-2", // Ensure correct border side
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </aside>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className={cn(
              "w-[--sidebar-width] bg-background p-0 text-foreground [&>button]:hidden border-2 border-black rounded-none", // Ensure SheetContent is Neo-Brutalist
              side === "left" ? "border-r-2" : "border-l-2", // Match border side
            )}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex size-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      // This outer div is for layout spacing, actual sidebar is the fixed one
      <div
        ref={ref}
        className="group peer hidden text-foreground md:block" // text-sidebar-foreground to text-foreground
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* Spacer div */}
        <div
          className={cn(
            "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
            "w-[--sidebar-width]",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180", // This seems incorrect for spacer
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" // + p-2 from parent
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          )}
        />
        {/* Actual Sidebar */}
        <aside // Changed to aside
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh flex-col transition-[left,right,width] ease-linear md:flex",
            "w-[--sidebar-width]",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",

            variant === "floating" &&
              "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_)]", // Removed +2px
            variant === "inset" &&
              "m-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_)]",
            variant === "sidebar" &&
              "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
            variant !== "floating" &&
              variant !== "inset" &&
              (side === "left"
                ? "border-r-2 border-black"
                : "border-l-2 border-black"),

            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col bg-background border-2 border-black rounded-none shadow-[4px_4px_0px_#000]",
              (variant === "floating" || variant === "inset") && "rounded-none", // Ensure floating/inset are also not rounded
              variant === "sidebar" && "shadow-none border-0", // Sidebar variant might not need its own shadow/border if part of main layout
            )}
          >
            {children}
          </div>
        </aside>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="outline" // Neo-Brutalist outline button
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:bg-black hover:after:bg-indigo-600 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-gray-200/50",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<
  HTMLDivElement, // Changed to div for generic main content area
  React.ComponentProps<"main"> // Keeping main for semantic meaning
>(({ className, ...props }, ref) => {
  return (
    <main // Keep as main for accessibility
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        // Peer classes target the sibling Sidebar for inset styling
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:border-2 md:peer-data-[variant=inset]:border-black md:peer-data-[variant=inset]:shadow-[4px_4px_0px_#000]",
        "md:peer-data-[state=expanded]:peer-data-[variant=inset]:peer-data-[side=left]:ml-[calc(var(--sidebar-width)_+_theme(spacing.2))]", // Adjust margin when expanded
        "md:peer-data-[state=expanded]:peer-data-[variant=inset]:peer-data-[side=right]:mr-[calc(var(--sidebar-width)_+_theme(spacing.2))]",
        "md:peer-data-[state=collapsed]:peer-data-[variant=inset]:peer-data-[collapsible=icon]:peer-data-[side=left]:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+_theme(spacing.2))]",
        "md:peer-data-[state=collapsed]:peer-data-[variant=inset]:peer-data-[collapsible=icon]:peer-data-[side=right]:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+_theme(spacing.2))]",
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-white focus-visible:ring-indigo-500 border-black", // Ensure border-black
        className,
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> // Changed from React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex flex-col gap-2 p-2 border-b-2 border-black",
        className,
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> // Changed from React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-2 p-2 border-t-2 border-black mt-auto",
        className,
      )} // Added mt-auto
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 my-1 w-auto bg-black h-[2px]", className)} // Ensure separator is visible
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> // Changed from React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden p-2",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> // Changed from React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col p-2 border-2 border-black rounded-none my-1 bg-gray-50 shadow-[2px_2px_0px_#000]",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement, // Can be any element if asChild is true
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean } // Changed ComponentProps to HTMLAttributes
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-none px-2 text-xs font-bold text-black outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring transition-[margin,opacity] ease-linear [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:invisible", // Hide properly when collapsed
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { asChild?: boolean } // Use ButtonProps for consistency
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : Button; // Use Button by default

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      variant="ghost" // Use ghost variant from Button
      size="icon" // Use icon size from Button
      className={cn(
        "absolute right-1 top-1.5 !w-6 !h-6 p-0 text-black hover:bg-yellow-200 active:bg-yellow-300", // Override size from Button, ensure Neo-Brutalist colors
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> // Changed from React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn(
      "w-full text-sm mt-1 group-data-[collapsible=icon]:hidden",
      className,
    )} // Hide content when collapsed
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-none border-2 border-transparent p-2 text-left outline-none ring-black transition-[width,height,padding,color,background-color] duration-150 hover:border-black hover:bg-yellow-300 hover:text-black focus-visible:ring-2 active:bg-yellow-200 active:text-black disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:border-black data-[state=open]:border-black data-[active=true]:bg-black data-[active=true]:font-bold data-[active=true]:text-white data-[state=open]:hover:bg-black data-[state=open]:hover:text-white group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-sm", // Base styles, specific colors handled by data-active etc.
        // Not typically used for menu buttons, but for completeness
        outline:
          "bg-transparent shadow-[0_0_0_2px_hsl(var(--border))] hover:shadow-[0_0_0_2px_black]",
      },
      size: {
        // Adjusted sizes to better fit icons when collapsed
        default: "h-8 text-sm group-data-[collapsible=icon]:justify-center",
        sm: "h-7 text-xs group-data-[collapsible=icon]:justify-center",
        lg: "h-12 text-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement, // Can be anchor if asChild is true and child is anchor
  React.ButtonHTMLAttributes<HTMLButtonElement> & // Use ButtonHTMLAttributes
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { // Also Anchor for asChild case
      asChild?: boolean;
      isActive?: boolean;
      tooltip?: string | React.ComponentProps<typeof TooltipContent>;
    } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children, // Explicitly include children
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const buttonContent = (
      <>
        {children}
        {/* Hide text content when collapsed to icon only, if text is in a span */}
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            typeof child.props.children === "string" &&
            child.type === "span"
          ) {
            return (
              <span
                className={cn(
                  "group-data-[collapsible=icon]:hidden",
                  (child.props as any).className,
                )}
              >
                {child.props.children}
              </span>
            );
          }
          if (typeof child === "string" && Comp === "button") {
            // if direct string child and it's a button
            return (
              <span className="group-data-[collapsible=icon]:hidden">
                {child}
              </span>
            );
          }
          return child;
        })}
      </>
    );

    const buttonElement = (
      <Comp
        ref={ref as React.Ref<any>} // Use any for ref due to Slot
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive ? "true" : undefined} // Ensure string or undefined for data attributes
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      >
        {/* This logic tries to hide text if it's a direct child or in a span when collapsed */}
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            child.type === "span" &&
            typeof child.props.children === "string"
          ) {
            return React.cloneElement(child, {
              className: cn(
                (child.props as any).className,
                "group-data-[collapsible=icon]:hidden",
              ),
            } as any);
          }
          if (typeof child === "string" && Comp === "button") {
            return (
              <span className="group-data-[collapsible=icon]:hidden">
                {child}
              </span>
            );
          }
          return child;
        })}
      </Comp>
    );

    if (!tooltip || (state === "expanded" && !isMobile)) {
      // Show tooltip only when collapsed or on mobile if specified
      return buttonElement;
    }

    const tooltipContentProps =
      typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          // hidden={state === "expanded" && !isMobile} // Control visibility if needed beyond Tooltip's own logic
          {...tooltipContentProps}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    // Use ButtonProps
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : Button; // Use Button by default

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      variant="ghost"
      size="icon"
      className={cn(
        "!absolute !right-1 !top-1/2 !-translate-y-1/2 !w-6 !h-6 !p-0 text-black hover:!bg-yellow-200 active:!bg-yellow-300", // Force override some button styles
        "after:absolute after:-inset-2 after:md:hidden",
        // "peer-data-[size=sm]/menu-button:top-1", // top-1/2 -translate-y-1/2 should center it
        // "peer-data-[size=default]/menu-button:top-1.5",
        // "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-black md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> // Changed from ComponentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-none border border-black bg-yellow-300 px-1 text-xs font-bold text-black select-none pointer-events-none shadow-[1px_1px_0px_#000]",
      "peer-hover/menu-button:bg-yellow-400 peer-data-[active=true]/menu-button:bg-white peer-data-[active=true]/menu-button:text-black peer-data-[active=true]/menu-button:border-black",
      // "peer-data-[size=sm]/menu-button:top-1", // Centered with top-1/2
      // "peer-data-[size=default]/menu-button:top-1.5",
      // "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    // Changed from ComponentProps
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`; // Random width for text skeleton
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-none h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-none border-black bg-gray-300" // Ensure skeleton matches theme
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1 rounded-none border-black bg-gray-300" // Ensure skeleton matches theme
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l-2 border-black pl-2.5 py-1", // Adjusted padding
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative", className)} {...props} />
)); // Added relative for potential absolute children
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement, // Assuming it's mostly links
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    // Use AnchorHTMLAttributes
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(
  (
    { asChild = false, size = "md", isActive, className, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref as React.Ref<any>} // Use any for ref due to Slot
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive ? "true" : undefined} // Ensure string or undefined
        className={cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-none px-2 text-black outline-none ring-black hover:bg-yellow-200 focus-visible:ring-1 active:bg-yellow-100 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-black font-semibold",
          "data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:[&>svg]:text-white",
          size === "sm" && "text-xs h-6", // Adjusted height for sm
          size === "md" && "text-sm h-7",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
