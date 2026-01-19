interface MonthNavigatorProps {
  month: string;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
  onNewEntry: () => void;
}

export function MonthNavigator({ month, year, onPrevious, onNext, onNewEntry }: MonthNavigatorProps) {
  return (
    <div className="month-navigator">
      <div className="month-selector">
        <button onClick={onPrevious} className="month-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="month-display">
          <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{month} {year}</span>
        </div>
        <button onClick={onNext} className="month-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
      <button onClick={onNewEntry} className="btn-new-entry">
        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Novo Lançamento
      </button>
    </div>
  );
}
