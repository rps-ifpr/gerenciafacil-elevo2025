import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team } from '../types';

interface TeamStore {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  toggleTeamStatus: (id: string) => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      teams: [],
      
      setTeams: (teams) =>
        set({ teams }),

      addTeam: (team) =>
        set((state) => ({
          teams: [...state.teams, team],
        })),

      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === id ? { ...team, ...updates } : team
          ),
        })),

      deleteTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
        })),

      toggleTeamStatus: (id) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === id ? { ...team, active: !team.active } : team
          ),
        })),
    }),
    {
      name: 'team-storage',
    }
  )
);