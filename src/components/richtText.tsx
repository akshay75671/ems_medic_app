import React, {FC} from 'react';
import {Text} from 'react-native';

type richTextProps = {
  baseString: string;
  find: string;
  baseStringStyle?: any;
  findStyle?: any;
};

const RichText: FC<richTextProps> = (props) => {
  var regEx = new RegExp(props.find, 'ig');

  var res1 = props.baseString.split(regEx);
  var res2 = props.baseString.match(regEx);
  var mergeRes = [];

  var counter = 0;
  res2?.map((r) => {
    mergeRes.push(res1[counter]);
    mergeRes.push(res2[counter]);
    counter++;
  });
  mergeRes.push(res1[counter]);

  var v1 = [];

  for (var i = 0; i < mergeRes.length - 2; i++) {
    v1.push(mergeRes[i]);
  }

  return (
    <Text style={{...props.baseStringStyle}}>
      {v1.join('')}
      <Text style={{...props.findStyle}}>{mergeRes[mergeRes.length - 2]}</Text>
      {mergeRes[mergeRes.length - 1]}
    </Text>
  );
};

export default RichText;
