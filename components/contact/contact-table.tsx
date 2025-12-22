// components/contact/contact-table.tsx

import { Contact } from "@/data/contacts-mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ContactToggle } from "@/components/contact/contact-toggle";

type ContactTableProps = {
  contacts: any[]; 
  onEdit: (contact: Contact) => void;
  onDelete: (id: string | number) => void;
  onToggleEnableRequest: (id: string | number, targetValue: boolean) => void;
  onToggleStatusRequest: (
    id: string | number,
    targetValue: "Active" | "Inactive"
  ) => void;
};

export function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onToggleEnableRequest,
  onToggleStatusRequest,
}: ContactTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Desk No</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Enable User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {(contacts ?? []).map((contact) => {
          const id = contact.contact_id ?? contact.id; // support both shapes

          return (
            <TableRow key={id}>
              <TableCell>
                <div className="font-medium">{contact.name}</div>
                <div className="text-xs text-muted-foreground">
                  Emp ID: {contact.employeeId ?? contact.emp_id}
                </div>
              </TableCell>

              <TableCell>
                <div>{contact.email}</div>
                <div className="text-xs font-medium">
                  {contact.phone ?? contact.mobile_no}
                </div>
              </TableCell>

              <TableCell>{contact.department}</TableCell>
              <TableCell>{contact.deskNo ?? contact.desk_no}</TableCell>
              <TableCell className="font-semibold">
                {contact.location ?? contact.location_name}
              </TableCell>

              <TableCell>
                <ContactToggle
                  checked={contact.enableUser ?? contact.user_status === 1}
                  onChange={(value) => onToggleEnableRequest(id, value)}
                />
              </TableCell>

              <TableCell>
                <ContactToggle
                  checked={
                    contact.status === "Active" || contact.status === 1
                  }
                  onChange={(value) =>
                    onToggleStatusRequest(id, value ? "Active" : "Inactive")
                  }
                />
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(contact)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
