import "./MailRow.css"


/**
 * props:
 *   - theme: {String} dark or light according to user prefrence
 *   - id: {Number} unique identifier for an email
 *   - sender: {String} name of the sender
 *   - subject: {string}
 *   - body: {string}
 *   - date: {string} in format YYYY/MM/DD
 *   - isRead: {boolean} true if read the mail already
 *   - isSelected: {boolean} (whether this row is currently checked)
 *   - onSelect: function when marking a mail as selected for mass actions on them
 */
const MailRow = ({theme, id, sender, subject, body, date, isRead, isSelected, onSelect}) => {

    const handleMailOpen = () => {
        console.log(">> Open Mail Row:", {id, sender, subject, body, date});
        /// TODO open the mail to read
    }

    const rowClass = isRead ? "read" : "unread";

    return (
        <div className={`row align-items-center ${theme}-mail-row ${rowClass} py-2`}
             onClick={handleMailOpen}>
            <div className="col-auto">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()} // <-- prevents row click

                />
            </div>

            <div className="col">
                <strong style={{color: `var(--${theme}-text-color)`}}>{sender}</strong>
            </div>

            <div className="col" style={{color: `var(--${theme}-text-color)`}}>{subject}</div>

            <div className="col" style={{color: `var(--${theme}-text-color)`}}>{body}</div>

            <div className="col text-end" style={{color: `var(--${theme}-text-color)`}}>{date}</div>
        </div>
    );
}

export default MailRow;