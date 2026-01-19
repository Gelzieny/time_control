export interface TimeEntry {
  id: string;
  dia: number;
  entrada1?: string;
  saida1?: string;
  entrada2?: string;
  saida2?: string;
  totalHoras?: string;
  saldo?: string;
  ocorrencia?: string;
  motivo?: string;
  diaSemana: 'Dom' | 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab';
}

export type TimeEntryFormData = Omit<TimeEntry, 'id'>;
