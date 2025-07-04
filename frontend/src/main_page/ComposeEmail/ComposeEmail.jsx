'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../utils/useTheme';
import { sendMail, updateMail } from '../../api/mailApi';
import { searchUsers } from '../../api/userApi';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ComposeEmail.css';

import {
    execCommand,
    handleFileAttachments
} from '../../utils/composeUtils';

/**
 * ComposeEmail component: Handles sending or saving emails and drafts
 * @param {function} onCancel - Called when closing or discarding the window
 * @param {function} onSend   - Called after successfully sending
 * @param {number} offset     - How far to offset the window (for stacking)
 * @param {object|null} draftMail - If present, editing a draft
 */
export default function ComposeEmail({
                                         onCancel,
                                         onSend,
                                         offset = 0,
                                         draftMail = null
                                     }) {
    const { theme } = useTheme();

    // States for fields
    const [toQuery, setToQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [subject, setSubject] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [view, setView] = useState('normal'); // minimized, maximized, normal

    // Store the current editor text in state so it survives minimize/maximize
    const [editorHtml, setEditorHtml] = useState('');
    const editorRef = useRef(null);
    const attachRef = useRef(null);

    // On editing a draft, prefill all fields only when draftMail changes
    useEffect(() => {
        if (!draftMail) return;
        setRecipients(draftMail.sentTo.map(u => u.mail));
        setSubject(draftMail.subject || '');
        setEditorHtml(draftMail.body || ''); // Only set state!
        setAttachments(draftMail.attachments || []);
        setToQuery('');
        setSuggestions([]);
    }, [draftMail]);

    // When the editor is mounted or draftMail/view changes, set initial value only once
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = editorHtml;
        }
        // Do not update when editorHtml changes! Only on draft/view switch.
        // eslint-disable-next-line
    }, [draftMail, view]);

    // Autocomplete for "To" field
    useEffect(() => {
        const timer = setTimeout(() => {
            if (toQuery.length >= 1) {
                searchUsers(toQuery).then(setSuggestions);
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [toQuery]);

    // Add recipient if not already present
    const addRecipient = email => {
        const e = email.trim();
        if (e && !recipients.includes(e)) {
            setRecipients(prev => [...prev, e]);
        }
        setToQuery('');
        setSuggestions([]);
    };
    const removeRecipient = email => {
        setRecipients(prev => prev.filter(e => e !== email));
    };
    const handleKeyDown = e => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addRecipient(toQuery);
        }
    };

    // Send or save as draft (uses state for editorHtml)
    const postMail = async saveAsDraft => {
        if (!saveAsDraft && !recipients.length) {
            alert('Add at least one recipient.');
            return;
        }
        const body = editorHtml;
        if (draftMail?.id) {
            await updateMail(draftMail.id, {
                subject,
                body,
                sentTo: recipients,
                saveAsDraft,
                files: attachments
            });
        } else {
            await sendMail({
                subject,
                body,
                sentTo: recipients,
                saveAsDraft,
                files: attachments
            });
        }
    };

    // Handlers for the toolbar and window controls
    const handleSend = async () => {
        await postMail(false);
        onSend?.();
    };
    const handleClose = async () => {
        // Only save draft if there is at least one recipient
        if (recipients.length > 0) {
            await postMail(true);
        }
        onCancel();
    };
    const handleDiscard = () => {
        onCancel();
    };
    const toggleMinimize = () => setView(v => v === 'minimized' ? 'normal' : 'minimized');
    const toggleMaximize = () => setView(v => v === 'maximized' ? 'normal' : 'maximized');
    const rightOffset = `calc(2vw + ${offset * 36}vw)`;

    return (
        <div
            className={`compose-email ${view} ${theme}`}
            style={{ right: rightOffset }}
        >
            <div className="compose-header">
                <span className="compose-title">
                    {draftMail ? 'Edit Draft' : 'New Message'}
                </span>
                <div className="compose-controls">
                    <button className="control-btn" onClick={toggleMinimize}>
                        <i className="bi bi-dash"></i>
                    </button>
                    <button className="control-btn" onClick={toggleMaximize}>
                        <i className="bi bi-fullscreen"></i>
                    </button>
                    <button className="control-btn" onClick={handleClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            {view !== 'minimized' && (
                <>
                    <div className="compose-body">
                        {/* To: field with recipient chips and autocomplete */}
                        <div className="compose-field" style={{ flexWrap: 'wrap' }}>
                            <span className="field-label">To</span>
                            <div className="recipient-input-container">
                                {recipients.map(email => (
                                    <span key={email} className="recipient-chip">
                                        {email}
                                        <button onClick={() => removeRecipient(email)}>×</button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    className="field-input to-input"
                                    placeholder="Type a name or email"
                                    value={toQuery}
                                    onChange={e => setToQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map(u => (
                                        <li key={u.id} onClick={() => addRecipient(u.mail)}>
                                            {u.mail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Subject input */}
                        <div className="compose-field">
                            <span className="field-label">Subject</span>
                            <input
                                type="text"
                                className="field-input"
                                placeholder="Subject"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                            />
                        </div>

                        {/* Rich text formatting toolbar */}
                        <div className="compose-toolbar">
                            <button onClick={() => execCommand(editorRef, 'bold')}><b>B</b></button>
                            <button onClick={() => execCommand(editorRef, 'italic')}><i>I</i></button>
                            <button onClick={() => execCommand(editorRef, 'underline')}><u>U</u></button>
                            <button onClick={() => {
                                let url = prompt('Enter URL:');
                                // If url exists and does not start with http:// or https://, prepend https://
                                if (url && !/^https?:\/\//i.test(url)) {
                                    url = 'https://' + url;
                                }
                                if (url) execCommand(editorRef, 'createLink', url);
                            }}>
                                <i className="bi bi-link-45deg"></i>
                            </button>
                            <select
                                className="font-size-select"
                                defaultValue="3"
                                onChange={e => execCommand(editorRef, 'fontSize', e.target.value)}
                            >
                                <option value="2">Small</option>
                                <option value="3">Normal</option>
                                <option value="4">Medium</option>
                                <option value="5">Large</option>
                            </select>
                        </div>

                        {/* Editable email body. Use onInput to track the text in state for persistence. */}
                        <div
                            ref={editorRef}
                            className="compose-editor"
                            contentEditable
                            suppressContentEditableWarning
                            onInput={e => setEditorHtml(e.currentTarget.innerHTML)}
                            dir="ltr" // Force left-to-right typing only in the editor!
                        />

                        {/* Attachments (if any) */}
                        {attachments.length > 0 && (
                            <ul className="attachment-list">
                                {attachments.map((file, index) => (
                                    <li key={index} className="attachment-item">
                                        <i className="bi bi-paperclip"></i>
                                        <span className="file-name" title={file.name}>{file.name}</span>
                                        <button
                                            className="remove-btn"
                                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer: attach, send, discard */}
                    <div className="compose-footer">
                        <button className="footer-attach-btn" onClick={() => attachRef.current.click()}>
                            <i className="bi bi-paperclip"></i>
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={attachRef}
                            style={{display: 'none' }}
                            onChange={e => handleFileAttachments(setAttachments, e)}
                        />

                        <div className="footer-right">
                            <button className="send-btn" onClick={handleSend}>
                                Send <i className="bi bi-send-fill"></i>
                            </button>
                            <button className="discard-btn" onClick={handleDiscard}>
                                Discard
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}