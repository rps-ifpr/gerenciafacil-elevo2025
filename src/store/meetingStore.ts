import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meeting } from '../types';

interface MeetingStore {
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getMeetingsByParticipant: (participantId: string) => Meeting[];
  getMeetingsByTeam: (teamId: string) => Meeting[];
  getMeetingsByActionPlan: (actionPlanId: string) => Meeting[];
}

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      meetings: [],
      
      setMeetings: (meetings) =>
        set({ meetings }),

      addMeeting: (meeting) =>
        set((state) => ({
          meetings: [...state.meetings, meeting],
        })),

      updateMeeting: (id, updates) =>
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id
              ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
              : meeting
          ),
        })),

      deleteMeeting: (id) =>
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting.id !== id),
        })),

      getMeetingsByParticipant: (participantId) =>
        get().meetings.filter(meeting => 
          meeting.participants.collaboratorIds.includes(participantId)
        ),

      getMeetingsByTeam: (teamId) =>
        get().meetings.filter(meeting => 
          meeting.participants.teamIds.includes(teamId)
        ),

      getMeetingsByActionPlan: (actionPlanId) =>
        get().meetings.filter(meeting => 
          meeting.participants.actionPlanIds.includes(actionPlanId)
        ),
    }),
    {
      name: 'meeting-storage',
    }
  )
);