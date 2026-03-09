import React, {
  FC,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {scale} from 'react-native-size-matters';

import Constants from '../core/constants';
import {
  CustIcon,
  CustomMultiPicker,
  CustTextInput,
  TimePicker,
  CustDataPicker,
  CustomSlider,
  Countdown,
} from '../components';
import {boxModelSize, Colors, commonStyles, Fonts} from '../styles';
import {filterObjectByKey} from '../core/utils';

type formProps = {
  header?: any;
  form: any;
  updateData: any;
  hideList: any;
  positionKey: [];
  goBack?: () => void;
  saveFormData: (userInput: any, hideList: any) => void;
  medicPersons?: any;
};

const DynamicForm2: FC<formProps> = (props) => {
  const scrollViewRef = useRef(null);

  const [capturedData, setCapturedData] = useState({});
  const [hideList, setHideList] = useState([]);

  const [groupPos, onGroupLayout] = useComponentSize();
  const [questionPos, onQuestionLayout] = useComponentSize();
  const [queryPos, onQueryLayout] = useComponentSize();

  useEffect(() => {
    setCapturedData(props.updateData);
    setHideList(props.hideList);
  }, [props.hideList, props.updateData]);

  useEffect(() => {
    if (
      (groupPos || secKeyExist('group') == false) &&
      (questionPos || secKeyExist('question') == false) &&
      (queryPos || secKeyExist('query') == false)
    ) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y:
          (groupPos?.y ?? 0.0) + (questionPos?.y ?? 0.0) + (queryPos?.y ?? 0.0),
        animated: true,
      });
    }
  }, [queryPos, questionPos, groupPos]);

  function captureInput(query, answer) {
    /*
     * Note : Get actual answer objects from raw answers list
     */
    var _answer = null;
    if (query.data[0].type == 's-select' || query.data[0].type == 'm-select') {
      _answer = answer.map(
        (val) => query.data.filter((opt) => opt.name == val)[0],
      );
    } else {
      _answer = query.data;
      _answer[0].value = answer;
    }

    /*
     * Note : Get 'Sections to hide' list for selected answer objects
     */
    var newStoH = Object.values(_answer).reduce(
      (prevVal: any, currentVal: any) =>
        currentVal?.sections_to_hide != null
          ? [...prevVal, ...currentVal?.sections_to_hide]
          : [...prevVal],
      [],
    );

    /*
     * Note : Check for datas getting removed for hidden sections
     */
    var _check = Object.values(newStoH).find((i) =>
      Object.keys(capturedData).find((j) => j.includes(i)),
    );

    if (_check == undefined) {
      saveData(query, newStoH, _answer);
    } else {
      Alert.alert(
        'Are you sure!',
        'Prior selected data would be removed.',
        [
          {
            text: 'Cancel',
            onPress: () => saveData(query, [], []),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => saveData(query, newStoH, _answer)},
        ],
        {cancelable: false},
      );
    }
  }

  function saveData(query, sectionsToHide, _answer) {
    /*
     * Note : Check and delete catpure data if answer is empty array
     */
    if (_answer?.length >= 1) {
      capturedData[query.id] = {answer: _answer};
    } else {
      delete capturedData[query.id];
    }

    /*
     * Note : Remove capture data of hidden section
     */
    var _capturedData = filterObjectByKey(capturedData, (key) =>
      Object.values(sectionsToHide).find((i: any) => key.includes(i)) ==
      undefined
        ? true
        : false,
    );

    setCapturedData(_capturedData);

    var _hide = [];
    var _show = [];

    Object.values(capturedData).map((j: any) =>
      j?.answer
        ?.map((i: any) => i?.sections_to_hide)
        ?.forEach((i) => (i ? (_hide = [..._hide, ...i]) : null)),
    );

    Object.values(capturedData).map((j: any) =>
      j?.answer
        ?.map((i: any) => i?.sections_to_show)
        ?.forEach((i) => (i ? (_show = [..._show, ...i]) : null)),
    );

    let _newHideList = [...new Set(_hide)];

    _show.forEach((i) => {
      _newHideList = _newHideList.filter((j) => j != i);
    });

    setHideList(_newHideList);

    props.saveFormData(_capturedData, _newHideList);
  }

  function handleBlur() {}

  const secKeyExist = (secKey) => {
    return props.positionKey?.some((pkey: string) => pkey.includes(secKey));
  };

  const keyExist = (key) => {
    return props.positionKey?.some((pkey) => pkey == key);
  };

  return (
    <View style={{flexShrink: 1}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor: 'transparent',
            borderBottomColor: Colors.borderGrey,
            borderWidth: 1,
          }}>
          <TouchableOpacity
            onPress={() => props.goBack()}
            style={{paddingRight: scale(15), paddingLeft: scale(15)}}>
            <CustIcon
              type="antdesign"
              size={scale(23)}
              color={Colors.primary}
              name="arrowleft"
            />
          </TouchableOpacity>
          <Text style={styles.title}>{props.form.name}</Text>
          <View style={{paddingRight: scale(15), paddingLeft: scale(15)}}>
            <CustIcon
              type="antdesign"
              size={scale(23)}
              color={'transparent'}
              name="arrowleft"
            />
          </View>
        </View>
        {props.header ? (
          <View
            style={{borderBottomWidth: 2, borderBottomColor: Colors.lightGrey}}>
            <Text style={{color: 'black', alignSelf: 'center', padding: 5}}>
              {props.header}
            </Text>
          </View>
        ) : null}
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={{flexShrink: 1, padding: boxModelSize.l}}>
        {props.form.data.map((group, index3) => {
          if (hideList.indexOf(group.id) != -1) {
            return null;
          }

          return (
            <View
              key={'group_' + index3}
              onLayout={keyExist('group_' + index3) ? onGroupLayout : null}>
              {group.name != '' ? (
                <Text style={styles.groupTitle}>{group.name}</Text>
              ) : null}
              {group.data.map((question, index4) => {
                if (hideList.indexOf(question.id) != -1) {
                  return null;
                }

                return (
                  <View
                    style={styles.questionSection}
                    key={'question_' + index4}
                    onLayout={
                      keyExist('question_' + index4) ? onQuestionLayout : null
                    }>
                    {question.name != '' ? (
                      <Text style={styles.questionTitle}>{question.name}</Text>
                    ) : null}
                    {question?.data?.map((query, index5) => {
                      if (hideList.indexOf(query.id) != -1) {
                        return null;
                      }

                      var opt = {};

                      query.data.map((i) => {
                        if (hideList.indexOf(i.id) == -1) {
                          opt[i.id] = i.name;
                        }
                      });

                      var defaultSelected = [];
                      var defaultControlValue = '';

                      if (
                        query.data[0].type == 's-select' ||
                        query.data[0].type == 'm-select'
                      ) {
                        if (
                          Object.keys(capturedData).indexOf(
                            query.id.toString(),
                          ) != -1
                        ) {
                          capturedData[query.id.toString()]?.answer?.forEach(
                            (rec) => {
                              defaultSelected.push(rec.name);
                            },
                          );
                        }
                      }

                      if (
                        query.data[0].type == 'tf-number' ||
                        query.data[0].type == 'tf-text' ||
                        query.data[0].type == 'time-picker' ||
                        query.data[0].type == 'data-picker' ||
                        query.data[0].type == 'slider' ||
                        query.data[0].type == 'countdown'
                      ) {
                        defaultControlValue =
                          capturedData[query.id.toString()]?.answer[0].value;
                      }

                      return (
                        <View
                          style={[
                            styles.querySection,
                            {borderTopWidth: index5 == 0 ? 0 : 1},
                          ]}
                          key={'query_' + index5}
                          onLayout={
                            keyExist('query_' + index5) ? onQueryLayout : null
                          }>
                          {query.name != '' ? (
                            <Text style={styles.queryTitle}>
                              {query.name}
                              {/* {'query_' + index4 + '_' + index5}  */}
                            </Text>
                          ) : null}

                          {query.data[0].type == 's-select' ||
                          query.data[0].type == 'm-select' ? (
                            <CustomMultiPicker
                              options={opt}
                              search={false}
                              multiple={
                                query.data[0].type == 'm-select' ? true : false
                              }
                              returnValue={'label'}
                              callback={(res) => {
                                captureInput(query, res);
                              }}
                              itemStyle={[
                                {backgroundColor: Colors.primary},
                                styles.optionItem,
                                styles.boxShadow,
                              ]}
                              unselectedItemStyle={[
                                {backgroundColor: Colors.white},
                                styles.optionItem,
                                styles.boxShadow,
                              ]}
                              iconColor={Colors.lightGrey}
                              unselectedIconColor={Colors.white}
                              iconSize={scale(20)}
                              showCloseIcon={false}
                              labelStyle={[
                                {
                                  color: Colors.white,
                                },
                                styles.label,
                              ]}
                              unselectedLabelStyle={[
                                {
                                  color: Colors.bodyTextGrey,
                                },
                                styles.label,
                              ]}
                              selectedIconName={'check-circle'}
                              unselectedIconName={'user'}
                              defaultSelected={defaultSelected}
                            />
                          ) : null}

                          {query.data[0].type == 'time-picker' ? (
                            <TimePicker
                              defaultValue={defaultControlValue}
                              callback={(res) => {
                                captureInput(query, res);
                              }}
                            />
                          ) : null}

                          {query.data[0].type == 'countdown' ? (
                            <Countdown
                              defaultValue={defaultControlValue}
                              initVal={query.data[0].init}
                              callback={(res) => {
                                captureInput(query, res);
                              }}
                            />
                          ) : null}

                          {query.data[0].type == 'slider' ? (
                            <CustomSlider
                              LRpadding={14}
                              selected={defaultControlValue}
                              max={query.data[0].max}
                              min={query.data[0].min}
                              onValueChange={(res) => {
                                captureInput(query, res);
                              }}
                              styles={{paddingBottom: 15}}
                            />
                          ) : null}

                          {query.data[0].type == 'data-picker' ? (
                            <CustDataPicker
                              items={props.medicPersons}
                              label={query.data[0].name}
                              placeholder="Select Medic"
                              //required
                              onChangeText={(res) => {
                                captureInput(query, res);
                              }}
                              onEndEditing={() => {}}
                              errorText={null}
                              value={defaultControlValue}
                            />
                          ) : null}
                          {query.data[0].type == 'tf-number' ||
                          query.data[0].type == 'tf-text' ? (
                            <CustTextInput
                              label={query.data[0].name}
                              placeholder={query.data[0].name}
                              onChangeText={(val) => captureInput(query, val)}
                              onEndEditing={handleBlur}
                              errorText={null}
                              value={defaultControlValue ?? null}
                              //autoCompleteType="name"
                              //textContentType="name"
                              keyboardType={
                                query.data[0].type == 'tf-number'
                                  ? 'number-pad'
                                  : 'name-phone-pad'
                              }
                            />
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        })}
        <View style={{height: 20.0}}></View>
      </ScrollView>
    </View>
  );
};

const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback((event) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setSize({x, y, width, height});
  }, []);

  return [size, onLayout];
};

const styles = StyleSheet.create({
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
  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: scale(13),
    paddingLeft: scale(10),
  },

  title: {
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
    fontSize: scale(16),
    paddingVertical: scale(10),
  },
  groupTitle: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.black,
    fontSize: scale(14),
    paddingVertical: scale(10),
  },
  questionSection: {
    paddingTop: scale(10),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Colors.lightGrey,
    marginBottom: scale(5),
  },
  querySection: {
    paddingTop: scale(10),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    borderColor: '#e4e4e4',
  },
  questionTitle: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: scale(14),
    paddingVertical: scale(5),
  },
  queryTitle: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.black,
    fontSize: scale(12),
  },
  optionItem: {
    padding: scale(10),
    marginBottom: scale(15),
    height: scale(40),
    flexDirection: 'row',
    borderRadius: scale(45),
  },
});

export default DynamicForm2;
