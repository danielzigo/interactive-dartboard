interface FooterProps {
  children?: React.ReactNode;
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className="app-footer text-sm">
      <div className="max-w-7xl flex justify-between items-center">{children}</div>
    </footer>
  );
}
