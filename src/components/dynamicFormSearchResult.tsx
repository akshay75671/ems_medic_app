import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {scale} from 'react-native-size-matters';

import Constants from '../core/constants';
import {CustIcon, RichText} from '../components';
import {boxModelSize, Colors, commonStyles, Fonts} from '../styles';

type searchResultProps = {
  data: any;
  searchString: string;
  onSearchRecTap?: (item) => void;
};

const DynamicFormSearchResult: FC<searchResultProps> = (props) => {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    _onSearch(props.searchString);

    return () => {};
  }, [props.searchString]);

  function _onSearch(text) {
    var _searchResult = [];
    var _data = props.data;

    _data.data.map((data1, index1) => {
      var _found1 = data1.name?.toLowerCase().includes(text?.toLowerCase());

      if (_found1) {
        _searchResult.push({
          text: _data.name + ' > ' + data1.name,
          value: [_data, data1],
          pos: [_data.type + '_0', data1.type + '_' + index1],
        });
      }

      data1.data.map((data2, index2) => {
        var _found2 = data2.name.toLowerCase().includes(text?.toLowerCase());

        if (_found2) {
          _searchResult.push({
            text: formatSearchText(_data.name + ' > ' + data1.name + ' > ' + data2.name),
            value: [_data, data1, data2],
            pos: [
              _data.type + '_0',
              data1.type + '_' + index1,
              data2.type + '_' + index2,
            ],
          });
        }

        data2.data.map((data3, index3) => {
          var _found3 = data3.name?.toLowerCase().includes(text?.toLowerCase());

          if (_found3) {
            _searchResult.push({
              text:
                formatSearchText(_data.name +
                ' > ' +
                data1.name +
                ' > ' +
                data2.name +
                ' > ' +
                data3.name),
              value: [_data, data1, data2, data3],
              pos: [
                _data.type + '_0',
                data1.type + '_' + index1,
                data2.type + '_' + index2,
                data3.type + '_' + index3,
              ],
            });
          }

          data3.data.map((data4, index4) => {
            var _found4 = data4.name
              .toLowerCase()
              .includes(text?.toLowerCase());

            if (_found4) {
              _searchResult.push({
                text: formatSearchText(
                  _data.name +
                    ' > ' +
                    data1.name +
                    ' > ' +
                    data2.name +
                    ' > ' +
                    data3.name +
                    ' > ' +
                    data4.name,
                ),
                value: [_data, data1, data2, data3, data4],
                pos: [
                  _data.type + '_0',
                  data1.type + '_' + index1,
                  data2.type + '_' + index2,
                  data3.type + '_' + index3,
                  data4.type + '_' + index4,
                ],
              });
            }

            data4?.data?.map((data5, index5) => {
              var _found5 = data5.name
                .toLowerCase()
                .includes(text?.toLowerCase());

              if (_found5) {
                _searchResult.push({
                  text: formatSearchText(
                    _data.name +
                      ' > ' +
                      data1.name +
                      ' > ' +
                      data2.name +
                      ' > ' +
                      data3.name +
                      ' > ' +
                      data4.name +
                      ' > ' +
                      data5.name,
                  ),
                  value: [_data, data1, data2, data3, data4, data5],
                  pos: [
                    _data.type + '_0',
                    data1.type + '_' + index1,
                    data2.type + '_' + index2,
                    data3.type + '_' + index3,
                    data4.type + '_' + index4,
                    data5.type + '_' + index5,
                  ],
                });
              }

              data5?.data?.map((data6, index6) => {
                var _found6 = data6.name
                  .toLowerCase()
                  .includes(text?.toLowerCase());

                if (_found6) {
                  _searchResult.push({
                    text: formatSearchText(
                      _data.name +
                        ' > ' +
                        data1.name +
                        ' > ' +
                        data2.name +
                        ' > ' +
                        data3.name +
                        ' > ' +
                        data4.name +
                        ' > ' +
                        data5.name +
                        ' > ' +
                        data6.name,
                    ),
                    value: [_data, data1, data2, data3, data4, data5, data6],
                    pos: [
                      _data.type + '_0',
                      data1.type + '_' + index1,
                      data2.type + '_' + index2,
                      data3.type + '_' + index3,
                      data4.type + '_' + index4,
                      data5.type + '_' + index5,
                      data6.type + '_' + index6,
                    ],
                  });
                }
                data6?.data?.map((data7, index7) => {
                  var _found7 = data7.name
                    .toLowerCase()
                    .includes(text?.toLowerCase());

                  if (_found7) {
                    _searchResult.push({
                      text: formatSearchText(
                        _data.name +
                          ' > ' +
                          data1.name +
                          ' > ' +
                          data2.name +
                          ' > ' +
                          data3.name +
                          ' > ' +
                          data4.name +
                          ' > ' +
                          data5.name +
                          ' > ' +
                          data6.name +
                          ' > ' +
                          data7.name,
                      ),
                      value: [
                        _data,
                        data1,
                        data2,
                        data3,
                        data4,
                        data5,
                        data6,
                        data7,
                      ],
                      pos: [
                        _data.type + '_0',
                        data1.type + '_' + index1,
                        data2.type + '_' + index2,
                        data3.type + '_' + index3,
                        data4.type + '_' + index4,
                        data5.type + '_' + index5,
                        data6.type + '_' + index6,
                        data7.type + '_' + index7,
                      ],
                    });
                  }
                });
              });
            });
          });
        });
      });
    });

    if (_searchResult.length == 0) {
      _searchResult.push({text: 'Not Found', value: []});
    }
    setSearchResult(_searchResult);
  }

  const formatSearchText = (text: string) => {
    text = text.split(' >  > ').join(' > ');
    text = text.split(' >  > ').join(' > ');

    return text;
  };

  return (
    <View style={{flexShrink: 1}}>
      <Text style={styles.title}>{'Search Result'}</Text>
      <FlatList
        style={{flexShrink: 1, paddingHorizontal: boxModelSize.l}}
        data={searchResult}
        ItemSeparatorComponent={FlatListItemSeparator}
        keyExtractor={(item: any, index: any) => index.toString()}
        renderItem={({item, index}: any) => {
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => props.onSearchRecTap(item)}>
              <View
                key={index.toString()}
                style={{
                  backgroundColor: Colors.white,
                  padding: 10.0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <RichText
                  baseString={item.text}
                  find={props.searchString}
                  baseStringStyle={styles.searchText}
                  findStyle={styles.searchHighlightText}
                />

                <CustIcon
                  type="evilicon"
                  name="chevron-right"
                  size={scale(25)}
                  color={Colors.iconGrey}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
    fontSize: scale(16),
    paddingVertical: scale(5),
    paddingLeft: boxModelSize.l,
  },
  searchText: {
    flex: 0.9,
    fontFamily: Fonts.primaryRegular,
    color: Colors.dropDownIcon,
    fontSize: scale(13),
  },
  searchHighlightText: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: scale(13),
  },
});

const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#000',
        opacity: 0.1,
      }}></View>
  );
};

export default DynamicFormSearchResult;
