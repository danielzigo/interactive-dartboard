interface FooterProps {
  children?: React.ReactNode;
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className="app-footer text-sm">
      <div className="max-w-7xl flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">{children}</div>
    </footer>
  );
}
