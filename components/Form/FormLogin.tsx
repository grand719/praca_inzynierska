import { ReactNode, useContext, useState } from "react";

import validator from "../../utils/validator";
import { InputEnum } from "./Input";
import { useForm } from "./Formhooks/form-hook";

import From from "./Form";
import Input from "./Input";
import FormButton from "./Button";
import { UserContext } from "../../context/user-context";
import mw from "../../mw/mw";
import Log from "../../logs/Log";
import LoadingSpinner from "../LoadingSpinner";
import useToast from "../../hooks/useToast";

const TAG = "FormLogin";

const FormLogin = () => {
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { setConfirmToast, setErrorToast } = useToast();

  const { onChange, formData, resetState } = useForm({
    userName: {
      value: "",
      validate: true,
    },
    userPassword: {
      value: "",
      validate: true,
    },
  });

  function onSubmitPressHandel() {
    setIsLoading(true);
    mw.userRequester
      .signInUser({
        email: formData.inputs.userName.value as string,
        password: formData.inputs.userPassword.value as string,
      })
      .then(data => {
        Log.info(TAG, "User logged in");
        setUser({
          ...data.additionalData,
          ...data.user,
          loggedIn: true,
        });
        setConfirmToast("Logged in");
        setIsLoading(false);
        resetState();
      })
      .catch(e => {
        Log.error(TAG, "Failed to login", e);
        setErrorToast("Failed to login");
        setIsLoading(false);
      });
  }

  function inputs(): ReactNode {
    return (
      <>
        <Input
          onChange={onChange}
          id={"userName"}
          type={InputEnum.TEXT}
          labelText={"Nazwa/E-mail"}
          placeholder={"Nazwa/E-mail"}
          value={formData.inputs.userName.value as string}
          isValidate={formData.inputs.userName.validate}
          validators={[validator.containsString]}
        />
        <Input
          onChange={onChange}
          id={"userPassword"}
          type={InputEnum.PASSWORD}
          labelText={"Hasło"}
          placeholder={""}
          value={formData.inputs.userPassword.value as string}
          isValidate={formData.inputs.userPassword.validate}
          validators={[validator.containsString]}
        />
      </>
    );
  }

  function subButtons(): ReactNode {
    return (
      <FormButton
        disabled={!formData.isValid}
        onPress={onSubmitPressHandel}
        buttonText="Zaloguj"
      />
    );
  }

  return (
    <>
      <From inputs={inputs()} subButtons={subButtons()} />
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
};

export default FormLogin;
