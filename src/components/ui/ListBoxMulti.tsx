import { Check } from "lucide-react";

type ListBoxItem = { label: string; value: string };

type ListBoxProps = {
    label: string;
    items: ListBoxItem[];
    selectedItems: ListBoxItem[];
    onChange: (value: ListBoxItem[]) => void;
};

export function ListBoxMulti({
    label,
    items,
    selectedItems,
    onChange,
}: ListBoxProps) {
    const toggleItem = (item: ListBoxItem) => {
        const isSelected = selectedItems.some((i) => i.value === item.value);
        if (isSelected) {
            onChange(selectedItems.filter((i) => i.value !== item.value));
        } else {
            onChange([...selectedItems, item]);
        }
    };

    return (
        <div className="  form-control w-full max-w-md  h-full">
            <label className="label">
                <span className="label-text  font-semibold">{label}</span>
            </label>
            <ul className=" menu bg-base-300 rounded-box w-full shadow-md">
                {items.map((item) => {
                    const selected = selectedItems.some((i) => i.value === item.value);
                    return (
                        <li key={item.value} className="list-row w-full m-1 tracking-widest font-stretch-expanded">
                            <button
                                type="button"
                                onClick={() => toggleItem(item)}
                                className={`flex justify-between items-center px-1 py-1 w-full text-left ${selected ? "bg-base-100 font-bold" : "hover:bg-base-400"
                                    }`}
                            >
                                <span>{item.label}</span>
                                {selected && <Check className="w-4 h-4 opacity-90" />}
                            </button>
                        </li>
                    );
                })}
            </ul>

        </div>
    );
}
