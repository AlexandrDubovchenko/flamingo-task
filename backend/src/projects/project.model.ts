export class Project {
  constructor(
    public readonly id: number | null, // null for new projects, number for existing
    public readonly name: string,
    public readonly description: string | null,
    public readonly color: string,
    public readonly userId: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    if (!name.trim()) {
      throw new Error('Project name cannot be empty');
    }
    if (name.length > 255) {
      throw new Error('Project name cannot exceed 255 characters');
    }
    if (color && !this.isValidHexColor(color)) {
      throw new Error('Color must be a valid hex color');
    }
  }

  static create(
    name: string,
    userId: number,
    description?: string,
    color: string = '#3B82F6',
  ): Project {
    return new Project(
      null, // Database will generate the ID
      name,
      description ?? null,
      color,
      userId,
    );
  }

  update(name?: string, description?: string, color?: string): Project {
    if (this.id === null) {
      throw new Error('Cannot update unsaved project');
    }

    return new Project(
      this.id,
      name ?? this.name,
      description ?? this.description,
      color ?? this.color,
      this.userId,
      this.createdAt,
      new Date(),
    );
  }

  isNew(): boolean {
    return this.id === null;
  }

  private isValidHexColor(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
  }
}
