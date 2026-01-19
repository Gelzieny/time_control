import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MonthSelector({ currentMonth, onChange }) {
  const handlePrevMonth = () => {
    onChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onChange(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevMonth}
        className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2 min-w-[180px] justify-center">
        <Calendar className="h-5 w-5 text-emerald-600" />
        <span className="text-lg font-semibold text-slate-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}