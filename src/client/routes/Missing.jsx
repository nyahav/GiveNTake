import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article>
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <div>
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </article>
    )
}

export default Missing