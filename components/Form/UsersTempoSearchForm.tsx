import { View } from "react-native";
import Input, { InputEnum } from "./Input";
import SelectInput, { options } from "./SelectInput/SelectInput";
import DateInput from "./DateInput/DateInput";
import Button from "./Button";
import { useToggle } from "../../hooks/useToggle";
import { useForm } from "./Formhooks/form-hook";
import Card from "../Card";
import { VFC, useEffect, useState } from "react";
import { UserDataT } from "../../screens/UserDataScreen";

const TAG = "UsersTempoSearchForm";

type UsersTempoSearchFormT = {
  usersData: UserDataT[];
  setFilters: (date: string, user: string) => void;
};

const UsersTempoSearchForm: VFC<UsersTempoSearchFormT> = ({
  usersData,
  setFilters,
}) => {
  const { toggle, toggleSwitch } = useToggle(false);
  const [users, setUsers] = useState<options[]>();
  const { onChange, formData } = useForm({
    userSelect: {
      value: "",
      validate: true,
    },
    dateOfTempo: {
      value: "",
      validate: true,
    },
  });

  useEffect(() => {
    const data = usersData.map(user => ({ value: user.id, name: user.email }));
    data.push({ value: "", name: "" });
    setUsers(data);
  }, [usersData]);

  function onSubmit() {
    const date = new Date(formData.inputs.dateOfTempo.value as string);

    setFilters(
      `${date.getMonth() + 1}-${date.getFullYear()}`,
      formData.inputs.userSelect.value as string,
    );
  }

  return (
    <View>
      <Button
        onPress={toggleSwitch}
        buttonText="Opcje wyszukiwania"
        disabled={false}
      />
      {toggle && (
        <Card>
          <SelectInput
            id="userSelect"
            options={users || []}
            labelText="Wybierz użytkownika"
            placeHolder="Wybierz użytkownika"
            onSelect={onChange}
            shouldDisplayNameAsValue
            defaultValue={{ value: "", name: "" }}
            isValid={formData.inputs.userSelect.validate}
          />
          <DateInput
            value={formData.inputs.dateOfTempo.value as string}
            isValid={formData.inputs.dateOfTempo.validate}
            labelName="Data raportu"
            id="dateOfTempo"
            onChange={onChange}
          />
          <Button buttonText="Wyszukaj" onPress={onSubmit} disabled={false} />
        </Card>
      )}
    </View>
  );
};

export default UsersTempoSearchForm;
