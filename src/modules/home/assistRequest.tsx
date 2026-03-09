import React, {FC, useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import Avatar from '../../components/Avatar';
import {boxModelSize, Colors, Fonts, fontSize} from '../../styles';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {FlatList} from 'react-native-gesture-handler';
import {observer, inject} from 'mobx-react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../types/navigationsTypes';
import {useFocusEffect} from '@react-navigation/native';
import {ProgressBar} from '../../components';

const RequestCard = ({props, data, onAccept, onReject}) => {
  return (
    <View style={{padding: scale(20.0)}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.5}}>
          <Avatar size={scale(70)} source={data.item.profilePicUri} />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.name}>{data.item.fullName}</Text>
          <View style={{marginTop: scale(3)}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>{data.item.gender + ', '}</Text>
              <Text style={styles.label}>{data.item.age + ' Yrs'}</Text>
            </View>
            <Text style={styles.label}>{data.item.distance}</Text>
          </View>
        </View>
      </View>
      <View style={{marginTop: scale(12)}}>
        <Text style={styles.label}>{data.item.desc}</Text>
      </View>
      {data.item.requesterType == 'Family Member' && (
        <View style={{flexDirection: 'row', marginTop: scale(5)}}>
          {props.assistRequests.familyFirst.map((item, index) => (
            <View
              style={{marginRight: boxModelSize.s}}
              key={'profilePic' + index}>
              <Avatar source={item.profilePicUri} size={scale(30)} />
            </View>
          ))}
        </View>
      )}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onAccept(data.item.assistUserID);
          }}>
          <FeatherIcon name="check" color="#fff" size={scale(25)} />
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {backgroundColor: Colors.requestRejectBG},
          ]}
          onPress={() => {
            onReject(data.item.assistUserID);
          }}>
          <FeatherIcon name="x" color="#fff" size={scale(25)} />
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#fff',
        opacity: 0.2,
      }}></View>
  );
};
type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
interface propsTypes {
  navigation: drawerNavigationProp;
  assistRequests?: any;
}

const AssistRequest: FC<propsTypes> = (props) => {
  const [screenFocused, setScreenFocused] = useState<boolean>(false);
  const onClose = () => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
  };
  const acceptRequest = (assistUserID) => {
    props.assistRequests.stopRequestListner();
    props.assistRequests.stopHandoverListner();
    props.assistRequests.generateEpcrNumToAssistUser(assistUserID, undefined);
  };
  const rejectRequest = (assistUserID) => {
    props.assistRequests.removeRequest(assistUserID);
  };
  useEffect(() => {
    if (screenFocused)
      if (props.assistRequests.isEPCRgenerated)
        props.navigation.navigate('EnRoute');
  }, [props.assistRequests.isEPCRgenerated]);
  useEffect(() => {
    if (screenFocused)
      if (
        props.assistRequests.assistRequests.length == 0 &&
        !props.assistRequests.isEPCRgenerated
      )
        if (props.navigation.canGoBack()) props.navigation.goBack();
  }, [props.assistRequests.assistRequests.length]);
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, []),
  );
  return (
    <View style={styles.container}>
      {props.assistRequests.loading && <ProgressBar />}
      <View style={{padding: scale(20)}}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <FeatherIcon name="x" color="#fff" size={scale(20)} />
          <Text style={[styles.actionButtonText, {marginLeft: scale(5)}]}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.header}>New Request From</Text>
      </View>
      <FlatList
        style={{padding: scale(10.0)}}
        data={props.assistRequests.assistRequests}
        ItemSeparatorComponent={FlatListItemSeparator}
        keyExtractor={(item: any) => item.assistUserID}
        renderItem={(rec) => (
          <RequestCard
            key={rec.item.toString()}
            props={props}
            data={rec}
            onAccept={acceptRequest}
            onReject={rejectRequest}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  closeButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  header: {
    fontFamily: Fonts.primaryMedium,
    fontSize: fontSize.h5,
    color: Colors.bodyTextWhite,
    textAlign: 'center',
    opacity: 0.7,
  },
  name: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h4,
    color: Colors.bodyTextWhite,
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextWhite,
  },
  actionButtonText: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextWhite,
    fontSize: fontSize.h5,
    marginLeft: boxModelSize.m,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    marginTop: boxModelSize.m,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    flexDirection: 'row',
    padding: boxModelSize.s,
    paddingHorizontal: boxModelSize.m,
    backgroundColor: Colors.requestAcceptBG,
    borderRadius: scale(5),
    alignItems: 'center',
  },
});

export default inject('assistRequests')(observer(AssistRequest));
