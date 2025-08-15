import type { Project, UpdateTaskDto } from '@/models';
import { taskApi } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      taskApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['tasks'], (oldData: Project[]) => {
        return oldData?.map((task) =>
          task.id === variables.id ? { ...data } : task
        );
      });
      queryClient.setQueryData(
        ['tasks', { projectId: data.projectId }],
        (oldData: Project[]) => {
          return oldData?.map((task) =>
            task.id === variables.id ? { ...data } : task
          );
        }
      );
    },
  });
}
