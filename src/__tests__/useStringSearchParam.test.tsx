import { act, renderHook, } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ParamName, useStringSearchParam } from '../useStringSearchParam';

const renderHookInRouter = <T,>(renderHookFunction: () => T) =>
  renderHook(renderHookFunction, {wrapper: MemoryRouter}).result;

const renderStringSearchParamHook = (paramName: ParamName) => {
  const result = renderHookInRouter(() => useStringSearchParam(paramName));

  return {
    get actualParamValue() {
      return result.current[0];
    },
    setParamValue: result.current[1]
  };
};

describe('useStringSearchParams', () => {
  test('throws when not inside a Router', () => {
    expect(() => {
      renderHook(() => useStringSearchParam('a'))
    }).toThrowError();
  })

  test('returns null when nothing in query', () => {
    const hook = renderStringSearchParamHook('a');

    expect(hook.actualParamValue).toBeNull();
  });

  test('returns set value after render', () => {
    const PARAM_VALUE = 'a';
    const hook = renderStringSearchParamHook('a');

    act(() => {
      hook.setParamValue(PARAM_VALUE);
    });

    expect(hook.actualParamValue).toBe(PARAM_VALUE);
  });

  test('returns last value after render', () => {
    const PARAM_VALUE = 'a';
    const hook = renderStringSearchParamHook('a');

    act(() => {
      hook.setParamValue('b');
      hook.setParamValue(PARAM_VALUE);
    });

    expect(hook.actualParamValue).toBe(PARAM_VALUE);
  });

  test('sets the value on the query string', () => {
    const PARAM_KEY = 'a';
    const PARAM_VALUE = 'a';

    const result = renderHookInRouter(() => {
      return {
        stringSearchParams: useStringSearchParam(PARAM_KEY),
        location: useLocation()
      }
    });

    const setParamValue = result.current.stringSearchParams[1];
    const searchParamsBeforeAct = new URLSearchParams(result.current.location.search);

    expect(searchParamsBeforeAct.has(PARAM_KEY)).toBe(false);

    act(() => {
      setParamValue(PARAM_VALUE);
    });

    const searchParamsAfterAct = new URLSearchParams(result.current.location.search);

    expect(searchParamsAfterAct.has(PARAM_KEY)).toBe(true);
    expect(searchParamsAfterAct.get(PARAM_KEY)).toBe(PARAM_VALUE);
  });
})