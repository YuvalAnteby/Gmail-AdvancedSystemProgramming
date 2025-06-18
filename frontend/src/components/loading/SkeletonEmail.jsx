import React from 'react';
import './SkeletonEmail.css'

const SkeletonEmail = () => {
    return (
        <div className="skeleton-container">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-meta"></div>
            <div className="skeleton-line skeleton-paragraph"></div>
            <div className="skeleton-line skeleton-paragraph"></div>
            <div className="skeleton-line skeleton-paragraph short"></div>
            <div className="skeleton-line skeleton-paragraph"></div>
            <div className="skeleton-line skeleton-paragraph short"></div>
        </div>
    );
}

export default SkeletonEmail;