import React, { useContext, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, Image, FlatList,
} from 'react-native'
import { Avatar } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { icons, SIZES } from '../../../constants'
import styles from './welcome.style'
import { UserDataContext } from '../../../context/UserDataContext'

const jobTypes = ['full-time', 'part-time', 'contractor']
const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const [activeJobType, setActiveJobType] = useState('full-time')
  const { userData, setUserData } = useContext(UserDataContext)
  const navigation = useNavigation()
  return (
    <View>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.userName}>Hello {userData.fullName}</Text>
          <View style={{ width: 25, height: 25 }}>
            <Avatar
              size="small"
              rounded
              title="NI"
              source={{ uri: userData.avatar }}
            />
          </View>
        </View>
        <Text style={styles.welcomeMessage}>Find Your Perfect {userData.type !== 'admin' ? 'Job' : 'Employee'}</Text>
      </View>

      {userData.type === 'user' && (
        <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.searchContainer}>
          <View pointerEvents="none" style={styles.searchWrapper}>
            <TextInput style={styles.searchInput} value={searchTerm} onChangeText={(text) => setSearchTerm(text)} placeholder="what are you looking for" />
          </View>

          <View disabled style={styles.searchBtn} onPress={handleClick}>
            <Image
              style={styles.searchBtnImage}
              source={icons.search}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.tabsContainer}>

        {/* <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item)
                // router.push(`/search/${item}`)
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
          )}

          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
        /> */}

      </View>

    </View>
  )
}

export default Welcome
