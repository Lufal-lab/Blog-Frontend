export interface Paginated<T> {
  count: number;
  next: string | null;
  previus: string | null;
  results: T[];
}
