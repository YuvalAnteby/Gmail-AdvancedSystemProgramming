import "./MailRow.css"
import {formatDate} from "../../utils/formatDate";


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

    const rowClass = email.isRead ? "read" : "unread";

    return (
        <div className={`mail-row-item ${theme} ${rowClass}`} onClick={handleMailOpen}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(email.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
            />

            <div className="email-content">
                <div className="email-sender">{email.from.fullName}</div>
                <div className="email-main-line">
                    <div className="email-title-body">
                        <div className="email-subject">{email.subject}</div>
                        <div className="email-preview">{email.body}</div>
                    </div>
                </div>
            </div>
            <div className="email-time">{formatDate(email.sentAt || email.createdAt)}</div>

        </div>
    );
}

export default MailRow;