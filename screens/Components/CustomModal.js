/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Modal} from 'react-native';

export default function LoadingModal(props) {
  let visible = props.show;
  if (visible !== true && visible !== false) {
    visible = true;
  }

  return (
    <Modal visible={true} transparent>
      <View style={styles.container}>
        <View style={[styles.modalStyle, props.style]}>{props.children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  modalStyle: {
    justifyContent: 'center',
    alignItems: 'center',
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
