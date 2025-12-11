import module from './AdsList.module.scss'
import AdsListItem from "@/widgets/adsList/ui/AdsListItem/AdsListItem.tsx";
import * as React from "react";
import type {AdsListProps} from "@/widgets/adsList/model/types.ts";


const AdsList: React.FC<AdsListProps> = ({ads, handleChange}) => {



    return (
        <ul className={module.adList}>
            {ads.map((item) => (
                <AdsListItem
                    key={item.id}
                    ad={item}
                    onClick={() => handleChange(item.id)}
                />
            ))}
        </ul>
    );
};

export default AdsList;