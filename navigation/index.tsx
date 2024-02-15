import { useContext } from "react";
import { Platform, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import AllUsersTempoScreen from "../screens/AllUsersTempoScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserDataScreen from "../screens/UserDataScreen";
import UserTempoFormScreen from "../screens/UserTempoFormScreen";
import UserScreen from "../screens/UserScreen";
import StuffManagerScreen from "../screens/StuffManagerScreen";

import {
  RouteMap,
  getRouteHeaders,
  UserOptionsRouteMap,
  StuffManagerRouteMap,
} from "../constants/Route";
import { UserContext } from "../context/user-context";

import Colors from "../constants/Colors";
import IconButton from "../components/DatePicker/components/IconButton";
import MyDetailsScreen from "../screens/MyDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import AddStuffTypeScreen from "../screens/AddStuffTypeScreen";
import AddStuffItemScreen from "../screens/AddStuffItemScreen";
import StuffItemsScreen from "../screens/StuffItemsScreen";
import StuffTypesScreen from "../screens/StuffTypesScreen";
import RentStuffItemsScreen from "../screens/RentStuffItemsScreen";
import TextButton from "../components/Form/TextButton";
import ReservationScreen from "../screens/ReservationScreen";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const screensOptions = {
  headerTintColor: Colors.defaultColors.text,
  headerTransparent: true,
  contentStyle: {
    backgroundColor: Colors.defaultColors.backGround,
  },
};

const bottomTabScreensOptions: BottomTabNavigationOptions = {
  headerTintColor: Colors.defaultColors.text,
  headerTransparent: true,
  tabBarActiveTintColor: Colors.defaultColors.focus,
  tabBarInactiveTintColor: Colors.defaultColors.text,
  tabBarStyle: {
    backgroundColor: Colors.defaultColors.backGround,
  },
};

type navigationSim = {
  navigation: {
    navigate: (value: string) => void;
  };
};

function LoginTextButton() {
  const navigation = useNavigation();
  return (
    <TextButton
      text="Zaloguj"
      onPress={() => {
        navigation.navigate(RouteMap.LOGIN);
      }}
    />
  );
}

function BottomTabNavigationAnonymous() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        ...bottomTabScreensOptions,
        headerRightContainerStyle: styles.headerRightContainer,
      }}>
      <BottomTabs.Screen
        name={RouteMap.RENT}
        component={RentStuffItemsScreen}
        options={{
          headerRight: () => <LoginTextButton />,
          title: getRouteHeaders(RouteMap.RENT),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={RouteMap.RESERVATION_DETAILS}
        component={ReservationScreen}
        options={{
          headerRight: () => <LoginTextButton />,
          title: getRouteHeaders(RouteMap.RESERVATION_DETAILS),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="archive-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function BottomTabNavigation({ navigation }: navigationSim) {
  const ctx = useContext(UserContext);
  return (
    <BottomTabs.Navigator
      screenOptions={{
        ...bottomTabScreensOptions,
        headerRightContainerStyle: styles.headerRightContainer,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="person"
            size={Platform.OS === "ios" ? 25 : 25}
            color={tintColor!}
            onPress={() => {
              navigation.navigate(RouteMap.USER);
            }}
          />
        ),
      }}>
      <BottomTabs.Screen
        name={RouteMap.SCHEDULE}
        component={ScheduleScreen}
        options={{
          title: getRouteHeaders(RouteMap.SCHEDULE),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={RouteMap.RENT}
        component={RentStuffItemsScreen}
        options={{
          title: getRouteHeaders(RouteMap.RENT),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={RouteMap.STUFF_MANAGER}
        component={StuffManagerScreen}
        options={{
          title: getRouteHeaders(RouteMap.STUFF_MANAGER),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="boat-outline" color={color} size={size} />
          ),
        }}
      />
      {ctx.user.role === "admin" && (
        <>
          <BottomTabs.Screen
            name={RouteMap.USER_DATA}
            component={UserDataScreen}
            options={{
              title: getRouteHeaders(RouteMap.USER_DATA),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" color={color} size={size} />
              ),
            }}
          />
          <BottomTabs.Screen
            name={RouteMap.ALL_USERS_TEMPO}
            component={AllUsersTempoScreen}
            options={{
              title: getRouteHeaders(RouteMap.ALL_USERS_TEMPO),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-speedometer" color={color} size={size} />
              ),
            }}
          />
          <BottomTabs.Screen
            name={RouteMap.REGISTER}
            component={RegisterScreen}
            options={{
              title: getRouteHeaders(RouteMap.REGISTER),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle" color={color} size={size} />
              ),
            }}
          />
        </>
      )}
    </BottomTabs.Navigator>
  );
}

function Navigation() {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screensOptions}>
        {user.loggedIn ? (
          <>
            <Stack.Screen
              options={{ headerShown: false }}
              name={RouteMap.ROOT}
              component={BottomTabNavigation}
            />
            <Stack.Screen
              name={RouteMap.USER}
              component={UserScreen}
              options={{ headerTitle: getRouteHeaders(RouteMap.USER) }}
            />
            <Stack.Screen
              name={UserOptionsRouteMap.USER_MY_DETAILS}
              component={MyDetailsScreen}
              options={{
                headerTitle: getRouteHeaders(
                  UserOptionsRouteMap.USER_MY_DETAILS,
                ),
              }}
            />
            <Stack.Screen
              name={UserOptionsRouteMap.NOTIFICATIONS}
              component={NotificationsScreen}
              options={{
                headerTitle: getRouteHeaders(UserOptionsRouteMap.NOTIFICATIONS),
              }}
            />
            <Stack.Screen
              name={UserOptionsRouteMap.USER_CHANGE_PASSWORD}
              component={ChangePasswordScreen}
              options={{
                headerTitle: getRouteHeaders(
                  UserOptionsRouteMap.USER_CHANGE_PASSWORD,
                ),
              }}
            />
            <Stack.Screen
              name={RouteMap.RESERVATION_DETAILS}
              component={ReservationScreen}
              options={{
                headerTitle: getRouteHeaders(RouteMap.RESERVATION_DETAILS),
              }}
            />
            <Stack.Screen
              name={UserOptionsRouteMap.USER_TEMPO_FORM}
              component={UserTempoFormScreen}
              options={{
                headerTitle: getRouteHeaders(
                  UserOptionsRouteMap.USER_TEMPO_FORM,
                ),
              }}
            />
            <Stack.Screen
              name={StuffManagerRouteMap.ADD_STUFF_TYPE_FORM}
              component={AddStuffTypeScreen}
              options={{
                headerTitle: getRouteHeaders(
                  StuffManagerRouteMap.ADD_STUFF_TYPE_FORM,
                ),
              }}
            />
            <Stack.Screen
              name={StuffManagerRouteMap.ADD_STUFF_ITEM_FORM}
              component={AddStuffItemScreen}
              options={{
                headerTitle: getRouteHeaders(
                  StuffManagerRouteMap.ADD_STUFF_ITEM_FORM,
                ),
              }}
            />
            <Stack.Screen
              name={StuffManagerRouteMap.STUFF_ITEMS}
              component={StuffItemsScreen}
              options={{
                headerTitle: getRouteHeaders(StuffManagerRouteMap.STUFF_ITEMS),
              }}
            />
            <Stack.Screen
              name={StuffManagerRouteMap.STUFF_TYPES}
              component={StuffTypesScreen}
              options={{
                headerTitle: getRouteHeaders(StuffManagerRouteMap.STUFF_TYPES),
              }}
            />
          </>
        ) : (
          <Stack.Group
            screenOptions={{
              headerTransparent: true,
            }}>
            <Stack.Screen
              name={RouteMap.ANONYMOUS}
              options={{ headerShown: false }}
              component={BottomTabNavigationAnonymous}
            />
            <Stack.Screen
              name={RouteMap.LOGIN}
              options={{ headerTitle: "" }}
              component={LoginScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;

const styles = StyleSheet.create({
  headerRightContainer: {
    justifyContent: "center",
    paddingRight: 15,
  },
});
