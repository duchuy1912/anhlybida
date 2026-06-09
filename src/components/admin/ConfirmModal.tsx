"use client";

import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'danger' | 'info' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  type = 'danger',
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
      case 'warning':
        return <AlertTriangle size={24} color={type === 'danger' ? '#ef4444' : '#f59e0b'} />;
      case 'info':
        return <Info size={24} color="#3b82f6" />;
      default:
        return null;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return { backgroundColor: '#ef4444', color: 'white' };
      case 'info':
        return { backgroundColor: '#3b82f6', color: 'white' };
      case 'warning':
        return { backgroundColor: '#f59e0b', color: 'white' };
      default:
        return { backgroundColor: '#3b82f6', color: 'white' };
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg-light)',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(150, 150, 150, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {getIcon()}
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {title}
            </h3>
          </div>
          <button 
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '1.5rem', color: 'var(--color-text-main)', lineHeight: 1.5, fontSize: '1rem' }}>
          {message}
        </div>
        
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: 'rgba(150, 150, 150, 0.05)',
          borderTop: '1px solid rgba(150, 150, 150, 0.1)'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 500,
              backgroundColor: 'transparent', border: '1px solid rgba(150, 150, 150, 0.3)',
              color: 'var(--color-text-main)', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            style={{
              padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
              ...getConfirmButtonStyle()
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
