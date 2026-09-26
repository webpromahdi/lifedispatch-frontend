import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-6 border-b border-border mb-6",
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-text-muted"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.label}-${crumb.href ?? "item"}`}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors focus:outline-hidden focus:underline py-1"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(isLast && "font-medium text-text-primary")}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-text-muted shrink-0"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-text-secondary leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto min-h-[44px]">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
