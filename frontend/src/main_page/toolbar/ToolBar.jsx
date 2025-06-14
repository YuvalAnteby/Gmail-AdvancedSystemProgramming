import React, {useEffect, useRef} from "react";
import './ToolBar.css'

const ToolBar = ({
                     theme,
                     allSelected,
                     anySelected,
                     handleSelectAll,
                     handleRefresh,
                     handleDelete,
                     handleMarkAsRead,
                     handleMarkSpam
                 }) => {

    // for cases where not all mails were selected but some do
    const selectAllRef = useRef(null);
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !allSelected && anySelected;
        }
    }, [allSelected, anySelected]);

    return (
        // The d-flex container is what we want to directly style.
        // We removed the outer col-md-9 mb-3 because it was the wrong level of abstraction here.
        <div className="toolbar-container"> {/* Add a new class for styling */}
            {/* SELECT ALL */}
            <div className={`select-all ${theme}`} style={{marginRight: '12px'}}>
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                />
                select all
            </div>
            {/* --- REFRESH --- */}
            <i
                className={`btn bi bi-arrow-clockwise icon ${theme}`}
                title="Refresh"
                onClick={handleRefresh}
            />
            {anySelected && (
                <div>
                    {/* mark read button */}
                    <i
                        className={`btn bi bi-envelope-open icon ${theme}`}
                        title="Mark as Read"
                        onClick={handleMarkAsRead}/>
                    {/* delete button */}
                    <i
                        className={`btn bi bi-trash icon ${theme}`}
                        title="Delete"
                        onClick={handleDelete}/>
                    {/* report spam button */}
                    <i
                        className={`btn bi bi-exclamation-octagon icon ${theme}`}
                        title="Report Spam"
                        onClick={handleMarkSpam}/>
                </div>
            )}
        </div>
    )
}

export default ToolBar;