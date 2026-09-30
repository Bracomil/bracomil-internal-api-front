import { Link } from 'react-router-dom';
import './Legal.css';

export default function PrivacyPolicy() {
    return (
        <div className="legal">
            <h1>Política de Privacidade</h1>
            <p className="legal-updated">Última atualização: setembro de 2026</p>

            <p>
                Esta Política de Privacidade descreve como a <strong>Bracomil</strong> coleta,
                usa e protege as informações dos usuários da sua aplicação.
            </p>

            <h2>1. Quem somos</h2>
            <p>
                A Aplicação é operada pela Bracomil, inscrita no CNPJ sob o nº
                <strong> 01.015.273-0001/72</strong>, com sede em
                <strong> Rua Nigérica, 120 - Fortaleza/CE</strong>.
            </p>

            <h2>2. Quais dados coletamos</h2>
            <p>
                A Aplicação é de uso interno e restrito a colaboradores autorizados. Os
                dados tratados são:
            </p>
            <ul>
                <li>
                    <strong>Dados de identificação:</strong> nome, e-mail e foto de perfil
                    fornecidos pelo Google no momento do login.
                </li>
                <li>
                    <strong>Dados de autenticação:</strong> identificador único do usuário
                    no Google, token de sessão e data de expiração.
                </li>
                <li>
                    <strong>Arquivos de retorno bancário:</strong> arquivos CNAB 400
                    (.ret e .ret.sai) enviados pelo usuário para processamento.
                </li>
                <li>
                    <strong>Dados de conciliação:</strong> informações de títulos,
                    liquidações e borderôs gerados a partir do processamento junto ao
                    sistema Bling.
                </li>
            </ul>

            <h2>3. Como usamos os dados</h2>
            <p>
                Os dados são utilizados exclusivamente para:
            </p>
            <ul>
                <li>Autenticar o usuário e controlar o acesso à Aplicação.</li>
                <li>Processar arquivos de retorno bancário e realizar a conciliação.</li>
                <li>Registrar baixas de contas a receber no sistema Bling.</li>
                <li>Auditar operações e manter histórico de uso.</li>
            </ul>

            <h2>4. Login com Google</h2>
            <p>
                A autenticação é realizada exclusivamente via Google Identity Services.
                Ao fazer login, o Google nos fornece seu nome, e-mail e foto de perfil. Não
                temos acesso à sua senha do Google, nem a outros dados da sua conta Google
                além dos mencionados.
            </p>
            <p>
                O uso das informações obtidas via Google segue a
                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                    {" "}Política de Privacidade do Google
                </a>.
            </p>

            <h2>5. Compartilhamento de dados</h2>
            <p>
                Não compartilhamos dados com terceiros, exceto quando necessário para a
                operação da Aplicação:
            </p>
            <ul>
                <li>
                    <strong>Google:</strong> para autenticação do usuário.
                </li>
                <li>
                    <strong>Bling:</strong> para conciliação e baixa de contas a receber.
                </li>
            </ul>
            <p>
                Não vendemos, alugamos ou cedemos dados pessoais a terceiros para fins
                comerciais.
            </p>

            <h2>6. Armazenamento e segurança</h2>
            <p>
                Os dados são armazenados em servidores próprios da Bracomil, com controle
                de acesso restrito a colaboradores autorizados. Adotamos medidas técnicas
                e administrativas para proteger as informações contra acesso não
                autorizado, perda ou alteração.
            </p>

            <h2>7. Retenção de dados</h2>
            <p>
                Os dados de autenticação são mantidos enquanto o usuário tiver acesso à
                Aplicação. Arquivos de retorno e registros de conciliação são mantidos
                pelo tempo necessário ao cumprimento de obrigações fiscais e contábeis.
            </p>

            <h2>8. Seus direitos</h2>
            <p>
                Nos termos da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018),
                o usuário pode solicitar:
            </p>
            <ul>
                <li>Confirmação da existência de tratamento de dados.</li>
                <li>Acesso aos dados tratados.</li>
                <li>Correção de dados incompletos ou desatualizados.</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                <li>Informações sobre compartilhamento de dados.</li>
            </ul>

            <h2>9. Contato</h2>
            <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre
                em contato pelo e-mail
                <strong> bracomil@gmail.com</strong>.
            </p>

            <h2>10. Alterações nesta Política</h2>
            <p>
                Esta Política pode ser atualizada periodicamente. A data da última
                atualização será sempre indicada no topo desta página. O uso contínuo da
                Aplicação após alterações implica concordância com os novos termos.
            </p>

            <div className="legal-footer">
                <p>
                    Veja também os <Link to="/termos">Termos de Serviço</Link>.
                </p>
            </div>
        </div>
    );
}