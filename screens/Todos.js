import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {get} from 'axios';
import Icon from 'react-native-vector-icons/Feather';

import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import Loading from './Components/LoadingModal';
import {FlatList} from 'react-native-gesture-handler';
import UserModal from './Components/UserModal';

const Todos = () => {
  const headerHeight = useHeaderHeight();
  const widthArr = [62, 80, 300, 100];
  const headers = ['Nº', 'Usuário', 'Tarefa', 'Concluído'];

  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setLoading(true);
    get('https://jsonplaceholder.typicode.com/todos').then(({data}) => {
      setTodos(data);
      const tData = data.map(todo => [
        `${todo.id}/${todos.length}`,
        todo.userId,
        todo.title,
        todo.completed,
      ]);
      setTableData(tData);
      setLoading(false);
    });
  }, [todos.length]);

  useEffect(() => {
    setLoading(true);
    get('https://jsonplaceholder.typicode.com/users').then(({data}) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  async function filter(value) {
    setLoading(true);
    if (!value && tableData.length !== todos.length) {
      const tData = todos.map(todo => [
        `${todo.id}/${todos.length}`,
        todo.userId,
        todo.title,
        todo.completed,
      ]);
      setTableData(tData);
      setLoading(false);
      return;
    }
    switch (value) {
      case 'square': {
        const {data} = await get('https://jsonplaceholder.typicode.com/todos', {
          params: {completed: false},
        });
        const tData = data.map(todo => [
          `${todo.id}/${todos.length}`,
          todo.userId,
          todo.title,
          todo.completed,
        ]);
        setTableData(tData);
        break;
      }

      case 'check-square': {
        const {data} = await get('https://jsonplaceholder.typicode.com/todos', {
          params: {completed: true},
        });
        const tData = data.map(todo => [
          `${todo.id}/${todos.length}`,
          todo.userId,
          todo.title,
          todo.completed,
        ]);
        setTableData(tData);
        break;
      }
    }

    setLoading(false);
  }

  return (
    <View style={[styles.container, {marginTop: headerHeight}]}>
      <View style={styles.filterContainer}>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 17}}>Filtrar por:</Text>
        </View>
        <FilterItems onChange={value => filter(value)} />
      </View>
      {loading ? (
        <View style={{flex: 1}}>
          <Loading />
        </View>
      ) : (
        <TodosTable
          widthArr={widthArr}
          tableData={tableData}
          headers={headers}
          users={users}
          onUserTouch={user => {
            setSelectedUser(user);
            setShowUserModal(true);
          }}
        />
      )}

      <UserModal
        visible={showUserModal}
        userData={selectedUser ? selectedUser : {}}
        onClosePressed={() => setShowUserModal(false)}
      />
    </View>
  );
};

export default Todos;

function Check(completed) {
  let icon;
  if (completed) {
    icon = <Icon name="check-square" size={24} color="#85076F" />;
  } else {
    icon = <Icon name="square" size={24} color="#85076F" />;
  }
  return <View style={{padding: 8, alignSelf: 'center'}}>{icon}</View>;
}

const FilterItem = ({selected, onPress, name}) => {
  const backgroundColor = selected ? '#85076F' : '#CACACA';
  const iconColor = selected ? '#B6C400' : '#000';

  return (
    <TouchableOpacity
      style={[styles.filterButtons, {backgroundColor}]}
      onPress={onPress}>
      <Icon name={name} size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

const FilterItemsComponent = ({onChange}) => {
  const [selectedItem, setSelectedItem] = useState('');

  function handleFilter(value) {
    if (selectedItem === value) {
      setSelectedItem('');
      onChange('');
    } else {
      setSelectedItem(value);
      onChange(value);
    }
  }
  return (
    <View style={{flexDirection: 'row'}}>
      <FilterItem
        name="square"
        selected={selectedItem === 'square'}
        onPress={() => handleFilter('square')}
      />
      <FilterItem
        name="check-square"
        selected={selectedItem === 'check-square'}
        onPress={() => handleFilter('check-square')}
      />
    </View>
  );
};
const FilterItems = React.memo(FilterItemsComponent);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 8,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  header: {height: 50, backgroundColor: '#410078'},
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  text: {textAlign: 'center', fontWeight: 'bold'},
  dataWrapper: {
    marginTop: -1,
    borderWidth: 1,
    borderColor: '#FFF',
    borderTopWidth: 0,
  },
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  userTouchable: {
    margin: 10,
    backgroundColor: '#85076F',
    padding: 4,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {textAlign: 'center', fontWeight: 'bold', color: 'white'},
  filterButtons: {
    backgroundColor: '#cacaca',
    height: 30,
    width: 30,
    marginHorizontal: 4,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class TodosTable extends React.PureComponent {
  state = {};

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
              const user = users.filter(user => user.id === item[1])[0];
              return (
                <TableWrapper
                  borderStyle={{borderWidth: 1, borderColor: '#fff'}}
                  style={[
                    styles.row,
                    {
                      backgroundColor: item[3] ? '#66bb6aa0' : '#ef5350a0',
                    },
                  ]}>
                  {item.map((cellData, cellIndex) => {
                    if (cellIndex === 1) {
                      return (
                        <Cell
                          key={cellIndex}
                          style={{width: widthArr[cellIndex]}}
                          data={User(user ? user : {}, onUserTouch)}
                          textStyle={styles.text}
                        />
                      );
                    }
                    return (
                      <Cell
                        key={cellIndex}
                        style={{width: widthArr[cellIndex]}}
                        data={cellIndex === 3 ? Check(cellData) : cellData}
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
