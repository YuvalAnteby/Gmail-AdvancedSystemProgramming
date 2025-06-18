import "./MailRow.css"
import {formatDate} from "../../utils/formatDate";
import {useState} from "react";
import {toggleMailStar} from "../../api/mailApi";
import {useNavigate} from "react-router-dom";


/**
 *  @prop {String} theme dark or light according to user preference
 *  @prop {Object} email  email object
 *  @prop {string} inboxType what type of inbox we see this mail from (e.g. spam, trash etc)
 *  @prop {boolean} isSelected whether this row is currently checked
 *  @prop {function} onSelect when marking a mail as selected for mass actions on them
 */
const MailRow = ({theme, email, inboxType, isSelected, onSelect}) => {

    // handling clicking on a mail to read it
    const navigate = useNavigate();
    const handleMailOpen = () => {
        console.log(">> Open Mail Row:", email);
        /// TODO mark as read
        navigate(`/mails/${email.id}`, {state: {inboxType}});
    }

    const [isStarred, setIsStarred] = useState(email.isStarred);
    const toggleStar = async (mail, e) => {
        e.stopPropagation()
        try {
            setIsStarred((prev) => !prev);
            email.isStarred = isStarred;
            await toggleMailStar(email);
        } catch (e) {
            console.error(e);
        }

    }

    return (
        <div className={`mail-row-item ${theme} ${email.isRead ? "read" : "unread"}`}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(email, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
            />

            <i
                className={`btn bi bi-star${isStarred ? "-fill" : ""} star-icon ${theme} ${isStarred ? "starred" : ""}`}
                onClick={(e) => toggleStar(email, e)}
            />

            <div className="email-content" onClick={handleMailOpen}>
                <div className={`email-sender ${theme}`}>{email.from.fullName}</div>
                <div className="email-main-line">
                    <div className="email-title-body">
                        <div className={`email-subject ${theme}`}>{email.subject}</div>
                        <div className={`email-preview ${theme}`}>{email.body}</div>
                    </div>
                </div>
            </div>
            <i className={`bi bi-clock ${theme}`}/>
            <div className={`email-time ${theme}`}>{formatDate(email.sentAt || email.createdAt)}</div>

        </div>
    );
}

export default MailRow;