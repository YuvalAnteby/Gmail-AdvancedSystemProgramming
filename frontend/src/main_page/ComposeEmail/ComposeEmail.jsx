"use client";
import React, { useState, useEffect } from 'react';
import { sendMail } from "../../api/mailApi";
import { searchUsers } from "../../api/userApi";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ComposeEmail.css';

export default function ComposeEmail({ onCancel, onSend }) {
    const [toQuery, setToQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (toQuery.length >= 2 && !selectedUser) {
                searchUsers(toQuery).then(setSuggestions);
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [toQuery, selectedUser]);

    const handleSend = async () => {
        const toEmail = toQuery.trim();
        if (!selectedUser && !toEmail) {
            alert("Please select or type a valid recipient.");
            return;
        }

        try {
            const sentTo = selectedUser
                ? [selectedUser.mail]
                : [toEmail];



            const newMail = await sendMail({
                subject,
                body,
                sentTo
            });

            console.log("Mail sent:", newMail);
            if (onSend) onSend(); // optional callback
        } catch (err) {
            console.error("Failed to send mail:", err);
            alert("Failed to send mail: " + err.message);
        }
    };

    return (
        <div className="compose-email">
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

            <div className="compose-body">
                <div className="compose-field" style={{ position: 'relative' }}>
                    <span className="field-label">To</span>
                    <input
                        type="text"
                        value={ selectedUser ? selectedUser.mail : toQuery }

                        onChange={e => {
                            setToQuery(e.target.value);
                            setSelectedUser(null);
                        }}
                        className="field-input"
                        placeholder="Type a name or email"
                    />
                    {suggestions.length > 0 && !selectedUser && (
                        <ul className="suggestions-list">
                            {suggestions.map(user => (
                                <li
                                    key={user.id}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setToQuery(user.mail);
                                        setSuggestions([]);
                                    }}

                                >
                                    {user.mail}
                                </li>
                            ))}
                        </ul>
                    )}
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
