// 图标工具文件 - 集中管理所有需要的图标
// 按需导入，避免打包整个图标库

import {
  FaGithub,
  FaHackerNews,
  FaProductHunt,
  FaReddit,
  FaRss,
  FaTwitter,
  FaNewspaper,
  FaBookOpen,
  FaCode,
  FaBlog,
  FaTimes,
  FaSearch,
  FaHeart,
  FaEye,
  FaComment,
  FaClock,
  FaGlobe,
  FaFeather,
  FaTerminal,
  FaRocket,
  FaExternalLinkAlt,
  FaLightbulb,
  FaShare,
  FaPlay,
  FaHackerNewsSquare,
  FaPause,
} from "react-icons/fa";

import {
  SiZhihu,
  SiBilibili,
  SiGithub as SiGithubIcon,
  SiTechcrunch,
  SiMedium,
  SiProducthunt,
  SiReddit,
  SiNewyorktimes,
} from "react-icons/si";

// 图标映射表 - 只包含实际需要的图标
export const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  // FontAwesome 图标
  FaGithub,
  FaHackerNews,
  FaProductHunt,
  FaReddit,
  FaRss,
  FaTwitter,
  FaNewspaper,
  FaFeather,
  FaBookOpen,
  FaCode,
  FaBlog,
  FaTimes,
  FaSearch,
  FaHeart,
  FaEye,
  FaComment,
  FaClock,
  FaExternalLinkAlt,
  FaShare,
  FaPlay,
  FaPause,
  FaGlobe,
  FaTerminal,
  FaRocket,
  FaHackerNewsSquare,
  FaLightbulb,
  // Simple Icons
  SiZhihu,
  SiBilibili,
  SiGithub: SiGithubIcon,
  SiTechcrunch,
  SiMedium,
  SiProducthunt,
  SiReddit,
  SiNewyorktimes,
};

/**
 * 获取图标组件
 * @param iconName 图标名称
 * @param className 可选的 CSS 类名
 * @returns 图标组件或 null
 */
export const getIcon = (
  iconName: string | undefined,
  className = "h-5 w-5",
) => {
  if (!iconName) return null;

  const IconComponent = iconMap[iconName];

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  return null;
};

/**
 * 检查图标是否存在
 * @param iconName 图标名称
 * @returns 是否存在该图标
 */
export const hasIcon = (iconName: string | undefined): boolean => {
  if (!iconName) return false;
  return iconName in iconMap;
};

/**
 * 获取所有可用的图标名称
 * @returns 图标名称数组
 */
export const getAvailableIcons = (): string[] => {
  return Object.keys(iconMap);
};
