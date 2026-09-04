import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export default function GeminiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('pimaga_gemini_key') || '';
      setApiKey(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const val = apiKey.trim();
    if (!val) {
      showToast('Vui lòng nhập API Key trước khi lưu!', 'error');
      return;
    }
    localStorage.setItem('pimaga_gemini_key', val);
    showToast('Đã lưu khóa Google Gemini API thành công!', 'success');
    onClose();
  };

  const handleRemove = () => {
    localStorage.removeItem('pimaga_gemini_key');
    setApiKey('');
    showToast('Đã xóa khóa API lưu trữ', 'success');
  };

  return (
    <div className="fixed inset-0 bg-ink/60 z-[100] flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-300 animate-dropdownFade">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-cerulean shadow-2xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-cerulean leading-none">Khóa Google Gemini API</h3>
              <p className="text-xs text-gray-500 font-newsreader mt-0.5">Số hóa đề toán và công thức KaTeX từ hình ảnh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-ink text-2xl font-bold leading-none cursor-pointer"
            title="Đóng"
          >
            &times;
          </button>
        </div>

        <p className="text-sm font-newsreader text-gray-600 mb-3.5 leading-relaxed">
          Google Gemini API giúp hệ thống nhận diện ký tự và chuyển đổi công thức toán học phức tạp (phân số, căn, tích phân, ma trận, hệ phương trình) sang mã KaTeX với độ chính xác cao nhất. Khóa được lưu bảo mật trên trình duyệt của bạn (<code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs text-gray-700">localStorage</code>).
        </p>

        <div className="mb-4">
          <label className="block text-xs font-bold text-cerulean font-playfair uppercase tracking-wider mb-1.5">
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Dán API Key (ví dụ: AIzaSy...)"
            className="w-full h-10 px-3 border border-gray-300 bg-white rounded-lg font-mono text-sm focus:ring-2 focus:ring-cerulean focus:border-cerulean outline-none"
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mt-2 text-xs font-newsreader">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-cerulean hover:underline font-bold flex items-center gap-1"
            >
              <span>Lấy API Key miễn phí tại Google AI Studio</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              type="button"
              onClick={handleRemove}
              className="text-jasper hover:underline font-semibold cursor-pointer"
            >
              Xóa khóa đã lưu
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 font-newsreader cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-cerulean text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-newsreader font-bold text-sm tracking-wide shadow-xs cursor-pointer"
          >
            Lưu Khóa API
          </button>
        </div>
      </div>
    </div>
  );
}
