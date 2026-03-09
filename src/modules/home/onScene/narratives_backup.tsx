import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {scale} from 'react-native-size-matters';

import Constants from '../../../core/constants';
import {BottomNavigation, CustIcon} from '../../../components';
import {boxModelSize, Colors, commonStyles, Fonts} from '../../../styles';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {observer, inject} from 'mobx-react';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  assessmentStore: any;
  treatmentStore: any;
};

const Narratives: FC<navigationProps> = (props) => {
  const [assessemntResult, setAssessemntResult] = useState(null);
  const [secAssessemntResult, setSecAssessemntResult] = useState(null);
  const [treatmentResult, setTreatmentResult] = useState(null);

  useEffect(() => {
    props.assessmentStore.getPrimaryAssessmentFormData();
    props.assessmentStore.getSecondaryAssessmentFormData();
    props.treatmentStore.getTreatmentFormData();
    return () => {};
  }, []);

  useEffect(() => {
    computeStatement(
      props.assessmentStore.assessmentPrimaryFormData,
      props.assessmentStore.assessmentUserData,
      (data) => setAssessemntResult(data),
    );

    computeStatement(
      props.assessmentStore.assessmentSecondaryFormData,
      props.assessmentStore.assessmentUserData,
      (data) => setSecAssessemntResult(data),
    );

    computeStatement(
      props.treatmentStore.treatmentFormData,
      props.treatmentStore.treatmentUserData,
      (data) => setTreatmentResult(data),
    );

    return () => {};
  }, [
    props.assessmentStore.assessmentUserData,
    props.treatmentStore.treatmentUserData,
    props.assessmentStore.assessmentPrimaryFormData,
    props.assessmentStore.assessmentSecondaryFormData,
    props.treatmentStore.treatmentFormData,
  ]);

  function computeStatement(formData, assessmentUserData, callback) {
    var result = '';
    Object.keys(formData).map((key1) => {
      var fobj1 = formData[key1];

      var check1 = Object.keys(assessmentUserData).filter((udKey) =>
        udKey.includes(fobj1.id + '-'),
      );

      if (check1.length > 0) {
        result = result.concat('\n', fobj1.name, ' > ');

        Object.keys(fobj1.data).map((key2) => {
          var fobj2 = fobj1.data[key2];

          var check2 = Object.keys(assessmentUserData).filter((udKey) =>
            udKey.includes(fobj2.id),
          );

          if (check2.length > 0) {
            result = result.concat(fobj2.name, ' > ');

            Object.keys(fobj2.data).map((key3) => {
              var fobj3 = fobj2.data[key3];

              var check3 = Object.keys(assessmentUserData).filter((udKey) =>
                udKey.includes(fobj3.id),
              );

              if (check3.length > 0) {
                result = result.concat(fobj3.name, ' - ');

                Object.keys(fobj3.data).map((key4) => {
                  var fobj4 = fobj3.data[key4];

                  var check4 = Object.keys(assessmentUserData).filter((udKey) =>
                    udKey.includes(fobj4.id),
                  );

                  if (check4.length > 0) {
                    result = result.concat(fobj4.name, ' : ');

                    var obj = assessmentUserData[fobj4.id];
                    if (obj?.answer) {
                      var _ans = obj?.answer
                        ? Object.values(obj?.answer)
                            .map((rec: any) =>
                              rec.type == 'm-select' || rec.type == 's-select'
                                ? rec.name
                                : rec.name + ' : ' + rec.value,
                            )
                            .join(', ')
                        : '';

                      console.log('ans: ' + JSON.stringify(_ans));

                      result = result.concat(fobj4.name + ' : ' + _ans + '; ');
                    } else {
                      Object.keys(fobj4.data).map((key5) => {
                        var fobj5 = fobj4.data[key5];

                        var check5 = Object.keys(
                          assessmentUserData,
                        ).filter((udKey) => udKey.includes(fobj5.id));

                        if (check5.length > 0) {
                          var obj = assessmentUserData[fobj5.id];
                          if (obj?.answer) {
                            var _ans = Object.values(obj.answer)
                              .map((rec: any) =>
                                rec.type == 'm-select' || rec.type == 's-select'
                                  ? rec.name
                                  : rec.name + ' : ' + rec.value,
                              )
                              .join(', ');

                            console.log('ans: ' + JSON.stringify(_ans));

                            result = result.concat(
                              fobj5.name + ' : ' + _ans + '; ',
                            );
                          }
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }

      return null;
    });

    result = result.split(' -  : ').join(' : ');
    result = result.split(' >  > ').join(' > ');
    result = result.split(' >  > ').join(' > ');
    result = result.split(' >  : ').join(' > ');
    result = result.split(' >  : ').join(' > ');
    result = result.split(';  : ').join('; ');
    result = result.split(';  : ').join('; ');
    result = result.split(';  > ').join('; ');
    result = result.split('; \n').join('.\n\n');
    result = result.split(':  : ').join(': ');
    result = result.trim();
    result = result.replace(/.$/, '.');

    console.log('Result: ' + result);
    callback(result);
  }

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
        <View style={[commonStyles.container, commonStyles.containerSpacing]}>
          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={{paddingRight: scale(15), paddingLeft: scale(15)}}>
                <CustIcon
                  type="antdesign"
                  size={scale(23)}
                  color={Colors.white}
                  name="arrowleft"
                />
              </TouchableOpacity>
              <Text style={styles.navigationText}>Narratives</Text>
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Under development')}
              style={{paddingRight: scale(15), paddingLeft: scale(15)}}>
              <CustIcon
                type="fontisto"
                size={scale(20)}
                color={Colors.white}
                name="nav-icon-grid"
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.contentContainer, styles.boxShadow]}>
            <View style={{flexShrink: 1}}>
              <Text style={styles.title}>Assessment</Text>

              {assessemntResult ? (
                <Text style={{paddingHorizontal: 20.0}}>
                  {assessemntResult}
                </Text>
              ) : null}
              {secAssessemntResult ? (
                <Text style={{paddingHorizontal: 20.0}}>
                  {secAssessemntResult}
                </Text>
              ) : null}
              <Text style={styles.title}>Treatment</Text>
              <Text style={{paddingHorizontal: 20.0}}>{treatmentResult}</Text>
            </View>
          </View>
        </View>
        {/* <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View> */}
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
    backgroundColor: Colors.lightGrey,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  navigationText: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.white,
    fontSize: scale(16),
  },
  title: {
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
    fontSize: scale(16),
    paddingVertical: scale(10),
    paddingLeft: boxModelSize.l,
  },
});

export default inject(
  'assessmentStore',
  'treatmentStore',
)(observer(Narratives));
