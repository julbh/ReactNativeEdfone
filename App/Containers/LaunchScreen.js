import React, { Component } from 'react'
import { ScrollView, Image, Text, TouchableHighlight, View, BackHandler, Alert, Platform, Linking, Modal } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import VersionNumber from 'react-native-version-number';

import SideMenuActions from '../Redux/SideMenuRedux'
import DeepLinkActions from '../Redux/DeepLinkRedux'
import NotesActions from '../Redux/NotesRedux'
import Timer from './Timer'
import Notes from './Notes'
import Tasks from './Tasks'
import Store from './Store'
import Search from './Search'

// Styles
import styles from './Styles/LaunchScreenStyle'
import { Metrics, Fonts, Colors } from '../Themes';
import BottomTab from '../Components/BottomTab'

class LaunchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentActiveTab : 'Notes',
      showUpdateModalRecommendation: false,
      showUpdateModalForce: false,
    }
    if(!this.props.sideMenu.accessToken || !this.props.sideMenu.userProfile) {
      this.navigateToScreen('Onboarding')
    }
    else if(!this.props.sideMenu.userProfileCompleted) {
      this.navigateToScreen('ProfileComplete')
    }
  }

  navigateToScreen = (route) =>{
    const {navigation}= this.props;
    const navigateAction = NavigationActions.navigate({
        routeName: route
    });
    navigation.dispatch(navigateAction)
  }

  async checkFirebasePermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFirebaseToken();
    } else {
        this.requestFirebasePermission();
    }
  }
  
  async getFirebaseToken() {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      this.props.addFcmToken(fcmToken)
    }
  }
  
  async requestFirebasePermission() {
    try {
        await firebase.messaging().requestPermission();
        this.getToken();
    } catch (error) {
        console.log('permission rejected');
    }
  }

  sendLocalNotification = async (title, body, data = {}) => {
    data.isLocalNotification = true
    const notification = new firebase.notifications.Notification()
        .android.setChannelId('edfonechannel')
        .setTitle(title)
        .setBody(body)
        .setData(data)
        .android.setAutoCancel(true)
        .android.setSmallIcon('icon')
        .setSound("default")
        .android.setCategory(firebase.notifications.Android.Category.Alarm)
    const channelId = new firebase.notifications.Android.Channel('edfonechannel', 'edfone channel', firebase.notifications.Android.Importance.Max);
    await firebase.notifications().android.createChannel(channelId);
    await firebase.notifications().displayNotification(notification)
  }

  handleNotificationClick = async (notification) => {
    const { title, body, data } = notification;
    if(data && !data.isLocalNotification) {
      
      // Is upcoming task
      if(data.type === 'upcoming-task') {
        this.props.setActiveHomeTab('Tasks')
      }

      // Is new assignment
        if(data.type === 'assignment-created') {
          this.props.setActiveHomeTab('Tasks')
        }

      // Is new note in feed
      if(data.type === 'new-note-alert' && data.asset_id && data.asset_id !== '') {
        this.props.setSelectedNote(data.asset_id)
        this.navigateToScreen('NoteFullScreen')
      }

    }

  }


  componentWillReceiveProps(nextProps) {

    if(Platform.OS === 'android') {
      const { fetchingAndroidUpdates } = this.props.sideMenu
      if(fetchingAndroidUpdates && !nextProps.sideMenu.fetchingAndroidUpdates && nextProps.sideMenu.androidUpdate) {
        const { androidUpdate } = nextProps.sideMenu
  
        // Force app update
        if(androidUpdate && !androidUpdate.isLatest && androidUpdate.forceUpdateRequired) {
          this.setState({ 
            showUpdateModalForce: true,
            showUpdateModalRecommendation: false, 
          })
        }
  
        // Recommend app update
        else if(androidUpdate && !androidUpdate.isLatest && !androidUpdate.forceUpdateRequired) {
          this.setState({ 
            showUpdateModalForce: false,
            showUpdateModalRecommendation: true, 
          })
        }
  
        // No app updates
        else {
          this.setState({ 
            showUpdateModalForce: false,
            showUpdateModalRecommendation: false, 
          })
        }
      }
    }

  }

  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    // Check if version update is required
    if(Platform.OS === 'android') {
      let versionName = VersionNumber.appVersion
      this.props.fetchAndroidUpdates(versionName)
    }

    if(!this.props.sideMenu.fcmToken && !this.props.sideMenu.isFCMTokenAdded) {
      this.checkFirebasePermission();
    }


    // Displayed notification when app is in foreground
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
    });

    // Received notification when app is in foreground
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log('received: ', notification);
      const { title, body, data } = notification;
      if(!data || !data.isLocalNotification) {
        this.sendLocalNotification(title, body, data)
      }
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    });

    firebase.notifications().getInitialNotification()
    .then((notificationOpen) => {
      if (notificationOpen) {
        const action = notificationOpen.action;
        const notification = notificationOpen.notification;  
      }
    });

    // When the app is closed and is opened using shared link.
    Linking.getInitialURL().then(url => {
      const { deepLinkOpened } = this.props.deepLink
      if(url && url !== deepLinkOpened) {
        this.navigate(url);
      }
    });

    // When the app is open and shared link is clicked.
    Linking.addEventListener('url', this.handleOpenURL);

  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.notificationDisplayedListener()
    this.notificationListener()
    this.notificationOpenedListener()

    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => { 
    this.navigate(event.url);
  }

  navigate = (url) => {
    if(!this.props.sideMenu.accessToken || !this.props.sideMenu.userProfile) return false
    const { deepLinkOpened } = this.props.deepLink
    if(deepLinkOpened && deepLinkOpened === url && 0) {
      return true
    }
    if(url && url.trim()!=='') {
      var noteId = null
      if(Platform.OS === 'android') {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
        while (match = regex.exec(url)) {
          params[match[1]] = match[2];
        }
        noteId = params.asset_id;
      }
      else if(Platform.OS === 'ios') {
        let parts = url.split('/')
        noteId = parts[parts.length - 1]
      }
      if(noteId && noteId !== '') {
        this.props.setSelectedNote(noteId)
        this.props.setDeepLinkOpened(url)
        this.navigateToScreen('NoteFullScreen')
      }
    }
  }

  handleBackPress = () => {
    if(this.props.activeHomeTab !== 'Notes') {
      this.props.setActiveHomeTab('Notes')
    }
    else {
      Alert.alert(
        'Are you sure?',
        "Do you want to exit edfone now?",
        [
          { text: 'No', onPress: ()=>{}, style: 'cancel' },
          { text: 'Yes', onPress: () => { BackHandler.exitApp() } },
        ]
      )
    }
    return true
  }

  render () {
    const {activeHomeTab} = this.props;
    const { showUpdateModalForce, showUpdateModalRecommendation } = this.state;
    return (
      <View style={{ flex: 1, width: Metrics.screenWidth}}>
        {
          activeHomeTab === 'Notes'?
          <Notes {...this.props}/>:
          activeHomeTab === 'Search'?
          <Search {...this.props}/>:
          activeHomeTab === 'Timer'?
          <Timer {...this.props}/>:
          activeHomeTab === 'Tasks'?
          <Tasks {...this.props}/>:
          activeHomeTab === 'Store'?
          <Store {...this.props}/>:
          null
        }
        <BottomTab {...this.props} />

        <Modal
          visible={showUpdateModalForce}
          onRequestClose={()=>this.setState({showUpdateModalForce: false})}
          transparent={false}
        >
          <Image source={require('../Images/intro_bg.png')} resizeMode='cover' style={{
            width: Metrics.screenWidth,
            height: Metrics.screenHeight,
            zIndex: 10,
          }}/>
          <View style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '50%',
            width: Metrics.screenWidth - 50,
            height: 400,
            marginTop: -200,
            backgroundColor: '#fff',
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 20,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10,
            elevation: 5,
            padding: 20,
          }}>
            <Text style={{
              fontFamily: Fonts.type.semibold,
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 22,
            }}>There is a more recent version of Edfone available on the Play Store. Please update your app from the play store to proceed.</Text>
            <TouchableHighlight style={{
              backgroundColor: Colors.themeColor,
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginTop: 30,
            }}
            onPress={()=>{Linking.openURL("market://details?id=com.edfone");}}
            underlayColor={Colors.themeColor}
            >
              <Text style={{
              fontFamily: Fonts.type.semibold,
              fontSize: 14,
              textAlign: 'center',
              color: '#fff',
            }}>Go to the Play Store</Text>
            </TouchableHighlight>
          </View>
        </Modal>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sideMenu: state.sideMenu,
    activeHomeTab: state.sideMenu.activeHomeTab,
    deepLink: state.deepLink,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAndroidUpdates: (versionName) => dispatch(SideMenuActions.fetchAndroidUpdatesRequest(versionName)),
    setActiveHomeTab: (activeHomeTab) => dispatch(SideMenuActions.setActiveHomeTab(activeHomeTab)),
    addFcmToken: (fcmToken) => dispatch(SideMenuActions.addFcmTokenRequest(fcmToken)),
    setSelectedNote: (selectedNote) => dispatch(NotesActions.setSelectedNote(selectedNote)),
    setDeepLinkOpened: (url) => dispatch(DeepLinkActions.setDeepLinkOpened(url)),
    setUserProfileCompleted: (userProfileCompleted) => dispatch(SideMenuActions.setUserProfileCompleted(userProfileCompleted)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
