import {useState, useEffect, useCallback} from 'react';
import {getMailsByType} from "../../api/mailApi";

/**
 * Custom hook to fetch and refresh "mails" for a given userId and inboxType.
 *
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'} inboxType
 * @returns {{
 *   emails: Array,
 *   loading: boolean,
 *   error: Error|null,
 *   refreshMails: () => Promise<void>
 * }}
 */
export function useMails(inboxType) {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize refreshMails so it doesn’t get re-created on every render
    const refreshMails = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getMailsByType(inboxType);
            setEmails(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [inboxType]);

    // Fetch initially, and whenever userId or inboxType changes
    useEffect(() => {
        refreshMails();
    }, [inboxType, refreshMails]);

    return {emails, loading, error, refreshMails};
}
