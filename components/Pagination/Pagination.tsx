// components/Pagination/Pagination.tsx

"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
    pageCount: number;
    forcePage: number;
    onPageChange: (nextPage: number) => void;
}

export default function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            forcePage={forcePage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />
    );
}