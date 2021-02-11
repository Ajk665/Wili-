import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'

import firebase from 'firebase'
import db from '../config.js'

export default class TransactionScreen extends React.Component{

    constructor(){
        super()
        this.state ={
            hasCameraPermissions: null,
            scanned: false,
            scannedData: '',
            buttonPressed: 'normal',
            scannedBookID: '',
            scannedStudentID: '',
        }
    }

    handleBarcodeScanned = async({type, data}) =>{
        const {buttonPressed} = this.state
        if(buttonPressed == 'bookID'){
            this.setState({
                scanned: true,
                scannedBookID: data,
                buttonPressed: 'normal',         
            })
        }else if (buttonPressed == 'studentID'){
            this.setState({
                scanned: true,
                scannedStudentID: data,
                buttonPressed: 'normal',         
            })
        }
    }

    getCameraPermission = async(ID) =>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions: status == 'granted',
            buttonPressed: ID,
            scanned: 'false',
        })
    }

    handleTransaction = async() =>{
        var transactionMessage = null
        db.collection('Books').doc(this.state.scannedBookID).get().then((doc) =>{
            var book = doc.data()
            if(book.bookAvailability){
                this.initiateBookIssue()
                transactionMessage = 'bookIssued'
            }else{
                this.initiateBookReturn()
                transactionMessagde = 'bookReturned'
            } 
        })
        this.setState({
            transactionMessage: transactionMessage,
        })
    }

    initiateBookIssue = async() =>{
        db.collection('Transactions').add({
            'studentId': this.state.scannedStudentID,
            'bookId': this.state.scannedBookID,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': 'issued'
        })
        db.collection('Books').doc(this.state.scannedBookID).update({
            'bookAvailability': false
        })
        db.collection('Students').doc(this.state.scannedStudentID).update({
            'booksIssued': firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert('Book Issued')
        this.setState({
            scannedStudentID: '',
            scannedBookId: '',
        })
    }

    initiateBookIssue = async() =>{
        db.collection('Transactions').add({
            'studentId': this.state.scannedStudentID,
            'bookId': this.state.scannedBookID,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': 'returned'
        })
        db.collection('Books').doc(this.state.scannedBookID).update({
            'bookAvailability': true
        })
        db.collection('Students').doc(this.state.scannedStudentID).update({
            'booksIssued': firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert('Book Returned')
        this.setState({
            scannedStudentID: '',
            scannedBookId: '',
        })
    }

render(){
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonPressed = this.state.buttonPressed;

    if(buttonPressed !== 'normal' &&hasCameraPermissions){
        return(
            <BarCodeScanner style = {StyleSheet.absoluteFillObject} onBarCodeScanned = {
                scanned ?
                undefined
                :this.handleBarcodeScanned}/>
        )
    }else if(buttonPressed == 'normal'){
        return(
            <View style = {styles.view}>
                <View>
                    <Image source = {require('../assets/booklogo.jpg')} style = {{width: 200, height: 200}}></Image>
                    <Text style = {styles.text}>WILI Library</Text>
                </View>
                <View style = {styles.view2}>
                  <TextInput value = {this.state.scannedBookID} style = {styles.studentText} placeholder = "Book ID"></TextInput>
                  <TouchableOpacity style = {styles.button} onPress ={()=> {this.getCameraPermission('bookID')}}><Text>SCAN</Text></TouchableOpacity>
                </View>
                <View style = {styles.view2}>
                  <TextInput value = {this.state.scannedStudentID} style = {styles.studentText} placeholder = "Student ID"></TextInput>
                  <TouchableOpacity style = {styles.button} onPress ={()=> {this.getCameraPermission('studentID')}}><Text>SCAN</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style = {styles.button2} onPress = {async()=>{this.handleTransaction()}}>
                    <Text style = {styles.text}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

}
const styles = StyleSheet.create({

   qrCode:{
       justifyContent: 'center',
       borderWidth: 2,
       backgroundColor: 'red',
       borderColor: 'black'
   },
   text: {
       justifyContent: 'center',
       textAlign: 'center',
       color: 'black',
       fontWeight: 'bold',
       fontSize: 25,
   },
   view: {
       justifyContent: 'center',
       alignItems: 'center',
       flex: 1,
   },
   studentText: {
       width: 300,
       height: 50,
       borderWidth: 10,
       borderRightWidth: 0,
   },
   view2: {
       flexDirection: 'row',
       margin: 20,
       textAlign: 'center',
       alignItems: 'center',
   },
   button: {
       backgroundColor: 'red',
       height: 50,
       width: 100,
       borderWidth: 5,
       borderRadius: 10,
   },
   button2: {
       backgroundColor: 'green',
       height: 50,
       width: 150,
       borderRadius: 10,
       borderWidth: 10,
   }
}) 