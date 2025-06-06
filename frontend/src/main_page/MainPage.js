import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css'
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import {useMailToolbarHandlers} from "./toolbar/useMailToolbarHandlers";
import {getMails} from "../api/mailApi";


/// TODO replace the placeholders with the real menus and real data
// Placeholder for top menu
const TopMenuPlaceholder = ({theme}) => (
    <div className={`${theme}-custom-navbar`}>Top menu</div>
);
// Placeholder for side menu
const SideMenuPlaceholder = ({theme}) => (
    <div className={`${theme}-custom-sidenav`}>Side menu</div>
);

const MainPage = ({theme}) => {
    const userId = 1; /// TODO replace with JWT
    const [emails, setEmails] = useState([]);
    const allEmailIds = emails.map((mail) => mail.id);

    // Function that fetches mails from the server & puts them into state
    const refreshMails = async () => {
        try {
            const data = await getMails(userId);
            // assuming data is an array like [{ id, sender, subject, snippet, date, read, ... }, …]
            setEmails(data);
        } catch (err) {
            console.error("Failed to fetch mails:", err);
            // You could set an error state here to show a notification
        }
    };

    // (B) On mount, fetch inbox once
    useEffect(() => {
        refreshMails();
    }, []);

    const [selectedIds, setSelectedIds] = useState(new Set());
    const allSelected = selectedIds.size === emails.length;
    const anySelected = selectedIds.size > 0;

    const handlers = useMailToolbarHandlers(selectedIds, setSelectedIds, allEmailIds);

    const handleSelect = (id, isChecked) => {
        setSelectedIds((prev) => {
            const copy = new Set(prev);
            if (isChecked) copy.add(id);
            else copy.delete(id);
            return copy;
        });
    };


    return (
        <div className={`container-fluid p-3 ${theme}-main-page`}>
            {/* ---- TODO TOP MENU ---- */}
            <div className="row mb-3"><div className="col-12"><TopMenuPlaceholder theme={theme}/></div></div>
            {/* ---- MAIN LAYOUT ---- */}
            <div className="row">
                {/* ---- TODO SIDE MENU ---- */}
                <div className="col-md-3 mb-3 custom-side-col"><SideMenuPlaceholder theme={theme}/></div>
                {/* ---- MAIL LIST CONTAINER ---- */}
                <div className="col-md-9 mb-3">
                    <div className={`${theme}-mail-container`}
                         style={{backgroundColor: `var(--${theme}-bg-unread-mail-row)`}}>
                        {/* ---- TOOLBAR ---- */}
                        <ToolBar
                            allSelected={allSelected}
                            anySelected={anySelected}
                            handleSelectAll={handlers.handleSelectAll}
                            handleRefresh={handlers.handleRefresh}
                            handleDelete={handlers.handleDelete}
                            handleMarkAsRead={handlers.handleMarkAsRead}
                            handleMarkSpam={handlers.handleMarkSpam}
                        />
                        {/* ---- ACTUAL MAIL ROWS ---- */}
                        {emails.map((email) => (
                            <MailRow
                                theme={theme}
                                key={email.id}
                                id={email.id}
                                sender={email.from}
                                subject={email.subject}
                                body={email.body}
                                date={email.sentAt || email.createdAt}
                                isRead={email.is_read}
                                isSelected={selectedIds.has(email.id)}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;