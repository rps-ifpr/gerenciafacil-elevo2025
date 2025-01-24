import { FormField } from '../common/FormField';
import { WorkSchedule } from '../../types';

interface WorkScheduleSectionProps {
  schedules: WorkSchedule[];
  onChange: (schedules: WorkSchedule[]) => void;
}

export function WorkScheduleSection({ schedules, onChange }: WorkScheduleSectionProps) {
  const addSchedule = () => {
    onChange([
      ...schedules,
      {
        type: 'presential',
        days: [],
        startTime: '08:00',
        endTime: '17:00',
      },
    ]);
  };

  const updateSchedule = (index: number, updates: Partial<WorkSchedule>) => {
    onChange(
      schedules.map((schedule, i) =>
        i === index ? { ...schedule, ...updates } : schedule
      )
    );
  };

  const removeSchedule = (index: number) => {
    onChange(schedules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Períodos de Trabalho</h3>
        <button
          type="button"
          onClick={addSchedule}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Adicionar Período
        </button>
      </div>

      {schedules.map((schedule, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Período {index + 1}</h4>
            {schedules.length > 1 && (
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remover
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tipo">
              <select
                value={schedule.type}
                onChange={(e) => updateSchedule(index, {
                  type: e.target.value as 'presential' | 'remote'
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="presential">Presencial</option>
                <option value="remote">Remoto</option>
              </select>
            </FormField>

            <div className="flex gap-2">
              <FormField label="Início">
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => updateSchedule(index, { startTime: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </FormField>
              <FormField label="Fim">
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => updateSchedule(index, { endTime: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </FormField>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schedule.days.includes(day)}
                  onChange={(e) => {
                    const newDays = e.target.checked
                      ? [...schedule.days, day]
                      : schedule.days.filter(d => d !== day);
                    updateSchedule(index, { days: newDays });
                  }}
                  className="rounded border-gray-300"
                />
                {day}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}