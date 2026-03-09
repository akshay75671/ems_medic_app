import React, {FC, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {CustIcon} from '../components';
import {boxModelSize, Colors, commonStyles, Fonts} from '../styles';

type menuProps = {
  menuItems: any;
  expandedItems: any;
  hideList: any;
  userData: any;
  selectedItemId?: any;
  onTap?: (data) => void;
};

const DynamicMenu: FC<menuProps> = (props) => {
  const [hideList, setHideList] = useState([]);
  const [userData, setuserData] = useState({});

  useEffect(() => {
    setHideList(props.hideList);
    setuserData(props.userData);
    return () => {};
  }, [props.hideList, props.userData]);

  const fistLevel = Object.keys(props.menuItems).map((i) => props.menuItems[i]);
  const expanded = Object.keys(props.expandedItems).map(
    (i) => props.expandedItems[i],
  );

  return (
    <ScrollView
      style={[
        styles.boxShadow,
        {
          flexShrink: 1,
          paddingLeft: boxModelSize.l,
          paddingRight: boxModelSize.l,
        },
      ]}>
      <View style={styles.menuContainer}>
        {fistLevel.map((firstLevelRec, index) => {
          const secondLevel = Object.keys(firstLevelRec.data).map(
            (i) => firstLevelRec.data[i],
          );

          var hide1 = hideList?.indexOf(firstLevelRec.id) == -1 ? false : true;

          var key = firstLevelRec.id + '-';
          var filled = Object.keys(userData).filter((i) => i.includes(key));

          return (
            <View
              key={'menu_level_1_' + index}
              style={{flexDirection: 'column'}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => (hide1 ? null : props.onTap(firstLevelRec))}>
                <View
                  style={[
                    styles.primaryMenuItem,
                    {borderTopWidth: index == 0 ? 0 : 1},
                  ]}>
                  <View
                    style={[
                      styles.menuSelected,
                      {
                        backgroundColor:
                          firstLevelRec.id == props.selectedItemId
                            ? Colors.graycell
                            : Colors.lightGrey,
                      },
                    ]}>
                    <View style={styles.iconContainer}>
                      {filled.length == 0 ? (
                        <CustIcon
                          type="material"
                          name="info"
                          size={20}
                          color={
                            firstLevelRec.id == props.selectedItemId
                              ? Colors.primary
                              : hide1
                              ? '#c1c1c1'
                              : Colors.iconGrey
                          }
                        />
                      ) : (
                        <CustIcon
                          type="ionicon"
                          name="checkmark-circle"
                          size={20}
                          color={
                            firstLevelRec.id == props.selectedItemId
                              ? Colors.primary
                              : hide1
                              ? '#c1c1c1'
                              : Colors.primary
                          }
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.label,
                        {
                          marginRight: 20,
                          color:
                            firstLevelRec.id == props.selectedItemId
                              ? Colors.primary
                              : hide1
                              ? '#c1c1c1'
                              : Colors.bodyTextGrey,
                        },
                      ]}>
                      {firstLevelRec.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.label,
                      {
                        marginRight: 15,
                        color:
                          firstLevelRec.id == props.selectedItemId
                            ? Colors.primary
                            : hide1
                            ? '#c1c1c1'
                            : Colors.dropDownIcon,
                      },
                    ]}>
                    {' '}
                    {firstLevelRec.type == 'menu_level_2'
                      ? expanded.indexOf(firstLevelRec.id) === -1
                        ? '+'
                        : '-'
                      : ''}
                  </Text>
                </View>
              </TouchableOpacity>

              {expanded.indexOf(firstLevelRec.id) === -1
                ? null
                : secondLevel.map((secondLevelRec, index2) => {
                    const thirdLevel = Object.keys(secondLevelRec.data).map(
                      (i) => secondLevelRec.data[i],
                    );

                    var hide =
                      hideList?.indexOf(secondLevelRec.id) == -1 ? false : true;

                    var skey = secondLevelRec.id + '-';
                    var sfilled = Object.keys(userData).filter((i) =>
                      i.includes(skey),
                    );

                    return (
                      <View
                        key={'menu_level_2_' + index2}
                        style={{flexDirection: 'column'}}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() =>
                            hide ? null : props.onTap(secondLevelRec)
                          }>
                          <View style={{backgroundColor: Colors.lightGrey}}>
                            <View style={styles.subMenuItem}>
                              <View
                                style={[
                                  styles.menuSelected,
                                  {
                                    backgroundColor:
                                      secondLevelRec.id == props.selectedItemId
                                        ? Colors.graycell
                                        : Colors.lightGrey,
                                    borderRadius: 50,
                                  },
                                ]}>
                                <View style={styles.iconContainer}>
                                  {sfilled.length == 0 ? (
                                    <CustIcon
                                      type="material"
                                      name="info"
                                      size={20}
                                      color={
                                        secondLevelRec.id ==
                                        props.selectedItemId
                                          ? Colors.primary
                                          : hide || hide1
                                          ? '#c1c1c1'
                                          : Colors.iconGrey
                                      }
                                    />
                                  ) : (
                                    <CustIcon
                                      type="ionicon"
                                      name="checkmark-circle"
                                      size={20}
                                      color={
                                        secondLevelRec.id ==
                                        props.selectedItemId
                                          ? Colors.primary
                                          : hide || hide1
                                          ? '#c1c1c1'
                                          : Colors.primary
                                      }
                                    />
                                  )}
                                </View>
                                <Text
                                  style={[
                                    styles.subMenu,
                                    {
                                      marginRight: 20,
                                      color:
                                        secondLevelRec.id ==
                                        props.selectedItemId
                                          ? Colors.primary
                                          : hide || hide1
                                          ? '#c1c1c1'
                                          : Colors.bodyTextGrey,
                                    },
                                  ]}>
                                  {secondLevelRec.name}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    marginRight: 15,
                                    color:
                                      secondLevelRec.id == props.selectedItemId
                                        ? Colors.primary
                                        : hide1
                                        ? '#c1c1c1'
                                        : Colors.dropDownIcon,
                                  },
                                ]}>
                                {' '}
                                {secondLevelRec.type == 'menu_level_3'
                                  ? expanded.indexOf(secondLevelRec.id) === -1
                                    ? '+'
                                    : '-'
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        {expanded.indexOf(secondLevelRec.id) === -1
                          ? null
                          : thirdLevel.map((thiredLevelRec, index3) => {
                              var hide =
                                hideList?.indexOf(thiredLevelRec.id) == -1
                                  ? false
                                  : true;

                              var skey = thiredLevelRec.id + '-';
                              var sfilled = Object.keys(userData).filter((i) =>
                                i.includes(skey),
                              );

                              return (
                                <View
                                  key={'menu_level_3_' + index3}
                                  style={{flexDirection: 'column'}}>
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() =>
                                      hide ? null : props.onTap(thiredLevelRec)
                                    }>
                                    <View
                                      style={{backgroundColor: Colors.lightGrey}}>
                                      <View style={styles.thirdMenuItem}>
                                        <View
                                          style={[
                                            styles.menuSelected,
                                            {
                                              backgroundColor:
                                                thiredLevelRec.id ==
                                                props.selectedItemId
                                                  ? Colors.graycell
                                                  : Colors.lightGrey,
                                              borderRadius: 50,
                                            },
                                          ]}>
                                          <View style={styles.iconContainer}>
                                            {sfilled.length == 0 ? (
                                              <CustIcon
                                                type="material"
                                                name="info"
                                                size={20}
                                                color={
                                                  thiredLevelRec.id ==
                                                  props.selectedItemId
                                                    ? Colors.primary
                                                    : hide || hide1
                                                    ? '#c1c1c1'
                                                    : Colors.iconGrey
                                                }
                                              />
                                            ) : (
                                              <CustIcon
                                                type="ionicon"
                                                name="checkmark-circle"
                                                size={20}
                                                color={
                                                  thiredLevelRec.id ==
                                                  props.selectedItemId
                                                    ? Colors.primary
                                                    : hide || hide1
                                                    ? '#c1c1c1'
                                                    : Colors.primary
                                                }
                                              />
                                            )}
                                          </View>
                                          <Text
                                            style={[
                                              styles.subMenu,
                                              {
                                                marginRight: 20,
                                                color:
                                                  thiredLevelRec.id ==
                                                  props.selectedItemId
                                                    ? Colors.primary
                                                    : hide || hide1
                                                    ? '#c1c1c1'
                                                    : Colors.bodyTextGrey,
                                              },
                                            ]}>
                                            {thiredLevelRec.name}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                      </View>
                    );
                  })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
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
    fontSize: scale(14),
    paddingLeft: scale(10),
  },
  subMenu: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.dropDownIcon,
    fontSize: scale(13),
    paddingLeft: scale(10),
  },
  menuContainer: {
    borderRadius: 20.0,
    overflow: 'hidden',
    marginBottom: 15,
  },
  primaryMenuItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGrey,
  },
  menuSelected: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 50,
    marginLeft: 5,
  },
  iconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  subMenuItem: {
    marginLeft: 30.0,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderGrey,
  },
  thirdMenuItem: {
    marginLeft: 70.0,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderGrey,
  },
});

export default DynamicMenu;
