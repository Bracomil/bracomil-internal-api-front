import { Link } from 'react-router-dom';
import './Legal.css';

export default function TermsOfService() {
    return (
        <div className="legal">
            <h1>Termos de Serviço</h1>
            <p className="legal-updated">Última atualização: setembro de 2026</p>

            <p>
                Estes Termos de Serviço regulam o uso da aplicação interna de aplicativos operada pela <strong>Bracomil</strong>.
                Ao acessar a Aplicação, o usuário concorda integralmente com estes Termos.
            </p>

            <h2>1. Objeto</h2>
            <p>
                A Aplicação tem como finalidade unir em um só lugar diversas ferramentas para o auxílio no dia-a-dia dos colaboradores da <strong>Bracomil</strong>.
            </p>

            <h2>2. Acesso restrito</h2>
            <p>
                A Aplicação é de uso exclusivamente interno, destinada a colaboradores
                autorizados da Bracomil. O acesso é concedido individualmente e não pode
                ser compartilhado, cedido ou transferido a terceiros.
            </p>
            <p>
                O usuário é responsável por manter a confidencialidade das credenciais de
                acesso e por todas as atividades realizadas com sua conta.
            </p>

            <h2>3. Uso permitido</h2>
            <p>
                O usuário se compromete a utilizar a Aplicação apenas para as finalidades
                previstas, sendo vedado:
            </p>
            <ul>
                <li>Utilizar a Aplicação para fins ilícitos ou não autorizados.</li>
                <li>
                    Tentar acessar áreas restritas, contas de outros usuários ou dados
                    sem permissão.
                </li>
                <li>
                    Realizar engenharia reversa, descompilar ou modificar a Aplicação.
                </li>
                <li>
                    Inserir arquivos maliciosos, códigos ou conteúdos que possam
                    comprometer a segurança da Aplicação.
                </li>
                <li>
                    Utilizar meios automatizados para extrair dados em massa sem
                    autorização expressa.
                </li>
            </ul>

            <h2>4. Responsabilidades do usuário</h2>
            <p>
                O usuário é responsável por:
            </p>
            <ul>
                <li>
                    Garantir que os arquivos enviados são legítimos e provenientes de
                    fontes autorizadas.
                </li>
                <li>
                    Conferir as informações de conciliação antes de confirmar baixas no
                    sistema Bling.
                </li>
                <li>
                    Comunicar imediatamente qualquer uso indevido ou suspeita de
                    comprometimento da sua conta.
                </li>
            </ul>

            <h2>5. Limitação de responsabilidade</h2>
            <p>
                A Aplicação é fornecida "como está". A Bracomil envida esforços para
                garantir a disponibilidade e o correto funcionamento, mas não se
                responsabiliza por:
            </p>
            <ul>
                <li>Indisponibilidades temporárias por manutenção ou falhas técnicas.</li>
                <li>
                    Erros decorrentes de informações incorretas nos arquivos de retorno
                    fornecidos pelo banco.
                </li>
                <li>
                    Decisões tomadas pelo usuário com base nas informações exibidas.
                </li>
                <li>
                    Falhas ou indisponibilidades dos serviços de terceiros (Google,
                    Bling, bancos).
                </li>
            </ul>

            <h2>6. Propriedade intelectual</h2>
            <p>
                Todo o conteúdo da Aplicação — código-fonte, layout, marca, textos e
                funcionalidades — é de propriedade exclusiva da Bracomil ou de seus
                licenciadores, sendo protegido pelas leis de propriedade intelectual.
            </p>

            <h2>7. Suspensão e revogação de acesso</h2>
            <p>
                A Bracomil se reserva o direito de suspender ou revogar o acesso de
                qualquer usuário, a qualquer momento, sem aviso prévio, em caso de
                violação destes Termos ou por decisão administrativa.
            </p>

            <h2>8. Privacidade</h2>
            <p>
                O tratamento de dados pessoais é regido pela nossa{" "}
                <Link to="/privacidade">Política de Privacidade</Link>, que integra
                estes Termos para todos os fins.
            </p>

            <h2>9. Alterações nos Termos</h2>
            <p>
                Estes Termos podem ser atualizados periodicamente. A data da última
                atualização será sempre indicada no topo desta página. O uso contínuo da
                Aplicação após alterações implica concordância com os novos termos.
            </p>

            <h2>10. Legislação aplicável e foro</h2>
            <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil.
                Fica eleito o foro da comarca de
                <strong> Fortaleza/CE</strong> para dirimir quaisquer
                controvérsias decorrentes destes Termos.
            </p>

            <h2>11. Contato</h2>
            <p>
                Para dúvidas sobre estes Termos, entre em contato pelo e-mail
                <strong> bracomil@gmail.com</strong>.
            </p>

            <div className="legal-footer">
                <p>
                    Veja também a <Link to="/privacidade">Política de Privacidade</Link>.
                </p>
            </div>
        </div>
    );
}