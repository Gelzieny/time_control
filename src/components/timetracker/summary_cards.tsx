import React from 'react';
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, TrendingDown, Scale } from 'lucide-react';

const formatMinutes = (minutes) => {
  const sign = minutes < 0 ? '-' : '';
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export default function SummaryCards({ positiveMinutes, negativeMinutes, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-1">Horas Positivas</p>
            <p className="text-3xl font-bold text-emerald-800">{formatMinutes(positiveMinutes)}</p>
            <p className="text-xs text-emerald-600 mt-2">Disponíveis para compensação</p>
          </div>
          <div className="p-3 bg-emerald-200/50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-red-700 mb-1">Horas Negativas</p>
            <p className="text-3xl font-bold text-red-800">{formatMinutes(Math.abs(negativeMinutes))}</p>
            <p className="text-xs text-red-600 mt-2">A compensar ou descontar</p>
          </div>
          <div className="p-3 bg-red-200/50 rounded-xl">
            <TrendingDown className="w-6 h-6 text-red-700" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Saldo Final</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatMinutes(balance)}
            </p>
            <p className="text-xs text-slate-600 mt-2">Balanço do período</p>
          </div>
          <div className="p-3 bg-slate-200/50 rounded-xl">
            <Scale className="w-6 h-6 text-slate-700" />
          </div>
        </div>
      </Card>
    </div>
  );
}