import React, {Component} from 'react';
import {Switch, SwitchProps} from 'react-native';
import Constants from '../core/constants';
import {Colors} from '../styles';

interface switchState {
  isOnOrOff: boolean;
}
interface switchProps extends SwitchProps {
  isOnOrOff: boolean;
  isEnabled: boolean;
  onSelect: (selected: boolean) => void;
}
class CustSwitch extends Component<switchProps, switchState> {
  constructor(props) {
    super(props);
    this.state = {
      isOnOrOff: false,
    };
  }
  componentDidMount() {
    this.setState({isOnOrOff: this.props.isOnOrOff});
  }
  componentDidUpdate(nextProps: switchProps) {
    if (this.props.isOnOrOff != nextProps.isOnOrOff)
      this.setState({isOnOrOff: this.props.isOnOrOff});
  }
  onChange = () => {
    this.setState({isOnOrOff: !this.state.isOnOrOff}, () => {
      this.props.onSelect(this.state.isOnOrOff);
    });
  };
  render() {
    return (
      <Switch
        trackColor={{
          false: Colors.borderGrey,
          true: Colors.primaryGradientStart,
        }}
        thumbColor={
          this.state.isOnOrOff ? Colors.primaryGradientEnd : Colors.iconGrey
        }
        onValueChange={this.onChange}
        value={this.state.isOnOrOff}
        disabled={this.props.isEnabled}
      />
    );
  }
}
export default CustSwitch;
