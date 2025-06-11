import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css'
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import {useMailToolbarHandlers} from "./hooks/useMailToolbarHandlers";
import {useMails} from "./hooks/useMails";
import TopMenu from "./top_menu/TopMenu";
import {useLocation} from "react-router-dom";

const DEFAULT_USER_ID = 1; /// TODO replace with JWT


/// TODO replace the placeholders with the real menus and real data
// Placeholder for side menu
const SideMenuPlaceholder = ({theme}) => (
    <div className={`${theme}-custom-sidenav`}>Side menu</div>
);

const MainPage = ({theme, setTheme}) => {
    const userId = DEFAULT_USER_ID;

    const location = useLocation();
    const [inboxType, setInboxType] = useState(location.state?.inboxType || 'all');
    const {emails, refreshMails } = useMails(userId, inboxType);

    // selected mail ids logic
    const [selectedIds, setSelectedIds] = useState(new Set());
    const allEmailIds = emails.map((mail) => mail.id);
    const allSelected = selectedIds.size === emails.length;
    const anySelected = selectedIds.size > 0;

    const handlers = useMailToolbarHandlers(
        userId,
        selectedIds,
        setSelectedIds,
        allEmailIds,
        refreshMails
    );

    const handleSelect = (id, isChecked) => {
        setSelectedIds((prev) => {
            const copy = new Set(prev);
            if (isChecked) copy.add(id);
            else copy.delete(id);
            return copy;
        });
    };

    // Update state when location.state.inboxType changes
    useEffect(() => {
        if (location.state?.inboxType) {
            setInboxType(location.state.inboxType);
        }
    }, [location.state?.inboxType]);

    return (
        <div className={`container-fluid p-3 ${theme}-main-page`}>
            {/* ---- TODO TOP MENU ---- */}
            <div className="row mb-3"><div className="col-12"><TopMenu theme={theme} setTheme={setTheme}/></div></div>
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
                                isRead={email.isRead}
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