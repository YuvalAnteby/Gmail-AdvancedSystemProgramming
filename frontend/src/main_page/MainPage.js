import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";
import EmailSidebar from "./EmailSideMenu/EmailSideMenu";
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import TopMenu from "./top_menu/TopMenu";
import ComposeEmail from "./ComposeEmail/ComposeEmail";
import { useLocation } from "react-router-dom";
import { useMailToolbarHandlers } from "./hooks/useMailToolbarHandlers";
import { useMails } from "./hooks/useMails";
import { useTheme } from "../utils/useTheme";
import { useRequireAuth } from "../utils/useAutoLogin";
import SkeletonEmail from "../components/loading/SkeletonEmail";
import useIsMobile from "../utils/useIsMobile";

const MainPage = () => {
    useRequireAuth();

    const isMobile = useIsMobile();
    const { theme, toggleTheme } = useTheme("dark");
    const location = useLocation();

    const [inboxType, setInboxType] = useState(
        location.state?.inboxType || "incoming"
    );
    const [composes, setComposes] = useState([]);

    const handleOpenDraft = draftEmail => {
        setComposes(cs => {
            if (cs.length >= 2) return cs;
            return [...cs, { id: draftEmail.id, offset: cs.length, draftMail: draftEmail }];
        });
    };

    const handleComposeClick = () => {
        setComposes(cs => {
            if (cs.length >= 2) return cs;
            return [...cs, { id: Date.now(), offset: cs.length }];
        });
    };

    const handleCloseCompose = id => {
        setComposes(cs =>
            cs
                .filter(c => c.id !== id)
                .map((c, i) => ({ ...c, offset: i }))
        );
    };

    const {
        emails,
        total,
        page,
        hasNextPage,
        hasPrevPage,
        goToNextPage,
        goToPrevPage,
        refreshMails,
        loading
    } = useMails(inboxType);

    const [selectedMails, setSelectedMails] = useState(new Set());

    const handlers = useMailToolbarHandlers(
        selectedMails,
        setSelectedMails,
        emails,
        refreshMails,
    );

    const handleSelect = (mail, checked) => {
        setSelectedMails(prev => {
            const copy = new Set(prev);
            checked ? copy.add(mail) : copy.delete(mail);
            return copy;
        });
    };

    const [showSidebar, setShowSidebar] = useState(() => !isMobile);
    useEffect(() => setShowSidebar(!isMobile), [isMobile]);

    useEffect(() => {
        if (location.state?.inboxType) {
            setInboxType(location.state.inboxType);
            setSelectedMails(new Set());
        }
    }, [location.state?.inboxType]);
    return (
        <div className={`main-page ${theme}`}>
            <TopMenu
                theme={theme}
                toggleTheme={toggleTheme}
                inboxType={inboxType}
                setShowSidebar={setShowSidebar}
            />

            <div className="main-content row g-0">
                <div className="col-md-2 p-0">
                    <EmailSidebar
                        theme={theme}
                        currentTab={inboxType}
                        setCurrentTab={setInboxType}
                        onComposeClick={handleComposeClick}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                        clearSelection={handlers.clearSelection}
                        refreshMails={refreshMails}
                    />
                </div>

                <div className="col-md-10 p-0">
                    <ToolBar
                        theme={theme}
                        inboxType={inboxType}
                        mailsAmount={emails.length}
                        selectedMails={selectedMails}
                        btnHandlers={handlers}
                        total={total}
                        page={page}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                        goToNextPage={goToNextPage}
                        goToPrevPage={goToPrevPage}
                        refreshMails={refreshMails}
                    />
                    {loading ? (
                        <SkeletonEmail rows={10} />
                    ) : (
                        emails.map(email => (
                            <MailRow
                                key={email.id}
                                theme={theme}
                                email={email}
                                inboxType={inboxType}
                                isSelected={selectedMails.has(email)}
                                onSelect={handleSelect}
                                onUpdate={refreshMails}
                                onOpenDraft={handleOpenDraft}
                            />
                        ))
                    )}
                </div>
            </div>

            {composes.map(c => (
                <ComposeEmail
                    key={`${c.id}-${theme}`}
                    theme={theme}
                    offset={c.offset}
                    draftMail={c.draftMail}
                    onCancel={() =>{ handleCloseCompose(c.id);
                        refreshMails();}}
                    onSend={() => {
                        handleCloseCompose(c.id);
                        refreshMails();
                    }}
                />
            ))}

        </div>
    );
};

export default MainPage;