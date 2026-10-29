import { z } from "zod";

export const DEFAULT_MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = DEFAULT_MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

/**
 * Validates if the given file size is within the allowed threshold.
 */
export function isAcceptedFileSize(
  fileSize: number,
  maxMB: number = DEFAULT_MAX_FILE_SIZE_MB,
): boolean {
  return fileSize <= maxMB * 1024 * 1024;
}

/**
 * Validates if the file MIME type matches allowed whitelist.
 */
export function isAcceptedFileType(
  fileType: string,
  allowedTypes: readonly string[] | string[] = ACCEPTED_DOCUMENT_TYPES,
): boolean {
  return allowedTypes.includes(fileType);
}

export interface FileSchemaOptions {
  required?: boolean;
  maxSizeMB?: number;
  acceptedTypes?: readonly string[] | string[];
  message?: string;
}

/**
 * Generates a reusable type-safe Zod schema for File objects.
 */
export const createFileSchema = (options: FileSchemaOptions = {}) => {
  const {
    required = true,
    maxSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
    acceptedTypes = ACCEPTED_DOCUMENT_TYPES,
    message,
  } = options;

  const defaultMsg =
    message ||
    `File must be a valid document (PDF, PNG, JPG, WEBP) under ${maxSizeMB}MB`;

  return z.custom<File | null>(
    (value) => {
      if (value === null || value === undefined) {
        return !required;
      }
      return (
        value instanceof File &&
        isAcceptedFileSize(value.size, maxSizeMB) &&
        isAcceptedFileType(value.type, acceptedTypes)
      );
    },
    { message: defaultMsg },
  );
};

export const singleDocumentSchema = createFileSchema({ required: true });
export const optionalDocumentSchema = createFileSchema({ required: false });

