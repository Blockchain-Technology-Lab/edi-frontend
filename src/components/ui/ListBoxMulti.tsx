import {
  Label,
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/react"
import { twJoin } from "tailwind-merge"
import { Check, ChevronDown } from "@/components"

type ListBoxItem = { label: string; value: string }

type ListBoxProps = {
  label: string
  items: ListBoxItem[]
  selectedItems: ListBoxItem[]
  onChange: (value: ListBoxItem[]) => void
}

export function ListBoxMulti({
  label,
  items,
  selectedItems,
  onChange
}: ListBoxProps) {
  return (
    <Field className="space-y-1">
      <Label>{label}</Label>
      <Listbox
        multiple
        as="div"
        className="flex flex-col"
        value={selectedItems}
        onChange={onChange}
      >
        <ListboxButton
          className={twJoin(
            "group bg-white text-slate-800 px-4 py-2 flex items-center justify-between rounded-md",
            "border border-slate-200 dark:border-transparent bg-clip-padding"
          )}
        >
          {selectedItems.length < 1
            ? "None"
            : selectedItems.map((item) => item.label).join(", ")}
          <ChevronDown className="transition-transform group-data-[open]:rotate-180" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className={twJoin(
            "w-[var(--button-width)] mt-1 bg-white text-slate-800 rounded-md overflow-hidden",
            "border border-slate-200 dark:border-transparent bg-clip-padding"
          )}
        >
          {items.map((item) => (
            <ListboxOption
              key={item.value}
              value={item}
              className={twJoin(
                "group flex items-center gap-1 p-2 cursor-pointer",
                "data-[focus]:bg-slate-200 data-[selected]:bg-blue-700 data-[selected]:text-white"
              )}
            >
              <Check className="invisible size-6 group-data-[selected]:visible" />
              {item.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}
