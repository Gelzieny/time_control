interface StatsCardsProps {
  horasPositivas: string;
  horasNegativas: string;
  saldoFinal: string;
}

export function StatsCards({ horasPositivas, horasNegativas, saldoFinal }: StatsCardsProps) {
  return (
    <div className="stats-container">
      <div className="stat-card stat-card-positive">
        <div className="stat-header">
          <div>
            <div className="stat-label">Horas Positivas</div>
            <div className="stat-value">{horasPositivas}</div>
            <div className="stat-description">Disponíveis para compensação</div>
          </div>
          <div className="stat-icon stat-icon-positive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="stat-card stat-card-negative">
        <div className="stat-header">
          <div>
            <div className="stat-label-negative">Horas Negativas</div>
            <div className="stat-value-negative">{horasNegativas}</div>
            <div className="stat-description-negative">A compensar ou descontar</div>
          </div>
          <div className="stat-icon stat-icon-negative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              <polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="stat-card stat-card-neutral">
        <div className="stat-header">
          <div>
            <div className="stat-label-neutral">Saldo Final</div>
            <div className="stat-value-neutral">{saldoFinal}</div>
            <div className="stat-description-neutral">Balanço do período</div>
          </div>
          <div className="stat-icon stat-icon-neutral">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 9l-8 8-8-8"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
