import { takeLatest, all, takeEvery } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */
import { StartupTypes } from '../Redux/StartupRedux'
import { OtpVerificationTypes } from '../Redux/OtpVerificationRedux'
import { SideMenuTypes } from '../Redux/SideMenuRedux'
import { NotesTypes } from '../Redux/NotesRedux'
import { TermsTypes } from '../Redux/TermsRedux'
import { NoteFullScreenTypes } from '../Redux/NoteFullScreenRedux'
import { TimerTypes } from '../Redux/TimerRedux'
import { TimerWithNotesListTypes } from '../Redux/TimerWithNotesListRedux'
import { NoteCreateTypes } from '../Redux/NoteCreateRedux'
import { SaveNoteTypes } from '../Redux/SaveNoteRedux'
import { TasksTypes } from '../Redux/TasksRedux'
import { InviteTypes } from '../Redux/InviteRedux'
import { StoreTypes } from '../Redux/StoreRedux'
import { AssessmentTypes } from '../Redux/AssessmentRedux'

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas'
import { getApiSessionToken, updateUserProfile, updateUserImage, useReferralCode, addFcmToken, saveContacts, checkSpacedRepetition, getAndroidUpdates } from './SideMenuSagas'
import { getCountriesList, verifyNumber, sendOtp, verifyOtp } from './OtpVerificationSagas'
import { getFeedByDate, getFeedBySubject, getFeedByBook, deleteNote, searchNotes } from './NotesSagas';
import { getNoteFullScreen } from './NoteFullScreenSagas';
import { getSubjects, createSubject, createNote, updateNote, createTopic, getStreak } from './TimerSagas';
import { getRecommendations, getRecommendedMaterials } from './TimerWithNotesListSagas';
import { addImageToNote, addAudioToNote, deleteNoteImage, updateAudioLength } from './NoteCreateSagas';
import { getBooks, getRecentBooks, createBook, updateTopic, getHashtags, getSuggestedHashtags, createHashtag } from './SaveNoteSagas';
import { getTasks, createTask, updateTask } from './TasksSagas';
import { getReferralCode } from './InviteSagas';
import { getRules, getPoints, getDigitalGoodies, purchaseDigitalGoodie } from './StoreSagas';
import { getTerms } from './TermsSagas';
import { getQuestions, submitAnswers } from './AssessmentSagas';

/* ------------- API ------------- */
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(SideMenuTypes.FETCH_ANDROID_UPDATES_REQUEST, getAndroidUpdates, api),
    takeLatest(SideMenuTypes.GET_API_SESSION_TOKEN, getApiSessionToken, api),
    takeLatest(SideMenuTypes.UPDATE_USER_PROFILE_REQUEST, updateUserProfile, api),
    takeLatest(SideMenuTypes.UPDATE_USER_IMAGE_REQUEST, updateUserImage, api),
    takeLatest(SideMenuTypes.USE_REFERRAL_CODE_REQUEST, useReferralCode, api),
    takeLatest(SideMenuTypes.ADD_FCM_TOKEN_REQUEST, addFcmToken, api),
    takeLatest(SideMenuTypes.SAVE_CONTACTS_REQUEST, saveContacts, api),
    takeLatest(SideMenuTypes.CHECK_SPACED_REPETITION, checkSpacedRepetition, api),
    
    takeLatest(OtpVerificationTypes.FETCH_COUNTRIES_LIST_REQUEST, getCountriesList, api),
    takeLatest(OtpVerificationTypes.VERIFY_NUMBER_REQUEST, verifyNumber, api),
    takeLatest(OtpVerificationTypes.SEND_OTP_REQUEST, sendOtp, api),
    takeLatest(OtpVerificationTypes.VERIFY_OTP_REQUEST, verifyOtp, api),

    takeLatest(NotesTypes.GET_FEED_BY_DATE_REQUEST, getFeedByDate, api),
    takeLatest(NotesTypes.GET_FEED_BY_SUBJECT_REQUEST, getFeedBySubject, api),
    takeLatest(NotesTypes.GET_FEED_BY_BOOK_REQUEST, getFeedByBook, api),
    takeLatest(NotesTypes.DELETE_NOTE_REQUEST, deleteNote, api),
    takeLatest(NotesTypes.SEARCH_NOTES_REQUEST, searchNotes, api),

    takeLatest(TermsTypes.TERMS_REQUEST, getTerms, api),

    takeLatest(NoteFullScreenTypes.NOTE_FULL_SCREEN_REQUEST, getNoteFullScreen, api),

    takeLatest(TimerTypes.GET_SUBJECTS_REQUEST, getSubjects, api),
    takeLatest(TimerTypes.CREATE_SUBJECT_REQUEST, createSubject, api),
    takeLatest(TimerTypes.CREATE_TOPIC_REQUEST, createTopic, api),
    takeLatest(TimerTypes.CREATE_NOTE_REQUEST, createNote, api),
    takeLatest(TimerTypes.UPDATE_NOTE_REQUEST, updateNote, api),
    takeLatest(TimerTypes.GET_STREAK_REQUEST, getStreak, api),
    
    takeLatest(TimerWithNotesListTypes.GET_RECOMMENDATIONS_REQUEST, getRecommendations, api),
    takeLatest(TimerWithNotesListTypes.GET_RECOMMENDED_MATERIALS_REQUEST, getRecommendedMaterials, api),
    
    takeLatest(NoteCreateTypes.ADD_IMAGE_TO_NOTE_REQUEST, addImageToNote, api),
    takeEvery(NoteCreateTypes.DELETE_NOTE_IMAGE_REQUEST, deleteNoteImage, api),
    takeLatest(NoteCreateTypes.ADD_AUDIO_TO_NOTE_REQUEST, addAudioToNote, api),
    takeLatest(NoteCreateTypes.UPDATE_AUDIO_LENGTH_REQUEST, updateAudioLength, api),

    takeLatest(SaveNoteTypes.GET_BOOKS_REQUEST, getBooks, api),
    takeLatest(SaveNoteTypes.GET_RECENT_BOOKS_REQUEST, getRecentBooks, api),
    takeLatest(SaveNoteTypes.CREATE_BOOK_REQUEST, createBook, api),
    takeLatest(SaveNoteTypes.GET_SUGGESTED_HASHTAGS_REQUEST, getSuggestedHashtags, api),
    takeLatest(SaveNoteTypes.GET_HASHTAGS_REQUEST, getHashtags, api),
    takeLatest(SaveNoteTypes.CREATE_HASHTAG_REQUEST, createHashtag, api),
    takeLatest(SaveNoteTypes.UPDATE_TOPIC_REQUEST, updateTopic, api),

    takeLatest(TasksTypes.GET_TASKS_REQUEST, getTasks, api),
    takeLatest(TasksTypes.CREATE_TASK_REQUEST, createTask, api),
    takeLatest(TasksTypes.UPDATE_TASK_REQUEST, updateTask, api),

    takeLatest(InviteTypes.GET_REFERRAL_CODE_REQUEST, getReferralCode, api),

    takeLatest(StoreTypes.GET_RULES_REQUEST, getRules, api),
    takeLatest(StoreTypes.GET_POINTS_REQUEST, getPoints, api),
    takeLatest(StoreTypes.GET_DIGITAL_GOODIES_REQUEST, getDigitalGoodies, api),
    takeLatest(StoreTypes.PURCHASE_DIGITAL_GOODIE_REQUEST, purchaseDigitalGoodie, api),

    takeLatest(AssessmentTypes.GET_QUESTIONS_REQUEST, getQuestions, api),
    takeLatest(AssessmentTypes.SUBMIT_ANSWERS_REQUEST, submitAnswers, api),
  ])  
}
