import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ViewStyle,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}
interface CustomProps {
  userData: UserData;
  onClosePressed: () => void;
  visible: boolean;
  style?: ViewStyle;
}
export default class UserModal extends Component<CustomProps> {
  render() {
    const {style, visible, userData, onClosePressed} = this.props;
    return (
      <Modal visible={visible} transparent animated={false}>
        <View style={styles.container}>
          <View style={[styles.modalStyle, style]}>
            <TouchableOpacity onPress={onClosePressed}>
              <Icon name="x" size={22} />
            </TouchableOpacity>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.username}>
              <Icon name="at-sign" size={16} />
              {' ' + userData.username}
            </Text>
            <Text>
              <Icon name="phone" size={18} />
              {'  ' + userData.phone}
            </Text>
            <Text selectable>
              <Icon name="link" size={18} />
              {'  ' + userData.website}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  modalStyle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '60%',
    padding: 14,
  },
  text: {
    color: 'black',
    margin: 24,
    textAlign: 'center',
    alignSelf: 'flex-start',
    fontSize: 18,
  },
  name: {
    marginVertical: 14,
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  username: {
    fontSize: 18,
    marginVertical: 8,
  },
});
