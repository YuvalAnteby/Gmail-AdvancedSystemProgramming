import React, {useEffect, useRef} from "react";
import './ToolBar.css'

const ToolBar = ({
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
        <div className="d-flex align-items-center mb-2 mail-toolbar-alignment"> {/* Add a new class for styling */}
            {/* SELECT ALL */}
            <div className="col-auto" style={{marginRight: '12px'}}>
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                />
            </div>
            {/* --- REFRESH --- */}
            <button className="btn btn-info btn-sm me-2"
                    onClick={handleRefresh}
                    title="Refresh"
            >
                <i className="bi bi-arrow-clockwise"></i>
            </button>
            {/* MARK READ */}
            <button
                className="btn btn-success btn-sm me-2"
                onClick={handleMarkAsRead}
                disabled={!anySelected}
                title="Mark as Read"
            >
                <i className="bi bi-envelope-open"></i>
            </button>
            {/* --- DELETE --- */}
            <button
                className="btn btn-danger btn-sm me-2"
                onClick={handleDelete}
                disabled={!anySelected}
                title="Delete"
            >
                <i className="bi bi-trash"></i>
            </button>
            {/* REPORT SPAM */}
            <button
                className="btn btn-warning btn-sm"
                onClick={handleMarkSpam}
                disabled={!anySelected}
                title="Report Spam"
            >
                <i className="bi bi-exclamation-octagon"></i>
            </button>
        </div>
    )
}

export default ToolBar;