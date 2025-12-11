import module from './SearchAds.module.scss'
import {type FC} from "react";

interface SearchAdsProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchAds:FC<SearchAdsProps> = ({value, onChange}) => {

    return (
        <div className={module.inputContainer}>
            <input
                className={module.searchInput} type="text"
                placeholder='Поиск по объявлениям'
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchAds;