import { useState } from 'react';
import type { ContaConciliada } from '../../services/bling';
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

/** Uma conta pode ser selecionada? */
function podeSelecionar(c: ContaConciliada): boolean {
    return !!c.conta && !c.conta.jaBaixada;
}

export function BlingMatcher({
    conciliadas,
    onConfirmar,
    onVoltar,
}: BlingMatcherProps) {
    const ordenadas = [...conciliadas].sort((a, b) => {
        const aBaixada = a.conta?.jaBaixada ?? false;
        const bBaixada = b.conta?.jaBaixada ?? false;
        if (aBaixada === bBaixada) return 0;   // mesma categoria → mantém ordem
        return aBaixada ? 1 : -1;              // baixadas vão pro fim
    });

    const [selecoes, setSelecoes] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(
            ordenadas.map((c, i) => [`${i}`, podeSelecionar(c) && c.selecionada])
        )
    );

    const comMatch = ordenadas.filter((c) => c.conta);
    const semMatch = ordenadas.filter((c) => !c.conta);
    const selecionaveis = ordenadas.filter(podeSelecionar);
    const selecionadas = ordenadas.filter(
        (c, i) => selecoes[`${i}`] && podeSelecionar(c)
    );

    function toggle(i: number) {
        const c = ordenadas[i];
        if (!podeSelecionar(c)) return;   // 👈 bloqueia já baixadas
        setSelecoes((s) => ({ ...s, [`${i}`]: !s[`${i}`] }));
    }

    function toggleTodos(checked: boolean) {
        const next: Record<string, boolean> = { ...selecoes };
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

    const todosSelecionados =
        selecionaveis.length > 0 && selecionadas.length === selecionaveis.length;

    return (
        <div className="bling-matcher">
            <header>
                <h2>🔗 Conciliação com o Bling</h2>
                <p>
                    {comMatch.length} de {ordenadas.length} títulos têm conta correspondente.
                </p>
            </header>

            {comMatch.length > 0 && (
                <section>
                    <h3>✅ Contas encontradas ({comMatch.length})</h3>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th className="th-select">
                                    <label className="select-all">
                                        <input
                                            type="checkbox"
                                            checked={todosSelecionados}
                                            disabled={selecionaveis.length === 0}
                                            onChange={(e) => toggleTodos(e.target.checked)}
                                        />
                                    </label>
                                </th>
                                <th>Seu número</th>
                                <th>Cliente</th>
                                <th>Vencimento</th>
                                <th>Valor</th>
                                <th id="situacao">Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenadas.map((c, i) => {
                                if (!c.conta) return null;
                                const jaBaixada = c.conta.jaBaixada;

                                return (
                                    <tr key={i} className={jaBaixada ? 'row-baixada' : ''}>
                                        <td>
                                            {jaBaixada ? (
                                                <span className="dash">—</span>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={!!selecoes[`${i}`]}
                                                    onChange={() => toggle(i)}
                                                />
                                            )}
                                        </td>
                                        <td>{c.conta.seuNumero}</td>
                                        <td>{c.conta.cliente}</td>
                                        <td>{c.conta.vencimento}</td>
                                        <td>{formatBRL(c.conta.valor)}</td>
                                        <td>
                                            <span className={`badge situacao ${jaBaixada ? 'baixada' : 'aberta'}`}>
                                                {c.conta.situacao}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}

            {semMatch.length > 0 && (
                <section className="sem-match">
                    <h3>⚠️ Sem correspondência ({semMatch.length})</h3>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th>Seu número</th>
                                <th>Nosso número</th>
                                <th>Vencimento</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semMatch.map((c, i) => (
                                <tr key={i} className="row-warning">
                                    <td>{c.titulo.seu_numero || '—'}</td>
                                    <td>{c.titulo.nosso_numero}</td>
                                    <td>{c.titulo.data_vencimento}</td>
                                    <td>{formatBRL(c.titulo.valor_titulo_centavos)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <footer className="bling-actions">
                <button type="button" className="btn-secondary" onClick={onVoltar}>
                    Voltar
                </button>
                <button
                    type="button"
                    className="btn-primary"
                    disabled={selecionadas.length === 0}
                    onClick={handleConfirmar}
                >
                    Dar baixa ({selecionadas.length})
                </button>
            </footer>
        </div>
    );
}