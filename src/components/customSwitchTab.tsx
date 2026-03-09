import React, {PureComponent} from 'react';
import {boxModelSize} from '../styles';
import {View, StyleSheet} from 'react-native';
import {custSwitchTabProps, custTextInputState} from '../types/componentsTypes';
import SegmentedTab from '../components/segmentedTab';

class CustSwitchTab extends PureComponent<
  custSwitchTabProps,
  custTextInputState
> {
  constructor(props) {
    super(props);
  }

  render() {
    const {tabvalue, handleTabChange, defaultSelectedTab} = this.props;
    return (
      <View style={[{marginBottom: boxModelSize.m}, {alignSelf: 'flex-end'}]}>
        <SegmentedTab
          tabValue={tabvalue}
          handleTabChange={(value: string) => handleTabChange(value)}
          defaultSelectedTab={defaultSelectedTab}
          tabSize={'small'}
          tabWidth={'70%'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default CustSwitchTab;
