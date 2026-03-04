import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SearchContext = createContext();

const HISTORY_KEY = "genopolis-search-history";

export function SearchProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const stored = sessionStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [requestedQuery, setRequestedQuery] = useState(null);

  useEffect(() => {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = (query) => {
    const clean = query.trim();
    if (!clean) return;
    const entry = {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      query: clean,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 20));
  };

  const requestSearch = (query) => setRequestedQuery(query);

  const consumeRequestedQuery = () => {
    const q = requestedQuery;
    setRequestedQuery(null);
    return q;
  };

  const clearHistory = () => setHistory([]);

  const value = useMemo(
    () => ({
      history,
      addEntry,
      clearHistory,
      requestedQuery,
      requestSearch,
      consumeRequestedQuery,
    }),
    [history, requestedQuery]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);