import React from "react";
import './ToolBar.css'

const ToolBar = ({allSelected, handleSelectAll, handleRefresh, handleDelete, handleMarkAsRead, handleMarkSpam}) => {

    return (
        <div className="col-md-9 mb-3">
            <div className="d-flex align-items-center mb-2">
                <div className="col-auto custom-checkbox">
                    <input
                        className="custom-checkbox"
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                    />
                </div>

                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={handleRefresh}
                    title="Refresh"
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>

                <button
                    className="btn btn-outline-danger me-2"
                    onClick={handleDelete}
                    title="Delete"
                >
                    <i className="bi bi-trash"></i>
                </button>

                <button
                    className="btn btn-outline-primary me-2"
                    onClick={handleMarkAsRead}
                    title="Mark as Read"
                >
                    <i className="bi bi-envelope-open"></i>
                </button>

                <button
                    className="btn btn-outline-warning"
                    onClick={handleMarkSpam}
                    title="Report Spam"
                >
                    <i className="bi bi-exclamation-octagon"></i>
                </button>

            </div>
        </div>
    )
}

export default ToolBar;