import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {get} from 'axios';

import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import Loading from './Components/LoadingModal';
import {FlatList} from 'react-native-gesture-handler';
import UserModal from './Components/UserModal';
import CustomModal from './Components/CustomModal';
import Icon from 'react-native-vector-icons/Feather';

const Albuns = () => {
  const headerHeight = useHeaderHeight();
  const widthArr = [80, 300, 150];
  const headers = ['Usuário', 'Nome do Album', 'Fotos'];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);

  const [selectedAlbum, setSelectedAlbum] = useState({});
  const [showPhotosModal, setShowPhotosModal] = useState(false);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setShowPhotosModal(false);
    get('https://jsonplaceholder.typicode.com/albums').then(({data}) => {
      const tData = data.map(todo => [todo.userId, todo.title, 0]);
      setTableData(tData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    get('https://jsonplaceholder.typicode.com/users').then(({data}) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (tableData.length === 0 || users.length === 0) {
    return <Loading msg="Por favor aguarde..." />;
  }
  return (
    <View style={[styles.container, {marginTop: headerHeight}]}>
      {loading ? (
        <View style={styles.loadingPlaceholder}>
          <Loading />
        </View>
      ) : (
        <AlbunsTable
          widthArr={widthArr}
          tableData={tableData}
          headers={headers}
          users={users}
          onPhotosPress={photos => {
            setSelectedAlbum(photos);
            setShowPhotosModal(true);
          }}
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

      {showPhotosModal && (
        <CustomModal style={styles.photosModal}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowPhotosModal(false)}>
            <Icon name="x" size={20} />
          </TouchableOpacity>
          <FlatList
            data={selectedAlbum}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              return (
                <Image
                  source={{uri: item.thumbnailUrl}}
                  style={styles.modalImageStyle}
                />
              );
            }}
          />
        </CustomModal>
      )}
    </View>
  );
};

export default Albuns;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingPlaceholder: {
    flex: 1,
  },
  photosModal: {
    backgroundColor: 'white',
    width: 140,
    borderRadius: 10,
    height: '60%',
  },
  modalCloseButton: {alignSelf: 'flex-start', marginBottom: 10},
  modalImageStyle: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  header: {height: 50, backgroundColor: '#410078'},
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  text: {textAlign: 'center', fontWeight: 'bold'},
  dataWrapper: {marginTop: -1, borderWidth: 1, borderColor: '#FFF'},
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
  borderStyle: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
  horizontalScrollView: {paddingHorizontal: 8},
});

class AlbunsTable extends React.PureComponent {
  state = {
    photos: [],
  };
  render() {
    const {
      headers,
      widthArr,
      tableData,
      users,
      onUserTouch,
      onPhotosPress,
    } = this.props;
    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.horizontalScrollView}>
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
                  style={[
                    styles.row,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor:
                        item[0] % 2 !== 0 ? '#fafafa' : '#eaeaea',
                    },
                  ]}>
                  {item.map((cellData, cellIndex) => {
                    if (cellIndex === 0) {
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
                        data={
                          cellIndex === 2 ? (
                            <Photos id={index + 1} onPress={onPhotosPress} />
                          ) : (
                            cellData
                          )
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

const Photos = ({id, onPress}) => {
  const [photos, setphotos] = useState([]);
  useEffect(() => {
    get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`).then(
      ({data}) => {
        setphotos(data);
      },
    );
  }, [id]);
  return (
    <TouchableOpacity
      style={{padding: 8, alignSelf: 'center'}}
      onPress={() => onPress(photos)}>
      <Text style={{color: '#0645AD'}}>
        {photos.length > 0 ? `${photos.length} fotos...` : 'Buscando fotos...'}
      </Text>
    </TouchableOpacity>
  );
};

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
