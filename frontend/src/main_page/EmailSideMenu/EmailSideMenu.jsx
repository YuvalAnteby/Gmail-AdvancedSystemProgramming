import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmailSideMenu.css'

export default function EmailSidebar({theme, currentTab, setCurrentTab, onComposeClick}) {

    const sidebarItems = [
        {id: 'all', label: 'All Mail', iconClass: 'bi-envelope'},
        {id: 'incoming', label: 'Inbox', iconClass: 'bi-inbox'},
        {id: 'sent', label: 'Sent', iconClass: 'bi-send-fill'},
        {id: 'draft', label: 'Drafts', iconClass: 'bi-file-earmark-text'},
        {id: 'star', label: 'Starred', iconClass: 'bi-star'},
        {id: 'trash', label: 'Trash', iconClass: 'bi-trash-fill'},
    ];

    return (
        <div className={`sidebar ${theme}`}
        >
            <button
                onClick={onComposeClick}
                className={`btn compose-button ${theme}`}
            >
                <i className="bi bi-pencil-square me-2"/>
                Compose
            </button>

            <ul className="nav nav-pills flex-column">
                {sidebarItems.map(item => {
                    const active = currentTab === item.id;
                    return (
                        <li key={item.id} className="nav-item position-relative">
                            <a
                                className={`nav-link d-flex ${active ? 'active-tab' : ''}`}
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    setCurrentTab(item.id);
                                }}
                            >
                <span className="d-flex align-items-center">
                  <i className={`bi ${item.iconClass} me-2`}/>
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
