import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css';
import EmailSidebar from "./EmailSideMenu/EmailSideMenu";
import MailRow from "./mail_row/MailRow";
import ToolBar from "./toolbar/ToolBar";
import TopMenu from "./top_menu/TopMenu";
import {useLocation} from "react-router-dom";
import ComposeEmail from "./ComposeEmail/ComposeEmail";
import {useMailToolbarHandlers} from "./hooks/useMailToolbarHandlers";
import {useMails} from "./hooks/useMails";
import {useTheme} from "../utils/useTheme";
import {useRequireAuth} from "../utils/useAutoLogin";
import SkeletonEmail from "../components/loading/SkeletonEmail";
import useIsMobile from "../utils/useIsMobile";


const MainPage = () => {
    // ensure the user is authenticated before rendering
    useRequireAuth();

    const isMobile = useIsMobile();
    const {theme, toggleTheme} = useTheme('dark');
    const location = useLocation();

    // views change hooks
    const [inboxType, setInboxType] = useState(location.state?.inboxType || 'incoming');
    const [showCompose, setShowCompose] = useState(false);
    const [showSidebar, setShowSidebar] = useState(() => !isMobile);

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

    // selected mail ids logic
    const [selectedMails, setSelectedMails] = useState(new Set());
    const allSelected = selectedMails.size === emails.length;
    const anySelected = selectedMails.size > 0;

    const handlers = useMailToolbarHandlers(
        selectedMails,
        setSelectedMails,
        emails,
        refreshMails
    );

    // handles mails selection
    const handleSelect = (mail, isChecked) => {
        setSelectedMails(prev => {
            const copy = new Set(prev);
            if (isChecked) copy.add(mail);
            else copy.delete(mail);
            return copy;
        });
    };

    // clicking the Compose button
    const handleComposeClick = () => {
        setComposes((cs) => {
            if (cs.length >= 2) return cs // max 2 windows
            return [...cs, { id: Date.now(), offset: cs.length }]
        })
    }

    // remove a compose window by id
    const handleCloseCompose = (id) => {
        setComposes((cs) =>
            cs
                .filter((c) => c.id !== id)
                .map((c, i) => ({ ...c, offset: i })) // reassign offsets
        )
        refreshMails()
    }

    // side menu un/show update
    useEffect(() => {
        setShowSidebar(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = showSidebar ? "hidden" : "auto"
        }
    }, [showSidebar, isMobile])

    // handle URL/state changes
    useEffect(() => {
        if (location.state?.inboxType) {
            setInboxType(location.state.inboxType)
        }
    }, [location.state?.inboxType])

    return (
        <div className={`main-page ${theme}`}>
            {/* ---- TOP MENU ---- */}
            <div className="row mb-3">
                <div className="col-12">
                    <TopMenu
                        theme={theme}
                        toggleTheme={toggleTheme}
                        inboxType={inboxType}
                        setShowSidebar={setShowSidebar}
                    />
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
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                </div>
                {isMobile && showSidebar && (
                    <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)} />
                )}

                {/* ---- MAIL LIST ---- */}
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
                        />
                        {loading && <SkeletonEmail rows={10} />}
                        {!loading &&
                            emails.map((email) => (
                                <MailRow
                                    key={email.id}
                                    theme={theme}
                                    email={email}
                                    inboxType={inboxType}
                                    isSelected={selectedMails.has(email.id)}
                                    onSelect={handleSelect}
                                    onUpdate={refreshMails}
                                    onOpenDraft={handleOpenDraft} // pass draft-opener
                                />
                            ))}
                    </div>
                </div>
            </div>

            {/* ---- COMPOSE WINDOWS (up to 2 side by side) ---- */}
            {composes.map((c) => (
                <ComposeEmail
                    key={c.id}
                    theme={theme}           // pass theme here
                    offset={c.offset}       // horizontal stacking
                    draftMail={c.draftMail} // undefined for new compose
                    onCancel={() => handleCloseCompose(c.id)}
                    onSend={() => handleCloseCompose(c.id)}
                />
            ))}
        </div>
    )
}

export default MainPage
