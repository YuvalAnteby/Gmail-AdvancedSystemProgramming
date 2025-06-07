import {useCallback} from "react";
import {deleteMail, markAsRead, reportSpam} from "../../api/mailApi";


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
        try {
            await Promise.all(Array.from(selectedIds).map((mid) => deleteMail(userId, mid)));
            setSelectedIds(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error deleting mails:", error);
        }

    }, [userId, selectedIds, setSelectedIds, refreshMails]);

    // Mark selected mails as read
    const handleMarkAsRead = useCallback(async () => {
        if (selectedIds.size === 0)
            return;
        try {
            await Promise.all(Array.from(selectedIds).map((mid) => markAsRead(userId, mid)));
            setSelectedIds(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error marking read mails:", error);
        }
    }, [selectedIds, setSelectedIds]);

    // Mark selected mails as spam (using the blacklist)
    const handleMarkSpam = useCallback(async () => {
        // nothing to delete
        if (selectedIds.size === 0)
            return;
        try {
            await Promise.all(Array.from(selectedIds).map((mid) => reportSpam(userId, mid)));
            setSelectedIds(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error marking spam:", error);
        }
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