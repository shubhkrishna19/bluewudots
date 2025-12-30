import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// User roles and their permissions
const ROLE_PERMISSIONS = {
    admin: {
        canViewDashboard: true,
        canManageOrders: true,
        canManageInventory: true,
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true,
        canManageCarriers: true,
        canProcessPayments: true
    },
    manager: {
        canViewDashboard: true,
        canManageOrders: true,
        canManageInventory: true,
        canManageUsers: false,
        canViewReports: true,
        canManageSettings: false,
        canManageCarriers: true,
        canProcessPayments: true
    },
    operator: {
        canViewDashboard: true,
        canManageOrders: true,
        canManageInventory: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        canManageCarriers: false,
        canProcessPayments: false
    },
    viewer: {
        canViewDashboard: true,
        canManageOrders: false,
        canManageInventory: false,
        canManageUsers: false,
        canViewReports: true,
        canManageSettings: false,
        canManageCarriers: false,
        canProcessPayments: false
    }
};

// Mock users - in production from Zoho/Auth provider
const MOCK_USERS = [
    { id: 1, email: 'admin@bluewud.com', password: 'admin123', name: 'Shubh Krishna', role: 'admin', avatar: 'SK' },
    { id: 2, email: 'manager@bluewud.com', password: 'manager123', name: 'Priya Sharma', role: 'manager', avatar: 'PS' },
    { id: 3, email: 'operator@bluewud.com', password: 'operator123', name: 'Rahul Kumar', role: 'operator', avatar: 'RK' },
    { id: 4, email: 'viewer@bluewud.com', password: 'viewer123', name: 'Guest User', role: 'viewer', avatar: 'GU' }
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('bluewud_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('bluewud_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const userSession = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role,
                avatar: foundUser.avatar,
                permissions: ROLE_PERMISSIONS[foundUser.role],
                loginTime: new Date().toISOString()
            };
            setUser(userSession);
            localStorage.setItem('bluewud_user', JSON.stringify(userSession));
            setIsLoading(false);
            return { success: true };
        } else {
            setError('Invalid email or password');
            setIsLoading(false);
            return { success: false, error: 'Invalid credentials' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bluewud_user');
    };

    const hasPermission = (permission) => {
        if (!user || !user.permissions) return false;
        return user.permissions[permission] === true;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            error,
            isAuthenticated: !!user,
            login,
            logout,
            hasPermission,
            roles: Object.keys(ROLE_PERMISSIONS)
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
