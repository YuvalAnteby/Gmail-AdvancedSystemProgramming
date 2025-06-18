import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchEmail} from "../api/mailApi";
import {useTheme} from "../utils/useTheme";
import ReadingHeader from "./ReadingHeader/ReadingHeader";
import './ReadingPage.css'
import SenderDetails from "./SenderDetails/SenderDetails";
import {formatFullTime} from "../utils/formatDate";
import SkeletonEmail from "../components/loading/SkeletonEmail";

const ReadingPage = () => {

    // basic data
    const {id} = useParams();
    const {theme, toggleTheme} = useTheme();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const {inboxType} = location.state;

    // update the mail shown
    useEffect(() => {
        const loadEmail = async () => {
            try {
                setLoading(true);
                const mail = await fetchEmail(Number(id));
                setEmail(mail);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching email: ", error)
            }
        }
        loadEmail().then();
    }, [id])


    const onReplyClick = () => {
        /// TODO reply to mail
        alert("reply");
    }

    const onForwardClick = () => {
        /// TODO forward mail to someone
        alert("forward");
    }

    const handleStarToggle = (newStarValue) => {
        setEmail(prev => ({...prev, isStarred: newStarValue}));
    };

    return (
        <div className={`email-view ${theme}`}>
            {/* Header */}
            <ReadingHeader theme={theme} toggleTheme={toggleTheme} email={email} inboxType={inboxType}/>
            {/* content */}
            {loading ? (
                    <SkeletonEmail/>
                ) :
                (
                    <div className="email-view-content">
                        <h1 className="email-view-title">{email.subject}</h1>
                        {/* sender's info */}
                        <div className={`email-view-meta ${theme}`}>
                            <SenderDetails email={email} theme={theme} onUpdate={handleStarToggle}/>
                            {/* TODO FIXME */}
                            <div className="email-date">{formatFullTime(email.sentAt || email.createdAt)}</div>
                        </div>
                        {/* main mail's text */}
                        <div className="email-body" dangerouslySetInnerHTML={{__html: email.body}}/>
                        <div className="separator"></div>
                        {/* actions related to replying */}
                        <div className="reply-actions">
                            <button className="reply-button primary" title="Reply" onClick={onReplyClick}>
                                <i className="bi bi-reply"/>
                                Reply
                            </button>
                            <button className="reply-button secondary" title="forward" onClick={onForwardClick}>
                                <i className="bi bi-arrow-90deg-right"></i>
                                Forward
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default ReadingPage;