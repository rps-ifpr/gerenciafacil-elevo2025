import { useState, useEffect } from 'react';
import { Plus, Edit2, Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Meeting } from '../../types';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ParticipantSelector } from './ParticipantSelector';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';

interface MeetingFormProps {
  onSubmit: (meeting: Omit<Meeting, 'id'>) => void;
  initialData?: Meeting;
  isEditing?: boolean;
}

export function MeetingForm({ onSubmit, initialData, isEditing }: MeetingFormProps) {
  const { canEdit } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'presential' as const,
    location: '',
    meetingLink: '',
    status: 'scheduled' as const,
    participants: {
      collaboratorIds: [] as string[],
      teamIds: [] as string[],
      actionPlanIds: [] as string[],
    }
  });

  useEffect(() => {
    if (isEditing && !canEdit('meetings')) {
      setError('Você não tem permissão para editar reuniões');
      setLoading(false);
      return;
    }
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        date: initialData.date,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        type: initialData.type,
        location: initialData.location || '',
        meetingLink: initialData.meetingLink || '',
        status: initialData.status,
        participants: initialData.participants
      });
    }
    setLoading(false);
  }, [initialData, isEditing, canEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.title.trim()) {
      setError('Título da reunião é obrigatório');
      return;
    }

    if (!formData.date) {
      setError('Data da reunião é obrigatória');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError('Horários de início e término são obrigatórios');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('Horário de término deve ser posterior ao horário de início');
      return;
    }

    if (formData.type === 'presential' && !formData.location) {
      setError('Local é obrigatório para reuniões presenciais');
      return;
    }

    if (formData.type === 'online' && !formData.meetingLink) {
      setError('Link é obrigatório para reuniões online');
      return;
    }

    const hasParticipants = 
      formData.participants.collaboratorIds.length > 0 || 
      formData.participants.teamIds.length > 0 || 
      formData.participants.actionPlanIds.length > 0;

    if (!hasParticipants) {
      setError('Selecione pelo menos um participante, grupo ou ação/plano');
      return;
    }

    onSubmit(formData);

    if (!isEditing) {
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'presential',
        location: '',
        meetingLink: '',
        status: 'scheduled',
        participants: {
          collaboratorIds: [],
          teamIds: [],
          actionPlanIds: [],
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <FormField label="Título da Reunião" required>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Digite o título da reunião"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <FormField label="Descrição">
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Digite uma descrição para a reunião"
          className="w-full rounded-md border border-gray-300 px-3 py-2 h-32"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Data" required>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </FormField>

        <FormField label="Hora Início" required>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </FormField>

        <FormField label="Hora Fim" required>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Tipo de Reunião" required>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              type: e.target.value as 'presential' | 'online',
              location: e.target.value === 'online' ? '' : prev.location,
              meetingLink: e.target.value === 'presential' ? '' : prev.meetingLink
            }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="presential">Presencial</option>
            <option value="online">Online</option>
          </select>
        </FormField>

        <FormField label={formData.type === 'presential' ? 'Local' : 'Link da Reunião'} required>
          <div className="flex items-center">
            {formData.type === 'presential' ? (
              <>
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Digite o local da reunião"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </>
            ) : (
              <>
                <Video className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="Cole o link da reunião"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </>
            )}
          </div>
        </FormField>
      </div>

      <ParticipantSelector
        selected={formData.participants}
        onChange={(participants) => setFormData(prev => ({ ...prev, participants }))}
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Reunião" : "Agendar Reunião"}
      </button>
    </form>
  );
}