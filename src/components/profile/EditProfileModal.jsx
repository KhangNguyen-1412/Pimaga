import React, { useState, useEffect } from 'react';
import { ROLE_OPTIONS, MATH_TOPIC_OPTIONS } from '../../utils/profileUtils';
import { useAuth } from '../../context/AuthContext';
import SelectDropdown from '../common/SelectDropdown';

export default function EditProfileModal({ isOpen, onClose, userProfile = {}, onSave }) {
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [school, setSchool] = useState('');
  const [role, setRole] = useState('');
  const [grade, setGrade] = useState('');
  const [interests, setInterests] = useState([]);
  const [bio, setBio] = useState('');
  const [facebook, setFacebook] = useState('');
  const [github, setGithub] = useState('');
  const [blog, setBlog] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(userProfile.displayName || currentUser?.displayName || '');
      setSchool(userProfile.school || '');
      setRole(userProfile.role || ROLE_OPTIONS[0]);
      setGrade(userProfile.grade || '');
      setInterests(Array.isArray(userProfile.interests) ? [...userProfile.interests] : ['Hình học phẳng', 'Số học & Lý thuyết số']);
      setBio(userProfile.bio || '');
      setFacebook(userProfile.socialLinks?.facebook || '');
      setGithub(userProfile.socialLinks?.github || '');
      setBlog(userProfile.socialLinks?.blog || '');
    }
  }, [isOpen, userProfile, currentUser]);

  // Handle Esc key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleInterest = (topic) => {
    if (interests.includes(topic)) {
      setInterests(interests.filter((t) => t !== topic));
    } else {
      setInterests([...interests, topic]);
    }
  };

  const handleAddCustomInterest = (e) => {
    e.preventDefault();
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setCustomInterest('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        displayName: displayName.trim(),
        school: school.trim(),
        role: role.trim(),
        grade: grade.trim(),
        interests,
        bio: bio.trim(),
        socialLinks: {
          facebook: facebook.trim(),
          github: github.trim(),
          blog: blog.trim(),
        },
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-cerulean dark:text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-gray-900 dark:text-slate-100">
                Chỉnh Sửa Hồ Sơ Học Thuật
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-sans">
                Cập nhật thông tin cá nhân và định hướng toán học của bạn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[75vh] space-y-4 text-sm font-sans custom-scrollbar">
          {/* Tên & Trường học */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Tên hiển thị <span className="text-jasper">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="VD: Euler, Trần Toán..."
                className="w-full px-3 py-2 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cerulean transition text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Trường học / Đơn vị công tác
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="VD: THPT Chuyên KHTN, ĐH Sư Phạm..."
                className="w-full px-3 py-2 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cerulean transition text-xs"
              />
            </div>
          </div>

          {/* Vai trò & Lớp/Năm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Vai trò / Cương vị
              </label>
              <SelectDropdown
                value={role}
                onChange={setRole}
                options={ROLE_OPTIONS}
                placeholder="Chọn vai trò..."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Khối lớp / Niên khóa
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="VD: Lớp 11 Toán 1, K65, Khóa 2024..."
                className="w-full px-3 py-2 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cerulean transition text-xs"
              />
            </div>
          </div>

          {/* Phân môn toán yêu thích */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Phân môn toán yêu thích / Thế mạnh (Nhấn để chọn)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {MATH_TOPIC_OPTIONS.map((topic) => {
                const isSelected = interests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-cerulean text-cerulean dark:text-blue-400 shadow-2xs font-semibold'
                        : 'bg-white dark:bg-nightInput border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* Thêm tag tùy chọn */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Thêm phân môn khác (nhấn Enter)..."
                className="flex-1 px-3 py-1.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomInterest(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Thêm tag
              </button>
            </div>
          </div>

          {/* Bio / Châm ngôn toán học */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Châm ngôn / Giới thiệu bản thân
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="VD: Toán học là chìa khóa mở cánh cửa tri thức..."
              className="w-full px-3 py-2 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cerulean transition text-xs font-newsreader resize-y"
            />
          </div>

          {/* Liên kết cá nhân */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Liên kết cá nhân (Tùy chọn)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  Facebook URL
                </span>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean"
                />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  GitHub Profile
                </span>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean"
                />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  Website / Blog
                </span>
                <input
                  type="url"
                  value={blog}
                  onChange={(e) => setBlog(e.target.value)}
                  placeholder="https://myblog.com/..."
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-cerulean hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu Thay Đổi</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
