import * as React from "react";
import {normalizeStatus} from "@/entities/ad/lib/formatters.ts";
import module from './AdStatus.module.scss'

interface AdStatusProps {
    status: string;
}

const AdStatus: React.FC<AdStatusProps>  = ({status}) => {
    const statusClassname = {
        rejected: module.redStatus,
        approved: module.greenStatus,
        pending: module.blueStatus,
        draft: module.blueStatus,
    }[status] || module.defaultStatus;
    return (
        <span className={`${module.adStatus} ${statusClassname}`}>
            {normalizeStatus(status)}
        </span>
    );
};

export default AdStatus;