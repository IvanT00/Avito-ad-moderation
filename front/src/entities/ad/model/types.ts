export interface Ad {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    createdAt: string;
    images: string[];
    status: string;
    priority: string;
    characteristics?: {
        guarantee?: string;
        model?: string | null;
        manufacturer?: string;
        state?: string;
        color?: string;
    }
    seller?: {
        id?: number;
        name?: string;
        rating?: string;
        registeredAt?: string;
        totalAds?: number;
    };
    moderationHistory: moderationHistoryObj[];
}

export interface moderationHistoryObj {
    action: string;
    id?: number;
    moderatorId?: number;
    moderatorName: string;
    timestamp: string;
}
export interface adsFromRequest {
    ads: Ad[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}