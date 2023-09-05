import React from 'react'
import {
  View, Text, TouchableOpacity, Image,
} from 'react-native'
import styles from './popularjobcard.style'
import { checkImageURL } from '../../../../utils/index'

const PopularJobCard = ({ item, selectedJob, handleCardPress }) => (
  <TouchableOpacity style={styles.container(null, item)} onPress={() => handleCardPress(item)}>
    <TouchableOpacity style={styles.logoContainer(selectedJob, item)}>
      <Image
        source={{ uri: item?.jobImg }}
        resizeMode="contain"
        style={styles.logoImage}
      />
    </TouchableOpacity>
    <Text style={styles.companyName} numberOfLines={1}>{item.employeName}</Text>
    <View style={styles.infoContainer}>
      <Text style={styles.jobName(selectedJob, item)} numberOfLines={1}>{item.jobTitle}</Text>
      <Text style={styles.location}>{item.jobCountry}</Text>
    </View>
  </TouchableOpacity>
)

export default PopularJobCard
