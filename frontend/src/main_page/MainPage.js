import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css';
import EmailSidebar from "./EmailSideMenu/EmailSideMenu";
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import { useMailToolbarHandlers } from "./hooks/useMailToolbarHandlers";
import { useMails } from "./hooks/useMails";
import TopMenu from "./top_menu/TopMenu";
import { useLocation } from "react-router-dom";

const DEFAULT_USER_ID = 1; // TODO replace with JWT

const MainPage = ({ theme, setTheme }) => {
    const userId = DEFAULT_USER_ID;

    const location = useLocation();
    const [inboxType, setInboxType] = useState(location.state?.inboxType || 'all');
    const {
        emails,
        total,
        page,
        hasNextPage,
        hasPrevPage,
        goToNextPage,
        goToPrevPage,
        refreshMails,
        loading,
        error
    } = useMails(userId, inboxType);

    // selected mail ids logic
    const [selectedMails, setSelectedMails] = useState(new Set());
    const allEmails = emails;
    const allSelected = selectedMails.size === emails.length;
    const anySelected = selectedMails.size > 0;

    const handlers = useMailToolbarHandlers(
        userId,
        selectedMails,
        setSelectedMails,
        allEmails,
        refreshMails
    );

    // handle selection of mail using the checkbox
    const handleSelect = (mail, isChecked) => {
        setSelectedMails((prev) => {
            const copy = new Set(prev);
            if (isChecked) copy.add(mail);
            else copy.delete(mail);
            return copy;
        });
    };

    // Update state when location.state.inboxType changes
    useEffect(() => {
        if (location.state?.inboxType) {
            setInboxType(location.state.inboxType);
        }
    }, [location.state?.inboxType]);

    // Compose handler
    const handleComposeClick = () => {
        // TODO: open compose modal or navigate to compose view
        console.log('Compose clicked');
    };

    return (
        <div className={`main-page ${theme}`}>
            {/* ---- TOP MENU ---- */}
            <div className="row mb-3">
                <div className="col-12">
                    <TopMenu theme={theme} setTheme={setTheme} userId={userId} />
                </div>
            </div>

            {/* ---- MAIN LAYOUT ---- */}
            <div className="main-content row g-0">
                {/* ---- SIDE MENU ---- */}
                <div className="col-md-2 p-0">
                    <EmailSidebar
                        theme={theme}
                        currentTab={inboxType}
                        setCurrentTab={setInboxType}
                        onComposeClick={handleComposeClick}
                    />
                </div>

                {/* ---- MAIL LIST CONTAINER ---- */}
                <div className="col-md-10 p-0">
                    <div className={`mail-list-container ${theme}`}>
                        {/* ---- TOOLBAR ---- */}
                        <ToolBar
                            theme={theme}
                            inboxType={inboxType}
                            allSelected={allSelected}
                            anySelected={anySelected}
                            btnHandlers={handlers}
                            total={total}
                            page={page}
                            hasNextPage={hasNextPage}
                            hasPrevPage={hasPrevPage}
                            goToNextPage={goToNextPage}
                            goToPrevPage={goToPrevPage}
                            loading={loading}
                            error={error}
                        />

                        {/* ---- ACTUAL MAIL ROWS ---- */}
                        {emails.map((email) => (
                            <MailRow
                                theme={theme}
                                key={email.id}
                                userId={userId}
                                email={email}
                                isSelected={[...selectedMails].some((m) => m.id === email.id)}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
