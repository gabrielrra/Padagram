/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Modal} from 'react-native';

export default function LoadingModal(props) {
  let visible = props.show;
  if (visible !== true && visible !== false) {
    visible = true;
  }

  return (
    <Modal visible={true} transparent>
      <View style={styles.container}>
        <View style={[styles.modalStyle, props.style]}>
          <ActivityIndicator size="large" color="#7900df" />
          <Text style={styles.text}>
            {props.msg ? props.msg : 'Carregando...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStyle: {
    flexDirection: 'row',
    padding: 10,
  },
  text: {
    color: 'black',
    margin: 24,
    textAlign: 'center',
    alignSelf: 'flex-start',
    fontSize: 18,
  },
});
