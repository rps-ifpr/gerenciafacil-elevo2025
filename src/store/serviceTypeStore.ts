import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceType } from '../types';

interface ServiceTypeStore {
  serviceTypes: ServiceType[];
  addServiceType: (serviceType: ServiceType) => void;
  updateServiceType: (id: string, updates: Partial<ServiceType>) => void;
  deleteServiceType: (id: string) => void;
  toggleServiceTypeStatus: (id: string) => void;
}

export const useServiceTypeStore = create<ServiceTypeStore>()(
  persist(
    (set) => ({
      serviceTypes: [],
      
      addServiceType: (serviceType) =>
        set((state) => ({
          serviceTypes: [...state.serviceTypes, serviceType],
        })),

      updateServiceType: (id, updates) =>
        set((state) => ({
          serviceTypes: state.serviceTypes.map((type) =>
            type.id === id ? { ...type, ...updates } : type
          ),
        })),

      deleteServiceType: (id) =>
        set((state) => ({
          serviceTypes: state.serviceTypes.filter((type) => type.id !== id),
        })),

      toggleServiceTypeStatus: (id) =>
        set((state) => ({
          serviceTypes: state.serviceTypes.map((type) =>
            type.id === id ? { ...type, active: !type.active } : type
          ),
        })),
    }),
    {
      name: 'service-type-storage',
    }
  )
);