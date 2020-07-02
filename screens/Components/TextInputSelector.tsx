/* eslint-disable react-native/no-inline-styles */
import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ViewStyle,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';

interface CustomProps {
  data: {id: number; value: string}[];
  onChangeText: (text: string) => void;
  onButtonPressed?: ({id: number, value: string}) => void;
  placeholder?: string;
  textInputStyle?: ViewStyle;
  maxLength?: number;
  editable?: boolean;
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words' | undefined;
}

interface State {
  text: string;
  showOptions: boolean;
}

export default class TextInputSelector extends Component<CustomProps> {
  state: State = {
    text: '',
    showOptions: false,
  };

  textInputRef = createRef<TextInput>();

  render() {
    const {
      onChangeText,
      textInputStyle,
      maxLength,
      data,
      editable,
      placeholder,
      autoCapitalize,
      onButtonPressed,
    } = this.props;
    const {text, showOptions} = this.state;
    const ufs = data.filter(item =>
      item.value.toLowerCase().includes(text.toLowerCase()),
    );
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}>
        <TapGestureHandler onGestureEvent={() => console.log('texin')}>
          <TextInput
            ref={this.textInputRef}
            placeholder={placeholder}
            value={text}
            onChangeText={value => {
              onChangeText(value);
              this.setState({text: value});
            }}
            style={[styles.input, textInputStyle]}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            maxLength={maxLength}
            onFocus={() => this.setState({showOptions: true})}
            onTouchStart={() => this.setState({showOptions: true})}
            editable={editable}
          />
        </TapGestureHandler>
        {showOptions && (
          <View style={styles.modalView}>
            <FlatList
              data={ufs}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              style={{width: '100%'}}
              contentContainerStyle={{
                width: '100%',
              }}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.setState(
                      {text: item.value, showOptions: false},
                      () => {
                        onChangeText(this.state.text);
                        onButtonPressed(item);
                      },
                    );
                  }}>
                  <View>
                    <Text>{item.value}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    fontSize: 16,
    marginVertical: 10,
  },

  button: {
    width: '90%',
    margin: 1,
    alignSelf: 'center',
    borderColor: 'black',
    paddingVertical: 4,
    alignItems: 'center',
  },

  modalView: {
    width: '100%',
    maxHeight: 100,
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
