import React, { useEffect, useState } from 'react'
import {
  View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  collection, getDocs, query, where,
} from 'firebase/firestore'
import styles from './popularjobs.style'
import { COLORS, SIZES } from '../../../constants'
import useFetch from '../../../hook/useFetch'
import PopularJobCard from '../../../components/common/cards/popular/PopularJobCard'
import { firestore } from '../../../firebase/config'

const Popularjobs = () => {
  const [selectedJob, setSelectedJob] = useState()
  const [sorted, setSorted] = useState([])
  const [sortDirection, setSortDirection] = useState('')

  // const {
  //   data, isLoading, error, refetch,
  // } = useFetch('search', {
  //   query: 'React developer',
  //   num_pages: 1,
  // })

  const [data, setdata] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(async () => {
    try {
      const q = query(collection(firestore, 'jobOffers'), where('popular', '==', true))

      const querySnapshot = await getDocs(q)
      const jobs = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data())
        jobs.push({ ...doc.data(), id: doc.id })
      })
      setdata(jobs)
      setSorted(jobs)
      setisLoading(false)
    } catch (err) {
      setError(err)
    }
  }, [])

  // {!data && refetch()}
  const navigation = useNavigation()
  const handleCardPress = (item) => {
    // router.push(`/job-details/${item.job_id}`)
    navigation.navigate('Detail', { id: item.id })
  }

  useEffect(() => {
    if (!sortDirection) return
    setSorted([...data].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.jobCountry > b.jobCountry ? 1 : -1
      }
      return a.jobCountry < b.jobCountry ? 1 : -1
    }))
  }, [sortDirection])

  // console.log(data);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular jobs</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert('Sort Jobs', 'Please choos sort option:', [
            {
              text: 'Asc',
              onPress: () => setSortDirection('asc'),
            },
            {
              text: 'Desc',
              onPress: () => setSortDirection('desc'),

            },
            { text: 'cancel', onPress: () => console.log('OK Pressed'), style: 'cancel' },
            {
              text: '',
              onPress: () => console.log('Cancel Pressed'),
            },

          ])
        }}
        >
          <Text style={styles.headerBtn}>Sort: {sortDirection}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (error ? (
          <Text>Something went wrong</Text>
        ) : (
          <FlatList
            data={sorted}
            renderItem={({ item }) => (
              <PopularJobCard item={item} selectedJob={selectedJob} handleCardPress={() => handleCardPress(item)} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
          />
        ))}
      </View>

    </View>
  )
}

export default Popularjobs
