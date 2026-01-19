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

  // Função para converter saldo em minutos
  const timeToMinutes = (time: string): number => {
    if (!time || time === '00:00') return 0;
    const isNegative = time.startsWith('-');
    const cleanTime = time.replace('-', '');
    const [hours, minutes] = cleanTime.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;
    return isNegative ? -totalMinutes : totalMinutes;
  };

  // Função para converter minutos em formato de hora
  const minutesToTime = (minutes: number): string => {
    const isNegative = minutes < 0;
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    return isNegative ? `-${formattedTime}` : formattedTime;
  };

  // Função para calcular horas trabalhadas no dia
  const calculateWorkedMinutes = (entry: TimeEntry): number => {
    if (!entry.entrada1 || entry.entrada1 === '--:--') return 0;
    
    let totalMinutes = 0;
    
    // Primeira entrada/saída
    if (entry.entrada1 && entry.saida1 && entry.entrada1 !== '--:--' && entry.saida1 !== '--:--') {
      const entrada1Minutes = timeToMinutes(entry.entrada1);
      const saida1Minutes = timeToMinutes(entry.saida1);
      totalMinutes += (saida1Minutes - entrada1Minutes);
    }
    
    // Segunda entrada/saída
    if (entry.entrada2 && entry.saida2 && entry.entrada2 !== '--:--' && entry.saida2 !== '--:--') {
      const entrada2Minutes = timeToMinutes(entry.entrada2);
      const saida2Minutes = timeToMinutes(entry.saida2);
      totalMinutes += (saida2Minutes - entrada2Minutes);
    }
    
    return totalMinutes;
  };

  // Função para calcular o saldo do dia baseado no motivo
  const calculateDayBalance = (entry: TimeEntry): number => {
    const DAILY_WORK_MINUTES = 8 * 60;
    const workedMinutes = calculateWorkedMinutes(entry);
    const isWeekend = entry.diaSemana === 'Dom' || entry.diaSemana === 'Sab';
    
    // Falta: -8 horas
    if (entry.motivo === 'Falta') {
      return -DAILY_WORK_MINUTES;
    }
    
    // Férias, Atestado, Feriado: 0 (conta como dia completo)
    if (entry.motivo === 'Ferias' || entry.motivo === 'Atestado' || entry.feriado) {
      return 0;
    }
    
    // Ponto facultativo: equivale a 8 horas trabalhadas
    if (entry.motivo === 'Ponto facultativo') {
      return 0;
    }
    
    // Compensação de horas: déficit será coberto por horas positivas
    if (entry.motivo === 'Compensação de horas') {
      const deficit = DAILY_WORK_MINUTES - workedMinutes;
      return deficit > 0 ? 0 : workedMinutes - DAILY_WORK_MINUTES;
    }
    
    // Final de semana: adiciona todas as horas trabalhadas
    if (isWeekend) {
      return workedMinutes;
    }
    
    // Dia normal: diferença entre trabalhado e 8 horas
    return workedMinutes - DAILY_WORK_MINUTES;
  };

  // Calcular horas positivas, negativas e saldo final
  const calculateStats = () => {
    let positiveMinutes = 0;
    let negativeMinutes = 0;
    let totalCompensationUsed = 0;

    entries.forEach(entry => {
      const balance = calculateDayBalance(entry);
      
      // Calcular compensação usada
      if (entry.motivo === 'Compensação de horas') {
        const workedMinutes = calculateWorkedMinutes(entry);
        const deficit = (8 * 60) - workedMinutes;
        if (deficit > 0) {
          totalCompensationUsed += deficit;
        }
      }
      
      // Acumular horas positivas e negativas
      if (balance > 0) {
        positiveMinutes += balance;
      } else if (balance < 0) {
        negativeMinutes += Math.abs(balance);
      }
    });

    // Subtrair compensações das horas positivas
    const finalPositive = Math.max(0, positiveMinutes - totalCompensationUsed);
    const finalBalance = finalPositive - negativeMinutes;

    return {
      horasPositivas: minutesToTime(finalPositive),
      horasNegativas: minutesToTime(negativeMinutes),
      saldoFinal: minutesToTime(finalBalance)
    };
  };

  const stats = calculateStats();

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
          horasPositivas={stats.horasPositivas}
          horasNegativas={stats.horasNegativas}
          saldoFinal={stats.saldoFinal}
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

