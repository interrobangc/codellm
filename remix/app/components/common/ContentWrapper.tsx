export const ContentWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const myClassName = `p-5 border-2 border-primary rounded-lg ${className}`;
  return (
    <div className="bg-base-100 ">
      <div className={myClassName}>{children}</div>
    </div>
  );
};

export default ContentWrapper;
