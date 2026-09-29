import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './Loading.css'

export default function LoadingPage() {
    return (
        <div className='loading-page'>
            <LoadingSpinner size='large' />
            <p className="loading-text">Carregando</p>
        </div>
    )
}