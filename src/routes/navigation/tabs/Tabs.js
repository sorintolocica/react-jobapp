import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import { colors } from 'theme'

// stack navigators
import { HomeNavigator, ProfileNavigator, ConnectNavigator } from '../stacks'
import { UserDataContext } from '../../../context/UserDataContext'
import Freelance from '../../../scenes/Freelance'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { userData, setUserData } = useContext(UserDataContext)

  return (
    <Tab.Navigator
      options={{
        tabBarStyle: {
          // backgroundColor: 'white',
          // borderTopColor: 'gray',
          // borderTopWidth: 1,
          // paddingBottom: 5,
          // paddingTop: 5,
        },
      }}
      defaultScreenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.lightPurple,
        tabBarInactiveTintColor: colors.gray,
      })}
      initialRouteName="HomeTab"
      swipeEnabled={false}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontIcon name="home" color={color} size={size} />
          ),
        }}
      />
      {userData?.type === 'user' ? (
        <Tab.Screen
          name="ConnectTab"
          component={ConnectNavigator}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <FontIcon name="heart" color={color} size={size} />
            ),
          }}
        />
      ) : null}
      {userData?.type === 'admin' ? (
        <Tab.Screen
          name="Freelance"
          component={Freelance}
          options={{
            tabBarLabel: 'Freelance',
            tabBarIcon: ({ color, size }) => (
              <FontIcon name="network-wired" color={color} size={size} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
