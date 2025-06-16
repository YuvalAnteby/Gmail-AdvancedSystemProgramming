import {useEffect, useState} from "react";

/**
 * Hook to manage the theme of the project.
 * @param {"light"|"dark"}defaultTheme
 * @returns {{theme: string, toggleTheme: function}}
 */
export function useTheme(defaultTheme) {
    const [theme, setTheme] = useState(defaultTheme);

    // gets the current theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
    }, []);

    // toggle the theme between light and dark
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return {theme, toggleTheme};
}