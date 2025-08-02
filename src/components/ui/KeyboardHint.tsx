import { useKeyboardShortcuts } from '@/hooks';

interface KeyboardHintProps {
    shortcut: string;
    className?: string;
}

export function KeyboardHint({ shortcut, className = '' }: KeyboardHintProps) {
    return (
        <span className={`kbd kbd-sm opacity-60 text-xs ${className}`}>
            {shortcut}
        </span>
    );
}

export function ShortcutsHelp() {
    const { shortcuts } = useKeyboardShortcuts();

    return (
        <div className="dropdown dropdown-top dropdown-end"> {/* Changed from dropdown-end to dropdown-top dropdown-end */}
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <span className="text-sm">⌨️</span>
            </div>
            <div
                tabIndex={0}
                className="dropdown-content z-[1] menu p-3 shadow bg-base-100 rounded-box w-64 border border-base-300 mb-2" // Added mb-2 for spacing
            >
                <h3 className="font-bold text-sm mb-2">Keyboard Shortcuts</h3>
                <div className="space-y-1">
                    {Object.entries(shortcuts).map(([key, description]) => (
                        <div key={key} className="flex justify-between items-center text-xs">
                            <span className="opacity-80">{description}</span>
                            <KeyboardHint shortcut={key} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}