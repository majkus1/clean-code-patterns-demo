/**
 * Repository Pattern - Interface
 * Abstrakcja dla dostępu do danych
 */
export interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
  exists(id: ID): Promise<boolean>;
}
