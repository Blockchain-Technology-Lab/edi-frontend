import * as RadixSlider from "@radix-ui/react-slider"
import { twJoin } from "tailwind-merge"

export function RangeSlider(props: RadixSlider.SliderProps) {
  return (
    <RadixSlider.Root
      className="relative flex items-center w-full h-4 select-none touch-none"
      {...props}
    >
      <RadixSlider.Track className="relative bg-base-300 dark:bg-white/20 flex-grow h-1 rounded">
        <RadixSlider.Range className="absolute bg-accent h-full rounded" />
      </RadixSlider.Track>
      <Thumb />
      <Thumb />
    </RadixSlider.Root>
  )
}

function Thumb() {
  return (
    <RadixSlider.Thumb
      className={twJoin(
        "w-4 h-4 rounded-full border-2 border-base-content bg-base-100",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base-300",
        "transition-colors duration-150 ease-in-out"
      )}
    />
  )
}
