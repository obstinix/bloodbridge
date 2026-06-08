'use client';

import React, { useState, useMemo } from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: keyof T | 'actions';
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowsPerPage?: number;
  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  rowsPerPage = 10,
  className = '',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data];
    return sorted.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [data, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.max(Math.ceil(sortedData.length / rowsPerPage), 1);
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => {
              const isSortable = col.sortable && col.key !== 'actions';
              const isSorted = sortKey === col.key;
              return (
                <th
                  key={index}
                  className={styles.th}
                  style={{ width: col.width }}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key as keyof T)}
                      className={`${styles.sortableHeader} ${
                        isSorted ? styles.sortedActive : ''
                      }`}
                    >
                      {col.header}
                      {isSorted && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {sortDirection === 'asc' ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx} className={styles.shimmerRow}>
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className={styles.td}>
                    <div className={styles.shimmerCell} />
                  </td>
                ))}
              </tr>
            ))
          ) : currentRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.td}>
                <div className={styles.emptyState}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <div className={styles.emptyTitle}>No Data Found</div>
                    <p>{emptyMessage}</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            currentRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`${styles.tr} ${
                  onRowClick ? styles.clickableRow : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, cIdx) => {
                  const val = col.key === 'actions' ? '' : row[col.key as keyof T];
                  return (
                    <td key={cIdx} className={styles.td}>
                      {col.render ? col.render(val, row) : (val as any)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {!loading && data.length > rowsPerPage && (
        <div className={styles.footer}>
          <span>
            Page {currentPage} of {totalPages} ({data.length} total items)
          </span>
          <div className={styles.paginationBtns}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
