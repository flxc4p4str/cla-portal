import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AsYouType,
  CountryCode,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { IgxInputDirective, IgxInputGroupComponent, IgxPrefixDirective } from '@infragistics/igniteui-angular/input-group';

interface PhoneCountry {
  code: CountryCode;
  name: string;
  callingCode: string;
  flagText: string;
  flagLabel: string;
  placeholder: string;
  maxNationalLength: number;
}

interface IntlWithDisplayNames {
  DisplayNames?: new (locales: readonly string[], options: { type: 'region' }) => { of(code: string): string | undefined };
}

const DEFAULT_COUNTRY_CODE: CountryCode = 'US';
const PRIORITY_COUNTRIES: readonly CountryCode[] = ['US', 'CA', 'GB', 'IE'];
const DisplayNamesConstructor = (Intl as IntlWithDisplayNames).DisplayNames;
const regionNames = DisplayNamesConstructor ? new DisplayNamesConstructor(['en'], { type: 'region' }) : undefined;
const PHONE_COUNTRIES: readonly PhoneCountry[] = getCountries().map(createPhoneCountry).sort(sortPhoneCountries);

@Component({
  selector: 'app-phone-number-input',
  standalone: true,
  imports: [IgxInputDirective, IgxInputGroupComponent, IgxPrefixDirective],
  templateUrl: './phone-number-input.component.html',
  styleUrl: './phone-number-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneNumberInputComponent),
      multi: true,
    },
  ],
  host: {
    '(focusout)': 'onFocusOut($event)',
    '(keydown.escape)': 'closeDropdown()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneNumberInputComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly inputId = input('phone-number');
  readonly name = input('phoneNumber');
  readonly ariaLabel = input('Phone number');
  readonly value = input<string | null>(null);
  readonly countries = PHONE_COUNTRIES;
  readonly dropdownOpen = signal(false);
  readonly disabled = signal(false);
  readonly selectedCountry = signal<PhoneCountry>(getCountry(DEFAULT_COUNTRY_CODE));
  readonly nationalDigits = signal('');
  readonly placeholder = computed(() => this.selectedCountry().placeholder);
  readonly formattedNumber = computed(() => formatNationalNumber(this.nationalDigits(), this.selectedCountry()));
  readonly valueChange = output<string>();

  private onTouched: () => void = () => undefined;
  private onChange: (value: string) => void = () => undefined;

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== null) {
        this.setPhoneValue(value);
      }
    });
  }

  writeValue(value: string | null): void {
    this.setPhoneValue(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) {
      this.dropdownOpen.set(false);
    }
  }

  toggleDropdown(): void {
    if (this.disabled()) {
      return;
    }

    this.dropdownOpen.update((isOpen) => !isOpen);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  selectCountry(country: PhoneCountry): void {
    this.selectedCountry.set(country);
    this.nationalDigits.update((digits) => digits.slice(0, country.maxNationalLength));
    this.dropdownOpen.set(false);
    this.emitValue();
  }

  onPhoneInput(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const inputValue = event.target.value;

    if (shouldParseAsFullPhoneValue(inputValue, this.selectedCountry())) {
      this.setPhoneValue(inputValue);
    } else {
      const digits = inputValue.replace(/\D/g, '').slice(0, this.selectedCountry().maxNationalLength);
      this.nationalDigits.set(digits);
    }

    this.emitValue();
  }

  onInputBlur(): void {
    this.onTouched();
  }

  onFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.host.nativeElement.contains(nextTarget)) {
      return;
    }

    this.closeDropdown();
  }

  private emitValue(): void {
    const digits = this.nationalDigits();
    const value = digits ? `${this.selectedCountry().callingCode}${digits}` : '';

    this.onChange(value);
    this.valueChange.emit(value);
  }

  private setPhoneValue(value: string): void {
    const parsed = parsePhoneValue(value, this.selectedCountry());
    this.selectedCountry.set(parsed.country);
    this.nationalDigits.set(parsed.nationalDigits);
  }
}

function parsePhoneValue(value: string, fallbackCountry: PhoneCountry): { country: PhoneCountry; nationalDigits: string } {
  const trimmedValue = value.trim();
  const digits = trimmedValue.replace(/\D/g, '');

  if (!digits) {
    return { country: fallbackCountry, nationalDigits: '' };
  }

  const phoneNumber =
    trimmedValue.startsWith('+') || shouldParseAsInternationalDigits(digits, fallbackCountry)
      ? parsePhoneNumberFromString(`+${digits}`)
      : parsePhoneNumberFromString(digits, fallbackCountry.code);
  const country = phoneNumber?.country ? findCountryByCode(phoneNumber.country) ?? fallbackCountry : fallbackCountry;
  const nationalDigits = phoneNumber?.nationalNumber ? String(phoneNumber.nationalNumber) : digits;

  return {
    country,
    nationalDigits: nationalDigits.slice(0, country.maxNationalLength),
  };
}

function getCountry(code: CountryCode): PhoneCountry {
  return findCountryByCode(code) ?? PHONE_COUNTRIES[0];
}

function findCountryByCode(code: CountryCode): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((country) => country.code === code);
}

function shouldParseAsFullPhoneValue(value: string, selectedCountry: PhoneCountry): boolean {
  const trimmedValue = value.trim();
  const digits = trimmedValue.replace(/\D/g, '');

  if (trimmedValue.startsWith('+')) {
    return true;
  }

  if (digits.length <= selectedCountry.maxNationalLength) {
    return false;
  }

  return shouldParseAsInternationalDigits(digits, selectedCountry);
}

function formatNationalNumber(value: string, country: PhoneCountry): string {
  const digits = value.slice(0, country.maxNationalLength);

  if (!digits) {
    return '';
  }

  return new AsYouType(country.code).input(digits);
}

function shouldParseAsInternationalDigits(digits: string, selectedCountry: PhoneCountry): boolean {
  if (digits.length <= selectedCountry.maxNationalLength) {
    return false;
  }

  return PHONE_COUNTRIES.some((country) => digits.startsWith(country.callingCode.replace(/\D/g, '')));
}

function createPhoneCountry(code: CountryCode): PhoneCountry {
  const callingCode = `+${getCountryCallingCode(code)}`;
  const example = getExampleNumber(code, examples);
  const countryName = regionNames?.of(code) ?? code;

  return {
    code,
    name: countryName,
    callingCode,
    flagText: countryCodeToFlag(code),
    flagLabel: `${countryName} flag`,
    placeholder: example?.formatNational() ?? `${callingCode} phone number`,
    maxNationalLength: Math.max(1, 15 - callingCode.replace(/\D/g, '').length),
  };
}

function sortPhoneCountries(left: PhoneCountry, right: PhoneCountry): number {
  const leftPriority = PRIORITY_COUNTRIES.indexOf(left.code);
  const rightPriority = PRIORITY_COUNTRIES.indexOf(right.code);

  if (leftPriority !== -1 || rightPriority !== -1) {
    return (leftPriority === -1 ? Number.MAX_SAFE_INTEGER : leftPriority) -
      (rightPriority === -1 ? Number.MAX_SAFE_INTEGER : rightPriority);
  }

  return left.name.localeCompare(right.name);
}

function countryCodeToFlag(code: CountryCode): string {
  return [...code]
    .map((character) => 127397 + character.charCodeAt(0))
    .map((codePoint) => String.fromCodePoint(codePoint))
    .join('');
}
