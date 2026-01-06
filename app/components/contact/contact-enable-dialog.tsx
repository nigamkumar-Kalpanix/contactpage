// components/contact/contact-enable-dialog.tsx

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

type ContactEnableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName?: string;
  targetValue: boolean;           // true => will become Enabled, false => Disabled
  onConfirm: () => void;
};

export function ContactEnableDialog({
  open,
  onOpenChange,
  contactName,
  targetValue,
  onConfirm,
}: ContactEnableDialogProps) {
  const label = targetValue ? "enable" : "disable";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Change enable status for {contactName ?? "this contact"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {label} this user?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
