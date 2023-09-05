import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'

import styles from './nearbyjobs.style'
import { COLORS, SIZES } from '../../../constants';
import useFetch from '../../../hook/useFetch'
import NearbyJobCard from '../../../components/common/cards/nearby/NearbyJobCard';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
const Nearbyjobs = () => {
  // const router = useRouter();
  const navigation = useNavigation()
  // const isLoading = false;
  // const error = false;
  // const { data, isLoading, error, refetch } = useFetch('search', {
  //   query: 'Python Developer',
  //   num_pages: 1,
  // }, 3000);
  const [isLoading, setisLoading] = useState(true)
  const [error, setError] = useState(null)

  const [data, setdata] = useState([])
  useEffect(async () => {


    try {
      const querySnapshot = await getDocs(collection(firestore, "jobOffers"));
      const jobs = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        jobs.push({ ...doc.data(), id: doc.id })
      });
      setdata(jobs)
      setisLoading(false)
    } catch (error) {
      setError(error)
    }

  }, [])


  // {!data && refetch()}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Latest Jobs</Text>
        {/* <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (error ? (
          <Text>Something went wrong</Text>
        ) : (
          data?.map((job) => (
            <NearbyJobCard
              job={job}
              key={`nearby-job-${job?.id}`}
              handleNavigate={() => {
                navigation.navigate('Detail', { id: job?.id })

              }}
            />
          ))

        ))}
      </View>

    </View>
  )
}

export default Nearbyjobs