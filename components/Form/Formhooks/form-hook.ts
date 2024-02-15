/* eslint-disable no-case-declarations */
import { useReducer } from "react";

type StateType = {
  inputs: Record<string, actionDataType>;
  isValid: boolean;
};

type UseFormRT = {
  onChange: (id: string, data: actionDataType) => void;
  formData: StateType;
  resetState: () => void;
};

export type actionDataType = {
  value: number | string | boolean;
  validate: boolean;
};

type actionType = {
  type: formActions;
  id: string;
  data: actionDataType;
  newState?: Record<string, actionDataType>;
  isValid?: boolean;
};

export enum formActions {
  SET_STATE = "SET_STATE",
  SET_INPUTS = "SET_INPUTS",
}

const reducer = (state: StateType, action: actionType): StateType => {
  switch (action.type) {
    case formActions.SET_STATE:
      return { inputs: action.newState!, isValid: action.isValid! };
    case formActions.SET_INPUTS:
      const newInputs = { ...state.inputs };
      let isValid = true;
      Object.keys(newInputs).forEach(key => {
        if (key === action.id) {
          newInputs[key].value = action.data.value;
          newInputs[key].validate = action.data.validate;
          return;
        }

        if (!action.data.validate || !newInputs[key].validate) isValid = false;

        newInputs[action.id] = { ...action.data };
      });

      return { inputs: newInputs, isValid };
    default:
      return state;
  }
};

export const useForm = (
  initialState: Record<string, actionDataType>,
): UseFormRT => {
  const [state, dispatch] = useReducer(reducer, {
    inputs: initialState,
    isValid: false,
  });

  const resetState = () => {
    dispatch({
      type: formActions.SET_STATE,
      isValid: false,
      newState: initialState,
      id: "",
      data: {
        value: "",
        validate: false,
      },
    });
  };

  const onChange = (id: string, data: actionDataType) => {
    dispatch({ type: formActions.SET_INPUTS, id, data });
  };

  return { onChange, formData: state, resetState };
};
