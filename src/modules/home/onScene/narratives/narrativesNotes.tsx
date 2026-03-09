import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../../../../core/constants';
import {
  BottomNavigation,
  CustIcon,
  CustTextInput,
  CustButton,
  CustSignature,
  CustSnackBar,
} from '../../../../components';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../../styles';
import {NarrativeParamList} from '../../../../types/navigationsTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {inject, observer} from 'mobx-react';
import moment from 'moment';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {getImageUriFromStorage} from '../../../../core/utils';

type stackScreenRouteProp = RouteProp<NarrativeParamList, 'NarrativesNotes'>;
type stackNavigationProp = StackNavigationProp<
  NarrativeParamList,
  'NarrativesNotes'
>;
type navigationProps = {
  navigation: stackNavigationProp;
  route: stackScreenRouteProp;
  assessmentStore: any;
  treatmentStore: any;
  narratives: any;
  assistRequests: any;
  profile: any;
};

const NarrativesNotes: FC<navigationProps> = (props) => {
  const idExist = (data, key) => {
    return Object.keys(data).some((udKey) => udKey.includes(key));
  };

  const optionStatement = (name, obj, result) => {
    var _ans = Object.values(obj?.answer)
      .map((rec: any) =>
        rec.type == 'm-select' || rec.type == 's-select'
          ? rec.name
          : rec.name + ' : ' + rec.value,
      )
      .join(', ');

    result = result.concat(name + ' : ' + _ans + '; ');

    return result;
  };

  function computeStatement(formData, uData, callback) {
    var result = '';

    Object.keys(formData).map((key1) => {
      var fobj1 = formData[key1];

      if (idExist(uData, fobj1.id + '-')) {
        result = result.concat('\n', fobj1.name, ' > ');

        Object.keys(fobj1.data).map((key2) => {
          var fobj2 = fobj1.data[key2];

          if (idExist(uData, fobj2.id)) {
            result = result.concat(fobj2.name, ' > ');

            Object.keys(fobj2.data).map((key3) => {
              var fobj3 = fobj2.data[key3];

              if (idExist(uData, fobj3.id)) {
                result = result.concat(fobj3.name, ' - ');

                Object.keys(fobj3.data).map((key4) => {
                  var fobj4 = fobj3.data[key4];

                  if (idExist(uData, fobj4.id)) {
                    result = result.concat(fobj4.name, ' : ');

                    var obj = uData[fobj4.id];
                    if (obj?.answer) {
                      result = optionStatement(fobj4.name, obj, result);
                    } else {
                      Object.keys(fobj4.data).map((key5) => {
                        var fobj5 = fobj4.data[key5];

                        if (idExist(uData, fobj5.id)) {
                          var obj = uData[fobj5.id];
                          if (obj?.answer) {
                            result = optionStatement(fobj5.name, obj, result);
                          } else {
                            Object.keys(fobj5.data).map((key6) => {
                              var fobj6 = fobj5.data[key6];

                              if (idExist(uData, fobj6.id)) {
                                var obj = uData[fobj6.id];
                                if (obj?.answer) {
                                  result = optionStatement(
                                    fobj6.name,
                                    obj,
                                    result,
                                  );
                                }
                              }
                            });
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
  const [isEditable, setEditable] = useState<boolean>(true);
  const [showSignature, setShowSignature] = useState<boolean>(false);
  const [signImgPath, setSignImgPath] = useState<string>(undefined);
  const [narrative, setNarrative] = useState<any>(null);
  const [assist, setAssist] = useState<any>(null);
  const [summary, setSummary] = useState<string>('');
  const [assessemntResult, setAssessemntResult] = useState('');
  const [secAssessemntResult, setSecAssessemntResult] = useState('');
  const [treatmentResult, setTreatmentResult] = useState('');
  const [cprSummary, setCprSummary] = useState(
    'CPR summary data will come later',
  );
  const [consumables, setConsumables] = useState(
    'Consumables summary data will come later',
  );
  const [causeOfDelay, setCauseOfDelay] = useState(
    'Cause of delay summary data will come later',
  );

  useEffect(() => {
    setNarrative(props.route.params.narrativeObj);
    const narrativeObj = props.route.params.narrativeObj;
    if (Object.keys(narrativeObj).length > 0) {
      setEditable(false);
      setSummary(narrativeObj.summary);
      setAssessemntResult(narrativeObj.assessmentSummary);
      setTreatmentResult(narrativeObj.treatmentsSummary);
      setCprSummary(narrativeObj.cprSummary);
      setConsumables(narrativeObj.consumables);
      setCauseOfDelay(narrativeObj.causeOfDelay);
      if (narrativeObj.medicSignature)
        setMedicSignImg(narrativeObj.medicSignature);
    } else {
      setAssist(
        props.assistRequests.getFamilyMemberObject(
          props.assistRequests.selectedProfile,
        ),
      );
      setMedicSignImg(
        Constants.PROFILE_SIGN_PREFIX + props.profile.profile.fbUserID,
      );
      props.assessmentStore.getAssessmentFormData();
      props.treatmentStore.getTreatmentFormData();
    }
  }, [props.route.params.narrativeObj]);

  useEffect(() => {
    computeStatement(
      props.assessmentStore.assessmentFormData,
      props.assessmentStore.assessmentUserData,
      (data) => {
        if (data.length > 0) setAssessemntResult(data);
      },
    );
  }, [
    props.assessmentStore.assessmentUserData,
    props.assessmentStore.getPrimaryAssessmentFormData,
  ]);

  useEffect(() => {
    computeStatement(
      props.treatmentStore.treatmentFormData,
      props.treatmentStore.treatmentUserData,
      (data) => {
        if (data.length > 0) setTreatmentResult(data);
      },
    );
  }, [
    props.treatmentStore.treatmentUserData,
    props.treatmentStore.treatmentFormData,
  ]);
  const onSubmit = () => {
    if (summary.length == 0) {
      CustSnackBar('Please enter narrative summary');
      return;
    }
    if (!signImgPath) {
      CustSnackBar('Please upload medic signature');
      return;
    }
    let narrativeLength = props.narratives.getNarrativeLengthByID(
      assist.assistUserID,
    );
    let formObj = {
      id: uuidv4(),
      name: 'set ' + (narrativeLength + 1),
      epcrNum: assist.epcrNum,
      eventID: assist.eventID,
      assistUserID: assist.assistUserID,
      medicUserID: props.profile.profile.fbUserID,
      medicName: props.profile.profile.fullName,
      dateAndTime: moment().format(Constants.DATE_TIME_FORMAT),
      summary: summary,
      assessmentSummary: assessemntResult,
      treatmentsSummary: treatmentResult,
      cprSummary,
      consumables,
      causeOfDelay,
    };
    if (signImgPath) {
      formObj['medicSignature'] = signImgPath;
    }
    props.narratives.saveNarratives(formObj);
    goBack();
  };
  const goBack = () => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
  };
  const onChangeHandler = (value) => {
    setSummary(value);
  };
  const openSignature = () => {
    setShowSignature(true);
  };
  const onSignatureClose = () => {
    setShowSignature(false);
  };
  const onSignatureSave = () => {
    setShowSignature(false);
    setMedicSignImg(
      Constants.PROFILE_SIGN_PREFIX + props.profile.profile.fbUserID,
    );
  };
  const setMedicSignImg = (fileName) => {
    getImageUriFromStorage(Constants.STORAGE_PROFILE, fileName)
      .then((imageUri: any) => {
        setSignImgPath(imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const removeSignature = () => {
    setSignImgPath(undefined);
  };
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {showSignature && (
        <CustSignature
          fileName={
            Constants.PROFILE_SIGN_PREFIX + props.profile.profile.fbUserID
          }
          filePath={Constants.STORAGE_PROFILE}
          onClose={onSignatureClose}
          onSave={onSignatureSave}
        />
      )}
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
              <Text style={commonStyles.navigationText}>Narratives</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View>
              {/* <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  {
                    textAlign: 'center',
                    paddingBottom: boxModelSize.m,
                  },
                ]}>
                Narratives
              </Text> */}
              {isEditable && (
                <CustTextInput
                  label={'Narrative Summary'}
                  placeholder={'Narrative Notes'}
                  multiline={true}
                  onChangeText={onChangeHandler}
                  value={summary}
                  required
                />
              )}
            </View>
            <ScrollView>
              {!isEditable && (
                <View>
                  <View
                    style={[
                      styles.narrativeBox,
                      {paddingTop: boxModelSize.xl},
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.label}>Medic Name:</Text>
                      <Text style={commonStyles.formSubTitle}>
                        {narrative.medicName}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.label}>Date and Time:</Text>
                      <Text style={commonStyles.formSubTitle}>
                        {narrative.dateAndTime}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.narrativeBox}>
                    <Text style={commonStyles.formSubTitle}>Summary</Text>
                    <Text style={styles.summaryText}>{summary}</Text>
                  </View>
                </View>
              )}
              <View style={styles.narrativeBox}>
                <Text style={commonStyles.formSubTitle}>
                  Assessment Summary
                </Text>
                <Text style={styles.summaryText}>
                  {assessemntResult}
                  {'\n\n'}
                  {secAssessemntResult}
                </Text>
              </View>
              <View style={styles.narrativeBox}>
                <Text style={commonStyles.formSubTitle}>
                  Treatments Summary
                </Text>
                <Text style={styles.summaryText}>{treatmentResult}</Text>
              </View>
              <View style={styles.narrativeBox}>
                <Text style={commonStyles.formSubTitle}>CPR Summary</Text>
                <Text style={styles.summaryText}>{cprSummary}</Text>
              </View>
              <View style={styles.narrativeBox}>
                <Text style={commonStyles.formSubTitle}>
                  Consumables (Non-Clinicalal)
                </Text>
                <Text style={styles.summaryText}>{consumables}</Text>
              </View>
              <View style={styles.narrativeBox}>
                <Text style={commonStyles.formSubTitle}>Cause of Delay</Text>
                <Text style={styles.summaryText}>{causeOfDelay}</Text>
              </View>
              {isEditable && !signImgPath && (
                <TouchableOpacity onPress={openSignature}>
                  <View style={[styles.medicSign, styles.narrativeBox]}>
                    <CustIcon
                      type="font-awesome-5"
                      name="file-signature"
                      size={30}
                      color={Colors.primary}
                    />
                    <Text style={styles.signLabel}>Medic Signature</Text>
                  </View>
                </TouchableOpacity>
              )}

              {signImgPath && (
                <View style={styles.signaturePicContainer}>
                  <Image
                    style={styles.signaturePic}
                    source={{
                      uri: signImgPath,
                    }}
                  />
                  {isEditable && (
                    <View style={styles.deleteButton}>
                      <TouchableOpacity onPress={removeSignature}>
                        <CustIcon
                          type="antdesign"
                          name="delete"
                          color={Colors.primary}
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              {isEditable && (
                <View>
                  <CustButton title="Submit" onPress={onSubmit} />
                </View>
              )}
            </ScrollView>
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
  narrativeBox: {
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
  summaryText: {
    borderWidth: 1,
    padding: scale(10),
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    backgroundColor: Colors.white,
    borderColor: Colors.borderGrey,
    borderRadius: scale(10),
  },
  medicSign: {
    padding: boxModelSize.m,
    minHeight: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signLabel: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    marginTop: boxModelSize.m,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  signaturePicContainer: {
    backgroundColor: Colors.backgroundwhite,
    borderRadius: scale(10),
    marginBottom: boxModelSize.m,
    height: scale(120),
    padding: boxModelSize.s,
  },
  signaturePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: boxModelSize.m,
    bottom: boxModelSize.m,
  },
});

export default inject(
  'treatmentStore',
  'assessmentStore',
  'narratives',
  'assistRequests',
  'profile',
)(observer(NarrativesNotes));
