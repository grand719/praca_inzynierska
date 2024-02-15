class Validator {
  containsString = (value: string) => {
    return value.length === 0;
  };
  isNumber = (value: string) => {
    return !/[1-9]{9}/gm.test(value);
  };
  isEmail = (value: string) => {
    return !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value,
    );
  };
}

const validator = new Validator();

export default validator;
