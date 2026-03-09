import {observable, action, decorate} from 'mobx';

export default class Demographic {
  demographic: any[] = [
    {
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNk2',
      name: 'Elen Mark',
      email: 'elen.mark@gmail.com',
      primaryPhone: '0258741369',
      perAddress: '29, testing Street',
      perCity: 'Bangalore',
      perState: 'Karnataka',
      perCountry: 'India',
      perPostcode: '650075',
      gender: 'Male',
      weight: '82',
      dob: '24/9/75',
      age: 35,
    },
    {
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNk1',
      name: 'Ella Jones',
      email: 'ella.jones@gmail.com',
      primaryPhone: '95123574680',
      perAddress: '29, javascript Street',
      perCity: 'Kochin',
      perState: 'Kerala',
      perCountry: 'India',
      perPostcode: '652001',
      gender: 'Female',
      weight: '58',
      dob: '24/9/75',
      age: 32,
    },
    {
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNN1',
      name: 'Emily Rose',
      email: 'emily.rose@gmail.com',
      primaryPhone: '3698520147',
      perAddress: '29, javascript Street',
      perCity: 'Kochin',
      perState: 'Kerala',
      perCountry: 'India',
      perPostcode: '652001',
      gender: 'Female',
      weight: '38',
      dob: '24/12/95',
      age: 15,
    },
    {
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNM1',
      name: 'Stella Ramola',
      email: 'stella.ramola@gmail.com',
      primaryPhone: '1239874560',
      perAddress: '29, javascript Street',
      perCity: 'Kochin',
      perState: 'Kerala',
      perCountry: 'India',
      perPostcode: '652001',
      gender: 'Female',
      weight: '48',
      dob: '24/12/85',
      age: 25,
    },
    {
      assistUserID: 'a03TkuE0nkQD9RcZZbI815JAiNJ1',
      name: 'John Paul',
      email: 'John.Paul@gmail.com',
      primaryPhone: '85694573210',
      perAddress: '29, testing Street',
      perCity: 'Bangalore',
      perState: 'Karnataka',
      perCountry: 'India',
      perPostcode: '650075',
      gender: 'Male',
      weight: '76',
      dob: '24/9/75',
      age: 45,
    },
  ];
  getAssistUserByID = (assistID) => {
    let assistUser = {};
    this.demographic.forEach((item, index) => {
      if (item.assistUserID == assistID) assistUser = item;
    });
    return assistUser;
  };
  reset = () => {};
}

decorate(Demographic, {
  demographic: observable,
});
