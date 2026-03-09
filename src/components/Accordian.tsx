import React, { FC, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts } from '../styles';
import { scale } from 'react-native-size-matters';

interface custAccordianProps {
  data: any[];
  title: string;
}
const Accordian: FC<custAccordianProps> = (props) => {
  const [expanded, setExpanded] = useState<boolean>();
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  return (
    <View>
      <TouchableOpacity
        style={expanded ? styles.expandedRow : styles.row}
        onPress={toggleExpand}>
        <Text style={[styles.title]}>{props.title}</Text>
        <Icon
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={30}
          color={'gray'}
        />
      </TouchableOpacity>
      <View style={styles.parentHr} />
      {expanded && (
        <View style={styles.childRow}>
          <FlatList
            data={props.data}
            numColumns={1}
            scrollEnabled={false}
            keyExtractor={(item: any) => item.key}
            renderItem={(src: any) => {
              return (
                <View>
                  <TouchableOpacity activeOpacity={1} style={[styles.button]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <Text style={[styles.itemInActive]}>
                        {src.item.lable ? src.item.lable : src.item.medicineType}
                      </Text>
                      <Text style={[styles.itemInActive]}>
                        {src.item.value ? src.item.value : src.item.medicineQuantity}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    // height: 54,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 3,
    fontSize: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: scale(10),
  },
  itemInActive: {
    fontSize: 12,
    fontFamily: Fonts.primaryMedium,
    color: Colors.bodyTextGrey,
  },
  expandedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 9,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 9,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGrey,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  parentHr: {
    color: 'white',
    width: '100%',
  },
});

export default Accordian;
