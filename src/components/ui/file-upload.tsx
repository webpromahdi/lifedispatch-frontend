"use client";

import { AlertCircle, FileImage, FileText, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, formatFileSize } from "@/lib/utils";
import {
  ACCEPTED_DOCUMENT_TYPES,
  DEFAULT_MAX_FILE_SIZE_MB,
  isAcceptedFileSize,
  isAcceptedFileType,
} from "@/validations/file.validation";

export interface FileUploadProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  allowedTypes?: readonly string[] | string[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  id: externalId,
  label,
  description,
  error: externalError,
  value,
  onChange,
  accept = ".pdf,.png,.jpg,.jpeg,.webp",
  maxSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  allowedTypes = ACCEPTED_DOCUMENT_TYPES,
  required = false,
  disabled = false,
  className,
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const activeError = externalError || internalError;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    // Clear the input value immediately so re-selecting identical file triggers onChange
    e.target.value = "";

    if (!selected) {
      return;
    }

    if (!isAcceptedFileSize(selected.size, maxSizeMB)) {
      setInternalError(
        `File size (${formatFileSize(selected.size)}) exceeds the maximum limit of ${maxSizeMB}MB.`,
      );
      return;
    }

    if (
      allowedTypes &&
      allowedTypes.length > 0 &&
      !isAcceptedFileType(selected.type, allowedTypes)
    ) {
      setInternalError(
        "File format not supported. Please upload a valid PDF or image file.",
      );
      return;
    }

    setInternalError(null);
    onChange(selected);
  };

  const handleRemove = () => {
    onChange(null);
    setInternalError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isImage = value?.type?.startsWith("image/");

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-xs font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
        aria-invalid={Boolean(activeError)}
      />

      {/* File Action & Preview Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer shrink-0 self-start text-xs font-normal"
        >
          <Upload className="size-3.5 text-text-muted" />
          {value ? "Replace Document" : "Choose File"}
        </Button>

        {value ? (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-surface border border-border px-3 py-1.5 text-xs max-w-full">
            <div className="flex items-center gap-2 min-w-0">
              {isImage ? (
                <FileImage className="size-4 text-primary shrink-0" />
              ) : (
                <FileText className="size-4 text-primary shrink-0" />
              )}
              <span
                className="truncate max-w-[180px] sm:max-w-[240px] font-medium text-text-primary"
                title={value.name}
              >
                {value.name}
              </span>
              <span className="text-[11px] font-mono text-text-muted shrink-0">
                {formatFileSize(value.size)}
              </span>
            </div>

            <button
              type="button"
              aria-label="Remove attached file"
              onClick={handleRemove}
              disabled={disabled}
              className="text-text-muted hover:text-destructive transition-colors p-0.5 rounded-sm shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-text-muted">
            {description ||
              `Supported formats: PDF, PNG, JPG up to ${maxSizeMB}MB`}
          </span>
        )}
      </div>

      {/* Active Error Message */}
      {activeError && (
        <p className="text-[11px] text-destructive flex items-center gap-1 font-medium mt-1">
          <AlertCircle className="size-3 shrink-0" />
          {activeError}
        </p>
      )}
    </div>
  );
}
