import { useState, useEffect } from 'react';
import type { TimeEntry, TimeEntryFormData } from '../types/timeEntry';

interface TimeEntryFormProps {
  onSubmit: (data: TimeEntryFormData) => void;
  onCancel: () => void;
  editingEntry?: TimeEntry | null;
  selectedDate?: string;
}

export function TimeEntryForm({ onSubmit, onCancel, editingEntry, selectedDate }: TimeEntryFormProps) {
  const [formData, setFormData] = useState<TimeEntryFormData>({
    dia: 1,
    entrada1: '',
    saida1: '',
    entrada2: '',
    saida2: '',
    totalHoras: '',
    saldo: '',
    ocorrencia: '',
    motivo: 'Normal',
    diaSemana: 'Seg',
  });
  const [isFeriado, setIsFeriado] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        dia: editingEntry.dia,
        entrada1: editingEntry.entrada1 || '',
        saida1: editingEntry.saida1 || '',
        entrada2: editingEntry.entrada2 || '',
        saida2: editingEntry.saida2 || '',
        totalHoras: editingEntry.totalHoras || '',
        saldo: editingEntry.saldo || '',
        ocorrencia: editingEntry.ocorrencia || '',
        motivo: editingEntry.motivo || 'Normal',
        diaSemana: editingEntry.diaSemana,
      });
    }
  }, [editingEntry]);

  // Efeito para preencher 8 horas quando marcar feriado
  useEffect(() => {
    if (isFeriado) {
      setFormData(prev => ({
        ...prev,
        entrada1: '07:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '16:00',
        totalHoras: '08:00',
        saldo: '00:00',
        motivo: 'Ferias'
      }));
    }
  }, [isFeriado]);

  // Efeito para preencher 8 horas quando selecionar Ponto facultativo
  useEffect(() => {
    if (formData.motivo === 'Ponto facultativo') {
      setFormData(prev => ({
        ...prev,
        entrada1: '07:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '16:00',
        totalHoras: '08:00',
        saldo: '00:00'
      }));
    }
  }, [formData.motivo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof TimeEntryFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Novo Lançamento</h2>
          <button onClick={onCancel} className="modal-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Data</label>
            <input
              type="date"
              value={selectedDate || '2026-01-01'}
              className="form-input"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Entrada 1</label>
              <input
                type="time"
                value={formData.entrada1}
                onChange={(e) => handleChange('entrada1', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Saída 1</label>
              <input
                type="time"
                value={formData.saida1}
                onChange={(e) => handleChange('saida1', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Entrada 2</label>
              <input
                type="time"
                value={formData.entrada2}
                onChange={(e) => handleChange('entrada2', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Saída 2</label>
              <input
                type="time"
                value={formData.saida2}
                onChange={(e) => handleChange('saida2', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isFeriado}
                onChange={(e) => setIsFeriado(e.target.checked)}
              />
              <span>Feriado</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Motivo</label>
            <select
              value={formData.motivo}
              onChange={(e) => handleChange('motivo', e.target.value)}
              className="form-input"
            >
              <option value="Normal">Normal</option>
              <option value="Falta">Falta</option>
              <option value="Compensação de horas">Compensação de horas</option>
              <option value="Ferias">Ferias</option>
              <option value="Atestado médico">Atestado médico</option>
              <option value="Ponto facultativo">Ponto facultativo</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Observação</label>
            <textarea
              value={formData.ocorrencia}
              onChange={(e) => handleChange('ocorrencia', e.target.value)}
              placeholder="Adicione uma observação..."
              rows={4}
              className="form-input"
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
