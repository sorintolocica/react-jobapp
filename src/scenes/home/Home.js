import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { doc, onSnapshot } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import IconButton from '../../components/IconButton'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { sendNotification } from '../../utils/SendNotification'
import Popularjobs from './popular/Popularjobs'
import Nearbyjobs from './nearby/Nearbyjobs'
import Welcome from './welcome/Welcome'
import { COLORS } from '../../constants'
import Admin from '../../components/Admin'

export default function Home() {
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="align-right"
          color={colors.lightPurple}
          size={24}
          onPress={() => {}}
          containerStyle={{ paddingRight: 15 }}
        />
      ),
    })
  }, [navigation])

  const headerButtonPress = () => {
    alert('Tapped header button')
  }

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id)
    const tokenListner = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data()
        setToken(data)
      } else {
        console.log('No such document!')
      }
    })
    return () => tokenListner()
  }, [])

  const onNotificationPress = async () => {
    const res = await sendNotification({
      title: 'Hello',
      body: 'This is some something 👋',
      data: 'something data',
      token: token.token,
    })
    console.log(res)
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.lightWhite,
      }}
    >
      <ScrollView contentContainerStyle={{ margin: 10, padding: 10 }}>
        <Welcome
          searchTerm={() => null}
          setSearchTerm={() => null}
          handleClick={() => {
            // if (searchTerm) router.push(`/search/${searchTerm}`)
          }}
        />
        {userData.type !== 'admin' ? (
          <>
            <Popularjobs />
            <Nearbyjobs />
          </>
        ) : (
          <Admin />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: colors.lightyellow,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  darkContent: {
    backgroundColor: colors.gray,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
})
