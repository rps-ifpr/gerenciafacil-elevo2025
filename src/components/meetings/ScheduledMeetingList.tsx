import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Video, Users } from 'lucide-react';
import { Meeting } from '../../types';
import { useStore } from '../../store/useStore';
import { useTeamStore } from '../../store/teamStore';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { ActionButtons } from '../common/ActionButtons';
import { ReschedulingDialog } from './ReschedulingDialog';
import { ReschedulingHistory } from './ReschedulingHistory';
import { canRescheduleMeeting, createReschedulingEntry } from '../../utils/meetingUtils';

interface ScheduledMeetingListProps {
  meetings: Meeting[];
  onUpdate: (id: string, updates: Partial<Meeting>) => void;
}

export function ScheduledMeetingList({ meetings, onUpdate }: ScheduledMeetingListProps) {
  const { user } = useStore();
  const { teams } = useTeamStore();
  const { actionPlans } = useActionPlanStore();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const handleReschedule = (meeting: Meeting) => {
    if (!canRescheduleMeeting(meeting)) return;
    setSelectedMeeting(meeting);
    setShowRescheduleDialog(true);
  };

  const handleRescheduleConfirm = (
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    reason: string
  ) => {
    if (!selectedMeeting || !user) return;

    const reschedulingEntry = createReschedulingEntry(
      selectedMeeting,
      newDate,
      newStartTime,
      newEndTime,
      reason,
      user.name
    );

    onUpdate(selectedMeeting.id, {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'rescheduled',
      reschedulingHistory: [
        ...(selectedMeeting.reschedulingHistory || []),
        reschedulingEntry
      ],
      updatedAt: new Date().toISOString()
    });

    setShowRescheduleDialog(false);
    setSelectedMeeting(null);
  };

  const getParticipantsPreview = (meeting: Meeting) => {
    const parts = [];
    
    if (meeting.participants.collaboratorIds?.length) {
      parts.push(`${meeting.participants.collaboratorIds.length} prestador(es)`);
    }
    
    if (meeting.participants.teamIds?.length) {
      parts.push(`${meeting.participants.teamIds.length} grupo(s)`);
    }
    
    if (meeting.participants.actionPlanIds?.length) {
      parts.push(`${meeting.participants.actionPlanIds.length} ação(ões)`);
    }

    return parts.join(', ');
  };

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
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

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{getParticipantsPreview(meeting)}</span>
              </div>

              {meeting.description && (
                <p className="text-gray-600 mt-2">{meeting.description}</p>
              )}

              <ReschedulingHistory history={meeting.reschedulingHistory} />
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <ActionButtons
              onEdit={canRescheduleMeeting(meeting) ? () => handleReschedule(meeting) : undefined}
              disabledMessage={
                !canRescheduleMeeting(meeting) 
                  ? "Não é possível reagendar uma reunião que não está com status 'Agendada'"
                  : undefined
              }
            />
          </div>
        </div>
      ))}

      {selectedMeeting && (
        <ReschedulingDialog
          meeting={selectedMeeting}
          isOpen={showRescheduleDialog}
          onClose={() => {
            setShowRescheduleDialog(false);
            setSelectedMeeting(null);
          }}
          onConfirm={handleRescheduleConfirm}
        />
      )}
    </div>
  );
}