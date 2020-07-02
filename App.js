/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';

import {NavigationContainer, useNavigation} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, useHeaderHeight} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Feather';

import TodoScreen from './screens/Todos';
import Posts from './screens/Posts';
import Albuns from './screens/Albuns';
import {block} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home({navigation}) {
  const height = useHeaderHeight();
  return (
    <View style={[styles.container, {marginTop: height}]}>
      <Text style={styles.upText}> Bem vindo ao Padagram!</Text>
      <View style={{height: 300, justifyContent: 'space-evenly'}}>
        <Text style={styles.question}> Para qual tela deseja ir?</Text>
        <Button
          title="Ir para POSTS"
          onPress={() => navigation.navigate('Main', {screen: 'Posts'})}
        />
        <Button
          title="Ir para Álbuns"
          onPress={() => navigation.navigate('Main', {screen: 'Albums'})}
        />
        <Button
          title="Ir para TO-DOs"
          onPress={() => navigation.navigate('Main', {screen: 'Todos'})}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {justifyContent: 'space-evenly', flex: 1, alignItems: 'center'},
  upText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Posts"
        component={Posts}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Albums"
        component={Albuns}
        options={{
          title: 'Álbuns',
          tabBarIcon: ({focused, color, size}) => (
            <Icon name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Todos"
        component={TodoScreen}
        options={{
          title: 'TODOs',
          tabBarIcon: ({focused, color, size}) => (
            <Icon name="check-square" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTransparent: true,
          cardStyle: {backgroundColor: '#7900df'},
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'PADAGRAM',
            headerTitleAlign: 'center',
            headerTitleStyle: {color: 'white'},
          }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            title: '',
            headerLeft: props => <HeaderLeft {...props} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HeaderLeft = props => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Home')}
      style={{marginStart: 10}}>
      <Icon name="home" size={30} color="#5f3473" />
    </TouchableOpacity>
  );
};

export default App;
