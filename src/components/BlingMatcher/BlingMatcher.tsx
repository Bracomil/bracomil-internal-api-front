import { useState } from 'react';
import type { ContaConciliada, GrupoConciliacao } from '../../services/bling';
import { isLiquidacaoParcial, extrairValores } from '../../utils/cnab';
import { SituacaoBlingLabel, SituacaoBlingCor, SituacaoBling } from '../../types/bling';
import type { TitulosResponse } from '../../services/api';
import { usePermission } from "../../hooks/usePermission";
import { PERMISSIONS } from '../../types/permissions';

import './BlingMatcher.css';

interface BlingMatcherProps {
    conciliadas: ContaConciliada[];
    onConfirmar: (selecionadas: ContaConciliada[]) => void;
    onVoltar: () => void;
}

function formatBRL(centavos: number): string {
    return (centavos / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function podeSelecionar(c: ContaConciliada): boolean {
    return c.grupo === 'liquidacao' && !!c.conta && c.conta.situacao !== SituacaoBling.Recebido;
}

function Info({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`info-item ${highlight ? 'highlight' : ''}`}>
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    );
}

function ValoresDetalhe({ titulo }: { titulo: TitulosResponse }) {
    const v = extrairValores(titulo);
    return (
        <div className="valores-detalhe">
            <Info label="Valor do boleto" value={formatBRL(v.valorBoleto)} />
            <Info label="Tarifa" value={formatBRL(v.tarifa)} />
            <Info label="Juros" value={formatBRL(v.juros)} />
            <Info label="IOC" value={formatBRL(v.ioc)} />
            <Info label="Outras despesas" value={formatBRL(v.outrasDespesas)} />
            <Info label="Abatimento" value={formatBRL(v.abatimento)} />
            <Info label="Desconto" value={formatBRL(v.desconto)} />
            <Info label="Juros de mora" value={formatBRL(v.jurosMora)} />
            <Info
                label="Valor recebido"
                value={formatBRL(v.valorRecebido)}
                highlight
            />
        </div>
    );
}

function LiquidacaoRow({ conciliada, selecionada, onToggle, }: {
    conciliada: ContaConciliada; index: number; selecionada: boolean; onToggle: () => void;
}) {
    const [expandido, setExpandido] = useState(false);
    const { titulo, conta } = conciliada;
    if (!conta) return null;

    const jaBaixada = conta.situacao === SituacaoBling.Recebido
    const parcial = isLiquidacaoParcial(titulo.codigo_ocorrencia);
    return (
        <>
            <tr
                className={`${jaBaixada ? 'row-baixada' : ''} ${parcial ? 'row-parcial' : ''}`}
            >
                <td>
                    <input
                        type="checkbox"
                        checked={jaBaixada ? true : selecionada}
                        disabled={jaBaixada}
                        onChange={onToggle}
                    />
                </td>
                <td>{titulo.seu_numero || '—'}</td>
                <td>{titulo.data_vencimento}</td>
                <td>{formatBRL(titulo.valor_titulo_centavos)}</td>
                <td>
                    <span className={`badge situacao ${SituacaoBlingCor[conta.situacao]}`}>
                        {SituacaoBlingLabel[conta.situacao]}
                    </span>
                </td>
                <td>
                    <span className={`badge ocorrencia ${parcial ? 'parcial' : ''}`}>
                        {titulo.codigo_ocorrencia} — {titulo.descricao_ocorrencia}
                        {parcial && <strong> (parcial)</strong>}
                    </span>
                </td>
                <td>
                    <button
                        type="button"
                        className="btn-expand"
                        onClick={() => setExpandido((v) => !v)}
                        title="Ver valores detalhados"
                    >
                        {expandido ? '▲' : '▼'}
                    </button>
                </td>
            </tr>

            {expandido && (
                <tr className="row-detalhes">
                    <td colSpan={7}>
                        <ValoresDetalhe titulo={titulo} />
                    </td>
                </tr>
            )}
        </>
    );
}

export function BlingMatcher({
    conciliadas,
    onConfirmar,
    onVoltar,
}: BlingMatcherProps) {
    const { can } = usePermission();
    const canSettle = can(PERMISSIONS.BANK_RETURNS_SETTLE);

    // Ordena: liquidação → encontrada → semMatch
    const ordem: Record<GrupoConciliacao, number> = {
        liquidacao: 0,
        encontrada: 1,
        semMatch: 2,
    };

    const ordenadas = [...conciliadas].sort(
        (a, b) => ordem[a.grupo] - ordem[b.grupo]
    );

    const liquidacoes = ordenadas.filter((c) => c.grupo === 'liquidacao');
    const encontradas = ordenadas.filter((c) => c.grupo === 'encontrada');
    const semMatch = ordenadas.filter((c) => c.grupo === 'semMatch');

    const [selecoes, setSelecoes] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(
            ordenadas.map((c, i) => [`${i}`, podeSelecionar(c) && c.selecionada])
        )
    );

    const selecionaveis = ordenadas.filter(podeSelecionar);
    const selecionadas = ordenadas.filter(
        (c, i) => selecoes[`${i}`] && podeSelecionar(c)
    );
    const todosSelecionados =
        selecionaveis.length > 0 && selecionadas.length === selecionaveis.length;

    function toggle(i: number) {
        if (!podeSelecionar(ordenadas[i])) return;
        setSelecoes((s) => ({ ...s, [`${i}`]: !s[`${i}`] }));
    }

    function toggleTodos(checked: boolean) {
        const next = { ...selecoes };
        ordenadas.forEach((c, i) => {
            if (podeSelecionar(c)) next[`${i}`] = checked;
        });
        setSelecoes(next);
    }

    function handleConfirmar() {
        const selecionadasFinal = ordenadas
            .map((c, i) => ({ ...c, selecionada: !!selecoes[`${i}`] }))
            .filter((c) => c.selecionada && podeSelecionar(c));
        onConfirmar(selecionadasFinal);
    }
    return (
        <div className="bling-matcher">
            <header>
                <p>
                    {liquidacoes.length} liquidação(ões), {encontradas.length} evento(s)
                    relacionado(s), {semMatch.length} sem correspondência.
                </p>
            </header>

            {/* ---------- LIQUIDAÇÕES ---------- */}
            {liquidacoes.length > 0 && (
                <section>
                    <h3>💰 Liquidações ({liquidacoes.length})</h3>
                    <p className="section-hint">
                        Eventos de liquidação (06, 07, 08). Selecione as que deseja dar baixa.
                    </p>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                {/* Procurando por que selecionar todos está aparecendo mesmo sem nada e testando se realmente está aparecendo em liquidações em aberto no Bling */}
                                <th className="th-select">
                                    <label className="select-all">
                                        <input
                                            id="select-all"
                                            type="checkbox"
                                            checked={todosSelecionados}
                                            disabled={selecionaveis.length === 0}
                                            onChange={(e) => toggleTodos(e.target.checked)}
                                        />
                                    </label>
                                </th>
                                <th>Seu número</th>
                                <th>Vencimento</th>
                                <th>Valor total</th>
                                <th>Situação Bling</th>
                                <th>Evento</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenadas.map((c, i) => {
                                if (c.grupo !== 'liquidacao' || !c.conta) return null;
                                return (
                                    <LiquidacaoRow
                                        key={i}
                                        conciliada={c}
                                        index={i}
                                        selecionada={!!selecoes[`${i}`]}
                                        onToggle={() => toggle(i)}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---------- ENCONTRADAS (não-liquidação) ---------- */}
            {encontradas.length > 0 && (
                <section>
                    <h3>📌 Eventos relacionados ({encontradas.length})</h3>
                    <p className="section-hint">
                        Contas encontradas no Bling, mas com eventos que não representam liquidação.
                    </p>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th>Seu número</th>
                                <th>Vencimento</th>
                                <th>Situação Bling</th>
                                <th>Evento do arquivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenadas.map((c, i) => {
                                if (c.grupo !== 'encontrada' || !c.conta) return null;
                                return (
                                    <tr key={i}>
                                        <td>{c.titulo.seu_numero || '—'}</td>
                                        <td>{c.titulo.data_vencimento}</td>
                                        <td>
                                            <span className={`badge situacao ${SituacaoBlingCor[c.conta.situacao]}`}>
                                                {SituacaoBlingLabel[c.conta.situacao]}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge ocorrencia">
                                                {c.titulo.codigo_ocorrencia} — {c.titulo.descricao_ocorrencia}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---------- SEM MATCH ---------- */}
            {semMatch.length > 0 && (
                <section className="sem-match">
                    <h3>⚠️ Sem correspondência ({semMatch.length})</h3>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th>Seu número</th>
                                <th>Vencimento</th>
                                <th>Situação Bling</th>
                                <th>Evento do arquivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenadas.map((c, i) => {
                                if (c.grupo !== 'semMatch') return null;
                                return (
                                    <tr key={i} className="row-warning">
                                        <td>{c.titulo.seu_numero || '—'}</td>
                                        <td>{c.titulo.data_vencimento}</td>
                                        <td>—</td>
                                        <td>
                                            <span className="badge ocorrencia">
                                                {c.titulo.codigo_ocorrencia} — {c.titulo.descricao_ocorrencia}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}

            <footer className="bling-actions">
                <button type="button" className="btn-secondary" onClick={onVoltar}>
                    Voltar
                </button>
                {canSettle && (
                    <button
                        type="button"
                        className="btn-primary"
                        disabled={selecionadas.length === 0}
                        onClick={handleConfirmar}
                    >
                        Dar baixa ({selecionadas.length})
                    </button>
                )}
            </footer>
        </div>
    );
}