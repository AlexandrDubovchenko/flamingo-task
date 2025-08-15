import { taskApi } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export function useTasksByProjectId(id: number) {
  return useQuery({
    queryKey: ['tasks', { projectId: id }],
    queryFn: () => taskApi.getAllByProjectId(id),
    enabled: !!id,
  });
}
