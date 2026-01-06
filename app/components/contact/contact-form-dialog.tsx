import { useEffect, useState, useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContactForm, ContactFormValues } from "@/components/contact/contact-form";
import {
  getDepartmentOptionsApi,
  getLocationOptionsApi,
  SelectOption,
} from "@/services/contacts-api";

type ContactFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: any;
  onSubmit: (values: ContactFormValues) => void;
};

export function ContactFormDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: ContactFormDialogProps) {
  const title = mode === "add" ? "Add Contact" : "Edit Contact";

  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  // In ContactFormDialog.tsx - UPDATE defaultValues
const defaultValues: ContactFormValues = useMemo(
  () =>
    initialValues
      ? {
          name: initialValues.name ?? "",
          email: initialValues.email ?? "",
          phone:
            initialValues.phone ??
            initialValues.mobile_no ??
            "",
          employeeId:
            initialValues.employeeId ??
            initialValues.emp_id ??
            "",
          deskNo:
            initialValues.deskNo ??
            initialValues.desk_no ??
            "",
          // FIXED: Use IDs, fallback to old fields
          location: String(initialValues.locationId ?? initialValues.location ?? initialValues.location_id ?? ""),
          department: String(initialValues.departmentId ?? initialValues.department ?? initialValues.department_id ?? ""),
        }
      : {
          name: "",
          email: "",
          phone: "",
          employeeId: "",
          deskNo: "",
          location: "",
          department: "",
        },
  [initialValues]
);


  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadMasters = async () => {
      setLoadingMasters(true);
      try {
        const [locs, deps] = await Promise.all([
          getLocationOptionsApi(),
          getDepartmentOptionsApi(),
        ]);

        if (!cancelled) {
          setLocationOptions(locs);
          setDepartmentOptions(deps);
        }
      } finally {
        if (!cancelled) {
          setLoadingMasters(false);
        }
      }
    };

    loadMasters();

    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Manage basic details, location, department and status of the contact.
          </DialogDescription>
        </DialogHeader>

        <ContactForm
          defaultValues={defaultValues}
          mode={mode}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
          locationOptions={locationOptions}
          departmentOptions={departmentOptions}
          loadingMasters={loadingMasters}
        />
      </DialogContent>
    </Dialog>
  );
}
