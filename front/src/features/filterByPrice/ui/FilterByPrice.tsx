import modules from './FilterByPrice.module.scss'
import arrow from '@/app/assets/icons/arrow.svg'
import {type FC, useEffect, useRef, useState} from "react";
import FilterOptionsItem from "@/shared/ui/filterOptionsItem/FilterOptionsItem.tsx";

interface DropdownProps {
    options: string[];
    onChange: (value: string) => void;
    initialTitle: string;
}

const FilterByPrice:FC<DropdownProps> = ({options, onChange, initialTitle}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(initialTitle);
    const dropDownRef = useRef<HTMLDivElement>(null)

    const handleSelect = (option: string) =>{
        onChange(option);
        setTitle(option);
        setIsOpen(false);
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={modules.filterContainer}>
            <div className={modules.dropdown} ref={dropDownRef}>
                <button
                    className={`${isOpen ? modules.dropdownButtonOpen : modules.dropdownButtonClose}`}
                    onClick={() => {setIsOpen(!isOpen)}}
                >
                    <span className={modules.dropdownButtonPlaceholder}>{title}</span>
                    <img className={`${modules.dropdownArrowImg} ${isOpen ? modules.dropdownArrowImgUp : modules.dropdownArrowImgDown}`}  src={arrow} alt="" width={34} height={34}/>
                </button>
                {isOpen && (
                    <ul className={modules.optionsList}>
                        {options.map(option => {
                            return(
                                <FilterOptionsItem
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    option={option}
                                />
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FilterByPrice;