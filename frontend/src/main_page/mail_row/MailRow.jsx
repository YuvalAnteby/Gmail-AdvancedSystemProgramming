import "./MailRow.css"
import {formatDate} from "../../utils/formatDate";
import {useState} from "react";
import {toggleMailStar} from "../../api/mailApi";


/**
 * props:
 *   - theme: {String} dark or light according to user preference
 *   - email: {Object} email object
 *   - isSelected: {boolean} (whether this row is currently checked)
 *   - onSelect: function when marking a mail as selected for mass actions on them
 */
const MailRow = ({theme, email, isSelected, onSelect}) => {

    const handleMailOpen = () => {
        console.log(">> Open Mail Row:", email);
        /// TODO open the mail to read
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