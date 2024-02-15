import { ScrollView } from "react-native";
import React from "react";
import StuffItemForm from "../components/Form/StuffItemForm";
import Title, { titleSize } from "../components/Title";

const AddStuffItemScreen = () => {
  return (
    <ScrollView>
      <Title size={titleSize.medium}>Dodaj przedmioty</Title>
      <StuffItemForm />
    </ScrollView>
  );
};

export default AddStuffItemScreen;
