import useUser from '@remix/components/hooks/useUser';
import { Form, Link } from '@remix-run/react';

const Navbar = () => {
  const { hasAuth } = useUser();

  return (
    <nav className="navbar bg-base-100">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          CodeLLM
        </Link>
      </div>
      <div className="navbar-end">
        {hasAuth ? (
          <>
            <Link to="/chat" prefetch="intent" className="btn btn-ghost btn-sm">
              Chat
            </Link>
            <Link
              to="/import"
              prefetch="intent"
              className="btn btn-ghost btn-sm"
            >
              Import
            </Link>
            <Form method="post" action="/logout">
              <button className="btn btn-ghost btn-sm">Logout</button>
            </Form>
          </>
        ) : (
          <Form method="post" action="/login">
            <button className="btn btn-ghost btn-sm">Login</button>
          </Form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
