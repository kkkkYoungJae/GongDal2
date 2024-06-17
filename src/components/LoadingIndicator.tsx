import { useLoadingState } from '@/atoms/loadingState';
import { ActivityIndicator, Modal, View } from 'react-native';

const LoadingIndicator = () => {
  const { loading } = useLoadingState();

  return (
    <Modal visible={loading} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
};

export default LoadingIndicator;
