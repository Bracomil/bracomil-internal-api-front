import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import type { FileResult, FileUploaderProps } from './types';
import './FileUploader.css';

export function FileUploader({
    accept,
    onFile,
    onError,
    hint,
    maxSize,
    onProceed,   // 👈 novo callback opcional
}: FileUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<FileResult | null>(null);   // 👈 guarda o arquivo
    const [error, setError] = useState<string | null>(null);

    /** Formata bytes em KB/MB legível */
    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    /** Valida e lê o arquivo */
    async function handleFile(selected: File) {
        setError(null);

        // Bloqueia se já tem arquivo carregado
        if (file) return;

        // Validação de extensão
        const nameLower = selected.name.toLowerCase();
        const isAccepted = accept.some((ext) => nameLower.endsWith(ext.toLowerCase()));

        if (!isAccepted) {
            const msg = `Arquivo não aceito. Extensões permitidas: ${accept.join(', ')}`;
            setError(msg);
            onError?.(msg);
            return;
        }

        // Validação de tamanho
        if (maxSize && selected.size > maxSize) {
            const msg = `Arquivo muito grande (${formatSize(selected.size)}). Máximo: ${formatSize(maxSize)}`;
            setError(msg);
            onError?.(msg);
            return;
        }

        // Leitura dos bytes
        try {
            const bytes = await selected.arrayBuffer();
            const result: FileResult = {
                name: selected.name,
                size: selected.size,
                type: selected.type,
                bytes,
                file: selected,
            };
            setFile(result);
            onFile(result);
        } catch {
            const msg = 'Falha ao ler o arquivo.';
            setError(msg);
            onError?.(msg);
        }
    }

    /** Limpa o estado e "apaga" o arquivo da memória */
    function handleClear() {
        setFile(null);
        setError(null);
        // limpa a referência no input pra permitir re-selecionar o mesmo arquivo
        if (inputRef.current) inputRef.current.value = '';
    }

    /** Confirma o uso do arquivo e libera pra novo upload */
    function handleProceed() {
        if (!file) return;
        onProceed?.(file);
        handleClear();
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
        e.target.value = '';
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (file) return;   // 👈 bloqueia drag se já tem arquivo
        setIsDragging(true);
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        if (file) return;   // 👈 bloqueia drop se já tem arquivo
        const selected = e.dataTransfer.files?.[0];
        if (selected) handleFile(selected);
    }

    function openPicker() {
        if (file) return;   // 👈 bloqueia clique se já tem arquivo
        inputRef.current?.click();
    }

    return (
        <div className="file-uploader">
            {/* Dropzone */}
            <div
                className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'locked' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openPicker}
                role="button"
                tabIndex={file ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openPicker();
                }}
                aria-disabled={!!file}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept.join(',')}
                    onChange={handleInputChange}
                    hidden
                    disabled={!!file}
                />

                <div className="dropzone-content">
                    {file ? (
                        <>
                            <span className="dropzone-icon">✅</span>
                            <p className="dropzone-title">{file.name}</p>
                            <p className="dropzone-hint">{formatSize(file.size)}</p>
                        </>
                    ) : (
                        <>
                            <span className="dropzone-icon">📁</span>
                            <p className="dropzone-title">
                                {isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
                            </p>
                            {hint && <p className="dropzone-hint">{hint}</p>}
                            <p className="dropzone-types">
                                Aceitos: {accept.join(', ')}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Mensagem de erro */}
            {error && <div className="upload-feedback error">❌ {error}</div>}

            {/* Ações quando tem arquivo */}
            {file && (
                <div className="upload-actions">
                    <button type="button" className="btn-clear" onClick={handleClear}>
                        Remover
                    </button>
                    <button type="button" className="btn-proceed" onClick={handleProceed}>
                        Prosseguir
                    </button>
                </div>
            )}
        </div>
    );
}