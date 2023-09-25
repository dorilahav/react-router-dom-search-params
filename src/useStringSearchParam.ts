import { useSearchParams } from 'react-router-dom';

export type ParamName = string;
type StringSearchParam = [string | null, (newValue: string) => void];

export const useStringSearchParam = (paramName: ParamName): StringSearchParam => {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramValue = searchParams.get(paramName);

  const paramSetter = (newParamValue: string) => {
    setSearchParams(previousSearchParams => {
      previousSearchParams.set(paramName, newParamValue);

      return previousSearchParams;
    });
  }

  return [paramValue, paramSetter];
}