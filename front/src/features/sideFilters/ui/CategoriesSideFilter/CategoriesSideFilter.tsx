import module from './CategoriesSideFilter.module.scss';
import type {Ad} from "@/entities/ad/model/types.ts";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import CategoriesItem from "@/shared/ui/CategoriesItem/CategoriesItem.tsx";
import CategoryFromList from "@/shared/ui/CategoryFromList/CategoryFromList.tsx";

interface CategoriesSideFilterProps {
    ads: Ad[];
    onCategoriesChange?: (categories: string[]) => void;
}

const CategoriesSideFilter: React.FC<CategoriesSideFilterProps> = ({ ads, onCategoriesChange}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>([]);
    const indexCategories = useRef<HTMLDivElement>(null);
    const indexCategoriesButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        onCategoriesChange?.(categories);
    }, [categories, onCategoriesChange]);


    const getAllCategories = (ads: Ad[]) => {
        const allCategories: string[] = [];
        ads.forEach((ad: Ad) => {
            if(!allCategories.includes(ad.category)){
                allCategories.push(ad.category);
            }
        })
        return allCategories;
    }

    const getAvailableCategories = () => {
        const allCategories = getAllCategories(ads);
        return allCategories.filter(category => !categories.includes(category));
    }

    const handleOpenMenuCategories = () => {
        if (open) {
            return;
        }
        setOpen(true);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (indexCategories.current &&
                indexCategoriesButton.current
                && !indexCategories.current.contains(event.target as Node)
                && !indexCategoriesButton.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectItem = (category: string) => {
        setCategories((prev) => [...prev, category]);

        setOpen(false);
    }

    const handleSelectedDelete = (categoryToDelete: string) => {
        setCategories(prev => prev.filter(category => category !== categoryToDelete));
    };

    return (
        <div className={module.sideCategoriesContainer}>
            <button className={module.buttonCategories} onClick={handleOpenMenuCategories} ref={indexCategoriesButton}>
                Категории
            </button>
            {open && getAvailableCategories().length > 0 && (
                <div className={module.menuCategories} ref={indexCategories}>
                    <ul className={module.menuCategoriesList}>
                        {getAvailableCategories().map(category => (
                            <CategoriesItem key={category} category={category} onChange={handleSelectItem}/>
                        ))}
                    </ul>
                </div>
            )}
                <div className={module.categoryFromListContainer}>
                    {categories.map((categoryFromList: string) => (
                        <CategoryFromList
                            key={categoryFromList}
                            changeSelected={handleSelectedDelete}
                            category={categoryFromList}
                        />
                    ))}
                </div>

        </div>
    );
};

export default CategoriesSideFilter;