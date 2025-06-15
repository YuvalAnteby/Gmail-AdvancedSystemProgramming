import {useEffect, useState} from 'react';
import {fetchUserInfo, changeProfileImage} from "../../api/profileApi";

export const useProfile = (userId) => {
    const [imageUrl, setImageUrl] = useState("/profile_default.png");
    const [fullName, setFullName] = useState("User");

    useEffect(() => {
        const fetch = async () => {
            const {imageUrl, fullName} = await fetchUserInfo(userId);
            setImageUrl(imageUrl || '/profile_default.png');
            setFullName(fullName);
        };
        if (userId) fetch();
    }, [userId]);

    const updateImage = async (file) => {
        const updatedUser = await changeProfileImage(userId, file);
        setImageUrl(updatedUser.image);
    };

    return {imageUrl, fullName, updateImage};
};
