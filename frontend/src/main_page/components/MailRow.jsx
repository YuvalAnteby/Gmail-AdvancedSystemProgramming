import "./MailRow.css"


/**
 * props:
 *   - id: {Number} unique identifier for an email
 *   - sender: {String} name of the sender
 *   - subject: {string}
 *   - body: {string}
 *   - date: {string} in format YYYY/MM/DD
 *   - isSelected: {boolean} (whether this row is currently checked)
 *   - onSelect: (id: string, checked: boolean) => void
 */
const MailRow = ({id, sender, subject, body, date, isSelected, onSelect}) => {

    const handleMailOpen = () => {
        console.log(">> Open Mail Row:", {id, sender, subject, body, date});
    }

    return (
        <div className="row align-items-center mail-row py-2"
        onClick={handleMailOpen}>
            <div className="col-auto">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(id, e.target.checked)}
                />
            </div>

            <div className="col">
                <strong>{sender}</strong>
            </div>

            <div className="col">
                <p>{subject}</p>
            </div>

            <div className="col">
                {body}
            </div>

            <div className="col text-end">
                {date}
            </div>
        </div>
    );
}

export default MailRow;