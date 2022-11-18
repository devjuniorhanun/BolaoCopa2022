import { Center, Text, Icon } from "native-base";
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '../hooks/userAuth';
import Logo from '../assets/logo.svg';
import { Button } from "../components/Button";

export function SingIn() {
    // Contexto de Autenticação
    const { singIn, user } = useAuth();

   // console.log('Dados do Usuário =>', user)
    return (
        <Center flex={1} bg="gray.900" p={7}>
            <Logo width={212} height={40} />

            <Button
                type="SECONDARY"
                title="ENTRAR COM O GOOGLE"
                leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
                mt={12}
                onPress={singIn}
            />
            <Text color="white" textAlign="center" mt={4}>
                Não utilizamos nenhuma informção além {'\n'} do seu E-mail, para criação de sua conta.
            </Text>
        </Center>
    )
}