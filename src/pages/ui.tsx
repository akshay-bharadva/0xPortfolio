import Layout from '@/components/layout';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // For Navigation Menu example
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// --- Icon Imports ---
import {
    Terminal, Settings, User as UserIcon, CreditCard, CalendarIcon, Home as HomeIcon,
    Search as SearchIcon, Palette, ChevronsUpDown, UploadCloud, Link2, Image as ImageIcon, AlignLeft,
    Bold, Italic, Underline, Strikethrough, AlignCenter, AlignRight, List, ListOrdered, MessageSquare, Code, CheckCircle, XCircle, Info
} from 'lucide-react';


// --- UI Component Imports (ensure all are correctly imported) ---
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Pie, PieChart as RechartsPieChart } from "recharts"; // Renamed PieChart to avoid conflict
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast as sonnerToast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast as useShadcnToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Data Structure for Sidebar and Sections ---
interface Variation {
  id: string;
  name: string;
}
interface ComponentSectionItem {
  id: string;
  name: string;
  icon: JSX.Element;
  variations?: Variation[];
}

const componentSectionsList: ComponentSectionItem[] = [
  { id: "accordion", name: "Accordion", icon: <AlignLeft className="w-4 h-4 mr-2"/>, variations: [{id: "accordion-basic", name: "Basic"}, {id: "accordion-multiple", name:"Multiple Open"}] },
  { id: "alertDialog", name: "Alert Dialog", icon: <MessageSquare className="w-4 h-4 mr-2"/>, variations: [{id: "alertDialog-confirm", name: "Confirmation"}] },
  { id: "alert", name: "Alert", icon: <Info className="w-4 h-4 mr-2"/>, variations: [{id: "alert-default", name:"Default"}, {id:"alert-destructive", name:"Destructive"}] },
  { id: "aspectRatio", name: "Aspect Ratio", icon: <ImageIcon className="w-4 h-4 mr-2"/> },
  { id: "avatar", name: "Avatar", icon: <UserIcon className="w-4 h-4 mr-2"/> },
  { id: "badge", name: "Badge", icon: <Palette className="w-4 h-4 mr-2"/>, variations: [{id: "badge-variants", name: "Variants"}] },
  { id: "breadcrumb", name: "Breadcrumb", icon: <HomeIcon className="w-4 h-4 mr-2"/> },
  { id: "button", name: "Button", icon: <Palette className="w-4 h-4 mr-2"/>, variations: [{id: "button-variants", name:"Variants"}, {id: "button-sizes", name: "Sizes"}, {id:"button-icon", name:"With Icon"}, {id:"button-disabled", name: "Disabled"}, {id:"button-aschild", name:"As Child"}] },
  { id: "calendar", name: "Calendar", icon: <CalendarIcon className="w-4 h-4 mr-2"/> },
  { id: "card", name: "Card", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"card-basic", name:"Basic Card"}, {id:"card-form", name:"With Form"}] },
  { id: "carousel", name: "Carousel", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "chart", name: "Chart", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id: "chart-bar", name:"Bar Chart"}, {id:"chart-line", name:"Line Chart"}] }, // Simplified
  { id: "checkbox", name: "Checkbox", icon: <CheckCircle className="w-4 h-4 mr-2"/>, variations: [{id:"checkbox-basic", name:"Basic"}, {id:"checkbox-disabled", name:"Disabled"}] },
  { id: "collapsible", name: "Collapsible", icon: <ChevronsUpDown className="w-4 h-4 mr-2"/> },
  { id: "command", name: "Command", icon: <SearchIcon className="w-4 h-4 mr-2"/>, variations:[{id:"command-inline", name:"Inline"},{id:"command-dialog", name:"Dialog"}] },
  { id: "contextMenu", name: "Context Menu", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "dialog", name: "Dialog", icon: <MessageSquare className="w-4 h-4 mr-2"/> },
  { id: "drawer", name: "Drawer", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "dropdownMenu", name: "Dropdown Menu", icon: <ChevronsUpDown className="w-4 h-4 mr-2"/> },
  { id: "form", name: "Form", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"form-example", name:"Example Usage"}]},
  { id: "hoverCard", name: "Hover Card", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "input", name: "Input", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"input-basic", name:"Text"},{id:"input-email", name:"Email"},{id:"input-password", name:"Password"},{id:"input-disabled", name:"Disabled"}]},
  { id: "inputOtp", name: "Input OTP", icon: <Code className="w-4 h-4 mr-2"/>, variations: [{id:"inputOtp-6digit", name:"6-Digit"}, {id:"inputOtp-4digit", name:"4-Digit"}]},
  { id: "label", name: "Label", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "menubar", name: "Menubar", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "navigationMenu", name: "Navigation Menu", icon: <Link2 className="w-4 h-4 mr-2"/> },
  { id: "pagination", name: "Pagination", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "popover", name: "Popover", icon: <MessageSquare className="w-4 h-4 mr-2"/> },
  { id: "progress", name: "Progress", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "radioGroup", name: "Radio Group", icon: <ListOrdered className="w-4 h-4 mr-2"/> },
  { id: "resizable", name: "Resizable", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "scrollArea", name: "Scroll Area", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "select", name: "Select", icon: <ChevronsUpDown className="w-4 h-4 mr-2"/>, variations:[{id:"select-basic", name:"Basic"}, {id:"select-groups", name:"With Groups"}] },
  { id: "separator", name: "Separator", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "sheet", name: "Sheet", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"sheet-sides", name:"All Sides"}] },
  { id: "sidebar", name: "Sidebar", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"sidebar-trigger-example", name:"Trigger Example"}]},
  { id: "skeleton", name: "Skeleton", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "slider", name: "Slider", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "sonner", name: "Sonner Toasts", icon: <MessageSquare className="w-4 h-4 mr-2"/>, variations:[{id:"sonner-default", name:"Default"},{id:"sonner-destructive", name:"Destructive"}] },
  { id: "switch", name: "Switch", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "table", name: "Table", icon: <List className="w-4 h-4 mr-2"/> },
  { id: "tabs", name: "Tabs", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "textarea", name: "Textarea", icon: <Palette className="w-4 h-4 mr-2"/> },
  { id: "toastShadcn", name: "Toast (Shadcn)", icon: <MessageSquare className="w-4 h-4 mr-2"/>, variations:[{id:"toastShadcn-default", name:"Default"},{id:"toastShadcn-destructive", name:"Destructive"}] },
  { id: "toggle", name: "Toggle", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"toggle-variants", name:"Variants"}, {id:"toggle-pressed", name:"Pressed"}, {id:"toggle-texticon", name:"With Text/Icon"}] },
  { id: "toggleGroup", name: "Toggle Group", icon: <Palette className="w-4 h-4 mr-2"/>, variations:[{id:"toggle-group-multiple", name:"Multiple"},{id:"toggle-group-single", name:"Single (Outline)"}]},
  { id: "tooltip", name: "Tooltip", icon: <MessageSquare className="w-4 h-4 mr-2"/> },
];


// --- Helper Components for Documentation Page (CodeBlock, ComponentDocSection, VariationDisplay, PropsTable) - Keep As Is ---
const CodeBlock: React.FC<{ code: string; language?: string; title?: string }> = ({ code, language = "tsx", title }) => (
    <div className="my-6 rounded-none border-2 border-black shadow-[4px_4px_0_#000] bg-[#2d2d2d]">
        {title && <div className="bg-black text-yellow-300 px-3 py-1.5 text-sm font-bold border-b-2 border-black font-mono">
            {title}
        </div>}
        <SyntaxHighlighter
            language={language}
            style={materialDark}
            customStyle={{ margin: 0, borderRadius: 0, padding: '1rem', background: 'transparent', fontSize: '0.8rem' }} // smaller font
            showLineNumbers={code.trim().split('\n').length > 2}
            lineNumberStyle={{ color: '#666', fontSize: '0.75em', marginRight: '1em', userSelect: 'none' }}
            wrapLines={true}
            wrapLongLines={true}
        >
            {code.trim()}
        </SyntaxHighlighter>
    </div>
);

const ComponentDocSection: React.FC<{ id: string; title: string; description: string; children: React.ReactNode; className?: string }> = ({ id, title, description, children, className }) => (
  <section id={id} className={cn("mb-16 py-8 px-6 border-2 border-black rounded-none shadow-[8px_8px_0px_#000] bg-white scroll-mt-24", className)}>
    <header className='border-b-4 border-black pb-4 mb-6'>
        <h2 className="text-3xl sm:text-4xl font-black text-black">{title}</h2>
        <p className="mt-1.5 text-md text-gray-700 font-semibold">{description}</p>
    </header>
    <div className="space-y-10">
      {children}
    </div>
  </section>
);

const VariationDisplay: React.FC<{ id?:string; title: string; description?: string; children: React.ReactNode; className?: string }> = ({ id, title, description, children, className }) => (
  <div id={id} className={cn("mt-6 p-4 border-2 border-gray-400 rounded-none shadow-[3px_3px_0px_#aaa] bg-gray-50 scroll-mt-24", className)}>
      <h3 className="text-xl font-black mb-1 text-black border-b-2 border-gray-300 pb-1.5">{title}</h3>
      {description && <p className="text-sm text-gray-600 my-2 font-medium">{description}</p>}
      <div className="mt-4 space-y-4 flex flex-wrap gap-4 items-center md:items-start">
          {children}
      </div>
  </div>
);

const PropsTable: React.FC<{ data: Array<{ prop: string; type: string; default?: string; description: string }> }> = ({ data }) => (
    <div className="mt-6 overflow-x-auto">
        <h4 className="text-lg font-bold text-black mb-2">Key Props</h4>
        <Table className="border-2 border-black shadow-[2px_2px_0_#000]">
            <TableHeader><TableRow><TableHead className="w-[150px]">Prop</TableHead><TableHead className="w-[150px]">Type</TableHead><TableHead className="w-[120px]">Default</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
            <TableBody>{data.map(row => (<TableRow key={row.prop}><TableCell className="font-mono font-semibold text-sm">{row.prop}</TableCell><TableCell className="font-mono text-xs text-indigo-700">{row.type}</TableCell><TableCell className="font-mono text-xs">{row.default || '–'}</TableCell><TableCell className="text-sm">{row.description}</TableCell></TableRow>))}</TableBody>
        </Table>
    </div>
);

// --- Form schema & Chart data ---
const uiFormSchemaInstance = z.object({
  username: z.string().min(2, "Min 2 chars").max(50), email: z.string().email(),
  framework: z.string().min(1, "Required"), notifications: z.boolean().default(false).optional(),
});
const uiChartConfigInstance = { views: { label: "Views", color: "hsl(var(--chart-1))" } } satisfies ChartConfig; // Use your theme colors
const uiChartDataInstance = [ { month: "Jan", views: 186 }, { month: "Feb", views: 305 }, { month: "Mar", views: 237 }];


export default function UiDocumentationPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progressValue, setProgressValue] = useState(13); // Renamed to avoid conflict
  const [sliderVal, setSliderVal] = useState([50]);
  const [cmdDialog, setCmdDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const mainContentAreaRef = useRef<HTMLDivElement>(null);
  const [activeSidebarSection, setActiveSidebarSection] = useState<string | null>(componentSectionsList[0]?.id || null);

  const { toast: shadcnUIToastFn } = useShadcnToast();
  const formHook = useForm<z.infer<typeof uiFormSchemaInstance>>({
    resolver: zodResolver(uiFormSchemaInstance), defaultValues: { username: "", email: "", notifications: false },
  });
  function handleFormSubmit(values: z.infer<typeof uiFormSchemaInstance>) {
    sonnerToast.success("Form Data:", { description: <CodeBlock code={JSON.stringify(values, null, 2)} language="json" /> });
  }

  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(77), 500); // Use progressValue
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                // Prioritize variation ID if available, otherwise main section ID
                const sectionId = entry.target.id;
                const mainComponent = componentSectionsList.find(comp => comp.id === sectionId || comp.variations?.some(v => v.id === sectionId));
                if (mainComponent) {
                    setActiveSidebarSection(mainComponent.id);
                    // If you want to highlight the specific variation, you'd need another state for activeVariationId
                }
                break; // Process only the first intersecting element from the top
            }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.01 }
    );

    componentSectionsList.forEach((section) => {
      const mainEl = document.getElementById(section.id);
      if (mainEl) observer.observe(mainEl);
      section.variations?.forEach(variation => {
        const variationEl = document.getElementById(variation.id);
        if (variationEl) observer.observe(variationEl);
      });
    });

    return () => {
      clearTimeout(timer);
      componentSectionsList.forEach((section) => {
            const mainEl = document.getElementById(section.id);
            if (mainEl) observer.unobserve(mainEl);
            section.variations?.forEach(variation => {
                const variationEl = document.getElementById(variation.id);
                if (variationEl) observer.unobserve(variationEl);
            });
        });
    };
  }, []);


  const scrollToSectionHandler = (id: string) => {
    const element = document.getElementById(id);
    if (element && mainContentAreaRef.current) {
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '80');
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerHeight - 24; // Increased offset

      mainContentAreaRef.current.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      const mainComponentId = componentSectionsList.find(comp => comp.id === id || comp.variations?.some(v => v.id === id))?.id;
      if(mainComponentId) setActiveSidebarSection(mainComponentId);
    }
  };
  // --- JSX for the page ---
  return (
    <Layout>
        <style jsx global>{`
            :root { --header-height: 80px; }
            @media (min-width: 768px) { :root { --header-height: 100px; } }
            html { scroll-behavior: smooth; } /* Smooth scroll for URL hash changes */
        `}</style>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-var(--header-height))] font-space bg-gray-100">
        {/* Left Sidebar */}
        <aside className="w-full md:w-[30%] md:max-w-xs p-3 border-b-2 md:border-b-0 md:border-r-4 border-black bg-yellow-100 shadow-[3px_0px_0px_#000_inset] md:sticky md:top-[var(--header-height)] md:h-[calc(100vh-var(--header-height))] overflow-y-auto">
          <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1.5">COMPONENTS</h2>
          <nav>
            <ul className="space-y-0">
              {componentSectionsList.map(section => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSectionHandler(section.id)}
                    className={cn(
                        "flex items-center w-full text-left px-2.5 py-1.5 rounded-none text-sm font-bold transition-all duration-100 border-2 border-transparent -ml-px -mt-px",
                        activeSidebarSection === section.id
                          ? "bg-black text-white border-black shadow-[1.5px_1.5px_0px_#fff_inset]"
                          : "text-black hover:bg-yellow-300 hover:border-black hover:shadow-[1.5px_1.5px_0px_#000]"
                    )}
                  >
                    {section.icon} {section.name}
                  </button>
                  {section.variations && activeSidebarSection === section.id && (
                    <ul className="pl-4 mt-0 mb-0.5 space-y-0 border-l-2 border-gray-500 ml-3 py-1 bg-yellow-50 shadow-[inset_2px_0px_0px_#eab308]">
                      {section.variations.map(variation => (
                        <li key={variation.id}>
                          <button
                            onClick={() => scrollToSectionHandler(variation.id)}
                            className="flex items-center w-full text-left px-2 py-0.5 rounded-none text-xs font-semibold transition-colors duration-100 text-gray-700 hover:text-black hover:bg-yellow-200"
                          >
                            <span className="mr-2 text-gray-500">-</span>{variation.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Right Content Area */}
        <main ref={mainContentAreaRef} className="w-full md:w-[70%] p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-black border-b-4 border-black pb-3">UI Kit Docs</h1>
            <p className="mt-2 text-lg text-gray-700 font-semibold">Neo-Brutalist Component Library</p>
          </header>

          {/* --- Accordion (Already Done) --- */}
          <ComponentDocSection id="accordion" title="Accordion" description="A vertically stacked set of interactive headings that each reveal a section of content.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Accordion, AccordionItem, AccordionTrigger, AccordionContent }'} from "@/components/ui/accordion";</code></p>
            <VariationDisplay id="accordion-basic" title="Basic Usage (Single Item Collapsible)">
              <Accordion type="single" collapsible className="w-full max-w-md"><AccordionItem value="item-1"><AccordionTrigger>What is Neo-Brutalism?</AccordionTrigger><AccordionContent>Neo-Brutalism in UI design emphasizes raw, blocky elements, strong typography, limited color palettes (often high contrast), and an unrefined, functional aesthetic. It often features hard shadows and visible borders.</AccordionContent></AccordionItem><AccordionItem value="item-2"><AccordionTrigger>Is it accessible?</AccordionTrigger><AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent></AccordionItem></Accordion>
            </VariationDisplay>
            <CodeBlock code={`<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Section 1</AccordionTrigger>\n    <AccordionContent>Content for section 1.</AccordionContent>\n  </AccordionItem>\n</Accordion>`} />
            <VariationDisplay id="accordion-multiple" title="Multiple Items Openable">
              <Accordion type="multiple" className="w-full max-w-md"><AccordionItem value="item-a"><AccordionTrigger>Item One (Multiple)</AccordionTrigger><AccordionContent>Content one.</AccordionContent></AccordionItem><AccordionItem value="item-b"><AccordionTrigger>Item Two (Multiple)</AccordionTrigger><AccordionContent>Content two.</AccordionContent></AccordionItem></Accordion>
            </VariationDisplay>
            <CodeBlock code={`<Accordion type="multiple">{/* ...items... */}</Accordion>`} />
            <PropsTable data={[{prop: "type", type: "'single' | 'multiple'", default: "'single'", description: "Determines if multiple items can be open simultaneously."},{prop: "collapsible", type: "boolean", default: "false", description: "If type='single', allows the open item to be closed by clicking its trigger again."},{prop: "defaultValue", type: "string | string[]", description: "The value(s) of the item(s) to be open initially."}]}/>
          </ComponentDocSection>

          {/* --- Alert Dialog (Already Done) --- */}
          <ComponentDocSection id="alertDialog" title="Alert Dialog" description="A modal dialog that interrupts the user with important content and expects a response.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ AlertDialog, ... }'} from "@/components/ui/alert-dialog";</code></p>
            <VariationDisplay id="alertDialog-confirm" title="Confirmation Dialog">
              <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Delete Account</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your account.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => sonnerToast.error("Account Deletion Confirmed (Demo)")}>Yes, delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
            </VariationDisplay>
            <CodeBlock code={`<AlertDialog>\n  <AlertDialogTrigger asChild><Button variant="destructive">Trigger</Button></AlertDialogTrigger>\n  <AlertDialogContent>...</AlertDialogContent>\n</AlertDialog>`} />
            <PropsTable data={[{prop: "open", type:"boolean", description:"Controlled open state."},{prop:"onOpenChange", type:"(open: boolean)=>void", description:"Callback on open state change."}]}/>
          </ComponentDocSection>

          {/* --- Alert (Already Done) --- */}
          <ComponentDocSection id="alert" title="Alert" description="Displays a callout for user attention.">
             <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Alert, AlertTitle, AlertDescription }'} from "@/components/ui/alert";</code></p>
            <VariationDisplay id="alert-default" title="Default Alert">
              <Alert className="max-w-md"><Terminal className="h-4 w-4" /><AlertTitle>Heads up!</AlertTitle><AlertDescription>General information.</AlertDescription></Alert>
            </VariationDisplay>
            <CodeBlock code={`<Alert>\n  <Terminal className="h-4 w-4" />\n  <AlertTitle>Heads up!</AlertTitle>\n  <AlertDescription>General info.</AlertDescription>\n</Alert>`} />
            <VariationDisplay id="alert-destructive" title="Destructive Alert">
              <Alert variant="destructive" className="max-w-md"><XCircle className="h-4 w-4" /><AlertTitle>Error!</AlertTitle><AlertDescription>Something went wrong.</AlertDescription></Alert>
            </VariationDisplay>
            <CodeBlock code={`<Alert variant="destructive">\n  <XCircle className="h-4 w-4" />\n  <AlertTitle>Error!</AlertTitle>\n  <AlertDescription>Details here.</AlertDescription>\n</Alert>`} />
            <PropsTable data={[{prop: "variant", type:"'default'|'destructive'", default:"'default'", description:"Alert style."}]}/>
          </ComponentDocSection>

          {/* --- Aspect Ratio --- */}
          <ComponentDocSection id="aspectRatio" title="Aspect Ratio" description="A container that maintains a specific aspect ratio.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ AspectRatio }'} from "@/components/ui/aspect-ratio";</code></p>
            <VariationDisplay title="16:9 Aspect Ratio">
              <div className="w-[300px] sm:w-[400px]"><AspectRatio ratio={16 / 9} className="bg-yellow-300 border-2 border-black rounded-none shadow-[4px_4px_0_#000] flex items-center justify-center"><span className="text-2xl font-bold text-black">16:9</span></AspectRatio></div>
            </VariationDisplay>
            <CodeBlock code={`<AspectRatio ratio={16 / 9} className="bg-yellow-300">\n  {/* Content */}\n</AspectRatio>`}/>
            <VariationDisplay title="1:1 (Square) Aspect Ratio">
              <div className="w-[200px]"><AspectRatio ratio={1 / 1} className="bg-indigo-300 border-2 border-black rounded-none shadow-[4px_4px_0_#000] flex items-center justify-center"><span className="text-2xl font-bold text-black">1:1</span></AspectRatio></div>
            </VariationDisplay>
            <CodeBlock code={`<AspectRatio ratio={1 / 1}>{/* Square Content */}</AspectRatio>`}/>
            <PropsTable data={[{prop: "ratio", type:"number", default:"1", description:"The desired aspect ratio (width / height)."}]}/>
          </ComponentDocSection>

          {/* --- Avatar --- */}
          <ComponentDocSection id="avatar" title="Avatar" description="Displays an image representing a user or entity, with a fallback.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Avatar, AvatarImage, AvatarFallback }'} from "@/components/ui/avatar";</code></p>
            <VariationDisplay title="Image and Fallback">
              <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
              <Avatar><AvatarImage src="/non-existent-image.png" alt="No image" /><AvatarFallback>AB</AvatarFallback></Avatar>
            </VariationDisplay>
            <CodeBlock code={`<Avatar>\n  <AvatarImage src="image_url.png" alt="Alt text" />\n  <AvatarFallback>Fallback Initials</AvatarFallback>\n</Avatar>`}/>
             <PropsTable data={[
                {prop: "(AvatarImage) src", type: "string", description: "URL of the image."},
                {prop: "(AvatarImage) alt", type: "string", description: "Alt text for the image."},
                {prop: "(AvatarFallback) children", type: "ReactNode", description: "Content for fallback (e.g., initials)."},
            ]}/>
          </ComponentDocSection>

          {/* --- Badge (Already Done) --- */}
          <ComponentDocSection id="badge" title="Badge" description="Small, highlighted pieces of information.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Badge }'} from "@/components/ui/badge";</code></p>
            <VariationDisplay id="badge-variants" title="Variants">
                <Badge>Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="destructive">Destructive</Badge><Badge variant="outline">Outline</Badge>
            </VariationDisplay>
            <CodeBlock code={`<Badge variant="default">Default</Badge>\n<Badge variant="secondary">Secondary</Badge>\n{/* ...etc... */}`}/>
            <PropsTable data={[{prop: "variant", type:"'default'|'secondary'|'destructive'|'outline'", default:"'default'", description:"Badge style."}]}/>
          </ComponentDocSection>

          {/* --- Breadcrumb (Already Done) --- */}
          <ComponentDocSection id="breadcrumb" title="Breadcrumb" description="Shows the user's current location within a navigational hierarchy.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Breadcrumb, ... }'} from "@/components/ui/breadcrumb";</code></p>
            <VariationDisplay title="Example Path">
                <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#breadcrumb">Docs</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#breadcrumb">Components</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
            </VariationDisplay>
            <CodeBlock code={`<Breadcrumb><BreadcrumbList>...</BreadcrumbList></Breadcrumb>`}/>
            {/* Props for individual parts can be extensive; focus on structure */}
          </ComponentDocSection>

          {/* --- Button (Already Done) --- */}
          <ComponentDocSection id="button" title="Button" description="Interactive element to trigger actions.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Button }'} from "@/components/ui/button";</code></p>
            <VariationDisplay id="button-variants" title="Variants"><Button>Default</Button><Button variant="destructive">Destructive</Button><Button variant="outline">Outline</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="link">Link</Button></VariationDisplay>
            <CodeBlock code={`<Button variant="default">Default</Button>\n<Button variant="destructive">Destructive</Button>`} />
            <VariationDisplay id="button-sizes" title="Sizes"><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button><Button size="icon" aria-label="Settings"><Settings className="h-5 w-5"/></Button></VariationDisplay>
            <CodeBlock code={`<Button size="sm">Small</Button>\n<Button size="lg">Large</Button>`} />
            <VariationDisplay id="button-icon" title="With Icon"><Button><UserIcon className="mr-2 h-4 w-4" /> Login</Button></VariationDisplay>
            <CodeBlock code={`<Button><UserIcon className="mr-2 h-4 w-4" /> Login</Button>`} />
            <VariationDisplay id="button-disabled" title="Disabled"><Button disabled>Disabled</Button></VariationDisplay>
            <CodeBlock code={`<Button disabled>Disabled</Button>`} />
            <VariationDisplay id="button-aschild" title="As Child"><Button asChild variant="link"><a href="#button">Link Button</a></Button></VariationDisplay>
            <CodeBlock code={`<Button asChild variant="link"><a href="#">Link</a></Button>`} />
            <PropsTable data={[{prop: "variant", type:"'default'|...", default:"'default'", description:"Style variant."},{prop: "size", type:"'default'|'sm'|'lg'|'icon'", default:"'default'", description:"Button size."},{prop: "asChild", type:"boolean", default:"false", description:"Render as child element."}]}/>
          </ComponentDocSection>

          {/* --- Calendar (Already Done) --- */}
          <ComponentDocSection id="calendar" title="Calendar" description="A date picker component.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Calendar }'} from "@/components/ui/calendar";</code></p>
            <VariationDisplay title="Single Date Picker">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-none border-2 border-black shadow-[6px_6px_0_#000]"/>
                <p className="text-sm mt-1 font-semibold">Selected: {date ? date.toLocaleDateString() : "None"}</p>
            </VariationDisplay>
            <CodeBlock code={`const [date, setDate] = useState<Date | undefined>(new Date());\n\n<Calendar \n  mode="single" \n  selected={date} \n  onSelect={setDate} \n/>`}/>
            <PropsTable data={[{prop: "mode", type:"'single'|'multiple'|'range'", default:"'single'", description:"Selection mode."},{prop:"selected", type:"Date | Date[] | ...", description:"Controlled selected date(s)."},{prop:"onSelect", type:"function", description:"Callback on date selection."}]}/>
          </ComponentDocSection>

          {/* --- Card (Already Done) --- */}
          <ComponentDocSection id="card" title="Card" description="A container for grouping related content.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Card, CardHeader, ... }'} from "@/components/ui/card";</code></p>
            <VariationDisplay id="card-basic" title="Basic Card">
              <Card className="w-full max-w-sm"><CardHeader><CardTitle>Card Title</CardTitle><CardDescription>Card Description</CardDescription></CardHeader><CardContent><p>Card content.</p></CardContent><CardFooter><Button>Action</Button></CardFooter></Card>
            </VariationDisplay>
            <CodeBlock code={`<Card>...</Card>`}/>
            <VariationDisplay id="card-form" title="Card with Form Elements">
                <Card className="w-full max-w-md"><CardHeader><CardTitle>Login</CardTitle></CardHeader><CardContent className="space-y-3"><Input placeholder="Email"/><Input type="password" placeholder="Password"/></CardContent><CardFooter><Button className="w-full">Login</Button></CardFooter></Card>
            </VariationDisplay>
            <CodeBlock code={`<Card>...</Card>`}/>
            {/* PropsTable for Card is less relevant as it's mostly structural via children */}
          </ComponentDocSection>

          {/* --- Carousel (Already Done) --- */}
          <ComponentDocSection id="carousel" title="Carousel" description="A slideshow component for cycling through elements.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Carousel, ... }'} from "@/components/ui/carousel";</code></p>
            <VariationDisplay title="Simple Carousel">
            <Carousel className="w-full max-w-[250px] sm:max-w-xs mx-auto"><CarouselContent>{Array.from({ length: 3 }).map((_, index) => (<CarouselItem key={index}><div className="p-1"><Card><CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6 bg-yellow-200 border-2 border-black rounded-none"><span className="text-2xl sm:text-3xl font-bold">{index + 1}</span></CardContent></Card></div></CarouselItem>))}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>
            </VariationDisplay>
            <CodeBlock code={`<Carousel><CarouselContent>{/* <CarouselItem>...</CarouselItem> */}</CarouselContent><CarouselPrevious/><CarouselNext/></Carousel>`}/>
            <PropsTable data={[{prop:"opts", type:"EmblaOptionsType", description:"Options for Embla Carousel."}, {prop:"orientation", type:"'horizontal'|'vertical'", default:"'horizontal'", description:"Carousel orientation."}]}/>
          </ComponentDocSection>

          {/* --- Chart (Already Done) --- */}
           <ComponentDocSection id="chart" title="Chart" description="Component for displaying charts using Recharts.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ ChartContainer, ... }'} from "@/components/ui/chart";</code> and Recharts components.</p>
            <VariationDisplay id="chart-bar" title="Bar Chart Example">
              <ChartContainer config={uiChartConfigInstance} className="min-h-[200px] w-full max-w-lg">
                <BarChart accessibilityLayer data={uiChartDataInstance}><CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><ChartLegend content={<ChartLegendContent />} /><Bar dataKey="views" fill="var(--color-views)" radius={0} /></BarChart>
              </ChartContainer>
            </VariationDisplay>
            <CodeBlock code={`const chartConfig = { views: { label: "Views", color: "hsl(var(--chart-1))" } };\nconst chartData = [/* ...data... */];\n\n<ChartContainer config={chartConfig}>...</ChartContainer>`} />
            <VariationDisplay id="chart-line" title="Line Chart Example">
                {/* TODO: Add Line Chart Example Here */}
                 <p className="text-sm text-gray-500">Line chart example to be added.</p>
            </VariationDisplay>
            <PropsTable data={[{prop:"config", type:"ChartConfig", description:"Configuration for chart colors and labels."}]}/>
          </ComponentDocSection>

          {/* --- Checkbox (Already Done) --- */}
          <ComponentDocSection id="checkbox" title="Checkbox" description="A control that allows the user to toggle between checked and not checked.">
            <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Checkbox }'} from "@/components/ui/checkbox";</code></p>
            <VariationDisplay id="checkbox-basic" title="With Label">
              <div className="flex items-center space-x-2"><Checkbox id="terms-cb" /><Label htmlFor="terms-cb">Accept terms</Label></div>
            </VariationDisplay>
            <CodeBlock code={`<div className="flex items-center space-x-2">\n  <Checkbox id="terms" />\n  <Label htmlFor="terms">Accept terms</Label>\n</div>`} />
            <VariationDisplay id="checkbox-disabled" title="Disabled State">
              <div className="flex items-center space-x-2"><Checkbox id="terms-cb-dis" disabled /><Label htmlFor="terms-cb-dis" className="opacity-50">Disabled Checkbox</Label></div>
              <div className="flex items-center space-x-2"><Checkbox id="terms-cb-dis-chk" checked disabled /><Label htmlFor="terms-cb-dis-chk" className="opacity-50">Disabled Checked</Label></div>
            </VariationDisplay>
            <CodeBlock code={`<Checkbox id="disabled-cb" disabled />`} />
            <PropsTable data={[{prop: "checked", type:"boolean | 'indeterminate'", description:"Controlled checked state."}, {prop:"onCheckedChange", type:"(checked: boolean | 'indeterminate') => void", description:"Callback on state change."}, {prop:"disabled", type:"boolean", description:"Disables the checkbox."}]}/>
          </ComponentDocSection>


          {/* ... Continue for Collapsible, Command, etc. ... */}
          {/* --- Collapsible --- */}
            <ComponentDocSection
                id="collapsible"
                title="Collapsible"
                description="An interactive component that can hide or reveal sections of content."
            >
                <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Collapsible, CollapsibleTrigger, CollapsibleContent }'} from "@/components/ui/collapsible";</code></p>
                <VariationDisplay id="collapsible-basic" title="Basic Collapsible">
                    <Collapsible className="w-full max-w-md">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                <span>View Details</span> <ChevronsUpDown className="h-4 w-4"/>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-0.5 p-4 border-2 border-black border-t-0 rounded-none bg-gray-50 shadow-[2px_2px_0_#000]">
                            This is the collapsible content area. It can contain any other elements or components.
                            Neo-Brutalism encourages clear visual separation.
                        </CollapsibleContent>
                    </Collapsible>
                </VariationDisplay>
                <CodeBlock code={`
<Collapsible>
    <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle Section</Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="p-4 border-2 border-black border-t-0">
        Detailed content goes here...
    </CollapsibleContent>
</Collapsible>
                `} />
                <PropsTable data={[
                    {prop: "open", type: "boolean", description: "Controlled open state."},
                    {prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes."},
                    {prop: "defaultOpen", type: "boolean", description: "Initial open state (uncontrolled)."},
                    {prop: "disabled", type: "boolean", description: "Disables the collapsible trigger."},
                ]}/>
            </ComponentDocSection>

            {/* --- Command (Already Done partially) --- */}
            <ComponentDocSection
                id="command"
                title="Command"
                description="A fast, composable command menu. Can be used for search, navigation, or actions."
            >
                <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Command, CommandInput, ... }'} from "@/components/ui/command";</code></p>
                 <VariationDisplay id="command-inline" title="Inline Command Menu">
                    <Command className="rounded-none border-2 border-black shadow-[4px_4px_0_#000] w-full max-w-md">
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem onSelect={() => sonnerToast("Selected Calendar")}>Calendar</CommandItem>
                                <CommandItem onSelect={() => sonnerToast("Selected Emoji Search")}>Search Emoji</CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem onSelect={() => sonnerToast("Selected Profile")}>Profile <CommandShortcut>⌘P</CommandShortcut></CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </VariationDisplay>
                <CodeBlock code={`
<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Suggestion 1</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    {/* More groups/items */}
  </CommandList>
</Command>
                `} />
                <VariationDisplay id="command-dialog" title="Command Dialog">
                    <Button onClick={() => setCmdDialog(true)}>Open Command Dialog</Button>
                    <CommandDialog open={cmdDialog} onOpenChange={setCmdDialog}>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList><CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Quick Actions">
                                <CommandItem onSelect={() => { sonnerToast("Navigating Home"); setCmdDialog(false); }}><HomeIcon className="mr-2 h-4 w-4"/>Navigate Home</CommandItem>
                                <CommandItem onSelect={() => { sonnerToast("Opening Settings"); setCmdDialog(false); }}><Settings className="mr-2 h-4 w-4"/>Open Settings</CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </CommandDialog>
                </VariationDisplay>
                <CodeBlock code={`
const [open, setOpen] = useState(false);
// ...
<Button onClick={() => setOpen(true)}>Open Dialog</Button>
<CommandDialog open={open} onOpenChange={setOpen}>
  {/* CommandInput, CommandList, etc. */}
</CommandDialog>
                `} />
                 <PropsTable data={[
                    {prop: "(CommandDialog) open", type:"boolean", description:"Controls dialog visibility."},
                    {prop: "(CommandDialog) onOpenChange", type:"(open: boolean)=>void", description:"Callback for dialog state change."},
                    {prop: "(CommandInput) placeholder", type:"string", description:"Placeholder text."},
                    {prop: "(CommandGroup) heading", type:"string", description:"Heading for a group of items."},
                ]}/>
            </ComponentDocSection>

            {/* --- Context Menu (Already Done) --- */}
            <ComponentDocSection
                id="contextMenu"
                title="Context Menu"
                description="Displays a menu to the user —such as a set of actions or functions—triggered by a right-click."
            >
                 <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ ContextMenu, ContextMenuTrigger, ... }'} from "@/components/ui/context-menu";</code></p>
                 <VariationDisplay id="contextMenu-basic" title="Basic Context Menu">
                    <ContextMenu>
                        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-none border-2 border-dashed border-black text-sm font-semibold bg-gray-100 shadow-[3px_3px_0_#ccc]">
                        Right-click this area
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-64">
                            <ContextMenuItem inset onSelect={() => sonnerToast("Back action")}>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
                            <ContextMenuItem inset disabled>Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut></ContextMenuItem>
                            <ContextMenuItem inset onSelect={() => sonnerToast("Reload action")}>Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuCheckboxItem checked onCheckedChange={() => sonnerToast("Toggle Bookmark Bar")}>Show Bookmarks Bar</ContextMenuCheckboxItem>
                            <ContextMenuSeparator />
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                                <ContextMenuSubContent className="w-48">
                                    <ContextMenuItem>Save Page As...</ContextMenuItem>
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                        </ContextMenuContent>
                    </ContextMenu>
                 </VariationDisplay>
                 <CodeBlock code={`
<ContextMenu>
  <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Action 1</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked>Option A</ContextMenuCheckboxItem>
    <ContextMenuSub>
        <ContextMenuSubTrigger>More...</ContextMenuSubTrigger>
        <ContextMenuSubContent>
            <ContextMenuItem>Sub Action</ContextMenuItem>
        </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
                 `} />
                 {/* Props for ContextMenu parts can be extensive, focus on structure */}
            </ComponentDocSection>

          {/* ... Continue for all components ... */}

            <ComponentDocSection
                id="input"
                title="Input"
                description="A standard text input field for forms and data entry."
            >
                <p className="text-sm mb-4">Import: <code className="text-xs bg-gray-200 p-1 border border-black rounded-none">import {'{ Input }'} from "@/components/ui/input";</code></p>
                <VariationDisplay id="input-basic" title="Basic Text Input">
                <Input type="text" placeholder="Enter your name" className="max-w-sm"/>
                </VariationDisplay>
                <CodeBlock code={`<Input type="text" placeholder="Your Name" />`} />

                <VariationDisplay id="input-email" title="Email Input">
                <Input type="email" placeholder="you@example.com" className="max-w-sm"/>
                </VariationDisplay>
                <CodeBlock code={`<Input type="email" placeholder="you@example.com" />`} />

                <VariationDisplay id="input-password" title="Password Input">
                <Input type="password" placeholder="••••••••••" className="max-w-sm"/>
                </VariationDisplay>
                <CodeBlock code={`<Input type="password" placeholder="Password" />`} />

                <VariationDisplay id="input-disabled" title="Disabled Input">
                <Input type="text" placeholder="Cannot edit" disabled className="max-w-sm"/>
                </VariationDisplay>
                <CodeBlock code={`<Input type="text" placeholder="Disabled" disabled />`} />

                <PropsTable data={[
                    {prop: "type", type: "string", default: "'text'", description: "HTML input type (e.g., 'text', 'email', 'password', 'number')."},
                    {prop: "placeholder", type: "string", description: "Placeholder text for the input field."},
                    {prop: "value", type: "string | number", description: "Controlled value of the input."},
                    {prop: "onChange", type: "(event: React.ChangeEvent<HTMLInputElement>) => void", description: "Callback for value changes."},
                    {prop: "disabled", type: "boolean", default: "false", description: "If true, disables the input field."},
                    {prop: "className", type: "string", description: "Additional CSS classes."},
                ]}/>
            </ComponentDocSection>


            {/* Final placeholder */}
            <section className="mt-20 py-12 text-center border-t-4 border-black">
                <h2 className="text-2xl font-black text-black">End of UI Kit Showcase</h2>
                <p className="text-gray-700 mt-2 font-semibold">Explore the sidebar to jump to specific components.</p>
            </section>

        </main>
      </div>
    </Layout>
  );
}

// Helper for NavigationMenu Content items (Keep As Is)
const ListItemUi = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-none border-2 border-transparent p-3 leading-none no-underline outline-none transition-colors hover:bg-yellow-100 hover:text-black hover:border-black focus:shadow-md focus:border-black shadow-[2px_2px_0px_transparent] hover:shadow-[2px_2px_0px_#000]",
              className
            )}
            {...props}
          >
            <div className="text-sm font-bold leading-none text-black">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-600">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
);
ListItemUi.displayName = "ListItemUi";