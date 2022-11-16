import { NativeBaseProvider, StatusBar } from "native-base";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Loading } from './src/components/Loading';
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { Polls } from "./src/screens/Polls";
import { THEME } from './src/styles/theme'

// Inicialização do aplicativo
export default function App() {
  // Configuração das fontos do aplicativos
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });
  return (
    // Habilitando o Native Base
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Polls /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}