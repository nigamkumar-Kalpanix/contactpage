import { axiosClient } from "@/lib/axios-client";
import type { Contact } from "@/data/contacts-mock";

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

// ✅ SERVER-SIDE pagination response (matches hook)
export type ContactsPaginatedResponse = {
  data: Contact[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
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
    location: String(api.location_id),
    department: String(api.department_id),
    locationName: api.location_name ?? "",
    departmentName: api.department ?? "",
    enableUser: api.user_status === 1,
    status: api.status === 1 ? "Active" : "Inactive",
  };
}

export function mapFormToContactPayload(
  values: Omit<Contact, "id">
): ContactPayload {
  return {
    name: values.name,
    email: values.email,
    mobile_no: values.phone,
    emp_id: values.employeeId,
    desk_no: values.deskNo,
    location_id: Number(values.location),
    department_id: Number(values.department),
    status: values.status === "Active" ? 1 : 0,
    user_status: values.enableUser ? 1 : 0,
  };
}

const mapApiMasterToOption = (m: ApiMaster): SelectOption => ({
  label: m.name ?? "",
  value: m.master_id,
});

// ---------- Masters (Locations/Departments) ----------
export async function getLocationOptionsApi(): Promise<SelectOption[]> {
  const res = await axiosClient.get<ApiMaster[]>("/generic-masters", {
    params: {
      "filter[0]": "module_id||$eq||5",
      "filter[1]": "status||$eq||1",
    },
  });
  return res.data.map(mapApiMasterToOption);
}

export async function getDepartmentOptionsApi(): Promise<SelectOption[]> {
  const res = await axiosClient.get<ApiMaster[]>("/generic-masters", {
    params: {
      "filter[0]": "module_id||$eq||6",
      "filter[1]": "status||$eq||1",
    },
  });
  return res.data.map(mapApiMasterToOption);
}

// ✅ MAIN FIX: Server-side pagination
export async function getContactsApi(
  page: number = 1,
  perPage: number = 10
): Promise<ContactsPaginatedResponse> {
  try {
    const res = await axiosClient.get<any>("/contact-view-company", {
      params: {
        page,
        limit: perPage,
        "sort[0]": "name,ASC",
      },
    });

    const apiData = res?.data ?? {};
    console.log("✅ Contacts API Response:", {
      page,
      limit: perPage,
      total: apiData.total,
      count: apiData.count,
      dataLength: apiData.data?.length,
      last_page: apiData.pageCount,
    });

    const paginatedContacts = (apiData.data || []).map((apiContact: ApiContact) =>
      mapApiContactToContact(apiContact)
    );

    return {
      data: paginatedContacts,
      current_page: apiData.page || 1,
      last_page: apiData.pageCount || 1,
      per_page: apiData.limit || perPage, // Use API's limit
      total: apiData.total || 0,
    };
  } catch (error: any) {
    console.error(" getContactsApi failed:", error.response?.status, error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Failed to fetch contacts");
  }
}

// ✅ Detail page
export async function getContactByIdApi(contactId: number | string): Promise<Contact | null> {
  const { data } = await getContactsApi(1, 100);
  const idStr = String(contactId);
  return data.find((c: Contact) => c.id === idStr) ?? null;
}

// ✅ CRUD Operations
export async function createContactApi(payload: ContactPayload): Promise<unknown> {
  const res = await axiosClient.post("/contact-master", payload);
  return res.data;
}

export async function updateContactApi(contactId: number | string, payload: ContactPayload): Promise<unknown> {
  const res = await axiosClient.patch(`/contact-master/${contactId}`, payload);
  return res.data;
}

export async function deleteContactApi(contactId: number | string): Promise<unknown> {
  const res = await axiosClient.delete(`/contact-master/${contactId}`);
  return res.data;
}
