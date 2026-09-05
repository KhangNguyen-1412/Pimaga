import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import EditProfileModal from './EditProfileModal';
import MathRenderer from '../common/MathRenderer';
import SelectDropdown from '../common/SelectDropdown';
import {
  getAcademicRank,
  calculateDifficultyStats,
  calculateCategoryStats,
  calculateIssueChallenges,
  generateLeaderboard,
  generateSolutionsLatex,
  generateSolutionsMarkdown,
  downloadFile,
} from '../../utils/profileUtils';

// SVG Icon thể hiện cấp bậc học thuật đồng bộ hệ thống
function RankBadgeIcon({ type, className = 'w-3.5 h-3.5' }) {
  switch (type) {
    case 'seedling':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V9m0 0c-2-3-6-3-6 0 0 4 6 7 6 7m0-7c2-3 6-3 6 0 0 4-6 7-6 7M5 19h14" />
        </svg>
      );
    case 'book':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'star':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case 'trophy':
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
  }
}

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

  // Category options for SelectDropdown
  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [categories]);

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

  // Gamification: Thử thách kỳ báo
  const issueChallenges = useMemo(
    () => calculateIssueChallenges(issues, problems, userSolutionsMap),
    [issues, problems, userSolutionsMap]
  );

  // Gamification: Bảng vinh danh học thuật (Leaderboard)
  const leaderboard = useMemo(
    () => generateLeaderboard(userProfile, solvedItems.length, userProfile?.streak?.current || 1),
    [userProfile, solvedItems.length]
  );

  // Gamification: 7-day visual week calendar
  const weekDayTracker = useMemo(() => {
    const today = new Date();
    const currentDayIdx = (today.getDay() + 6) % 7; // Thứ 2 = 0, ..., Chủ Nhật = 6
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const currentStreak = userProfile?.streak?.current || 1;

    return days.map((dayLabel, idx) => {
      const isToday = idx === currentDayIdx;
      const isActive = idx <= currentDayIdx && (currentDayIdx - idx) < currentStreak;
      return {
        label: dayLabel,
        isToday,
        isActive,
        isPastOrToday: idx <= currentDayIdx,
      };
    });
  }, [userProfile?.streak?.current]);

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
      <div className="p-8 text-center bg-white dark:bg-nightCard rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-12 font-newsreader">
        <h2 className="text-2xl font-bold font-playfair text-gray-900 dark:text-slate-100 mb-2">
          Vui lòng đăng nhập
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 font-newsreader mb-4">
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
    <div className="space-y-6 animate-fadeIn pb-12 font-newsreader text-ink dark:text-slate-100">
      {/* Top Breadcrumb navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={onBackToList}
          className="text-sm font-bold text-cerulean dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1.5 font-newsreader cursor-pointer py-1 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại Kho Đề Toán</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 border border-red-200/70 dark:border-rose-900/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-newsreader shadow-2xs">
            Toán Học &amp; Tuổi Trẻ
          </span>
          <span className="text-xs text-gray-500 dark:text-slate-400 font-newsreader italic hidden sm:inline">
            Hồ sơ học thuật cá nhân
          </span>
        </div>
      </div>

      {/* Main 2-Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Academic Profile Card (4 cols) with Cerulean & Jasper Signature Branding */}
        <div className="lg:col-span-4 bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          {/* Avatar & Core Identity */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              {/* Avatar with solid Cerulean border */}
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-cerulean dark:border-blue-400 shadow-sm p-0.5 bg-white dark:bg-slate-900"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/60 border-2 border-cerulean text-cerulean dark:text-blue-400 flex items-center justify-center font-bold text-2xl font-playfair shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Rank Icon Mini Badge */}
              <span
                className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-sm border border-gray-200 dark:border-slate-700 text-cerulean dark:text-blue-400 flex items-center justify-center"
                title={rank.title}
              >
                <RankBadgeIcon type={rank.iconType} className="w-3.5 h-3.5" />
              </span>
            </div>

            <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-slate-100 mb-0.5">
              {displayName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader truncate max-w-full">
              {currentUser?.email}
            </p>

            {/* Academic Rank Badge */}
            <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs font-newsreader ${rank.badgeColor}`}>
              <RankBadgeIcon type={rank.iconType} className="w-3.5 h-3.5 shrink-0" />
              <span>{rank.title}</span>
            </div>

            {/* Dual Quick Stats Pill (Cerulean + Jasper) */}
            <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-slate-800">
              <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 border border-cerulean/30 dark:border-blue-900/60 rounded-xl text-center">
                <span className="block font-playfair font-black text-xl text-cerulean dark:text-blue-400 leading-tight">
                  {solvedItems.length}
                </span>
                <span className="text-[11px] font-bold text-gray-600 dark:text-slate-400 font-newsreader">
                  Bài đã giải
                </span>
              </div>
              <div className="p-2.5 bg-red-50/70 dark:bg-rose-950/40 border border-jasper/30 dark:border-rose-900/60 rounded-xl text-center">
                <span className="block font-playfair font-black text-xl text-jasper dark:text-rose-400 leading-tight">
                  {bookmarks.length}
                </span>
                <span className="text-[11px] font-bold text-gray-600 dark:text-slate-400 font-newsreader">
                  Bài đã lưu
                </span>
              </div>
            </div>
          </div>

          {/* Academic Info: School (Cerulean) & Role (Jasper) */}
          <div className="p-3.5 bg-gray-50/70 dark:bg-slate-900/50 rounded-xl border border-gray-200/80 dark:border-slate-800/80 space-y-2 text-xs md:text-sm font-newsreader">
            <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
              <svg className="w-4 h-4 text-cerulean dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="flex-1 truncate">
                <span className="font-bold block text-gray-900 dark:text-slate-100">Đơn vị:</span>
                <span className="text-gray-600 dark:text-slate-400">{school}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
              <svg className="w-4 h-4 text-jasper dark:text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="flex-1 truncate">
                <span className="font-bold block text-gray-900 dark:text-slate-100">Vai trò:</span>
                <span className="text-gray-600 dark:text-slate-400">
                  {role} {grade ? `• ${grade}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Math Interests: Alternating Cerulean & Jasper Tags */}
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block mb-2 font-playfair uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Lĩnh vực toán yêu thích
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((topic, i) => {
                const isEven = i % 2 === 0;
                return (
                  <span
                    key={i}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-newsreader font-semibold border ${
                      isEven
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 text-cerulean dark:text-blue-300 border-cerulean/30 dark:border-blue-900/60'
                        : 'bg-red-50/70 dark:bg-rose-950/40 text-jasper dark:text-rose-300 border-jasper/30 dark:border-rose-900/60'
                    }`}
                  >
                    {topic}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Academic Quote / Bio with clean flat styling */}
          <div className="border-l-3 border-cerulean dark:border-blue-400 pl-3 py-2 bg-blue-50/30 dark:bg-blue-950/20 rounded-r-lg">
            <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 font-newsreader italic leading-relaxed">
              <span className="text-jasper dark:text-rose-400 font-serif font-black mr-0.5 text-base">“</span>
              {bio}
              <span className="text-cerulean dark:text-blue-400 font-serif font-black ml-0.5 text-base">”</span>
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
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 transition"
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
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-ink dark:hover:text-white transition"
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
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 transition"
                  title="Website / Blog"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Edit Profile Button with solid Cerulean styling */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-cerulean dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-cerulean hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-cerulean dark:text-blue-300 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer font-newsreader shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Chỉnh Sửa Hồ Sơ</span>
          </button>
        </div>

        {/* Right Column: 4 Dynamic Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs Header Navigation */}
          <div className="bg-paperDark dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="flex items-center gap-1.5 p-1.5 overflow-x-auto custom-scrollbar font-newsreader text-sm">
              <button
                type="button"
                onClick={() => setActiveTab('solutions')}
                className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'solutions'
                    ? 'bg-cerulean text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-paper dark:hover:bg-nightInput hover:text-ink dark:hover:text-slate-100 font-semibold'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Lời Giải Của Tôi ({solvedItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bookmarks')}
                className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'bookmarks'
                    ? 'bg-jasper text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-paper dark:hover:bg-nightInput hover:text-ink dark:hover:text-slate-100 font-semibold'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Đã Lưu ({bookmarks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-cerulean text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-paper dark:hover:bg-nightInput hover:text-ink dark:hover:text-slate-100 font-semibold'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Thống Kê &amp; Năng Lực</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-jasper text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-paper dark:hover:bg-nightInput hover:text-ink dark:hover:text-slate-100 font-semibold'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Cài Đặt &amp; Xuất File</span>
              </button>
            </div>
          </div>

          {/* TAB 1: LỜI GIẢI CỦA TÔI */}
          {activeTab === 'solutions' && (
            <div className="space-y-4">
              {/* Search & Filter bar */}
              <div className="bg-white dark:bg-nightCard p-3 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-2.5 items-center font-newsreader">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={solSearch}
                    onChange={(e) => setSolSearch(e.target.value)}
                    placeholder="Tìm theo mã bài, nội dung đề hoặc bài làm..."
                    className="w-full pl-8 pr-3 py-2 bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean placeholder-gray-400 dark:placeholder-slate-500 font-newsreader"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Dropdown chuyên mục chuẩn hóa */}
                <SelectDropdown
                  value={solCatFilter}
                  onChange={setSolCatFilter}
                  options={categoryOptions}
                  allOptionLabel="Tất cả chuyên mục"
                  placeholder="Lọc chuyên mục..."
                  accentColor="cerulean"
                  className="w-48 sm:w-56 shrink-0"
                />

                <div className="text-xs text-gray-500 dark:text-slate-400 ml-auto font-medium font-newsreader">
                  {filteredSolvedItems.length} / {solvedItems.length} bài đã giải
                </div>
              </div>

              {/* Solutions List */}
              {filteredSolvedItems.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-nightCard border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl font-newsreader">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-cerulean/30 dark:border-blue-900 flex items-center justify-center text-cerulean dark:text-blue-400 mx-auto mb-3 shadow-2xs">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-playfair mb-1">
                    {solvedItems.length === 0 ? 'Bạn chưa nộp lời giải cho bài toán nào' : 'Không tìm thấy bài giải phù hợp'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-newsreader max-w-md mx-auto mb-4">
                    {solvedItems.length === 0
                      ? 'Hãy thử sức với các bài toán trên Tạp chí Pi và gửi lời giải của bạn để lưu lại vào đây!'
                      : 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc chuyên mục.'}
                  </p>
                  {solvedItems.length === 0 && (
                    <button
                      type="button"
                      onClick={onBackToList}
                      className="px-5 py-2 bg-cerulean text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition font-newsreader cursor-pointer shadow-2xs"
                    >
                      Khám phá đề toán ngay
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-h-[65vh] overflow-y-auto pr-1.5 space-y-3 font-newsreader custom-scrollbar">
                  {filteredSolvedItems.map(({ problem, solution, issueName, categoryName }) => (
                    <div
                      key={problem.id}
                      className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:shadow-md transition space-y-3"
                    >
                      {/* Card Header with Cerulean Code & Jasper Category */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-cerulean text-white font-mono font-black text-xs rounded border border-blue-900 shadow-2xs">
                            {problem.code || 'BÀI TOÁN'}
                          </span>
                          <span className="text-xs font-bold text-jasper dark:text-rose-400 uppercase tracking-wider">
                            {categoryName}
                          </span>
                          <span className="text-gray-300 dark:text-slate-600 select-none">•</span>
                          <span className="text-xs font-bold text-cerulean dark:text-blue-400 uppercase tracking-wider">
                            {issueName}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 font-newsreader text-xs md:text-sm">
                          <button
                            type="button"
                            onClick={() => onOpenDetail(problem)}
                            className="px-3 py-1 rounded-md border border-cerulean dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-cerulean dark:text-blue-400 font-bold transition cursor-pointer"
                          >
                            Xem đề
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenSolution(problem)}
                            className="px-3 py-1 rounded-md bg-cerulean text-white font-bold hover:bg-blue-800 transition cursor-pointer shadow-2xs"
                          >
                            Sửa lời giải
                          </button>
                        </div>
                      </div>

                      {/* Solution preview */}
                      <div className="p-3 bg-gray-50/70 dark:bg-slate-900/60 rounded-lg border border-gray-100 dark:border-slate-800/80 text-sm md:text-base font-newsreader">
                        <div className="text-xs uppercase tracking-wider font-bold text-cerulean dark:text-blue-400 mb-1 flex items-center gap-1 font-newsreader">
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
              <div className="bg-white dark:bg-nightCard p-3 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-2.5 items-center font-newsreader">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={bmSearch}
                    onChange={(e) => setBmSearch(e.target.value)}
                    placeholder="Tìm kiếm bài toán đã lưu..."
                    className="w-full pl-8 pr-3 py-2 bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-jasper placeholder-gray-400 dark:placeholder-slate-500 font-newsreader"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Dropdown chuyên mục chuẩn hóa với accent Jasper */}
                <SelectDropdown
                  value={bmCatFilter}
                  onChange={setBmCatFilter}
                  options={categoryOptions}
                  allOptionLabel="Tất cả chuyên mục"
                  placeholder="Lọc chuyên mục..."
                  accentColor="jasper"
                  className="w-48 sm:w-56 shrink-0"
                />

                <div className="text-xs text-gray-500 dark:text-slate-400 ml-auto font-medium font-newsreader">
                  {filteredBookmarks.length} / {bookmarkedProblems.length} bài đã lưu
                </div>
              </div>

              {filteredBookmarks.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-nightCard border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl font-newsreader">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-rose-950/60 border border-jasper/30 dark:border-rose-900 flex items-center justify-center text-jasper dark:text-rose-400 mx-auto mb-3 shadow-2xs">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-playfair mb-1">
                    {bookmarkedProblems.length === 0 ? 'Bạn chưa lưu bài toán nào' : 'Không tìm thấy bài đã lưu phù hợp'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-newsreader max-w-md mx-auto mb-4">
                    {bookmarkedProblems.length === 0
                      ? 'Khi xem các bài toán trên Tạp chí Pi, bạn có thể bấm nút "Lưu bài" để lưu lại ôn tập sau này!'
                      : 'Thử kiểm tra lại từ khóa tìm kiếm hoặc chuyên mục đã chọn.'}
                  </p>
                  {bookmarkedProblems.length === 0 && (
                    <button
                      type="button"
                      onClick={onBackToList}
                      className="px-5 py-2 bg-jasper text-white rounded-lg text-sm font-bold hover:bg-red-800 transition font-newsreader cursor-pointer shadow-2xs"
                    >
                      Duyệt danh sách bài toán
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-h-[65vh] overflow-y-auto pr-1.5 space-y-3 font-newsreader custom-scrollbar">
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-cerulean text-white font-mono font-black text-xs rounded border border-blue-900 shadow-2xs">
                              {problem.code || 'BÀI TOÁN'}
                            </span>
                            <span className="text-xs font-bold text-jasper dark:text-rose-400 uppercase tracking-wider">
                              {categoryName}
                            </span>
                            <span className="text-gray-300 dark:text-slate-600 select-none">•</span>
                            <span className="text-xs font-bold text-cerulean dark:text-blue-400 uppercase tracking-wider">
                              {issueName}
                            </span>
                            {isSolved ? (
                              <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-300 text-xs font-bold rounded-full border border-cerulean/30 font-newsreader flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Đã giải</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-300 text-xs font-bold rounded-full border border-jasper/30 font-newsreader">
                                Chưa giải
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 font-newsreader text-xs md:text-sm">
                            <button
                              type="button"
                              onClick={() => toggleBookmark(problem.id)}
                              className="px-3 py-1 rounded-md text-jasper dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 font-bold transition cursor-pointer flex items-center gap-1 border border-transparent hover:border-jasper/30"
                              title="Bỏ lưu bài toán"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              <span>Bỏ lưu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenDetail(problem)}
                              className="px-3.5 py-1 bg-cerulean text-white rounded-md font-bold hover:bg-blue-800 transition cursor-pointer shadow-2xs"
                            >
                              Vào giải bài
                            </button>
                          </div>
                        </div>

                        {/* Problem Snippet */}
                        <div className="line-clamp-2 text-sm md:text-base text-gray-800 dark:text-slate-200 font-newsreader">
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
            <div className="space-y-5 font-newsreader">
              {/* Top 4 Stat Cards: Sử dụng 2 màu chủ đạo Cerulean & Jasper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 border-t-4 border-t-cerulean rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-3xl font-black text-cerulean dark:text-blue-400 block font-playfair">
                    {solvedItems.length}
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-slate-400 font-bold font-newsreader">
                    Bài toán đã giải
                  </span>
                </div>

                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 border-t-4 border-t-jasper rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-3xl font-black text-jasper dark:text-rose-400 block font-playfair">
                    {bookmarks.length}
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-slate-400 font-bold font-newsreader">
                    Bài toán đã lưu
                  </span>
                </div>

                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 border-t-4 border-t-cerulean rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-3xl font-black text-cerulean dark:text-blue-400 block font-playfair">
                    {problems.length > 0 ? Math.round((solvedItems.length / problems.length) * 100) : 0}%
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-slate-400 font-bold font-newsreader">
                    Tỉ lệ hoàn thành kho đề
                  </span>
                </div>

                <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 border-t-4 border-t-jasper rounded-xl p-4 shadow-2xs text-center">
                  <span className="text-3xl font-black text-jasper dark:text-rose-400 block font-playfair">
                    {rank.tier}/4
                  </span>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-slate-400 font-bold truncate block font-newsreader" title={rank.title}>
                    {rank.title}
                  </span>
                </div>
              </div>

              {/* Next Rank Progression Bar */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2 font-newsreader">
                <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
                  <span className="text-gray-700 dark:text-slate-300">
                    Tiến trình lên cấp bậc: <strong className="text-cerulean dark:text-blue-400 font-bold">{rank.nextRank?.title || 'Tối đa'}</strong>
                  </span>
                  <span className="text-gray-500 dark:text-slate-400 font-medium">
                    {rank.nextRank ? `Cần thêm ${rank.neededForNext} bài nữa` : 'Đã đạt danh hiệu cao nhất!'}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                  <div
                    className="h-full bg-cerulean dark:bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${rank.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Chuỗi Ngày Rèn Luyện (Streak Tracker) */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4 font-newsreader">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-400 border border-jasper/30 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.173 1.559-1.874 2.257-.905.903-1.847 1.846-2.316 3.018-.46 1.15-.46 2.378-.052 3.518.397 1.11 1.18 2.052 2.122 2.684.945.635 2.062.98 3.197.98 1.135 0 2.252-.345 3.197-.98.942-.632 1.725-1.574 2.122-2.684.408-1.14.408-2.368-.052-3.518-.469-1.172-1.411-2.115-2.316-3.018-.701-.698-1.347-1.437-1.874-2.257a3.834 3.834 0 01-.291-.492zM10 14a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 font-playfair leading-tight">
                        Chuỗi Ngày Rèn Luyện (Streak)
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Duy trì thói quen học tập và rèn luyện toán học đều đặn
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
                      Kỷ lục: <strong className="text-ink dark:text-slate-100 font-bold">{userProfile?.streak?.longest || 1} ngày</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                  {/* Left: Current count */}
                  <div className="sm:col-span-4 flex items-baseline gap-2 bg-red-50/50 dark:bg-rose-950/20 p-3.5 rounded-xl border border-jasper/20">
                    <span className="text-4xl font-black text-jasper dark:text-rose-400 font-playfair">
                      {userProfile?.streak?.current || 1}
                    </span>
                    <div className="leading-tight">
                      <span className="text-sm font-bold text-jasper dark:text-rose-300 block">Ngày liên tiếp</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">Mục tiêu: Đạt 7 ngày</span>
                    </div>
                  </div>

                  {/* Right: 7-day visual week calendar */}
                  <div className="sm:col-span-8 flex justify-between items-center gap-1.5 p-2 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-200 dark:border-slate-800">
                    {weekDayTracker.map((day) => (
                      <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[11px] font-bold ${day.isToday ? 'text-cerulean dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}>
                          {day.label}
                        </span>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                            day.isActive
                              ? 'bg-jasper text-white shadow-xs'
                              : day.isToday
                              ? 'bg-white dark:bg-slate-800 border-2 border-cerulean text-cerulean dark:text-blue-400'
                              : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500'
                          }`}
                          title={`${day.label}: ${day.isActive ? 'Đã hoạt động' : day.isToday ? 'Hôm nay' : 'Chưa điểm danh'}`}
                        >
                          {day.isActive ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-mono">{day.isToday ? '•' : ''}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Breakdown by Difficulty */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 font-newsreader">
                <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2 font-playfair">
                  <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Phân Bố Độ Khó Các Bài Đã Giải</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {Object.entries(difficultyStats).map(([key, stat]) => {
                    const isHard = key === 'hard';
                    const colorText = isHard ? 'text-jasper dark:text-rose-400' : 'text-cerulean dark:text-blue-400';
                    const barBg = isHard ? 'bg-jasper dark:bg-rose-500' : 'bg-cerulean dark:bg-blue-400';

                    return (
                      <div key={key} className="p-3.5 bg-gray-50/70 dark:bg-slate-900/50 rounded-lg border border-gray-200/80 dark:border-slate-800/80 space-y-2">
                        <div className="flex justify-between text-xs md:text-sm font-semibold">
                          <span className="text-gray-700 dark:text-slate-300 font-medium">{stat.name}</span>
                          <span className={`${colorText} font-bold`}>
                            {stat.count}/{stat.total} ({stat.percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barBg} rounded-full transition-all duration-300`}
                            style={{ width: `${stat.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Breakdown by Category */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 font-newsreader">
                <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2 font-playfair">
                  <svg className="w-4 h-4 text-jasper dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16h16L4 4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13h4L8 9v4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h2.5M4 10h3.5M4 16h2.5" />
                  </svg>
                  <span>Thế Mạnh Theo Chuyên Mục Toán</span>
                </h4>
                <div className="space-y-3 pt-1">
                  {categoryStats.map((cat, idx) => {
                    const isEven = idx % 2 === 0;
                    const barColor = isEven ? 'bg-cerulean dark:bg-blue-400' : 'bg-jasper dark:bg-rose-500';
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="font-semibold text-gray-800 dark:text-slate-200">{cat.name}</span>
                          <span className="text-gray-500 dark:text-slate-400 font-medium">
                            {cat.solved}/{cat.total} bài ({cat.percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-300`}
                            style={{ width: `${cat.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thử Thách Hoàn Thành Kỳ Báo */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4 font-newsreader">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 border border-cerulean/30 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 font-playfair leading-tight">
                        Thử Thách Hoàn Thành Kỳ Báo
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Chinh phục toàn bộ các bài toán trong từng số phát hành
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-cerulean dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-cerulean/20 px-2.5 py-0.5 rounded-full font-bold">
                    {issueChallenges.filter((c) => c.isCompleted).length} / {issueChallenges.length} kỳ hoàn tất
                  </span>
                </div>

                {issueChallenges.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400 dark:text-slate-500 italic">
                    Chưa có số phát hành nào trong hệ thống.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {issueChallenges.map((challenge) => {
                      return (
                        <div
                          key={challenge.issueId}
                          className={`p-3.5 rounded-xl border transition-all ${
                            challenge.isCompleted
                              ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                              : 'bg-gray-50/70 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h5 className="font-bold text-sm text-gray-900 dark:text-slate-100 font-playfair leading-snug">
                                {challenge.name}
                              </h5>
                              <span className="text-xs text-gray-500 dark:text-slate-400">
                                Đã giải {challenge.solvedCount} / {challenge.totalCount} bài ({challenge.percent}%)
                              </span>
                            </div>

                            {challenge.isCompleted ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[11px] font-bold rounded-full shrink-0">
                                <svg className="w-3 h-3 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>100% Hoàn thành</span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400 font-bold px-2 py-0.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shrink-0">
                                {challenge.percent}%
                              </span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                challenge.isCompleted ? 'bg-amber-500' : 'bg-cerulean dark:bg-blue-400'
                              }`}
                              style={{ width: `${challenge.percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bảng Vinh Danh Học Thuật (Hall of Fame) */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4 font-newsreader">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/60 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-slate-100 font-playfair leading-tight">
                        Bảng Vinh Danh Học Thuật
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Cộng đồng độc giả và các nhà toán học trẻ xuất sắc
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-gray-500 dark:text-slate-400 italic">
                    Cập nhật theo chu kỳ hàng ngày
                  </span>
                </div>

                {/* Leaderboard Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-newsreader">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-2.5 px-3 w-14">Hạng</th>
                        <th className="py-2.5 px-3">Học Giả</th>
                        <th className="py-2.5 px-3 text-center">Đã Giải</th>
                        <th className="py-2.5 px-3 text-right">Chuỗi Học</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                      {leaderboard.map((scholar) => {
                        const isTop1 = scholar.rank === 1;
                        const isTop2 = scholar.rank === 2;
                        const isTop3 = scholar.rank === 3;

                        return (
                          <tr
                            key={scholar.id}
                            className={`transition-colors ${
                              scholar.isUser
                                ? 'bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                                : 'hover:bg-gray-50/60 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            {/* Rank Column */}
                            <td className="py-2.5 px-3">
                              {isTop1 ? (
                                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 font-bold flex items-center justify-center text-xs">
                                  1
                                </span>
                              ) : isTop2 ? (
                                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-300 font-bold flex items-center justify-center text-xs">
                                  2
                                </span>
                              ) : isTop3 ? (
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-900 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 font-bold flex items-center justify-center text-xs">
                                  3
                                </span>
                              ) : (
                                <span className="w-6 h-6 rounded-full text-gray-500 dark:text-slate-400 font-mono text-xs flex items-center justify-center">
                                  {scholar.rank}
                                </span>
                              )}
                            </td>

                            {/* Scholar Info */}
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 dark:text-slate-100">
                                  {scholar.name}
                                </span>
                                {scholar.isUser && (
                                  <span className="text-[10px] bg-cerulean text-white font-bold px-1.5 py-0.2 rounded-full font-mono">
                                    Bạn
                                  </span>
                                )}
                                <span className="text-xs text-gray-500 dark:text-slate-400 hidden sm:inline">
                                  ({scholar.role})
                                </span>
                              </div>
                            </td>

                            {/* Solved Count */}
                            <td className="py-2.5 px-3 text-center">
                              <span className="font-bold text-cerulean dark:text-blue-400">
                                {scholar.solvedCount}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-slate-400 ml-1">bài</span>
                            </td>

                            {/* Streak */}
                            <td className="py-2.5 px-3 text-right">
                              <span className="inline-flex items-center gap-1 text-jasper dark:text-rose-400 font-bold text-xs">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.173 1.559-1.874 2.257-.905.903-1.847 1.846-2.316 3.018-.46 1.15-.46 2.378-.052 3.518.397 1.11 1.18 2.052 2.122 2.684.945.635 2.062.98 3.197.98 1.135 0 2.252-.345 3.197-.98.942-.632 1.725-1.574 2.122-2.684.408-1.14.408-2.368-.052-3.518-.469-1.172-1.411-2.115-2.316-3.018-.701-.698-1.347-1.437-1.874-2.257a3.834 3.834 0 01-.291-.492zM10 14a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{scholar.streak} ngày</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CÀI ĐẶT & XUẤT FILE */}
          {activeTab === 'settings' && (
            <div className="space-y-5 font-newsreader">
              {/* Gemini AI API Key Setting */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3 font-newsreader">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-cerulean/30 dark:border-blue-900 flex items-center justify-center text-cerulean dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 font-playfair">
                      Cấu hình Google Gemini AI API Key
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                      Dùng để hỗ trợ phân tích đề, gợi ý giải toán và tra cứu thông minh
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveGeminiKey} className="space-y-3 pt-2 font-newsreader">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">
                      Gemini API Key của bạn (Lưu an toàn tại trình duyệt)
                    </label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full pl-3 pr-12 py-2 bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cerulean"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-cerulean text-xs font-bold cursor-pointer"
                      >
                        {showKey ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                      Trạng thái: {geminiKey ? <span className="text-cerulean dark:text-blue-400 font-bold">✓ Đã thiết lập</span> : <span className="text-jasper dark:text-rose-400 font-bold">Chưa cấu hình</span>}
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-cerulean hover:bg-blue-800 text-white rounded-lg text-sm font-bold transition shadow-2xs cursor-pointer font-newsreader"
                    >
                      Lưu Khóa API
                    </button>
                  </div>
                </form>
              </div>

              {/* Data Export Box */}
              <div className="bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4 font-newsreader">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-rose-950/60 border border-jasper/30 dark:border-rose-900 flex items-center justify-center text-jasper dark:text-rose-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 font-playfair">
                      Xuất Tài Liệu & Kho Bài Giải Cá Nhân
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                      Tải về toàn bộ bài giải của bạn để in ấn, nộp báo cáo hoặc lưu trữ ngoại tuyến
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Export LaTeX - Cerulean Accent */}
                  <div className="p-4 bg-paper dark:bg-nightInput rounded-xl border border-gray-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-slate-100 flex items-center gap-1.5 mb-1.5 font-playfair">
                        <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Mã nguồn LaTeX (.tex)</span>
                      </span>
                      <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-newsreader">
                        Sinh file .tex đầy đủ preamble tiếng Việt, gói amsmath và tikz, sẵn sàng biên dịch trực tiếp bằng TeXLive hoặc Overleaf.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportLatex}
                      className="w-full py-2.5 bg-cerulean hover:bg-blue-800 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs font-newsreader"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Tải Tập Bài Giải (.tex)</span>
                    </button>
                  </div>

                  {/* Export Markdown - Jasper Accent */}
                  <div className="p-4 bg-paper dark:bg-nightInput rounded-xl border border-gray-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-slate-100 flex items-center gap-1.5 mb-1.5 font-playfair">
                        <svg className="w-4 h-4 text-jasper dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Tài liệu Markdown (.md)</span>
                      </span>
                      <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-newsreader">
                        Định dạng văn bản Markdown chuẩn quốc tế với công thức KaTeX, tương thích với Obsidian, Notion và GitHub.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportMarkdown}
                      className="w-full py-2.5 bg-jasper hover:bg-red-800 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs font-newsreader"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
