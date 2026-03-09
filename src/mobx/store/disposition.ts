import {observable, action, decorate} from 'mobx';

export interface dispositionDetail {
  // eventDisposition: eventDisposition;
  // ambulanceDisposition: ambulanceDisposition;
  dispositionType: "eventDisposition"|"ambulanceDisposition",
  assistUserID: string,
  epcrNum: number,
  data: eventDisposition|ambulanceDisposition,
}

export interface eventDisposition {
  eventDispositionType: string,
  eventDispositionDetail: string,
}

export interface ambulanceDisposition {
  ambulanceRequestedBy: string,
  ambulanceTransportedBy: string,
  ambulanceForm: ambulanceForm
}

export interface ambulanceForm {
  bookingId: string,
  name: string,
  requestedBy: string,
  age: string,
  gender: string,
  primaryChiefComplaint: string,
  secondaryChiefComplaint: string,
  notes: string,
  artus: boolean,
  etoh: boolean,
}

export default class Disposition {

  eventDisposition: eventDisposition = {
    eventDispositionType: "back to event",
    eventDispositionDetail: "Test details",
  }

  ambulanceForm: ambulanceForm = {
    bookingId: "123",
    name: "Test",
    requestedBy: "req 1",
    age: '12/11/2014',
    gender: 'Male',
    primaryChiefComplaint: 'Test primaryChiefComplaint',
    secondaryChiefComplaint: "test secondaryChiefComplaint",
    notes: "test",
    artus: true,
    etoh: false,
  };

  ambulanceDisposition: ambulanceDisposition = {
    ambulanceRequestedBy: "123",
    ambulanceTransportedBy: "456",
    ambulanceForm: this.ambulanceForm
  }

  disposition: any = {
    a03TkuE0nkQD9RcZZbI815JAiNN1 :{ 
      dispositionType: "ambulance",
      epcrNo: "124",
      assistID: "a03TkuE0nkQD9RcZZbI815JAiNN1",
      data: {
        age: "27/11/2009",
        ambulanceRequestedBy: 'ems',
        bookingId: "123",
        gender: "Male",
        name: "5545",
        notes: "Notes testing",
        primaryChiefComplaint: "First complaint",
        requestedBy: "54546",
        secondaryChiefComplaint: "second complaint",
        ambulanceTransportedBy: false,
      }
    }
  };
  // eventDisposition: eventDisposition = {dispositionType:"Back to Event"};

  setEventType = data => {
    this.disposition.dispositionType=data;
  }

  getEventType = () => {
    return this.disposition.dispositionType;
  }

  getDispositionData = (assistId) => {
    return this.disposition.hasOwnProperty(assistId) ? this.disposition[assistId] : null;
  }

  setDispositionData = (data: eventDisposition|ambulanceDisposition, assitID, epcrNo, dispositionType) => {
    this.disposition[assitID] = {
      "dispositionType": dispositionType,
      "epcrNo": epcrNo,
      "assistID": assitID,
      "data": data
    };
  }

  reset = () => {};
}

decorate(Disposition, {
  disposition: observable,
  setEventType: action,
  getEventType: action,
  setDispositionData: action,
});
