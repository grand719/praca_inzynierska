import From from "./Form";
import Input, { InputEnum } from "./Input";
import { useForm } from "./Formhooks/form-hook";
import Button from "./Button";
import validator from "../../utils/validator";
import mw from "../../mw/mw";
import { doNothing } from "../../utils/helper";
import SelectInput from "./SelectInput/SelectInput";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import useToast from "../../hooks/useToast";

const TAG = "RegisterEmployeeForm";

const options = [
  { name: "admin", value: "admin" },
  { name: "pracownik", value: "pracownik" },
];

const RegisterEmployeeForm = () => {
  const [isLoading, setSetIsLoading] = useState(false);

  const { setConfirmToast, setErrorToast } = useToast();
  const { onChange, formData, resetState } = useForm({
    email: {
      validate: true,
      value: "",
    },
    password: {
      validate: true,
      value: "",
    },
    name: {
      validate: true,
      value: "",
    },
    surname: {
      validate: true,
      value: "",
    },
    phoneNumber: {
      validate: true,
      value: "",
    },
    salary: {
      validate: true,
      value: 0,
    },
    role: {
      validate: true,
      value: "",
    },
  });

  const onSubmit = () => {
    setSetIsLoading(true);
    mw.userRequester
      .registerNewUser(
        {
          email: formData.inputs.email.value as string,
          password: formData.inputs.password.value as string,
        },
        {
          name: formData.inputs.name.value as string,
          surname: formData.inputs.surname.value as string,
          phoneNumber: formData.inputs.phoneNumber.value as string,
          salary: formData.inputs.salary.value as number,
          role: formData.inputs.role.value as string,
          email: formData.inputs.email.value as string,
        },
      )
      .then(r => {
        setSetIsLoading(false);
        setConfirmToast("Successfully added user");
        resetState();
      })
      .catch(e => {
        setSetIsLoading(false);
        setErrorToast("Failed to add user");
        doNothing();
      });
  };

  function InputEmail() {
    return (
      <Input
        id="email"
        labelText="E-mail"
        placeholder="email"
        type={InputEnum.EMAIL}
        onChange={onChange}
        isValidate={formData.inputs.email.validate}
        value={formData.inputs.email.value as string}
        validators={[validator.containsString, validator.isEmail]}
      />
    );
  }

  function InputPassword() {
    return (
      <Input
        id="password"
        labelText="Hasło"
        placeholder="Hasło"
        type={InputEnum.PASSWORD}
        onChange={onChange}
        isValidate={formData.inputs.password.validate}
        value={formData.inputs.password.value as string}
        validators={[validator.containsString]}
      />
    );
  }

  function SelectInputs() {
    return (
      <SelectInput
        id="role"
        options={options}
        labelText="Rola"
        placeHolder="rola"
        onSelect={onChange}
        defaultValue={{ value: "", name: "" }}
        isValid={formData.inputs.role.validate}
      />
    );
  }

  function InputText() {
    return (
      <>
        <Input
          id="name"
          labelText="Imię"
          placeholder="imię"
          type={InputEnum.TEXT}
          onChange={onChange}
          value={formData.inputs.name.value as string}
          isValidate={formData.inputs.name.validate}
          validators={[validator.containsString]}
        />
        <Input
          id="surname"
          labelText="Nazwisko"
          placeholder="nazwisko"
          type={InputEnum.TEXT}
          onChange={onChange}
          value={formData.inputs.surname.value as string}
          isValidate={formData.inputs.surname.validate}
          validators={[validator.containsString]}
        />
        <Input
          id="phoneNumber"
          labelText="Numer telefonu"
          placeholder="Numer telefonu"
          type={InputEnum.TEXT}
          onChange={onChange}
          value={formData.inputs.phoneNumber.value as string}
          isValidate={formData.inputs.phoneNumber.validate}
          validators={[validator.containsString, validator.isNumber]}
        />
        <Input
          id="salary"
          labelText="Pensja"
          placeholder="Pensja"
          type={InputEnum.NUMBER}
          onChange={onChange}
          isValidate={formData.inputs.salary.validate}
          value={formData.inputs.salary.value.toString()}
          validators={[validator.containsString]}
          currency
        />
      </>
    );
  }

  function submit() {
    return (
      <Button
        buttonText="Zarejestruj"
        onPress={onSubmit}
        disabled={!formData.isValid}
      />
    );
  }

  function inputs() {
    return (
      <>
        {InputEmail()}
        {InputPassword()}
        {InputText()}
        {SelectInputs()}
      </>
    );
  }

  return (
    <>
      <From inputs={inputs()} subButtons={submit()} />
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
};

export default RegisterEmployeeForm;
