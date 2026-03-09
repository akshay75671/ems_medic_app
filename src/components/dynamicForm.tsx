import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {
  CustTextInput,
  CustButton,
  CustDataPicker,
  PhoneNumber,
  CustSwitch,
  DateAndTimePicker,
  CustRadio,
  CustSpinnerInput,
} from '.';
import {useForm, Controller} from 'react-hook-form';
// You can import from local files
import mdlProfile from '../model/mdlProfile.json';
import {boxModelSize, commonStyles} from '../styles';
import CustomSwitchTab from './customSwitchTab';
import SegmentedTab from './segmentedTab';
import {debug} from 'react-native-reanimated';
import {scale} from 'react-native-size-matters';

interface dynamicFormProps {
  onSubmit: (data: any) => void;
  onSwitchChange?: (name: string, val: boolean, formData: any) => void;
  setValues?: any;
  formJson: any[];
}
export default function DynamicForm(props: dynamicFormProps) {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    errors,
    formState,
  } = useForm();
  const {setValues} = props;
  const onSubmit = (data) => {
    formState.isValid ? props.onSubmit(data) : props.onSubmit(null);
  };
  const handleRadioClick = (data) => {
    props.onSwitchChange(data, true, null);
  };
  const onSwitchChange = (name: string, value: boolean) => {
    setValue(name, value);
    props.onSwitchChange(name, value, getValues());
  };
  const handleTabChange = (value: string) => {
    console.log('switch tab', value);
  };
  useEffect(() => {
    if (setValues && Object.keys(setValues).length > 0) {
      Object.keys(setValues).map((field, index) => {
        setValue(field, setValues[field]);
      });
    }
  }, [setValues]);
  const getPadding = (items: number, item: number) => {
    let retVal: any = {};
    if (items > 1) {
      if (item == 1) retVal['paddingLeft'] = boxModelSize.s;
      else if (items / item == 1) retVal['paddingRight'] = boxModelSize.s;
      else if (items / item > 1) {
        retVal['paddingRight'] = boxModelSize.s;
      }
    } else {
      retVal['paddingLeft'] = boxModelSize.s;
      retVal['paddingRight'] = boxModelSize.s;
    }
    return retVal;
  };

  var vForm = (
    <View>
      {props.formJson &&
        props.formJson.map((items: Array<any>, main) => {
          return (
            <View
              key={'controlContainer_' + main}
              style={{flexDirection: 'row'}}>
              {items.map((option, index) => {
                if (option.type == 'input') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {flex: 1 / items.length},
                        getPadding(items.length, index),
                      ]}>
                      <Controller
                        name={option.name}
                        control={control}
                        defaultValue={''}
                        rules={option.validation}
                        render={(props) => (
                          <CustTextInput
                            label={option.label}
                            value={props.value}
                            placeholder={option.placeholder}
                            required={
                              option?.validation?.required ? true : false
                            }
                            multiline={option.multiline}
                            numberOfLines={option.numberOfLines}
                            onChangeText={(value) => props.onChange(value)}
                            errorText={
                              errors[option.name]
                                ? errors[option.name].message
                                : null
                            }
                          />
                        )}
                      />
                    </View>
                  );
                } else if (option.type == 'picker') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {flex: 1 / items.length},
                        getPadding(items.length, index),
                      ]}>
                      <Controller
                        key={option.name + '_' + index}
                        name={option.name}
                        control={control}
                        defaultValue={''}
                        rules={option.validation}
                        render={(props) => (
                          <CustDataPicker
                            items={option.pickerItems}
                            label={option.label}
                            required={
                              option?.validation?.required ? true : false
                            }
                            onChangeText={(value) => props.onChange(value)}
                            errorText={
                              errors[option.name]
                                ? errors[option.name].message
                                : null
                            }
                            value={props.value}
                            placeholder={option.placeholder}
                          />
                        )}
                      />
                    </View>
                  );
                } else if (option.type == 'phone') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {flex: 1 / items.length},
                        getPadding(items.length, index),
                      ]}>
                      <Controller
                        key={option.name + '_' + index}
                        name={option.name}
                        control={control}
                        defaultValue={''}
                        rules={option.validation}
                        render={(props) => (
                          <PhoneNumber
                            label={option.label}
                            placeholder={option.placeholder}
                            onChangeText={(value) => props.onChange(value)}
                            required={
                              option?.validation?.required ? true : false
                            }
                            errorText={
                              errors[option.name]
                                ? errors[option.name].message
                                : null
                            }
                            value={props.value}
                            code="91"
                            phonecode
                          />
                        )}
                      />
                    </View>
                  );
                } else if (option.type == 'date') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {flex: 1 / items.length},
                        getPadding(items.length, index),
                      ]}>
                      <Controller
                        key={option.name + '_' + index}
                        name={option.name}
                        control={control}
                        defaultValue={''}
                        rules={option.validation}
                        render={(props) => (
                          <DateAndTimePicker
                            label={option.label}
                            placeholder="Choose a Date"
                            required={
                              option?.validation?.required ? true : false
                            }
                            onChangeText={(value) => props.onChange(value)}
                            errorText={
                              errors[option.name]
                                ? errors[option.name].message
                                : null
                            }
                            value={props.value}
                            info="Age: 0"
                          />
                        )}
                      />
                    </View>
                  );
                } else if (option.type == 'heading') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {flex: 1 / items.length},
                        getPadding(items.length, index),
                      ]}>
                      <Text style={commonStyles.formSubTitle}>
                        {option.label}
                      </Text>
                    </View>
                  );
                } else if (option.type == 'switch') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {
                          flex: 1 / items.length,
                          flexDirection: 'row',
                          marginBottom: boxModelSize.l,
                        },
                        getPadding(items.length, index),
                      ]}>
                      <View style={{flex: 0.8}}>
                        <Text style={commonStyles.defaultBodyText}>
                          {option.label}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Controller
                          key={option.name + '_' + index}
                          name={option.name}
                          control={control}
                          defaultValue={false}
                          rules={option.validation}
                          render={(props) => (
                            <CustSwitch
                              isOnOrOff={props.value}
                              isEnabled={true}
                              onSelect={onSwitchChange.bind(this, option.name)}
                            />
                          )}
                        />
                      </View>
                    </View>
                  );
                } else if (option.type == 'segmentedTab') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {
                          flex: 1 / items.length,
                          flexDirection: 'row',
                          marginBottom: boxModelSize.l,
                        },
                        getPadding(items.length, index),
                      ]}>
                      <View style={{flex: 0.7}}>
                        <Text style={commonStyles.defaultBodyText}>
                          {option.label}
                        </Text>
                      </View>
                      <View style={{flex: 0.3}}>
                        <View>
                          <SegmentedTab
                            tabValue={option.tabvalue}
                            handleTabChange={handleTabChange}
                            defaultSelectedTab={
                              option.defaultSelectedTab === 'No' ? 1 : 0
                            }
                            tabSize={'small'}
                          />
                        </View>
                      </View>
                    </View>
                  );
                } else if (option.type == 'radio') {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {
                          flex: 1 / items.length,
                          flexDirection: 'row',
                          marginBottom: boxModelSize.l,
                        },
                        getPadding(items.length, index),
                      ]}>
                      <View style={{flex: 1}}>
                        <Controller
                          key={option.name + '_' + index}
                          name={option.name}
                          control={control}
                          defaultValue={false}
                          rules={option.validation}
                          render={(props) => (
                            <CustRadio
                              required={
                                option?.validation?.required ? true : false
                              }
                              label={option.label}
                              isSelected={props.value}
                              radioValues={option.radioValues}
                              onSelect={handleRadioClick}
                              errorText={
                                errors[option.name]
                                  ? errors[option.name].message
                                  : null
                              }
                            />
                          )}
                        />
                      </View>
                    </View>
                  );
                } else if (option.type == 'spinnerInput') {
                  // return (
                  //   <View
                  //     key={'control_' + index}
                  //     style={[
                  //       {
                  //         flex: 1 / items.length,
                  //         flexDirection: 'row',
                  //         marginBottom: boxModelSize.l,
                  //         backgroundColor:"#fff",
                  //         padding: scale(10),
                  //         borderRadius: 5
                  //       },
                  //       commonStyles.whiteBoxShadow,
                  //       getPadding(items.length, index),
                  //     ]}>
                  //     <View style={{flex: 1}}>
                  //       <Controller
                  //         key={option.name + '_' + index}
                  //         name={option.name}
                  //         control={control}
                  //         defaultValue={false}
                  //         rules={option.validation}
                  //         render={(props) => (
                  //           <CustSpinnerInput
                  //             label={option.label}
                  //             spinnerValues={option.spinnerValues}
                  //             onSelect={handleRadioClick}
                  //           />
                  //         )}
                  //       />
                  //     </View>
                  //   </View>
                  // );
                } else {
                  return (
                    <View
                      key={'control_' + index}
                      style={[
                        {flex: 1 / items.length},
                        getPadding(items.length, index),
                      ]}>
                      <Text>
                        {option.name +
                          '- type: ' +
                          option.name +
                          ' not handled for dynamic form'}
                      </Text>
                    </View>
                  );
                }
              })}
            </View>
          );
        })}

      <CustButton title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
  return vForm;
}
