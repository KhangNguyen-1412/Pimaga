import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import EditProfileModal from './EditProfileModal';
import MathRenderer from '../common/MathRenderer';
import {
  getAcademicRank,
  calculateDifficultyStats,
  calculateCategoryStats,
  generateSolutionsLatex,
  generateSolutionsMarkdown,
  downloadFile,
} from '../../utils/profileUtils';

export default function ProfilePage({ onOpenDetail, onOpenSolution, onBackToList }) {
  const { currentUser, isRealUser } = useAuth();
  const {
    problems,
    issues,
    categories,
    userSolutionsMap,
    userProfile,
    updateUserProfile,
    bookmarks,
    toggleBookmark,
    isBookmarked,
  } = useData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('solutions'); // 'solutions' | 'bookmarks' | 'stats' | 'settings'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Search & Filter for My Solutions
  const [solSearch, setSolSearch] = useState('');
  const [solCatFilter, setSolCatFilter] = useState('');

  // Search & Filter for Bookmarks
  const [bmSearch, setBmSearch] = useState('');
  const [bmCatFilter, setBmCatFilter] = useState('');

  // Gemini API Key state inside settings
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('pimaga_gemini_api_key') || '');
  const [showKey, setShowKey] = useState(false);

  // Fast maps
  const issueMap = useMemo(() => new Map(issues.map((i) => [i.id, i.name])), [issues]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  // Solved problems list with solution text
  const solvedItems = useMemo(() => {
    return problems
      .filter((p) => Boolean(userSolutionsMap[p.id]))
      .map((p) => ({
        problem: p,
        solution: userSolutionsMap[p.id],
        issueName: issueMap.get(p.issueId) || 'Không rõ Số',
        categoryName: categoryMap.get(p.categoryId) || 'Chuyên mục Toán',
      }));
  }, [problems, userSolutionsMap, issueMap, categoryMap]);

  // Filtered solved items
  const filteredSolvedItems = useMemo(() => {
    return solvedItems.filter((item) => {
      const p = item.problem;
      if (solCatFilter && p.categoryId !== solCatFilter) return false;
      if (solSearch.trim()) {
        const q = solSearch.toLowerCase();
        const matchCode = p.code?.toLowerCase().includes(q);
        const matchContent = p.content?.toLowerCase().includes(q);
        const matchSol = item.solution?.toLowerCase().includes(q);
        if (!matchCode && !matchContent && !matchSol) return false;
      }
      return true;
    });
  }, [solvedItems, solCatFilter, solSearch]);

  // Bookmarked problems list
  const bookmarkedProblems = useMemo(() => {
    return problems.filter((p) => bookmarks.includes(p.id));
  }, [problems, bookmarks]);

  // Filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarkedProblems.filter((p) => {
      if (bmCatFilter && p.categoryId !== bmCatFilter) return false;
      if (bmSearch.trim()) {
        const q = bmSearch.toLowerCase();
        const matchCode = p.code?.toLowerCase().includes(q);
        const matchContent = p.content?.toLowerCase().includes(q);
        if (!matchCode && !matchContent) return false;
      }
      return true;
    });
  }, [bookmarkedProblems, bmCatFilter, bmSearch]);

  // Academic rank calculation
  const rank = useMemo(() => getAcademicRank(solvedItems.length), [solvedItems.length]);

  // Stats calculations
  const difficultyStats = useMemo(
    () => calculateDifficultyStats(problems, userSolutionsMap),
    [problems, userSolutionsMap]
  );
  const categoryStats = useMemo(
    () => calculateCategoryStats(problems, userSolutionsMap, categories),
    [problems, userSolutionsMap, categories]
  );

  // Handlers for exporting solutions
  const handleExportLatex = () => {
    if (solvedItems.length === 0) {
      showToast('Bạn chưa có bài giải nào để xuất tài liệu!', 'warning');
      return;
    }
    const latexCode = generateSolutionsLatex(
      { displayName: userProfile.displayName || currentUser?.displayName, email: currentUser?.email },
      solvedItems
    );
    downloadFile(latexCode, `pimaga_bai_giai_${Date.now()}.tex`, 'application/x-tex;charset=utf-8');
    showToast(`Đã xuất thành công ${solvedItems.length} bài giải ra file LaTeX (.tex)!`, 'success');
  };

  const handleExportMarkdown = () => {
    if (solvedItems.length === 0) {
      showToast('Bạn chưa có bài giải nào để xuất tài liệu!', 'warning');
      return;
    }
    const mdContent = generateSolutionsMarkdown(
      { displayName: userProfile.displayName || currentUser?.displayName, email: currentUser?.email },
      solvedItems
    );
    downloadFile(mdContent, `pimaga_bai_giai_${Date.now()}.md`, 'text/markdown;charset=utf-8');
    showToast(`Đã xuất thành công ${solvedItems.length} bài giải ra file Markdown (.md)!`, 'success');
  };

  const handleSaveGeminiKey = (e) => {
    e.preventDefault();
    const cleanKey = geminiKey.trim();
    if (cleanKey) {
      localStorage.setItem('pimaga_gemini_api_key', cleanKey);
      showToast('Đã lưu Gemini API Key thành công!', 'success');
    } else {
      localStorage.removeItem('pimaga_gemini_api_key');
      showToast('Đã xóa Gemini API Key khỏi thiết bị.', 'info');
    }
  };

  if (!isRealUser) {
    return (
      <div className="p-8 text-center bg-white dark:bg-nightCard rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold font-playfair text-gray-900 dark:text-slate-100 mb-2">
          Vui lòng đăng nhập
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 font-sans mb-4">
          Bạn cần đăng nhập tài khoản Google để truy cập trang hồ sơ cá nhân, xem bài giải và thống kê của mình.
        </p>
      </div>
    );
  }

  const displayName = userProfile.displayName || currentUser?.displayName || 'Người dùng PI';
  const school = userProfile.school || 'Chưa cập nhật trường học';
  const role = userProfile.role || 'Người yêu toán';
  const grade = userProfile.grade || '';
  const interests = Array.isArray(userProfile.interests) && userProfile.interests.length > 0
    ? userProfile.interests
    : ['Đại số & Đa thức', 'Hình học phẳng'];
  const bio = userProfile.bio || 'Chưa có châm ngôn cá nhân. Hãy thêm lời giới thiệu hoặc câu trích dẫn bạn tâm đắc!';
  const socialLinks = userProfile.socialLinks || {};

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToList}
          className="text-xs font-semibold text-cerulean dark:text-blue-400 hover:underline flex items-center gap-1.5 font-sans cursor-pointer py-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại Kho Đề Toán</span>
        </button>

        <span className="text-xs text-gray-500 dark:text-slate-400 font-sans">
          Hồ sơ học thuật cá nhân
        </span>
      </div>

      {/* Main 2-Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Academic Profile Card (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          {/* Avatar & Core Identity */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-cerulean dark:border-blue-400 shadow-md p-0.5 bg-white dark:bg-slate-900"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-cerulean/10 dark:bg-blue-950/60 border-2 border-cerulean text-cerulean dark:text-blue-400 flex items-center justify-center font-bold text-2xl font-playfair shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Rank Icon Mini Badge */}
              <span
                className="absolute -bottom-1 -right-1 text-lg bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm border border-gray-200 dark:border-slate-700"
                title={rank.title}
              >
                {rank.icon}
              </span>
            </div>

            <h2 className="font-playfair text-xl font-bold text-gray-900 dark:text-slate-100 mb-0.5">
              {displayName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-sans truncate max-w-full">
              {currentUser?.email}
            </p>

            {/* Academic Rank Badge */}
            <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs font-sans ${rank.badgeColor}`}>
              <span>{rank.icon}</span>
              <span>{rank.title}</span>
            </div>
          </div>

          {/* Academic Info: School & Role */}
          <div className="p-3.5 bg-gray-50/70 dark:bg-slate-900/50 rounded-xl border border-gray-200/80 dark:border-slate-800/80 space-y-2 text-xs font-sans">
            <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
              <svg className="w-4 h-4 text-cerulean dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="flex-1 truncate">
                <span className="font-semibold block text-gray-900 dark:text-slate-100">Đơn vị:</span>
                <span className="text-gray-600 dark:text-slate-400">{school}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
              <svg className="w-4 h-4 text-cerulean dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="flex-1 truncate">
                <span className="font-semibold block text-gray-900 dark:text-slate-100">Vai trò:</span>
                <span className="text-gray-600 dark:text-slate-400">
                  {role} {grade ? `• ${grade}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Math Interests */}
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block mb-2 font-sans flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Lĩnh vực toán yêu thích
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-50/70 dark:bg-blue-950/40 text-cerulean dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 rounded-md text-[11px] font-sans font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Academic Quote / Bio */}
          <div className="border-l-2 border-cerulean dark:border-blue-400 pl-3 py-0.5">
            <p className="text-xs text-gray-600 dark:text-slate-400 font-newsreader italic leading-relaxed">
              "{bio}"
            </p>
          </div>

          {/* Social Links */}
          {(socialLinks.facebook || socialLinks.github || socialLinks.blog) && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  title="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition"
                  title="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
              {socialLinks.blog && (
                <a
                  href={socialLinks.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 transition"
                  title="Website / Blog"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-cerulean/30 dark:border-blue-500/30 hover:border-cerulean bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100/70 text-cerulean dark:text-blue-400 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer font-sans shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Chỉnh Sửa Hồ Sơ</span>
          </button>
        </div>

        {/* Right Column: 4 Dynamic Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs Header Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto custom-scrollbar font-sans text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('solutions')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'solutions'
                  ? 'bg-cerulean text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              <span>📝</span>
              <span>Lời Giải Của Tôi ({solvedItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookmarks')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'bg-cerulean text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              <span>⭐</span>
              <span>Đã Lưu ({bookmarks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-cerulean text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              <span>📊</span>
              <span>Thống Kê & Năng Lực</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-cerulean text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              <span>⚙️</span>
              <span>Cài Đặt & Xuất File</span>
            </button>
          </div>

          {/* TAB 1: LỜI GIẢI CỦA TÔI */}
          {activeTab === 'solutions' && (
            <div className="space-y-4">
              {/* Search & Filter bar */}
              <div className="bg-white dark:bg-nightCard p-3 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-2.5 items-center font-sans">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={solSearch}
                    onChange={(e) => setSolSearch(e.target.value)}
                    placeholder="Tìm theo mã bài, nội dung đề hoặc bài làm..."
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-nightInput border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  value={solCatFilter}
                  onChange={(e) => setSolCatFilter(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-nightInput border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cerulean"
                >
                  <option value="">Tất cả chuyên mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="text-xs text-gray-500 dark:text-slate-400 ml-auto font-medium">
                  {filteredSolvedItems.length} / {solvedItems.length} bài đã giải
                </div>
              </div>

              {/* Solutions List */}
              {filteredSolvedItems.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-nightCard border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xl block mb-2">📚</span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 font-playfair mb-1">
                    {solvedItems.length === 0 ? 'Bạn chưa nộp lời giải cho bài toán nào' : 'Không tìm thấy bài giải phù hợp'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-sans max-w-md mx-auto mb-4">
                    {solvedItems.length === 0
                      ? 'Hãy thử sức với các bài toán trên Tạp chí Pi và gửi lời giải của bạn để lưu lại vào đây!'
                      : 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc chuyên mục.'}
                  </p>
                  {solvedItems.length === 0 && (
                    <button
                      type="button"
                      onClick={onBackToList}
                      className="px-4 py-2 bg-cerulean text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition font-sans cursor-pointer"
                    >
                      Khám phá đề toán ngay
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSolvedItems.map(({ problem, solution, issueName, categoryName }) => (
                    <div
                      key={problem.id}
                      className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:shadow-md transition space-y-3"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-cerulean/10 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 font-mono font-bold text-xs rounded border border-cerulean/20">
                            {problem.code || 'BÀI TOÁN'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-slate-400 font-sans">
                            {categoryName} • {issueName}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 font-sans text-xs">
                          <button
                            type="button"
                            onClick={() => onOpenDetail(problem)}
                            className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-slate-700 hover:border-cerulean hover:text-cerulean text-gray-700 dark:text-slate-300 font-semibold transition cursor-pointer"
                          >
                            Xem đề
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenSolution(problem)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-cerulean dark:text-blue-400 font-semibold hover:bg-blue-100 transition cursor-pointer"
                          >
                            Sửa lời giải
                          </button>
                        </div>
                      </div>

                      {/* Solution preview */}
                      <div className="p-3 bg-gray-50/70 dark:bg-slate-900/60 rounded-lg border border-gray-100 dark:border-slate-800/80 text-sm font-newsreader">
                        <div className="text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1 font-sans">
                          <span>Lời giải của bạn:</span>
                        </div>
                        <div className="line-clamp-3 text-gray-800 dark:text-slate-200">
                          <MathRenderer content={solution} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BÀI TOÁN ĐÃ LƯU (BOOKMARKS) */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="bg-white dark:bg-nightCard p-3 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-2.5 items-center font-sans">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={bmSearch}
                    onChange={(e) => setBmSearch(e.target.value)}
                    placeholder="Tìm kiếm bài toán đã lưu..."
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-nightInput border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  value={bmCatFilter}
                  onChange={(e) => setBmCatFilter(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-nightInput border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cerulean"
                >
                  <option value="">Tất cả chuyên mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="text-xs text-gray-500 dark:text-slate-400 ml-auto font-medium">
                  {filteredBookmarks.length} / {bookmarkedProblems.length} bài đã lưu
                </div>
              </div>

              {filteredBookmarks.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-nightCard border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xl block mb-2">⭐</span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 font-playfair mb-1">
                    {bookmarkedProblems.length === 0 ? 'Bạn chưa lưu bài toán nào' : 'Không tìm thấy bài đã lưu phù hợp'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-sans max-w-md mx-auto mb-4">
                    {bookmarkedProblems.length === 0
                      ? 'Khi xem các bài toán trên Tạp chí Pi, bạn có thể bấm nút Bookmark (ngôi sao) để lưu lại ôn tập sau này!'
                      : 'Thử kiểm tra lại từ khóa tìm kiếm hoặc chuyên mục đã chọn.'}
                  </p>
                  {bookmarkedProblems.length === 0 && (
                    <button
                      type="button"
                      onClick={onBackToList}
                      className="px-4 py-2 bg-cerulean text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition font-sans cursor-pointer"
                    >
                      Duyệt danh sách bài toán
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookmarks.map((problem) => {
                    const isSolved = Boolean(userSolutionsMap[problem.id]);
                    const issueName = issueMap.get(problem.issueId) || 'Không rõ Số';
                    const categoryName = categoryMap.get(problem.categoryId) || 'Chuyên mục Toán';

                    return (
                      <div
                        key={problem.id}
                        className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:shadow-md transition space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-cerulean/10 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 font-mono font-bold text-xs rounded border border-cerulean/20">
                              {problem.code || 'BÀI TOÁN'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400 font-sans">
                              {categoryName} • {issueName}
                            </span>
                            {isSolved ? (
                              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800 font-sans">
                                ✓ Đã giải
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-200 dark:border-amber-800 font-sans">
                                Chưa giải
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 font-sans text-xs">
                            <button
                              type="button"
                              onClick={() => toggleBookmark(problem.id)}
                              className="px-2 py-1 rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold transition cursor-pointer flex items-center gap-1"
                              title="Bỏ lưu bài toán"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>Bỏ lưu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenDetail(problem)}
                              className="px-3 py-1 bg-cerulean text-white rounded-md font-semibold hover:bg-blue-800 transition cursor-pointer"
                            >
                              Vào giải bài
                            </button>
                          </div>
                        </div>

                        {/* Problem Snippet */}
                        <div className="line-clamp-2 text-sm text-gray-700 dark:text-slate-300 font-newsreader">
                          <MathRenderer content={problem.content} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THỐNG KÊ & NĂNG LỰC */}
          {activeTab === 'stats' && (
            <div className="space-y-5 font-sans">
              {/* Top 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-2xl font-black text-cerulean dark:text-blue-400 block font-mono">
                    {solvedItems.length}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Bài toán đã giải
                  </span>
                </div>

                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-2xl font-black text-amber-500 block font-mono">
                    {bookmarks.length}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Bài toán đã lưu
                  </span>
                </div>

                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                    {problems.length > 0 ? Math.round((solvedItems.length / problems.length) * 100) : 0}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Tỉ lệ hoàn thành kho đề
                  </span>
                </div>

                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-2xl font-black text-rose-500 block font-mono">
                    {rank.tier}/4
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium truncate block" title={rank.title}>
                    {rank.title}
                  </span>
                </div>
              </div>

              {/* Next Rank Progression Bar */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-700 dark:text-slate-300">
                    Tiến trình lên cấp bậc: <strong className="text-cerulean dark:text-blue-400">{rank.nextRank?.title || 'Tối đa'}</strong>
                  </span>
                  <span className="text-gray-500 dark:text-slate-400 font-mono">
                    {rank.nextRank ? `Cần thêm ${rank.neededForNext} bài nữa` : 'Đã đạt danh hiệu cao nhất!'}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                  <div
                    className="h-full bg-linear-to-r from-cerulean to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${rank.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Breakdown by Difficulty */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Phân Bố Độ Khó Các Bài Đã Giải</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {Object.entries(difficultyStats).map(([key, stat]) => (
                    <div key={key} className="p-3 bg-gray-50/70 dark:bg-slate-900/50 rounded-lg border border-gray-200/80 dark:border-slate-800/80">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-700 dark:text-slate-300">{stat.name}</span>
                        <span className="text-cerulean dark:text-blue-400 font-mono font-bold">
                          {stat.count}/{stat.total} ({stat.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cerulean dark:bg-blue-400 rounded-full"
                          style={{ width: `${stat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown by Category */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>📐</span>
                  <span>Thế Mạnh Theo Chuyên Mục Toán</span>
                </h4>
                <div className="space-y-2.5 pt-1">
                  {categoryStats.map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-800 dark:text-slate-200">{cat.name}</span>
                        <span className="text-gray-500 dark:text-slate-400 font-mono font-medium">
                          {cat.solved}/{cat.total} bài ({cat.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                        <div
                          className="h-full bg-cerulean dark:bg-blue-400 rounded-full transition-all duration-300"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CÀI ĐẶT & XUẤT FILE */}
          {activeTab === 'settings' && (
            <div className="space-y-5 font-sans">
              {/* Gemini AI API Key Setting */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      Cấu hình Google Gemini AI API Key
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Dùng để hỗ trợ phân tích đề, gợi ý giải toán và tra cứu thông minh
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveGeminiKey} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                      Gemini API Key của bạn (Lưu an toàn tại trình duyệt)
                    </label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cerulean"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                      >
                        {showKey ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 dark:text-slate-400">
                      Trạng thái: {geminiKey ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Đã thiết lập</span> : <span className="text-amber-600 dark:text-amber-400">Chưa cấu hình</span>}
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cerulean hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      Lưu Khóa API
                    </button>
                  </div>
                </form>
              </div>

              {/* Data Export Box */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-cerulean dark:text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      Xuất Tài Liệu & Kho Bài Giải Cá Nhân
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Tải về toàn bộ bài giải của bạn để in ấn, nộp báo cáo hoặc lưu trữ ngoại tuyến
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Export LaTeX */}
                  <div className="p-4 bg-gray-50/70 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-xs text-gray-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
                        <span>📄</span>
                        <span>Mã nguồn LaTeX (.tex)</span>
                      </span>
                      <p className="text-[11px] text-gray-600 dark:text-slate-400">
                        Sinh file .tex đầy đủ preamble tiếng Việt, gói amsmath và tikz, sẵn sàng biên dịch trực tiếp bằng TeXLive hoặc Overleaf.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportLatex}
                      className="w-full py-2 bg-cerulean hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Tải Tập Bài Giải (.tex)</span>
                    </button>
                  </div>

                  {/* Export Markdown */}
                  <div className="p-4 bg-gray-50/70 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-xs text-gray-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
                        <span>📝</span>
                        <span>Tài liệu Markdown (.md)</span>
                      </span>
                      <p className="text-[11px] text-gray-600 dark:text-slate-400">
                        Định dạng văn bản Markdown chuẩn quốc tế với công thức KaTeX, tương thích với Obsidian, Notion và GitHub.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportMarkdown}
                      className="w-full py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-cerulean hover:text-cerulean text-gray-800 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Tải Bản Markdown (.md)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        onSave={updateUserProfile}
      />
    </div>
  );
}
