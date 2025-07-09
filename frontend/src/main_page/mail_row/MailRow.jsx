import "./MailRow.css";
import {formatDate} from "../../utils/formatDate";
import {useNavigate} from "react-router-dom";
import StarButton from "../../components/StarButton/StarButton";
import {markMailAsRead, stripHtml} from "../../utils/mailUtils";
//import useIsMobile from "../../utils/useIsMobile";

/**
 * @prop theme       dark or light
 * @prop email       email object
 * @prop inboxType   e.g. "incoming","draft",etc.
 * @prop isSelected  boolean for checkbox
 * @prop onSelect    (mail,checked)=>void
 * @prop onUpdate    ()=>void
 * @prop onOpenDraft (mail)=>void
 */
const MailRow = ({
                     theme,
                     email,
                     inboxType,
                     isSelected,
                     onSelect,
                     onUpdate,
                     onOpenDraft
                 }) => {
    const navigate = useNavigate();
    const handleMailOpen = async () => {
        await markMailAsRead(email, onUpdate);
        if (inboxType === "draft" && onOpenDraft) {
            onOpenDraft(email);
        } else {
            navigate(`/mails/${email.id}`, {state: {inboxType}});
        }
    };

    return (
        <div className={`mail-row-item ${theme} ${email.isRead ? "read" : "unread"}`}>
            <div className="row-top-controls">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={e => onSelect(email, e.target.checked)}
                    onClick={e => e.stopPropagation()}
                />
                <StarButton email={email} theme={theme} onToggle={onUpdate}/>
            </div>

            <div className="mail-row-metadata" onClick={handleMailOpen}>
                <div className="email-content">
                    <div className={`email-sender ${theme}`}>{email.from.fullName}</div>
                    <div className="email-title-body">
                        <div className={`email-subject ${theme}`}>{email.subject}</div>
                        <div className="mail-labels">
                            {email.labels?.map(label => (
                                <span key={label.id} className="badge rounded-pill bg-secondary me-1">
                                    {label.name}
                                </span>
                            ))}
                        </div>
                        <div className={`email-preview ${theme}`}>{stripHtml(email.body)}</div>
                    </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-1">
                    {email.files?.length > 0 && (
                        <i className={`bi bi-paperclip icon ${theme}`}/>
                    )}
                    <i className={`bi bi-clock icon ${theme}`}/>
                    <div className={`email-time ${theme}`}>
                        {formatDate(email.sentAt || email.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MailRow;