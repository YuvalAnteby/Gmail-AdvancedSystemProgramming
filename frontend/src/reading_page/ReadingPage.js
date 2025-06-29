import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchEmail} from "../api/mailApi";
import {useTheme} from "../utils/useTheme";
import ReadingHeader from "./ReadingHeader/ReadingHeader";
import './ReadingPage.css'
import SenderDetails from "./SenderDetails/SenderDetails";
import {formatFullTime} from "../utils/formatDate";
import SkeletonEmail from "../components/loading/SkeletonEmail";
import FileList from "./Attachments/FileList";
import { addBlankToLinks } from "../utils/htmlUtils";

const ReadingPage = () => {

    // basic data
    const {id} = useParams();
    const {theme, toggleTheme} = useTheme();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    // Read inboxType from location state
    const location = useLocation();
    const { inboxType } = location.state || {};

    // Load the mail when ID changes
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
        loadEmail();
    }, [id]);

    // Dummy reply handler (not implemented)
    const onReplyClick = () => {
        alert("reply");
    };

    // Dummy forward handler (not implemented)
    const onForwardClick = () => {
        alert("forward");
    };

    // Allow updating the "starred" state locally
    const handleStarToggle = (newStarValue) => {
        setEmail(prev => ({ ...prev, isStarred: newStarValue }));
    };

    return (
        <div className={`email-view ${theme}`}>
            {/* Header */}
            <ReadingHeader theme={theme} toggleTheme={toggleTheme} email={email} inboxType={inboxType}/>
            {/* Main content */}
            {loading ? (
                <SkeletonEmail />
            ) : (
                <div className="email-view-content">
                    <h1 className="email-view-title">{email.subject}</h1>
                    {/* Sender info and date */}
                    <div className={`email-view-meta ${theme}`}>
                        <SenderDetails email={email} theme={theme} onUpdate={handleStarToggle}/>
                        <div className="email-date">{formatFullTime(email.sentAt || email.createdAt)}</div>
                    </div>
                    {/* Email body with safe links */}
                    <div
                        className="email-body"
                        dangerouslySetInnerHTML={{ __html: addBlankToLinks(email.body) }}
                    />
                    <div className="separator"></div>
                    {/* Attachments if any */}
                    {email.files && email.files.length > 0 && (
                        <div>
                            <h6 style={{ textAlign: "start", marginBottom: 0 }}>Attachments:</h6>
                            <FileList files={email.files} theme={theme}/>
                        </div>
                    )}
                    {/* Reply/forward buttons */}
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