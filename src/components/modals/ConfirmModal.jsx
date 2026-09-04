import React from 'react';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ink/60 z-[110] flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-4 border-jasper text-center animate-dropdownFade">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-jasper" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-playfair text-2xl font-bold text-ink mb-2">Xác Nhận Thao Tác</h3>
        <p className="font-newsreader mb-8 text-gray-600 text-lg">{message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}</p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-bold tracking-wide cursor-pointer font-newsreader"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-jasper text-white px-5 py-2 rounded-md hover:bg-red-800 transition shadow-sm font-newsreader font-bold tracking-wide cursor-pointer"
          >
            Đồng Ý
          </button>
        </div>
      </div>
    </div>
  );
}
