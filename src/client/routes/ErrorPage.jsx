import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <h6>{error.title || 'Sorry, an unexpected error has occurred.'}</h6>
      <p>
        {error.statusText || error.message}
      </p>
      <Link to='/'>Go to Homepage</Link>
    </div>
  );

}