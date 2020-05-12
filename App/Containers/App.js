import React, { Component } from 'react'
import { StatusBar, SafeAreaView } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import SplashScreen from 'react-native-splash-screen';

import '../Config'
import DebugConfig from '../Config/DebugConfig'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import LoadingScreen from '../Components/LoadingScreen'
import { Colors } from '../Themes';

// create our store
const { store, persistor } = createStore();

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  componentDidMount() {
    SplashScreen.hide()
  }
  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <SafeAreaView forceInset={{ top: 'always' }} style={{flex: 1, backgroundColor: Colors.themeColor}}>
            <StatusBar backgroundColor={Colors.themeColor} />
            <RootContainer />
          </SafeAreaView>
          <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
        </PersistGate>
      </Provider>
    )
  }
}

export { store }

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
