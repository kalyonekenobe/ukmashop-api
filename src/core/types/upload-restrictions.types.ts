export interface UploadRestriction {
  fieldname: string;
  minFileSize?: number;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
}
