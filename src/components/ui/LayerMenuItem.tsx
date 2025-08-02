import { KeyboardHint } from '@/components';

type LayerMenuItemProps = {
    label: string;
    icon?: React.ReactNode;
    shortcut?: string; // Add shortcut prop
    onClick?: () => void;
    bgColor?: string;
    textColor?: string;
    active?: boolean;
    disabled?: boolean;
};

export function LayerMenuItem({
    label,
    icon,
    shortcut,
    onClick,
    bgColor = 'bg-base-100',
    textColor = 'text-base-content',
    active = false,
    disabled = false,
}: LayerMenuItemProps) {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`
                card shadow-md px-1 py-2  flex-1 rounded-box overflow-hidden group
                ${active ? 'bg-base-300 ring-2 ring-accent' : bgColor}
                ${textColor}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.06] transition-transform duration-300 ease-in-out hover:bg-base-300'}
            `}
        >
            {/* Layout: stacked icon+shortcut left, text center */}
            <div className="relative z-10 pb-2 pt-2 flex items-center justify-between h-full">
                {/* Left: Stacked icon and shortcut */}
                <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    {/* Icon */}
                    <div className="w-8 h-8 flex items-center justify-center opacity-70 text-base-content/40">
                        {icon}
                    </div>

                    {/* Keyboard shortcut below icon */}
                    {shortcut && (
                        <KeyboardHint
                            shortcut={shortcut}
                            className="opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                        />
                    )}
                </div>

                {/* Center: Label content */}
                <div className="flex-1 text-center px-2">
                    <span className="text-sm font-sans sm:text-base font-semibold tracking-wide leading-tight">
                        {label}
                    </span>
                </div>

                {/* Right: Empty space for balance */}
                <div className="min-w-[48px]"></div>
            </div>
        </div>
    );
}
