import {observable, action, decorate} from 'mobx';

export default class NonClinical {
  nonClinical: any[] = [
    {
      id: '2bd4e13c-63b2-4355-9dd4-8a70dfa7ebef',
      patientName: 'Jhon',
      medicName: 'Rakesh',
      medicUserID: '40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      dateAndTime: '05/12/2020 9:30 PM',
      items: [
        {key: 'bandAid', lable: 'Band Aid', value: 3},
        {key: 'syring', lable: 'Syring', value: 9},
        {key: 'nebulizer', lable: 'Nebulizer', value: 5},
      ],
    },
    {
      id: 'd038e499-4a5a-40e3-be57-7a5e641edc55',
      patientName: 'Stellah',
      medicUserID: '40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      medicName: 'Shashi',
      dateAndTime: '06/12/2020 7:30 PM',
      items: [
        {key: 'bandAid', lable: 'Band Aid', value: 4},
        {key: 'safetyPin', lable: 'Safety Pin', value: 5},
      ],
    },
  ];

  setNonClinicalData = (data) => {
    this.nonClinical.push(data);
  };
  reset = () => {};
}

decorate(NonClinical, {
  nonClinical: observable,
  setNonClinicalData: action,
});
