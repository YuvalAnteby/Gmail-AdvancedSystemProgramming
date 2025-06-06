import {useCallback} from "react";
import {deleteMail} from "../../api/mailApi";


/**
 * @param {number} userId id of the current user
 * @param {Set<number>} selectedIds
 * @param {function} setSelectedIds
 * @param {number[]} allEmailIds
 * @param {function} refreshMails
 *
 * @returns {{
 *   handleSelectAll: function,
 *   handleRefresh: function,
 *   handleDelete: function,
 *   handleMarkAsRead: function,
 *   handleMarkSpam: function
 * }}
 */
export const useMailToolbarHandlers = (userId, selectedIds, setSelectedIds, allEmailIds, refreshMails) => {

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
        setSelectedIds(new Set());
        if (typeof refreshMails === 'function')
            refreshMails();
    }, [refreshMails, setSelectedIds]);

    // Delete selected mails
    const handleDelete = useCallback(async () => {
        // nothing to delete
        if (selectedIds.size === 0)
            return;
        console.log(">> Deleting:", Array.from(selectedIds));
        try {
            await Promise.all(Array.from(selectedIds).map((mid) => deleteMail(userId, mid)));
            setSelectedIds(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error deleting mails:", error);
        }

    }, [userId, selectedIds, setSelectedIds, refreshMails]);

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


    // TODO add a return trashed mail to be regular

    return {
        handleSelectAll,
        handleRefresh,
        handleDelete,
        handleMarkAsRead,
        handleMarkSpam
    };
}