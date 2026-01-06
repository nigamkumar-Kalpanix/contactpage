// components/contact/contact-toggle.tsx

import { Switch } from "@/components/ui/switch";

type ContactToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function ContactToggle({ checked, onChange }: ContactToggleProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onChange}
    />
  );
}
