import React from 'react'
import {
  View, Text, TouchableOpacity, Image,
} from 'react-native'

import styles from './nearbyjobcard.style'

const NearbyJobCard = ({ job, handleNavigate }) => (
  <TouchableOpacity style={styles.container} onPress={handleNavigate}>
    <TouchableOpacity style={styles.logoContainer}>
      <Image
        source={{ uri: job.jobImg }}
        resizeMode="contain"
        style={styles.logoImage}
      />
    </TouchableOpacity>
    <View style={styles.textContainer}>
      <Text style={styles.jobName} numberOfLines={1}>{job.jobTitle}</Text>
      <Text style={styles.jobType}>{job.employeType}</Text>
    </View>
  </TouchableOpacity>
)

export default NearbyJobCard
