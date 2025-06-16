"use client";

import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ComposeEmail.css';

export default function ComposeEmail({ onCancel, onSend }) {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSend = () => {
        onSend({ to, subject, body });
    };

    return (
        <div className="compose-email">
            {/* Header with title and controls */}
            <div className="compose-header">
                <span className="compose-title">New Message</span>
                <div className="compose-controls">
                    <button className="control-btn" title="Minimize">
                        <i className="bi bi-dash"></i>
                    </button>
                    <button className="control-btn" title="Expand">
                        <i className="bi bi-fullscreen"></i>
                    </button>
                    <button className="control-btn" onClick={onCancel} title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            {/* Body with “To”, “Subject” and formatting toolbar */}
            <div className="compose-body">
                <div className="compose-field">
                    <span className="field-label">To</span>
                    <input
                        type="email"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="field-input"
                        placeholder="recipient@example.com"
                    />
                </div>
                <div className="compose-field">
                    <span className="field-label">Subject</span>
                    <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="field-input"
                        placeholder="Subject"
                    />
                </div>

                <div className="compose-toolbar">
                    <i className="bi bi-type-bold"></i>
                    <i className="bi bi-type-italic"></i>
                    <i className="bi bi-type-underline"></i>
                    <i className="bi bi-link-45deg"></i>
                    <i className="bi bi-image"></i>
                    <i className="bi bi-list-ul"></i>
                </div>

                <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    className="compose-textarea"
                    placeholder="Compose your email..."
                />
            </div>

            {/* Footer with attach, send and discard buttons */}
            <div className="compose-footer">
                <div className="footer-left">
                    <button className="attach-btn" title="Attach files">
                        <i className="bi bi-paperclip"></i>
                    </button>
                </div>
                <div className="footer-right">
                    <button className="send-btn" onClick={handleSend}>
                        Send <i className="bi bi-send-fill"></i>
                    </button>
                    <button className="discard-btn" onClick={onCancel}>
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
}
