import {useEffect, useState} from 'react';
import {changeProfileImage} from "../../api/profileApi";
import {getUserFromToken} from "../../utils/tokenUtils";

export const useProfile = () => {
    const token = getUserFromToken();

    const [imageUrl, setImageUrl] = useState(token?.image || "/profile_default.png");
    const [fullName, setFullName] = useState(token?.fullName || 'NAME_ERROR');

    useEffect(() => {
        const fetch = async () => {
            if (token) {
                const { imageUrl, fullName } = token;
                setImageUrl(imageUrl || '/profile_default.png');
                setFullName(fullName);
            }
        };
        fetch();
    }, [token]);

    useEffect(() => {
        console.log('imageUrl updated:', imageUrl);
    }, [imageUrl]);

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
