import React, { useEffect, useState, useContext, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Share,
} from 'react-native'
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import * as Sharing from 'expo-sharing'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'

import { HomeTitleContext } from '../../context/HomeTitleContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import useFetch from '../../hook/useFetch'
import { COLORS, icons, SIZES } from '../../constants'
import ScreenHeaderBtn from '../../components/common/header/ScreenHeaderBtn'

import Company from '../../components/jobdetails/company/Company'
import JobTabs from '../../components/jobdetails/tabs/Tabs'
import About from '../../components/jobdetails/about/About'
import Specifices from '../../components/jobdetails/specifics/Specifics'
import JobFooter from '../../components/jobdetails/footer/Footer'
import { storage } from '../../utils/Storage'
import { firestore } from '../../firebase/config'
import { showToast } from '../../utils/ShowToast'
import { UserDataContext } from '../../context/UserDataContext'

const tabs = ['About', 'Qualifications', 'Responsibilities']

export default function Detail() {
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params
  const { setTitle } = useContext(HomeTitleContext)
  const { userData } = useContext(UserDataContext)

  const [activeTab, setActiveTab] = useState(tabs[1])

  const [refreshing, setRefreshing] = useState(false)

  const [isLoading, setisLoading] = useState(true)
  const [error, setError] = useState(null)

  const [data, setdata] = useState({})

  const [appliedJobs, setAppliedJobs] = useState([])

  const [favTitles, setfavTitles] = useState([])
  let fav = []

  const getFavs = async () => {
    try {
      const result = await storage.load({ key: 'fav' })
      fav = result
      const titles = result.map((item) => item.jobTitle)
      setfavTitles(titles)
    } catch (e) {
      console.log('>e', e)
    }
  }

  const getApplied = async () => {
    try {
      const usersRef = doc(firestore, 'jobOffers', id)
      const userD = await getDoc(usersRef)
      const firebaseData = userD.data()
      if (firebaseData?.appliedUsers) {
        setAppliedJobs(firebaseData.appliedUsers)
      }
    } catch (err) {}
  }

  const init = async () => {
    if (!id) return alert('id cannot be undefined')
    try {
      const usersRef = doc(firestore, 'jobOffers', id)
      const firestoreDocument = await getDoc(usersRef)

      if (!firestoreDocument.exists) {
        alert('Job does not exist anymore.')
        return
      }
      const firebaseData = firestoreDocument.data()
      setdata(firebaseData)
      setisLoading(false)
    } catch (err) {
      setError(err)
    }
  }
  useEffect(() => {
    init()
    getFavs()
    getApplied()
  }, [])

  useFocusEffect(() => {
    setTitle('')
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)

    setRefreshing(false)
  }, [])

  useEffect(() => {
    console.log('Detail screen')
  }, [])

  const displayContent = () => {
    switch (activeTab) {
      case 'Qualifications':
        return (
          <Specifices
            title="Qualifications"
            points={data?.jobQual ?? ['N/A']}
          />
        )

      case 'About':
        return <About info={data?.jobDescription ?? ['N/A']} />

      case 'Responsibilities':
        return (
          <Specifices
            title="Responsibilities"
            points={data?.jobRes ?? ['N/A']}
          />
        )

      default:
        break
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.lightWhite, padding: 10 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ScreenHeaderBtn
          iconUrl={icons.left}
          dimension="60%"
          handlePress={() => navigation.goBack()}
        />
        <ScreenHeaderBtn
          iconUrl={icons.share}
          dimension="60%"
          handlePress={async () =>
            Share.share({ url: `https://google.com/q=${data.jobTitle}` })
          }
        />
      </View>
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : data.length === 0 ? (
            <Text>No Data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data.jobImg}
                jobTitle={data.jobTitle}
                companyName={data.jobName}
                location={data.jobCountry}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayContent()}
            </View>
          )}
        </ScrollView>

        <JobFooter
          url={`https://google.com/q=${data.jobTitle}`}
          isFav={favTitles.includes(data.jobTitle)}
          applied={appliedJobs.includes(userData.id)}
          onApply={async () => {
            if (appliedJobs.includes(userData.id)) return
            try {
              // const dat = {
              //   appliedJobs: [...appliedJobs, id],
              // }
              // const usersRef = doc(firestore, 'users', userData.id)
              // await updateDoc(usersRef, dat)
              // getApplied()

              // update job offer
              const dat1 = {
                appliedUsers: [...appliedJobs, userData.id],
              }
              const jobRef = doc(firestore, 'jobOffers', id)
              await updateDoc(jobRef, dat1)
              getApplied()
            } catch (e) {
              alert(e)
            }
          }}
          onPressFav={async () => {
            const newFav = await storage.load({ key: 'fav' })
            let editedFav = newFav
            if (favTitles.includes(data.jobTitle)) {
              editedFav = [...newFav].filter(
                (item) => item.jobTitle !== data.jobTitle,
              )
              showToast({
                title: 'Success',
                body: 'Removed to favorite 👋',
              })
            } else {
              console.log('>fav', newFav, data)
              editedFav.push({ ...data, id })
              showToast({
                title: 'Success',
                body: 'Added to favorite 👋',
              })
            }

            storage.save({
              key: 'fav',
              data: editedFav,
            })
            getFavs()
          }}
        />
      </>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
