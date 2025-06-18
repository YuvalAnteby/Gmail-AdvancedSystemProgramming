import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchEmail} from "../api/mailApi";
import {useTheme} from "../utils/useTheme";
import ReadingHeader from "./ReadingHeader/ReadingHeader";
import './ReadingPage.css'
import SenderDetails from "./SenderDetails/SenderDetails";
import {formatFullTime} from "../utils/formatDate";

const ReadingPage = () => {

    // basic data
    const {id} = useParams();
    const {theme, toggleTheme} = useTheme();
    const [email, setEmail] = useState(null)

    const location = useLocation();
    const {inboxType} = location.state;

    // update the mail shown
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const mail = await fetchEmail(Number(id));
                setEmail(mail);
            } catch (error) {
                console.error("Error fetching email: ", error)
            }
        }
        loadEmail().then();
    }, [id])

    // TODO loading screen while fetching mail
    if (!email) {
        return <div className="loading">Loading...</div>
    }

    return (
        <div className="email-view">
            {/* Header */}
            <ReadingHeader theme={theme} toggleTheme={toggleTheme} email={email} inboxType={inboxType}/>
            {/* content */}
            <div className="email-view-content">
                <h1 className="email-view-title">{email.subject}</h1>
                {/* sender's info */}
                <div className="email-view-meta">
                    <SenderDetails email={email}/>
                    <div className="email-date">{formatFullTime(email.sentAt || email.createdAt)}</div>
                </div>
                {/* main mail's text */}
                <div className="email-body" dangerouslySetInnerHTML={{__html: email.body}}/>
                <div className="separator"></div>
                {/* actions related to replying */}
                <div className="reply-actions">
                    <button className="reply-button primary">
                        <i className="bi bi-reply"/>
                        Reply
                    </button>
                    <button className="reply-button secondary">
                        <i className="bi bi-arrow-90deg-right"></i>
                        Forward
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReadingPage;