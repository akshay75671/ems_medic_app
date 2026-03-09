import {observable, action, decorate} from 'mobx';

export default class Narratives {
  narratives: any[] = [
    {
      id: 'd038e499-4a5a-40e3-be57-7a5e641edc55',
      name: 'Set 1',
      epcrNum: '123',
      eventID: 'IPL2020Bng',
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNM1',
      medicUserID: '40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      medicName: 'Shashi',
      medicSignature: 'profiles_sign_40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      dateAndTime: '06/12/2020 7:30 PM',
      summary: 'All is well',
      assessmentSummary:
        'Menu Level 1> Menu Level 1.1> - Group Title 1 : Value 1 , Value 2.',
      treatmentsSummary:
        'Menu Level 1> Menu Level 1.2 > Menu Level 1.2.1> - Group Title 1 : Value 1 , Value 2; Group Title 2 - Field Name1: Value ,Field Name 2:Value',
      cprSummary:
        'Menu Level 1> Menu Level 1.2 > Menu Level 1.2.2> - Group Title 1 - Field Name - Value; Group Title 2 - Value 1, Value 2',
      consumables:
        'Menu Level 1> Menu Level 1.1> - Group Title 1 : Value 1 , Value 2.',
      causeOfDelay:
        'Menu Level 1> Menu Level 1.1> - Group Title 1 : Value 1 , Value 2.',
    },
    {
      id: '2bd4e13c-63b2-4355-9dd4-8a70dfa7ebef',
      name: 'Set 1',
      epcrNum: '124',
      eventID: 'IPL2020Bng',
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNN1',
      medicUserID: '40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      medicName: 'Rakesh',
      medicSignature: 'profiles_sign_40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      dateAndTime: '06/12/2020 9:30 PM',
      summary: 'Everything is well',
      assessmentSummary:
        'Menu Level 1> Menu Level 1.1> - Group Title 1 : Value 1 , Value 2.',
      treatmentsSummary:
        'Menu Level 1> Menu Level 1.2 > Menu Level 1.2.1> - Group Title 1 : Value 1 , Value 2; Group Title 2 - Field Name1: Value ,Field Name 2:Value',
      cprSummary:
        'Menu Level 1> Menu Level 1.2 > Menu Level 1.2.2> - Group Title 1 - Field Name - Value; Group Title 2 - Value 1, Value 2',
      consumables:
        'Menu Level 1> Menu Level 1.1> - Group Title 1 : Value 1 , Value 2.',
      causeOfDelay:
        'Menu Level 1> Menu Level 1.1> - Group Title 1 : Value 1 , Value 2.',
    },
  ];
  saveNarratives = (data) => {
    this.narratives.push(data);
  };
  getNarrativesByID = (assistID) => {
    let narrativesArr: any[] = [];
    this.narratives.forEach((item, index) => {
      if (item.assistUserID == assistID) narrativesArr.push(item);
    });
    return narrativesArr;
  };
  getNarrativeLengthByID = (assistID) => {
    let narrativesArr: any[] = [];
    this.narratives.forEach((item, index) => {
      if (item.assistUserID == assistID) narrativesArr.push(item);
    });
    return narrativesArr.length;
  };
}

decorate(Narratives, {
  narratives: observable,
  saveNarratives: action,
});
