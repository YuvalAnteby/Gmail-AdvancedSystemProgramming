import React, { useState } from 'react';
import { toggleMailStar } from '../../api/mailApi';
import './StarButton.css';

/**
 * @prop {{
 *   email: Object,
 *   theme: string,
 *   onToggle: function
 * }} props
 */
const StarButton = ({ email, theme, onToggle }) => {
    const [isStarred, setIsStarred] = useState(email.isStarred);

    const handleToggle = async (e) => {
        e.stopPropagation?.();
        try {
            setIsStarred((prev) => !prev);
            await toggleMailStar(email);
            if (onToggle)
                onToggle(email);
        } catch (err) {
            console.error('Failed to toggle star:', err);
        }
    };

    return (
        <i
            className={`btn bi bi-star${isStarred ? "-fill" : ""} star-icon ${theme} ${isStarred ? "starred" : ""}`}
            onClick={handleToggle}
            title={isStarred ? 'Unstar' : 'Star'}
        />
    );
};

export default StarButton;
