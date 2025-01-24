import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Calendar, Clock, MapPin, Video, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTeamStore } from '../../store/teamStore';

export function EventModal({ event, onClose }) {
  const { collaborators } = useStore();
  const { teams } = useTeamStore();
  const eventData = event.extendedProps;

  const getParticipantsText = () => {
    if (eventData.type === 'meeting') {
      const parts = [];
      if (eventData.participants?.collaboratorIds?.length) {
        const collaboratorNames = eventData.participants.collaboratorIds
          .map(id => collaborators.find(c => c.id === id)?.name)
          .filter(Boolean);
        parts.push(`${collaboratorNames.length} prestador(es)`);
      }
      if (eventData.participants?.teamIds?.length) {
        const teamNames = eventData.participants.teamIds
          .map(id => teams.find(t => t.id === id)?.name)
          .filter(Boolean);
        parts.push(`${teamNames.length} grupo(s)`);
      }
      return parts.join(', ');
    } else {
      const assignee = collaborators.find(c => c.id === eventData.assigneeId);
      return assignee ? `Responsável: ${assignee.name}` : '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full m-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>
              {format(event.start, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </span>
          </div>

          {eventData.type === 'meeting' && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              {eventData.type === 'presential' ? (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>{eventData.location}</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <a
                    href={eventData.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Link da reunião
                  </a>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span>{getParticipantsText()}</span>
          </div>

          {eventData.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {eventData.description}
            </p>
          )}

          {eventData.type === 'task' && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
              eventData.status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
            }`}>
              {eventData.status === 'completed' ? 'Concluída' : 'Em andamento'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}