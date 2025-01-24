import { Meeting } from '../../types';
import { useStore } from '../../store/useStore';
import { useTeamStore } from '../../store/teamStore';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { ActionButtons } from '../common/ActionButtons';
import { usePermissions } from '../../hooks/usePermissions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Video, Users } from 'lucide-react';

interface MeetingListProps {
  meetings: Meeting[];
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Meeting['status']) => void;
}

export function MeetingList({ meetings, onEdit, onDelete, onStatusChange }: MeetingListProps) {
  const { collaborators } = useStore();
  const { teams } = useTeamStore();
  const { actionPlans } = useActionPlanStore();
  const { canEdit, canDelete } = usePermissions();

  const getParticipantsDetails = (meeting: Meeting) => {
    const details = [];

    if (meeting.participants.collaboratorIds?.length) {
      const collaboratorNames = meeting.participants.collaboratorIds
        .map(id => collaborators.find(c => c.id === id)?.name)
        .filter(Boolean);
      if (collaboratorNames.length) {
        details.push({
          type: 'Prestadores',
          names: collaboratorNames
        });
      }
    }

    if (meeting.participants.teamIds?.length) {
      const teamNames = meeting.participants.teamIds
        .map(id => teams.find(t => t.id === id)?.name)
        .filter(Boolean);
      if (teamNames.length) {
        details.push({
          type: 'Grupos',
          names: teamNames
        });
      }
    }

    return details;
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma reunião encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const participantsDetails = getParticipantsDetails(meeting);
        
        return (
          <div
            key={meeting.id}
            className="flex items-start justify-between p-4 border rounded-md hover:bg-gray-50"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{meeting.title}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  meeting.status === 'rescheduled' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {meeting.status === 'rescheduled' ? 'Reagendada' : 'Agendada'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(meeting.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {meeting.startTime} - {meeting.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {meeting.type === 'presential' ? (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <a 
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Link da reunião
                      </a>
                    </>
                  )}
                </div>

                {participantsDetails.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Participantes:</span>
                    </div>
                    {participantsDetails.map((detail, detailIndex) => (
                      <div key={`${meeting.id}-detail-${detailIndex}`} className="ml-6">
                        <span className="font-medium text-gray-600">{detail.type}:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {detail.names.map((name, nameIndex) => (
                            <span 
                              key={`${meeting.id}-${detail.type}-${nameIndex}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {meeting.description && (
                  <p className="text-gray-600 mt-2">{meeting.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <ActionButtons
                onEdit={canEdit('meetings') ? () => onEdit(meeting) : undefined}
                onDelete={canDelete('meetings') ? () => onDelete(meeting.id) : undefined}
                isCompleted={meeting.status === 'completed'}
                disabledMessage={!canEdit('meetings') ? "Você não tem permissão para editar reuniões" : undefined}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}