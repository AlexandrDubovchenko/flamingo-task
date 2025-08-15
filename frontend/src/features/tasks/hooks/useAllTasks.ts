import { taskApi } from '@/shared/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useAllTasks() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = await taskApi.getAll();

      const byProject = tasks.reduce((acc, item) => {
        const key = item.projectId;
        (acc[key] ||= []).push(item);
        return acc;
      }, {} as Record<string, typeof tasks>);
      for (const [projectId, tasksForProject] of Object.entries(byProject)) {
        queryClient.setQueryData(
          ['tasks', { projectId: Number(projectId) }],
          tasksForProject
        );
      }

      return tasks;
    },
  });
}
