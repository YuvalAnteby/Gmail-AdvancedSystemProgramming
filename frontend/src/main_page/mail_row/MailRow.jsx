import "./MailRow.css"


/**
 * props:
 *   - id: {Number} unique identifier for an email
 *   - sender: {String} name of the sender
 *   - subject: {string}
 *   - body: {string}
 *   - date: {string} in format YYYY/MM/DD
 *   - isSelected: {boolean} (whether this row is currently checked)
 *   - onSelect: function when marking a mail as selected for mass actions on them
 */
const MailRow = ({id, sender, subject, body, date, isSelected, onSelect}) => {

    const handleMailOpen = () => {
        console.log(">> Open Mail Row:", {id, sender, subject, body, date});
        /// TODO open the mail to read
    }

    return (
        <div className="row align-items-center mail-row py-2"
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
                <strong>{sender}</strong>
            </div>

            <div className="col">{subject}</div>

            <div className="col">{body}</div>

            <div className="col text-end">{date}</div>
        </div>
    );
}

export default MailRow;