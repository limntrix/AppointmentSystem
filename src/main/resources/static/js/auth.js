const AUTH_KEY = 'medi_auth_user';

const Auth = {
    login: (userData) => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        window.dispatchEvent(new Event('auth-change'));
    },

    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        window.dispatchEvent(new Event('auth-change'));
        showSection('home');
    },

    getUser: () => {
        const str = localStorage.getItem(AUTH_KEY);
        return str ? JSON.parse(str) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(AUTH_KEY);
    },

    getToken: () => {
        // In a real app with JWT, return the token here
        return null;
    }
};

function logout() {
    Auth.logout();
    showToast('Logged out successfully', 'success');
}
