import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import FormLogin from "../components/Form/FormLogin";
import ScreenGradient from "../components/ScreenGradient";
import Title from "../components/Title";
import { RootStackParamList } from "../types";

import { RouteMap } from "../constants/Route";

type LoginScreenType = NativeStackScreenProps<RootStackParamList>;
function LoginScreen({ navigation }: LoginScreenType) {
  return (
    <ScreenGradient>
      <Title>Kajaki</Title>
      <FormLogin />
    </ScreenGradient>
  );
}

export default LoginScreen;
