import type {Ad} from "@/entities/ad/model/types.ts";

export interface AdsListProps {
    ads: Ad[];
    handleChange: (id:number) => void;
}
export interface AdsListItemProps {
    ad: Ad;
    onClick?: () => void;
}