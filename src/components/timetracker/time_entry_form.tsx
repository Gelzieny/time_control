import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

const REASONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'falta', label: 'Falta' },
  { value: 'compensacao', label: 'Compensação de horas' },
  { value: 'ferias', label: 'Férias' },
  { value: 'atestado', label: 'Atestado médico' },
  { value: 'facultativo', label: 'Ponto facultativo' },
  { value: 'outros', label: 'Outros' },
];

export default function TimeEntryForm({ open, onClose, onSave, entry, selectedDate }) {
  const [formData, setFormData] = useState({
    date: '',
    entry1: '',
    exit1: '',
    entry2: '',
    exit2: '',
    is_holiday: false,
    reason: 'normal',
    observation: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date || '',
        entry1: entry.entry1 || '',
        exit1: entry.exit1 || '',
        entry2: entry.entry2 || '',
        exit2: entry.exit2 || '',
        is_holiday: entry.is_holiday || false,
        reason: entry.reason || 'normal',
        observation: entry.observation || ''
      });
    } else if (selectedDate) {
      setFormData({
        date: format(selectedDate, 'yyyy-MM-dd'),
        entry1: '',
        exit1: '',
        entry2: '',
        exit2: '',
        is_holiday: false,
        reason: 'normal',
        observation: ''
      });
    }
  }, [entry, selectedDate]);

  const handleSubmit = () => {
    // Clear time entries for reasons that don't require them
    const shouldClearTimes = ['facultativo', 'ferias', 'atestado'].includes(formData.reason);
    const dataToSave = shouldClearTimes ? {
      ...formData,
      entry1: '',
      exit1: '',
      entry2: '',
      exit2: ''
    } : formData;
    
    onSave(dataToSave);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-emerald-800">
            {entry ? 'Editar Lançamento' : 'Novo Lançamento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {formData.reason !== 'facultativo' && formData.reason !== 'ferias' && formData.reason !== 'atestado' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entrada 1</Label>
                  <Input
                    type="time"
                    value={formData.entry1}
                    onChange={(e) => setFormData({ ...formData, entry1: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saída 1</Label>
                  <Input
                    type="time"
                    value={formData.exit1}
                    onChange={(e) => setFormData({ ...formData, exit1: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entrada 2</Label>
                  <Input
                    type="time"
                    value={formData.entry2}
                    onChange={(e) => setFormData({ ...formData, entry2: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saída 2</Label>
                  <Input
                    type="time"
                    value={formData.exit2}
                    onChange={(e) => setFormData({ ...formData, exit2: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {(formData.reason === 'facultativo' || formData.reason === 'ferias' || formData.reason === 'atestado') && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
              <p className="text-sm text-teal-700 font-medium">
                {formData.reason === 'facultativo' && 'Ponto facultativo: 8 horas computadas automaticamente'}
                {formData.reason === 'ferias' && 'Férias: não requer registro de horário'}
                {formData.reason === 'atestado' && 'Atestado médico: não requer registro de horário'}
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_holiday"
              checked={formData.is_holiday}
              onCheckedChange={(checked) => setFormData({ ...formData, is_holiday: checked })}
            />
            <Label htmlFor="is_holiday" className="cursor-pointer">Feriado</Label>
          </div>

          <div className="space-y-2">
            <Label>Motivo</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData({ ...formData, reason: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea
              value={formData.observation}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              placeholder="Adicione uma observação..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}