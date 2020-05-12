import apisauce from 'apisauce'
import { store } from '../Containers/App'
import { apiUrl } from '../Config/AppConfig'

const create = (baseURL = apiUrl) => {
  const apiForSessionToken = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
    },
    timeout: 10000
  })

  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Authorization': 'Basic ZWR1Ym94YXBpOkVkdUJveCYjMjAxNw==',
      'Content-Type': 'application/json',
    },
    timeout: 10000
  })

  // Demo
  const getRoot = () => api.get('')
  const getRate = () => api.get('rate_limit')
  const getUser = (username) => api.get('search/users', {q: username})

  // API Session Token
  const getSessionToken = () => apiForSessionToken.get('rest/session/token')

  // OTP
  const verifyNumber = (countryCode, mobileNumber) => {
    let apiSessionToken = store.getState().sideMenu.apiSessionToken
    api.setHeaders({
      'X-CSRF-Token': apiSessionToken,
      'Content-Type': 'application/json',
    })
    return api.post('api/verifyNumber?_format=json', { mobile_number: mobileNumber, country_code: countryCode })
  }
  const sendOtp = (countryCode, mobileNumber) => {
    let apiSessionToken = store.getState().sideMenu.apiSessionToken
    api.setHeaders({
      'X-CSRF-Token': apiSessionToken,
      'Content-Type': 'application/json',
    })
    return api.post('api/sendOtp?_format=json', { mobile_number: mobileNumber, country_code: countryCode })
  }
  const verifyOtp = (countryCode, mobileNumber, code) => {
    let apiSessionToken = store.getState().sideMenu.apiSessionToken
    api.setHeaders({
      'X-CSRF-Token': apiSessionToken,
      'Content-Type': 'application/json',
    })
    return api.post('api/verifyOtp?_format=json', { mobile_number: mobileNumber, country_code: countryCode, code, random: Date.now() })
  }

  // User
  const getUserProfile = (accessToken = null) => {
    if (!accessToken) {
      accessToken = store.getState().sideMenu.accessToken
    }
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': accessToken
    })
    return api.get('api/userProfile?_format=json')
  }
  const updateUserProfile = (userProfile) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/userProfile?_format=json', { user: userProfile })
  }
  const updateFcmToken = (token) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/fcmUpdate?_format=json', { user: { fcm: token } })
  }
  const updateUserImage = (image) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/UserProfileImage?_format=json', { user: { image } })
  }
  const saveUserContactsList = (numbers) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/userContactList?_format=json', { numbers })
  }
  const updateUserLocation = (address, latlng) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/userProfileLocation?_format=json', { user: { address, location: latlng } })
  }
  const deleteAccount = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/userDeleteAccount?_format=json')
  }
  const saveContacts = (numbers) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/userContactList?_format=json', {numbers: numbers})
  }

  // Subject
  const getSubjectSuggestions = (query) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/GetSubjectSuggestions?_format=json&sub_string=' + query)
  }
  const createSubject = (name) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/createSubject?_format=json', { subject: name })
  }

  // Book
  const getBookSuggestions = (subjectId, query) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getBookSuggestion?_format=json&subject_id=' + subjectId + '&book=' + query)
  }
  const getRecentBooks = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getBookRecent?_format=json')
  }
  const createBook = (book) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/createBooks?_format=json', book)
  }
  const isbnBookMap = (bookId, isbn) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/createBooks?_format=json', { book_id: bookId, isbn })
  }

  // Topic
  const getTopicsList = (query) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getTopicsList?_format=json&topic=' + query)
  }
  const createUpdateTopic = (topic) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/topicCreateUpdate?_format=json', topic)
  }

  // Note Fetch
  const getUserNotesList = (page = 0, itemsPerPage = 20) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getUserAssetsList?_format=json&private=1&items_per_page=' + itemsPerPage + '&page=' + page)
  }
  const getSubjectNotesList = (subjectId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getSubjectAssetsList?_format=json&subject_id=' + subjectId)
  }
  const getBookNotesList = (bookId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getBookAssetsList?_format=json&subject_id=' + bookId)
  }
  const getNotesDateList = (date) => {  // date format - '20181025'
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getAssetsDateList?_format=json&date=' + date)
  }
  const getRecommendedNotesList = (subjectId, topic, noteId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    // return api.get('api/getRecommendAssetsList?_format=json&subject_id=' + subjectId + '&asset_id=' + noteId)
    return api.get('api/getRecommendAssetsList?_format=json&subject_id=' + subjectId + '&asset_id=' + noteId + '&topic=' + topic)
  }
  const getFeedByDate = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getFeedDate?_format=json')
  }
  const getFeedByBook = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getFeedBook?_format=json')
  }
  const getFeedBySubject = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getFeedSubject?_format=json')
  }
  const getNoteById = (noteId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getAssetById?_format=json&asset_id=' + noteId)
  }
  const getSampleNote = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getSampleAssetById?_format=json')
  }
  const getNotesByTopic = (topic) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/searchAssets?_format=json&topic=' + topic)
  }

  // Note create, update, delete
  const noteCreateSession = (note) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/assetCreateSession?_format=json', note)
  }
  const noteUpdateSession = (note) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/assetUpdateSession?_format=json', note)
  }
  const noteSaveImage = (noteId, image) => {
    api.setHeaders({
      'Content-Type': 'multipart/form-data',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    var data = new FormData();
    data.append('image', {
      uri: image.path,
      name: 'image',
      type: image.mime,
    });
    return api.post('saveAssetImage?asset_id=' + noteId + '&upload_type=asset', data)
  }
  const noteDeleteImage = (assetDataId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('updateAssetImage?operation=delete&asset_data_id='+assetDataId)
  }
  const noteSaveAudio = (noteId, audio) => {
    api.setHeaders({
      'Content-Type': 'multipart/form-data',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    var data = new FormData();
    data.append('audio', audio);
    return api.post('saveAssetAudio?asset_id=' + noteId, data)
  }
  const noteDelete = (noteId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/assetDeleteSession?_format=json', { asset_id: noteId })
  }
  const noteSaveAudioLength = (assetDataId, audioDuration) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('updateAssetImage?operation=update&start_at=0&end_at='+audioDuration+'&asset_data_id='+assetDataId)
  }

  // Terms and conditions
  const getTermsAndConditions = () => apiForSessionToken.get('terms-condition')

  // Address
  const getCountryList = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getCountryList?_format=json')
  }
  const getAddressCountry = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getAddressCountry?_format=json')
  }
  const getAddressState = (countryCode) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getAddressState?_format=json&country_code=' + countryCode)
  }

  // Loyalty points & Store
  const getLoyaltyPoints = (type = 'minimal') => { // Type: detailed/minimal
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getLoyalityPoints?_format=json&type=' + type)
  }
  const getStoreRules = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getStoreRules?_format=json')
  }
  const getGoodiesDigital = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/digitalGoodiesList?_format=json')
  }
  const goodiesDigitalPurchase = (digitalGoodieId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/digitalGoodieOrderComplete?_format=json', { digital_id: digitalGoodieId })
  }

  // Referrals
  const getReferralUsersList = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getReferralUserList?_format=json')
  }
  const addReferralCode = (code) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/userReferralCode?_format=json', { referral_code: code })
  }
  const getMyReferralCode = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getMyReferralCode?_format=json')
  }

  // Tasks
  const getTasks = (startDate = null, endDate = null, page = 0) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    let url = 'api/getTaskActive?_format=json&items_per_page=10&page=' + page
    if(startDate) url += '&start_time_stamp=' + startDate
    if(endDate) url += '&end_time_stamp=' + endDate
    return api.get(url)
  }
  const getTaskDetail = (taskId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getTaskById?_format=json&task_id=' + taskId)
  }
  const createUpdateTask = (task) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/taskCreateUpdate?_format=json', task)
  }

    // Study Streak
    const getStreakSummary = () => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getTimeSpent?_format=json&type=detail')
  }

  // Assessment
  const getAssessmentQuestions = (taskId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getAssessment?_format=json&task_id='+taskId)
  }
  const markAssessmentAnswers = (taskId, answers) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    let data = {
      data: {
        taskId: taskId,
        answers: answers
      }
    }
    return api.post('api/assessmentSubmissions?_format=json', data)
  }

  // Hashtags
  const getHashtagSuggestions = (query) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getHashtagSuggestions?_format=json&string='+query)
  }
  const createHashtag = (data) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.post('api/createHashtag?_format=json', data)
  }

  // Materials
  const getRecommendedMaterials = (taskId) => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/GetRecommendedMaterials?_format=json&task_id='+taskId)
  }

  // APK Version Check
  const getAndroidUpdates = (versionName, type = 'android') => {
    api.setHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': store.getState().sideMenu.apiSessionToken,
      'AccessToken': store.getState().sideMenu.accessToken
    })
    return api.get('api/getAppUpdates?_format=json&type='+type+'&version_name='+versionName)
  }

  return {
    // Demo
    getRoot, getRate, getUser,

    // API Session Token
    getSessionToken,

    // OTP
    verifyNumber,
    sendOtp,
    verifyOtp,

    // User
    getUserProfile,
    updateUserProfile,
    updateFcmToken,
    updateUserImage,
    saveUserContactsList,
    updateUserLocation,
    deleteAccount,
    saveContacts,

    // Subject
    getSubjectSuggestions,
    createSubject,

    // Book
    getBookSuggestions,
    getRecentBooks,
    createBook,
    isbnBookMap,

    // Topic
    getTopicsList,
    createUpdateTopic,

    // Note Fetch
    getUserNotesList,
    getSubjectNotesList,
    getBookNotesList,
    getNotesDateList,
    getRecommendedNotesList,
    getRecommendedMaterials,
    getFeedByDate,
    getFeedByBook,
    getFeedBySubject,
    getNoteById,
    getSampleNote,
    getNotesByTopic,

    // Note create, update, delete
    noteCreateSession,
    noteUpdateSession,
    noteSaveImage,
    noteDeleteImage,
    noteSaveAudio,
    noteDelete,
    noteSaveAudioLength,

    // Terms and conditions
    getTermsAndConditions,

    // Address
    getCountryList,
    getAddressCountry,
    getAddressState,

    // Loyalty points & Store
    getLoyaltyPoints,
    getStoreRules,
    getGoodiesDigital,
    goodiesDigitalPurchase,

    // Referrals
    getReferralUsersList,
    addReferralCode,
    getMyReferralCode,

    // Tasks
    getTasks,
    getTaskDetail,
    createUpdateTask,

    // Study Streak
    getStreakSummary,

    // Assessment
    getAssessmentQuestions,
    markAssessmentAnswers,

    // Hashtags
    getHashtagSuggestions,
    createHashtag,

    // APK Version Check
    getAndroidUpdates,

  }
}

export default {
  create
}
