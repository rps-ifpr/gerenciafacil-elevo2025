import { useState } from 'react';
import { Meeting } from '../../types';
import { MeetingList } from './MeetingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface MeetingGroupsProps {
  meetings: Meeting[];
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Meeting['status']) => void;
}

export function MeetingGroups({ meetings, onEdit, onDelete, onStatusChange }: MeetingGroupsProps) {
  const [selectedTab, setSelectedTab] = useState('today');

  // Obtém a data de hoje sem o horário
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtra as reuniões
  const groupedMeetings = meetings.reduce((groups, meeting) => {
    const meetingDate = new Date(meeting.date);
    meetingDate.setHours(0, 0, 0, 0);

    if (meetingDate.getTime() === today.getTime()) {
      groups.today.push(meeting);
    } else if (meetingDate > today) {
      groups.upcoming.push(meeting);
    } else {
      groups.past.push(meeting);
    }

    return groups;
  }, {
    today: [] as Meeting[],
    upcoming: [] as Meeting[],
    past: [] as Meeting[]
  });

  // Ordena as reuniões por data
  const sortMeetings = (meetings: Meeting[]) => {
    return meetings.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  groupedMeetings.today = sortMeetings(groupedMeetings.today);
  groupedMeetings.upcoming = sortMeetings(groupedMeetings.upcoming);
  groupedMeetings.past = sortMeetings(groupedMeetings.past);

  if (meetings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma reunião cadastrada. Clique em "Agendar Reunião" para começar.
      </div>
    );
  }

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full flex justify-start overflow-x-auto">
        <TabsTrigger value="today" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Hoje ({groupedMeetings.today.length})</span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Agendadas ({groupedMeetings.upcoming.length})</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Realizadas ({groupedMeetings.past.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="today" className="mt-6">
        <div className="bg-white rounded-lg">
          {groupedMeetings.today.length > 0 ? (
            <MeetingList
              meetings={groupedMeetings.today}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Nenhuma reunião agendada para hoje.
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="upcoming" className="mt-6">
        <div className="bg-white rounded-lg">
          {groupedMeetings.upcoming.length > 0 ? (
            <MeetingList
              meetings={groupedMeetings.upcoming}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Nenhuma reunião futura agendada.
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="past" className="mt-6">
        <div className="bg-white rounded-lg">
          {groupedMeetings.past.length > 0 ? (
            <MeetingList
              meetings={groupedMeetings.past}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Nenhuma reunião realizada.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}