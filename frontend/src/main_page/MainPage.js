import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css'
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import {useMailToolbarHandlers} from "./hooks/useMailToolbarHandlers";
import {useMails} from "./hooks/useMails";

const DEFAULT_USER_ID = 1; /// TODO replace with JWT


/// TODO replace the placeholders with the real menus and real data
// Placeholder for top menu
const TopMenuPlaceholder = () => (
    <div style={{
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)',
        borderRadius: 0,
        alignContent: 'center',
        padding: '20px',
        color: 'black',
        backgroundColor: '#ffef37'
    }}
    >
        Top menu
    </div>
);
// Placeholder for side menu
const SideMenuPlaceholder = () => (
    <div
        style={{
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)',
            width: '100%',
            height: '100%',
            margin: 0,
            paddingTop: '20px',
            alignContent: 'center',
            color: 'black',
            backgroundColor: '#fff343'
        }}
    >
        Side menu
    </div>
);

const MainPage = ({theme}) => {
    const userId = DEFAULT_USER_ID;

    const [inboxType, setInboxType] = useState('incoming');
    const {emails, refreshMails} = useMails(userId, inboxType);

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


    return (
        <div className={`main-page ${theme}`}>
            {/* ---- TODO TOP MENU ---- */}
            <div className="col-12"><TopMenuPlaceholder theme={theme}/></div>
            {/* ---- MAIN LAYOUT ---- */}
            <div className="main-content">
                {/* ---- TODO SIDE MENU ---- */}
                <div className="col-md-3"><SideMenuPlaceholder theme={theme}/></div>
                {/* ---- MAIL LIST CONTAINER ---- */}
                <div className="col-md-9">
                    <div className={`mail-list-container ${theme}`}>
                        {/* ---- TOOLBAR ---- */}
                        <ToolBar
                            theme={theme}
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
                                userId={userId}
                                email={email}
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