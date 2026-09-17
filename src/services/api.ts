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
export async function SendReturnFile(
    file: FileResult
): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('arquivo', new Blob([file.bytes]), file.name);

    const response = await fetch('https://sua-api.com/retorno', {
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

export async function SendReturnFileMock(
    _: FileResult
): Promise<ApiResponse> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        "header": {
            "agencia": "0300",
            "conta": "0025193",
            "dv_conta": "9",
            "nome_cedente": "BRASIL COMERCIO E INDUSTRIA LT",
            "numero_banco": "004",
            "nome_banco": "B.DO NORDESTE",
            "data_geracao": "2026-09-09",
            "densidade_gravacao": "01600BPI",
            "sequencial_retorno": "00556",
            "sequencial_registro": 1
        },
        "titulos": [
            {
                "tipo_inscricao_cedente": "02",
                "cpf_cnpj_cedente": "01015273000172",
                "agencia": "0300",
                "conta": "0025193",
                "dv_conta": "9",
                "numero_controle": "OB738596549",
                "nosso_numero": "0052665",
                "dv_nosso_numero": "7",
                "dv_nosso_numero_valido": true,
                "numero_contrato": "0000000001",
                "carteira": "5",
                "codigo_ocorrencia": "06",
                "descricao_ocorrencia": "LIQUIDACAO NORMAL",
                "data_ocorrencia": "2026-09-09",
                "seu_numero": "19842-3",
                "confirmacao_nosso_numero": "0052665",
                "confirmacao_dv_nosso_numero": "7",
                "confirmacao_dv_valido": true,
                "data_vencimento": "2026-09-09",
                "valor_titulo_centavos": 103839,
                "numero_banco": "004",
                "agencia_cobradora": "0016",
                "especie": "01",
                "tarifa_cobranca_centavos": 410,
                "outras_despesas_centavos": 0,
                "juros_centavos": 0,
                "ioc_centavos": 0,
                "abatimento_centavos": 0,
                "desconto_centavos": 0,
                "valor_recebido_centavos": 103839,
                "juros_mora_centavos": 0,
                "data_credito": "2026-09-09",
                "sequencial_registro": 2
            },
            {
                "tipo_inscricao_cedente": "02",
                "cpf_cnpj_cedente": "01015273000172",
                "agencia": "0300",
                "conta": "0025193",
                "dv_conta": "9",
                "numero_controle": "OB738668058",
                "nosso_numero": "0052676",
                "dv_nosso_numero": "2",
                "dv_nosso_numero_valido": true,
                "numero_contrato": "0000000001",
                "carteira": "5",
                "codigo_ocorrencia": "06",
                "descricao_ocorrencia": "LIQUIDACAO NORMAL",
                "data_ocorrencia": "2026-09-09",
                "seu_numero": "19903-1",
                "confirmacao_nosso_numero": "0052676",
                "confirmacao_dv_nosso_numero": "2",
                "confirmacao_dv_valido": true,
                "data_vencimento": "2026-09-09",
                "valor_titulo_centavos": 113400,
                "numero_banco": "004",
                "agencia_cobradora": "0016",
                "especie": "01",
                "tarifa_cobranca_centavos": 410,
                "outras_despesas_centavos": 0,
                "juros_centavos": 0,
                "ioc_centavos": 0,
                "abatimento_centavos": 0,
                "desconto_centavos": 0,
                "valor_recebido_centavos": 113400,
                "juros_mora_centavos": 0,
                "data_credito": "2026-09-09",
                "sequencial_registro": 3
            },
            {
                "tipo_inscricao_cedente": "02",
                "cpf_cnpj_cedente": "01015273000172",
                "agencia": "0300",
                "conta": "0025193",
                "dv_conta": "9",
                "numero_controle": "OB738730835",
                "nosso_numero": "0052694",
                "dv_nosso_numero": "0",
                "dv_nosso_numero_valido": true,
                "numero_contrato": "0000000001",
                "carteira": "5",
                "codigo_ocorrencia": "06",
                "descricao_ocorrencia": "LIQUIDACAO NORMAL",
                "data_ocorrencia": "2026-09-09",
                "seu_numero": "19951-2",
                "confirmacao_nosso_numero": "0052694",
                "confirmacao_dv_nosso_numero": "0",
                "confirmacao_dv_valido": true,
                "data_vencimento": "2026-09-08",
                "valor_titulo_centavos": 56667,
                "numero_banco": "004",
                "agencia_cobradora": "0016",
                "especie": "01",
                "tarifa_cobranca_centavos": 410,
                "outras_despesas_centavos": 0,
                "juros_centavos": 0,
                "ioc_centavos": 0,
                "abatimento_centavos": 0,
                "desconto_centavos": 0,
                "valor_recebido_centavos": 57951,
                "juros_mora_centavos": 1284,
                "data_credito": "2026-09-09",
                "sequencial_registro": 4
            },
            {
                "tipo_inscricao_cedente": "02",
                "cpf_cnpj_cedente": "01015273000172",
                "agencia": "0300",
                "conta": "0025193",
                "dv_conta": "9",
                "numero_controle": "OB738731299",
                "nosso_numero": "0052698",
                "dv_nosso_numero": "3",
                "dv_nosso_numero_valido": true,
                "numero_contrato": "0000000001",
                "carteira": "5",
                "codigo_ocorrencia": "06",
                "descricao_ocorrencia": "LIQUIDACAO NORMAL",
                "data_ocorrencia": "2026-09-09",
                "seu_numero": "19944",
                "confirmacao_nosso_numero": "0052698",
                "confirmacao_dv_nosso_numero": "3",
                "confirmacao_dv_valido": true,
                "data_vencimento": "2026-09-07",
                "valor_titulo_centavos": 57500,
                "numero_banco": "004",
                "agencia_cobradora": "0016",
                "especie": "01",
                "tarifa_cobranca_centavos": 410,
                "outras_despesas_centavos": 0,
                "juros_centavos": 0,
                "ioc_centavos": 0,
                "abatimento_centavos": 0,
                "desconto_centavos": 0,
                "valor_recebido_centavos": 58956,
                "juros_mora_centavos": 1456,
                "data_credito": "2026-09-09",
                "sequencial_registro": 5
            }
        ],
        "trailer": {
            "codigo_servico": "01",
            "numero_banco": "004",
            "quantidade_titulos_cobranca_simples": 0,
            "valor_titulos_cobranca_simples_centavos": 611020103,
            "numero_aviso_lancamentos": "00000244",
            "sequencial_registro": 6
        }
    }

}