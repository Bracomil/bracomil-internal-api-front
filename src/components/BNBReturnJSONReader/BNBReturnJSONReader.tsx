import { useState } from 'react';
import type { ApiResponse, TitulosResponse } from '../../services/api';
import './BNBReturnJSONReader.css';

interface ReturnResultProps {
    data: ApiResponse;
    onVoltar: () => void;
    onDarBaixa: () => void;
}

/** Formata centavos em BRL */
function formatBRL(centavos: number): string {
    return (centavos / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

/** Formata data YYYY-MM-DD (ou DDMMYYYY) em pt-BR */
function formatDate(value: string): string {
    if (!value) return '—';
    // se já for YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return new Date(value).toLocaleDateString('pt-BR');
    }
    // se for DDMMYYYY (8 dígitos)
    if (/^\d{8}$/.test(value)) {
        const d = value.slice(0, 2);
        const m = value.slice(2, 4);
        const y = value.slice(4, 8);
        return `${d}/${m}/${y}`;
    }
    return value;
}

export function ReturnResult({ data, onVoltar, onDarBaixa }: ReturnResultProps) {
    const { header, titulos, trailer } = data;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="return-result">
            {/* ---------- HEADER ---------- */}
            <section className="return-section">
                <h2>Cabeçalho do retorno</h2>
                <div className="info-grid">
                    <Info label="Banco" value={`${header.numero_banco} - ${header.nome_banco}`} />
                    <Info label="Agência" value={header.agencia} />
                    <Info label="Conta" value={`${header.conta}-${header.dv_conta}`} />
                    <Info label="Cedente" value={header.nome_cedente} />
                    <Info label="Data de geração" value={formatDate(header.data_geracao)} />
                    <Info label="Densidade" value={header.densidade_gravacao} />
                    <Info label="Sequencial do retorno" value={header.sequencial_retorno} />
                    <Info label="Sequencial do registro" value={String(header.sequencial_registro)} />
                </div>
            </section>

            {/* ---------- TÍTULOS ---------- */}
            <section className="return-section">
                <h2>Títulos ({titulos.length})</h2>

                <table className="return-table">
                    <thead>
                        <tr>
                            <th>Nosso número</th>
                            <th>Seu número</th>
                            <th>Vencimento</th>
                            <th>Valor</th>
                            <th>Recebido</th>
                            <th>Ocorrência</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {titulos.map((t, i) => {
                            const id = `${t.nosso_numero}-${t.sequencial_registro}-${i}`;
                            const isOpen = expandedId === id;

                            return (
                                <>
                                    <tr key={id}>
                                        <td>
                                            {t.nosso_numero}
                                            {!t.dv_nosso_numero_valido && (
                                                <span className="badge erro" title="DV inválido">⚠</span>
                                            )}
                                        </td>
                                        <td>{t.seu_numero || '—'}</td>
                                        <td>{formatDate(t.data_vencimento)}</td>
                                        <td>{formatBRL(t.valor_titulo_centavos)}</td>
                                        <td>{formatBRL(t.valor_recebido_centavos)}</td>
                                        <td>
                                            <span className="badge ocorrencia">
                                                {t.codigo_ocorrencia} — {t.descricao_ocorrencia}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-expand"
                                                onClick={() => setExpandedId(isOpen ? null : id)}
                                            >
                                                {isOpen ? '▲' : '▼'}
                                            </button>
                                        </td>
                                    </tr>

                                    {isOpen && (
                                        <tr className="row-details">
                                            <td colSpan={7}>
                                                <TituloDetalhes titulo={t} />
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {/* ---------- TRAILER ---------- */}
            <section className="return-section">
                <h2>Trailer</h2>
                <div className="info-grid">
                    <Info label="Código de serviço" value={trailer.codigo_servico} />
                    <Info label="Banco" value={trailer.numero_banco} />
                    <Info
                        label="Títulos (cobrança simples)"
                        value={String(trailer.quantidade_titulos_cobranca_simples)}
                    />
                    <Info
                        label="Valor total (cobrança simples)"
                        value={formatBRL(trailer.valor_titulos_cobranca_simples_centavos)}
                    />
                    <Info label="Aviso de lançamentos" value={trailer.numero_aviso_lancamentos} />
                    <Info label="Sequencial do registro" value={String(trailer.sequencial_registro)} />
                </div>
            </section>


            <div className="return-actions">
                <button type="button" className="btn-secondary" onClick={onVoltar}>
                    Voltar
                </button>
                <button type="button" className="btn-primary" onClick={onDarBaixa}>
                    Dar baixa no Bling
                </button>
            </div>
        </div>
    );
}

/* ---------- COMPONENTES AUXILIARES ---------- */

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="info-item">
            <span className="info-label">{label}</span>
            <span className="info-value">{value || '—'}</span>
        </div>
    );
}

function TituloDetalhes({ titulo }: { titulo: TitulosResponse }) {
    return (
        <div className="titulo-detalhes">
            <div className="info-grid">
                <Info label="Tipo inscrição cedente" value={titulo.tipo_inscricao_cedente} />
                <Info label="CPF/CNPJ cedente" value={titulo.cpf_cnpj_cedente} />
                <Info label="Agência" value={titulo.agencia} />
                <Info label="Conta" value={`${titulo.conta}-${titulo.dv_conta}`} />
                <Info label="Número de controle" value={titulo.numero_controle} />
                <Info label="Nosso número" value={titulo.nosso_numero} />
                <Info label="DV nosso número" value={titulo.dv_nosso_numero} />
                <Info
                    label="DV nosso número válido?"
                    value={titulo.dv_nosso_numero_valido ? 'Sim' : 'Não'}
                />
                <Info label="Número do contrato" value={titulo.numero_contrato} />
                <Info label="Carteira" value={titulo.carteira} />
                <Info label="Código da ocorrência" value={titulo.codigo_ocorrencia} />
                <Info label="Descrição da ocorrência" value={titulo.descricao_ocorrencia} />
                <Info label="Data da ocorrência" value={formatDate(titulo.data_ocorrencia)} />
                <Info label="Seu número" value={titulo.seu_numero} />
                <Info label="Confirmação nosso número" value={titulo.confirmacao_nosso_numero} />
                <Info
                    label="Confirmação DV nosso número"
                    value={titulo.confirmacao_dv_nosso_numero}
                />
                <Info
                    label="Confirmação DV válido?"
                    value={titulo.confirmacao_dv_valido ? 'Sim' : 'Não'}
                />
                <Info label="Data de vencimento" value={formatDate(titulo.data_vencimento)} />
                <Info label="Valor do título" value={formatBRL(titulo.valor_titulo_centavos)} />
                <Info label="Número do banco" value={titulo.numero_banco} />
                <Info label="Agência cobradora" value={titulo.agencia_cobradora} />
                <Info label="Espécie" value={titulo.especie} />
                <Info label="Tarifa de cobrança" value={formatBRL(titulo.tarifa_cobranca_centavos)} />
                <Info label="Outras despesas" value={formatBRL(titulo.outras_despesas_centavos)} />
                <Info label="Juros" value={formatBRL(titulo.juros_centavos)} />
                <Info label="IOC" value={formatBRL(titulo.ioc_centavos)} />
                <Info label="Abatimento" value={formatBRL(titulo.abatimento_centavos)} />
                <Info label="Desconto" value={formatBRL(titulo.desconto_centavos)} />
                <Info label="Valor recebido" value={formatBRL(titulo.valor_recebido_centavos)} />
                <Info label="Juros de mora" value={formatBRL(titulo.juros_mora_centavos)} />
                <Info label="Data de crédito" value={formatDate(titulo.data_credito)} />
                <Info label="Sequencial do registro" value={String(titulo.sequencial_registro)} />
            </div>
        </div>
    );
}