import './SenderDetails.css'
import {DEFAULT_AVATAR} from "../../utils/constants";
import StarButton from "../../components/StarButton/StarButton";
import {useState} from "react";

const SenderDetails = ({email, theme, onUpdate}) => {

    const [showAllRecipients, setShowAllRecipients] = useState(false);
    const recipientCount = email.sentTo.length;

    const handleToggleRecipients = () => {
        setShowAllRecipients(prev => !prev);
    };

    const displayedRecipients = showAllRecipients
        ? email.sentTo.map(user => user.mail)
        : [email.sentTo[0].mail, ...(recipientCount > 1 ? [`and ${recipientCount - 1} others`] : [])];


    return (
        <div className={`sender-info ${theme}`}>
            <img src={email.from.image || DEFAULT_AVATAR} alt="sender" className="avatar"/>
            <div className="sender-details">
                <h3 className="sender-name">
                    {email.from.fullName}
                    <span className="sender-email-text">&lt;{email.from.mail}&gt;</span>
                    <StarButton email={email} theme={theme} onToggle={onUpdate}/>
                </h3>
                <div
                    className="recipient-info"
                    onClick={handleToggleRecipients}
                    style={{cursor: recipientCount > 1 ? 'pointer' : 'default'}}
                >
                    to {displayedRecipients.map((mail, index) => (
                    <span key={index}>
                        {mail}{index < displayedRecipients.length - 1 ? ', ' : ''}
                    </span>
                ))}
                    {recipientCount > 1 && (
                        <span className="toggle-hint">
                        &nbsp;({showAllRecipients ? 'hide' : 'show'})
                    </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SenderDetails;