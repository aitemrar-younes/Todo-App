import { StyleSheet, Text, View, TextInput, Pressable, Alert, FlatList, Modal, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from 'react';

//************************* open database ***************************/
const db = SQLite.openDatabase("ToDo.db");

//************************* create table todo in the database ***************************/
const db_create_table = () =>{
    db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists todo (id integer primary key not null, title text, done integer);"
        );
      });
}

//************************* read todo table from database ***************************/
const db_read = (setData) =>{
    db.transaction((tx) => {
        tx.executeSql(
            `select * from todo;`,
            [],
            (_, { rows: { _array } }) => {
                setData(_array); 
                console.log(_array);
        },(tx,err)=>{
            console.log(err)
        }
        );
      });
}

//************************* add todo item to the table "todo" ***************************/
const db_add = (title, setData) =>{
    db.transaction((tx) => {
        tx.executeSql(
            "insert into todo (title, done) values (?, ?)", 
            [title, 0],
            (tx,res)=>{
                //console.log("adding to it ");
                db_read(setData)},
            (tx,err)=>{
                console.log(err)
            }
            );
        }
    );
}

//************************* delete todo item from the table "todo" ***************************/
const db_delete = (id, setData) =>{
    db.transaction((tx) => {
        tx.executeSql(
          `delete from todo where id = ?;`,
          [id],
          (_, { rows: { _array } }) => {
            db_read(setData);
            //console.log(_array);
        },(tx,err)=>{
            console.log(err)
        }
        );
      });
}
//************************* delete todo item from the table "todo" ***************************/
const db_update_status = (id, new_value,setData) =>{
    db.transaction((tx) => {
        tx.executeSql(
          `update todo set done = ? where id = ?;`,
          [new_value,id],
          (_, { rows: { _array } }) => {
            db_read(setData);
            //console.log(_array);
        },(tx,err)=>{
            console.log(err)
        }
        );
      });
}


export default function ToDo() {
    const [todo ,setTodo] = useState([
        /* {id:0, title:"todo1", done:0},
        {id:1, title:"trash", done:1},
        {id:2, title:"keyboard", done:1},
        {id:3, title:"mouse", done:0},
        {id:4, title:"gpu", done:1},
        {id:5, title:"cpu", done:1},
        {id:6, title:"case", done:0}, */
    ]);
    const [modalVisible, setModalVisnle] = useState(false);
    const [title, setTitle] = useState("");

    //****************************** Trigers ************************************/
    useEffect(()=>{
        db_create_table();
        db_read(setTodo);
    },[])

    return (
        <View style={styles.container}>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.appTitle}>Add ToDo</Text>
                            <Pressable style={{width:30,height:30}} onPress={()=>{setModalVisnle(false)}}>
                                <AntDesign name="close" size={30} color="#fff" />
                            </Pressable>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="what you want to do ?"
                            value={title}
                            onChangeText={(text)=>{setTitle(text)}}
                        />
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={()=>{
                                //console.log('confirm it '+title)
                                if(title != ""){
                                    db_add(title, setTodo);
                                    setTitle("")
                                    setModalVisnle(false);
                                }
                                else{
                                    console.log('title is empty')
                                }
                            }}
                        >
                            <Text style={styles.confirmButtonText}>Confirm !t</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.appHeader}>
                <Text style={styles.appTitle}>TODO APP</Text>
                <Pressable
                    onPress={()=>{
                        //Alert.alert("this will add a todo item, will be fully configured later, let's focus on the UI")
                        setModalVisnle(true)
                    }}
                >
                    <AntDesign style={{width:35,height:35,}} name="pluscircle" size={35} color="white" />
                </Pressable>
            </View>
            <FlatList
                contentContainerStyle={{
                    minWidth: "100%",
                    flex: 1,
                    alignItems: "center"

                }}
                showsVerticalScrollIndicator={false}
                data={todo}
                renderItem={({item})=>(
                    <TouchableOpacity 
                        style={styles.toDoItem}
                        onPress={()=>{
                            if(item.done==0)
                                 db_update_status(item.id, 1,setTodo)
                            else
                                db_update_status(item.id, 0,setTodo)
                        }}
                    >
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            {item.done == 1?<AntDesign name="checkcircle" size={24} color="#7FD8BE" />:<></>}
                            <Text style={{color: "#777", fontSize: 15,marginLeft:10}}>{item.title}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{db_delete(item.id, setTodo)}}
                        >
                            <AntDesign name="delete" size={24} color="#d00000" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:22,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor:'#fcefef'
    //justifyContent: 'center',
  },
  modalContainer:{
        flex: 1 ,
        paddingTop: 30,
        //flexDirection:"column-reverse",
        //justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor:'rgba(0,0,0,0.1)'
    },
  modal: {
    minWidth:"96%",
    width:"96%",
    height: 220,
    backgroundColor:'#fcefef',
    alignItems: "center",
    borderRadius: 7,

    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height:15
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5
  },
  modalHeader:{
    height:50,
    paddingHorizontal:10,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:"#7FD8BE",
    width:"100%",
    borderTopRightRadius:8,
    borderTopLeftRadius:8,
  },
  input: {
      //marginHorizontal:10,
      borderWidth: 1,
      borderColor: "lightgray",
      height: 45,
      minWidth: "96%",
      borderRadius: 5,
      padding: 10,
      fontSize: 17,
      marginTop: 25,
      backgroundColor: "white",
  },
  confirmButton: {
    backgroundColor:"#7FD8BE",
    width:"80%",
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: "auto"
  },
  confirmButtonText: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 17
  },
  appHeader: {
    height: 50,
    minWidth: "100%",
    maxWidth: "100%",
    backgroundColor: "#7FD8BE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 15
  },
  appTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addIcon: {

  },
  toDoItem: {
      height:45,
      minWidth: "90%",
      maxWidth: "90%",
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: "white",
      marginVertical: 3,
      paddingHorizontal:10,
      borderRadius: 5
  }

});
