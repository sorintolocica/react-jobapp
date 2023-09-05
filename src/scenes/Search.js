import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { collection, getDocs, where } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import styles from './home/welcome/welcome.style'
import { COLORS, icons } from '../constants'
import { firestore } from '../firebase/config'
import NearbyJobCard from '../components/common/cards/nearby/NearbyJobCard'

const Search = () => {
  const [query, setQuery] = useState('')
  const [data, setdata] = useState([])
  const [finalData, setFinalData] = useState([])

  const navigation = useNavigation()

  useEffect(async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'jobOffers'))
      const jobs = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data())
        jobs.push({ ...doc.data(), id: doc.id })
      })
      setdata(jobs)
    } catch (error) {
      console.log('>err', error)
    }
  }, [])

  const handleClick = async () => {
    const newData = [...data].filter((item) =>
      item?.jobTitle?.toLowerCase().includes(query.toLowerCase()),
    )
    console.log('>newData', data, query)
    setFinalData(newData)
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.lightWhite, padding: 10 }}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={(text) => setQuery(text)}
            placeholder="what are you looking for"
          />
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => handleClick()}
        >
          <Image
            style={styles.searchBtnImage}
            source={icons.search}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 10 }}>
        <ScrollView>
          {finalData.map((job) => (
            <View style={{ height: 70, marginVertical: 4 }}>
              <NearbyJobCard
                job={job}
                key={`nearby-job-${job?.id}`}
                handleNavigate={() => {
                  navigation.navigate('Detail', { id: job?.id })
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
export default Search
