import {useEffect, useState} from "react";

export function useTheme() {
    const [theme, setTheme] = useState('dark');

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