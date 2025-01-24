import { useState, useEffect } from "react";
import { useActionPlanStore } from "../../store/actionPlanStore";
import { ActionPlanForm } from "../actions/ActionPlanForm";
import { ActionPlanList } from "../actions/ActionPlanList";
import { ActionPlanTest } from "../actions/ActionPlanTest";
import { PageContainer } from "../common/PageContainer";
import { AddButton } from "../ui/AddButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { actionPlanService } from "../../services/actionPlanService";
import { ActionPlan } from "../../types";

export function ProjectsTab() {
  const { actionPlans, setActionPlans, addActionPlan, updateActionPlan, deleteActionPlan } = useActionPlanStore();
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActionPlans();
  }, []);

  const loadActionPlans = async () => {
    try {
      setLoading(true);
      const plans = await actionPlanService.getAllActionPlans();
      setActionPlans(plans);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar ações:', err);
      setError('Erro ao carregar ações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (planData: Omit<ActionPlan, 'id' | 'active' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingPlan) {
        await actionPlanService.updateActionPlan(editingPlan.id, planData);
        await loadActionPlans();
        setEditingPlan(null);
      } else {
        const newPlan = await actionPlanService.createActionPlan(planData);
        addActionPlan(newPlan);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar ação:', error);
      setError('Erro ao salvar ação. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ação?')) {
      try {
        await actionPlanService.deleteActionPlan(id);
        deleteActionPlan(id);
      } catch (error) {
        console.error('Erro ao deletar ação:', error);
        setError('Erro ao deletar ação. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await actionPlanService.toggleActionPlanStatus(id);
      await loadActionPlans();
    } catch (error) {
      console.error('Erro ao alternar status da ação:', error);
      setError('Erro ao alternar status da ação. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Ações"
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
              label="Nova Ação"
            />
          </div>
        )
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
          <button 
            onClick={loadActionPlans}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {showTest && (
        <div className="mb-8">
          <ActionPlanTest />
        </div>
      )}

      {showForm || editingPlan ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingPlan ? 'Editar Ação' : 'Nova Ação'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingPlan(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <ActionPlanForm
            onSubmit={handleSubmit}
            initialData={editingPlan || undefined}
            isEditing={!!editingPlan}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ActionPlanList
              actionPlans={actionPlans}
              onEdit={(plan) => {
                setEditingPlan(plan);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}