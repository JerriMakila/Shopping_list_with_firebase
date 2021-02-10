import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    firebase.database().ref('items/').on('value', snapshot => {
      const data = snapshot.val();

      if(data != null){
        const prods = Object.values(data);

        prods.map((item, index) => {
          const key = Object.keys(data)[index];
          prods[index] = {...item, key: key};
        })

        setItems(prods);
      }
    });
  }, []);

  const addItem = () => {
    firebase.database().ref('items/').push(
      {'product': product, 'amount': amount}
    );
    setProduct('');
    setAmount('');
  }

  const deleteItem = (key) => {
    firebase.database().ref('items/' + key).remove(); 
    
    if(items.length === 1){
      setItems([]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Product"
          onChangeText={item => setProduct(item)}
          value={product}>
        </TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Amount"
          onChangeText={amount => setAmount(amount)}
          value={amount}>
        </TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="ADD" onPress={addItem}></Button>
      </View>
      <View styles={styles.listContainer}>
        <Text style={{color:'blue', fontSize:20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'}}>Shopping List</Text>
        <FlatList
          data={items}
          keyExtractor={item => item.key}
          renderItem={({item}) =>
            <View style={styles.listItem}>
              <Text style={{fontSize: 20}}>{item.product}, {item.amount} </Text>
              <Text style={{fontSize: 20, color: 'blue'}} onPress={() => deleteItem(item.key)}>Bought</Text>
            </View>
        }>
        </FlatList>
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 200
  },

  inputContainer: {
    marginBottom: 20
  },

  listContainer: {
    
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 20,
    paddingHorizontal: 5,
    width: 150
  }
});
