import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Edit,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CreateTaskDialog } from '@/features/tasks/components/CreateTaskDialog';
import { UpdateTaskDialog } from '@/features/tasks/components/UpdateTaskDialog';
import type { Task, TaskStatus, TaskPriority } from '@/models';
import { useProject } from '@/features/projects/hooks/useProject';
import { useTasksByProjectId } from '@/features/tasks/hooks/useTasksByProjectId';

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className='h-4 w-4 text-green-500' />;
    case 'in_progress':
      return <AlertCircle className='h-4 w-4 text-blue-500' />;
    case 'todo':
      return <Circle className='h-4 w-4 text-gray-400' />;
    default:
      return <Circle className='h-4 w-4 text-gray-400' />;
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'todo':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
};

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(Number(id));
  const { data: tasks } = useTasksByProjectId(Number(id));
  const navigate = useNavigate();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isUpdateTaskOpen, setIsUpdateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const taskStats = useMemo(() => {
    if (!tasks) {
      return { total: 0, completed: 0, inProgress: 0, todo: 0 };
    }
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === 'completed'
    ).length;
    const inProgress = tasks.filter(
      (task) => task.status === 'in_progress'
    ).length;
    const todo = tasks.filter((task) => task.status === 'todo').length;

    return { total, completed, inProgress, todo };
  }, [tasks]);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateTaskOpen(true);
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='h-32 bg-gray-200 rounded mb-6'></div>
          <div className='grid gap-4 md:grid-cols-3 mb-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-24 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold mb-4'>Project Not Found</h1>
          <p className='text-muted-foreground mb-6'>
            The project you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {project.name}
            </h1>
            <p className='text-muted-foreground'>
              Created {formatDate(project.createdAt)} • Last updated{' '}
              {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-relaxed'>{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Tasks</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{taskStats.total}</div>
            <p className='text-xs text-muted-foreground'>
              All tasks in this project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completed</CardTitle>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {taskStats.completed}
            </div>
            <p className='text-xs text-muted-foreground'>
              {taskStats.total > 0
                ? Math.round((taskStats.completed / taskStats.total) * 100)
                : 0}
              % completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>In Progress</CardTitle>
            <Clock className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {taskStats.inProgress}
            </div>
            <p className='text-xs text-muted-foreground'>
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>To Do</CardTitle>
            <Circle className='h-4 w-4 text-gray-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-600'>
              {taskStats.todo}
            </div>
            <p className='text-xs text-muted-foreground'>Ready to be started</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Tasks</h2>
          <Button onClick={() => setIsCreateTaskOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            New Task
          </Button>
        </div>

        {tasks?.length === 0 ? (
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Calendar className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No tasks yet</h3>
              <p className='text-muted-foreground text-center mb-6'>
                Get started by creating your first task for this project
              </p>
              <Button onClick={() => setIsCreateTaskOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {tasks?.map((task) => (
              <Card key={task.id} className='hover:shadow-md transition-shadow'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start space-x-4 flex-1'>
                      <div className='flex-shrink-0 mt-1'>
                        {getStatusIcon(task.status)}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <h3 className='text-lg font-medium leading-6'>
                            {task.title}
                          </h3>
                          <Badge variant='outline' className='ml-2'>
                            <div
                              className={`w-2 h-2 rounded-full ${getPriorityColor(
                                task.priority
                              )} mr-1`}
                            />
                            {task.priority}
                          </Badge>
                        </div>

                        {task.description && (
                          <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                            {task.description}
                          </p>
                        )}

                        <div className='flex items-center space-x-4 text-xs text-muted-foreground'>
                          <div className='flex items-center space-x-1'>
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                task.status
                              )}`}
                            />
                            <span className='capitalize'>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>

                          {task.dueDate && (
                            <div className='flex items-center space-x-1'>
                              <Calendar className='h-3 w-3' />
                              <span>Due {formatDate(task.dueDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={project.id}
      />

      {/* Update Task Dialog */}
      <UpdateTaskDialog
        open={isUpdateTaskOpen}
        onOpenChange={setIsUpdateTaskOpen}
        task={selectedTask}
        // onTaskUpdated={handleTaskUpdated}
      />
    </div>
  );
}
