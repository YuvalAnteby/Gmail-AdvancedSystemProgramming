import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchEmail} from "../api/mailApi";
import {useTheme} from "../utils/useTheme";
import ReadingHeader from "./ReadingHeader/ReadingHeader";
import './ReadingPage.css'

const ReadingPage = () => {

    // basic data
    const {id} = useParams();
    const {theme, toggleTheme} = useTheme();
    const [email, setEmail] = useState(null)

    const navigate = useNavigate()
    const location = useLocation();
    const {inboxType} = location.state;

    // update the mail shown
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const mail = await fetchEmail(Number(id));
                setEmail(mail);
            } catch (error) {
                console.error("Error fetching email: ", error)
            }
        }
        loadEmail().then();
    }, [id])

    // TODO loading screen while fetching mail
    if (!email) {
        return <div className="loading">Loading...</div>
    }

    return (
        <div
            className="email-view"
        >
            {/* Header */}
            <ReadingHeader theme={theme} toggleTheme={toggleTheme} email={email} inboxType={inboxType} />

        </div>
    );
}

export default ReadingPage;