// components/contact/contact-status-dialog.tsx

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ContactStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName?: string;
  targetValue: "Active" | "Inactive"; // the value we want to change to
  onConfirm: () => void;
};

export function ContactStatusDialog({
  open,
  onOpenChange,
  contactName,
  targetValue,
  onConfirm,
}: ContactStatusDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Change status for {contactName ?? "this contact"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to set the status to {targetValue}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
