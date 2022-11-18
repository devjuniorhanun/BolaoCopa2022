import { useContext} from 'react';

import { AuthContext, AuthContextDataProps } from '../contexts/AuthContext';

// Hooks de autenticação
export function useAuth(): AuthContextDataProps {
    const context = useContext(AuthContext);
    return context;
}