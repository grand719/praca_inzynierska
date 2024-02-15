import { useState } from "react";

export function useToggle(initialValue: boolean) {
  const [toggle, setToggle] = useState(initialValue);

  function toggleSwitch() {
    setToggle(prevState => !prevState);
  }

  return { toggle, toggleSwitch };
}
