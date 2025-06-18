import "./MailRow.css"
import {formatDate} from "../../utils/formatDate";
import {useNavigate} from "react-router-dom";
import StarButton from "../../components/StarButton/StarButton";
import {markMailAsRead} from "../../utils/mailUtils";


/**
 *  @prop {String} theme dark or light according to user preference
 *  @prop {Object} email  email object
 *  @prop {string} inboxType what type of inbox we see this mail from (e.g. spam, trash etc)
 *  @prop {boolean} isSelected whether this row is currently checked
 *  @prop {function} onSelect when marking a mail as selected for mass actions on them
 *  @prop {function} onUpdate when updating a mail object this function will trigger
 */
const MailRow = ({theme, email, inboxType, isSelected, onSelect, onUpdate}) => {

    // handling clicking on a mail to read it
    const navigate = useNavigate();
    const handleMailOpen = async () => {
        await markMailAsRead(email, onUpdate);
        navigate(`/mails/${email.id}`, {state: {inboxType}});
    }

    return (
        <div className={`mail-row-item ${theme} ${email.isRead ? "read" : "unread"}`}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(email, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
            />

            <StarButton email={email} theme={theme} onToggle={onUpdate} />

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