export interface RSVP {
  _id: string;
  userId: string;
  attending: boolean;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
  fullName: string;
}

export interface CreateRSVPInput {
  attending: boolean;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
  fullName: string;
}

export interface RSVPFormData {
  attending: boolean;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
  fullName: string;
}
