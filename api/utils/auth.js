export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
};

export const getToken = () => {
    return localStorage.getItem("token");
};
