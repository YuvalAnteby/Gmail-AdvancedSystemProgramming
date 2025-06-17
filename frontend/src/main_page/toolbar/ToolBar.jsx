import React, {useEffect, useRef} from "react";
import './ToolBar.css'
import {MAILS_PER_PAGE} from "../../utils/constants";

const ToolBar = ({
                     theme,
                     inboxType,
                     allSelected,
                     anySelected,
                     btnHandlers,
                     total,
                     page,
                     hasNextPage,
                     hasPrevPage,
                     goToNextPage,
                     goToPrevPage,
                 }) => {

    // for cases where not all mails were selected but some do
    const selectAllRef = useRef(null);
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !allSelected && anySelected;
        }
    }, [allSelected, anySelected]);

    return (
        <div className="toolbar-container">
            {/* SELECT ALL - always shown */}
            <div className={`select-all toolbar-text ${theme}`}>
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
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
            {anySelected && (
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
                </div>
            )}
            {/* paging info and buttons - always shown */}
            <div
                className={`paging-container`}
            >
                <p
                    className={`paging-text ${theme}`}
                >
                    Showing {(page-1) * MAILS_PER_PAGE + MAILS_PER_PAGE}–{Math.min(page * MAILS_PER_PAGE, total)} of {total}
                </p>
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