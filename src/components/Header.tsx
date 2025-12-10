interface HeaderProps {
  icon?: string | React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ icon, title, subtitle, actions }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="mb-2 md:mb-0 font-heading text-4xl md:text-6xl"> {icon} <span>{title}</span></h1>
      {subtitle && <p>{subtitle}</p>}

      {/* ✅ Buttons stay inside the header */}
      {actions && (
        <div className="header-buttons mt-6 flex flex-wrap justify-center gap-2">{actions}</div>
      )}
    </header>
  );
}
