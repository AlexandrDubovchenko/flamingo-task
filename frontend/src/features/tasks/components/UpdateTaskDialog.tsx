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
import { Calendar, Clock, Flag, User, Loader2 } from 'lucide-react';
import {
  TaskStatus,
  TaskPriority,
  type Task,
  type UpdateTaskDto,
} from '@/models';
import { useUpdateTask } from '../hooks/useUpdateTask';

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(255, 'Task title is too long'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.number().optional(),
  dueDate: z.string().optional(),
});

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

interface UpdateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
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

// Mock users - in a real app, this would come from an API
const mockUsers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Wilson' },
];

export function UpdateTaskDialog({
  open,
  onOpenChange,
  task,
}: UpdateTaskDialogProps) {
  const mutation = useUpdateTask();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    mode: 'onChange',
  });

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (task && open) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Convert to date format
      });
    }
  }, [task, open, reset]);

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');
  const selectedAssigneeId = watch('assigneeId');

  const onSubmit = async (data: UpdateTaskFormData) => {
    if (!task) return;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updateData: UpdateTaskDto = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? `${data.dueDate}T00:00:00Z` : undefined,
      };

      const newTask = await mutation.mutateAsync({
        data: updateData,
        id: task.id,
      });
      console.log('Updated task:', newTask);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[525px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Flag className='h-5 w-5' />
            <span>Update Task</span>
          </DialogTitle>
          <DialogDescription>
            Make changes to your task. All fields are optional except title.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-4'>
            {/* Title */}
            <div className='space-y-2'>
              <Label htmlFor='title' className='text-sm font-medium'>
                Title *
              </Label>
              <Input
                id='title'
                placeholder='Enter task title...'
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className='text-sm text-red-500'>{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='description' className='text-sm font-medium'>
                Description
              </Label>
              <Textarea
                id='description'
                placeholder='Describe the task...'
                rows={3}
                {...register('description')}
                className='resize-none'
              />
            </div>

            {/* Status and Priority Row */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {/* Status */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium flex items-center space-x-1'>
                  <Clock className='h-4 w-4' />
                  <span>Status</span>
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setValue('status', value as TaskStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className='flex items-center space-x-2'>
                          <div
                            className={`w-2 h-2 rounded-full ${option.color}`}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium flex items-center space-x-1'>
                  <Flag className='h-4 w-4' />
                  <span>Priority</span>
                </Label>
                <Select
                  value={selectedPriority}
                  onValueChange={(value) =>
                    setValue('priority', value as TaskPriority)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select priority' />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className='flex items-center space-x-2'>
                          <div
                            className={`w-2 h-2 rounded-full ${option.color}`}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee and Due Date Row */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {/* Assignee */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium flex items-center space-x-1'>
                  <User className='h-4 w-4' />
                  <span>Assignee</span>
                </Label>
                <Select
                  value={selectedAssigneeId?.toString() || 'unassigned'}
                  onValueChange={(value) =>
                    setValue(
                      'assigneeId',
                      value === 'unassigned' ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select assignee' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='unassigned'>Unassigned</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className='space-y-2'>
                <Label
                  htmlFor='dueDate'
                  className='text-sm font-medium flex items-center space-x-1'
                >
                  <Calendar className='h-4 w-4' />
                  <span>Due Date</span>
                </Label>
                <Input id='dueDate' type='date' {...register('dueDate')} />
              </div>
            </div>
          </div>

          <DialogFooter className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
