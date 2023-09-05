import React, { useState, useContext, useEffect } from 'react'
import { Text, StyleSheet, View, Linking } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { setDoc, doc } from 'firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { RadioButton } from 'react-native-paper'
import ScreenTemplate from '../../components/ScreenTemplate'
import TextInputBox from '../../components/TextInputBox'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { firestore, auth } from '../../firebase/config'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { defaultAvatar } from '../../config'

export default function Registration() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('user')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [rate, setRate] = useState('')
  const [skill, setSkill] = useState('')

  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  useEffect(() => {
    console.log('Registration screen')
  }, [])

  const onFooterLinkPress = () => {
    navigation.navigate('Login')
  }

  const onRegisterPress = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }
    try {
      setSpinner(true)
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const { uid } = response.user
      const data = {
        id: uid,
        email,
        fullName,
        avatar: defaultAvatar,
        type: userType,
      }
      if (rate) {
        data.rate = rate
      }
      if (skill) {
        data.skill = skill
      }
      const usersRef = doc(firestore, 'users', uid)
      await setDoc(usersRef, data)
    } catch (e) {
      setSpinner(false)
      alert(e)
    }
  }

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        style={styles.main}
        keyboardShouldPersistTaps="always"
      >
        <Logo />
        <TextInputBox
          placeholder="Your Name"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          autoCapitalize="none"
        />
        <TextInputBox
          placeholder="E-mail"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInputBox
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCapitalize="none"
        />
        <TextInputBox
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          autoCapitalize="none"
        />
        <View style={{ marginHorizontal: 30 }}>
          <RadioButton.Group
            onValueChange={(newValue) => setUserType(newValue)}
            value={userType}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="user" />
              <Text style={{ color: colorScheme.text }}>User</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="admin" />
              <Text style={{ color: colorScheme.text }}>Admin</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="freelance" />
              <Text style={{ color: colorScheme.text }}>Freelance</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View>
          {userType === 'freelance' ? (
            <>
              <Text style={{ marginHorizontal: 30 }}>Enter Hourly Rate:</Text>
              <TextInputBox
                placeholder="15$/h"
                onChangeText={(text) => setRate(text)}
                value={rate}
                autoCapitalize="none"
              />
              <Text style={{ marginHorizontal: 30 }}>Your Skill:</Text>
              <TextInputBox
                placeholder="C++"
                onChangeText={(text) => setSkill(text)}
                value={skill}
                autoCapitalize="none"
              />
            </>
          ) : null}
        </View>
        <Button
          label="Create account"
          color={colors.primary}
          onPress={() => onRegisterPress()}
        />
        <View style={styles.footerView}>
          <Text style={[styles.footerText, { color: colorScheme.text }]}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <Spinner
        visible={spinner}
        textStyle={{ color: colors.white }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: fontSize.large,
  },
  footerLink: {
    color: colors.blueLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
  link: {
    textAlign: 'center',
  },
})
