const handleLogout = (logoutFunction) => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    logoutFunction();
    window.location.reload();
};

export default handleLogout;