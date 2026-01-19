import type { TimeEntry } from '../types/timeEntry';

interface TimeEntryTableProps {
  entries: TimeEntry[];
  onAddEntry: (dia: number) => void;
  onEditEntry?: (entry: TimeEntry) => void;
  onDeleteEntry?: (id: string) => void;
}

export function TimeEntryTable({ entries, onAddEntry, onEditEntry, onDeleteEntry }: TimeEntryTableProps) {
  const hasTimeEntry = (entry: TimeEntry) => {
    return entry.entrada1 && entry.entrada1 !== '--:--';
  };

  return (
    <div className="table-container">
      <table className="time-table">
        <thead>
          <tr>
            <th>Dia</th>
            <th>E</th>
            <th>S</th>
            <th>E</th>
            <th>S</th>
            <th>Saldo</th>
            <th>Ocorrência</th>
            <th>Motivo</th>
            <th>Dia</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center text-gray-500" style={{padding: '2rem'}}>
                Nenhum lançamento cadastrado
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id}>
                <td className="text-center">{String(entry.dia).padStart(2, '0')}</td>
                <td className="text-center">{entry.entrada1 || '--:--'}</td>
                <td className="text-center">{entry.saida1 || '--:--'}</td>
                <td className="text-center">{entry.entrada2 || '--:--'}</td>
                <td className="text-center">{entry.saida2 || '--:--'}</td>
                <td className="text-center">{entry.saldo || ''}</td>
                <td className="text-center">{entry.ocorrencia || ''}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{entry.motivo || ''}</span>
                    {onEditEntry && hasTimeEntry(entry) && (
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="edit-entry-btn"
                        title="Editar lançamento"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
                <td className="dia-column">
                  {hasTimeEntry(entry) ? (
                    // Se já tem lançamento, mostrar editar e excluir
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {onEditEntry && (
                        <button
                          onClick={() => onEditEntry(entry)}
                          className="action-btn edit-btn"
                          title="Editar lançamento"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      )}
                      {onDeleteEntry && (
                        <button
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
                              onDeleteEntry(entry.id);
                            }
                          }}
                          className="action-btn delete-btn"
                          title="Excluir lançamento"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      )}
                      <span className="dia-semana">{entry.diaSemana}</span>
                    </div>
                  ) : (
                    // Se não tem lançamento, mostrar botão de adicionar
                    <>
                      <button 
                        onClick={() => onAddEntry(entry.dia)} 
                        className="add-entry-btn"
                        title="Adicionar lançamento"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <span className="dia-semana">{entry.diaSemana}</span>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
