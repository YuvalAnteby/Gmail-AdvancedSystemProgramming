import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getUserFromToken} from "./tokenUtils";

/**
 * Redirects user to inbox if a JWT token exists.
 * Used in login page to skip if already logged in.
 */
export function useAutoLogin() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = getUserFromToken();
        if (user) navigate("/inbox");
        else navigate("/login");
    }, [navigate]);
}

/**
 * Redirects to /login if token is missing.
 * Used in protected pages, e.g. inbox.
 */
export function useRequireAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = getUserFromToken();
        if (!user)
            navigate("/login");
    })
}