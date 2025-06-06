import {useCallback} from "react";


/**
 * @param {Set<number>} selectedIds
 * @param {function} setSelectedIds
 * @param {number[]} allEmailIds
 * @param {function} refreshMails     // ← new parameter
 *
 * @returns {{
 *   handleSelectAll: function,
 *   handleRefresh: function,
 *   handleDelete: function,
 *   handleMarkAsRead: function,
 *   handleMarkSpam: function
 * }}
 */
export const useMailToolbarHandlers = (selectedIds, setSelectedIds, allEmailIds, refreshMails) => {

    // Handle selection of all mails (or canceling) using the checkbox
    const handleSelectAll = useCallback((e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(allEmailIds));
        } else {
            setSelectedIds(new Set());
        }
    }, [allEmailIds, setSelectedIds]);

    // Refresh current inbox
    const handleRefresh = useCallback(() => {
        console.log(">> Refresh clicked");
        setSelectedIds(new Set());    // clear selection
        if (typeof refreshMails === 'function')
            refreshMails();
    }, [refreshMails, setSelectedIds]);

    // Delete selected mails
    const handleDelete = useCallback(() => {
        console.log(">> Deleting:", Array.from(selectedIds));
        // TODO: call API to delete or mark as deleted
        setSelectedIds(new Set()); // un‐select everything after “deletion”
    }, [selectedIds, setSelectedIds]);

    // Mark selected mails as read
    const handleMarkAsRead = useCallback(() => {
        console.log(">> Marking as Read:", Array.from(selectedIds));
        // TODO: call API to mark read/unread
        setSelectedIds(new Set()); // un‐select everything after marking as read
    }, [selectedIds, setSelectedIds]);

    // Mark selected mails as spam (using the blacklist)
    const handleMarkSpam = useCallback(() => {
        console.log(">> Marking Spam:", Array.from(selectedIds));
        // TODO: call API to mark with blacklist
        setSelectedIds(new Set());
    }, [selectedIds, setSelectedIds]);

    return {
        handleSelectAll,
        handleRefresh,
        handleDelete,
        handleMarkAsRead,
        handleMarkSpam
    };
}