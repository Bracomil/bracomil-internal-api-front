import type { TitulosResponse } from './api';

export interface ContaBling {
    id: string;
    seuNumero: string;
    cliente: string;
    valor: number;          // em centavos
    vencimento: string;     // YYYY-MM-DD
    situacao: string;
    jaBaixada: boolean;     // 👈 NOVO
}

export interface ContaConciliada {
    titulo: TitulosResponse;
    conta: ContaBling | null;
    selecionada: boolean;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Busca no Bling as contas em aberto cujo "Seu Número"
 * coincide com os títulos do arquivo de retorno.
 */
export async function buscarContasBling(
    titulos: TitulosResponse[]
): Promise<ContaConciliada[]> {
    if (USE_MOCK) return mockBuscarContas(titulos);
    await new Promise<ContaConciliada>((resolve) => setTimeout(resolve, 2000))
    throw "Não implementado"
}

/**
 * Dá baixa nas contas selecionadas no Bling.
 */
export async function darBaixaNoBling(
    conciliadas: ContaConciliada[]
): Promise<{ sucesso: number; falhas: number }> {
    if (USE_MOCK) return mockDarBaixa(conciliadas);
    await new Promise<ContaConciliada>((resolve) => setTimeout(resolve, 2000))
    throw "Não implementado"
}

/* ---------------- MOCK ---------------- */

async function mockBuscarContas(
    titulos: TitulosResponse[]
): Promise<ContaConciliada[]> {
    await new Promise((r) => setTimeout(r, 1200));

    return titulos.map((titulo, i) => {
        // Simula 3 cenários:
        // - i % 4 === 0 → sem conta
        // - i % 4 === 1 → conta já baixada
        // - resto → conta em aberto
        const semConta = i % 4 === 0;
        const jaBaixada = i % 4 === 1;

        const conta: ContaBling | null = semConta
            ? null
            : {
                id: `bling-${i}`,
                seuNumero: titulo.seu_numero,
                cliente: titulo.cpf_cnpj_cedente,
                valor: titulo.valor_titulo_centavos,
                vencimento: titulo.data_vencimento,
                situacao: jaBaixada ? 'Baixada' : 'Em aberto',
                jaBaixada,
            };

        return {
            titulo,
            conta,
            // só marca por padrão as que estão em aberto
            selecionada: !!conta && !conta.jaBaixada,
        };
    });
}

async function mockDarBaixa(
    conciliadas: ContaConciliada[]
): Promise<{ sucesso: number; falhas: number }> {
    await new Promise((r) => setTimeout(r, 1500));

    const selecionadas = conciliadas.filter((c) => c.selecionada && c.conta);
    const falhas = Math.random() < 0.2 ? 1 : 0;   // 20% de chance de 1 falha

    return {
        sucesso: selecionadas.length - falhas,
        falhas,
    };
}

/* ---------------- REAL ---------------- */
