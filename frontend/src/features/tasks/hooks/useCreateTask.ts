import type { Project } from '@/models';
import { taskApi } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks'], (oldData: Project[]) => [
        ...(oldData || []),
        data,
      ]);
      queryClient.setQueryData(
        ['tasks', { projectId: data.projectId }],
        (oldData: Project[]) => {
          return [...(oldData || []), data];
        }
      );
    },
  });
}
