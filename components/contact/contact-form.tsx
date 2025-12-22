// components/contact/contact-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import { ContactDropdown } from "@/components/contact/contact-dropdown";
import { SelectOption } from "@/services/contacts-api";


// ---- Types ----

type ContactFormValues = Omit<Contact, "id">;

type ContactFormProps = {
  defaultValues: ContactFormValues;
  mode: "add" | "edit";
  onSubmit: (values: ContactFormValues) => void;
  onCancel: () => void;
  locationOptions: SelectOption[];
  departmentOptions: SelectOption[];
  loadingMasters?: boolean;
};


// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Phone is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  deskNo: z.string().min(1, "Desk number is required"),
  location: z.string().min(1, "Location is required"),
  department: z.string().min(1, "Department is required"),
  enableUser: z.boolean(),
  status: z.enum(["Active", "Inactive"]),
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
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: ContactFormValues) => {
    onSubmit(values);
  };

  // Adapt backend options (number ids) to dropdown options (string values)
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

        {/* Fifth row: Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="enableUser"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Enable User</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "Active"}
                    onCheckedChange={(val) =>
                      field.onChange(val ? "Active" : "Inactive")
                    }
                  />
                </FormControl>
              </FormItem>
            )}
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
