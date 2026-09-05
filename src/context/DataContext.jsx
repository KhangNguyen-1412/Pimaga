import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc 
} from 'firebase/firestore';
import { db, sysAppId } from '../config/firebase';
import { cache } from '../utils/cache';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { calculateStreak } from '../utils/profileUtils';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUserId, isRealUser } = useAuth();
  const { showToast } = useToast();

  // Instant 0ms cache hydration
  const initialIssues = useMemo(() => cache.get('issues') || [], []);
  const initialCategories = useMemo(() => cache.get('categories') || [], []);
  const initialProblems = useMemo(() => cache.get('problems') || [], []);
  const initialSolutions = useMemo(() => cache.get('solutions') || {}, []);

  const [issues, setIssues] = useState(initialIssues);
  const [categories, setCategories] = useState(initialCategories);
  const [problems, setProblems] = useState(initialProblems);
  const [userSolutionsMap, setUserSolutionsMap] = useState(initialSolutions);
  const [userProfile, setUserProfile] = useState(() => cache.get(`profile_${currentUserId}`) || {});
  const [isDataLoaded, setIsDataLoaded] = useState(initialProblems.length > 0);

  const [filterIssue, setFilterIssue] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Bộ lọc nâng cao & Tìm kiếm đa tiêu chí
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterProvince, setFilterProvince] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // 1. Subscribe to Public Collections
  useEffect(() => {
    // Issues
    const unsubIssues = onSnapshot(
      collection(db, 'artifacts', sysAppId, 'public', 'data', 'issues'),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setIssues(data);
        cache.set('issues', data);
      },
      (err) => console.error("Issues listener error:", err)
    );

    // Categories
    const unsubCategories = onSnapshot(
      collection(db, 'artifacts', sysAppId, 'public', 'data', 'categories'),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCategories(data);
        cache.set('categories', data);
      },
      (err) => console.error("Categories listener error:", err)
    );

    // Problems
    const unsubProblems = onSnapshot(
      collection(db, 'artifacts', sysAppId, 'public', 'data', 'problems'),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProblems(data);
        setIsDataLoaded(true);
        cache.set('problems', data);
      },
      (err) => console.error("Problems listener error:", err)
    );

    return () => {
      unsubIssues();
      unsubCategories();
      unsubProblems();
    };
  }, []);

  // 2. Subscribe to User Solutions and Profile when currentUserId changes
  useEffect(() => {
    if (!isRealUser || !currentUserId) {
      setUserSolutionsMap({});
      setUserProfile({});
      return;
    }

    // Hydrate cached user solutions & profile
    const cachedUserSols = cache.get(`solutions_${currentUserId}`) || cache.get('solutions');
    if (cachedUserSols && typeof cachedUserSols === 'object') {
      setUserSolutionsMap(cachedUserSols);
    }
    const cachedProfile = cache.get(`profile_${currentUserId}`);
    if (cachedProfile && typeof cachedProfile === 'object') {
      setUserProfile(cachedProfile);
    }

    const unsubSolutions = onSnapshot(
      collection(db, 'artifacts', sysAppId, 'users', currentUserId, 'solutions'),
      (snap) => {
        const map = {};
        snap.docs.forEach((d) => {
          map[d.id] = d.data().content;
        });
        setUserSolutionsMap(map);
        cache.set(`solutions_${currentUserId}`, map);
        cache.set('solutions', map);
      },
      (err) => console.warn("Solutions listener note:", err?.message || err)
    );

    const unsubProfile = onSnapshot(
      doc(db, 'artifacts', sysAppId, 'users', currentUserId, 'profile', 'info'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile(data);
          cache.set(`profile_${currentUserId}`, data);
        } else {
          // Initialize default empty profile if none exists
          setUserProfile((prev) => prev || {});
        }
      },
      (err) => console.warn("Profile listener note:", err?.message || err)
    );

    return () => {
      unsubSolutions();
      unsubProfile();
    };
  }, [currentUserId, isRealUser]);

  // Problem count maps for fast badges
  const problemCounts = useMemo(() => {
    const issueCounts = {};
    const catCounts = {};
    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      if (p.issueId) issueCounts[p.issueId] = (issueCounts[p.issueId] || 0) + 1;
      if (p.categoryId) catCounts[p.categoryId] = (catCounts[p.categoryId] || 0) + 1;
    }
    return { issueCounts, catCounts };
  }, [problems]);

  // Operations (CRUD)
  const addIssue = useCallback(async ({ num, month, year }) => {
    if (!num) throw new Error('Vui lòng nhập số phát hành (ví dụ: 1)');
    if (!year || isNaN(year) || year < 1900 || year > 2100) throw new Error('Vui lòng nhập năm phát hành hợp lệ');
    if (!currentUserId) throw new Error('Vui lòng đăng nhập để thực hiện thêm số phát hành!');

    const cleanNum = num.toLowerCase().startsWith('số') ? num : `Số ${num}`;
    const name = `${cleanNum} - Tháng ${month}/${year}`;

    if (issues.some((i) => i.name && i.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`Số phát hành "${name}" đã tồn tại!`);
    }

    const payload = {
      name,
      issueNumber: num,
      month,
      year,
      createdAt: Date.now()
    };
    await addDoc(collection(db, 'artifacts', sysAppId, 'public', 'data', 'issues'), payload);
    showToast(`Đã thêm ${name}`, 'success');
  }, [currentUserId, issues, showToast]);

  const deleteIssue = useCallback(async (id) => {
    if (!currentUserId) {
      showToast('Vui lòng đăng nhập để thực hiện xóa', 'error');
      return;
    }
    try {
      await deleteDoc(doc(db, 'artifacts', sysAppId, 'public', 'data', 'issues', id));
      showToast('Đã xóa số phát hành', 'success');
    } catch (e) {
      showToast('Lỗi xóa: ' + e.message, 'error');
    }
  }, [currentUserId, showToast]);

  const addCategory = useCallback(async (name) => {
    if (!name || !name.trim()) throw new Error('Vui lòng nhập tên Chuyên mục');
    if (!currentUserId) throw new Error('Vui lòng đăng nhập để thêm chuyên mục!');

    await addDoc(collection(db, 'artifacts', sysAppId, 'public', 'data', 'categories'), {
      name: name.trim(),
      createdAt: Date.now()
    });
    showToast('Đã thêm Chuyên mục mới', 'success');
  }, [currentUserId, showToast]);

  const deleteCategory = useCallback(async (id) => {
    if (!currentUserId) {
      showToast('Vui lòng đăng nhập để thực hiện xóa', 'error');
      return;
    }
    try {
      await deleteDoc(doc(db, 'artifacts', sysAppId, 'public', 'data', 'categories', id));
      showToast('Đã xóa chuyên mục', 'success');
    } catch (e) {
      showToast('Lỗi xóa: ' + e.message, 'error');
    }
  }, [currentUserId, showToast]);

  const saveProblem = useCallback(async ({ id, code, difficulty, author, province, content, editorialSolution, issueId, categoryId }) => {
    if (!currentUserId) throw new Error('Vui lòng đăng nhập để thực hiện lưu đề bài!');
    if (!code) throw new Error('Vui lòng nhập số thứ tự bài theo định dạng P + số (ví dụ: 1 cho P1)!');
    if (!issueId) throw new Error('Vui lòng chọn Số phát hành cho bài toán!');
    if (!categoryId) throw new Error('Vui lòng chọn Chuyên mục cho bài toán!');
    if (!content || !content.trim()) throw new Error('Vui lòng nhập nội dung đề bài!');

    const formattedCode = code.startsWith('P') || code.startsWith('p') ? code.toUpperCase() : `P${code}`;
    const title = `Bài ${formattedCode}`;
    const payload = {
      code: formattedCode,
      difficulty: parseInt(difficulty, 10) || 2,
      title,
      author: author ? author.trim() : '',
      province: province ? province.trim() : '',
      content: content.trim(),
      editorialSolution: editorialSolution ? editorialSolution.trim() : '',
      issueId,
      categoryId,
      updatedAt: Date.now()
    };

    if (id) {
      await updateDoc(doc(db, 'artifacts', sysAppId, 'public', 'data', 'problems', id), payload);
      showToast('Cập nhật Đề bài thành công', 'success');
    } else {
      payload.createdAt = Date.now();
      await addDoc(collection(db, 'artifacts', sysAppId, 'public', 'data', 'problems'), payload);
      showToast('Đã thêm Đề bài mới', 'success');
    }
  }, [currentUserId, showToast]);

  const deleteProblem = useCallback(async (id) => {
    if (!currentUserId) {
      showToast('Vui lòng đăng nhập để thực hiện xóa', 'error');
      return;
    }
    try {
      await deleteDoc(doc(db, 'artifacts', sysAppId, 'public', 'data', 'problems', id));
      showToast('Đã xóa bài toán', 'success');
    } catch (e) {
      showToast('Lỗi xóa bài: ' + e.message, 'error');
    }
  }, [currentUserId, showToast]);

  // Danh sách Tỉnh thành trích xuất từ dữ liệu bài toán
  const availableProvinces = useMemo(() => {
    const set = new Set();
    problems.forEach((p) => {
      if (p.province && p.province.trim()) {
        set.add(p.province.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [problems]);

  // Số lượng bộ lọc nâng cao đang kích hoạt
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterSearch.trim()) count++;
    if (filterDifficulty && filterDifficulty !== 'all') count++;
    if (filterProvince && filterProvince !== 'all') count++;
    if (filterStatus && filterStatus !== 'all') count++;
    return count;
  }, [filterSearch, filterDifficulty, filterProvince, filterStatus]);

  // Đặt lại toàn bộ bộ lọc
  const resetFilters = useCallback(() => {
    setFilterSearch('');
    setFilterDifficulty('all');
    setFilterProvince('all');
    setFilterStatus('all');
    setFilterIssue('');
    setFilterCategory('');
  }, []);

  // Cập nhật và lưu chuỗi học tập (Streak)
  const recordActivityStreak = useCallback(async () => {
    if (!currentUserId) return;
    const today = new Date().toISOString().slice(0, 10);
    const currentStreakObj = userProfile?.streak || { current: 1, longest: 1, lastActiveDate: today };
    const nextStreak = calculateStreak(currentStreakObj, today);

    if (
      nextStreak.current !== currentStreakObj.current ||
      nextStreak.longest !== currentStreakObj.longest ||
      nextStreak.lastActiveDate !== currentStreakObj.lastActiveDate
    ) {
      const updated = {
        ...userProfile,
        streak: nextStreak,
        updatedAt: Date.now(),
      };
      setUserProfile(updated);
      cache.set(`profile_${currentUserId}`, updated);
      try {
        await setDoc(
          doc(db, 'artifacts', sysAppId, 'users', currentUserId, 'profile', 'info'),
          { streak: nextStreak, updatedAt: Date.now() },
          { merge: true }
        );
      } catch (err) {
        console.warn('Streak sync note:', err);
      }
    }
  }, [currentUserId, userProfile]);

  useEffect(() => {
    if (isRealUser && currentUserId) {
      recordActivityStreak();
    }
  }, [isRealUser, currentUserId]);

  const saveUserSolution = useCallback(async (probId, content) => {
    if (!currentUserId) throw new Error('Vui lòng đăng nhập để lưu bài làm!');
    if (!content || !content.trim()) throw new Error('Vui lòng nhập nội dung bài làm trước khi lưu!');
    if (!probId) return;

    await setDoc(doc(db, 'artifacts', sysAppId, 'users', currentUserId, 'solutions', probId), {
      content: content.trim(),
      updatedAt: Date.now()
    });
    recordActivityStreak();
    showToast('Lưu bài làm thành công', 'success');
  }, [currentUserId, recordActivityStreak, showToast]);

  // Quản lý Hồ sơ người dùng
  const updateUserProfile = useCallback(async (newData) => {
    if (!currentUserId) throw new Error('Vui lòng đăng nhập để cập nhật hồ sơ!');
    
    const updated = {
      ...userProfile,
      ...newData,
      updatedAt: Date.now(),
    };

    setUserProfile(updated);
    cache.set(`profile_${currentUserId}`, updated);

    await setDoc(
      doc(db, 'artifacts', sysAppId, 'users', currentUserId, 'profile', 'info'),
      updated,
      { merge: true }
    );
    showToast('Cập nhật hồ sơ thành công!', 'success');
  }, [currentUserId, userProfile, showToast]);

  // Quản lý Đánh dấu / Lưu bài toán (Bookmarks)
  const bookmarks = useMemo(() => {
    return Array.isArray(userProfile?.bookmarks) ? userProfile.bookmarks : [];
  }, [userProfile?.bookmarks]);

  const toggleBookmark = useCallback(async (probId) => {
    if (!currentUserId) {
      showToast('Vui lòng đăng nhập để lưu bài toán!', 'warning');
      return;
    }
    if (!probId) return;

    const currentBookmarks = Array.isArray(userProfile?.bookmarks) ? [...userProfile.bookmarks] : [];
    const isAlreadyBookmarked = currentBookmarks.includes(probId);

    let nextBookmarks;
    if (isAlreadyBookmarked) {
      nextBookmarks = currentBookmarks.filter((id) => id !== probId);
    } else {
      nextBookmarks = [probId, ...currentBookmarks];
    }

    const updated = {
      ...userProfile,
      bookmarks: nextBookmarks,
      updatedAt: Date.now(),
    };

    setUserProfile(updated);
    cache.set(`profile_${currentUserId}`, updated);

    await setDoc(
      doc(db, 'artifacts', sysAppId, 'users', currentUserId, 'profile', 'info'),
      { bookmarks: nextBookmarks, updatedAt: Date.now() },
      { merge: true }
    );

    recordActivityStreak();

    if (isAlreadyBookmarked) {
      showToast('Đã bỏ lưu bài toán.', 'info');
    } else {
      showToast('Đã lưu bài toán vào hồ sơ cá nhân!', 'success');
    }
  }, [currentUserId, userProfile, recordActivityStreak, showToast]);

  const isBookmarked = useCallback((probId) => {
    return bookmarks.includes(probId);
  }, [bookmarks]);

  return (
    <DataContext.Provider
      value={{
        issues,
        categories,
        problems,
        userSolutionsMap,
        userProfile,
        updateUserProfile,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        isDataLoaded,
        filterIssue,
        setFilterIssue,
        filterCategory,
        setFilterCategory,
        filterSearch,
        setFilterSearch,
        filterDifficulty,
        setFilterDifficulty,
        filterProvince,
        setFilterProvince,
        filterStatus,
        setFilterStatus,
        availableProvinces,
        activeFilterCount,
        resetFilters,
        recordActivityStreak,
        problemCounts,
        addIssue,
        deleteIssue,
        addCategory,
        deleteCategory,
        saveProblem,
        deleteProblem,
        saveUserSolution
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within DataProvider');
  }
  return ctx;
}
