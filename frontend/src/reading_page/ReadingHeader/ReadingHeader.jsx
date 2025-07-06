import {useNavigate} from "react-router-dom";
import './ReadingHeader.css'
import {APP_NAME, DEFAULT_AVATAR} from "../../utils/constants";
import ProfileMenu from "../../main_page/top_menu/profile/ProfileMenu";
import {useProfile} from "../../main_page/hooks/useProfile";
import {useOutsideClick} from "../../main_page/hooks/useOutsideClick";
import React, {useEffect, useRef, useState} from "react";
import {applyLabelsToMail, deleteMail, restoreMail, toggleSpamReport} from "../../api/mailApi";
import {Dropdown} from "react-bootstrap";
import {fetchLabels} from "../../api/labelsApi";

const ReadingHeader = ({theme, toggleTheme, email, inboxType}) => {
    const navigate = useNavigate()

    // profile and profile menu
    const {imageUrl, fullName, updateImage} = useProfile();
    const onProfileClick = () => setShowMenu(prev => !prev);
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

    /**
     * handle action clicks like deleting, marking spam etc
     * @param {function} actionFunction API function to call, according to the clicked button
     * @param {Object} funcInput input to the API function - mail object or mail id
     * @param {string} actionLabel label of the action for logs
     * @returns {Promise<void>}
     */
    const onActionClick = async (actionFunction, funcInput, actionLabel) => {
        try {
            await actionFunction(funcInput);
            navigate('/inbox', {state: {inboxType: inboxType}});
        } catch (error) {
            console.error(`Error ${actionLabel} mail:`, error);
        }
    }

    const onBackClick = () => {
        navigate('/inbox', {state: {inboxType: inboxType}});
    }

    // labels
    const [labels, setLabels] = useState([]);
    const [showLabelMenu, setShowLabelMenu] = useState(false);
    // fetches labels
    useEffect(() => {
        const loadLabels = async () => {
            try {
                const response = await fetchLabels();
                setLabels(response);
            } catch (e) {
                console.error("Failed to fetch labels", e);
            }
        };
        loadLabels();
    }, []);

    // Apply label toggle for a single mail object
    const handleLabelToggle = async (label) => {
        try {
            const hasLabel = Array.isArray(email.labels) && email.labels.some(l => l.id === label.id);
            let newLabels;

            if (hasLabel) {
                // Remove label
                newLabels = email.labels.filter(l => l.id !== label.id);
            } else {
                // Add label without duplicates
                const labelMap = new Map(email.labels.map(l => [l.id, l]));
                labelMap.set(label.id, label);
                newLabels = Array.from(labelMap.values());
            }
            // Update UI
            email.labels = newLabels;
            // Apply to backend
            await applyLabelsToMail(email.id, newLabels);
            setShowLabelMenu(false);
        } catch (e) {
            console.error("Failed to update label:", e);
        }
    };


    return (
        <header className={`email-view-header ${theme}`}>
            <div className="d-flex flex-row">
                {/* back button */}
                <button className={`reading-button ${theme}`} title="Back to inbox" onClick={onBackClick}>
                    <i className={`bi bi-arrow-left back-icon ${theme}`}/>
                </button>
                {/* logo and name */}
                <div className="d-flex flex-row align-items-center">
                    <img src="/logo192.png" alt="icon" className="logo-img"/>
                    <span className={`logo-text ${theme}`}>{APP_NAME}</span>
                </div>
            </div>
            {/* additional actions */}
            <div
                className="email-actions">
                {/* move to trash or delete mail */}
                <button
                    className={`reading-button ${theme}`}
                    title={inboxType === 'trash' ? 'move to trash' : 'delete forever'}
                    onClick={() => onActionClick(deleteMail, email, 'deleting mail')}>
                    {inboxType !== 'trash' && (<i className={`bi bi-trash icon ${theme}`}/>)}
                    {inboxType === 'trash' ? 'Delete forever' : ''}
                </button>
                {/* mark as spam or unmark it */}
                <button
                    className={`reading-button ${theme}`}
                    title={`Report ${inboxType === 'spam' ? 'not' : ''} spam`}
                    onClick={() =>
                        onActionClick(
                            toggleSpamReport,
                            email,
                            `mark as ${inboxType === 'spam' ? 'not' : ''} spam`)}>
                    {inboxType !== 'spam' && (<i className={`bi bi-exclamation-octagon icon ${theme}`}/>)}
                    {inboxType === 'spam' ? 'Not spam' : ''}
                </button>
                {/* restore mail */}
                {inboxType === 'trash' && (
                    <button
                        className={`reading-button ${theme}`}
                        title="Restore mail"
                        onClick={() => onActionClick(restoreMail, email, 'restoring mail')}>
                        Restore mail
                    </button>
                )}
                {/* label picker for current mail */}
                <Dropdown show={showLabelMenu} onToggle={setShowLabelMenu}>
                    <Dropdown.Toggle
                        className={`btn bi bi-tag icon ${theme} border-0 p-2`}
                        title="Manage Labels"
                        variant="outline-secondary"
                        id="dropdown-labels"
                    />
                    <Dropdown.Menu className={`p-2 labels-dropdown ${theme}`}>
                        {labels.map(label => (
                            <div key={label.id} className="form-check">
                                <input
                                    className={`form-check-input ${theme}`}
                                    type="checkbox"
                                    id={`label-check-${label.id}`}
                                    checked={Array.isArray(email.labels) && email.labels.some(l => l.id === label.id)}
                                    onChange={() => handleLabelToggle(label)}
                                />
                                <label className="form-check-label" htmlFor={`label-check-${label.id}`}>
                                    {label.name}
                                </label>
                            </div>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* profile and profile menu for more actions */}
            <div className="position-relative" ref={menuRef}>
                <button onClick={onProfileClick} className="profile-btn">
                    <img src={imageUrl || DEFAULT_AVATAR} alt="Profile" className="profile-img"/>
                </button>
                {showMenu && (
                    <ProfileMenu
                        theme={theme}
                        toggleTheme={toggleTheme}
                        imageUrl={imageUrl}
                        fullName={fullName}
                        onUploadImage={updateImage}
                    />
                )}
            </div>

        </header>
    );
}

export default ReadingHeader;