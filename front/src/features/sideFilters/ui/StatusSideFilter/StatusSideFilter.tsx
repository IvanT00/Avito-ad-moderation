import module from './StatusSideFilter.module.scss';
import {type FC, useEffect, useState} from 'react';

interface StatusSideFilterProps {
    onStatusChange?: (statuses: string[]) => void;
}

const StatusSideFilter:FC<StatusSideFilterProps> = ({onStatusChange}) => {
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const statusOptions = [
        { value: 'pending', label: 'На модерации' },
        { value: 'approved', label: 'Одобрено' },
        { value: 'rejected', label: 'Отклонено' }
    ];

    const handleStatusChange = (statusValue: string) => {
        setSelectedStatuses(prev => {
            if (prev.includes(statusValue)) {
                return prev.filter(s => s !== statusValue);
            } else {
                return [...prev, statusValue];
            }
        });
    };
    useEffect(() => {
        onStatusChange?.(selectedStatuses);
    }, [selectedStatuses, onStatusChange]);

    return (
        <div className={module.statusContainer}>
            <p className={module.statusSideFilterTitle}>Статус объявления</p>
            <div className={module.listContainer}>
                {statusOptions.map(status => (
                    <label
                        key={status.value}
                        className={module.statusList}
                    >
                        <input
                            type="checkbox"
                            className={module.hiddenCheckbox}
                            checked={selectedStatuses.includes(status.value)}
                            onChange={() => handleStatusChange(status.value)}
                        />
                        <span className={module.customCheckbox}></span>
                        <p className={module.statusLabel}>{status.label}</p>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default StatusSideFilter;