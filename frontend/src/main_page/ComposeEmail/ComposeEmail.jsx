'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../utils/useTheme';
import { sendMail, updateMail } from '../../api/mailApi';
import { searchUsers }           from '../../api/userApi';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ComposeEmail.css';

import {
    execCommand,
    insertInlineImage,
    handleFileAttachments
} from '../../utils/composeUtils'

export default function ComposeEmail({
                                         onCancel,
                                         onSend,
                                         offset = 0,
                                         draftMail = null
                                     }) {
    const { theme } = useTheme();

    const [toQuery, setToQuery]         = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recipients, setRecipients]   = useState([]);
    const [subject, setSubject]         = useState('');
    const [attachments, setAttachments] = useState([]);
    const [view, setView]               = useState('normal');

    const editorRef      = useRef(null);
    const inlineImageRef = useRef(null);
    const attachRef      = useRef(null);

    // Prefill when editing
    useEffect(() => {
        if (!draftMail) return;
        setRecipients(draftMail.sentTo.map(u => u.mail));
        setSubject(draftMail.subject || '');
        if (editorRef.current) {
            editorRef.current.innerHTML = draftMail.body || '';
        }
        setAttachments(draftMail.attachments || []);
        setToQuery('');
        setSuggestions([]);
    }, [draftMail]);

    // Autocomplete “To”
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

    // Send or save draft
    const postMail = async saveAsDraft => {
        if (!recipients.length) {
            alert('Add at least one recipient.');
            return;
        }
        const body = editorRef.current.innerHTML;
        if (draftMail?.id) {
            await updateMail(draftMail.id, {
                subject,
                body,
                sentTo: recipients,
                saveAsDraft
            });
        } else {
            await sendMail({
                subject,
                body,
                sentTo: recipients,
                attachments,
                saveAsDraft
            });
        }
    };

    const handleSend     = async () => { await postMail(false); onSend?.(); };
    const handleClose    = async () => { await postMail(true);  onCancel(); };
    const toggleMinimize = () => setView(v => v==='minimized' ? 'normal' : 'minimized');
    const toggleMaximize = () => setView(v => v==='maximized' ? 'normal' : 'maximized');

    const rightOffset = `calc(2vw + ${offset * 36}vw)`;

    return (
        <div
            className={`compose-email ${view} ${theme}`}
            dir="ltr"
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
                        {/* To */}
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

                        {/* Subject */}
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

                        {/* Toolbar */}
                        <div className="compose-toolbar">
                            <button onClick={() => execCommand(editorRef, 'bold')}><b>B</b></button>
                            <button onClick={() => execCommand(editorRef, 'italic')}><i>I</i></button>
                            <button onClick={() => execCommand(editorRef, 'underline')}><u>U</u></button>
                            <button onClick={() => {
                                const url = prompt('Enter URL:');
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

                            <button onClick={() => inlineImageRef.current.click()}>
                                <i className="bi bi-image"></i>
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={inlineImageRef}
                                style={{ display: 'none' }}
                                onChange={e => insertInlineImage(editorRef, e)}
                            />
                        </div>

                        {/* Editor */}
                        <div
                            ref={editorRef}
                            className="compose-editor"
                            contentEditable
                            suppressContentEditableWarning
                        />

                        {/* Attachments */}
                        {attachments.length > 0 && (
                            <ul className="attachment-list">
                                {attachments.map((att, i) => <li key={i}>{att.name}</li>)}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="compose-footer">
                        <button className="footer-attach-btn" onClick={() => attachRef.current.click()}>
                            <i className="bi bi-paperclip"></i>
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={attachRef}
                            style={{ display: 'none' }}
                            onChange={e => handleFileAttachments(setAttachments, e)}
                        />

                        <div className="footer-right">
                            <button className="send-btn" onClick={handleSend}>
                                Send <i className="bi bi-send-fill"></i>
                            </button>
                            <button className="discard-btn" onClick={handleClose}>
                                Discard
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
