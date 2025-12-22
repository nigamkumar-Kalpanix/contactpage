// components/contact/contact-dropdown.tsx

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

// Generic dropdown that works with any React Hook Form values type.
type ContactDropdownProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  options: Option[];
  placeholder?: string;
};

export function ContactDropdown<TFormValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: ContactDropdownProps<TFormValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
