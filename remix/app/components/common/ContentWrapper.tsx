export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pr-10 pl-10 bg-base-100 ">
      <div className="p-5 border-2 border-primary rounded-lg">{children}</div>
    </div>
  );
};

export default ContentWrapper;
