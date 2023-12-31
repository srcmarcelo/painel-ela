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

export const currencyFormatter = new Intl.NumberFormat('pt-Br', {
  style: 'currency',
  currency: 'BRL',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const parseCurrencyToFloat = (value: string) => {
  return value.slice(3).replaceAll('.', '').replaceAll(',', '.');
};
