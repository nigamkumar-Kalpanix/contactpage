// data/contacts-mock.ts

// Shared Contact type used across the app.
export type ContactStatus = "Active" | "Inactive";

export type Contact = {
  id: string;            // API contact_id as string
  name: string;
  email: string;
  phone: string;         // mobile_no
  employeeId: string;
  deskNo: string;
  location: string;      // location name shown in UI
  department: string;    // department name shown in UI
  enableUser: boolean;   // user_status
  status: ContactStatus; // Active / Inactive
};














