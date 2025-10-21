export interface AuthProps {
    user: any | null;
    authReady: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<any | null>;
    logout: () => void;
    getToken: () => string | null;
}