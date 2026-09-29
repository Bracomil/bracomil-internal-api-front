import { fetchWithInterceptors } from '../api/client';
import type { FileResult } from '../components/FileUploader/types';

export interface HeaderResponse {
    agencia: string;
    conta: string;
    dv_conta: string;
    nome_cedente: string;
    numero_banco: string;
    nome_banco: string;
    data_geracao: string;
    densidade_gravacao: string;
    sequencial_retorno: string;
    sequencial_registro: number;
}

export interface TitulosResponse {
    tipo_inscricao_cedente: string;
    cpf_cnpj_cedente: string;
    agencia: string;
    conta: string;
    dv_conta: string;
    numero_controle: string;
    nosso_numero: string;
    dv_nosso_numero: string;
    dv_nosso_numero_valido: boolean,
    numero_contrato: string;
    carteira: string;
    codigo_ocorrencia: string;
    descricao_ocorrencia: string;
    data_ocorrencia: string;
    seu_numero: string;
    confirmacao_nosso_numero: string;
    confirmacao_dv_nosso_numero: string;
    confirmacao_dv_valido: true,
    data_vencimento: string,
    valor_titulo_centavos: number,
    numero_banco: string,
    agencia_cobradora: string,
    especie: string,
    tarifa_cobranca_centavos: number,
    outras_despesas_centavos: number,
    juros_centavos: number,
    ioc_centavos: number,
    abatimento_centavos: number,
    desconto_centavos: number,
    valor_recebido_centavos: number,
    juros_mora_centavos: number,
    data_credito: string,
    sequencial_registro: number,
}

export interface TrailerResponse {
    codigo_servico: string,
    numero_banco: string,
    quantidade_titulos_cobranca_simples: number,
    valor_titulos_cobranca_simples_centavos: number,
    numero_aviso_lancamentos: string,
    sequencial_registro: number,
}

export interface ApiResponse {
    header: HeaderResponse,
    titulos: TitulosResponse[],
    trailer: TrailerResponse,
}

/**
 * Envia os bytes do arquivo para a API.
 * O backend recebe como multipart/form-data.
 */
export async function SendReturnFile(file: FileResult): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('arquivo_retorno', new Blob([file.bytes]), file.name);

    const response = await fetchWithInterceptors('/bnb/cnab400/return', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        // Tenta extrair mensagem do corpo, se houver
        let mensagem = `Erro ${response.status}`;
        try {
            const body = await response.json();
            if (body?.message) mensagem = body.message;
        } catch {
            // corpo não é JSON, ignora
        }
        throw new Error(mensagem);
    }

    return response.json() as Promise<ApiResponse>;
}