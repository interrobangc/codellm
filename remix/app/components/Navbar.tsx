import { Form, Link } from '@remix-run/react';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/remix';

const Navbar = () => {
  const user = useUser();

  console.log('user', user);
  return (
    <nav className="navbar bg-base-100">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          CodeLLM
        </Link>
      </div>
      <div className="navbar-end">
        <SignedIn>
          <Link to="/chat" prefetch="intent" className="btn btn-ghost btn-sm">
            Chat
          </Link>
          <Link to="/import" prefetch="intent" className="btn btn-ghost btn-sm">
            Import
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link to="/login">
            <button className="btn btn-ghost btn-sm">Login</button>
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
