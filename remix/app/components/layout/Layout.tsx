import { Link } from '@remix-run/react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="p-5">
        <nav className="navbar bg-base-100">
          <div className="navbar-start">
            <Link to="/" className="btn btn-ghost text-xl">
              CodeLLM
            </Link>
          </div>
          <div className="navbar-end">
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
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};
