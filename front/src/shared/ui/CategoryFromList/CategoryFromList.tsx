import module from './CategoryFromList.module.scss'
import cross from '@/app/assets/icons/cross.svg'
import type {FC} from "react";

interface CategoryFromListProps{
    category:string;
    changeSelected: (value:string) => void;
}

const CategoryFromList:FC<CategoryFromListProps> = ({category, changeSelected}) => {
    return (
        <div className={module.categoryFromListContainer}>
            <img onClick={() => changeSelected(category)} className={module.categoryFromListImg} src={cross} alt=""/>
            {category}
        </div>
    );
};

export default CategoryFromList;