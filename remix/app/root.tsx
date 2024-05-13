import type { LinksFunction } from '@remix-run/node';

import { ClerkApp } from '@clerk/remix';
import { dark } from '@clerk/themes';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import stylesheet from './styles/app.css?url';

import Navbar from '@remix/components/Navbar';

export { loader } from './root.loader.server';

export const links: LinksFunction = () => [
  { href: stylesheet, rel: 'stylesheet' },
];

export const App = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="p-5">
          <Navbar />
        </header>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default ClerkApp(App, {
  appearance: {
    baseTheme: dark,
  },
});
