import module from './CategoriesItem.module.scss'
import type {FC} from "react";

interface CategoriesItemProps{
    category:string;
    onChange: (value: string) => void;
}

const CategoriesItem:FC<CategoriesItemProps> = ({category, onChange}) => {
    return (
        <div className={module.menuCategoriesItem} onClick={() => onChange(category)}>
            <li>{category}</li>
        </div>
    );
};

export default CategoriesItem;