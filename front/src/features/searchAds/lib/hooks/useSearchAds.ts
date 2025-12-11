import type { Ad } from "@/entities/ad/model/types.ts";
import {useEffect, useMemo, useState} from "react";

function useDebounce<T>(value: T, delay: number): T{
    const [debounce, setDebounce] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounce(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debounce;
}

export default function useSearchAds({ searchQuery, ads }: { searchQuery: string; ads: Ad[] }) {

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const filteredAds = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return ads;
        }
        const query = debouncedSearchQuery.toLowerCase().trim();
        return ads.filter(ad =>
            ad.title.toLowerCase().includes(query)
        );
    }, [debouncedSearchQuery, ads]);

    return filteredAds;
}