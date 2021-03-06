import base64 from 'base64-js'
import RNFS from 'react-native-fs'
import * as Keychain from 'react-native-keychain'
import Reactotron from 'reactotron-react-native'
import { compose, createStore } from 'redux'
import { persistStore } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { configurePersistedReducer } from 'src/redux/reducer'
import { randomBytesAsync } from 'src/utils'

// eslint-disable-next-line import/no-mutable-exports
export let store: any
// eslint-disable-next-line import/no-mutable-exports
export let persistor: any

const REDUX_PERSIST = 'reduxPersist'

export async function configureStore(): Promise<void> {
  Reactotron.log(`Document dir path: ${RNFS.DocumentDirectoryPath}`)
  const secretKey = await getSecretKey()
  const encryptor = encryptTransform({
    onError: e => {
      Reactotron.error('Faield to init incryptor: ', e)
    },
    secretKey,
  })

  // @ts-ignore
  const persistedReducer = configurePersistedReducer(encryptor)

  if (__DEV__) {
    const composeEnhancers =
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    store = createStore(
      persistedReducer,
      composeEnhancers(Reactotron.createEnhancer()),
    )
  } else {
    store = createStore(persistedReducer)
  }
  persistor = persistStore(store)
}

async function getSecretKey(): Promise<string> {
  const creds = await Keychain.getGenericPassword({ service: REDUX_PERSIST })
  if (!creds) {
    const byteKey = await randomBytesAsync(64)
    const stringKey = base64.fromByteArray(byteKey)
    await Keychain.setGenericPassword(REDUX_PERSIST, stringKey, {
      service: REDUX_PERSIST,
    })
    return stringKey
  }

  if (
    typeof creds === 'object' &&
    creds.username === REDUX_PERSIST &&
    creds.service === REDUX_PERSIST
  ) {
    return creds.password
  }

  throw new Error(
    'Failed to get or set encryption key for apollo-cache-persistor',
  )
}
