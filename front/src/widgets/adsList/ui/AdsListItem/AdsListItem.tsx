import module from './AdsListItem.module.scss'
import * as React from "react";
import AdStatus from "@/features/adsManagement/ui/AdStatus/AdStatus.tsx";
import {normalizeDate, normalizePrice, normalizeTitle} from "@/entities/ad/lib/formatters.ts";
import ImgCarousel from "@/shared/ui/ImgCarousel/ImgCarousel.tsx";
import type {AdsListItemProps} from "@/widgets/adsList/model/types.ts";

const AdsListItem: React.FC<AdsListItemProps> = ({ ad, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <li
            className={module.ad}
            onClick={handleClick}
        >
            <div className={module.containerImgInfo}>
                <div className={module.imgCarouselContainer}>
                    <ImgCarousel altTextPrefix={'Product image'} imagesLinks={ad.images}/>
                </div>
                <div className={module.adInfo}>
                    <h2 className={module.adTitle}>{normalizeTitle(ad.title)}</h2>
                    <p className={module.adPrice}>{normalizePrice(ad.price)}</p>
                    <span className={module.adCategory}>{ad.category}</span>
                    <span className={module.adDateAdd}>{normalizeDate(ad.createdAt)}</span>
                    <AdStatus status={ad.status}/>
                </div>
            </div>
            <div className={module.adPriorityContainer}>
                {ad.priority === 'urgent'  ? <p className={module.adPriority}>Срочно!</p> : null}
            </div>
        </li>
    );
};

export default AdsListItem;