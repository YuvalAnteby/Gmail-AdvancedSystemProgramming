import './SenderDetails.css'
import {DEFAULT_AVATAR} from "../../utils/constants";
import StarButton from "../../components/StarButton/StarButton";

const SenderDetails = ({email, theme, onUpdate}) => {
    return (
        <div className={`sender-info ${theme}`}>
            <img src={email.from.image || DEFAULT_AVATAR} alt="sender" className="avatar"/>
            <div className="sender-details">
                <h3 className="sender-name">
                    {email.from.fullName}
                    <span className="sender-email-text">&lt;{email.from.mail}&gt;</span>
                    <StarButton email={email} theme={theme} onToggle={onUpdate}/>
                </h3>
                <div className="recipient-info">
                    to {email.sentTo.map((user, index) => (
                    <span key={index} title={user.fullName}>
            {user.mail}{index < email.sentTo.length - 1 ? ', ' : ''}
        </span>
                ))}
                </div>
            </div>
        </div>
    )
}

export default SenderDetails;