// frontend/src/hooks/useMails.js

import { useState, useEffect, useCallback } from 'react';
import { getMailsByType, getMailsByLabel } from "../../api/mailApi";
import { MAILS_PER_PAGE } from "../../utils/constants";


/**
 * Custom hook to fetch and refresh mails for a given inboxType or label filter.
 *
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'|`label:${string}`} inboxType
 */
export function useMails(inboxType) {
    const [emails, setEmails]   = useState([]);
    const [total, setTotal]     = useState(0);
    const [page, setPage]       = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    /**
     * Fetch mails from the server.
     * If inboxType starts with "label:", calls getMailsByLabel.
     */
    const refreshMails = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let result;
            if (inboxType.startsWith('label:')) {
                // strip off "label:" prefix
                const labelName = inboxType.slice('label:'.length);
                result = await getMailsByLabel(labelName, page);
            } else {
                result = await getMailsByType(inboxType, page);
            }
            setEmails(result.mails);
            setTotal(result.total);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [inboxType, page]);

    // initial fetch & whenever inboxType or page changes
    useEffect(() => {
        refreshMails();
    }, [inboxType, refreshMails]);

    const hasNextPage = page * MAILS_PER_PAGE < total;
    const hasPrevPage = page > 1;

    const goToNextPage = () => { if (hasNextPage) setPage(p => p + 1); };
    const goToPrevPage = () => { if (hasPrevPage) setPage(p => p - 1); };

    // reset to page 1 when inboxType changes
    useEffect(() => {
        setPage(1);
    }, [inboxType]);

    return {
        emails,
        total,
        page,
        hasNextPage,
        hasPrevPage,
        goToNextPage,
        goToPrevPage,
        loading,
        error,
        refreshMails
    };
}