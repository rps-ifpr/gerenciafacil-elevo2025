import { Meeting, Task, ActionPlan } from '../types';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  extendedProps: {
    type: 'meeting' | 'task' | 'action_plan';
    description?: string;
    status?: string;
    location?: string;
    meetingLink?: string;
    participants?: Meeting['participants'];
    assigneeId?: string;
    coordinatorId?: string;
    teamIds?: string[];
  };
}

export function formatCalendarEvents(
  meetings: Meeting[], 
  tasks: Task[],
  actionPlans: ActionPlan[]
): CalendarEvent[] {
  const meetingEvents = meetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    start: `${meeting.date}T${meeting.startTime}`,
    end: `${meeting.date}T${meeting.endTime}`,
    extendedProps: {
      type: 'meeting' as const,
      description: meeting.description,
      location: meeting.location,
      meetingLink: meeting.meetingLink,
      participants: meeting.participants,
    }
  }));

  const taskEvents = tasks.map(task => ({
    id: task.id,
    title: task.name,
    start: task.startDate,
    end: task.endDate,
    allDay: true,
    extendedProps: {
      type: 'task' as const,
      description: task.description,
      status: task.status,
      assigneeId: task.assigneeId,
    }
  }));

  const actionPlanEvents = actionPlans.map(plan => ({
    id: plan.id,
    title: plan.name,
    start: plan.startDate,
    end: plan.endDate,
    allDay: true,
    extendedProps: {
      type: 'action_plan' as const,
      description: plan.description,
      status: plan.status,
      coordinatorId: plan.coordinatorId,
      teamIds: plan.teamIds
    }
  }));

  return [...meetingEvents, ...taskEvents, ...actionPlanEvents];
}