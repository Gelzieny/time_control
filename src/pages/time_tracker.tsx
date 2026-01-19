import { Plus, FileText, Clock } from 'lucide-react';

export function TimeTracker() {
  return(
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sistema de Ponto</h1>
          </div>
          <p className="text-emerald-100">Controle de horas e banco de horas</p>
        </div>
      </div>
    </div>
  )
}