
    export const normalizeTitle = (title: string) => {
        const newTitle:string = title.split(' ').slice(2).join(' ');
        return newTitle;
    }
    export const normalizeDescription = (description: string) => {
        const newDescription:string = description.split('. ').slice(1).join('. ');
        return newDescription;
    }

    export const normalizeModel = (model: string) => {
        const newModel:string = model.split(' ').slice(1).join(' ');
        return newModel;
    }

    export const normalizePrice = (price: number) => {
        return price.toLocaleString('ru-RU') + ' ₽';
    }

    export const normalizeDate = (createdAt: string) => {
        const date = new Date(createdAt);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}.${month}.${year}`;
    }
    export const normalizeDateForModer = (timestamp: string) => {
        const date = new Date(timestamp);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');


        return `${hour}:${minute} ${day}.${month}.${year}`;
    }

    export const normalizeStatus = (status: string) => {
        switch (status) {
            case 'rejected': return ('Отклонено');
            case 'approved': return ('Одобрено');
            case 'pending': return ('На модерации');
            case 'requestChanges': return ('На доработку');
            case 'draft': return ('На модерации');
            default: return status;
        }
}

export  function getTimeDifference(isoDate: string): string {
        const currentDate = new Date();
        const targetDate = new Date(isoDate);

        let months = (currentDate.getFullYear() - targetDate.getFullYear()) * 12;
        months += currentDate.getMonth() - targetDate.getMonth();

        if (currentDate.getDate() < targetDate.getDate()) {
            months--;
        }

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        const yearText = getYearText(years);
        const monthText = getMonthText(remainingMonths);

        if (years === 0 && remainingMonths === 0) {
            return "меньше месяца";
        }

        const parts = [];
        if (years > 0) parts.push(`${years} ${yearText}`);
        if (remainingMonths > 0) parts.push(`${remainingMonths} ${monthText}`);

        return parts.join(" и ");
    }

export  function getYearText(years: number): string {
        if (years === 1) return "год";
        if (years >= 2 && years <= 4) return "года";
        return "лет";
    }

    function getMonthText(months: number): string {
        if (months === 1) return "месяц";
        if (months >= 2 && months <= 4) return "месяца";
        return "месяцев";
    }
