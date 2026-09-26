"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] w-full p-6 flex flex-col items-center justify-center text-center bg-surface border border-destructive/20 rounded-xl shadow-xs">
          <div className="h-12 w-12 rounded-2xl bg-destructive-bg text-destructive flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            Something went wrong
          </h2>
          <p className="mt-1 text-sm text-text-secondary max-w-md">
            {this.state.error?.message ||
              "An unexpected error occurred while rendering this component."}
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={this.handleReset}
              className="min-h-[44px] px-4 border-border hover:bg-primary-light hover:text-primary transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
