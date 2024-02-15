import { useContext, useState } from "react";
import From from "./Form";
import Input, { InputEnum } from "./Input";
import { useForm } from "./Formhooks/form-hook";
import validator from "../../utils/validator";
import Button from "./Button";
import mw from "../../mw/mw";
import { UserContext } from "../../context/user-context";
import Log from "../../logs/Log";
import LoadingSpinner from "../LoadingSpinner";
import useToast from "../../hooks/useToast";

const TAG = "FormChangePassword";

const FormChangePassword = () => {
  const ctx = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { setConfirmToast, setErrorToast } = useToast();
  const { formData, onChange, resetState } = useForm({
    newPassword: {
      value: "",
      validate: true,
    },
    repeatNewPassword: {
      value: "",
      validate: true,
    },
  });

  function onSubmit() {
    if (
      formData.inputs.newPassword.value !==
      formData.inputs.repeatNewPassword.value
    ) {
      onChange("repeatNewPassword", {
        value: formData.inputs.repeatNewPassword.value,
        validate: false,
      });
      return;
    }

    setIsLoading(true);

    mw.userRequester
      .userChangePassword({
        idToken: ctx.user.idToken,
        password: formData.inputs.newPassword.value as string,
      })
      .then(data => {
        ctx.setUser({
          ...ctx.user,
          idToken: data.idToken,
          refreshToken: data.refreshToken,
        });
        setConfirmToast("Successful change password");
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        setErrorToast(`Failed to change user password: ${ctx.user.name}`);
        Log.error(
          TAG,
          "Could not change password for user: ",
          ctx.user.name,
          e,
        );
      });
    resetState();
  }

  function inputsText() {
    return (
      <>
        <Input
          type={InputEnum.PASSWORD}
          labelText="Nowe hasło"
          placeholder="Nowe hasło"
          value={formData.inputs.newPassword.value as string}
          id={"newPassword"}
          onChange={onChange}
          isValidate={formData.inputs.newPassword.validate}
          validators={[validator.containsString]}
        />
        <Input
          type={InputEnum.PASSWORD}
          labelText="Powtórz nowe hasło"
          placeholder="Powtórz nowe hasło"
          value={formData.inputs.repeatNewPassword.value as string}
          id={"repeatNewPassword"}
          onChange={onChange}
          isValidate={formData.inputs.repeatNewPassword.validate}
          validators={[validator.containsString]}
        />
      </>
    );
  }

  function submitButton() {
    return (
      <Button
        disabled={!formData.isValid}
        buttonText="Zmień hasło"
        onPress={onSubmit}
      />
    );
  }

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <From inputs={inputsText()} subButtons={submitButton()} />
    </>
  );
};

export default FormChangePassword;
