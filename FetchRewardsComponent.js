import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, FlatList, View } from "react-native";

const Item = ({id, listId, name}) => (
  
  
  <View style={styles.row}>
    <View style={styles.col}>
      <Text >{id}</Text>
    </View>
    <View style={styles.col}>
      <Text >{listId} </Text>
    </View>
    <View style={styles.col}>
      <Text >{name}</Text>
    </View>
  </View>
)

const FetchRewards = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
 
  let result = []
  let refinedData = {}
  
  const getData = async() => {
    
    try {
      const url = await fetch("https://fetch-hiring.s3.amazonaws.com/hiring.json")
      const json = await url.json()
      const parsedJson = json
      let i = 0
      while (parsedJson[i]) {
       
        let id = parsedJson[i].id
        let listId = parsedJson[i].listId
        let name = parsedJson[i].name
        

        // check if key exists in dataset
        if (refinedData[listId] === undefined) {

          // save objects where name is not null/empty
          if (name != null && name.length > 0) {
            
            refinedData[listId] = [{id: id, listId: listId, name: name}]
            
          }
           // if key exists and name is not null/empty store object
        } else if (refinedData[listId] && name != null && name.length > 0) {
          refinedData[listId] = refinedData[listId].concat({id: id, listId: listId, name: name})
        }


        i++
      }
      // console.log(refinedData)
      
      
      for (let el in refinedData) {
        
        // sort objects by name value
        refinedData[el].sort((a,b) => {
        
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
      
          return 0;
        })

        result = result.concat(refinedData[el])
        
      }
      
      
      setData(result)
       setLoading(false);
      
      
    } catch (error) {
      console.log(error)
    } 

    
  };
  
  
  
  
  
  const renderItem =({item}) => (
    
    <Item
      id={item.id}
      listId={item.listId}
      name={item.name}
    />
  );
  
  useEffect(() => {
    getData()
    
  },[]);

  
  return (
    
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> :  
          (<FlatList
          data={data}
          keyExtractor={(item) => {item.id}}
          renderItem={renderItem}
          />)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },row: {
    flex: 1,
    flexDirection: "row",
    padding: 4,
    borderBottomColor: "red",
    borderBottomWidth: StyleSheet.hairlineWidth
  },col : {
    flex: 5, 
    flexDirection: "column"
  }
  
});



export default FetchRewards;