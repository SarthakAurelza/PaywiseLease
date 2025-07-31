import { useState, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function useMeiliSearch() {
  const [results, setResults] = useState([]);
  const [searchloading, setLoading] = useState(false);


  const fetchSuggestions = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
      setResults(res.data.hits || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchSuggestions, 100), []);

  const query = (q) => {
    debouncedFetch(q);
  };

  return {
    results,
    searchloading,
    query,
    clear: () => setResults([]),         // ✅ expose setter
  };
}
