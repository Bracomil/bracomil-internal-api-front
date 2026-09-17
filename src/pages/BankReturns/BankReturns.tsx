import { useState } from 'react';
import { FileUploader } from '../../components/FileUploader/FileUploader';
import { ReturnResult } from '../../components/BNBReturnJSONReader/BNBReturnJSONReader';
import { BlingMatcher } from '../../components/BlingMatcher/BlingMatcher';
import { BlingResult } from '../../components/BlingResult/BlingResult';
import { SendReturnFileMock as SendReturn, type ApiResponse } from '../../services/api';
import {
    buscarContasBling,
    darBaixaNoBling,
    type ContaConciliada,
} from '../../services/bling';
import type { FileResult } from '../../components/FileUploader/types';
import './BankReturns.css'

type PageState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: ApiResponse }
    | { status: 'error'; message: string }                                // erro geral (upload)
    | { status: 'blingError'; data: ApiResponse; message: string }        // 👈 NOVO
    | { status: 'matching'; data: ApiResponse; conciliadas: ContaConciliada[] }
    | { status: 'baixando' }
    | { status: 'baixado'; sucesso: number; falhas: number };

export function UploadPage() {
    const [state, setState] = useState<PageState>({ status: 'idle' });

    /* ---------- Upload + request do arquivo ---------- */
    async function handleProceed(file: FileResult) {
        setState({ status: 'loading' });
        try {
            const data = await SendReturn(file);
            setState({ status: 'success', data });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            setState({ status: 'error', message });
        }
    }

    /* ---------- Botão "Dar baixa no Bling" ---------- */
    async function handleDarBaixa(data: ApiResponse) {
        setState({ status: 'loading' });
        try {
            const conciliadas = await buscarContasBling(data.titulos);
            setState({ status: 'matching', data, conciliadas });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Erro ao buscar contas no Bling';
            setState({ status: 'blingError', data, message });   // 👈 volta pro ReturnResult
        }
    }

    /* ---------- Confirmar baixa ---------- */
    async function handleConfirmarBaixa(selecionadas: ContaConciliada[]) {
        setState({ status: 'baixando' });
        try {
            const { sucesso, falhas } = await darBaixaNoBling(selecionadas);
            setState({ status: 'baixado', sucesso, falhas });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao dar baixa';
            setState({ status: 'error', message });
        }
    }

    function handleVoltar() {
        setState({ status: 'idle' });
    }

    return (
        <div className="content">
            <h1>Enviar retorno bancário</h1>

            {state.status === 'idle' && (
                <FileUploader
                    accept={['.ret', '.ret.sai']}
                    onFile={() => { }}
                    onProceed={handleProceed}
                />
            )}

            {state.status === 'loading' && (
                <div className="upload-loading">
                    <div className="spinner" />
                    <p>Processando arquivo...</p>
                </div>
            )}

            {/* {state.status === 'success' && (
                <ReturnResult
                    data={state.data}
                    onVoltar={handleVoltar}
                    onDarBaixa={() => handleDarBaixa(state.data)}
                />
            )} */}

            {(state.status === 'success' || state.status === 'blingError') && (
                <>
                    {state.status === 'blingError' && (
                        <div className="bling-error-banner">
                            ⚠️ {state.message}
                        </div>
                    )}
                    <ReturnResult
                        data={state.data}
                        onVoltar={handleVoltar}
                        onDarBaixa={() => handleDarBaixa(state.data)}
                    />
                </>
            )}

            {state.status === 'matching' && (
                <BlingMatcher
                    conciliadas={state.conciliadas}
                    onConfirmar={handleConfirmarBaixa}
                    onVoltar={() => setState({ status: 'success', data: state.data })}
                />
            )}

            {state.status === 'baixando' && (
                <div className="upload-loading">
                    <div className="spinner" />
                    <p>Dando baixa no Bling...</p>
                </div>
            )}

            {state.status === 'baixado' && (
                <BlingResult
                    sucesso={state.sucesso}
                    falhas={state.falhas}
                    onVoltar={handleVoltar}
                />
            )}

            {state.status === 'error' && (
                <div className="upload-error">
                    <h2>❌ Falha</h2>
                    <p>{state.message}</p>
                    <button type="button" className="btn-reset" onClick={handleVoltar}>
                        Voltar ao início
                    </button>
                </div>
            )}
        </div>
    );
}