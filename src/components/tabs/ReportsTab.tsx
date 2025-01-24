import { useState, useEffect } from "react";
import { useMeetingStore } from "../../store/meetingStore";
import { MeetingForm } from "../meetings/MeetingForm";
import { MeetingGroups } from "../meetings/MeetingGroups"; // Importar MeetingGroups ao invés de MeetingList
import { MeetingTest } from "../meetings/MeetingTest";
import { PageContainer } from "../common/PageContainer";
import { AddButton } from "../ui/AddButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { meetingService } from "../../services/meetingService";
import { Meeting } from "../../types";

export function ReportsTab() {
  const { meetings, setMeetings, addMeeting, updateMeeting, deleteMeeting } = useMeetingStore();
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const loadedMeetings = await meetingService.getAllMeetings();
      setMeetings(loadedMeetings);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar reuniões:', err);
      setError('Erro ao carregar reuniões. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (meetingData: Omit<Meeting, 'id' | 'active' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingMeeting) {
        await meetingService.updateMeeting(editingMeeting.id, meetingData);
        await loadMeetings();
        setEditingMeeting(null);
      } else {
        const newMeeting = await meetingService.createMeeting(meetingData);
        addMeeting(newMeeting);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar reunião:', error);
      setError('Erro ao salvar reunião. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      try {
        await meetingService.deleteMeeting(id);
        deleteMeeting(id);
      } catch (error) {
        console.error('Erro ao deletar reunião:', error);
        setError('Erro ao deletar reunião. Tente novamente.');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Meeting['status']) => {
    try {
      await meetingService.updateMeetingStatus(id, newStatus);
      await loadMeetings(); // Recarrega para ter os dados mais atualizados
    } catch (error) {
      console.error('Erro ao alterar status da reunião:', error);
      setError('Erro ao alterar status da reunião. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Reuniões"
      action={
        !showForm && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowTest(!showTest)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {showTest ? 'Ocultar Testes' : 'Mostrar Testes'}
            </button>
            <AddButton
              onClick={() => setShowForm(true)}
              label="Agendar Reunião"
            />
          </div>
        )
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
          <button 
            onClick={loadMeetings}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {showTest && (
        <div className="mb-8">
          <MeetingTest />
        </div>
      )}

      {showForm || editingMeeting ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingMeeting ? 'Editar Reunião' : 'Nova Reunião'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingMeeting(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <MeetingForm
            onSubmit={handleSubmit}
            initialData={editingMeeting || undefined}
            isEditing={!!editingMeeting}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <MeetingGroups
              meetings={meetings}
              onEdit={(meeting) => {
                setEditingMeeting(meeting);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}