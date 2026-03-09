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
  BottomNavigation,
  CustButton,
  CustDataPicker,
  CustIcon,
  CustTextInput,
  TimePicker,
} from '../../../../components';
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
import Slider from '@react-native-community/slider';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

const lungSoundDDV: string[] = [
  'Clear',
  'Wheezing',
  'Stridor',
  'Diminished',
  'Absent',
  'Rhonchi',
  'Rales',
];
const pupilsDDV: string[] = [
  'Normal',
  'Dilated',
  'Constrict',
  'No Reaction',
  'Sluggish',
  'UTO',
];
const vitalsFormInit: any = {
  summary: {
    dateTime: {key: 'Time', value: '00:00'},
    medicName: {key: 'Taken By', value: ''},
    patientCondition: {key: 'Patient Condition', value: ''},
    gscScore: {key: 'GSC Score', value: '4'},
  },
  lungSound: {
    leftInspiration: {key: 'Left Inspiration', value: ''},
    rightInspiration: {key: 'Right Inspiration', value: ''},
    leftExpiration: {key: 'Left Expiration', value: ''},
    rightExpiration: {key: 'Right Expiration', value: ''},
  },
  respiration: {
    rate: {key: 'Rate', value: '1'},
    effort: {key: 'Effort', value: ''},
  },
  skin: {
    temperature: {key: 'Temperature', value: ''},
    color: {key: 'Color', value: ''},
    condition: {key: 'Condition', value: ''},
  },
  pupils: {
    leftPupils: {key: 'Left', value: ''},
    rightPupils: {key: 'Right', value: ''},
    leftAndRight: {key: 'Left and Right', value: ''},
    leftSize: {key: 'Right Size', value: '1'},
    rightSize: {key: 'Right Size', value: '1'},
  },
  bloodSugar: {
    bglReading: {key: 'BGL Reading', value: ''},
  },
  bloodPressure: {
    sys: {key: 'SYS', value: ''},
    dia: {key: 'DIA', value: ''},
  },
  pulse: {
    pulseRate: {key: 'Rate', value: ''},
    quality: {key: 'Quality', value: ''},
  },
  pulseOximetry: {
    spo2: {key: 'SPO2', value: ''},
    airSource: {key: 'Air Source', value: ''},
  },
  temperature: {
    degrees: {key: 'Degrees', value: ''},
  },
  carbonMonoxide: {
    spco: {key: 'SPCO', value: ''},
  },
  carbonDioxide: {
    etco2: {key: 'ETCO2', value: ''},
  },
};

type stackNavigationProp = StackNavigationProp<VitalParamList>;
type navigationProps = {
  navigation: stackNavigationProp;
  vitals: any;
  medicProviders: any;
  assistRequests: any;
  profile: any;
};

const AddVitals: FC<navigationProps> = (props) => {
  const [vitalsForm, setVitalsForm] = useState<any>(
    JSON.parse(JSON.stringify(vitalsFormInit)),
  );
  const [assist, setAssist] = useState<any>(null);
  const [qualityDisabled, setQualityDisabled] = useState<boolean>(true);
  const [formDisabled, setFormDisabled] = useState<boolean>(true);
  const [formButtonsDisabled, setFormButtonsDisabled] = useState<boolean>(
    false,
  );

  const [medicPersons, setMedicPersons] = useState([]);
  useEffect(() => {
    props.medicProviders.medics.map((medicRec) => {
      setMedicPersons([...medicPersons, medicRec.name]);
    });
  }, [props.medicProviders.medics]);
  useEffect(() => {
    setAssist(
      props.assistRequests.getFamilyMemberObject(
        props.assistRequests.selectedProfile,
      ),
    );
  }, []);
  const goBack = () => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
  };
  const handleChangeText = (group, key, value) => {
    //console.log(group, key, value);
    storeValue(group, key, value);
  };
  const handleBlur = (group, key, value) => {
    //storeValue(group, key, value);
  };
  const storeValue = (group, key, value) => {
    try {
      let form = {...vitalsForm};
      form[group][key].value = value;
      setVitalsForm(form);
    } catch (error) {
      console.log(error.message);
    }
  };
  const onSetToNormal = (group) => {
    try {
      let form = {...vitalsForm};
      form[group] = vitalsFormInit[group];
      setVitalsForm(form);
    } catch (error) {
      console.log(error.message);
    }
  };
  const onUTOClick = (group, keyArr) => {
    try {
      for (let index in keyArr) {
        let form = {...vitalsForm};
        form[group][keyArr[index]].value = 'UTO';
        setVitalsForm(form);
      }
    } catch (error) {
      console.log(error.message);
    }
    if (group == 'pulse') setQualityDisabled(false);
  };
  const disableVitalsForm = () => {
    setFormDisabled(false);
    setFormButtonsDisabled(false);
  };
  const submitVitalsForm = () => {
    let vitalsLength = props.vitals.getVitalsLengthByID(assist.assistUserID);
    let formObj = {
      id: uuidv4(),
      name: 'set ' + (vitalsLength + 1),
      epcrNum: assist.epcrNum,
      eventID: assist.eventID,
      assistUserID: assist.assistUserID,
      medicUserID: props.profile.profile.fbUserID,
      medicName: props.profile.profile.fullName,
      dateAndTime: moment().format(Constants.DATE_TIME_FORMAT),
      vitalsData: vitalsForm,
    };
    props.vitals.saveVitals(formObj);
    goBack();
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
              <Text style={commonStyles.navigationText}>Add Vitals</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={{borderRadius: Constants.BOX_REDIUS}}>
              <View style={styles.vitalsBox}>
                <View style={styles.vitalSectionBox}>
                  <View style={styles.buttonMaster}>
                    <View style={styles.innerContainer}>
                      <View style={styles.buttonContainer}>
                        <CustButton
                          title="Refused"
                          onPress={disableVitalsForm}
                        />
                      </View>
                      <View style={styles.buttonContainer}>
                        <CustButton title="UTO" onPress={disableVitalsForm} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Summary</Text>
                <View style={styles.vitalSectionBox}>
                  <TimePicker
                    callback={handleChangeText.bind(
                      this,
                      'summary',
                      'dateTime',
                    )}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={medicPersons}
                    label="Taken By"
                    placeholder="Select Medic"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'summary',
                      'medicName',
                    )}
                    onEndEditing={handleBlur.bind(this, 'summary', 'medicName')}
                    value={vitalsForm.summary.medicName.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={[
                      'Critical',
                      'Unstable',
                      'Potentially Unstable',
                      'Stable',
                    ]}
                    label="Patient Condition"
                    placeholder="Select Patient Condition"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'summary',
                      'patientCondition',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'summary',
                      'patientCondition',
                    )}
                    value={vitalsForm.summary.patientCondition.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="GSC Score"
                    placeholder="GSC Score"
                    onChangeText={handleChangeText.bind(
                      this,
                      'summary',
                      'gscScore',
                    )}
                    onEndEditing={handleBlur.bind(this, 'summary', 'gscScore')}
                    errorText={null}
                    value={vitalsForm.summary.gscScore.value}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Lung Sound</Text>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={lungSoundDDV}
                    label="Left Inspiration"
                    placeholder="Select Left Inspiration"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'lungSound',
                      'leftInspiration',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'lungSound',
                      'leftInspiration',
                    )}
                    value={vitalsForm.lungSound.leftInspiration.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={lungSoundDDV}
                    label="Right Inspiration"
                    placeholder="Select Right Inspiration"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'lungSound',
                      'rightInspiration',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'lungSound',
                      'rightInspiration',
                    )}
                    value={vitalsForm.lungSound.rightInspiration.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={lungSoundDDV}
                    label="Left Expiration"
                    placeholder="Select Left Expiration"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'lungSound',
                      'leftExpiration',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'lungSound',
                      'leftExpiration',
                    )}
                    value={vitalsForm.lungSound.leftExpiration.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={lungSoundDDV}
                    label="Right Expiration"
                    placeholder="Select Right Expiration"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'lungSound',
                      'rightExpiration',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'lungSound',
                      'rightExpiration',
                    )}
                    value={vitalsForm.lungSound.rightExpiration.value}
                  />
                </View>
                <View>
                  <CustButton
                    title="Set to normal"
                    onPress={onSetToNormal.bind(this, 'lungSound')}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Respiration</Text>
                <View style={styles.vitalSectionBox}>
                  <Text style={styles.labelDefault}>Rate</Text>
                  <Text style={[styles.assistName, {textAlign: 'center'}]}>
                    {vitalsForm.respiration.rate.value}
                  </Text>
                  <Slider
                    disabled={formButtonsDisabled}
                    style={{
                      width: '100%',
                      height: 25,
                    }}
                    minimumValue={1}
                    maximumValue={9}
                    step={1}
                    onValueChange={handleChangeText.bind(
                      this,
                      'respiration',
                      'rate',
                    )}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.assistName,
                        {textAlign: 'center', paddingLeft: boxModelSize.s},
                      ]}>
                      1
                    </Text>
                    <Text
                      style={[
                        styles.assistName,
                        {textAlign: 'center', paddingRight: boxModelSize.m},
                      ]}>
                      9
                    </Text>
                  </View>
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={['Regular', 'Shallow', 'Labored']}
                    label="Effort"
                    placeholder="Select Effort"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'respiration',
                      'effort',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'respiration',
                      'effort',
                    )}
                    value={vitalsForm.respiration.effort.value}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Skin</Text>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={['Normal', 'Warm', 'Cold', 'Cool', 'Hot']}
                    label="Temperature"
                    placeholder="Select Temperature"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'skin',
                      'temperature',
                    )}
                    onEndEditing={handleBlur.bind(this, 'skin', 'temperature')}
                    value={vitalsForm.skin.temperature.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={[
                      'Normal',
                      'Cyanotic',
                      'Flushed',
                      'Pale',
                      'Ashen',
                      'Jaundiced',
                    ]}
                    label="Color"
                    placeholder="Select Color"
                    errorText={null}
                    onChangeText={handleChangeText.bind(this, 'skin', 'color')}
                    onEndEditing={handleBlur.bind(this, 'skin', 'color')}
                    value={vitalsForm.skin.color.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={['Normal', 'Diaphoretic', 'Moist', 'Dry']}
                    label="Condition"
                    placeholder="Select Condition"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'skin',
                      'condition',
                    )}
                    onEndEditing={handleBlur.bind(this, 'skin', 'condition')}
                    value={vitalsForm.skin.condition.value}
                  />
                </View>
                <View>
                  <CustButton
                    title="Set to normal"
                    onPress={onSetToNormal.bind(this, 'skin')}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Blood Sugar</Text>
                <View style={styles.vitalSectionBox}>
                  <View style={styles.innerContainer}>
                    <View style={{width: '70%'}}>
                      <CustTextInput
                        editable={formDisabled}
                        label="BGL Reading"
                        placeholder="Enter BGL Reading"
                        onChangeText={handleChangeText.bind(
                          this,
                          'bloodSugar',
                          'bglReading',
                        )}
                        onEndEditing={handleBlur.bind(
                          this,
                          'bloodSugar',
                          'bglReading',
                        )}
                        errorText={null}
                        value={vitalsForm.bloodSugar.bglReading.value}
                      />
                    </View>
                    <View style={{width: '30%'}}>
                      <CustButton
                        disabled={formButtonsDisabled}
                        title="UTO"
                        onPress={onUTOClick.bind(this, 'bloodSugar', [
                          'bglReading',
                        ])}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Pupils</Text>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={pupilsDDV}
                    label="Left"
                    placeholder="Select Left"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'pupils',
                      'leftPupils',
                    )}
                    onEndEditing={handleBlur.bind(this, 'pupils', 'leftPupils')}
                    value={vitalsForm.pupils.leftPupils.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={pupilsDDV}
                    label="Right"
                    placeholder="Select Right"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'pupils',
                      'rightPupils',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'pupils',
                      'rightPupils',
                    )}
                    value={vitalsForm.pupils.rightPupils.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={pupilsDDV}
                    label="Left and Right"
                    placeholder="Select Left and Right"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'pupils',
                      'leftAndRight',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'pupils',
                      'leftAndRight',
                    )}
                    value={vitalsForm.pupils.leftAndRight.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <Text style={styles.labelDefault}>Left Size</Text>
                  <Text style={[styles.assistName, {textAlign: 'center'}]}>
                    {vitalsForm.pupils.leftSize.value}
                  </Text>
                  <Slider
                    disabled={formButtonsDisabled}
                    style={{
                      width: '100%',
                      height: 25,
                    }}
                    minimumValue={1}
                    maximumValue={9}
                    step={1}
                    onValueChange={handleChangeText.bind(
                      this,
                      'pupils',
                      'leftSize',
                    )}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.assistName,
                        {textAlign: 'center', paddingLeft: boxModelSize.s},
                      ]}>
                      1
                    </Text>
                    <Text
                      style={[
                        styles.assistName,
                        {textAlign: 'center', paddingRight: boxModelSize.m},
                      ]}>
                      9
                    </Text>
                  </View>
                </View>
                <View style={styles.vitalSectionBox}>
                  <Text style={styles.labelDefault}>Right Size</Text>
                  <Text style={[styles.assistName, {textAlign: 'center'}]}>
                    {vitalsForm.pupils.rightSize.value}
                  </Text>
                  <Slider
                    disabled={formButtonsDisabled}
                    style={{
                      width: '100%',
                      height: 25,
                    }}
                    minimumValue={1}
                    maximumValue={9}
                    step={1}
                    onValueChange={handleChangeText.bind(
                      this,
                      'pupils',
                      'rightSize',
                    )}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.assistName,
                        {textAlign: 'center', paddingLeft: boxModelSize.s},
                      ]}>
                      1
                    </Text>
                    <Text
                      style={[
                        styles.assistName,
                        {textAlign: 'center', paddingRight: boxModelSize.m},
                      ]}>
                      9
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Blood Pressure</Text>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="SYS"
                    placeholder="Enter SYS"
                    onChangeText={handleChangeText.bind(
                      this,
                      'bloodPressure',
                      'sys',
                    )}
                    onEndEditing={handleBlur.bind(this, 'bloodPressure', 'sys')}
                    errorText={null}
                    value={vitalsForm.bloodPressure.sys.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="DIA"
                    placeholder="Enter DIA"
                    onChangeText={handleChangeText.bind(
                      this,
                      'bloodPressure',
                      'dia',
                    )}
                    onEndEditing={handleBlur.bind(this, 'bloodPressure', 'dia')}
                    errorText={null}
                    value={vitalsForm.bloodPressure.dia.value}
                  />
                </View>
                <View style={styles.innerContainer}>
                  <View style={styles.buttonContainer}>
                    <CustButton
                      disabled={formButtonsDisabled}
                      title="PALP"
                      onPress={() => {}}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <CustButton
                      disabled={formButtonsDisabled}
                      title="UTO"
                      onPress={onUTOClick.bind(this, 'bloodPressure', [
                        'sys',
                        'dia',
                      ])}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Pulse</Text>
                <View style={styles.vitalSectionBox}>
                  <View style={styles.innerContainer}>
                    <View style={{width: '70%'}}>
                      <CustTextInput
                        editable={formDisabled}
                        label="Rate"
                        placeholder="Enter Pulse Rate"
                        onChangeText={handleChangeText.bind(
                          this,
                          'pulse',
                          'pulseRate',
                        )}
                        onEndEditing={handleBlur.bind(
                          this,
                          'pulse',
                          'pulseRate',
                        )}
                        errorText={null}
                        value={vitalsForm.pulse.pulseRate.value}
                      />
                    </View>
                    <View style={{width: '30%'}}>
                      <CustButton
                        disabled={formButtonsDisabled}
                        title="UTO"
                        onPress={onUTOClick.bind(this, 'pulse', ['pulseRate'])}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    items={['Regular', 'Irregular']}
                    label="Quality"
                    placeholder="Select Quality"
                    errorText={null}
                    editable={qualityDisabled || formDisabled}
                    onChangeText={handleChangeText.bind(
                      this,
                      'pulse',
                      'quality',
                    )}
                    onEndEditing={handleBlur.bind(this, 'pulse', 'quality')}
                    value={vitalsForm.pulse.quality.value}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Pulse Oximetry</Text>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="SPO2"
                    placeholder="Enter SPO2"
                    onChangeText={handleChangeText.bind(
                      this,
                      'pulseOximetry',
                      'spo2',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'pulseOximetry',
                      'spo2',
                    )}
                    errorText={null}
                    value={vitalsForm.pulseOximetry.spo2.value}
                  />
                </View>
                <View style={styles.vitalSectionBox}>
                  <CustDataPicker
                    editable={formDisabled}
                    items={['ORA', 'WO2']}
                    label="Air Source"
                    placeholder="Select Air Source"
                    errorText={null}
                    onChangeText={handleChangeText.bind(
                      this,
                      'pulseOximetry',
                      'airSource',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'pulseOximetry',
                      'airSource',
                    )}
                    value={vitalsForm.pulseOximetry.airSource.value}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Temperature</Text>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="Degrees"
                    placeholder="Enter Degrees"
                    onChangeText={handleChangeText.bind(
                      this,
                      'temperature',
                      'degrees',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'temperature',
                      'degrees',
                    )}
                    errorText={null}
                    value={vitalsForm.temperature.degrees.value}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Carbon Monoxide</Text>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="SPCO"
                    placeholder="Enter SPCO"
                    onChangeText={handleChangeText.bind(
                      this,
                      'carbonMonoxide',
                      'spco',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'carbonMonoxide',
                      'spco',
                    )}
                    errorText={null}
                    value={vitalsForm.carbonMonoxide.spco.value}
                  />
                </View>
              </View>
              <View style={styles.vitalsBox}>
                <Text style={commonStyles.formSubTitle}>Carbon Dioxide</Text>
                <View style={styles.vitalSectionBox}>
                  <CustTextInput
                    editable={formDisabled}
                    label="ETCO2"
                    placeholder="Enter ETCO2"
                    onChangeText={handleChangeText.bind(
                      this,
                      'carbonDioxide',
                      'etco2',
                    )}
                    onEndEditing={handleBlur.bind(
                      this,
                      'carbonDioxide',
                      'etco2',
                    )}
                    errorText={null}
                    value={vitalsForm.carbonDioxide.etco2.value}
                  />
                </View>
              </View>
              <View>
                <CustButton title="Submit" onPress={submitVitalsForm} />
              </View>
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
  assistName: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.default,
    marginLeft: boxModelSize.s,
  },
  medicName: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.mainMenuButtonText,
  },
  vitalsBox: {
    backgroundColor: Colors.lightGrey,
    padding: boxModelSize.m,
    marginBottom: boxModelSize.l,
    borderRadius: scale(10),
  },
  labelDefault: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: fontSize.h6,
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
  },
  buttonMaster: {},
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '50%',
  },
});

export default inject(
  'vitals',
  'medicProviders',
  'assistRequests',
  'profile',
)(observer(AddVitals));
