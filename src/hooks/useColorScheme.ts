import { useState, useEffect } from "react";

/**
 * Hook to manage and sync player color scheme with document theme
 * @returns Current color scheme (light or dark)
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Helper to determine initial theme
    const getInitialTheme = (): "light" | "dark" => {
      const storedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      if (storedTheme) return storedTheme;

      const dataTheme = document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark"
        | null;
      if (dataTheme) return dataTheme;

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    // Set initial theme
    setColorScheme(getInitialTheme());

    // Observe changes to document theme
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          const newTheme = document.documentElement.getAttribute(
            "data-theme",
          ) as "light" | "dark" | null;
          if (newTheme) {
            setColorScheme(newTheme);
          }
        }
      }
    });

    // Set up observer for theme changes
    observer.observe(document.documentElement, { attributes: true });

    // Handle theme changes from localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "theme" && event.newValue) {
        setColorScheme(event.newValue as "light" | "dark");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return colorScheme;
}
