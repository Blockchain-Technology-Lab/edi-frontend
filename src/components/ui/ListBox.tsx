import {
  Label,
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/react"
import { twJoin } from "tailwind-merge"
import { ChevronDown } from "@/components"

type ListBoxItem = { label: string; value: string }

type ListBoxProps = {
  label: string
  items: ListBoxItem[]
  selectedItem: ListBoxItem
  onChange: (value: ListBoxItem) => void
}

export function ListBox({
  label,
  items,
  selectedItem,
  onChange
}: ListBoxProps) {
  return (
    <Field className="space-y-1">
      <Label>{label}</Label>
      <Listbox
        as="div"
        className="flex flex-col gap-1.5"
        value={selectedItem}
        onChange={onChange}
      >
        <ListboxButton
          className={twJoin(
            "group bg-white text-slate-800 px-4 py-2 flex items-center justify-between rounded-md",
            "border border-slate-200 dark:border-transparent bg-clip-padding"
          )}
        >
          {selectedItem.label}
          <ChevronDown className="transition-transform group-data-[open]:rotate-180" />
        </ListboxButton>
        <ListboxOptions
          className={twJoin(
            "bg-white text-slate-800 rounded-md overflow-hidden",
            "border border-slate-200 dark:border-transparent bg-clip-padding"
          )}
        >
          {items.map((item) => (
            <ListboxOption
              key={item.value}
              value={item}
              className={twJoin(
                "px-4 py-2 cursor-pointer",
                "data-[focus]:bg-slate-200 data-[selected]:bg-blue-700 data-[selected]:text-white"
              )}
            >
              {item.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}
