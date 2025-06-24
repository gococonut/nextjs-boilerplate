"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { themeChange } from "theme-change";
import { animate } from "animejs";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import {
  UserCircleIcon,
  Bars3Icon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useTranslations, useLocale } from "next-intl";

// 统一的 Dropdown 样式组件
function UnifiedDropdown({
  isOpen,
  onClose,
  children,
  className = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 下拉菜单动画
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;

      // 初始状态
      dropdown.style.opacity = "0";
      dropdown.style.transform = "translateY(-10px) scale(0.95)";

      // 动画进入
      animate(dropdown, {
        opacity: [0, 1],
        translateY: ["-10px", "0px"],
        scale: [0.95, 1],
        duration: 150,
        easing: "easeOutCubic",
      });
    }
  }, [isOpen]);

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`border-base-300/60 bg-base-100/95 absolute top-full right-0 z-40 mt-2 -translate-x-1/4 transform rounded-xl border shadow-xl backdrop-blur-md sm:translate-x-0 ${className}`}
    >
      {/* 精致的内阴影效果 */}
      <div className="from-primary/[0.01] absolute inset-0 rounded-xl bg-gradient-to-br to-transparent opacity-50"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function NavbarContent() {
  const t = useTranslations("Navbar");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">(
    "system",
  );
  const [isClient, setIsClient] = useState(false);

  // 标题动画相关
  const titleRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const {
    session,
    isLoading: authLoading,
    signOut,
    isAuthenticated,
  } = useAuth();

  // State for accordion open/close
  const [isLanguageAccordionOpen, setIsLanguageAccordionOpen] = useState(false);
  const [isThemeAccordionOpen, setIsThemeAccordionOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  const logoSrc =
    currentTheme === "dark" ? "/dark-logo.png" : "/light-logo.png";

  const currentLocale = useLocale();
  const locales = [
    { code: "en", name: "English", abbr: "EN" },
    { code: "ja", name: "日本語", abbr: "日" },
    { code: "ko", name: "한국어", abbr: "한" },
    { code: "zh", name: "简体中文", abbr: "简" },
    { code: "zh-TW", name: "繁體中文", abbr: "繁" },
  ];

  const themes = [
    { key: "light", name: t("lightMode") || "浅色", icon: SunIcon },
    { key: "dark", name: t("darkMode") || "深色", icon: MoonIcon },
    {
      key: "system",
      name: t("systemMode") || "跟随系统",
      icon: ComputerDesktopIcon,
    },
  ] as const;

  // Initialize theme
  useEffect(() => {
    themeChange(false);
    const savedThemeValue = localStorage.getItem("theme");
    const savedTheme: "light" | "dark" | "system" =
      savedThemeValue === "light" ||
      savedThemeValue === "dark" ||
      savedThemeValue === "system"
        ? (savedThemeValue as "light" | "dark" | "system")
        : "system";
    setCurrentTheme(savedTheme);

    // Apply system theme if needed
    if (savedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    setIsClient(true);
  }, []);

  // 监听系统主题变化，仅当选择了"跟随系统"时生效
  useEffect(() => {
    if (!isClient || currentTheme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [isClient, currentTheme]);

  // 标题和Logo动画效果
  useEffect(() => {
    if (!titleRef.current || !logoRef.current || hasAnimated || !isClient)
      return;

    const titleElement = titleRef.current;
    const logoElement = logoRef.current;
    const originalText = t("appName") || "开发模板";

    // 将文字包装为单独的字母spans，初始状态隐藏
    titleElement.innerHTML = originalText
      .split("")
      .map(
        (char, index) =>
          `<span class="letter" style="display: inline-block; opacity: 0; transform: scale(0.3);">${char}</span>`,
      )
      .join("");

    // Logo初始动画
    animate(logoElement, {
      scale: [0.5, 1.1, 1],
      rotate: [0, 5, -5, 0],
      opacity: [0, 1],
      easing: "easeOutElastic(1, .6)",
      duration: 500,
    });

    // 执行文字动画
    const letters = titleElement.querySelectorAll(".letter");

    animate(letters, {
      scale: [0.3, 1.05, 1],
      opacity: [0, 1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 600,
      delay: (_el: any, i: number) => 200 + 80 * (i + 1),
      complete: () => {
        setHasAnimated(true);
      },
    });
  }, [isClient, hasAnimated, t]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  const getCurrentThemeInfo = () => {
    return themes.find((theme) => theme.key === currentTheme) || themes[0];
  };

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const segments = currentPath.split("/").filter(Boolean);
    let newPath = "";

    if (segments.length > 0 && locales.some((l) => l.code === segments[0])) {
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      newPath = "/" + newLocale + (currentPath === "/" ? "" : currentPath);
    }

    const currentSearchParams = window.location.search;
    if (newPath.endsWith("/") && currentSearchParams.startsWith("?")) {
      newPath = newPath.slice(0, -1) + currentSearchParams;
    } else {
      newPath += currentSearchParams;
    }

    router.replace(newPath, { scroll: false });
    setIsLanguageAccordionOpen(false);
    const active = document.activeElement as HTMLElement;
    if (active && typeof active.blur === "function") {
      active.blur();
    }
  };

  // 处理下拉菜单切换
  const handleUserDropdownToggle = () => {
    if (!isUserDropdownOpen) {
      setIsGuestDropdownOpen(false);
    }
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleGuestDropdownToggle = () => {
    if (!isGuestDropdownOpen) {
      setIsUserDropdownOpen(false);
    }
    setIsGuestDropdownOpen(!isGuestDropdownOpen);
  };

  const navbarBaseClasses =
    "navbar bg-base-100/80 border-base-content/10 container mx-auto border-b backdrop-blur-lg px-4 sm:px-6 lg:px-8";

  const navbarWrapperClasses = "sticky top-0 z-50";

  return (
    <div className={navbarWrapperClasses}>
      <div className={navbarBaseClasses}>
        <div className="navbar-start min-w-0">
          <Link
            href={`/${currentLocale}`}
            className="flex items-center gap-2 text-lg whitespace-nowrap normal-case"
          >
            {isClient ? (
              <img
                ref={logoRef}
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8"
                style={{ opacity: 0 }}
              />
            ) : (
              <div className="h-8 w-8"></div>
            )}
            <span ref={titleRef} className="" style={{ opacity: 1 }}>
              {/* 内容将通过动画填充 */}
            </span>
            <div
              className={`badge badge-xs badge-soft badge-info hidden transition-opacity duration-300 sm:block ${hasAnimated ? "opacity-100" : "opacity-0"}`}
            >
              Template
            </div>
          </Link>
        </div>

        <div className="navbar-end flex-none gap-x-0.5 sm:gap-x-2">
          {/* 用户头像和下拉菜单 */}
          {!isClient || authLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                onClick={handleUserDropdownToggle}
                className="avatar btn btn-ghost btn-circle hover:bg-primary/10"
                type="button"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={
                      session?.user?.image ||
                      "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    }
                    alt={session?.user?.name || t("userFallbackAvatar")}
                  />
                </div>
              </button>

              <UnifiedDropdown
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
                className="w-64"
              >
                <div className="p-2">
                  <div className="p-2">
                    <div className="font-medium">
                      {session?.user?.name || t("userFallbackAvatar")}
                    </div>
                    <div className="text-base-content/70 truncate text-sm">
                      {session?.user?.email || ""}
                    </div>
                  </div>
                  <div className="divider my-1"></div>

                  <div className="space-y-1">
                    {/* 主题选择下拉 */}
                    <div>
                      <button
                        onClick={() =>
                          setIsThemeAccordionOpen(!isThemeAccordionOpen)
                        }
                        className="btn btn-ghost hover:bg-primary/5 flex h-auto min-h-0 w-full items-center justify-between py-3 text-left"
                        type="button"
                      >
                        <span className="flex items-center">
                          {React.createElement(getCurrentThemeInfo().icon, {
                            className: "mr-2 h-5 w-5",
                          })}
                          <span className="flex items-center gap-2">
                            {t("theme") || "主题"}
                          </span>
                        </span>
                        <ChevronDownIcon
                          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isThemeAccordionOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isThemeAccordionOpen && (
                        <div className="mt-1 pr-1 pl-2">
                          {themes.map((theme) => (
                            <button
                              key={theme.key}
                              onClick={() => {
                                handleThemeChange(theme.key);
                                setIsThemeAccordionOpen(false);
                                setIsUserDropdownOpen(false);
                              }}
                              className={`btn btn-ghost hover:bg-primary/5 my-0.5 h-auto min-h-0 w-full justify-start py-3 text-left ${currentTheme === theme.key ? "bg-primary/10 text-primary font-semibold" : ""}`}
                            >
                              <span className="flex items-center">
                                {React.createElement(theme.icon, {
                                  className: "mr-2 h-4 w-4",
                                })}
                                {theme.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 语言选择下拉 */}
                    <div>
                      <button
                        onClick={() =>
                          setIsLanguageAccordionOpen(!isLanguageAccordionOpen)
                        }
                        className="btn btn-ghost hover:bg-primary/5 flex h-auto min-h-0 w-full items-center justify-between py-3 text-left"
                        type="button"
                        data-language-toggle
                      >
                        <span className="flex items-center">
                          <GlobeAltIcon className="mr-2 h-5 w-5" />
                          <span className="flex items-center gap-2">
                            {t("switchLanguage")}
                            <span className="badge badge-outline badge-xs">
                              {locales.find((l) => l.code === currentLocale)
                                ?.abbr || currentLocale.toUpperCase()}
                            </span>
                          </span>
                        </span>
                        <ChevronDownIcon
                          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isLanguageAccordionOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isLanguageAccordionOpen && (
                        <div className="mt-1 pr-1 pl-2">
                          {locales.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                handleLanguageChange(lang.code);
                                setIsUserDropdownOpen(false);
                              }}
                              className={`btn btn-ghost hover:bg-primary/5 my-0.5 h-auto min-h-0 w-full justify-start py-3 text-left ${currentLocale === lang.code ? "bg-primary/10 text-primary font-semibold" : ""}`}
                            >
                              <span className="flex w-full items-center justify-between">
                                <span>{lang.name}</span>
                                <span className="badge badge-outline badge-xs opacity-60">
                                  {lang.abbr}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        signOut();
                        setIsUserDropdownOpen(false);
                      }}
                      className="btn btn-ghost h-auto min-h-0 w-full justify-start py-3 text-left hover:bg-red-50 hover:text-red-600"
                      type="button"
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                      {t("logout")}
                    </button>
                  </div>
                </div>
              </UnifiedDropdown>
            </div>
          ) : (
            <>
              <Link
                href={`/${currentLocale}/login`}
                className="border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/50 flex min-w-[4rem] items-center justify-center rounded-lg border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200"
                suppressHydrationWarning
              >
                {t("login")}
              </Link>
              <div className="relative ml-0.5 sm:ml-1">
                <button
                  onClick={handleGuestDropdownToggle}
                  className="btn btn-ghost btn-circle hover:bg-primary/10"
                  aria-label={t("openMenu")}
                  type="button"
                >
                  <Bars3Icon className="text-base-content/80 h-6 w-6" />
                </button>

                <UnifiedDropdown
                  isOpen={isGuestDropdownOpen}
                  onClose={() => setIsGuestDropdownOpen(false)}
                  className="w-64"
                >
                  <div className="p-2">
                    <div className="space-y-1">
                      {/* 主题选择下拉 - 访客版 */}
                      <div>
                        <button
                          onClick={() =>
                            setIsThemeAccordionOpen(!isThemeAccordionOpen)
                          }
                          className="btn btn-ghost hover:bg-primary/5 flex h-auto min-h-0 w-full items-center justify-between py-3 text-left"
                          type="button"
                        >
                          <span className="flex items-center">
                            {React.createElement(getCurrentThemeInfo().icon, {
                              className: "mr-2 h-5 w-5",
                            })}
                            <span className="flex items-center gap-2">
                              {t("theme") || "主题"}
                            </span>
                          </span>
                          <ChevronDownIcon
                            className={`ml-2 h-4 w-4 transition-transform duration-200 ${isThemeAccordionOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isThemeAccordionOpen && (
                          <div className="mt-1 pr-1 pl-2">
                            {themes.map((theme) => (
                              <button
                                key={theme.key}
                                onClick={() => {
                                  handleThemeChange(theme.key);
                                  setIsThemeAccordionOpen(false);
                                  setIsGuestDropdownOpen(false);
                                }}
                                className={`btn btn-ghost hover:bg-primary/5 my-0.5 h-auto min-h-0 w-full justify-start py-3 text-left ${currentTheme === theme.key ? "bg-primary/10 text-primary font-semibold" : ""}`}
                              >
                                <span className="flex items-center">
                                  {React.createElement(theme.icon, {
                                    className: "mr-2 h-4 w-4",
                                  })}
                                  {theme.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 语言选择下拉 - 访客版 */}
                      <div>
                        <button
                          onClick={() =>
                            setIsLanguageAccordionOpen(!isLanguageAccordionOpen)
                          }
                          className="btn btn-ghost hover:bg-primary/5 flex h-auto min-h-0 w-full items-center justify-between py-3 text-left"
                          type="button"
                          data-language-toggle
                        >
                          <span className="flex items-center">
                            <GlobeAltIcon className="mr-2 h-5 w-5" />
                            <span className="flex items-center gap-2">
                              {t("switchLanguage")}
                              <span className="badge badge-outline badge-xs">
                                {locales.find((l) => l.code === currentLocale)
                                  ?.abbr || currentLocale.toUpperCase()}
                              </span>
                            </span>
                          </span>
                          <ChevronDownIcon
                            className={`ml-2 h-4 w-4 transition-transform duration-200 ${isLanguageAccordionOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isLanguageAccordionOpen && (
                          <div className="mt-1 pr-1 pl-2">
                            {locales.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => {
                                  handleLanguageChange(lang.code);
                                  setIsGuestDropdownOpen(false);
                                }}
                                className={`btn btn-ghost hover:bg-primary/5 my-0.5 h-auto min-h-0 w-full justify-start py-3 text-left ${currentLocale === lang.code ? "bg-primary/10 text-primary font-semibold" : ""}`}
                              >
                                <span className="flex w-full items-center justify-between">
                                  <span>{lang.name}</span>
                                  <span className="badge badge-outline badge-xs opacity-60">
                                    {lang.abbr}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </UnifiedDropdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return <NavbarContent />;
}
