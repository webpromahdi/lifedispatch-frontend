import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-6 shadow-xs">
        <AlertCircle className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="mt-2 text-sm text-text-secondary max-w-md">
        The requested LifeDispatch operational resource does not exist or has
        been relocated.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link href="/">
          <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-5 cursor-pointer">
            <Home className="h-4 w-4 mr-2" aria-hidden="true" />
            Return Home
          </Button>
        </Link>
        <Link href="/dev/components">
          <Button
            variant="outline"
            className="min-h-[44px] border-border cursor-pointer"
          >
            Dev Components
          </Button>
        </Link>
      </div>
    </div>
  );
}
