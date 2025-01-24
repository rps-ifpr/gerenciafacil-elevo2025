// Add statusLogs initialization to task creation
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Create a task for each selected member
  const tasks = selectedMembers.map(memberId => ({
    name: taskName,
    actionPlanId: actionPlan.id,
    assigneeId: memberId,
    startDate: `${startDate}T00:00`,
    endDate: `${endDate}T23:59`,
    status: 'pending' as const,
    description: '',
    statusLogs: [], // Initialize statusLogs array
  }));

  onSubmit(tasks);
};