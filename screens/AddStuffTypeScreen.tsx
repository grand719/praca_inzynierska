import React from "react";
import StuffTypeForm from "../components/Form/StuffTypeForm";
import { ScrollView } from "react-native";
import Title, { titleSize } from "../components/Title";

const AddStuffTypeScreen = () => {
  return (
    <ScrollView>
      <Title size={titleSize.medium}>Dodaj typy</Title>
      <StuffTypeForm />
    </ScrollView>
  );
};

export default AddStuffTypeScreen;
