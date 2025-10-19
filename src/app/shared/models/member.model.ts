export interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  country: string;
  city: string;
  tz: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
