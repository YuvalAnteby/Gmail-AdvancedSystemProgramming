"use client";

import React, { useState, useEffect } from "react";
import { sendNewMail } from "../../api/mailApi";
//import { searchUsersByEmail } from "../../api/userApi"; // when we switch to a real API
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ComposeEmail.css";

const users = [
    { id: 1, fullName: "Yuval Anteby", mail: "yuval@gmail.com" },
    { id: 2, fullName: "Dor Darmon", mail: "dor@gmail.com" },
    { id: 3, fullName: "Roee Chaim", mail: "roee@gmail.com" },
];

export default function ComposeEmail({
                                         userId,
                                         theme,
                                         onCancel,
                                         onSend,
                                         onExpand,
                                         isExpanded,
                                     }) {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [toInput, setToInput] = useState("");
    const [toSuggestions, setToSuggestions] = useState([]);
    const [toList, setToList] = useState([]);

    useEffect(() => {
        if (toInput.length >= 2) {
            const filtered = users.filter(
                (u) =>
                    u.mail.toLowerCase().includes(toInput.toLowerCase()) &&
                    !toList.some((added) => added.id === u.id)
            );
            setToSuggestions(filtered);
        } else {
            setToSuggestions([]);
        }
    }, [toInput, toList]);

    const handleSend = async () => {
        try {
            const recipients = toList.map((u) => u.mail);
            const mailData = {
                subject,
                body,
                sentTo: recipients,
                saveAsDraft: false,
            };
            const newMail = await sendNewMail(userId, mailData);
            console.log("Email sent successfully:", newMail);
            onSend(newMail);
        } catch (error) {
            console.error("Failed to send email:", error);
        }
    };

    const handleAutoSaveDraftAndClose = async () => {
        const hasContent =
            subject.trim() || body.trim() || toList.length > 0;
        if (!hasContent) {
            onCancel();
            return;
        }

        try {
            const mailData = {
                subject,
                body,
                sentTo: toList.map((u) => u.mail),
                saveAsDraft: true,
            };
            await sendNewMail(userId, mailData);
            console.log("Draft auto-saved");
        } catch (err) {
            console.error("Failed to auto-save draft:", err);
        } finally {
            onCancel();
        }
    };

    return (
        <div className={`compose-email ${theme} ${isExpanded ? "expanded" : ""}`}>
            <div className="compose-header">
                <span className="compose-title">New Message</span>
                <div className="compose-controls">
                    <button
                        className="control-btn"
                        title="Minimize"
                        onClick={handleAutoSaveDraftAndClose}
                    >
                        <i className="bi bi-dash"></i>
                    </button>
                    <button
                        className="control-btn"
                        title={isExpanded ? "Collapse" : "Expand"}
                        onClick={onExpand}
                    >
                        <i
                            className={`bi ${
                                isExpanded ? "bi-fullscreen-exit" : "bi-fullscreen"
                            }`}
                        ></i>
                    </button>
                    <button
                        className="control-btn"
                        title="Close"
                        onClick={handleAutoSaveDraftAndClose}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            <div className="compose-body">
                <div className="compose-field">
                    <span className="field-label">To</span>
                    <div className="to-input-wrapper">
                        {toList.map((user) => (
                            <span key={user.id} className="email-tag">
                {user.mail}
                                <i
                                    className="bi bi-x"
                                    onClick={() =>
                                        setToList(toList.filter((u) => u.id !== user.id))
                                    }
                                />
              </span>
                        ))}
                        <input
                            type="text"
                            value={toInput}
                            onChange={(e) => setToInput(e.target.value)}
                            className="field-input"
                            placeholder="Type email..."
                        />
                    </div>
                    {toSuggestions.length > 0 && (
                        <ul className="autocomplete-list">
                            {toSuggestions.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => {
                                        setToList([...toList, user]);
                                        setToInput("");
                                        setToSuggestions([]);
                                    }}
                                >
                                    {user.fullName} &lt;{user.mail}&gt;
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
                        onChange={(e) => setSubject(e.target.value)}
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
                    onChange={(e) => setBody(e.target.value)}
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
