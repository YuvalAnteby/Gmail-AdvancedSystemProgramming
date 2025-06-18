import React from 'react';
import './SkeletonInbox.css';

export default function SkeletonInbox({ rows = 10 }) {
    return (
        <div className="mail-list-container skeleton-inbox">
            {[...Array(rows)].map((_, index) => (
                <div className="skeleton-mail-row" key={index}>
                    <div className="skeleton-checkbox" />
                    <div className="skeleton-sender" />
                    <div className="skeleton-subject" />
                    <div className="skeleton-date" />
                </div>
            ))}
        </div>
    );
}
