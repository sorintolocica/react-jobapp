import React from 'react'
import {
  View, Text, TouchableOpacity, Image, Linking,
} from 'react-native'

import styles from './footer.style'
import { icons } from '../../../constants'

const Footer = ({
  url, onPressFav, isFav, onApply, applied,
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.likeBtn} onPress={() => onPressFav()}>
      <Image
        source={isFav ? icons.heart : icons.heartOutline}
        resizeMode="contain"
        style={styles.likeBtnImage}
      />
    </TouchableOpacity>

    <TouchableOpacity style={[styles.applyBtn, { backgroundColor: applied ? 'green' : '#576CBC' }]} onPress={() => onApply()}>
      <Text style={styles.applyBtnText}>{applied ? 'Applied' : 'Apply'}</Text>
    </TouchableOpacity>

  </View>
)

export default Footer
