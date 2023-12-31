import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createTsForm,
  createUniqueFieldSchema,
  useDescription,
  useTsController,
} from '@ts-react/form';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import { cn, parseCurrencyToFloat } from './utils';
import { Calendar } from '@/components/ui/calendar';
import React, { useEffect } from 'react';
import {
  CalendarIcon,
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import { BRL_CPF, BRL_PHONE, maskToCurrency } from './masks';
import ptBR from 'date-fns/locale/pt-BR';

export type Option = {
  value: string;
  label: string;
};

function TextField() {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <Input
        value={field.value ? field.value : ''} // conditional to prevent "uncontrolled to controlled" react warning
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />
      {error?.errorMessage && (
        <span className='text-destructive'>{error?.errorMessage}</span>
      )}
    </div>
  );
}

function TextPhoneField() {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();

  return (
    <div className='space-y-1 flex flex-col'>
      <span>{label}</span>
      <InputMask
        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        mask={BRL_PHONE}
        onChange={(e) => field.onChange(e.target.value)}
        value={field.value}
      />
      {error?.errorMessage && (
        <span className='text-destructive'>{error?.errorMessage}</span>
      )}
    </div>
  );
}

function TextCPFField() {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();

  return (
    <div className='space-y-1 flex flex-col'>
      <span>{label}</span>
      <InputMask
        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        mask={BRL_CPF}
        onChange={(e) => field.onChange(e.target.value)}
        value={field.value}
      />
      {error?.errorMessage && (
        <span className='text-destructive'>{error?.errorMessage}</span>
      )}
    </div>
  );
}

function TextCurrencyField() {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();

  return (
    <div className='space-y-1 flex flex-col'>
      <span>{label}</span>
      <InputMask
        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        mask='R$ 9999999999' // Don't use dots and commas
        alwaysShowMask={false}
        beforeMaskedStateChange={maskToCurrency}
        value={field.value}
        onChange={(e) => {
          const formattedValue = parseCurrencyToFloat(e.target.value);
          field.onChange(formattedValue);
        }}
      />
      {error?.errorMessage && (
        <span className='text-destructive'>{error?.errorMessage}</span>
      )}
    </div>
  );
}

function NumberField() {
  const {
    field: { onChange, value },
    error,
  } = useTsController<number>();
  const { label } = useDescription();

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <Input
        value={value !== undefined ? value + '' : ''}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (isNaN(value)) onChange(undefined);
          else onChange(value);
        }}
      />
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

function SelectField({ options }: { options: string[] }) {
  const { field, error } = useTsController<string>();
  const { label, placeholder } = useDescription();

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <Select
        value={field?.value}
        onValueChange={(e) => {
          field.onChange(e);
        }}
      >
        <SelectTrigger>
          <div className='flex-1 w-full overflow-hidden text-ellipsis'>
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent side='bottom' className='flex flex-col max-h-96'>
          {options.map((e) => (
            <SelectItem key={e} value={`${e}`}>
              {e}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

function SelectOptionField({ options }: { options: Option[] }) {
  const { field, error } = useTsController<string>();
  const { label, placeholder } = useDescription();

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <Select
        value={field?.value}
        onValueChange={(e) => {
          field.onChange(e);
        }}
      >
        <SelectTrigger>
          <div className='flex-1 w-full overflow-hidden text-ellipsis'>
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent side='bottom' className='flex flex-col max-h-96'>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

function ComboboxField({ options }: { options: Option[] }) {
  const { field, error } = useTsController<string>();
  const { label, placeholder } = useDescription();

  const [open, setOpen] = React.useState(false);

  const selectedOptionLabel =
    field?.value &&
    options.find((option) => option.value === field?.value)?.label;

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            <div className='truncate'>{selectedOptionLabel || placeholder}</div>
            <div>
              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 flex'>
          <Command>
            <CommandInput placeholder='Pesquisar...' />
            <CommandEmpty>Nenhum dado encontrado.</CommandEmpty>
            <CommandGroup className='flex-col max-h-96 overflow-auto'>
              {options.length ? (
                options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={(currentValue) => {
                      field.onChange(
                        currentValue === field?.value ? '' : option.value
                      );
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        field?.value === option.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))
              ) : (
                <div className='w-full flex items-center justify-center'>
                  Sem dados
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

function MultiSelectField({
  options,
  className,
}: {
  options: Option[];
  className?: string;
}) {
  const { field, error } = useTsController<string[]>();
  const { label } = useDescription();

  const selected = field.value || [];
  const { onChange } = field;

  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={`w-full justify-between ${
              selected.length > 1 ? 'h-full' : 'h-10'
            }`}
            onClick={() => setOpen(!open)}
          >
            <div
              className='flex gap-1 overflow-auto'
              style={{ flexWrap: 'wrap', maxHeight: '100px' }}
            >
              {selected.map((item) => (
                <Badge
                  variant='secondary'
                  key={item}
                  className='mr-1 mb-1 flex justify-between items-center gap-2'
                  onClick={() => handleUnselect(item)}
                >
                  <p className='whitespace-nowrap inline-block'>
                    {options.find((option) => option.value === item)?.label}
                  </p>
                  <button
                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <XIcon className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              ))}
            </div>
            <ChevronDownIcon className='h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 flex'>
          <Command className={className}>
            <CommandInput placeholder='Pesquisar...' />
            <CommandEmpty>Nenhum dado encontrado.</CommandEmpty>
            <CommandGroup className='flex-col max-h-96 overflow-auto'>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

function CardRadioButtonField({
  options,
  defaultValue,
}: {
  options: Option[];
  defaultValue: string;
}) {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();

  useEffect(() => {
    if (!field.value) {
      field.onChange(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='space-y-1'>
      <span>{label}</span>
      <RadioGroup
        onValueChange={(value) => field.onChange(value)}
        defaultValue={defaultValue}
        value={field.value}
        className='flex flex-row'
      >
        {options.map((option, index) => (
          <div className='flex-1 h-10' key={index}>
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className='peer sr-only'
            />
            <Label
              onClick={() => field.onChange(option.value)}
              className={cn(
                'flex flex-col items-center justify-between h-10 rounded-md bg-popover p-3 hover:bg-accent hover:text-accent-foreground',
                field.value === option.value && 'border'
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

function DatePickerField({ disablePastDate }: { disablePastDate?: boolean }) {
  const { field, error } = useTsController<Date>();
  const { label } = useDescription();

  return (
    <div className='flex flex-col space-y-1'>
      <span>{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] pl-3 text-left font-normal',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value ? (
              format(field.value, 'dd/MM/yyyy')
            ) : (
              <span>Selecione uma data</span>
            )}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            locale={ptBR}
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < new Date() && !!disablePastDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <span className='text-destructive'>{error?.errorMessage}</span>
    </div>
  );
}

export const formFields = {
  text: z.string({ required_error: 'Campo obrigatório' }),
  number: z.number({ required_error: 'Campo obrigatório' }),
  select: createUniqueFieldSchema(
    z.string({ required_error: 'Campo obrigatório' }),
    'select'
  ),
  text_phone: createUniqueFieldSchema(
    z
      .string({ required_error: 'Campo obrigatório' })
      .refine((phone) => !phone.slice(1, 3).includes('0'), 'DDD inválido')
      .refine(
        (phone) => !phone.length || phone.slice(5, 6).includes('9'),
        'Telefone deve começar com 9'
      )
      .refine((phone) => !phone.includes('_'), 'Telefone inválido'),
    'text_phone'
  ),
  text_cpf: createUniqueFieldSchema(
    z.string({ required_error: 'Campo obrigatório' }),
    'text_cpf'
  ),
  text_currency: createUniqueFieldSchema(
    z.string({ required_error: 'Campo obrigatório' }),
    'text_currency'
  ),
  select_option: createUniqueFieldSchema(
    z.string({ required_error: 'Campo obrigatório' }),
    'select_option'
  ),
  combobox: createUniqueFieldSchema(
    z.string({ required_error: 'Campo obrigatório' }),
    'combobox'
  ),
  multi_select: createUniqueFieldSchema(
    z.array(z.string({ required_error: 'Campo obrigatório' })),
    'multi_select'
  ),
  card_radio_group: createUniqueFieldSchema(
    z.string({ required_error: 'Campo obrigatório' }),
    'card_radio_group'
  ),
  date_picker: createUniqueFieldSchema(
    z.date({ required_error: 'Campo obrigatório' }),
    'date_picker'
  ),
};

const mapping = [
  [formFields.text, TextField] as const,
  [formFields.number, NumberField] as const,
  [formFields.select, SelectField] as const,
  [formFields.text_phone, TextPhoneField] as const,
  [formFields.text_cpf, TextCPFField] as const,
  [formFields.text_currency, TextCurrencyField] as const,
  [formFields.select_option, SelectOptionField] as const,
  [formFields.combobox, ComboboxField] as const,
  [formFields.multi_select, MultiSelectField] as const,
  [formFields.card_radio_group, CardRadioButtonField] as const,
  [formFields.date_picker, DatePickerField] as const,
] as const;

function FormContainer({
  children,
  onSubmit,
  isPreventDefault,
  ...rest
}: React.FormHTMLAttributes<HTMLFormElement> & {
  isPreventDefault?: boolean;
}) {
  return (
    <form
      {...rest}
      onSubmit={(e) => {
        if (isPreventDefault) {
          e.preventDefault();
          e.stopPropagation();
        }
        onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
}

export const MyForm = createTsForm(mapping, {
  FormComponent: FormContainer,
});
