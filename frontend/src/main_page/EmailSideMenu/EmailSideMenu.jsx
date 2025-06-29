// src/main_page/EmailSideMenu/EmailSideMenu.jsx

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmailSideMenu.css';
import useIsMobile from "../../utils/useIsMobile";

import {
    fetchLabels,
    createLabel,
    editLabel,
    deleteLabel,
    createLabelUnderParent,
} from '../../api/labelsApi';

const mailboxItems = [
    { id: 'all',     label: 'All Mail', icon: 'bi-envelope' },
    { id: 'incoming',label: 'Inbox',    icon: 'bi-inbox' },
    { id: 'sent',    label: 'Sent',     icon: 'bi-send-fill' },
    { id: 'draft',   label: 'Drafts',   icon: 'bi-file-earmark-text' },
    { id: 'star',    label: 'Starred',  icon: 'bi-star' },
    { id: 'trash',   label: 'Trash',    icon: 'bi-trash-fill' },
    { id: 'spam',    label: 'Spam',     icon: 'bi-exclamation-octagon' },
];

export default function EmailSidebar({
                                         theme,
                                         currentTab,
                                         setCurrentTab,
                                         onComposeClick,
                                         showSidebar,
                                         setShowSidebar
                                     }) {
    const isMobile = useIsMobile();
    const [labels, setLabels] = useState([]);

    // For expand/collapse of sublabels
    const [expandedLabels, setExpandedLabels] = useState({});

    // Context menu state
    const [ctx, setCtx] = useState({ open: false, x: 0, y: 0, label: null });

    // Load labels once
    useEffect(() => {
        fetchLabels().then(setLabels);
    }, []);

    // Helper to reload label list
    const reload = async () => setLabels(await fetchLabels());

    // Add label
    const handleAddLabel = async () => {
        const name = prompt("New label name:");
        if (!name) return;
        await createLabel(name);
        await reload();
    };

    // Edit label
    const handleEditLabel = async lab => {
        const name = prompt("Rename label:", lab.name);
        if (!name || name === lab.name) return;
        await editLabel(lab.id, name);
        await reload();
    };

    // Remove label
    const handleRemoveLabel = async lab => {
        if (!window.confirm(`Delete "${lab.name}"?`)) return;
        await deleteLabel(lab.id);
        await reload();
    };

    // Add sublabel
    const handleAddSublabel = async lab => {
        const name = prompt(`Sublabel name under "${lab.name}":`);
        if (!name) return;
        await createLabelUnderParent(lab.id, name);
        await reload();
    };

    // Context menu
    const openCtx = (e, lab) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setCtx({ open: true, x: rect.right + 4, y: rect.top, label: lab });
    };
    const closeCtx = () => setCtx(c => ({ ...c, open: false }));

    // Tab navigation
    const onClickTab = id => {
        setCurrentTab(id);
        if (isMobile) setShowSidebar(false);
    };

    // Expand/collapse toggler
    const toggleLabel = id => {
        setExpandedLabels(e => ({ ...e, [id]: !e[id] }));
    };

    // Build label tree from flat list
    function buildLabelTree(labels) {
        const map = {};
        labels.forEach(lab => map[lab.id] = { ...lab, children: [] });
        const roots = [];
        labels.forEach(lab => {
            if (lab.parent) map[lab.parent]?.children.push(map[lab.id]);
            else roots.push(map[lab.id]);
        });
        return roots;
    }

    // Recursive label renderer
    function renderLabel(lab, level = 0) {
        const isParent = lab.children && lab.children.length > 0;
        const isExpanded = expandedLabels[lab.id];
        const tabId = `label:${lab.name}`;

        return (
            <React.Fragment key={lab.id}>
                <li className="nav-item d-flex align-items-center label-li"
                    style={{ paddingLeft: 16 + level * 18 }}>
                    {isParent && (
                        <button
                            className="label-expand-btn"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                            onClick={() => toggleLabel(lab.id)}
                            style={{
                                border: 'none',
                                background: 'none',
                                marginRight: 5,
                                cursor: 'pointer',
                                color: 'inherit'
                            }}>
                            <i className={`bi bi-caret-${isExpanded ? "down" : "right"}-fill`} />
                        </button>
                    )}
                    {!isParent && <span style={{ width: 20, display: "inline-block" }} />}
                    <a
                        href="#"
                        className={`nav-link flex-grow-1 ${currentTab === tabId ? 'active-tab' : ''}`}
                        onClick={e => { e.preventDefault(); onClickTab(tabId) }}
                    >{lab.name}</a>
                    <i
                        className="bi bi-three-dots-vertical ms-2"
                        style={{ cursor: 'pointer' }}
                        onClick={e => openCtx(e, lab)}
                    />
                </li>
                {isParent && isExpanded && lab.children.map(child =>
                    renderLabel(child, level + 1)
                )}
            </React.Fragment>
        );
    }

    return (
        <div className={`sidebar ${theme} ${showSidebar ? 'show' : ''}`}>
            {/* Compose button */}
            {!isMobile && (
                <button className={`btn compose-button ${theme}`} onClick={onComposeClick}>
                    <i className="bi bi-pencil-square me-2" /> Compose
                </button>
            )}

            {/* Folders */}
            <ul className="nav nav-pills flex-column">
                {mailboxItems.map(it => (
                    <li key={it.id} className="nav-item">
                        <a
                            href="#"
                            className={`nav-link ${currentTab === it.id ? 'active-tab' : ''}`}
                            onClick={e => { e.preventDefault(); onClickTab(it.id) }}
                        >
                            <i className={`bi ${it.icon} me-2`} />{it.label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Labels header */}
            <div className="labels-header d-flex align-items-center px-3 mt-4">
                <strong className="me-auto">Labels</strong>
                <i className="bi bi-plus-circle" style={{ cursor: 'pointer' }} onClick={handleAddLabel} />
            </div>

            {/* Labels as expandable tree */}
            <ul className="nav nav-pills flex-column mt-1">
                {buildLabelTree(labels).map(lab => renderLabel(lab))}
            </ul>

            {/* Context menu for label actions */}
            {ctx.open && (
                <ul
                    className="label-context-menu list-unstyled p-2 shadow"
                    style={{
                        position: 'fixed',
                        top: ctx.y, left: ctx.x,
                        background: theme === 'dark' ? '#333' : '#fff',
                        borderRadius: 4,
                        zIndex: 2000
                    }}
                    onMouseLeave={closeCtx}
                >
                    <li className="p-1" style={{ cursor: 'pointer' }}
                        onClick={() => { handleEditLabel(ctx.label); closeCtx(); }}>
                        Edit
                    </li>
                    <li className="p-1 mt-1" style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => { handleRemoveLabel(ctx.label); closeCtx(); }}>
                        Remove label
                    </li>
                    <li className="p-1 mt-1" style={{ cursor: 'pointer' }}
                        onClick={() => { handleAddSublabel(ctx.label); closeCtx(); }}>
                        Add sublabel
                    </li>
                </ul>
            )}
        </div>
    );
}
