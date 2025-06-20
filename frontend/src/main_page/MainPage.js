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

    // checks inbox type change
    useEffect(() => {
        if (location.state?.inboxType) {
            setInboxType(location.state.inboxType);
        }
    }, [location.state?.inboxType]);

    // handlers for mail compose
    const handleComposeClick = () => setShowCompose(true);
    const handleCancelCompose = () => setShowCompose(false);
    const handleSendCompose = mail => {
        // TODO: call your send-mail API
        // then close and refresh:
        setShowCompose(false);
        refreshMails();
    };

    // side menu un/show update
    useEffect(() => {
        setShowSidebar(!isMobile);
    }, [isMobile]);

    // disable mail list scroll when showing side menu on smaller screens
    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = showSidebar ? 'hidden' : 'auto';
        }
    }, [showSidebar, isMobile]);

    // regular screen
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
                {/* ---- SIDEBAR BACKDROP FOR SMALL SCREENS ---- */}
                {isMobile && showSidebar && (
                    <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)} />
                )}


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
                        />
                        {/* ---- loading screen ---- */}
                        {loading && (<SkeletonEmail rows={10}/>)}
                        {/* ---- ACTUAL MAIL ROWS ---- */}
                        {!loading && emails.map(email => (
                            <MailRow
                                key={email.id}
                                theme={theme}
                                email={email}
                                inboxType={inboxType}
                                isSelected={selectedMails.has(email.id)}
                                onSelect={handleSelect}
                                onUpdate={refreshMails}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- COMPOSE WINDOW ---- */}
            {showCompose && (
                <ComposeEmail
                    onCancel={handleCancelCompose}
                    onSend={handleSendCompose}
                />
            )}
        </div>
    );
};

export default MainPage;