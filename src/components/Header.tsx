export function Header() {
  return (
    <header className="header-gradient">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <h1 className="header-title">Sistema de Ponto</h1>
        </div>
        <p className="header-subtitle">Controle de horas e banco de horas</p>
      </div>
    </header>
  );
}
