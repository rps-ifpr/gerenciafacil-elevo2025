import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Meeting } from '../../types/Meeting';
import { FormField } from '../common/FormField';

interface ReschedulingDialogProps {
  meeting: Meeting;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: string, newStartTime: string, newEndTime: string, reason: string) => void;
}

export function ReschedulingDialog({ meeting, isOpen, onClose, onConfirm }: ReschedulingDialogProps) {
  const [newDate, setNewDate] = useState(meeting.date);
  const [newStartTime, setNewStartTime] = useState(meeting.startTime);
  const [newEndTime, setNewEndTime] = useState(meeting.endTime);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(newDate, newStartTime, newEndTime, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Reagendar Reunião</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nova Data" required>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Novo Horário Início" required>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </FormField>

            <FormField label="Novo Horário Fim" required>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </FormField>
          </div>

          <FormField label="Motivo do Reagendamento" required>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
              placeholder="Descreva o motivo do reagendamento"
              required
            />
          </FormField>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Confirmar Reagendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}