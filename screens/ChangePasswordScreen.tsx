import Title from "../components/Title";
import FormChangePassword from "../components/Form/FormChangePassword";
import ScreenGradient from "../components/ScreenGradient";

function ChangePasswordScreen() {
  return (
    <ScreenGradient>
      <Title>Zmień hasło</Title>
      <FormChangePassword />
    </ScreenGradient>
  );
}

export default ChangePasswordScreen;
