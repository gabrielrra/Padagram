import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {get} from 'axios';

import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import {ScrollView} from 'react-native-gesture-handler';
import Loading from './Components/LoadingModal';
import CustomModal from './Components/CustomModal';
import TextInputSelector from './Components/TextInputSelector';
import UserModal from './Components/UserModal';
import Icon from 'react-native-vector-icons/Feather';

const Posts = () => {
  const headerHeight = useHeaderHeight();
  const widthArr = [80, 400];
  const headers = ['Usuário', 'Post'];

  const [users, setUsers] = useState([{}]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState([{}]);

  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserFilter, setSelectedUserFilter] = useState();
  const [showUserModal, setShowUserModal] = useState(false);

  const [usersPicker, setUsersPicker] = useState([{id: 0, value: ''}]);
  const [pickerModal, setPickerModal] = useState(false);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    get('https://jsonplaceholder.typicode.com/posts').then(({data}) => {
      setPosts(data);
      const tData = data.map(item => {
        return [item.userId, {title: item.title, body: item.body}];
      });
      setTableData(tData);
    });
  }, []);
  useEffect(() => {
    get('https://jsonplaceholder.typicode.com/users').then(({data}) => {
      setUsers(data);
      const usersObject = data.map(user => ({
        id: user.id,
        value: user.username,
      }));
      setUsersPicker(usersObject);
    });
  }, []);

  function handlePickerPress(user) {
    setLoading(true);
    setPickerModal(false);
    setSelectedUserFilter(user);
    setTableData([]);
    get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`).then(
      ({data}) => {
        const tData = data.map(item => {
          return [item.userId, {title: item.title, body: item.body}];
        });
        setTableData(tData);
      },
    );
    console.log(user);
  }

  function cleanFilter() {
    const tData = posts.map(item => {
      return [item.userId, {title: item.title, body: item.body}];
    });
    setTableData(tData);
    setSelectedUserFilter(undefined);
  }
  if (tableData.length > 0 && users.length > 0 && loading) {
    setLoading(false);
  }
  return (
    <View style={[styles.container, {marginTop: headerHeight}]}>
      <View style={styles.filterContainer}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Filtrar por usuário :
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setPickerModal(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 16}}>
              {selectedUserFilter ? selectedUserFilter.value : 'Nenhum'}
            </Text>

            {selectedUserFilter && (
              <TouchableOpacity
                style={styles.cancelFilterButton}
                onPress={cleanFilter}>
                <Icon name="x" size={14} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{flex: 1}}>
          <Loading msg="Por favor aguarde..." />
        </View>
      ) : (
        <PostsTable
          tableData={tableData}
          headers={headers}
          widthArr={widthArr}
          users={users}
          onUserTouch={user => {
            setSelectedUser(user);
            setShowUserModal(true);
          }}
        />
      )}
      {pickerModal && (
        <CustomModal style={styles.namesModal}>
          <TouchableOpacity
            style={{alignSelf: 'flex-start', margin: 4}}
            onPress={() => setPickerModal(false)}>
            <Icon name="x" size={20} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <TextInputSelector
              data={usersPicker}
              placeholder="Digite o nome de usuário"
              textInputStyle={{width: '90%'}}
              onChangeText={() => {}}
              onButtonPressed={handlePickerPress}
            />
          </View>
        </CustomModal>
      )}
      <UserModal
        visible={showUserModal}
        userData={selectedUser ? selectedUser : {}}
        onClosePressed={() => {
          setShowUserModal(false);
          setSelectedUser(undefined);
        }}
      />
    </View>
  );
};

const Post = data => (
  <View>
    <Text style={styles.title}>{data.title}</Text>
    <Text style={styles.body}>{data.body}</Text>
  </View>
);
export default Posts;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  filterContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  filterButton: {
    borderRadius: 10,
    minWidth: 50,
    backgroundColor: '#D10AB0',
    padding: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelFilterButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  body: {color: 'black', fontSize: 16, textAlign: 'center'},
  namesModal: {backgroundColor: 'white', width: '90%', borderRadius: 20},
  header: {height: 50, backgroundColor: '#410078'},
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  text: {textAlign: 'center', fontWeight: 'bold'},
  dataWrapper: {marginTop: -1},
  row: {flexDirection: 'row', backgroundColor: '#fafafa'},
  userTouchable: {
    padding: 4,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {textAlign: 'center', color: 'white'},
  borderStyle: {borderWidth: 1, borderColor: '#C1C0B9'},
});

class PostsTable extends React.PureComponent {
  render() {
    const {headers, widthArr, tableData, users, onUserTouch} = this.props;
    return (
      <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 8}}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={headers}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.headerTitle}
            />
          </Table>
          <FlatList
            data={tableData}
            style={styles.dataWrapper}
            contentContainerStyle={{marginTop: -1}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              const user = users.filter(user => user.id === item[0])[0];
              return (
                <TableWrapper
                  borderStyle={styles.borderStyle}
                  style={styles.row}>
                  {item.map((cellData, cellIndex) => {
                    return (
                      <Cell
                        key={cellIndex}
                        style={{width: widthArr[cellIndex]}}
                        data={
                          cellIndex === 0
                            ? User(user ? user : '', onUserTouch)
                            : Post(cellData)
                        }
                        textStyle={styles.text}
                      />
                    );
                  })}
                </TableWrapper>
              );
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const User = (user, onPress) => (
  <TouchableOpacity
    style={[styles.userTouchable, {backgroundColor: colorArray[user.id - 1]}]}
    onPress={() => {
      onPress(user);
    }}>
    <Text style={styles.username} numberOfLines={1}>
      {user.username}
    </Text>
  </TouchableOpacity>
);
const colorArray = [
  '#FF6633',
  '#FF33FF',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#B34D4D',
  '#4D8000',
  '#B33300',
  '#66664D',
  '#991AFF',
  '#9900B3',
];
