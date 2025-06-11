import {useEffect, useState} from 'react';
import {fetchUserInfo, changeProfileImage} from "../../api/profileApi";

export const useProfile = (userId) => {
    const [imageUrl, setImageUrl] = useState("/profile_default.png");
    const [fullName, setFullName] = useState("User");

    useEffect(() => {
        const fetch = async () => {
            const {imageUrl, fullName} = await fetchUserInfo(userId);
            setImageUrl(imageUrl);
            setFullName(fullName);
        };
        if (userId) fetch();
    }, [userId]);

    const updateImage = async (file) => {
        const newUrl = await changeProfileImage(file);
        setImageUrl(newUrl);
    };

    return {imageUrl, fullName, updateImage};
};
