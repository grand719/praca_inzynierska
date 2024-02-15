import React, {
  ReactNode,
  VFC,
  useCallback,
  useContext,
  useState,
} from "react";
import Card from "../Card";
import Input, { InputEnum } from "./Input";
import { useForm } from "./Formhooks/form-hook";
import validator from "../../utils/validator";
import Form from "./Form";
import Button from "./Button";
import LoadingSpinner from "../LoadingSpinner";
import mw from "../../mw/mw";
import { UserContext } from "../../context/user-context";
import { NotificationsContext } from "../../context/notifacations-context";
import Log from "../../logs/Log";
import { ToastContex, messageTypes } from "../../context/toast-contex";

const TAG = "NotificationForm";

type NotificationFormT = {
  toggleSwitch: () => void;
};

const NotificationForm: VFC<NotificationFormT> = ({ toggleSwitch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const userCtx = useContext(UserContext);
  const toastCtx = useContext(ToastContex);
  const notificationCtx = useContext(NotificationsContext);
  const { onChange, formData, resetState } = useForm({
    message: {
      value: "",
      validate: true,
    },
    title: {
      value: "",
      validate: true,
    },
  });

  function inputs(): ReactNode {
    return (
      <>
        <Input
          onChange={onChange}
          id={"title"}
          type={InputEnum.TEXT}
          labelText={"Tytuł"}
          placeholder={"Tytuł"}
          value={formData.inputs.title.value as string}
          isValidate={formData.inputs.title.validate}
          validators={[validator.containsString]}
        />
        <Input
          onChange={onChange}
          id={"message"}
          type={InputEnum.TEXT}
          labelText={"Wiadomość"}
          placeholder={"Wiadomość"}
          value={formData.inputs.message.value as string}
          isValidate={formData.inputs.message.validate}
          validators={[validator.containsString]}
        />
      </>
    );
  }

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    mw.rdbRequester
      .sendNotifications({
        message: formData.inputs.message.value as string,
        title: formData.inputs.title.value as string,
        seenBy: [
          {
            uid: userCtx.user.localId,
            userName: userCtx.user.email,
          },
        ],
      })
      .then(() => {
        return notificationCtx.pullNotifications();
      })
      .then(() => {
        toggleSwitch();
        setIsLoading(false);
        toastCtx.setMessage({
          text: "Pomyślnie wysłano powiadomienie",
          type: messageTypes.confirm,
        });
      })
      .catch(e => {
        setIsLoading(false);
        toggleSwitch();
        toastCtx.setMessage({
          text: "Błąd wysyłania powiadomienie",
          type: messageTypes.error,
        });
        Log.error(TAG, "Failed to send notification", e);
      });
  }, [
    formData.inputs.message.value,
    formData.inputs.title.value,
    notificationCtx,
    toastCtx,
    toggleSwitch,
    userCtx.user.email,
    userCtx.user.localId,
  ]);

  function submitButton(): ReactNode {
    return (
      <Button
        disabled={!formData.isValid}
        onPress={onSubmit}
        buttonText={"Wyślij"}
      />
    );
  }

  return (
    <Card style={{ height: "40%" }}>
      <Form inputs={inputs()} subButtons={submitButton()}></Form>
      <LoadingSpinner isLoading={isLoading} />
    </Card>
  );
};

export default NotificationForm;
