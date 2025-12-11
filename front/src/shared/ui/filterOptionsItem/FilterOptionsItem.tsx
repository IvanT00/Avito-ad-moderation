import type {FC} from "react";
import modules from './FilterOptionsItem.module.scss'

interface FilterOptionsItemProps {
    onClick: (value: string) => void;
    option: string;
}

const FilterOptionsItem:FC<FilterOptionsItemProps> = ({onClick, option}) => {
    return (
        <li className={modules.filterOptionsItem} onClick={() => onClick(option)}>
        {option}
        </li>
    );
};

export default FilterOptionsItem;