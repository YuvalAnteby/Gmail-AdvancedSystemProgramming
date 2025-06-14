import {useCallback} from "react";
import {deleteMail, markAsRead, toggleSpamReport} from "../../api/mailApi";


/**
 * @param {number} userId id of the current user
 * @param {Set<Object>} selectedMails
 * @param {function} setSelectedMails
 * @param {Object[]} allEmails
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
export const useMailToolbarHandlers = (userId, selectedMails, setSelectedMails, allEmails, refreshMails) => {

    // Handle selection of all mails (or canceling) using the checkbox
    const handleSelectAll = useCallback((e) => {
        if (e.target.checked) {
            setSelectedMails(new Set(allEmails));
        } else {
            setSelectedMails(new Set());
        }
    }, [allEmails, setSelectedMails]);

    // Refresh current inbox
    const handleRefresh = useCallback(() => {
        setSelectedMails(new Set());
        if (typeof refreshMails === 'function')
            refreshMails();
    }, [refreshMails, setSelectedMails]);

    // Delete selected mails
    const handleDelete = useCallback(async () => {
        // nothing to delete
        if (selectedMails.size === 0)
            return;
        try {
            console.log(selectedMails);
            await Promise.all(Array.from(selectedMails).map((mail) => deleteMail(userId, mail)));
            setSelectedMails(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error deleting mails:", error);
        }

    }, [userId, selectedMails, setSelectedMails, refreshMails]);

    // Mark selected mails as read
    const handleMarkAsRead = useCallback(async () => {
        if (selectedMails.size === 0)
            return;
        try {
            await Promise.all(Array.from(selectedMails).map((mail) => markAsRead(userId, mail.id)));
            setSelectedMails(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error marking read mails:", error);
        }
    }, [selectedMails, setSelectedMails]);

    // Mark selected mails as spam (using the blacklist)
    const handleMarkSpam = useCallback(async () => {
        // nothing to delete
        if (selectedMails.size === 0)
            return;
        try {
            await Promise.all(Array.from(selectedMails).map((mail) => toggleSpamReport(userId, mail)));
            setSelectedMails(new Set());
            refreshMails();
        } catch (error) {
            console.error("Error marking spam:", error);
        }
        setSelectedMails(new Set());
    }, [selectedMails, setSelectedMails]);

    // TODO add a return trashed mail to be regular

    return {
        handleSelectAll,
        handleRefresh,
        handleDelete,
        handleMarkAsRead,
        handleMarkSpam
    };
}