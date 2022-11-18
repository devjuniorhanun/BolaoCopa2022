import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Redirecionamento da autenticação
WebBrowser.maybeCompleteAuthSession();

// Tipagem de Usuário
interface UserProps {
    name: string;
    avatarUrl: string;

}

// Tipagem do provedor de autenticação
interface AuthProviderProps {
    children: ReactNode;
}

// Interface do usuário
export interface AuthContextDataProps {
    user: UserProps;
    singIn: () => Promise<void>;
    isUserLoading: boolean,
}

// Contexto de Autenticação
export const AuthContext = createContext({} as AuthContextDataProps);

// Provedor de Autenticação
export function AuthContextProvider({ children }: AuthProviderProps) {
    const [isUserLoading, setIsUserLoading] = useState(false); // Estado de fluxo de autenticação
    const [user, setUser] = useState<UserProps>({} as UserProps); // Estado de fluxo dos dados vindos da autenticação

    // Criação da autenticação do Google
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '126774484467-5q5lnvpnr3vuo7pkvfstkao6uhb5kdof.apps.googleusercontent.com', // clienteId do Google
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email'],
    });
    //console.log(AuthSession.makeRedirectUri({ useProxy: true }));

    // Função de Autenticação
    async function singIn() {
        // Fluxo de autenticação
        try {
            // Autenticação Validada
            setIsUserLoading(true);
            await promptAsync();

        } catch (error) {
            // Erro na autenticação
            console.log(error);
            throw error;

        } finally {
            setIsUserLoading(false);
        }

    }

    // Função para pegar o token de acesso
    async function singInWithGoogle(access_token: string) {
        //console.log("Autenticação ==> ", access_token);

    }

    // Observação das mudaçã de estados da autenticação
    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken) {
            singInWithGoogle(response.authentication.accessToken);

        }

    }, [response]);


    return (
        <AuthContext.Provider value={{
            singIn,
            isUserLoading,
            user,
        }}>
            {children}
        </AuthContext.Provider>

    );
}