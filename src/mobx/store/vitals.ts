import {observable, action, decorate} from 'mobx';

export default class Vitals {
  vitals: any[] = [
    {
      id: 'd038e499-4a5a-40e3-be57-7a5e641edc55',
      name: 'Set 1',
      epcrNum: '123',
      eventID: 'IPL2020Bng',
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNk1',
      medicUserID: '40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      medicName: 'Shashi',
      medicSignature: 'profiles_sign_a03TkuE0nkQD9RcZZbI815JAiNk2',
      dateAndTime: '06/12/2020 7:30 PM',
      vitalsData: {
        summary: {
          dateTime: {key: 'Time', value: '20:33'},
          medicName: {key: 'Taken By', value: 'Paul Pandi'},
          patientCondition: {key: 'Patient Condition', value: 'poor'},
          gscScore: {key: 'GSC Score', value: '4'},
        },
        lungSound: {
          leftInspiration: {key: 'Left Inspiration', value: 'left'},
          rightInspiration: {key: 'Right Inspiration', value: 'right'},
          leftExpiration: {key: 'Left Expiration', value: 'left expir'},
          rightExpiration: {key: 'Right Expiration', value: 'right expir'},
        },
        respiration: {
          rate: {key: 'Rate', value: '4'},
          effort: {key: 'Effort', value: 'nothing'},
        },
      },
    },
  ];
  saveVitals = (data) => {
    this.vitals.push(data);
  };
  getVitalsByID = (assistID) => {
    let vitalsArr: any[] = [];
    this.vitals.forEach((item, index) => {
      if (item.assistUserID == assistID) vitalsArr.push(item);
    });
    return vitalsArr;
  };
  getVitalsLengthByID = (assistID) => {
    let vitalsArr: any[] = [];
    this.vitals.forEach((item, index) => {
      if (item.assistUserID == assistID) vitalsArr.push(item);
    });
    return vitalsArr.length;
  };
  reset = () => {};
}

decorate(Vitals, {
  vitals: observable,
  saveVitals: action,
});
