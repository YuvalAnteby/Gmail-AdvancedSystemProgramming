import React, {useEffect, useRef} from "react";
import './ToolBar.css'

const ToolBar = ({
                     theme,
                     inboxType,
                     allSelected,
                     anySelected,
                     btnHandlers,
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
            {/* SELECT ALL */}
            <div className={`select-all ${theme}`} style={{marginRight: '12px'}}>
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={btnHandlers.handleSelectAll}
                />
                select all
            </div>
            {/* refresh button */}
            <i
                className={`btn bi bi-arrow-clockwise icon ${theme}`}
                title="Refresh"
                onClick={btnHandlers.handleRefresh}
            />
            {anySelected && (
                <div>
                    {/* mark read button */}
                    <i
                        className={`btn bi bi-envelope-open icon ${theme}`}
                        title="Mark as Read"
                        onClick={btnHandlers.handleMarkAsRead}/>
                    {/* delete button */}
                    <i
                        className={`btn bi bi-trash icon ${theme}`}
                        title="Delete"
                        onClick={btnHandlers.handleDelete}/>
                    {/* report spam/ unspam button */}
                    {inboxType !== 'spam' && (
                        <i
                            className={`btn bi bi-exclamation-octagon icon ${theme}`}
                            title="Report Spam"
                            onClick={btnHandlers.handleMarkSpam}/>
                    )}
                    {inboxType === 'spam' && (
                        <button
                            className="btn btn-sm"
                            onClick={btnHandlers.handleMarkSpam}
                        >
                            Not spam
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default ToolBar;