import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function EmailSidebar({theme, currentTab, setCurrentTab, onComposeClick}) {
    const isDark = theme === 'dark';

    const sidebarItems = [
        { id: 'all',      label: 'All Mail',  iconClass: 'bi-envelope' },
        { id: 'incoming', label: 'Inbox',     iconClass: 'bi-inbox' },
        { id: 'sent',     label: 'Sent',      iconClass: 'bi-send-fill' },
        { id: 'draft',    label: 'Drafts',    iconClass: 'bi-file-earmark-text' },
        { id: 'star',     label: 'Starred',   iconClass: 'bi-star' },
        { id: 'trash',    label: 'Trash',     iconClass: 'bi-trash-fill' },
    ];

    return (
        <div
            className={`d-flex flex-column p-3 ${
                isDark ? 'bg-dark text-light border-secondary' : 'bg-white text-dark border-end'
            }`}
            style={{ height: '100vh' }}
        >
            <button
                onClick={onComposeClick}
                className={`btn ${isDark ? 'btn-outline-light' : 'btn-primary'} mb-3 d-flex align-items-center`}
            >
                <i className="bi bi-pencil-square me-2"></i>
                Compose
            </button>

            <ul className="nav nav-pills flex-column">
                {sidebarItems.map(item => {
                    const active = currentTab === item.id;
                    return (
                        <li key={item.id} className="nav-item position-relative">
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    setCurrentTab(item.id);
                                }}
                                className={`
                  nav-link d-flex align-items-center
                  justify-content-between
                  ${active
                                    ? isDark
                                        ? 'bg-secondary text-white'
                                        : 'active'
                                    : 'bg-transparent'}
                  ${!active && isDark ? 'text-light' : ''}
                `}
                            >
                <span className="d-flex align-items-center">
                  <i className={`bi ${item.iconClass} me-2`}></i>
                    {item.label}
                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
