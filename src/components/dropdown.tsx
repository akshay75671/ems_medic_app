import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {scale} from 'react-native-size-matters';

const CustDropdown: FC = (props) => {
  const DEMO_OPTIONS_2 = [
    {name: 'Rex', age: 30},
    {name: 'Mary', age: 25},
    {name: 'John', age: 41},
    {name: 'Jim', age: 22},
    {name: 'Susan', age: 52},
    {name: 'Brent', age: 33},
    {name: 'Alex', age: 16},
    {name: 'Ian', age: 20},
    {name: 'Phil', age: 24},
  ];
  const _dropdown_2_renderButtonText = (rowData) => {
    const {name, age} = rowData;
    return `${name} - ${age}`;
  };

  const _dropdown_2_renderRow = (rowData, rowID, highlighted) => {
    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor="cornflowerblue">
        <View
          style={[
            styles.dropdownRow,
            {backgroundColor: evenRow ? 'lemonchiffon' : 'white'},
          ]}>
          <Text
            style={[
              styles.dropdownText,
              highlighted && {color: 'mediumaquamarine'},
            ]}>
            {`${rowData.name} (${rowData.age})`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const _dropdown_2_renderSeparator = (
    sectionID,
    rowID,
    adjacentRowHighlighted,
  ) => {
    if (rowID == DEMO_OPTIONS_2.length - 1) return;
    let key = `spr_${rowID}`;
    return <View style={styles.dropdownSeparator} key={key} />;
  };
  return (
    <View>
      <Text>test</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    borderRadius: scale(100),
    overflow: 'hidden',
    borderWidth: scale(2),
  },
  availableState: {
    borderRadius: scale(30),
    position: 'absolute',
    bottom: 0,
  },
  dropdown: {
    alignSelf: 'flex-end',
    width: 150,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'cornflowerblue',
  },
  dropdownText: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdownContainer: {
    width: 150,
    height: 300,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
  dropdownRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
});

export default CustDropdown;
