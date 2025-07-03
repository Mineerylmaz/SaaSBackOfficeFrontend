export const setUserCookie = (user) => {
    const userStr = encodeURIComponent(JSON.stringify(user));
    document.cookie = `user=${userStr}; path=/; max-age=${60 * 60 * 24}`;
};

export const getUserFromCookie = () => {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));
    if (!cookie) return null;

    try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch {
        return null;
    }
};

export const clearUserCookie = () => {
    document.cookie = 'user=; path=/; max-age=0';
};
