import type { TitulosResponse } from './api';
import { isLiquidacao } from "../utils/cnab"
import { SituacaoBling } from "../types/bling"
import { fetchWithInterceptors } from '../api/client';

export interface ContaBling {
    id: string;
    seuNumero: string;
    cliente: string;
    valor: number;          // em centavos
    vencimento: string;     // YYYY-MM-DD
    situacao: SituacaoBling;
}

export type GrupoConciliacao = 'liquidacao' | 'encontrada' | 'semMatch';

export interface ContaConciliada {
    titulo: TitulosResponse;
    conta: ContaBling | null;
    grupo: GrupoConciliacao;   // 👈 NOVO
    selecionada: boolean;
}

/* ---------- Resposta da baixa em lote ---------- */

export interface SettleBatchReceiptsResponse {
    total: number;
    successes: number;
    failures: number;
    results: SettleBatchReceiptsResponseItem[];
}

export interface SettleBatchReceiptsResponseItem {
    receivableId: number;
    status: 'success' | 'error';
    bordero?: { id: number };
    error?: { code: string; message: string };
}

/** Junta o resultado da API com os dados originais pra renderizar */
export interface SettleResultItem {
    receivableId: number;
    status: 'success' | 'error';
    bordero?: { id: number };
    error?: { code: string; message: string };
    /** Título original (do arquivo de retorno) */
    titulo: TitulosResponse;
    /** Conta no Bling (pra mostrar cliente, valor, etc.) */
    conta: ContaBling;
}

export function classificar(c: Omit<ContaConciliada, 'grupo' | 'selecionada'>): ContaConciliada {
    const codigo = c.titulo.codigo_ocorrencia;
    let grupo: GrupoConciliacao;

    if (!c.conta) {
        grupo = 'semMatch';
    } else if (isLiquidacao(codigo)) {
        grupo = 'liquidacao';
    } else {
        grupo = 'encontrada';
    }

    return {
        ...c,
        grupo,
        // só liquidáveis começam selecionadas
        selecionada: grupo === 'liquidacao',
    };
}

interface AccountsReceivableDTO {
    id: number;
    situacao: number;
    vencimento: string;
    valor: number;
    idTransacao?: string;
    linkQRCodePix?: string;
    linkBoleto?: string;
    dataEmissao?: string;
    contato: {
        id: number;
        nome?: string;
        numeroDocumento?: string;
        tipo?: string;
    };
    formaPagamento?: { id: number; codigoFiscal?: number };
    contaContabil?: { id: number; descricao?: string };
    origem?: {
        id: number;
        tipoOrigem?: string;
        numero?: string;
        dataEmissao?: string;
        valor?: number;
        situacao?: number;
        url?: string;
    };
}

interface AccountsReceivableListResponse {
    data: AccountsReceivableDTO[];
    meta: {
        page: number;
        limit: number;
        count: number;
        cached: boolean;
    };
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Busca no Bling as contas em aberto cujo "Seu Número"
 * coincide com os títulos do arquivo de retorno.
 */
export async function buscarContasBling(
    titulosBanco: TitulosResponse[]
): Promise<ContaConciliada[]> {
    // 1. Extrai as datas únicas de vencimento dos títulos do banco
    const datasUnicas = Array.from(
        new Set(
            titulosBanco
                .map((t) => t.data_vencimento)
                .filter((d): d is string => Boolean(d))
        )
    );

    if (datasUnicas.length === 0) {
        return [];
    }

    // 2. Busca as contas do Bling, uma request por data
    const contasBlingPorNumeroNF = new Map<string, AccountsReceivableDTO>();
    for (const data of datasUnicas) {
        const query = new URLSearchParams();
        query.set("filterDate", data); // DD-MM-YYYY
        const res = await fetchWithInterceptors(`/bling/contas/receber?${query.toString()}`);
        if (!res.ok) {
            throw new Error(`Erro ao buscar contas para ${data}: ${res.status}`);
        }

        const { data: contas } = (await res.json()) as AccountsReceivableListResponse;
        // Tratamento para respostas vazias - Se não houve resposta, ignorar esta data  
        if (contas === null) {
            continue
        }
        // 3. Indexa apenas as que vieram de nota fiscal
        for (const conta of contas) {
            if (conta.origem?.tipoOrigem?.toLowerCase() === "notafiscal" && conta.origem.numero) {
                contasBlingPorNumeroNF.set(conta.origem.numero.replace(/^0+|-\d+$/g, ''), conta);
            }
        }
    }

    // 4. Monta o resultado
    return titulosBanco.map((titulo) => {
        const contaBling = contasBlingPorNumeroNF.get(titulo.seu_numero.replace(/^0+|-\d+$/g, ''));

        if (!contaBling) {
            return {
                titulo,
                conta: null,
                grupo: "semMatch",
                selecionada: false,
            };
        }

        const conta: ContaBling = {
            id: String(contaBling.id),
            seuNumero: titulo.seu_numero,
            cliente: contaBling.contato.nome ?? "",
            valor: Math.round(contaBling.valor * 100),
            vencimento: contaBling.vencimento,
            situacao: contaBling.situacao as SituacaoBling,
        };

        return {
            titulo,
            conta,
            grupo: isLiquidacao(titulo.codigo_ocorrencia) ? "liquidacao" : "encontrada",
            selecionada: false,
        };
    });
}

/**
 * Dá baixa nas contas selecionadas no Bling.
 */
export interface DarBaixaResult {
    response: SettleBatchReceiptsResponse;
    /** Itens da resposta enriquecidos com titulo/conta */
    results: SettleResultItem[];
    /** Itens que foram selecionados mas NÃO foram enviados (opcional) */
    skipped: ContaConciliada[];
}

export async function darBaixaNoBling(selecionadas: ContaConciliada[]): Promise<DarBaixaResult> {
    if (USE_MOCK) return mockDarBaixa(selecionadas);
    const response = await fetchWithInterceptors('/bling/contas/receber/baixar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            baixas: selecionadas
                .filter((c) => c.conta)
                .map((c) => {
                    return {
                        id: Number(c.conta?.id),
                        info: {
                            data: c.titulo.data_ocorrencia,
                            valorRecebido: c.titulo.valor_recebido_centavos,
                            juros: c.titulo.juros_mora_centavos,
                            desconto: c.titulo.desconto_centavos,
                            tarifa: c.titulo.tarifa_cobranca_centavos
                        }
                    }
                }),

        }),
    });

    if (!response.ok && response.status !== 500) {
        throw new Error(`Erro ao dar baixa: ${response.status}. ${JSON.stringify(response.body)}`);
    }

    const data = (await response.json()) as SettleBatchReceiptsResponse;
    console.log("data:")
    console.log(data)

    // Enriquecer cada item com os dados originais
    const results: SettleResultItem[] = data.results.map((item) => {
        const conciliada = selecionadas.find(
            (c) => c.conta && Number(c.conta.id) === item.receivableId
        )!;
        return {
            ...item,
            titulo: conciliada.titulo,
            conta: conciliada.conta!,
        };
    });

    return { response: data, results, skipped: [] };
}


/* ---------------- MOCK ---------------- */

// async function mockBuscarContas(
//     titulos: TitulosResponse[]
// ): Promise<ContaConciliada[]> {
//     await new Promise((r) => setTimeout(r, 1200));

//     return titulos.map((titulo, i) => {
//         const semConta = i % 5 === 0;
//         const jaBaixada = i % 4 === 1;

//         const conta: ContaBling | null = semConta
//             ? null
//             : {
//                 id: `bling-${i}`,
//                 seuNumero: titulo.seu_numero,
//                 cliente: `Cliente ${i + 1}`,
//                 valor: titulo.valor_titulo_centavos,
//                 vencimento: titulo.data_vencimento,
//                 situacao: jaBaixada ? 'Baixada' : 'Em aberto',
//                 jaBaixada,
//             };

//         return classificar({ titulo, conta });
//     });
// }

async function mockDarBaixa(
    selecionadas: ContaConciliada[]
): Promise<DarBaixaResult> {
    await new Promise((r) => setTimeout(r, 1200));

    const results: SettleResultItem[] = selecionadas
        .filter((c) => c.conta)
        .map((c, i) => {
            // 20% de chance de erro
            const isError = i % 5 === 0;
            if (isError) {
                return {
                    receivableId: Number(c.conta!.id),
                    status: 'error',
                    error: {
                        code: 'RECEIVABLE_ALREADY_SETTLED',
                        message: 'Conta já foi baixada anteriormente.',
                    },
                    titulo: c.titulo,
                    conta: c.conta!,
                };
            }
            return {
                receivableId: Number(c.conta!.id),
                status: 'success',
                bordero: { id: 900000 + i },
                titulo: c.titulo,
                conta: c.conta!,
            };
        });

    const successes = results.filter((r) => r.status === 'success').length;
    const failures = results.filter((r) => r.status === 'error').length;

    return {
        response: {
            total: results.length,
            successes,
            failures,
            results: results.map(({ titulo, conta, ...rest }) => rest),
        },
        results,
        skipped: [], // no mock, nada fica de fora
    };
}

/* ---------------- REAL ---------------- */
