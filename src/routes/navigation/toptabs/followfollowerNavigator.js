import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'

import { StatusBar } from 'expo-status-bar'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { COLORS, FONT, SIZES } from '../../../constants'
import useFetch from '../../../hook/useFetch'
import NearbyJobCard from '../../../components/common/cards/nearby/NearbyJobCard'
import { storage } from '../../../utils/Storage'

export const FollowFollowerNavigator = () => {
  const [isLoading, setisLoading] = useState(true)
  const [error, setError] = useState(null)

  const [data, setdata] = useState([])

  const navigation = useNavigation()

  const init = async () => {
    try {
      setisLoading(true)
      const result = await storage.load({ key: 'fav' })
      setdata(result)
      setisLoading(false)
    } catch (e) {
      console.log('>e', e)
      setdata([])
      setisLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      init()
    }, []),
  )
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <StatusBar style="dark" />

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : data.length > 0 ? (
          <>
            <ScrollView>
              {data.map((job) => (
                <View style={{ height: 70 }}>
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
          </>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'black' }}>Your list is empty</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
  },
})

export default styles
