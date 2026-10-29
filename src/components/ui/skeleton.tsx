// shadcn/ui new-york-v4 registry component. See docs/demo/SHADCN.md for source/license.
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-md bg-accent", className)} {...props} />;
}
export { Skeleton };
