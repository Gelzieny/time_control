import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import type { TimeEntry, TimeEntryFormData } from '../types/timeEntry';

// Dados de exemplo para quando a tabela não existir
const SAMPLE_ENTRIES: TimeEntry[] = [
  { id: '1', dia: 1, entrada1: '--:--', saida1: '--:--', entrada2: '--:--', saida2: '--:--', diaSemana: 'Qui' },
  { id: '2', dia: 2, entrada1: '--:--', saida1: '--:--', entrada2: '--:--', saida2: '--:--', diaSemana: 'Sex' },
  { id: '3', dia: 3, entrada1: '--:--', saida1: '--:--', entrada2: '--:--', saida2: '--:--', diaSemana: 'Sab' },
  { id: '4', dia: 4, entrada1: '--:--', saida1: '--:--', entrada2: '--:--', saida2: '--:--', diaSemana: 'Dom' },
];

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>(SAMPLE_ENTRIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Buscar todos os lançamentos
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('time_entries')
        .select('*')
        .order('dia', { ascending: true });

      if (supabaseError) {
        // Se erro 404, tabela não existe
        if (supabaseError.message.includes('404') || supabaseError.code === 'PGRST116') {
          setError('⚠️ Tabela não encontrada. Execute o SQL do arquivo supabase-schema.sql no Supabase Dashboard.');
          setIsSupabaseConfigured(false);
          setEntries(SAMPLE_ENTRIES);
          return;
        }
        throw supabaseError;
      }

      setIsSupabaseConfigured(true);
      
      // Mapear dados do banco para o formato da aplicação
      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        dia: item.dia,
        entrada1: item.entrada1,
        saida1: item.saida1,
        entrada2: item.entrada2,
        saida2: item.saida2,
        totalHoras: item.total_horas,
        saldo: item.saldo,
        ocorrencia: item.ocorrencia,
        motivo: item.motivo,
        diaSemana: item.dia_semana
      }));

      setEntries(mappedData.length > 0 ? mappedData : SAMPLE_ENTRIES);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar lançamentos';
      setError(`Erro de conexão com Supabase: ${errorMessage}`);
      setIsSupabaseConfigured(false);
      console.error('Error fetching entries:', err);
      setEntries(SAMPLE_ENTRIES);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo lançamento
  const createEntry = async (formData: TimeEntryFormData) => {
    if (!isSupabaseConfigured) {
      // Modo local (sem Supabase)
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        ...formData
      };
      setEntries(prev => [...prev, newEntry]);
      return { success: true, data: newEntry };
    }

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          dia: formData.dia,
          entrada1: formData.entrada1 || null,
          saida1: formData.saida1 || null,
          entrada2: formData.entrada2 || null,
          saida2: formData.saida2 || null,
          total_horas: formData.totalHoras || null,
          saldo: formData.saldo || null,
          ocorrencia: formData.ocorrencia || null,
          motivo: formData.motivo || null,
          dia_semana: formData.diaSemana
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEntries(prev => [...prev, {
          id: data.id,
          dia: data.dia,
          entrada1: data.entrada1,
          saida1: data.saida1,
          entrada2: data.entrada2,
          saida2: data.saida2,
          totalHoras: data.total_horas,
          saldo: data.saldo,
          ocorrencia: data.ocorrencia,
          motivo: data.motivo,
          diaSemana: data.dia_semana
        }]);
      }

      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar lançamento';
      setError(message);
      console.error('Error creating entry:', err);
      return { success: false, error: message };
    }
  };

  // Atualizar lançamento
  const updateEntry = async (id: string, formData: TimeEntryFormData) => {
    if (!isSupabaseConfigured) {
      // Modo local (sem Supabase)
      setEntries(prev => prev.map(entry =>
        entry.id === id ? { ...entry, ...formData } : entry
      ));
      return { success: true, data: formData };
    }

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({
          dia: formData.dia,
          entrada1: formData.entrada1 || null,
          saida1: formData.saida1 || null,
          entrada2: formData.entrada2 || null,
          saida2: formData.saida2 || null,
          total_horas: formData.totalHoras || null,
          saldo: formData.saldo || null,
          ocorrencia: formData.ocorrencia || null,
          motivo: formData.motivo || null,
          dia_semana: formData.diaSemana
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEntries(prev => prev.map(entry => 
          entry.id === id ? {
            id: data.id,
            dia: data.dia,
            entrada1: data.entrada1,
            saida1: data.saida1,
            entrada2: data.entrada2,
            saida2: data.saida2,
            totalHoras: data.total_horas,
            saldo: data.saldo,
            ocorrencia: data.ocorrencia,
            motivo: data.motivo,
            diaSemana: data.dia_semana
          } : entry
        ));
      }

      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar lançamento';
      setError(message);
      console.error('Error updating entry:', err);
      return { success: false, error: message };
    }
  };

  // Deletar lançamento
  const deleteEntry = async (id: string) => {
    if (!isSupabaseConfigured) {
      // Modo local (sem Supabase)
      setEntries(prev => prev.filter(entry => entry.id !== id));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar lançamento';
      setError(message);
      console.error('Error deleting entry:', err);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    isSupabaseConfigured,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries
  };
}
