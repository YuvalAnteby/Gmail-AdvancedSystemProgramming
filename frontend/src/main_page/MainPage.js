import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css'
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import {useMailToolbarHandlers} from "./toolbar/useMailToolbarHandlers";


/// TODO replace the placeholders with the real menus and real data
// Placeholder for top menu
const TopMenuPlaceholder = ({theme}) => (
    <div className={`${theme}-custom-navbar`}>Top menu</div>
);
// Placeholder for side menu
const SideMenuPlaceholder = ({theme}) => (
    <div className={`${theme}-custom-sidenav`}>Side menu</div>
);

const DUMMY_EMAILS = [
    {
        id: 1,
        sender: "alice@example.com",
        subject: "Project update",
        snippet: "Here’s what we changed in v2.0...",
        date: "2025/06/04",
        is_read: true
    },
    {
        id: 2,
        sender: "bob@work.org",
        subject: "Meeting reminder",
        snippet: "Don’t forget the team meeting at 9AM tomorrow.",
        date: "2025/06/03",
        is_read: true
    },
    {
        id: 3,
        sender: "newsletter@site.com",
        subject: "Your daily digest",
        snippet: "Top tech news today: React 21.0 is out...",
        date: "2025/06/02",
        is_read: false
    },
    {
        id: 4,
        sender: "bob@work.org",
        subject: "blublublu",
        snippet: "Don’t forget....",
        date: "2025/06/03",
        is_read: true
    }
];

const MainPage = ({theme}) => {
    const allEmailIds = DUMMY_EMAILS.map((mail) => mail.id);


    const [selectedIds, setSelectedIds] = useState(new Set());
    const allSelected = selectedIds.size === DUMMY_EMAILS.length;
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
                        {DUMMY_EMAILS.map((email) => (
                            <MailRow
                                theme={theme}
                                key={email.id}
                                id={email.id}
                                sender={email.sender}
                                subject={email.subject}
                                body={email.snippet}
                                date={email.date}
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