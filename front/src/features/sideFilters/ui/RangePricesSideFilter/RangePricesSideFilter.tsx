import {type ChangeEvent, type FC, useEffect, useState} from 'react';
import module from './RangePricesSideFilter.module.scss'

export interface Prices {
    from: number | null;
    to: number | null;
}

interface RangePricesSideFilterProps {
    onPricesChange: (prices: Prices) => void;
}

const RangePricesSideFilter: FC<RangePricesSideFilterProps> = ({onPricesChange}) => {
    const [numbers, setNumbers] = useState<Prices>({
        from: null,
        to: null
    });
    useEffect(() => {
        onPricesChange?.(numbers);
    }, [numbers, onPricesChange]);

    const handleChangeFrom = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setNumbers((prev: Prices) => ({
            ...prev,
            from: value === '' ? null : Number(value)
        }));
    }

    const handleChangeTo = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setNumbers((prev: Prices) => ({
            ...prev,
            to: value === '' ? null : Number(value)
        }));
    }

    return (
        <div className={module.rangePricesSideFilterContainer}>
            <p className={module.rangePricesSideFilterTitle}>Цена, ₽</p>
            <div className={module.prices}>
                <input
                    className={module.rangePricesSideFilterFrom}
                    type="number"
                    value={numbers.from ?? ''}
                    onChange={handleChangeFrom}
                    placeholder="От"
                />
                <input
                    className={module.rangePricesSideFilterTo}
                    type="number"
                    value={numbers.to ?? ''}
                    onChange={handleChangeTo}
                    placeholder="До"
                />
            </div>
        </div>
    );
};

export default RangePricesSideFilter;