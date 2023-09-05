import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RadioButton, TextInput } from 'react-native-paper'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Avatar } from '@rneui/themed'
import { COLORS, FONT, SIZES } from '../constants'
import { colors } from '../theme'
import Button from './Button'
import { firestore } from '../firebase/config'
import { UserDataContext } from '../context/UserDataContext'
import { showToast } from '../utils/ShowToast'

const VSpace = () => <View style={{ height: 15 }} />

const Admin = () => {
  const [employeType, setemployeType] = useState('full')
  const [jobTitle, setJobTitle] = useState('')
  const [jobCountry, setJobCountry] = useState('MD')
  const [jobDescription, setJobDescription] = useState('')
  const [jobQual, setJobQual] = useState('')
  const [jobRes, setJobRes] = useState('')

  const [data, setdata] = useState([])

  const { userData, setUserData } = useContext(UserDataContext)
  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]
  const handleCreate = async () => {
    const newJob = {
      employeType,
      jobTitle,
      jobCountry,
      jobDescription,
      jobQual,
      jobRes,
      jobImg: userData.avatar,
      employeName: userData.fullName,
    }
    console.log('>data', newJob)
    try {
      const docRef = await addDoc(collection(firestore, 'jobOffers'), newJob)
      console.log('Document written with ID: ', docRef.id)
      refs.map((ref) => {
        ref.current.clear()
      })
      showToast({
        title: 'Success',
        body: 'Job Created !',
      })
    } catch (e) {
      alert(e)
    }
  }

  const getJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'jobOffers'))
      const jobs = []
      querySnapshot.forEach((doc1) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc1.id, ' => ', doc1.data())
        const docData = doc1.data()
        if (userData.fullName === docData.employeName) {
          if (docData.appliedUsers) {
            docData.appliedUsers.forEach(async (applied) => {
              const usersRef = doc(firestore, 'users', applied)
              const d = await getDoc(usersRef)
              // console.log('>res', d.data())
              jobs.push({ ...d.data(), jobTitle: docData.jobTitle })
              if (
                docData.appliedUsers.length - 1 ===
                docData.appliedUsers.indexOf(applied)
              ) {
                console.log('>jobs', jobs)
                setdata(jobs)
              }
            })
          }
        }
      })
    } catch (err) {}
  }
  useEffect(() => {
    getJobs()
  }, [])

  return (
    <View>
      {data.length ? (
        <View style={{ height: 150 }}>
          <Text style={styles.welcomeMessage}>Applied Users:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.map((item) => (
              <View
                key={item.email}
                style={{
                  padding: 5,
                  margin: 5,
                  backgroundColor: 'white',

                  borderWidth: 1,
                  borderRadius: 5,
                }}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 30, height: 30 }}
                />
                <View style={{ flexDirection: 'row' }}>
                  <Text>Name: </Text>
                  <Text>{item.fullName}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text>Email: </Text>
                  <Text>{item.email}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text>Applied for : </Text>
                  <Text style={{ fontWeight: 'bold' }}>{item.jobTitle}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View style={{ padding: 30, flex: 1 }}>
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            width: '100%',
          }}
          keyboardShouldPersistTaps="always"
        >
          <Text style={styles.welcomeMessage}>Post new job:</Text>
          <TextInput
            ref={refs[0]}
            mode="outlined"
            label="Job Title"
            placeholder={jobTitle}
            onChangeText={(txt) => setJobTitle(txt)}
          />
          <VSpace />

          <TextInput
            ref={refs[1]}
            mode="outlined"
            label="Job Country"
            placeholder="MD"
            onChangeText={(txt) => setJobCountry(txt)}
          />
          <VSpace />
          <TextInput
            ref={refs[2]}
            style={{ height: 140 }}
            mode="outlined"
            label="Enter Job Description"
            placeholder="Type something"
            onChangeText={(txt) => setJobDescription(txt)}
          />
          <VSpace />
          <TextInput
            ref={refs[3]}
            style={{ height: 140 }}
            mode="outlined"
            label="Qualifications"
            placeholder="Type something"
            onChangeText={(txt) => setJobQual(txt)}
          />
          <VSpace />
          <TextInput
            ref={refs[4]}
            style={{ height: 140 }}
            mode="outlined"
            label="Responsabilities"
            placeholder="Type something"
            onChangeText={(txt) => setJobRes(txt)}
          />
          <VSpace />
          <RadioButton.Group
            onValueChange={(newValue) => setemployeType(newValue)}
            value={employeType}
          >
            <RadioButton.Item label="Full Time" value="full" />
            <RadioButton.Item label="Contractor" value="contractor" />
            <RadioButton.Item label="Part Time" value="part" />
          </RadioButton.Group>
          <Button
            label="Create Job"
            color={colors.primary}
            onPress={handleCreate}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
}

export default Admin

const styles = StyleSheet.create({
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginVertical: 10,
  },
})
