import {useEffect, useState} from 'react';
import {changeProfileImage, fetchUserInfo} from "../../api/profileApi";
import {getUserFromToken} from "../../utils/tokenUtils";

export const useProfile = () => {
    const token = getUserFromToken();

    const [imageUrl, setImageUrl] = useState("/profile_default.png");
    const [fullName, setFullName] = useState("User");

    useEffect(() => {
        if (!token?.id) return;

        const loadUser = async () => {
            try {
                const user = await fetchUserInfo(token.id);
                setImageUrl(user.image || '/profile_default.png');
                setFullName(user.fullName || 'User');
            } catch (err) {
                console.error("Failed to fetch user info:", err);
            }
        };

        loadUser();
    }, [token]);

    const updateImage = async (file) => {
        try {
            const updatedUser = await changeProfileImage(token.id, file);
            if (updatedUser?.image)
                setImageUrl(updatedUser.image);
            else
                console.warn("No image found in updatedUser response");
        } catch (error) {
            console.error("failed to update profile image: ", error);
        }
    };

    return {imageUrl, fullName, updateImage};
};
