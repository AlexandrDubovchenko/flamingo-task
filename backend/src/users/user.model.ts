export class User {
  constructor(
    public readonly id: number | null, // null for new users, number for existing
    public readonly auth0Id: string,
    public readonly name: string | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(auth0Id: string, name?: string): User {
    return new User(null, auth0Id, name);
  }

  isNew(): boolean {
    return this.id === null;
  }
}
