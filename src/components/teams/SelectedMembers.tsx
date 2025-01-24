import { Users } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface SelectedMembersProps {
  memberIds: string[];
}

export function SelectedMembers({ memberIds }: SelectedMembersProps) {
  const { collaborators } = useStore();

  if (memberIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-blue-700 mb-2">
        <Users className="w-4 h-4" />
        <span className="font-medium">Prestadores Selecionados: {memberIds.length}</span>
      </div>
      <div className="text-sm text-blue-600">
        {memberIds.map(memberId => {
          const member = collaborators.find(c => c.id === memberId);
          return member && (
            <div key={memberId} className="inline-block mr-4">
              • {member.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}