import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import FilterBar from './components/feed/FilterBar';
import ProblemList from './components/feed/ProblemList';
import Footer from './components/feed/Footer';
import SEOHead from './components/common/SEOHead';
import IssueModal from './components/modals/IssueModal';
import CategoryModal from './components/modals/CategoryModal';
import ProblemModal from './components/modals/ProblemModal';
import SolutionModal from './components/modals/SolutionModal';
import LatexCheatsheetModal from './components/modals/LatexCheatsheetModal';
import ProblemDetailPage from './components/detail/ProblemDetailPage';
import ProfilePage from './components/profile/ProfilePage';
import LoginGate from './components/auth/LoginGate';
import LoginPage from './components/auth/LoginPage';
import LandingPage from './components/landing/LandingPage';
import LandingHeader from './components/landing/LandingHeader';
import PiHistoryPage from './components/landing/PiHistoryPage';
import TapChiPiPage from './components/landing/TapChiPiPage';
import FeaturesPage from './components/landing/FeaturesPage';
import ConfirmModal from './components/modals/ConfirmModal';
import GeminiKeyModal from './components/modals/GeminiKeyModal';
import { useData } from './context/DataContext';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { slugify, findIssueBySlug, findCategoryBySlug } from './utils/slugify';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRealUser, loadingAuth, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const {
    issues,
    categories,
    problems,
    userSolutionsMap,
    filterIssue,
    setFilterIssue,
    filterCategory,
    setFilterCategory,
    deleteIssue,
    deleteCategory,
    deleteProblem,
  } = useData();

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [activeSolutionProblem, setActiveSolutionProblem] = useState(null);
  const [isLatexModalOpen, setIsLatexModalOpen] = useState(false);
  const [latexInsertCallback, setLatexInsertCallback] = useState(null);
  const [isGeminiKeyModalOpen, setIsGeminiKeyModalOpen] = useState(false);

  // Active highlighted problem (from /bai-toan/:code)
  const [highlightedProblemId, setHighlightedProblemId] = useState(null);

  // Confirm Modal state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });

  // Page Transition & Navigation Progress Bar state
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    setIsPageTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 520);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 1. Sync URL Route -> App Filters & Modals
  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === '/so-tay-latex') {
      setIsLatexModalOpen(true);
      return;
    }

    if (
      pathname === '/' ||
      pathname === '/gioi-thieu' ||
      pathname === '/about' ||
      pathname === '/landing' ||
      pathname === '/tinh-nang' ||
      pathname === '/lich-su-so-pi' ||
      pathname === '/tap-chi-pi'
    ) {
      setFilterIssue('');
      setFilterCategory('');
      setHighlightedProblemId(null);
      return;
    }

    if (pathname === '/dang-nhap' || pathname === '/login') {
      setFilterIssue('');
      setFilterCategory('');
      setHighlightedProblemId(null);
      return;
    }

    if (pathname === '/kho-de') {
      setFilterIssue('');
      setFilterCategory('');
      setHighlightedProblemId(null);
      return;
    }

    if (pathname === '/ho-so' || pathname === '/profile') {
      setFilterIssue('');
      setFilterCategory('');
      setHighlightedProblemId(null);
      return;
    }

    // Direct problem link: /bai-toan/:code
    const problemMatch = pathname.match(/^\/bai-toan\/([^/]+)/i);
    if (problemMatch && problemMatch[1]) {
      const codeSlug = problemMatch[1].toLowerCase();
      const found = problems.find(
        (p) => (p.code && p.code.toLowerCase().replace(/\s+/g, '') === codeSlug) || p.id === codeSlug
      );
      if (found) {
        setHighlightedProblemId(found.id);
        return;
      }
    } else {
      setHighlightedProblemId(null);
    }

    // Both issue & category: /so/:issueSlug/chuyen-muc/:categorySlug
    const bothMatch = pathname.match(/^\/so\/([^/]+)\/chuyen-muc\/([^/]+)/i);
    if (bothMatch) {
      const iss = findIssueBySlug(issues, bothMatch[1]);
      const cat = findCategoryBySlug(categories, bothMatch[2]);
      if (iss) setFilterIssue(iss.id);
      if (cat) setFilterCategory(cat.id);
      return;
    }

    // Only issue: /so/:issueSlug
    const issueMatch = pathname.match(/^\/so\/([^/]+)/i);
    if (issueMatch) {
      const iss = findIssueBySlug(issues, issueMatch[1]);
      if (iss) setFilterIssue(iss.id);
      setFilterCategory('');
      return;
    }

    // Only category: /chuyen-muc/:categorySlug
    const catMatch = pathname.match(/^\/chuyen-muc\/([^/]+)/i);
    if (catMatch) {
      const cat = findCategoryBySlug(categories, catMatch[1]);
      if (cat) setFilterCategory(cat.id);
      setFilterIssue('');
      return;
    }
  }, [location.pathname, issues, categories, problems, setFilterIssue, setFilterCategory]);

  // Route Protection: Yêu cầu đăng nhập để truy cập kho đề và các trang chức năng
  useEffect(() => {
    if (loadingAuth) return;

    const isPublicLandingHeader =
      location.pathname === '/' ||
      location.pathname === '/gioi-thieu' ||
      location.pathname === '/about' ||
      location.pathname === '/landing' ||
      location.pathname === '/tinh-nang' ||
      location.pathname === '/lich-su-so-pi' ||
      location.pathname === '/tap-chi-pi';
    const isLogin = location.pathname === '/dang-nhap' || location.pathname === '/login';
    const isLatex = location.pathname === '/so-tay-latex';

    if (!isRealUser && !isPublicLandingHeader && !isLogin && !isLatex) {
      showToast('Vui lòng đăng nhập tài khoản để truy cập kho đề.', 'info');
      navigate('/dang-nhap');
    }
  }, [isRealUser, loadingAuth, location.pathname, navigate, showToast]);

  // 2. Sync Filter Changes -> Friendly URL
  const handleSelectIssue = useCallback(
    (newIssueId) => {
      setFilterIssue(newIssueId);
      const targetIssue = issues.find((i) => i.id === newIssueId);
      const targetCat = categories.find((c) => c.id === filterCategory);

      let url = '/kho-de';
      if (targetIssue && targetCat) {
        url = `/so/${slugify(targetIssue.name)}/chuyen-muc/${slugify(targetCat.name)}`;
      } else if (targetIssue) {
        url = `/so/${slugify(targetIssue.name)}`;
      } else if (targetCat) {
        url = `/chuyen-muc/${slugify(targetCat.name)}`;
      }

      navigate(url);
    },
    [issues, categories, filterCategory, navigate, setFilterIssue]
  );

  const handleSelectCategory = useCallback(
    (newCatId) => {
      setFilterCategory(newCatId);
      const targetIssue = issues.find((i) => i.id === filterIssue);
      const targetCat = categories.find((c) => c.id === newCatId);

      let url = '/kho-de';
      if (targetIssue && targetCat) {
        url = `/so/${slugify(targetIssue.name)}/chuyen-muc/${slugify(targetCat.name)}`;
      } else if (targetCat) {
        url = `/chuyen-muc/${slugify(targetCat.name)}`;
      } else if (targetIssue) {
        url = `/so/${slugify(targetIssue.name)}`;
      }

      navigate(url);
    },
    [issues, categories, filterIssue, navigate, setFilterCategory]
  );

  const issueMap = useMemo(() => new Map(issues.map((i) => [i.id, i.name])), [issues]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  // Check if current route is a problem detail page, profile page, landing page, or login page
  const isDetailPage = location.pathname.startsWith('/bai-toan/');
  const isProfilePage = location.pathname === '/ho-so' || location.pathname === '/profile';
  const isLoginPage = location.pathname === '/dang-nhap' || location.pathname === '/login';
  const isPiHistoryPage = location.pathname === '/lich-su-so-pi';
  const isTapChiPiPage = location.pathname === '/tap-chi-pi';
  const isFeaturesPage = location.pathname === '/tinh-nang';
  const isLandingPage =
    location.pathname === '/' ||
    location.pathname === '/gioi-thieu' ||
    location.pathname === '/about' ||
    location.pathname === '/landing';
  const isLandingHeaderPage = isLandingPage || isPiHistoryPage || isTapChiPiPage || isFeaturesPage;

  const activeDetailProblem = useMemo(() => {
    const match = location.pathname.match(/^\/bai-toan\/([^/]+)/i);
    if (!match || !match[1]) return null;
    const codeSlug = match[1].toLowerCase();
    return (
      problems.find(
        (p) => (p.code && p.code.toLowerCase().replace(/\s+/g, '') === codeSlug) || p.id === codeSlug
      ) || null
    );
  }, [location.pathname, problems]);

  const pageKey = useMemo(() => {
    if (isLandingPage) return 'landing';
    if (isFeaturesPage) return 'features';
    if (isPiHistoryPage) return 'pi-history';
    if (isTapChiPiPage) return 'tap-chi-pi';
    if (isProfilePage) return 'profile';
    if (isDetailPage) return `detail-${activeDetailProblem?.id || location.pathname}`;
    if (isLoginPage) return 'login';
    return 'feed';
  }, [
    isLandingPage,
    isFeaturesPage,
    isPiHistoryPage,
    isTapChiPiPage,
    isProfilePage,
    isDetailPage,
    isLoginPage,
    activeDetailProblem?.id,
    location.pathname,
  ]);


  // Contextual previous & next problems in same issue/category
  const { prevProblem, nextProblem } = useMemo(() => {
    if (!activeDetailProblem) return { prevProblem: null, nextProblem: null };

    let contextList = problems;
    if (activeDetailProblem.issueId) {
      contextList = problems.filter((p) => p.issueId === activeDetailProblem.issueId);
    }
    const sorted = [...contextList].sort((a, b) => {
      const numA = parseInt((a.code || '').replace(/^[pP]/i, ''), 10) || 0;
      const numB = parseInt((b.code || '').replace(/^[pP]/i, ''), 10) || 0;
      return numA - numB;
    });

    const idx = sorted.findIndex((p) => p.id === activeDetailProblem.id);
    return {
      prevProblem: idx > 0 ? sorted[idx - 1] : null,
      nextProblem: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
    };
  }, [activeDetailProblem, problems]);

  const handleSelectOtherProblem = useCallback(
    (other) => {
      const codeSlug = (other.code || other.id || '').toLowerCase().replace(/\s+/g, '');
      navigate(`/bai-toan/${codeSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  const handleOpenDetail = useCallback(
    (prob) => {
      const codeSlug = (prob.code || prob.id || '').toLowerCase().replace(/\s+/g, '');
      navigate(`/bai-toan/${codeSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  const handleBackToList = useCallback(() => {
    if (filterIssue && filterCategory) {
      const targetIssue = issues.find((i) => i.id === filterIssue);
      const targetCat = categories.find((c) => c.id === filterCategory);
      if (targetIssue && targetCat) {
        navigate(`/so/${slugify(targetIssue.name)}/chuyen-muc/${slugify(targetCat.name)}`);
        return;
      }
    } else if (filterIssue) {
      const targetIssue = issues.find((i) => i.id === filterIssue);
      if (targetIssue) {
        navigate(`/so/${slugify(targetIssue.name)}`);
        return;
      }
    } else if (filterCategory) {
      const targetCat = categories.find((c) => c.id === filterCategory);
      if (targetCat) {
        navigate(`/chuyen-muc/${slugify(targetCat.name)}`);
        return;
      }
    }
    navigate('/kho-de');
  }, [filterIssue, filterCategory, issues, categories, navigate]);

  // 3. Dynamic SEO Meta Calculation
  const seoData = useMemo(() => {
    if (isLoginPage) {
      return {
        title: 'Đăng Nhập Tài Khoản - Tạp Chí Pi',
        description: 'Cổng đăng nhập và tra cứu chính thức của Tạp chí Pi - Hội Toán học Việt Nam. Đồng bộ bài giải và chuỗi rèn luyện.',
        canonicalPath: '/dang-nhap',
      };
    }

    if (isLandingPage) {
      return {
        title: 'Tạp Chí Pi - Diễn Đàn & Kho Dữ Liệu Toán Học Đỉnh Cao',
        description: 'Khám phá kho tàng đề thi Olympic, chuyên đề Toán học tinh hoa từ Tạp chí Pi - Hội Toán học Việt Nam. Nền tảng tích hợp giải toán KaTeX, hình học TikZ, hệ thống xếp hạng học thuật.',
        canonicalPath: '/gioi-thieu',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'Tạp Chí Pi',
          alternateName: 'Pimaga',
          url: 'https://tapchipi.vn',
          description: 'Tạp chí Pi - Diễn đàn Toán học & Tuổi trẻ do Hội Toán học Việt Nam sáng lập.',
        },
      };
    }

    if (isPiHistoryPage) {
      return {
        title: 'Lịch Sử Hình Thành Của Số Pi - Tạp Chí Pi',
        description: 'Biên niên sử 4.000 năm của số Pi từ Archimedes, Lưu Huy, Tổ Xung Chi đến Euler và Ramanujan.',
        canonicalPath: '/lich-su-so-pi',
      };
    }

    if (isTapChiPiPage) {
      return {
        title: 'Về Tạp Chí Pi - Hội Toán Học Việt Nam',
        description: 'Lịch sử thành lập năm 2017, hội đồng sáng lập và sứ mệnh ươm mầm trí tuệ của Tạp chí Pi.',
        canonicalPath: '/tap-chi-pi',
      };
    }

    if (isFeaturesPage) {
      return {
        title: 'Tính Năng Nổi Bật - Nền Tảng Pimaga',
        description: 'Khám phá 6 tính năng của nền tảng Pimaga: kho đề phân cấp, soạn thảo KaTeX, TikZ SVG, xuất PDF và sổ tay LaTeX.',
        canonicalPath: '/tinh-nang',
      };
    }

    if (isProfilePage) {
      return {
        title: 'Hồ Sơ Học Thuật & Bài Giải Cá Nhân - Tạp Chí Pi',
        description: 'Hồ sơ học thuật, danh sách bài toán đã giải, bài đã lưu và thống kê năng lực toán học cá nhân trên Tạp chí Pi.',
        canonicalPath: '/ho-so',
      };
    }

    const activeProblem = activeDetailProblem || problems.find((p) => p.id === highlightedProblemId);
    if (activeProblem) {
      const title = `Bài ${activeProblem.code || 'Toán'} - Tạp Chí Pi${
        activeProblem.author ? ` | Tác giả: ${activeProblem.author}` : ''
      }`;
      const description = `${activeProblem.content?.slice(0, 160) || 'Đề bài toán chọn lọc kèm lời giải chuyên đề.'}...`;

      return {
        title,
        description,
        canonicalPath: `/bai-toan/${(activeProblem.code || activeProblem.id).toLowerCase().replace(/\s+/g, '')}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: title,
          description,
          author: {
            '@type': 'Person',
            name: activeProblem.author || 'Tạp Chí Pi',
          },
          learningResourceType: 'Math Problem',
          educationalLevel: 'Học sinh giỏi / Olympic',
          inLanguage: 'vi-VN',
        },
      };
    }

    const currentIssue = issues.find((i) => i.id === filterIssue);
    const currentCat = categories.find((c) => c.id === filterCategory);

    if (currentIssue && currentCat) {
      return {
        title: `${currentCat.name} (${currentIssue.name}) - Tạp Chí Pi`,
        description: `Danh sách bài toán chuyên mục ${currentCat.name} trong ${currentIssue.name} của Tạp chí Pi.`,
        canonicalPath: `/so/${slugify(currentIssue.name)}/chuyen-muc/${slugify(currentCat.name)}`,
      };
    }

    if (currentIssue) {
      return {
        title: `${currentIssue.name} - Tạp Chí Pi | Kho Đề Toán & Lời Giải`,
        description: `Tổng hợp toàn bộ các bài toán và lời giải chính thức trong ${currentIssue.name} của Tạp chí Pi.`,
        canonicalPath: `/so/${slugify(currentIssue.name)}`,
      };
    }

    if (currentCat) {
      return {
        title: `Chuyên Mục ${currentCat.name} - Tạp Chí Pi`,
        description: `Các bài toán học chọn lọc thuộc chuyên mục ${currentCat.name} trên Tạp chí Pi.`,
        canonicalPath: `/chuyen-muc/${slugify(currentCat.name)}`,
      };
    }

    return {
      title: 'Tạp Chí Pi - Kho Đề Toán & Bài Giải Chuyên Đề',
      description: 'Diễn đàn và kho đề thi toán học chọn lọc kèm lời giải chuyên đề chất lượng cao từ Tạp chí Pi. Hỗ trợ hiển thị và soạn thảo công thức KaTeX.',
      canonicalPath: '/',
    };
  }, [highlightedProblemId, problems, issues, categories, filterIssue, filterCategory]);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (confirmDialog.isOpen) {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } else if (isLatexModalOpen) {
          setIsLatexModalOpen(false);
          if (location.pathname === '/so-tay-latex') navigate('/');
        } else if (isSolutionModalOpen) {
          setIsSolutionModalOpen(false);
        } else if (isProblemModalOpen) {
          setIsProblemModalOpen(false);
        } else if (isIssueModalOpen) {
          setIsIssueModalOpen(false);
        } else if (isCategoryModalOpen) {
          setIsCategoryModalOpen(false);
        } else if (isGeminiKeyModalOpen) {
          setIsGeminiKeyModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    confirmDialog.isOpen,
    isLatexModalOpen,
    isSolutionModalOpen,
    isProblemModalOpen,
    isIssueModalOpen,
    isCategoryModalOpen,
    isGeminiKeyModalOpen,
    location.pathname,
    navigate,
  ]);

  // Modal open handlers
  const handleOpenProblemCreate = () => {
    if (!isRealUser) {
      showToast('Vui lòng đăng nhập để thêm bài toán mới.', 'info');
      loginWithGoogle();
      return;
    }
    setEditingProblem(null);
    setIsProblemModalOpen(true);
  };

  const handleOpenProblemEdit = (problem) => {
    if (!isRealUser) {
      showToast('Vui lòng đăng nhập để chỉnh sửa bài toán.', 'info');
      loginWithGoogle();
      return;
    }
    setEditingProblem(problem);
    setIsProblemModalOpen(true);
  };

  const handleOpenSolution = (problem) => {
    if (!isRealUser) {
      showToast('Vui lòng đăng nhập để bắt đầu viết lời giải và lưu bài làm.', 'info');
      loginWithGoogle();
      return;
    }
    setActiveSolutionProblem(problem);
    setIsSolutionModalOpen(true);
  };

  const handleOpenLatexCheatsheet = (insertCb = null) => {
    setLatexInsertCallback(() => insertCb);
    setIsLatexModalOpen(true);
  };

  const requestDeleteIssue = (message, issueId) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await deleteIssue(issueId);
      },
    });
  };

  const requestDeleteCategory = (message, catId) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await deleteCategory(catId);
      },
    });
  };

  const requestDeleteProblem = (problem) => {
    setConfirmDialog({
      isOpen: true,
      message: `Bạn chắc chắn muốn xóa bài toán "${problem.code || problem.title || ''}"?`,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await deleteProblem(problem.id);
      },
    });
  };

  if (loadingAuth) {
    return (
      <div className="bg-paper dark:bg-night text-ink dark:text-slate-100 font-newsreader min-h-screen flex items-center justify-center transition-colors duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-paper dark:bg-nightCard border-2 border-cerulean/30 flex items-center justify-center p-3 animate-pulse shadow-md">
            <img src="/assets/pimaga-logo.svg" alt="Pi" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-newsreader italic text-base">Đang tải Tạp Chí Pi...</p>
        </div>
      </div>
    );
  }

  // Render split-screen login page directly
  if (isLoginPage) {
    return (
      <div className="animate-pageTransition min-h-screen">
        <SEOHead
          title={seoData.title}
          description={seoData.description}
          canonicalPath={seoData.canonicalPath}
        />
        {isPageTransitioning && (
          <div
            className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none overflow-hidden animate-pageProgressContainer"
            aria-hidden="true"
          >
            <div className="h-full w-full flex animate-pageProgress">
              <div className="w-1/2 h-full bg-cerulean"></div>
              <div className="w-1/2 h-full bg-jasper"></div>
            </div>
          </div>
        )}
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="bg-paper dark:bg-night text-ink dark:text-slate-100 font-newsreader min-h-screen relative transition-colors duration-200">
      {/* Top Page Navigation Progress Indicator (Dual Tone Cerulean 50% & Jasper 50%, Zero Gradients) */}
      {isPageTransitioning && (
        <div
          className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none overflow-hidden animate-pageProgressContainer"
          aria-hidden="true"
        >
          <div className="h-full w-full flex animate-pageProgress">
            <div className="w-1/2 h-full bg-cerulean"></div>
            <div className="w-1/2 h-full bg-jasper"></div>
          </div>
        </div>
      )}

      {/* Dynamic SEO Meta Tags */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        canonicalPath={seoData.canonicalPath}
        structuredData={seoData.structuredData}
      />

      {isLandingHeaderPage ? (
        <LandingHeader onOpenLatexModal={() => handleOpenLatexCheatsheet(null)} />
      ) : (
        <Header />
      )}

      <div id="app" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 relative">
        <main
          key={pageKey}
          id="main-content"
          className="animate-pageTransition focus:outline-none min-h-[60vh]"
        >
          {isLandingPage ? (
            <LandingPage
              onExploreFeed={() => {
                if (isRealUser) {
                  navigate('/kho-de');
                } else {
                  navigate('/dang-nhap');
                }
              }}
              onOpenLatexModal={() => handleOpenLatexCheatsheet(null)}
            />
          ) : isFeaturesPage ? (
            <FeaturesPage onOpenLatexModal={() => handleOpenLatexCheatsheet(null)} />
          ) : isPiHistoryPage ? (
            <PiHistoryPage />
          ) : isTapChiPiPage ? (
            <TapChiPiPage />
          ) : isProfilePage ? (
            <ProfilePage
              onOpenDetail={handleOpenDetail}
              onOpenSolution={handleOpenSolution}
              onBackToList={handleBackToList}
            />
          ) : isDetailPage ? (
            <ProblemDetailPage
              problem={activeDetailProblem}
              issueName={activeDetailProblem ? issueMap.get(activeDetailProblem.issueId) || 'Không rõ Số' : ''}
              catName={activeDetailProblem ? categoryMap.get(activeDetailProblem.categoryId) || 'Không rõ Chuyên mục' : ''}
              userSolution={activeDetailProblem ? userSolutionsMap[activeDetailProblem.id] : ''}
              onOpenSolution={handleOpenSolution}
              onOpenLatexCheatsheet={handleOpenLatexCheatsheet}
              onEditProblem={handleOpenProblemEdit}
              onDeleteProblem={requestDeleteProblem}
              onBackToList={handleBackToList}
              prevProblem={prevProblem}
              nextProblem={nextProblem}
              onSelectProblem={handleSelectOtherProblem}
            />
          ) : (
            <>
              <FilterBar
                onSelectIssue={handleSelectIssue}
                onSelectCategory={handleSelectCategory}
                onOpenLatexModal={() => handleOpenLatexCheatsheet(null)}
                onOpenProblemModal={handleOpenProblemCreate}
                onOpenIssueModal={() => setIsIssueModalOpen(true)}
                onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
              />

              <ProblemList
                highlightedProblemId={highlightedProblemId}
                onEditProblem={handleOpenProblemEdit}
                onDeleteProblem={requestDeleteProblem}
                onOpenSolution={handleOpenSolution}
                onOpenDetail={handleOpenDetail}
              />
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* Modals */}
      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onRequestDelete={requestDeleteIssue}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onRequestDelete={requestDeleteCategory}
      />

      <ProblemModal
        isOpen={isProblemModalOpen}
        editingProblem={editingProblem}
        onClose={() => {
          setIsProblemModalOpen(false);
          setEditingProblem(null);
        }}
        onOpenIssueModal={() => setIsIssueModalOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenLatexCheatsheet={(insertCb) => handleOpenLatexCheatsheet(insertCb)}
      />

      <SolutionModal
        isOpen={isSolutionModalOpen}
        problem={activeSolutionProblem}
        onClose={() => {
          setIsSolutionModalOpen(false);
          setActiveSolutionProblem(null);
        }}
        onOpenLatexCheatsheet={(insertCb) => handleOpenLatexCheatsheet(insertCb)}
      />

      <LatexCheatsheetModal
        isOpen={isLatexModalOpen}
        onClose={() => {
          setIsLatexModalOpen(false);
          setLatexInsertCallback(null);
          if (location.pathname === '/so-tay-latex') navigate('/');
        }}
        onInsertSnippet={latexInsertCallback}
      />

      <GeminiKeyModal
        isOpen={isGeminiKeyModalOpen}
        onClose={() => setIsGeminiKeyModalOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
