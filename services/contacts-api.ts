// services/contacts-api.ts

import { axiosClient } from "@/lib/axios-client";
import type { Contact } from "@/data/contacts-mock";

// ---------- Shared types ----------

export type SelectOption = {
  label: string;
  value: number;
};

export type ApiMaster = {
  master_id: number;
  name: string | null;
  module_id: number;
  status: number;
  [key: string]: unknown;
};

type ApiContact = {
  contact_id: number;
  name: string;
  email: string | null;
  mobile_no: string | null;
  emp_id: string | null;
  desk_no: string | null;
  location_id: number;
  location_name: string | null;
  department_id: number;
  department: string | null;
  status: number;      // 1 = Active, 0 = Inactive
  user_status: number; // 1 = Enabled, 0 = Disabled
};

// Payload if backend ever needs flat shape
export type ContactPayload = {
  name: string;
  email: string;
  mobile_no: string;
  emp_id: string;
  desk_no: string;
  location_id: number;
  department_id: number;
  status: number;
  user_status: number;
};

// ---------- Mappers ----------

export function mapApiContactToContact(api: ApiContact): Contact {
  return {
    id: String(api.contact_id),
    name: api.name,
    email: api.email ?? "",
    phone: api.mobile_no ?? "",
    employeeId: api.emp_id ?? "",
    deskNo: api.desk_no ?? "",
    location: api.location_name ?? "",
    department: api.department ?? "",
    enableUser: api.user_status === 1,
    status: api.status === 1 ? "Active" : "Inactive",
  };
}

// Create/update payload following main app structure
export function mapFormToContactPayload(
  values: Omit<Contact, "id">
): any {
  return {
    name: values.name,
    email: values.email,
    mobile_no: values.phone,
    location_id: Number(values.location),
    status: values.status === "Active" ? 1 : 0,
    user_status: values.enableUser ? 1 : 0,
    other_info: {
      company: {
        desk_no: values.deskNo,
        emp_id: values.employeeId,
        department_id: Number(values.department),
      },
    },
  };
}

const mapApiMasterToOption = (m: ApiMaster): SelectOption => ({
  label: m.name ?? "",
  value: m.master_id,
});

// ---------- Masters ----------

export async function getLocationOptionsApi(): Promise<SelectOption[]> {
  const res = await axiosClient.get<ApiMaster[]>("/generic-masters", {
    params: { moduleType: 5 },
  });

  const allowedNames = ["Puri", "Bhubaneswar", "Pune", "Ctc", "Apple inc"];

  return res.data
    .filter((m) => m.status === 1 && m.name && allowedNames.includes(m.name))
    .map(mapApiMasterToOption);
}

export async function getDepartmentOptionsApi(): Promise<SelectOption[]> {
  const res = await axiosClient.get<ApiMaster[]>("/generic-masters", {
    params: { moduleType: 6 },
  });

  const allowedNames = ["IT", "Finance", "HR"];

  return res.data
    .filter((m) => m.status === 1 && m.name && allowedNames.includes(m.name))
    .map(mapApiMasterToOption);
}

// ---------- Contacts ----------

type ContactListResponse = { data: ApiContact[] };

export async function getContactsApi(): Promise<Contact[]> {
  const res = await axiosClient.get<ContactListResponse>(
    "/contact-view-company"
  );
  const items = res.data?.data ?? [];
  console.log("Fetched contacts:", items);
  return items.map(mapApiContactToContact);
}

export async function createContactApi(
  payload: any
): Promise<unknown> {
  const res = await axiosClient.post("/contact-master", payload);
  return res.data;
}

export async function updateContactApi(
  contactId: number | string,
  payload: any
): Promise<unknown> {
  const res = await axiosClient.patch(`/contact-master/${contactId}`, payload);
  return res.data;
}

export async function deleteContactApi(
  contactId: number | string
): Promise<unknown> {
  const res = await axiosClient.delete(`/contact-master/${contactId}`);
  return res.data;
}
