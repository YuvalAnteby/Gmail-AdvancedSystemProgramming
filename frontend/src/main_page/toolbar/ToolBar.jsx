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
        <div className="col-md-9 mb-3">
            <div className="d-flex align-items-center mb-2">
                {/* SELECT ALL */}
                <div className="col-auto custom-checkbox">
                    <input
                        ref={selectAllRef}
                        className="custom-checkbox"
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                    />
                </div>
                {/* --- REFRESH --- */}
                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={handleRefresh}
                    title="Refresh"
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
                {/* --- DELETE --- */}
                <button
                    className="btn btn-outline-danger me-2"
                    onClick={handleDelete}
                    disabled={!anySelected}
                    title="Delete"
                >
                    <i className="bi bi-trash"></i>
                </button>
                {/* MARK READ */}
                <button
                    className="btn btn-outline-primary me-2"
                    onClick={handleMarkAsRead}
                    disabled={!anySelected}
                    title="Mark as Read"
                >
                    <i className="bi bi-envelope-open"></i>
                </button>
                {/* REPORT SPAM */}
                <button
                    className="btn btn-outline-warning"
                    onClick={handleMarkSpam}
                    disabled={!anySelected}
                    title="Report Spam"
                >
                    <i className="bi bi-exclamation-octagon"></i>
                </button>

            </div>
        </div>
    )
}

export default ToolBar;