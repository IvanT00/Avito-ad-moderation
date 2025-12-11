import type {FC} from "react";
import module from './Pagination.module.scss'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationNumbers:FC<PaginationProps> = ({currentPage,
                                         totalPages,
                                         onPageChange}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }
    if (totalPages <= 1) {
        return null;
    }
    return (
        <div className={module.pagintaionButtonContainer}>
            {getPageNumbers().map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${module.paginationButton} ${
                        page === currentPage ? module.paginationButtonActive : ''
                    }`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default PaginationNumbers;