import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const cnWithPrefix = (prefix: string, ...inputs: ClassValue[]) => {
  return twMerge(clsx(prefix, inputs))
}
