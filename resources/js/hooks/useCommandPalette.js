import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ tickets: [], subjects: [], tags: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);
    const open = useCallback(() => setIsOpen(true), []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults({ tickets: [], subjects: [], tags: [] });
            setSelectedIndex(0);
            return;
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim() || !isOpen) {
            setResults({ tickets: [], subjects: [], tags: [] });
            setSelectedIndex(0);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(route('search'), { params: { q: query } });
                setResults(response.data);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Failed to fetch search results", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(debounce);
    }, [query, isOpen]);

    let totalResults = results.tickets.length + results.subjects.length + results.tags.length;

    const navigate = useCallback((direction) => {
        if (totalResults === 0) return;
        setSelectedIndex((prev) => {
            if (direction === 'down') {
                return prev + 1 >= totalResults ? 0 : prev + 1;
            } else {
                return prev - 1 < 0 ? totalResults - 1 : prev - 1;
            }
        });
    }, [totalResults]);

    return {
        isOpen,
        query,
        setQuery,
        results,
        isLoading,
        selectedIndex,
        setSelectedIndex,
        navigate,
        toggle,
        close,
        open,
        totalResults
    };
}
