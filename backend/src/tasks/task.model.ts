export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class Task {
  constructor(
    public readonly id: number | null, // null for new tasks, number for existing
    public readonly title: string,
    public readonly description: string | null,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly dueDate: Date | null,
    public readonly projectId: number,
    public readonly userId: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    if (!title.trim()) {
      throw new Error('Task title cannot be empty');
    }
    if (title.length > 255) {
      throw new Error('Task title cannot exceed 255 characters');
    }
    if (dueDate && dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
  }

  static create(
    title: string,
    projectId: number,
    userId: number,
    description?: string,
    status: TaskStatus = TaskStatus.TODO,
    priority: TaskPriority = TaskPriority.MEDIUM,
    dueDate?: Date,
  ): Task {
    return new Task(
      null, // Database will generate the ID
      title,
      description ?? null,
      status,
      priority,
      dueDate ?? null,
      projectId,
      userId,
    );
  }

  update(
    title?: string,
    description?: string,
    status?: TaskStatus,
    priority?: TaskPriority,
    dueDate?: Date,
    projectId?: number,
  ): Task {
    if (this.id === null) {
      throw new Error('Cannot update unsaved task');
    }

    return new Task(
      this.id,
      title ?? this.title,
      description ?? this.description,
      status ?? this.status,
      priority ?? this.priority,
      dueDate ?? this.dueDate,
      projectId ?? this.projectId,
      this.userId,
      this.createdAt,
      new Date(),
    );
  }

  markAsCompleted(): Task {
    return this.update(undefined, undefined, TaskStatus.COMPLETED);
  }

  markAsInProgress(): Task {
    return this.update(undefined, undefined, TaskStatus.IN_PROGRESS);
  }

  markAsTodo(): Task {
    return this.update(undefined, undefined, TaskStatus.TODO);
  }

  isNew(): boolean {
    return this.id === null;
  }

  isOverdue(): boolean {
    return (
      this.dueDate !== null &&
      this.dueDate < new Date() &&
      this.status !== TaskStatus.COMPLETED
    );
  }
}
