import { useState } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { MonthNavigator } from './components/MonthNavigator';
import { TimeEntryTable } from './components/TimeEntryTable';
import { TimeEntryForm } from './components/TimeEntryForm';
import { useTimeEntries } from './hooks/useTimeEntries';
import type { TimeEntry, TimeEntryFormData } from './types/timeEntry';

export function App() {
  const { entries, loading, error, isSupabaseConfigured, createEntry, updateEntry, deleteEntry } = useTimeEntries();
  
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [currentMonth, setCurrentMonth] = useState('Janeiro');
  const [currentYear, setCurrentYear] = useState(2026);

  const handleCreate = async (data: TimeEntryFormData) => {
    if (editingEntry) {
      const result = await updateEntry(editingEntry.id, data);
      if (result.success) {
        setShowForm(false);
        setEditingEntry(null);
      }
    } else {
      const result = await createEntry(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleAddEntry = (dia: number) => {
    setShowForm(true);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      await deleteEntry(id);
    }
  };

  const handlePreviousMonth = () => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const currentIndex = months.indexOf(currentMonth);
    if (currentIndex > 0) {
      setCurrentMonth(months[currentIndex - 1]);
    } else {
      setCurrentMonth('Dezembro');
      setCurrentYear(currentYear - 1);
    }
  };

  const handleNextMonth = () => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const currentIndex = months.indexOf(currentMonth);
    if (currentIndex < 11) {
      setCurrentMonth(months[currentIndex + 1]);
    } else {
      setCurrentMonth('Janeiro');
      setCurrentYear(currentYear + 1);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#5f6368' }}>
            Carregando lançamentos...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        {error && !isSupabaseConfigured && (
          <div style={{ 
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            background: '#fff8e1',
            border: '1px solid #ffd54f',
            borderRadius: '12px',
            color: '#f57c00',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div style={{ flex: 1 }}>
              <strong>Modo Local:</strong> {error}
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Os dados serão salvos apenas na memória. Para persistir no banco, execute o SQL em{' '}
                <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                  supabase-schema.sql
                </code>
              </div>
            </div>
          </div>
        )}

        <StatsCards
          horasPositivas="00:00"
          horasNegativas="00:00"
          saldoFinal="00:00"
        />

        <MonthNavigator
          month={currentMonth}
          year={currentYear}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
          onNewEntry={() => setShowForm(true)}
        />

        <TimeEntryTable
          entries={entries}
          onAddEntry={handleAddEntry}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </main>

      {showForm && (
        <TimeEntryForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          editingEntry={editingEntry}
        />
      )}
    </div>
  );
}

