import type {Ad} from "@/entities/ad/model/types.ts";
import {useMemo} from "react";
import useSearchAds from "@/features/searchAds/lib/hooks/useSearchAds.ts";

export const useFilterByPrice = (ads: Ad[], searchQuery: string, option:string)=> {
    const filteredAds = useSearchAds({ads, searchQuery})

    const sortedAds = useMemo(() => {
        const adsToSort = [...filteredAds];
        switch (option) {
            case 'Возрастанию цены':
                return adsToSort.sort((a, b) => a.price - b.price);
            case 'Убыванию цены':
                return adsToSort.sort((a, b) => b.price - a.price);
            default:
                return adsToSort;
        }
    }, [filteredAds, option]);
    return sortedAds;
}