import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, getDay, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const REASON_LABELS = {
  normal: '',
  falta: 'Falta',
  compensacao: 'Compensação',
  ferias: 'Férias',
  atestado: 'Atestado',
  facultativo: 'Facultativo',
  outros: 'Outros'
};

const formatMinutes = (minutes) => {
  if (minutes === 0 || minutes === undefined || minutes === null) return '';
  const sign = minutes < 0 ? '-' : '+';
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const formatTime = (time, entry) => {
  if (!time) {
    // For specific reasons, show dash instead of **:**
    if (entry && (entry.reason === 'facultativo' || entry.reason === 'ferias' || entry.reason === 'atestado')) {
      return '—';
    }
    return '**:**';
  }
  return time;
};

export default function MonthlyTable({ currentMonth, entries, onEdit, onDelete, onAddEntry }) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  
  // Group days by weeks
  const weeks = [];
  let currentWeek = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = getDay(date);
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    if (day === daysInMonth && currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  }

  const getEntryForDay = (day) => {
    const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
    return entries.find(e => e.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50">
                <TableHead className="w-16 text-emerald-800 font-semibold">Dia</TableHead>
                <TableHead className="w-20 text-emerald-800 font-semibold">E</TableHead>
                <TableHead className="w-20 text-emerald-800 font-semibold">S</TableHead>
                <TableHead className="w-20 text-emerald-800 font-semibold">E</TableHead>
                <TableHead className="w-20 text-emerald-800 font-semibold">S</TableHead>
                <TableHead className="w-24 text-emerald-800 font-semibold">Saldo</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Ocorrência</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Motivo</TableHead>
                <TableHead className="w-16"></TableHead>
                <TableHead className="w-16 text-emerald-800 font-semibold text-center">Dia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {week.map((day) => {
                const date = new Date(year, month, day);
                const entry = getEntryForDay(day);
                const isWeekendDay = isWeekend(date);
                const dayOfWeek = getDay(date);
                
                return (
                  <TableRow 
                    key={day} 
                    className={`hover:bg-slate-50 transition-colors ${isWeekendDay ? 'bg-slate-50/50' : ''}`}
                  >
                    <TableCell className="font-medium text-slate-700">
                      {day.toString().padStart(2, '0')}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">
                      {entry ? formatTime(entry.entry1, entry) : '**:**'}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">
                      {entry ? formatTime(entry.exit1, entry) : '**:**'}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">
                      {entry ? formatTime(entry.entry2, entry) : '**:**'}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">
                      {entry ? formatTime(entry.exit2, entry) : '**:**'}
                    </TableCell>
                    <TableCell className={`font-mono text-sm font-medium ${
                      entry?.balance_minutes > 0 ? 'text-emerald-600' : 
                      entry?.balance_minutes < 0 ? 'text-red-600' : 'text-slate-400'
                    }`}>
                      {entry ? formatMinutes(entry.balance_minutes) : ''}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm max-w-[200px] truncate">
                      {entry?.observation || ''}
                      {entry?.is_holiday && (
                        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                          Feriado
                        </Badge>
                      )}
                      {entry?.reason === 'facultativo' && (
                        <Badge variant="outline" className="ml-2 bg-teal-50 text-teal-700 border-teal-200">
                          8h
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry?.reason && REASON_LABELS[entry.reason] && (
                        <Badge 
                          variant="secondary" 
                          className={`
                            ${entry.reason === 'compensacao' ? 'bg-blue-100 text-blue-700' : ''}
                            ${entry.reason === 'falta' ? 'bg-red-100 text-red-700' : ''}
                            ${entry.reason === 'ferias' ? 'bg-purple-100 text-purple-700' : ''}
                            ${entry.reason === 'atestado' ? 'bg-orange-100 text-orange-700' : ''}
                            ${entry.reason === 'facultativo' ? 'bg-teal-100 text-teal-700' : ''}
                            ${entry.reason === 'outros' ? 'bg-slate-100 text-slate-700' : ''}
                          `}
                        >
                          {REASON_LABELS[entry.reason]}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {entry ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                              onClick={() => onEdit(entry)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-600"
                              onClick={() => onDelete(entry)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                            onClick={() => onAddEntry(date)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-slate-500">
                      {WEEKDAYS[dayOfWeek]}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}