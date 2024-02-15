export enum userRequesterEndpoints {
  SIGN_UP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
  USER_DATA_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=",
  SIGN_IN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=",
  CHANGE_PASSWORD = "https://identitytoolkit.googleapis.com/v1/accounts:update?key=",
  REFRESH_TOKEN = "https://securetoken.googleapis.com/v1/token?key=",
  RESET_EMAIL = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=",
}

export enum methods {
  POST = "post",
  GET = "get",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

export enum rdbRequesterEndpoints {
  RDB = "https://hr-kajak-default-rtdb.europe-west1.firebasedatabase.app/",
}
