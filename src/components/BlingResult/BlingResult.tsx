interface BlingResultProps {
    sucesso: number;
    falhas: number;
    onVoltar: () => void;
}

export function BlingResult({ sucesso, falhas, onVoltar }: BlingResultProps) {
    return (
        <div className="bling-result">
            <h2>✅ Baixa concluída</h2>
            <ul>
                <li><strong>{sucesso}</strong> conta(s) baixada(s) com sucesso</li>
                {falhas > 0 && <li className="erro"><strong>{falhas}</strong> falha(s)</li>}
            </ul>
            <button type="button" className="btn-reset" onClick={onVoltar}>
                Voltar ao início
            </button>
        </div>
    );
}