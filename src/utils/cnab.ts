import type { TitulosResponse } from '../services/api';

/** Códigos de ocorrência que representam liquidação */
export const CODIGOS_LIQUIDACAO = ['06', '07', '08'] as const;

/** Código de liquidação parcial (destaque) */
export const CODIGO_LIQUIDACAO_PARCIAL = '07';

export function isLiquidacao(codigo: string): boolean {
    return (CODIGOS_LIQUIDACAO as readonly string[]).includes(codigo);
}

export function isLiquidacaoParcial(codigo: string): boolean {
    return codigo === CODIGO_LIQUIDACAO_PARCIAL;
}

/** Detalhamento de valores do título (em centavos) */
export interface ValoresTitulo {
    valorBoleto: number;
    tarifa: number;
    juros: number;
    ioc: number;
    outrasDespesas: number;
    abatimento: number;
    desconto: number;
    jurosMora: number;
    valorRecebido: number;
}

export function extrairValores(titulo: TitulosResponse): ValoresTitulo {
    return {
        valorBoleto: titulo.valor_titulo_centavos,
        tarifa: titulo.tarifa_cobranca_centavos,
        juros: titulo.juros_centavos,
        ioc: titulo.ioc_centavos,
        outrasDespesas: titulo.outras_despesas_centavos,
        abatimento: titulo.abatimento_centavos,
        desconto: titulo.desconto_centavos,
        jurosMora: titulo.juros_mora_centavos,
        valorRecebido: titulo.valor_recebido_centavos,
    };
}
