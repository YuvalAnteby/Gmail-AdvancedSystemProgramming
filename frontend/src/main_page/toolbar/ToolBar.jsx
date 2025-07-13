import React, {useEffect, useRef, useState} from "react";
import './ToolBar.css'
import {MAILS_PER_PAGE} from "../../utils/constants";
import useIsMobile from "../../utils/useIsMobile";
import {fetchLabels} from "../../api/labelsApi";
import {applyLabelsToMail} from "../../api/mailApi";
import {Dropdown} from "react-bootstrap";

const ToolBar = ({
                     theme,
                     inboxType,
                     mailsAmount,
                     selectedMails,
                     btnHandlers,
                     total,
                     page,
                     hasNextPage,
                     hasPrevPage,
                     goToNextPage,
                     goToPrevPage,
                 }) => {

    // checks if mobile UI or desktop
    const isMobile = useIsMobile();

    let isAllSelected = selectedMails.size === mailsAmount;
    let isIndeterminate = selectedMails.size > 0 && selectedMails.size < mailsAmount;

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
    // Helper to reload labels after changes
    const reload = async () => {
        try {
            const data = await fetchLabels();
            setLabels(data);
        } catch (e) {
            console.error("Failed to reload labels:", e);
        }
    };

    // apply label selection and refresh mails
    const handleLabelToggle = async (label) => {
        try {
            await Promise.all(Array.from(selectedMails).map(async mail => {
                const hasLabel = mail.labels.some(l => l.id === label.id);
                let newLabels;

                if (hasLabel) {
                    // Remove label
                    newLabels = mail.labels.filter(l => l.id !== label.id);
                } else {
                    // add label - no duplicates
                    const labelMap = new Map(mail.labels.map(l => [l.id, l]));
                    labelMap.set(label.id, label);
                    newLabels = Array.from(labelMap.values());
                }
                // update UI
                mail.labels = newLabels.filter(label => label && typeof label.id === "number"
                    && typeof label.name === "string");
                mail._forceUpdate = Date.now();
                // Send new label list to backend
                await applyLabelsToMail(mail.id, newLabels);

            }));
            isAllSelected = false;
            setShowLabelMenu(false);
            btnHandlers.clearSelection();
        } catch (e) {
            console.error("Failed to update label:", e);
        }
    };

    // for cases where not all mails were selected but some do
    const selectAllRef = useRef(null);
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate]);

    return (
        <div className="toolbar-container">
            {/* SELECT ALL - always shown */}
            <div className={`select-all toolbar-text ${theme}`}>
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={btnHandlers.handleSelectAll}
                />
                select all
            </div>
            {/* refresh button - always shown */}
            <i
                className={`btn bi bi-arrow-clockwise icon ${theme}`}
                title="Refresh"
                onClick={btnHandlers.handleRefresh}
            />
            {/* additional buttons - shown when mails selected */}
            {selectedMails.size > 0 && (
                <div className="d-flex flex-row">
                    {/* mark read button */}
                    <i
                        className={`btn bi bi-envelope-open icon ${theme}`}
                        title="Mark as Read"
                        onClick={btnHandlers.handleMarkAsRead}/>
                    {/* delete button, when in trash inbox shows delete forever and restore buttons */}
                    {inboxType !== 'trash' && (
                        <i
                            className={`btn bi bi-trash icon ${theme}`}
                            title="Delete"
                            onClick={btnHandlers.handleDelete}/>
                    )}
                    {/* report spam, when in spam inbox shows unspam button */}
                    {inboxType !== 'spam' && (
                        <i
                            className={`btn bi bi-exclamation-octagon icon ${theme}`}
                            title="Report Spam"
                            onClick={btnHandlers.handleMarkSpam}/>
                    )}
                    {/* instead of report spam have 'unspam' button */}
                    {inboxType === 'spam' && (
                        <button
                            className="btn btn-sm"
                            onClick={btnHandlers.handleMarkSpam}
                        >
                            Not spam
                        </button>
                    )}
                    {/* instead of trash button have 'delete forever' and 'restore' buttons */}
                    {inboxType === 'trash' && (
                        <div className="d-flex flex-row">
                            <button
                                className={`btn btn-sm toolbar-text ${theme}`}
                                title="delete forever"
                                onClick={btnHandlers.handleDelete}
                            >
                                Delete forever
                            </button>
                            <button
                                className={`btn btn-sm toolbar-text ${theme}`}
                                title="restore mail"
                                onClick={btnHandlers.handleRestore}
                            >
                                Restore mail
                            </button>
                        </div>
                    )}
                    {/* label picker for selected mails */}
                    <Dropdown show={showLabelMenu} onToggle={setShowLabelMenu} onClick={reload}>
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
                                        checked={Array.from(selectedMails).every(mail =>
                                            Array.isArray(mail.labels) &&
                                            mail.labels.some(l => l.id === label.id)
                                        )}
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
            )}
            {/* paging info and buttons - always shown */}
            <div
                className={`paging-container`}
            >
                {!isMobile && (
                    <p
                        className={`paging-text ${theme}`}
                    >
                        Showing {(page - 1) * MAILS_PER_PAGE + MAILS_PER_PAGE}–{Math.min(page * MAILS_PER_PAGE, total)} of {total}
                    </p>
                )}

                <i
                    className={`btn bi bi-arrow-left icon ${theme} ${!hasPrevPage ? 'disabled-icon' : ''}`}
                    title="previous page"
                    onClick={hasPrevPage ? goToPrevPage : undefined}
                />
                <i
                    className={`btn bi bi-arrow-right icon ${theme} ${!hasNextPage ? 'disabled-icon' : ''} me-2`}
                    title="next page"
                    onClick={hasNextPage ? goToNextPage : undefined}
                />
            </div>
        </div>
    )
}

export default ToolBar;