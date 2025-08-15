import type { Project } from '@/models';
import { projectApi } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(['projects'], (oldData: Project[]) => [
        ...(oldData || []),
        data,
      ]);
    },
  });
}
