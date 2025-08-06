import { Country, State } from 'country-state-city';

export interface CountryOption {
  label: string;
  value: string;
  code: string;
}

export interface StateOption {
  label: string;
  value: string;
  code: string;
}

export const getAllCountries = (): CountryOption[] => {
  return Country.getAllCountries().map(country => ({
    label: country.name,
    value: country.isoCode,
    code: country.isoCode,
  }));
};

export const getStatesByCountry = (countryCode: string): StateOption[] => {
  const states = State.getStatesOfCountry(countryCode);
  return states.map(state => ({
    label: state.name,
    value: state.isoCode,
    code: state.isoCode,
  }));
};

export const getCountryByCode = (countryCode: string): CountryOption | null => {
  const country = Country.getCountryByCode(countryCode);
  if (!country) return null;

  return {
    label: country.name,
    value: country.isoCode,
    code: country.isoCode,
  };
};
