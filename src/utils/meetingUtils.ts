import { Meeting, ReschedulingEntry } from '../types/Meeting';

export function canRescheduleMeeting(meeting: Meeting): boolean {
  // Só permite reagendar reuniões agendadas
  return meeting.status === 'scheduled';
}

export function createReschedulingEntry(
  meeting: Meeting,
  newDate: string,
  newStartTime: string,
  newEndTime: string,
  reason: string,
  userId: string
): ReschedulingEntry {
  return {
    id: crypto.randomUUID(),
    previousDate: meeting.date,
    previousStartTime: meeting.startTime,
    previousEndTime: meeting.endTime,
    newDate,
    newStartTime,
    newEndTime,
    reason,
    changedBy: userId,
    changedAt: new Date().toISOString(),
  };
}