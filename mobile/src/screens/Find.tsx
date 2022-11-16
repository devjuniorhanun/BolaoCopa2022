import { Heading, VStack, Icon } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";


export function Find() {
    return (
        <VStack flex={1} bg="gray.900">
            <Header title="Criar novo Bolão" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Buscar por Código
                </Heading>
                <Input
                    mb={2}
                    placeholder="Qual e o nome do seu Bolão"
                />
                <Button
                    title="BUSCAR BOLÃO!!"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                />
            </VStack>
        </VStack>
    );
}