import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import SearchScreen from './Screens/SearchScreen.js'
import TransactionScreen from './Screens/TransactionScreen.js'

import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs' 

export default function App() {
  return (
    <AppContainer/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator = createBottomTabNavigator({
  Transaction:{ screen: TransactionScreen },
  Search:{ screen: SearchScreen },
},
   {
    defaultNavigationOptions: ({navigation})=>({
      tabBarIcon: ()=>{
        const routeName = navigation.state.routeName
        if(routeName == 'Transaction'){
          return(
            <Image source = {require('./assets/book.png')} style = {{width: 25, height: 25}}></Image>
          )
        }else if(routeName == 'Search'){
          return(
            <Image source = {require('./assets/searchingbook.png')} style = {{width: 25, height: 25}}></Image>
          )
        }
      }
    })
  }
)

const AppContainer = createAppContainer(TabNavigator)