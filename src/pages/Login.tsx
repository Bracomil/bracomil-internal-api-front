import { useState, type ChangeEvent } from 'react'
import './css/main.css'
import './css/Login.css'
import logo from "../assets/logo-bracomil-horizontal.png"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useLocation } from 'react-router-dom';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const STRONG_PWD_REGEX = /^/
// const STRONG_PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/

function App() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const { login, isLoading } = useAuth(); // 👈 pega as funções do contexto
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (email == "" || password == "") {
      setMessage("⚠️ Preencha todos os campos")
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setMessage("⚠️ Coloque um e-mail válido")
      return
    }
    if (!STRONG_PWD_REGEX.test(password)) {
      setMessage('⚠️ Senha deve conter pelo menos:\n Uma letra minúscula\nUma letra maíscula\nUm número\nUm caractér especial (*&@#)\nPelo menos 8 caracteres')
      return
    }
    setMessage("")
    try {
      await login(email, password);   // 👈 chama a função do AuthContext
      navigate(from, { replace: true }); // 👈 redireciona após sucesso
    } catch (err) {
      setMessage('❌ E-mail ou senha inválidos');
    }
  }

  return (
    <div className="container">
      <div className='left'>
      </div>
      <div className='right'>
        <img src={logo} id='logo' alt="company logo"></img>
        <form className="form" onSubmit={handleSubmit}>
          <h1>Acessar plataforma</h1>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Entrando...' : 'Entrar'}</button>
          <p className="mensagem">{message}</p>
        </form>
      </div>
    </div>
  )
}

export default App
