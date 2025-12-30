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

// ✅ SERVER-SIDE pagination response (matches API)
export type ContactsPaginatedResponse = {
  data: Contact[];  // Mapped Contact[]
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
    locationId: String(api.location_id),       
    departmentId: String(api.department_id),    
    locationName: api.location_name ?? "",     
    departmentName: api.department ?? "",       
    enableUser: api.user_status === 1,
    status: api.status === 1 ? "Active" : "Inactive",
  };
}

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

// ✅ SERVER-SIDE PAGINATION 
export async function getContactsApi(
  page: number = 1,
  perPage: number = 10
): Promise<ContactsPaginatedResponse> {
  const res = await axiosClient.get<any>("/contact-view-company", {
    params: {
      page: page,
      limit: perPage,           // API uses 'limit'
      "sort[0]": "name,ASC",    // Same as your API call
    },
  });

  const apiData = res?.data ?? {};
  console.log("Contacts API:", { 
    page, 
    limit: perPage, 
    total: apiData.total, 
    count: apiData.count,
    dataLength: apiData.data?.length 
  });

  // Map ONLY the paginated data from API
  const paginatedContacts = (apiData.data || []).map((apiContact: any) => 
    mapApiContactToContact(apiContact)
  );

  return {
    data: paginatedContacts,
    current_page: apiData.page || 1,
    last_page: apiData.pageCount || 1,
    per_page: apiData.count || perPage,
    total: apiData.total || 0,
  };
}

export async function getContactByIdApi(
  contactId: number | string
): Promise<Contact | null> {
  const { data } = await getContactsApi(1, 100);
  const idStr = String(contactId);
  return data.find((c: Contact) => c.id === idStr) ?? null;
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
