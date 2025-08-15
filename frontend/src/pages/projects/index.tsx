import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CreateProjectDialog } from '@/features/projects/components/CreateProjectDialog';
import { CreateTaskDialog } from '@/features/tasks/components/CreateTaskDialog';
import { useAllProjects } from '@/features/projects/hooks/useAllProjects';
import { useAllTasks } from '@/features/tasks/hooks/useAllTasks';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useAllProjects();
  const { data: tasks } = useAllTasks();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const handleCreateTask = (projectId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProjectId(projectId);
    setIsCreateTaskOpen(true);
  };

  const handleViewDetails = (projectId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate(`/app/projects/${projectId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  console.log(projects)
  if (isLoading || !projects) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Projects</h1>
          <p className='text-muted-foreground'>
            Manage your projects and create new tasks
          </p>
        </div>
        <Button onClick={() => setIsCreateProjectOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Projects
            </CardTitle>
            <FolderOpen className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{projects.length}</div>
            <p className='text-xs text-muted-foreground'>
              Active projects in your workspace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Tasks</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{tasks?.length}</div>
            <p className='text-xs text-muted-foreground'>
              Tasks across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Your Projects</h2>

        {projects.length === 0 ? (
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <FolderOpen className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No projects yet</h3>
              <p className='text-muted-foreground text-center mb-6'>
                Get started by creating your first project
              </p>
              <Button onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <Card
                key={project.id}
                className='hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => handleViewDetails(project.id)}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <CardTitle className='text-lg'>{project.name}</CardTitle>
                      <Badge variant='secondary' className='w-fit'>
                        Active
                      </Badge>
                    </div>
                  </div>
                  {project.description && (
                    <CardDescription className='line-clamp-2'>
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between text-sm text-muted-foreground'>
                    <span>Created: {formatDate(project.createdAt)}</span>
                    <span>Updated: {formatDate(project.updatedAt)}</span>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      onClick={(e) => handleCreateTask(project.id, e)}
                    >
                      <Plus className='mr-2 h-3 w-3' />
                      Add Task
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      onClick={(e) => handleViewDetails(project.id, e)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={selectedProjectId}
      />
    </div>
  );
}
