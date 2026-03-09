import {inject, observer} from 'mobx-react';
import React, {FC, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import {EPCRCard} from '../components';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';
import {moveArrayItem} from '../core/utils';

interface EPCRCardsProps {
  assistRequests?: any;
  dataRefresh?: boolean;
  onTapInfo?: (index) => void;
  onProfileChange?: (assistObj) => void;
  displayType: 'whiteBox' | 'profileRound';
  showEPCR?: boolean;
}
const screenWidth = Dimensions.get('screen').width;
const EPCRCards: FC<EPCRCardsProps> = (props) => {
  const {
    onTapInfo,
    onProfileChange,
    displayType,
    showEPCR,
    dataRefresh,
  } = props;
  const [assistName, setAssistName] = useState<string>('');
  const [epcrNum, setEPCRNum] = useState<number>(0);
  const [requestType, setRequestType] = useState<string>('');
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (dataRefresh) {
      if (props.assistRequests.selectedProfile) {
        let tempArr = [];
        props.assistRequests.familyList.forEach((item, index) => {
          if (item.assistUserID == props.assistRequests.selectedProfile)
            tempArr = moveArrayItem(
              [...props.assistRequests.familyList],
              index,
              0,
            );
        });
        setDataSource([]);
        setTimeout(() => {
          setDataSource(tempArr);
          onProfileChange(tempArr[0]);
        }, 200);
      } else {
        setDataSource(props.assistRequests.familyList);
        onProfileChange(props.assistRequests.familyList[0]);
      }
    }
  }, [dataRefresh]);
  useEffect(() => {
    if (dataSource.length > 0) {
      setRequestType(dataSource[0].requesterType);
      setEPCRNum(dataSource[0].epcrNum);
      setAssistName(dataSource[0].fullName);
    }
  }, [dataSource]);
  const displayProfileName = (index) => {
    setAssistName(dataSource[index].fullName);
    setEPCRNum(dataSource[index].epcrNum);
    onProfileChange(dataSource[index]);
    props.assistRequests.setAssistSelection(dataSource[index].assistUserID);
  };

  if (dataSource.length > 0) {
    return (
      <View style={styles.container}>
        <Carousel
          data={dataSource}
          renderItem={(rec) => (
            <EPCRCard
              id={rec.item.assistUserID}
              epcrNumber={rec.item.epcrNum}
              pic={rec.item.profilePicUri}
              name={rec.item.fullName}
              gender={rec.item.gender}
              age={rec.item.age}
              desc={rec.item.desc}
              displayType={displayType}
              onTapInfo={onTapInfo}
            />
          )}
          sliderWidth={screenWidth}
          itemWidth={screenWidth / 1.6}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={{
            paddingVertical: displayType == 'whiteBox' ? scale(10) : scale(0),
          }}
          useScrollView={true}
          layout={displayType == 'whiteBox' ? 'tinder' : 'stack'}
          onSnapToItem={displayProfileName}
          loop={true}
        />
        {displayType == 'profileRound' && (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.name}>{assistName}</Text>
            <Text style={styles.label}>{requestType}</Text>
            {showEPCR && <Text style={styles.epcrNo}>{'EPCR ' + epcrNum}</Text>}
          </View>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {displayType == 'profileRound' && (
          <ActivityIndicator size="large" color={Colors.white} />
        )}
        {displayType == 'whiteBox' && (
          <View style={{width: screenWidth, alignItems: 'center'}}>
            <View
              style={[
                styles.card,
                commonStyles.whiteBoxShadow,
                {width: screenWidth / 1.6},
              ]}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  card: {
    borderRadius: scale(10),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    marginBottom: boxModelSize.m,
    paddingTop: boxModelSize.m,
    paddingBottom: boxModelSize.m,
  },
  slider: {
    overflow: 'visible',
  },
  name: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.default,
    color: Colors.white,
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.white,
    fontSize: scale(9),
    marginTop: scale(-5),
  },
  epcrNo: {
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h5,
  },
});

export default inject('assistRequests')(observer(EPCRCards));
