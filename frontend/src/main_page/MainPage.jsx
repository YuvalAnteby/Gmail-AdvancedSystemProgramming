import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";
import EmailSidebar from "./EmailSideMenu/EmailSideMenu";
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import { useMailToolbarHandlers } from "./hooks/useMailToolbarHandlers";
import { useMails } from "./hooks/useMails";
import TopMenu from "./top_menu/TopMenu";
import { useLocation } from "react-router-dom";
import ComposeEmail from "./ComposeEmail/ComposeEmail";

const DEFAULT_USER_ID = 1; // TODO replace with JWT

const MainPage = ({ theme, setTheme }) => {
    const userId = DEFAULT_USER_ID;
    const location = useLocation();
    const [inboxType, setInboxType] = useState(location.state?.inboxType || "all");
    const [showCompose, setShowCompose] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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
        error,
    } = useMails(userId, inboxType);

    const [selectedMails, setSelectedMails] = useState(new Set());
    const allSelected = selectedMails.size === emails.length;
    const anySelected = selectedMails.size > 0;

    const handlers = useMailToolbarHandlers(
        userId,
        selectedMails,
        setSelectedMails,
        emails,
        refreshMails
    );

    const handleSelect = (mail, isChecked) => {
        setSelectedMails((prev) => {
            const copy = new Set(prev);
            if (isChecked) copy.add(mail);
            else copy.delete(mail);
            return copy;
        });
    };

    useEffect(() => {
        if (location.state?.inboxType) {
            setInboxType(location.state.inboxType);
        }
    }, [location.state?.inboxType]);

    const handleComposeClick = () => setShowCompose(true);
    const handleCancelCompose = () => setShowCompose(false);
    const handleSendCompose = (mail) => {
        setShowCompose(false);
        refreshMails();
    };

    return (
        <div className={`main-page ${theme}`}>
            <div className="row mb-3">
                <div className="col-12">
                    <TopMenu theme={theme} setTheme={setTheme} userId={userId} />
                </div>
            </div>

            <div className="main-content row g-0">
                <div className="col-md-2 p-0">
                    <EmailSidebar
                        theme={theme}
                        currentTab={inboxType}
                        setCurrentTab={setInboxType}
                        onComposeClick={handleComposeClick}
                    />
                </div>

                <div className="col-md-10 p-0">
                    <div className={`mail-list-container ${theme}`}>
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

                        {emails.map((email) => (
                            <MailRow
                                key={email.id}
                                theme={theme}
                                userId={userId}
                                email={email}
                                isSelected={[...selectedMails].some((m) => m.id === email.id)}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {showCompose && (
                <ComposeEmail
                    theme={theme}
                    userId={userId}
                    isExpanded={isExpanded}
                    onCancel={() => {
                        setShowCompose(false);
                        setIsExpanded(false);
                    }}
                    onSend={() => {
                        setShowCompose(false);
                        setIsExpanded(false);
                        refreshMails();
                    }}
                    onExpand={() => setIsExpanded((e) => !e)}
                />
            )}
        </div>
    );
};

export default MainPage;
