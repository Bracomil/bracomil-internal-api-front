export const SituacaoBling = {
    EmAberto: 1,
    Recebido: 2,
    ParcialmenteRecebido: 3,
    Devolvido: 4,
    ParcialmenteDevolvido: 5,
    Cancelado: 6,
    Confirmado: 7,
} as const;

export type SituacaoBling =
    (typeof SituacaoBling)[keyof typeof SituacaoBling];

export const SituacaoBlingLabel: Record<SituacaoBling, string> = {
    [SituacaoBling.EmAberto]: 'Em aberto',
    [SituacaoBling.Recebido]: 'Recebido',
    [SituacaoBling.ParcialmenteRecebido]: 'Parcialmente recebido',
    [SituacaoBling.Devolvido]: 'Devolvido',
    [SituacaoBling.ParcialmenteDevolvido]: 'Parcialmente devolvido',
    [SituacaoBling.Cancelado]: 'Cancelado',
    [SituacaoBling.Confirmado]: 'Confirmado',
};

export const SituacaoBlingCor: Record<SituacaoBling, string> = {
    [SituacaoBling.EmAberto]: 'aberta',
    [SituacaoBling.Recebido]: 'recebida',
    [SituacaoBling.ParcialmenteRecebido]: 'parcial',
    [SituacaoBling.Devolvido]: 'devolvida',
    [SituacaoBling.ParcialmenteDevolvido]: 'parcial',
    [SituacaoBling.Cancelado]: 'cancelada',
    [SituacaoBling.Confirmado]: 'recebida',
};