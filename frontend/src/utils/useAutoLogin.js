import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Redirects user to inbox if a JWT token exists.
 * Used in login page to skip if already logged in.
 */
export function useAutoLogin() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Optionally: ping a lightweight auth-check endpoint to verify it's still valid
            navigate("/inbox");
        }
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {replace: true});
        }
    }, []);
}

/**
 * Redirects to /login if token is missing.
 * Used in protected pages, e.g. inbox.
 */
export function useRequireAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token)
            navigate("/login");
    })
}