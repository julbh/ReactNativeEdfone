import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import ReduxPersist from '../Config/ReduxPersist'

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  sideMenu: require('./SideMenuRedux').reducer,
  otpVerification: require('./OtpVerificationRedux').reducer,
  notes: require('./NotesRedux').reducer,
  noteDetail: require('./NoteFullScreenRedux').reducer,
  timer: require('./TimerRedux').reducer,
  timerNotes: require('./TimerWithNotesListRedux').reducer,
  noteCreate: require('./NoteCreateRedux').reducer,
  saveNote: require('./SaveNoteRedux').reducer,
  tasks: require('./TasksRedux').reducer,
  invite: require('./InviteRedux').reducer,
  store: require('./StoreRedux').reducer,
  deepLink: require('./DeepLinkRedux').reducer,
  terms: require('./TermsRedux').reducer,
  assessment: require('./AssessmentRedux').reducer,
})

export default () => {
  let finalReducers = reducers
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig
    finalReducers = persistReducer(persistConfig, reducers)
  }

  let { store, persistor, sagasManager, sagaMiddleware } = configureStore(
    finalReducers,
    rootSaga
  )

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../Sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas)
      })
    })
  }

  return { store, persistor }
}
