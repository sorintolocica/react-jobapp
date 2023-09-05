import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { collection, getDocs } from 'firebase/firestore'
import { COLORS } from '../constants'
import { firestore } from '../firebase/config'

const Freelance = () => {
  const [data, setdata] = useState([])

  const getFreelancers = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'users'))
    const freelance = []
    querySnapshot.forEach((doc1) => {
      console.log(doc1.id, ' => ', doc1.data())
      if (doc1.data().type === 'freelance') {
        freelance.push(doc1.data())
      }
    })
    setdata(freelance)
  }

  useEffect(() => {
    getFreelancers()
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'tomato',
      }}
    >
      <View
        style={{
          height: 44,
          backgroundColor: 'tomato',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontWeight: 'bold', color: 'white' }}>Freelancers</Text>
      </View>
      <View
        style={{ flex: 1, padding: 10, backgroundColor: COLORS.lightWhite }}
      >
        <Text style={{ paddingVertical: 15 }}>Freelance Users:</Text>
        <ScrollView>
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
                <Text>Skills: </Text>
                <Text style={{ fontWeight: '600' }}>{item.skill}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text>Email: </Text>
                <Text>{item.email}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text>Hourly: </Text>
                <Text style={{ fontWeight: '600' }}>{item.rate}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Freelance

const styles = StyleSheet.create({})
