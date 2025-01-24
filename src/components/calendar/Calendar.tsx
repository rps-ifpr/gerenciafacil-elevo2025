import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { useTaskStore } from '../../store/taskStore';
import { useMeetingStore } from '../../store/meetingStore';
import { EventModal } from './EventModal';
import { EmptyState } from './EmptyState';
import { formatCalendarEvents } from '../../utils/calendarUtils';
import { actionPlanService } from '../../services/actionPlanService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function Calendar() {
  const { meetings } = useMeetingStore();
  const { tasks } = useTaskStore();
  const { actionPlans, addActionPlan } = useActionPlanStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    loadActionPlans();
  }, [retryCount]);

  const loadActionPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const plans = await actionPlanService.getAllActionPlans();
      plans.forEach(plan => addActionPlan(plan));
    } catch (error) {
      console.error('Erro ao carregar ações/planos:', error);
      setError('Erro ao carregar dados do calendário. Tente novamente.');
      
      // Tenta recarregar automaticamente se não excedeu o limite de tentativas
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000 * (retryCount + 1)); // Backoff exponencial
      }
    } finally {
      setLoading(false);
    }
  };

  const events = formatCalendarEvents(meetings, tasks, actionPlans);
  const hasEvents = events.length > 0;

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventModal(true);
  };

  const handleDatesSet = async ({ start, end }) => {
    try {
      const startDate = start.toISOString();
      const endDate = end.toISOString();
      const plans = await actionPlanService.getActionPlansByDateRange(startDate, endDate);
      plans.forEach(plan => addActionPlan(plan));
      setError(null); // Limpa erro se carregamento foi bem sucedido
    } catch (error) {
      console.error('Erro ao carregar ações/planos do período:', error);
      // Não mostra erro para não interromper a experiência do usuário
      // já que os dados principais já foram carregados
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="text-center text-red-600 dark:text-red-400 py-8">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      {hasEvents ? (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={ptBrLocale}
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia'
          }}
          allDayText="Dia todo"
          eventClassNames={(arg) => [
            'cursor-pointer',
            arg.event.extendedProps.type === 'meeting' ? 'bg-blue-500' :
            arg.event.extendedProps.type === 'task' ? 'bg-orange-500' :
            'bg-green-500'
          ]}
        />
      ) : (
        <EmptyState />
      )}

      {showEventModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}