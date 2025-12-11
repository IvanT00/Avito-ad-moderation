import axios from "axios";
import type { adsFromRequest } from "@/entities/ad/model/types.ts";

export const adsApi = {
    getAds: (page: number, limit: number) =>
        axios.get<adsFromRequest>(`http://localhost:3001/api/v1/ads?page=${page}&limit=${limit}`),
}