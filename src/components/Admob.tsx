import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: 'ca-app-pub-5124742550849714/1817212532',
    android: 'ca-app-pub-5124742550849714/8711624066',
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

interface Props extends ViewProps {}
const Admob = ({ style }: Props) => {
  return (
    <View style={[styles.admob, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  admob: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Admob;
