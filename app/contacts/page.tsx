// app/contacts/page.tsx
"use client";

import { useEffect, useState } from "react";

import type { Contact } from "@/data/contacts-mock";

import { Button } from "@/components/ui/button";
import { ContactTable } from "@/components/contact/contact-table";
import { ContactFormDialog } from "@/components/contact/contact-form-dialog";
import { ContactDeleteDialog } from "@/components/contact/contact-delete-dialog";
import { ContactEnableDialog } from "@/components/contact/contact-enable-dialog";
import { ContactStatusDialog } from "@/components/contact/contact-status-dialog";

import {
  createContactApi,
  updateContactApi,
  deleteContactApi,
  mapFormToContactPayload,
} from "@/services/contacts-api";
import { axiosClient } from "@/lib/axios-client";

type ContactFormValues = Omit<Contact, "id">;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [enableTarget, setEnableTarget] = useState<any | null>(null);
  const [enableTargetValue, setEnableTargetValue] = useState(false);
  const [enableOpen, setEnableOpen] = useState(false);

  const [statusTarget, setStatusTarget] = useState<any | null>(null);
  const [statusTargetValue, setStatusTargetValue] =
    useState<"Active" | "Inactive">("Active");
  const [statusOpen, setStatusOpen] = useState(false);

  // Load contacts from API
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get<any>("/contact-view-company");
      setContacts(res?.data ?? []);
    } catch (err) {
      console.error("Failed to load contacts", err);
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddClick = () => {
    setEditingContact(null);
    setOpen(true);
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setOpen(true);
  };

  const findById = (id: string | number) =>
    contacts.find(
      (c) => c.contact_id === id || c.id === id
    ) ?? null;

  const handleDelete = (id: string | number) => {
    const contact = findById(id);
    setDeleteTarget(contact);
    setDeleteOpen(true);
  };

  const handleToggleEnableRequest = (
    id: string | number,
    targetValue: boolean
  ) => {
    const contact = findById(id);
    setEnableTarget(contact);
    setEnableTargetValue(targetValue);
    setEnableOpen(true);
  };

  const handleToggleStatusRequest = (
    id: string | number,
    targetValue: "Active" | "Inactive"
  ) => {
    const contact = findById(id);
    setStatusTarget(contact);
    setStatusTargetValue(targetValue);
    setStatusOpen(true);
  };

  const handleSubmit = async (values: ContactFormValues) => {
    if (editingContact) {
      try {
        const payload = mapFormToContactPayload(values);
        const id = editingContact.contact_id ?? editingContact.id;
        await updateContactApi(id, payload);
        await loadContacts();
      } catch (err) {
        console.error("Failed to update contact", err);
      }
    } else {
      try {
        const payload = mapFormToContactPayload(values);
        await createContactApi(payload);
        await loadContacts();
      } catch (err) {
        console.error("Failed to create contact", err);
      }
    }

    setOpen(false);
    setEditingContact(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const id = deleteTarget.contact_id ?? deleteTarget.id;
        await deleteContactApi(id);
        await loadContacts();
      } catch (err) {
        console.error("Failed to delete contact", err);
      }
    }
    setDeleteTarget(null);
    setDeleteOpen(false);
  };

  const confirmEnableChange = () => {
    if (enableTarget) {
      const id = enableTarget.contact_id ?? enableTarget.id;
      setContacts((prev) =>
        prev.map((c) =>
          (c.contact_id ?? c.id) === id
            ? { ...c, enableUser: enableTargetValue, user_status: enableTargetValue ? 1 : 0 }
            : c
        )
      );
    }
    setEnableTarget(null);
    setEnableOpen(false);
  };

  const confirmStatusChange = () => {
    if (statusTarget) {
      const id = statusTarget.contact_id ?? statusTarget.id;
      setContacts((prev) =>
        prev.map((c) =>
          (c.contact_id ?? c.id) === id
            ? {
                ...c,
                status: statusTargetValue === "Active" ? 1 : 0,
              }
            : c
        )
      );
    }
    setStatusTarget(null);
    setStatusOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <Button onClick={handleAddClick}>Add Contact</Button>
      </div>

      {loading && <p>Loading contacts...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ContactTable
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleEnableRequest={handleToggleEnableRequest}
        onToggleStatusRequest={handleToggleStatusRequest}
      />

      <ContactFormDialog
        open={open}
        onOpenChange={setOpen}
        mode={editingContact ? "edit" : "add"}
        initialValues={editingContact ?? undefined}
        onSubmit={handleSubmit}
      />

      <ContactDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        contactName={deleteTarget?.name}
        onConfirm={confirmDelete}
      />

      <ContactEnableDialog
        open={enableOpen}
        onOpenChange={setEnableOpen}
        contactName={enableTarget?.name}
        targetValue={enableTargetValue}
        onConfirm={confirmEnableChange}
      />

      <ContactStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        contactName={statusTarget?.name}
        targetValue={statusTargetValue}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}
