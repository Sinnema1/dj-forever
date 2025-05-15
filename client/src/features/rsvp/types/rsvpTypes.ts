/** Matches your GraphQL enum AttendanceStatus */
export type AttendanceStatus = 'YES' | 'NO' | 'MAYBE';

/** Represents the RSVP object returned by getRSVP */
export interface RSVP {
  _id: string;
  attending: AttendanceStatus;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
  createdAt: string;
}

/** Input shape for your submitRSVP / editRSVP mutations */
export interface CreateRSVPInput {
  attending: AttendanceStatus;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
}

/** Shape of the form data your RSVP form will collect */
export interface RSVPFormData {
  attending: AttendanceStatus;
  mealPreference: string;
  allergies: string;
  additionalNotes: string;
}