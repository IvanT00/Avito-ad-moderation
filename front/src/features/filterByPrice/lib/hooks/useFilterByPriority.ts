import type {Ad} from "@/entities/ad/model/types.ts";
import {useMemo} from "react";
import {useFilterByPrice} from "@/features/filterByPrice/lib/hooks/useFilterByPrice.ts";

export const useFilterByPriority = (ads: Ad[], option:string, searchQuery:string ,filterByPrice:string)=> {
    const filteredAndSearch = useFilterByPrice(ads, searchQuery, filterByPrice);

    const sortedAds = useMemo(() => {
        const adsToSort = [...filteredAndSearch];
        switch (option) {
            case 'Сначала срочные':
                return adsToSort.sort((a, b) => {
                    if (a.priority === 'urgent' && b.priority === 'normal') return -1;
                    if (a.priority === 'normal' && b.priority === 'urgent') return 1;
                    return 0;
                });
            case 'Сначала обычные':
                return adsToSort.sort((a, b) => {
                    if (a.priority === 'normal' && b.priority === 'urgent') return -1;
                    if (a.priority === 'urgent' && b.priority === 'normal') return 1;
                    return 0;
                });
            default:
                return adsToSort;
        }
    }, [filteredAndSearch, option]);
    return sortedAds;
}
