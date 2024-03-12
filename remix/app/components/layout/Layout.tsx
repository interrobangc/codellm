import { Link } from '@remix-run/react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="p-5">
        <nav className="navbar bg-base-100">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl">
              CodeLLM
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/chat" prefetch="intent">
                  Chat
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );

  {
    /* <h1 className="text-4xl font-extrabold">
          <Link to="/">CodeLlm</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/chat">Chat</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div> */
  }
};
