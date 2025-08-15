import type { Project } from '@/models';
import { projectApi } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export function useProject(id: number) {
  return useQuery<Project | null>({
    queryKey: ['projects', { id }],
    queryFn: () => projectApi.getById(id),
  });
}
