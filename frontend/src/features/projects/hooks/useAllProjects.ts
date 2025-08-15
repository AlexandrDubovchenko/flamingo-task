import { projectApi } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export function useAllProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll(),
  });
}
