import { useEffect, useMemo, useReducer, useRef } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

type Cache<T> = { [url: string]: T };

type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

/**
 * A hook used to consume our /api/weather endpoint.
 * It implements internal caching to store data from previous searches.
 * @param query
 * @returns
 */
function useWeather<T = unknown>(query?: string): State<T> {
  const cache = useRef<Cache<T>>({});
  const url = useMemo(() => {
    return `/api/weather?q=${query}`;
  }, [query]);
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState, loading: true };
      case "fetched":
        return { ...initialState, data: action.payload, loading: false };
      case "error":
        return { ...initialState, error: action.payload, loading: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!query) return;

    cancelRequest.current = false;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      if (cache.current[query]) {
        dispatch({ type: "fetched", payload: cache.current[query] });
        return;
      }

      try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const {
          data: { data: payload },
        } = (await response.json()) as { data: { data: T } };

        cache.current[query] = payload;

        if (cancelRequest.current) {
          return;
        }

        dispatch({ type: "fetched", payload });
      } catch (error) {
        if (cancelRequest.current) {
          return;
        }

        dispatch({ type: "error", payload: error as Error });
      }
    };

    void fetchData();

    return () => {
      cancelRequest.current = true;
    };
  }, [url, query]);
  console.log(state);
  return state;
}

export default useWeather;
