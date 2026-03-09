import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../../../../core/constants';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../../styles';
import {VitalParamList} from '../../../../types/navigationsTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {inject, observer} from 'mobx-react';
import {BottomNavigation, CustIcon} from '../../../../components';
import {RouteProp} from '@react-navigation/native';

type stackScreenRouteProp = RouteProp<VitalParamList, 'ViewVitals'>;
type stackNavigationProp = StackNavigationProp<VitalParamList, 'ViewVitals'>;
type navigationProps = {
  navigation: stackNavigationProp;
  route: stackScreenRouteProp;
  vitals: any;
};

const ViewVitals: FC<navigationProps> = (props) => {
  const [vitals, setVitals] = useState<any>({});
  useEffect(() => {
    if (props.route.params.vitalsObj) setVitals(props.route.params.vitalsObj);
  }, [props.route.params.vitalsObj]);
  const goBack = () => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
  };
  const VitalSection = (section) => {
    return (
      <View style={styles.vitalSectionBox}>
        <FlatList
          data={Object.keys(section.data)}
          keyExtractor={(item: any) => item}
          renderItem={(src) => {
            return (
              <View
                style={{flexDirection: 'row', marginBottom: boxModelSize.l}}>
                <Text style={styles.sectionLabel}>
                  {section.data[src.item].key + ' : '}
                </Text>
                <Text style={styles.sectionValue}>
                  {section.data[src.item].value}
                </Text>
              </View>
            );
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.topBGContainer}>
        <View style={commonStyles.bgImageContainer}>
          <Image
            style={commonStyles.bgImage}
            source={Constants.BACKGROUND_IMAGE}
          />
        </View>
      </View>
      <View style={commonStyles.bottomBGContainer}></View>
      <View style={commonStyles.masterContainer}>
        <View style={[commonStyles.containerSpacing, commonStyles.container]}>
          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={goBack}
                style={{
                  paddingRight: boxModelSize.l,
                  paddingLeft: boxModelSize.l,
                }}>
                <CustIcon
                  type="antdesign"
                  size={scale(23)}
                  color={Colors.white}
                  name="arrowleft"
                />
              </TouchableOpacity>
              <Text style={commonStyles.navigationText}>View Vitals</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={[styles.vitalsBox, {paddingTop: boxModelSize.xl}]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.label}>Medic Name:</Text>
                <Text style={commonStyles.formSubTitle}>
                  {vitals.medicName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.label}>Date and Time:</Text>
                <Text style={commonStyles.formSubTitle}>
                  {vitals.dateAndTime}
                </Text>
              </View>
            </View>
            {vitals.vitalsData && (
              <FlatList
                data={Object.keys(vitals.vitalsData)}
                keyExtractor={(item: any) => item}
                renderItem={(src) => {
                  return (
                    <View style={styles.vitalsBox}>
                      <Text style={commonStyles.formSubTitle}>{src.item}</Text>
                      <VitalSection data={vitals.vitalsData[src.item]} />
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
        <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 0.9,
    padding: boxModelSize.m,
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
  },
  sectionLabel: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.default,
    marginLeft: boxModelSize.s,
  },
  sectionValue: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.h6,
  },
  vitalsBox: {
    backgroundColor: Colors.lightGrey,
    padding: boxModelSize.m,
    marginBottom: boxModelSize.l,
    borderRadius: scale(10),
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    width: '40%',
  },
  vitalSectionBox: {
    borderWidth: 1,
    padding: scale(10),
    borderColor: Colors.borderGrey,
    borderRadius: scale(10),
    marginBottom: boxModelSize.m,
    backgroundColor: Colors.white,
  },
});

export default inject('vitals')(observer(ViewVitals));
