import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Calendar, Clock, Flag } from 'lucide-react';
import { TaskStatus, TaskPriority, type CreateTaskDto } from '@/models';
import { useCreateTask } from '../hooks/useCreateTask';

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(255, 'Task title is too long'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.number(),
  dueDate: z.iso.date(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number | null;
  onTaskCreated?: (task: CreateTaskDto) => void;
}

const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do', color: 'bg-gray-500' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-500' },
  { value: TaskStatus.COMPLETED, label: 'Completed', color: 'bg-green-500' },
];

const priorityOptions = [
  { value: TaskPriority.LOW, label: 'Low', color: 'bg-green-500' },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'bg-yellow-500' },
  { value: TaskPriority.HIGH, label: 'High', color: 'bg-red-500' },
];

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const mutation = useCreateTask();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    },
  });

  useEffect(() => {
    if (projectId) {
      setValue('projectId', projectId);
    }
  }, [projectId, setValue]);

  const handleStatusChange = (value: string) => {
    setValue('status', value as TaskStatus);
  };

  const handlePriorityChange = (value: string) => {
    setValue('priority', value as TaskPriority);
  };

  const onSubmit = async (data: CreateTaskFormData) => {
    if (!projectId) {
      console.error('No project selected');
      return;
    }

    try {
      const taskData: CreateTaskDto = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: projectId,
        dueDate: data.dueDate,
      };

      const task = await mutation.mutateAsync(taskData);

      onTaskCreated?.(task);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Task Title *</Label>
              <Input
                id='title'
                placeholder='Enter task title'
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className='text-sm text-red-500'>{errors.title.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Enter task description (optional)'
                rows={3}
                {...register('description')}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='flex items-center gap-2'>
                  <Flag className='h-4 w-4' />
                  Status
                </Label>
                <Select
                  value={watch('status')}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-2 h-2 rounded-full ${status.color}`}
                          />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  Priority
                </Label>
                <Select
                  value={watch('priority')}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select priority' />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-2 h-2 rounded-full ${priority.color}`}
                          />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='dueDate' className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  Due Date
                </Label>
                <Input
                  id='dueDate'
                  type='date'
                  min={formatDateForInput(new Date())}
                  {...register('dueDate')}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting || !projectId}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
