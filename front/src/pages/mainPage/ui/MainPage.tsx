import module from './MainPage.module.scss'
import {useCallback, useEffect, useMemo, useState} from "react";
import {adsApi} from "@/shared/api/ads.ts";
import type {Ad} from "@/entities/ad/model/types.ts";
import {AdsList} from "@/widgets";
import {SearchAds} from "@/features/searchAds";
import FilterByPrice from "../../../features/filterByPrice/ui/FilterByPrice.tsx";
import {useFilterByDate} from "@/features/filterByPrice/lib/hooks/useFilterByDate.ts";
import PaginationNumbers from "@/shared/ui/Pagination/Pagination.tsx";
import CategoriesSideFilter from "@/features/sideFilters/ui/CategoriesSideFilter/CategoriesSideFilter.tsx";
import StatusSideFilter from "@/features/sideFilters/ui/StatusSideFilter/StatusSideFilter.tsx";
import RangePricesSideFilter, {type Prices} from "@/features/sideFilters/ui/RangePricesSideFilter/RangePricesSideFilter.tsx";
import {useNavigate} from "react-router";

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

interface SideFilters {
    categories: string[];
    status: string[];
    minPrice: number | null;
    maxPrice: number | null;
}

const MainPage = () => {
    const [allData, setAllData] = useState<Ad[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterByPrice, setFilterByPrice] = useState<string>('');
    const [filterByPriority, setFilterByPriority] = useState<string>('');
    const [filterByDate, setFilterByDate] = useState<string>('');

    const [sideFilters, setSideFilters] = useState<SideFilters>({
        categories: [],
        status: [],
        minPrice: null,
        maxPrice: null,
    });

    const [sideFiltersActive, setSideFiltersActive] = useState<SideFilters>({
        categories: [],
        status: [],
        minPrice: null,
        maxPrice: null,
    });

    const [resetKey, setResetKey] = useState(0);
    const navigate = useNavigate();
    const filteredBySideFilters = useMemo(() => {
        let result = allData;

        if (sideFiltersActive.categories.length > 0) {
            result = result.filter(ad =>
                sideFiltersActive.categories.includes(ad.category)
            );
        }

        if (sideFiltersActive.status.length > 0) {
            result = result.filter(ad =>
                sideFiltersActive.status.includes(ad.status)
            );
        }

        if (sideFiltersActive.minPrice !== null) {
            result = result.filter(ad =>
                ad.price >= sideFiltersActive.minPrice!
            );
        }
        if (sideFiltersActive.maxPrice !== null) {
            result = result.filter(ad =>
                ad.price <= sideFiltersActive.maxPrice!
            );
        }

        return result;
    }, [allData, sideFiltersActive]);

    const filteredAndSearch = useFilterByDate(
        filteredBySideFilters,
        filterByPriority,
        searchQuery,
        filterByPrice,
        filterByDate
    );

    const currentPageData = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        return filteredAndSearch.slice(startIndex, endIndex);
    }, [filteredAndSearch, pagination.currentPage, pagination.itemsPerPage]);

    const handleOptionChangePrice = useCallback((option: string) => {
        setFilterByPrice(option);
        setPagination(prev => ({...prev, currentPage: 1}));
    }, []);

    const handleOptionChangePriority = useCallback((option: string) => {
        setFilterByPriority(option);
        setPagination(prev => ({...prev, currentPage: 1}));
    }, []);

    const handleOptionChangeDate = useCallback((option: string) => {
        setFilterByDate(option);
        setPagination(prev => ({...prev, currentPage: 1}));
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setPagination(prev => ({...prev, currentPage: page}));
    }, []);

    const handleSelectCategories = useCallback((categories: string[]) => {
        setSideFilters((prev) => ({...prev, categories}));
    }, []);

    const handleSelectStatus = useCallback((statuses: string[]) => {
        setSideFilters((prev) => ({...prev, status: statuses}));
    }, []);

    const handleSelectPrices = useCallback((prices: Prices) => {
        setSideFilters((prev) => ({...prev, minPrice: prices.from, maxPrice: prices.to}));
    }, []);

    const handleApplyFilters = useCallback(() => {
        setSideFiltersActive(sideFilters);
        setPagination(prev => ({...prev, currentPage: 1}));
    }, [sideFilters]);

    const handleResetAllFilters = useCallback(() => {
        setSideFilters({
            categories: [],
            status: [],
            minPrice: null,
            maxPrice: null,
        });
        setSideFiltersActive({
            categories: [],
            status: [],
            minPrice: null,
            maxPrice: null,
        });
        setSearchQuery('');
        setFilterByPrice('');
        setFilterByPriority('');
        setFilterByDate('');
        setPagination(prev => ({...prev, currentPage: 1}));
        setResetKey(prev => prev + 1);
    }, []);

    const fetchAllAds = useCallback(async () => {
        setLoading(true);
        try {
            let allAds: Ad[] = [];
            let currentPage = 1;
            let hasMore = true;

            while (hasMore) {
                const res = await adsApi.getAds(currentPage, 100);
                allAds = [...allAds, ...res.data.ads];

                if (currentPage >= res.data.pagination.totalPages) {
                    hasMore = false;
                } else {
                    currentPage++;
                }
            }

            setAllData(allAds);
            setPagination(prev => ({
                ...prev,
                totalPages: Math.ceil(allAds.length / prev.itemsPerPage),
                totalItems: allAds.length
            }));
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [pagination.itemsPerPage]);

    useEffect(() => {
        setLoading(true);
        fetchAllAds().catch(error => {
            console.error("Error in useEffect:", error);
        });
    }, [fetchAllAds]);

    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(filteredAndSearch.length / prev.itemsPerPage),
            totalItems: filteredAndSearch.length
        }));
    }, [filteredAndSearch, pagination.itemsPerPage]);


    const ids = useMemo(() => filteredAndSearch.map(ad => ad.id), [filteredAndSearch]);
    const handleAdClick = useCallback((adId: number) => {
        navigate(`/ads/${adId}`, {
            state: {
                ids: ids,
            }
        });
    }, [navigate, ids]);


    return (
        <>
            <h1 className={module.mainTitle}>Модерация объявлений</h1>
            <div className={module.mainPageContainer}>
                <div className={module.sideCategoriesContainer}>
                    <button
                        onClick={handleResetAllFilters}
                        className={module.resetAllFiltersButton}
                    >
                        Сбросить все фильтры
                    </button>

                    <CategoriesSideFilter
                        ads={allData}
                        onCategoriesChange={handleSelectCategories}
                        key={`categories-${resetKey}`}
                    />
                    <StatusSideFilter
                        key={`status-${resetKey}`}
                        onStatusChange={handleSelectStatus}
                    />
                    <RangePricesSideFilter
                        key={`prices-${resetKey}`}
                        onPricesChange={handleSelectPrices}
                    />

                    <button
                        onClick={handleApplyFilters}
                        className={module.sideFilterButton}
                    >
                        Применить фильтры
                    </button>
                </div>

                <div className={module.searchFiltersAdsContainer}>
                    <div className={module.filtersAndSearch}>
                        <SearchAds
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                        <FilterByPrice
                            onChange={handleOptionChangePrice}
                            options={['Возрастанию цены', 'Убыванию цены']}
                            initialTitle='Цена'
                        />
                        <FilterByPrice
                            onChange={handleOptionChangePriority}
                            options={['Сначала срочные', 'Сначала обычные']}
                            initialTitle='Приоритет'
                        />
                        <FilterByPrice
                            onChange={handleOptionChangeDate}
                            options={['Новые', 'Старые']}
                            initialTitle='Дата создания'
                        />
                    </div>

                    {loading && <div>Загрузка всех объявлений...</div>}

                    {!loading && (
                        <div className={module.filterInfo}>
                            {filteredAndSearch.length !== allData.length ? (
                                <div>
                                    Найдено {filteredAndSearch.length} из {allData.length} объявлений
                                </div>
                            ) : (
                                <div>Все объявления ({allData.length})</div>
                            )}
                        </div>
                    )}

                    <div className={module.adsListContainer}>
                        <AdsList ads={currentPageData} handleChange={handleAdClick}/>
                    </div>

                    {filteredAndSearch.length > 0 && (
                        <PaginationNumbers
                            totalPages={pagination.totalPages}
                            currentPage={pagination.currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}

                    {!loading && filteredAndSearch.length === 0 && (
                        <div className={module.noResults}>
                            По вашему запросу ничего не найдено
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MainPage;