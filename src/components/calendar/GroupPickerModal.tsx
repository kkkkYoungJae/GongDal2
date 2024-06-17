import images from '@/assets/images';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import { IGroup } from '@/types/group';
import { delay } from '@/utils/factory';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '../Icon';
import Text from '../Text';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectGroup: IGroup | null;
  groups?: IGroup[];
  handleSelectGroup: (group: IGroup | null) => void;
}

const GroupPickerModal = ({ visible, onClose, selectGroup, handleSelectGroup, groups }: Props) => {
  const onPress = async (group: IGroup | null) => {
    handleSelectGroup(group);
    await delay(500);
    onClose();
  };

  const renderItem = ({ item }: { item: IGroup }) => {
    return (
      <TouchableOpacity onPress={() => onPress(item)} style={styles.itemWrapper}>
        <FastImage
          style={styles.itemImage}
          resizeMode="cover"
          source={item.cover ? { uri: 'data:image/png;base64,' + item.cover } : images.logo}
        />
        <Text subtitle2 style={{ flex: 1 }} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        {selectGroup?.groupId === item.groupId && <Icon icon="Ionicons" name="checkmark" />}
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={{ padding: 24, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ backgroundColor: '#f4f3f5', borderRadius: 100, padding: 6 }}
          >
            <Icon icon="AntD" name="close" color="#727272" size={20} />
          </TouchableOpacity>
        </View>
        <Text h1 style={{ fontSize: DEFAULT_SCALE_FACTOR(28), marginBottom: 16 }}>
          그룹
        </Text>

        <FlatList
          data={groups}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <TouchableOpacity onPress={() => onPress(null)} style={styles.headerWrapper}>
              <FastImage style={styles.headerImage} resizeMode="cover" source={images.logo} />
              <Text subtitle2 style={{ flex: 1 }} numberOfLines={1} ellipsizeMode="tail">
                그룹 없음
              </Text>
              {selectGroup === null && <Icon icon="Ionicons" name="checkmark" />}
            </TouchableOpacity>
          }
        />
      </View>
    </Modal>
  );
};

export default GroupPickerModal;

const styles = StyleSheet.create({
  headerWrapper: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f3f5',
    marginVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 12,
  },
  itemWrapper: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f3f5',
    marginVertical: 4,
    borderRadius: 16,
  },
  itemImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 12,
  },
});
