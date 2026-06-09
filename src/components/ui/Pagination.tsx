"use client";

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  
  // Hiển thị tối đa 5 trang ở giữa (nếu nhiều trang)
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid var(--color-accent)',
          backgroundColor: 'transparent',
          color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-accent)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
          fontWeight: 600
        }}
      >
        &lt;
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={pageBtnStyle(false)}>1</button>
          {startPage > 2 && <span style={{ color: 'var(--color-text-muted)' }}>...</span>}
        </>
      )}

      {pages.map(page => (
        <button 
          key={page} 
          onClick={() => onPageChange(page)}
          style={pageBtnStyle(page === currentPage)}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ color: 'var(--color-text-muted)' }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} style={pageBtnStyle(false)}>{totalPages}</button>
        </>
      )}

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid var(--color-accent)',
          backgroundColor: 'transparent',
          color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-accent)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
          fontWeight: 600
        }}
      >
        &gt;
      </button>
    </div>
  );
}

function pageBtnStyle(isActive: boolean) {
  return {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    border: `1px solid ${isActive ? 'var(--color-accent)' : 'rgba(150,150,150,0.3)'}`,
    backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
    color: isActive ? '#fff' : 'var(--color-text-main)',
    cursor: 'pointer',
    fontWeight: isActive ? 700 : 500,
    transition: 'all 0.2s ease'
  };
}
