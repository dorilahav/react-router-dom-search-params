import { ParamName, useStringSearchParam } from './useStringSearchParam';

interface ParamConverter<T> {
  fromString: (value: string) => T;
  toString: (value: T) => string;
}

type SearchParam<T> = [T | null, (newValue: T) => void];

export const useTypedSearchParam = <T>(paramName: ParamName, paramConverter: ParamConverter<T>): SearchParam<T> => {
  const [paramStringValue, setParamStringValue] = useStringSearchParam(paramName);

  const paramTypedValue = paramStringValue !== null ? paramConverter.fromString(paramStringValue) : null;

  const paramTypedSetter = (newParamTypedValue: T) => {
    const newParamStringValue = paramConverter.toString(newParamTypedValue);

    setParamStringValue(newParamStringValue);
  }

  return [paramTypedValue, paramTypedSetter];
}