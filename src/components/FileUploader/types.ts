export interface FileResult {
    name: string;
    size: number;
    type: string;
    bytes: ArrayBuffer;
    file: File;   // o File original, útil pra preview, etc.
}

export interface FileUploaderProps {
    accept: string[];
    onFile: (result: FileResult) => void;
    onError?: (message: string) => void;
    onProceed?: (result: FileResult) => void;   // 👈 novo
    hint?: string;
    maxSize?: number;
}