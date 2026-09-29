import type { SettleResultItem } from '../../services/bling';
import type { ContaConciliada } from '../../services/bling';
import './BlingResult.css';

interface BlingResultProps {
    results: SettleResultItem[];
    skipped: ContaConciliada[];
    onVoltar: () => void;
}

function formatBRL(centavos: number): string {
    return (centavos / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}


export function BlingResult({ results, skipped, onVoltar }: BlingResultProps) {
    const successes = results.filter((r) => r.status === 'success');
    const failures = results.filter((r) => r.status === 'error');

    console.log(results)

    return (
        <div className="bling-result">
            <header className="bling-result-header">
                <h2>Baixa concluída</h2>
                <p className="bling-result-summary">
                    <span className="badge success">{successes.length} sucesso(s)</span>
                    {failures.length > 0 && (
                        <span className="badge error">{failures.length} falha(s)</span>
                    )}
                    {skipped.length > 0 && (
                        <span className="badge skipped">{skipped.length} não enviada(s)</span>
                    )}
                </p>
            </header>

            {/* ---------- SUCESSOS ---------- */}
            {successes.length > 0 && (
                <section>
                    <h3>✅ Baixas realizadas ({successes.length})</h3>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th>Seu número</th>
                                <th>Cliente</th>
                                <th>Valor</th>
                                <th>Borderô</th>
                            </tr>
                        </thead>
                        <tbody>
                            {successes.map((r) => (
                                <tr key={r.receivableId}>
                                    <td>{r.titulo.seu_numero || '—'}</td>
                                    <td>{r.conta.cliente}</td>
                                    <td>{formatBRL(r.titulo.valor_recebido_centavos)}</td>
                                    <td>
                                        <span className="badge bordero">
                                            #{r.bordero?.id ?? '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---------- FALHAS ---------- */}
            {failures.length > 0 && (
                <section className="section-error">
                    <h3>❌ Falhas ({failures.length})</h3>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th>Seu número</th>
                                <th>Cliente</th>
                                <th>Valor</th>
                                <th>Código</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {failures.map((r) => (
                                <tr key={r.receivableId} className="row-error">
                                    <td>{r.titulo.seu_numero || '—'}</td>
                                    <td>{r.conta.cliente}</td>
                                    <td>{formatBRL(r.titulo.valor_recebido_centavos)}</td>
                                    <td>
                                        <span className="badge error-code">
                                            {r.error?.code ?? '—'}
                                        </span>
                                    </td>
                                    <td>{r.error?.message ?? 'Erro desconhecido'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---------- NÃO ENVIADAS ---------- */}
            {skipped.length > 0 && (
                <section className="section-skipped">
                    <h3>⏭️ Não enviadas ({skipped.length})</h3>
                    <p className="section-hint">
                        Estas contas estavam selecionadas, mas não foram enviadas para baixa.
                    </p>
                    <table className="bling-table">
                        <thead>
                            <tr>
                                <th>Seu número</th>
                                <th>Cliente</th>
                                <th>Valor</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skipped.map((c, i) => (
                                <tr key={i} className="row-skipped">
                                    <td>{c.titulo.seu_numero || '—'}</td>
                                    <td>{c.conta?.cliente ?? '—'}</td>
                                    <td>{formatBRL(c.titulo.valor_recebido_centavos)}</td>
                                    <td>Não enviada para baixa</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <footer className="bling-result-actions">
                <button type="button" className="btn-primary" onClick={onVoltar}>
                    Voltar ao início
                </button>
            </footer>
        </div>
    );
}