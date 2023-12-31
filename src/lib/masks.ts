export type MaskItem = string | RegExp | [RegExp];

export type MaskArray = Array<MaskItem>;

export type Mask = MaskArray | ((value?: string) => MaskArray);

export const masks = ['BRL_CPF', 'BRL_CEP', 'BRL_PHONE', 'NONE'] as const;

export type TMask = (typeof masks)[number];
export type MaskType = 'text' | 'number' | 'all';

export type FormatWithMaskProps = {
  /**
   * Text to be formatted with the mask.
   */
  text?: string;

  /**
   * Mask
   */
  mask?: Mask;

  /**
   * Character to be used on the obfuscated characteres. Defaults to `"*"`
   */
  obfuscationCharacter?: string;
};

export type FormatWithMaskResult = {
  masked: string;
  unmasked: string;
  obfuscated: string;
};

export const BRL_CPF = [
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];

export const maskToCurrency = ({ nextState }: { nextState: any }) => {
  const { value } = nextState || {};

  let amountFormatted = value?.replace?.(/\D/g, '');

  if (amountFormatted[0] === '0') {
    return {
      ...nextState,
      value: `R$ ${amountFormatted
        ?.replace(/^0(\d{2}).*/, '0,$1')
        .replace('0,00', '0,0')}`,
      selection: {
        start: amountFormatted.length + 4,
        end: amountFormatted.length + 4,
      },
    };
  }

  if (amountFormatted?.length === 2) {
    return {
      ...nextState,
      value: `R$ ${amountFormatted}`,
      selection: {
        start: amountFormatted.length + 3,
        end: amountFormatted.length + 3,
      },
    };
  }

  const amountFormattedWithComma = amountFormatted?.replace?.(
    /(?=\d{2})(\d{2})$/,
    ',$1'
  );
  const amountFormattedWithDot = amountFormattedWithComma?.replace?.(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1.'
  );

  if (amountFormattedWithDot) {
    return {
      ...nextState,
      value: `R$ ${amountFormattedWithDot}`,
      selection: {
        start: amountFormattedWithDot.length + 3,
        end: amountFormattedWithDot.length + 3,
      },
    };
  }

  return nextState;
};

export const BRL_PHONE = [
  '(',
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const CREDIT_CARD = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  [/\d/],
  [/\d/],
  [/\d/],
  [/\d/],
  ' ',
  [/\d/],
  [/\d/],
  [/\d/],
  [/\d/],
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
] as MaskArray;

export const ZIP_CODE = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

export const allmasks = {
  BRL_CPF,
  ZIP_CODE,
  CREDIT_CARD,
  BRL_PHONE,
} as const;

export type MaskKey = keyof typeof allmasks;
