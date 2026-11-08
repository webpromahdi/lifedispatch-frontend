import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-primary-light border-2 border-primary/40 text-primary flex items-center justify-center mb-6 shadow-xs">
        <AlertCircle className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
        404 Page Not Found
      </h1>
      <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-md">
        The requested LifeDispatch operational resource does not exist or has
        been relocated.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link href="/">
          <Button className="min-h-11 sm:min-h-12 px-6 bg-primary hover:bg-primary-dark text-white font-bold text-sm sm:text-base rounded-[3px] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[1px_1px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2">
            <Home className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
