import React, { useEffect, useState } from "react";
import Card from "../Card";
import { useForm } from "./Formhooks/form-hook";
import SelectInput, { options } from "./SelectInput/SelectInput";
import DateInput from "./DateInput/DateInput";
import Button from "./Button";
import { UserDataT } from "../../screens/UserDataScreen";
import mw from "../../mw/mw";
import NewTimePicker from "./NewTimePicker";

type ScheduleFormT = {
  usersData: UserDataT[];
  onClose: () => void;
  updateSchedule: (shouldUpdate: boolean) => void;
};

const ScheduleForm: React.VFC<ScheduleFormT> = ({
  usersData,
  onClose,
  updateSchedule,
}) => {
  const [users, setUsers] = useState<options[]>();
  const { onChange, formData, resetState } = useForm({
    userSelect: {
      value: "",
      validate: true,
    },
    dateOfSchedule: {
      value: "",
      validate: true,
    },
    startTime: {
      value: "",
      validate: true,
    },
    endTime: {
      value: "",
      validate: true,
    },
  });

  useEffect(() => {
    const data = usersData.map(user => ({ value: user.id, name: user.email }));
    setUsers(data);
  }, [usersData]);

  function onSubmit() {
    const filteredUser = usersData.filter(
      user => user.id === formData.inputs.userSelect.value,
    );
    const userName = filteredUser[0] ? filteredUser[0].email : "anonimowy";
    mw.rdbRequester
      .addUserSchedule(formData.inputs.userSelect.value as string, {
        date: new Date(formData.inputs.dateOfSchedule.value as string),
        dateFrom: formData.inputs.startTime.value as string,
        dateTo: formData.inputs.endTime.value as string,
        userName,
      })
      .then(() => {
        console.log("add");
        updateSchedule(true);
      })
      .catch(e => {
        console.log(e);
      });
    onClose();
  }

  return (
    <Card>
      <SelectInput
        id="userSelect"
        options={users || []}
        labelText="Wybierz użytkownika"
        placeHolder="Wybierz użytkownika"
        shouldDisplayNameAsValue
        defaultValue={{ value: "", name: "" }}
        onSelect={onChange}
        isValid={formData.inputs.userSelect.validate}
      />
      <DateInput
        value={formData.inputs.dateOfSchedule.value as string}
        isValid={formData.inputs.dateOfSchedule.validate}
        labelName="Data zmiany"
        id="dateOfSchedule"
        onChange={onChange}
      />
      <NewTimePicker
        id="startTime"
        labelText="Początek"
        placeholder="Początek"
        onChange={onChange}
        isValid={formData.inputs.startTime.validate}
        timeValue={formData.inputs.startTime.value as string}
      />
      <NewTimePicker
        id="endTime"
        labelText="Koniec"
        placeholder="Koniec"
        onChange={onChange}
        timeValue={formData.inputs.endTime.value as string}
        isValid={formData.inputs.endTime.validate}
      />
      <Button
        buttonText="Dodaj zmianę"
        onPress={onSubmit}
        disabled={!formData.isValid}
      />
    </Card>
  );
};

export default ScheduleForm;
