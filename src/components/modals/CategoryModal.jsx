import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function CategoryModal({ isOpen, onClose, onRequestDelete }) {
  const { categories, addCategory } = useData();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Vui lòng nhập tên Chuyên mục!');
      return;
    }

    try {
      setIsSubmitting(true);
      await addCategory(name.trim());
      setName('');
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm chuyên mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 dark:bg-black/70 z-[100] flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-paper dark:bg-nightCard p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg border-t-4 border-jasper dark:border-rose-500 border-x border-b border-gray-100 dark:border-slate-800 max-h-[90vh] flex flex-col animate-dropdownFade transition-colors">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200 dark:border-slate-800">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-ink dark:text-slate-100">Quản Lý Chuyên Mục</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader mt-0.5">Thêm hoặc xóa các chuyên mục bài toán của tạp chí</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 text-2xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border flex items-start gap-2.5 shadow-xs font-newsreader text-sm transition-all mb-3 bg-red-50/95 dark:bg-rose-950/50 border-red-200 dark:border-rose-900 text-jasper dark:text-rose-400 border-l-4 border-jasper">
            <svg className="w-5 h-5 text-jasper dark:text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-bold font-playfair leading-tight">Lỗi:</p>
              <p className="text-ink dark:text-slate-200 mt-0.5">{error}</p>
            </div>
            <button type="button" onClick={() => setError('')} className="text-gray-400 dark:text-slate-400 hover:text-ink dark:hover:text-slate-200 text-lg font-bold">&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 bg-white dark:bg-nightInput/60 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <label className="block text-xs font-bold text-jasper dark:text-rose-400 font-playfair uppercase tracking-wider mb-1.5">
            Thêm Chuyên Mục Mới
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Vẻ đẹp Toán học, Diễn đàn..."
              className="flex-1 border border-gray-300 dark:border-slate-700 bg-paper dark:bg-nightInput text-ink dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3.5 py-2 font-newsreader text-base focus:outline-none focus:ring-2 focus:ring-jasper transition"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-jasper dark:bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-red-800 dark:hover:bg-rose-700 transition shadow-xs font-newsreader font-bold text-sm tracking-wide cursor-pointer shrink-0 disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 font-playfair uppercase tracking-wider mb-2">
            Danh Sách Chuyên Mục Hiện Có ({categories.length})
          </h4>
          <ul className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-nightInput/40 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-2xs font-newsreader">
            {categories.map((c) => (
              <li key={c.id} className="py-3 px-3.5 flex justify-between items-center group hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-jasper dark:bg-rose-400 shrink-0"></span>
                  <span className="font-newsreader font-bold text-base text-ink dark:text-slate-200 truncate">{c.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onRequestDelete(
                      `Xóa chuyên mục "${c.name}"? Các bài toán liên quan sẽ không bị xóa.`,
                      c.id
                    )
                  }
                  className="text-jasper dark:text-rose-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-xs font-bold bg-red-50 dark:bg-rose-950/40 hover:bg-red-100 dark:hover:bg-rose-900/60 border border-red-200 dark:border-rose-900 px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 cursor-pointer"
                  title="Xóa chuyên mục"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Xóa</span>
                </button>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="py-6 text-center text-gray-400 dark:text-slate-500 font-newsreader italic">
                Chưa có chuyên mục nào. Hãy nhập thông tin phía trên để thêm mới.
              </li>
            )}
          </ul>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-newsreader font-bold text-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
