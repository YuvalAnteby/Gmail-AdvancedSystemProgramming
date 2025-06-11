/**
 * File responsible on calls to the web server for profile related information.
 */

export const changeProfileImage = async (file) => {
    /// TODO implement the PATCH call to the backend
    const objectURL = URL.createObjectURL(file);
    return objectURL;
}

export const fetchUserInfo = async (userId) => {
    // TODO: Fetch full name, profile image, etc.
    return {
        fullName: "Yuval Anteby",
        imageUrl: "/profile_default.png"
    };
}