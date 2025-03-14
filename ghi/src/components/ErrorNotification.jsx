//@ts-check
/**
 * @param {{error?: string}} props
 * @returns {React.ReactNode}
 */
function ErrorNotification(props) {
    if (!props.error) {
        return null
    }

    return <div className="notification is-danger">{props.error}</div>
}

export default ErrorNotification
