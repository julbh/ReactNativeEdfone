import React, { Component } from 'react'
import {Platform} from 'react-native'
import { createStackNavigator, createAppContainer,StackNavigator, DrawerNavigator, createDrawerNavigator, createSwitchNavigator } from 'react-navigation'
import SideMenu from '../Containers/SideMenu'
import Profile from '../Containers/Profile'
import OtpVerification from '../Containers/OtpVerification'
import Onboarding from '../Containers/Onboarding'
import LaunchScreen from '../Containers/LaunchScreen'
import NoteFullScreen from '../Containers/NoteFullScreen'
import TimerWithNotesList from '../Containers/TimerWithNotesList'
import CreateNoteEnd from '../Containers/CreateNoteEnd'
import NoteCreate from '../Containers/NoteCreate'
import Invite from '../Containers/Invite'
import CreateTask from '../Containers/CreateTask'
import Tasks from '../Containers/Tasks'
import About from '../Containers/About'
import Store from '../Containers/Store'
import Assessment from '../Containers/Assessment'
import Header from '../Components/Header'
import styles from './Styles/NavigationStyles'

const NonAuthStack = createStackNavigator({
  Onboarding: {
    screen: Onboarding,
    navigationOptions : {
      header: null
    }
  },
  OtpVerification: {
    screen: OtpVerification,
    navigationOptions : {
      header: null
    }
  },
  ProfileComplete: {
    screen: Profile,
    navigationOptions : ({navigation}) => ({
      header: null
    })
  },
},
{
  // Default config for all screens
  headerMode: 'float',
  initialRouteName: 'Onboarding',
  header: null,
  navigationOptions: {
    headerStyle: styles.header
  }
})

const AuthStackWithoutDrawer = createStackNavigator({
  NoteFullScreen: {
    screen: NoteFullScreen,
    navigationOptions : ({navigation}) => ({
      header: null
    })
  },
  TimerWithNotesList: {
    screen: TimerWithNotesList,
    navigationOptions : {
      header: null
    }
  },
  NoteCreate: {
    screen: NoteCreate,
    navigationOptions : {
      header: null
    }
  },
  CreateNoteEnd: {
    screen: CreateNoteEnd,
    navigationOptions : {
      header: null
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions : ({navigation}) => ({
      header: null
    })
  },
  Invite: {
    screen: Invite,
    navigationOptions : ({navigation}) => ({
      header: null
    })
  },
  About: {
    screen: About,
    navigationOptions : {
      header: null
    }
  },
  // Store: {
  //   screen: Store,
  //   navigationOptions : {
  //     header: null
  //   }
  // },
  CreateTask: {
    screen: CreateTask,
    navigationOptions : {
      header: null
    }
  },
  Assessment: {
    screen: Assessment,
    navigationOptions : {
      header: null
    }
  },
},
{
  // Default config for all screens
  headerMode: 'float',
  initialRouteName: 'About', // actual
  // initialRouteName: 'Profile',
  header: null,
  navigationOptions: {
    headerStyle: styles.header
  }
})

const LaunchScreenNavigator = createStackNavigator({
  LaunchScreen: {
    screen: LaunchScreen,
    navigationOptions : ({navigation}) => ({
      header: <Header navigation={navigation}/>
    })
  },
})

const AuthStackWithDrawer = createDrawerNavigator({
  LaunchScreen: LaunchScreenNavigator,
},{
  contentComponent: ({ navigation }) => <SideMenu navigation={navigation} /> ,
  mode: Platform.OS === 'ios' ? 'modal' : 'card',
  drawerWidth:230,
  initialRouteName: 'LaunchScreen',
  drawerPosition: 'right',
});

const PrimaryNav = createSwitchNavigator({
  NonAuthStack: NonAuthStack,
  AuthStackWithDrawer: AuthStackWithDrawer,
  AuthStackWithoutDrawer: AuthStackWithoutDrawer,
},
{
  initialRouteName: 'AuthStackWithDrawer',// actual
  // initialRouteName: 'AuthStackWithoutDrawer',
})

export default createAppContainer(PrimaryNav)
