"use client";

import { useState } from "react";
import type { Contact } from "@/data/contacts-mock";
import { useContactsPagination } from "../hooks/pagination";
import {
  createContactApi,
  updateContactApi,
  deleteContactApi,
  mapFormToContactPayload,
} from "@/services/contacts-api";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactTable } from "@/components/contact/contact-table";
import { ContactFormDialog } from "@/components/contact/contact-form-dialog";
import { ContactDeleteDialog } from "@/components/contact/contact-delete-dialog";
import { ContactEnableDialog } from "@/components/contact/contact-enable-dialog";
import { ContactStatusDialog } from "@/components/contact/contact-status-dialog";
import { useToast } from "@/components/ui/use-toast";

type ContactFormValues = Omit<Contact, "id">;

export default function ContactsPage() {
  const {
    contactsData,
    loading,
    error,
    fetchPage,
    setContactsData,
  } = useContactsPagination(1, 10);

  const [open, setOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [enableTarget, setEnableTarget] = useState<any | null>(null);
  const [enableTargetValue, setEnableTargetValue] = useState(false);
  const [enableOpen, setEnableOpen] = useState(false);

  const [statusTarget, setStatusTarget] = useState<any | null>(null);
  const [statusTargetValue, setStatusTargetValue] = useState<"Active" | "Inactive">("Active");
  const [statusOpen, setStatusOpen] = useState(false);

  const { toast } = useToast();

  const handleAddClick = () => {
    setEditingContact(null);
    setOpen(true);
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setOpen(true);
  };

  const findById = (id: string | number) =>
    contactsData.data.find((c: any) => c.contact_id === id || c.id === id) ?? null;

  const handleDelete = (id: string | number) => {
    const contact = findById(id);
    setDeleteTarget(contact);
    setDeleteOpen(true);
  };

  const handleToggleEnableRequest = (id: string | number, targetValue: boolean) => {
    const contact = findById(id);
    setEnableTarget(contact);
    setEnableTargetValue(targetValue);
    setEnableOpen(true);
  };

  const handleToggleStatusRequest = (id: string | number, targetValue: "Active" | "Inactive") => {
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
        await fetchPage(1, contactsData.per_page);
        toast({
          title: "Success",
          description: "Contact updated successfully.",
        });
      } catch (err: any) {
        const message = err?.response?.data?.message ?? "Failed to update contact.";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      }
    } else {
      try {
        const payload = mapFormToContactPayload(values);
        await createContactApi(payload);
        await fetchPage(1, contactsData.per_page);
        toast({
          title: "Success",
          description: "Contact created successfully.",
        });
      } catch (err: any) {
        const message = err?.response?.data?.message ?? "Failed to create contact.";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
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
        await fetchPage(1, contactsData.per_page);
        toast({
          title: "Success",
          description: "Contact deleted successfully.",
        });
      } catch (err: any) {
        const message = err?.response?.data?.message ?? "Failed to delete contact.";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      }
    }
    setDeleteTarget(null);
    setDeleteOpen(false);
  };

  const confirmEnableChange = () => {
    if (enableTarget) {
      const id = enableTarget.contact_id ?? enableTarget.id;
      setContactsData(prev => ({
        ...prev,
        data: prev.data.map((c: any) =>
          (c.contact_id ?? c.id) === id
            ? {
                ...c,
                enableUser: enableTargetValue,
                user_status: enableTargetValue ? 1 : 0,
              }
            : c
        )
      }));
      toast({
        title: "Success",
        description: "Enable user status updated.",
      });
    }
    setEnableTarget(null);
    setEnableOpen(false);
  };

  const confirmStatusChange = () => {
    if (statusTarget) {
      const id = statusTarget.contact_id ?? statusTarget.id;
      setContactsData(prev => ({
        ...prev,
        data: prev.data.map((c: any) =>
          (c.contact_id ?? c.id) === id
            ? {
                ...c,
                status: statusTargetValue === "Active" ? 1 : 0,
              }
            : c
        )
      }));
      toast({
        title: "Success",
        description: "Contact status updated.",
      });
    }
    setStatusTarget(null);
    setStatusOpen(false);
  };

  const goToPage = (page: number) => fetchPage(page, contactsData.per_page);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <Button onClick={handleAddClick}>Add Contact</Button>
      </div>

      {loading && <p className="text-center py-8">Loading contacts...</p>}
      {error && <p className="text-red-500 text-sm text-center py-4">{error}</p>}

      <ContactTable
        contacts={contactsData.data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleEnableRequest={handleToggleEnableRequest}
        onToggleStatusRequest={handleToggleStatusRequest}
      />

      {/* FIXED PAGINATION - ACTIVE PAGE HIGHLIGHTED */}
      {contactsData.total > 0 && (
        <div className="flex flex-col items-center gap-6 pt-8 border-t bg-muted/30 p-8 rounded-xl">
          {/* Page info - CENTERED */}
          <div className="text-sm text-muted-foreground text-center max-w-md">
            Showing {((contactsData.current_page - 1) * contactsData.per_page) + 1} to{" "}
            {Math.min(contactsData.current_page * contactsData.per_page, contactsData.total)}{" "}
            of <strong>{contactsData.total.toLocaleString()}</strong> entries
          </div>

          {/* ALL CONTROLS */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-background px-3 py-2 rounded-md border shadow-sm">
              <Select 
                value={String(contactsData.per_page)}
                onValueChange={(value) => fetchPage(1, Number(value))}
              >
                <SelectTrigger className="h-9 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FIXED PAGE BUTTONS - DYNAMIC ACTIVE STATE */}
            <div className="flex items-center gap-1 bg-background px-4 py-2 rounded-md border shadow-sm">
              {/* First page button */}
              {contactsData.current_page > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    className="h-9 w-9 p-0"
                  >
                    1
                  </Button>
                  {contactsData.current_page > 2 && (
                    <span className="px-2 py-1 text-muted-foreground text-xs">...</span>
                  )}
                </>
              )}

              {/* Dynamic page buttons - SHOWS CURRENT PAGE ACTIVE */}
              {[contactsData.current_page - 1, contactsData.current_page, contactsData.current_page + 1]
                .filter(page => page >= 1 && page <= contactsData.last_page)
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === contactsData.current_page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={`h-9 w-10 p-0 font-medium transition-all ${
                      page === contactsData.current_page 
                        ? 'bg-primary text-primary-foreground shadow-md hover:shadow-lg' 
                        : 'hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {page}
                  </Button>
                ))}

              {/* Last page button */}
              {contactsData.last_page > contactsData.current_page + 1 && (
                <>
                  <span className="px-2 py-1 text-muted-foreground text-xs">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(contactsData.last_page)}
                    className="h-9 w-9 p-0"
                  >
                    {contactsData.last_page}
                  </Button>
                </>
              )}
            </div>

            {/* Previous/Next arrows */}
            <div className="flex gap-1 bg-background px-3 py-2 rounded-md border shadow-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(Math.max(1, contactsData.current_page - 1))}
                disabled={contactsData.current_page === 1}
                className="h-9 px-3"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(Math.min(contactsData.last_page, contactsData.current_page + 1))}
                disabled={contactsData.current_page === contactsData.last_page}
                className="h-9 px-3"
              >
                ›
              </Button>
            </div>
          </div>
        </div>
      )}

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
