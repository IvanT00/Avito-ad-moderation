import type {Ad} from "@/entities/ad/model/types.ts";
import {useMemo} from "react";
import {useFilterByPriority} from "@/features/filterByPrice/lib/hooks/useFilterByPriority.ts";

export const useFilterByDate = (ads: Ad[], filterByPriority: string, searchQuery: string, filterByPrice:string, filterByDate:string)=> {
    const filtered = useFilterByPriority(ads, filterByPriority, searchQuery, filterByPrice);

    const sortedAds = useMemo(() => {
        const adsToSort = [...filtered];
        switch (filterByDate) {
            case 'Новые':
                return adsToSort.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });

            case 'Старые':
                return adsToSort.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateA - dateB;
                });
            default:
                return adsToSort;
        }
    }, [filtered, filterByDate]);
    return sortedAds;
}
