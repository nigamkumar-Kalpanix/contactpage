// components/contact/contact-delete-dialog.tsx

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

type ContactDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName?: string;
  onConfirm: () => void;
};

export function ContactDeleteDialog({
  open,
  onOpenChange,
  contactName,
  onConfirm,
}: ContactDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete contact{contactName ? ` "${contactName}"` : ""}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The contact will be removed from the
            list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
