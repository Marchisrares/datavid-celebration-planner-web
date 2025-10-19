export interface UpcomingBirthday {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  nextBirthdayDate: string; // YYYY-MM-DD
  turnsAge: number;
  daysUntil: number;
  tz: string;
}
