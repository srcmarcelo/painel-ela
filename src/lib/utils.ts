import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseISODateWithOffset(ISODate: string) {
  // pegar a data do navegador
  const now = new Date();

  // parse na data ISO (yyyy-mmm-dd)
  const then = new Date(ISODate);

  // pegar o offset da data atual do navegador (pode ser negativo ou positivo)
  const offset = now.getTimezoneOffset();

  // adicionar na data
  then.setUTCMinutes(then.getUTCMinutes() + offset);

  return then;
}