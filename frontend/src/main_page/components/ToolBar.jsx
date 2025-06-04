import React from "react";

const ToolBar = ({allSelected, handleSelectAll, handleRefresh, handleDelete, handleMarkAsRead}) => {

    return (
        <div className="col-md-9 mb-3">
            <div className="d-flex align-items-center mb-2">
                <div className="col-auto">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                    />
                </div>

                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={handleRefresh}
                >
                    Refresh
                </button>
                <button
                    className="btn btn-outline-danger me-2"
                    onClick={handleDelete}
                >
                    Delete
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={handleMarkAsRead}
                >
                    Mark as Read
                </button>
            </div>
        </div>
    )
}

export default ToolBar;