import React, { useState, useEffect } from 'react';
// Import Bootstrap and icon styles for consistent UI
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmailSideMenu.css';
import useIsMobile from "../../utils/useIsMobile";

// Import API functions for label CRUD and sublabel
import {
    fetchLabels,
    createLabel,
    editLabel,
    deleteLabel,
    createLabelUnderParent,
} from '../../api/labelsApi';

// Define the static mailbox/folder items (Inbox, Sent, etc.)
const mailboxItems = [
    { id: 'all',     label: 'All Mail', icon: 'bi-envelope' },
    { id: 'incoming',label: 'Inbox',    icon: 'bi-inbox' },
    { id: 'sent',    label: 'Sent',     icon: 'bi-send-fill' },
    { id: 'draft',   label: 'Drafts',   icon: 'bi-file-earmark-text' },
    { id: 'star',    label: 'Starred',  icon: 'bi-star' },
    { id: 'trash',   label: 'Trash',    icon: 'bi-trash-fill' },
    { id: 'spam',    label: 'Spam',     icon: 'bi-exclamation-octagon' },
];

// Main sidebar component
export default function EmailSidebar({
                                         theme,            // "light" or "dark"
                                         currentTab,       // Which tab/label is currently selected
                                         setCurrentTab,    // Callback to change tab
                                         onComposeClick,   // Callback for "Compose" button
                                         showSidebar,      // Boolean: is sidebar open (mobile)
                                         setShowSidebar,   // Callback to toggle sidebar (mobile)
                                         clearSelection,
                                         refreshMails
                                     }) {
    const isMobile = useIsMobile();
    const [labels, setLabels] = useState([]); // Flat list of all labels (from backend)

    // Object to track which parent labels are expanded: { [id]: true/false }
    const [expandedLabels, setExpandedLabels] = useState({});

    // State for context menu (edit/delete/add sublabel)
    const [ctx, setCtx] = useState({ open: false, x: 0, y: 0, label: null });

    // Fetch labels from API on mount
    useEffect(() => {
        fetchLabels().then(setLabels);
    }, []);

    // Helper to reload labels after changes
    const reload = async () => setLabels(await fetchLabels());

    // Add new label at root
    const handleAddLabel = async () => {
        const name = prompt("New label name:");
        if (!name) return;

        try {
            await createLabel(name);
            await reload();
        } catch (err) {
            if (err.message.includes("409")) {
                alert(`A label named "${name}" already exists.`);
            } else {
                alert("An error occurred while creating the label.");
                console.error(err);
            }
        }
    };

    // Rename label
    const handleEditLabel = async lab => {
        const name = prompt("Rename label:", lab.name);
        if (!name || name === lab.name) return;
        try {
            await editLabel(lab.id, name);
            await reload();
            await refreshMails();
        } catch (err) {
            if (err.message.includes("409")) {
                alert(`A label named "${name}" already exists.`);
            } else {
                alert("An error occurred while creating the label.");
                console.error(err);
            }
        }
    };

    // Delete label with confirmation
    const handleRemoveLabel = async lab => {
        if (!window.confirm(`Delete "${lab.name}"?`)) return;
        await deleteLabel(lab.id);
        await reload();
        await refreshMails();
    };

    // Add sublabel under parent
    const handleAddSublabel = async lab => {
        const name = prompt(`Sublabel name under "${lab.name}":`);
        if (!name) return;
        try {
            await createLabelUnderParent(lab.id, name);
            await reload();
        } catch (err) {
            if (err.message.includes("409")) {
                alert(`A label named "${name}" already exists.`);
            } else {
                alert("An error occurred while creating the label.");
                console.error(err);
            }
        }
    };

    // Open the context menu at the position of the clicked label
    const openCtx = (e, lab) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setCtx({ open: true, x: rect.right + 4, y: rect.top, label: lab });
    };
    // Close the context menu
    const closeCtx = () => setCtx(c => ({ ...c, open: false }));

    // Navigate to mailbox tab or label tab
    const onClickTab = id => {
        setCurrentTab(id);
        clearSelection();
        if (isMobile) setShowSidebar(false);
    };

    // Expand/collapse label for sublabels
    const toggleLabel = id => {
        setExpandedLabels(e => ({ ...e, [id]: !e[id] }));
    };

    /**
     * Convert flat label list to tree structure:
     * - Each label can have children (if sublabel)
     * - Roots have parent == null/undefined/0
     */
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

    /**
     * Render a single label and its children recursively
     * @param {object} lab - label object
     * @param {number} level - depth (indent)
     */
    function renderLabel(lab, level = 0) {
        const isParent = lab.children && lab.children.length > 0;
        const isExpanded = expandedLabels[lab.id];
        const tabId = `label:${lab.id}`;

        return (
            <React.Fragment key={lab.id}>
                <li className="nav-item d-flex align-items-center label-li"
                    style={{ paddingLeft: 16 + level * 18 }}>
                    {/* Expand/collapse caret for parent labels */}
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
                    {/* Spaceholder if not parent */}
                    {!isParent && <span style={{ width: 20, display: "inline-block" }} />}
                    {/* Label name, navigates on click */}
                    <a
                        href="#"
                        className={`nav-link flex-grow-1 ${currentTab === tabId ? 'active-tab' : ''}`}
                        onClick={e => { e.preventDefault(); onClickTab(tabId) }}
                    >{lab.name}</a>
                    {/* Context menu button (three dots) */}
                    <i
                        className="bi bi-three-dots-vertical ms-2"
                        style={{ cursor: 'pointer' }}
                        onClick={e => openCtx(e, lab)}
                    />
                </li>
                {/* Recursively render sublabels if expanded */}
                {isParent && isExpanded && lab.children.map(child =>
                    renderLabel(child, level + 1)
                )}
            </React.Fragment>
        );
    }

    // Render sidebar
    return (
        <div className={`sidebar ${theme} ${showSidebar ? 'show' : ''}`}>
            {/* Compose button (desktop only) */}
            <button className={`btn compose-button ${theme}`} onClick={onComposeClick}>
                <i className="bi bi-pencil-square me-2" /> Compose
            </button>

            {/* Folders (Inbox, Sent, etc.) */}
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

            {/* Labels header and add button */}
            <div className="labels-header d-flex align-items-center px-3 mt-4">
                <strong className="me-auto">Labels</strong>
                <i className="bi bi-plus-circle" style={{ cursor: 'pointer' }} onClick={handleAddLabel} />
            </div>

            {/* Labels tree, supports sublabels and indentation */}
            <ul className="nav nav-pills flex-column mt-1">
                {buildLabelTree(labels).map(lab => renderLabel(lab))}
            </ul>

            {/* Context menu for editing/removing/adding sublabels */}
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