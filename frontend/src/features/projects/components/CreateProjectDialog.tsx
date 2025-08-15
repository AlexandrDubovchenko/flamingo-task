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
import type { CreateProjectDto } from '@/models';
import { useCreateProject } from '../hooks/useCreateProject';

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(255, 'Project name is too long'),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: CreateProjectDto) => void;
}

const defaultColors = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const mutation = useCreateProject();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      color: defaultColors[0],
    },
  });
  const selectedColor = watch('color');
  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const projectData: CreateProjectDto = {
        name: data.name,
        description: data.description,
        color: data.color,
      };

      const result = await mutation.mutateAsync(projectData);

      console.log('Creating project:', result);
      onProjectCreated?.(result);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to organize your tasks and collaborate with your
            team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Project Name *</Label>
              <Input
                id='name'
                placeholder='Enter project name'
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Enter project description (optional)'
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className='text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label>Project Color</Label>
              <div className='flex gap-2 flex-wrap'>
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    type='button'
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <Label htmlFor='custom-color' className='text-sm'>
                  Custom:
                </Label>
                <Input
                  id='custom-color'
                  type='color'
                  value={selectedColor}
                  onChange={(e) => setValue('color', e.target.value)}
                  className='w-16 h-8 p-1 border rounded'
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
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
