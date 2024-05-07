import AuthProvider from './AuthProvider';
import Navbar from './Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <header className="p-5">
        <Navbar />
      </header>
      <main>{children}</main>
    </AuthProvider>
  );
};
