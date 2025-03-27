export interface RSVP {
  _id: string;
  fullName: string;
  email: string;
  attending: string;
  guests: number;
  notes?: string;
}

export interface CreateRSVPInput {
  fullName: string;
  email: string;
  attending: string;
  guests: number;
  notes?: string;
}

export interface RSVPFormData {
  fullName: string;
  email: string;
  attending: string;
  guests: number;
  notes: string;
}
