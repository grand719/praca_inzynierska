export enum RouteMap {
  ROOT = "root",
  ANONYMOUS = "anonymous",
  HOME = "home",
  LOGIN = "login",
  RENT = "rent",
  RESERVATION_DETAILS = "reservationDetails",
  REGISTER = "register",
  USER_DATA = "usersData",
  STATISTIC_FORM = "statisticForm",
  ALL_USERS_TEMPO = "allUsersTempo",
  STATISTIC_SUMMARY = "statisticSummary",
  SCHEDULE = "scheduleScreen",
  USER = "user",
  STUFF_MANAGER = "stuffManager",
}

export enum UserOptionsRouteMap {
  NOTIFICATIONS = "notifications",
  USER_MY_DETAILS = "userMyDetails",
  USER_CHANGE_PASSWORD = "userChangePassword",
  USER_TEMPO_FORM = "userTempoForm",
}

export enum StuffManagerRouteMap {
  ADD_STUFF_TYPE_FORM = "addStuffTypeForm",
  ADD_STUFF_ITEM_FORM = "addStuffItemForm",
  STUFF_TYPES = "stuffTypes",
  STUFF_ITEMS = "stuffItems",
}

const RouteHeaders = {
  root: "Home",
  anonymous: "",
  login: "Logowanie",
  rent: "Wypożyczanie",
  home: "Home",
  register: "Rejestracja",
  usersData: "Użytkownicy",
  statisticForm: "Statystyki",
  userTempoForm: "Raport",
  allUsersTempo: "Raporty wszystkich",
  statisticSummary: "Statistics",
  user: "Moje konto",
  userChangePassword: "Zmień hasło",
  userMyDetails: "Detale",
  notifications: "Powiadomienia",
  scheduleScreen: "Grafik",
  stuffManager: "Menadżer przedmiotów",
  addStuffTypeForm: "Dodaj typ przedmiotów",
  addStuffItemForm: "Dodaj przedmiot",
  stuffTypes: "Typy przedmiotów",
  stuffItems: "Przedmioty",
  reservationDetails: "Detale rezerwacji",
};

export function getRouteHeaders(
  route: RouteMap | UserOptionsRouteMap | StuffManagerRouteMap,
): string {
  return RouteHeaders[route];
}
