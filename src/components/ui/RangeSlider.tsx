import React from "react"
import * as RadixSlider from "@radix-ui/react-slider"
import { twJoin } from "tailwind-merge"

export function RangeSlider(props: RadixSlider.SliderProps) {
  return (
    <RadixSlider.Root
      className="relative flex items-center h-[16px] mt-4 select-none touch-none"
      {...props}
    >
      <RadixSlider.Track className="relative bg-slate-200 dark:bg-white/20 flex-grow h-[2px]">
        <RadixSlider.Range className="absolute bg-slate-800 dark:bg-slate-300 h-full" />
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
        "block w-[16px] h-[16px] bg-white border border-slate-800 cursor-pointer",
        "dark:bg-slate-300 dark:border-transparent focus:outline-none focus:bg-slate-800 dark:focus:bg-white"
      )}
    />
  )
}
