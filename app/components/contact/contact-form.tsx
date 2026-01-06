// components/contact/contact-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Contact } from "@/data/contacts-mock";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContactDropdown } from "@/components/contact/contact-dropdown";
import { SelectOption } from "@/services/contacts-api";

// ---- Types ----
// Form no longer manages enableUser or status
export type ContactFormValues = Omit<Contact, "id" | "enableUser" | "status">;

type ContactFormProps = {
  defaultValues: ContactFormValues;
  mode: "add" | "edit";
  onSubmit: (values: ContactFormValues) => void;
  onCancel: () => void;
  locationOptions: SelectOption[];
  departmentOptions: SelectOption[];
  loadingMasters?: boolean;
};

// ---- Validation schema (Yup) ----

const phoneRegex = /^[0-9]{7,15}$/; // 7–15 digits
const empIdRegex = /^[A-Za-z0-9_-]{1,20}$/; // simple, professional ID pattern

const contactFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .trim()
    .matches(phoneRegex, "Enter a valid mobile number (7–15 digits)")
    .required("Mobile number is required"),
  employeeId: yup
    .string()
    .trim()
    .matches(empIdRegex, "Employee ID can contain letters, numbers, _ and -")
    .required("Employee ID is required"),
  deskNo: yup
    .string()
    .trim()
    .max(10, "Desk number must be at most 10 characters")
    .required("Desk number is required"),
  location: yup.string().trim().required("Location is required"),
  department: yup.string().trim().required("Department is required"),
});

export function ContactForm({
  defaultValues,
  mode,
  onSubmit,
  onCancel,
  locationOptions,
  departmentOptions,
  loadingMasters,
}: ContactFormProps) {
  const isEdit = mode === "edit";

  const form = useForm<ContactFormValues>({
    resolver: yupResolver(contactFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: ContactFormValues) => {
    onSubmit(values);
  };

  const locationDropdownOptions = locationOptions.map((opt) => ({
    label: opt.label,
    value: String(opt.value),
  }));

  const departmentDropdownOptions = departmentOptions.map((opt) => ({
    label: opt.label,
    value: String(opt.value),
  }));

  const locationPlaceholder =
    loadingMasters && locationDropdownOptions.length === 0
      ? "Loading..."
      : "Select location";

  const departmentPlaceholder =
    loadingMasters && departmentDropdownOptions.length === 0
      ? "Loading..."
      : "Select department";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {/* First row: Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Second row: Mobile No + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile No</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <ContactDropdown<ContactFormValues>
            control={form.control}
            name="location"
            label="Location"
            options={locationDropdownOptions}
            placeholder={locationPlaceholder}
          />
        </div>

        {/* Third row: Employee ID + Desk No */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee ID" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deskNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desk No</FormLabel>
                <FormControl>
                  <Input placeholder="Enter desk number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Fourth row: Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContactDropdown<ContactFormValues>
            control={form.control}
            name="department"
            label="Department"
            options={departmentDropdownOptions}
            placeholder={departmentPlaceholder}
          />
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
          >
            Close
          </Button>
          <Button type="submit">
            {isEdit ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
