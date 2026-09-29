import './LoadingSpinner.css'

interface LoadingSpinnerProps {
    size?: string
}

const LoadingSpinner: React.FunctionComponent<LoadingSpinnerProps> = (props) => {
    var parsedSize: string
    switch (props.size) {
        case "small":
            parsedSize = "small";
            break
        case "large":
            parsedSize = "large";
            break
        case "medium":
        default:
            parsedSize = "medium"
    }
    return (<div className="spinner" id={parsedSize} />)
}

export default LoadingSpinner
