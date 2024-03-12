export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="p-5">
        <h1 className="text-4xl font-extrabold">CodeLlm</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};
