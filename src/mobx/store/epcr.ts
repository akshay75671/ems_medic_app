import {observable, action, decorate} from 'mobx';
import {addEPCR} from '../../services/epcr';
import stores from '../index';
import {assistRequestTypes} from './assistRequests';

export interface epcrTypes {
  eventID: string;
  assistRequestID: string;
  epcrNum: number;
  medicproviderID: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class EPCR {
  epcrs: epcrTypes[] = [];
  lastEpcrNum: number = 121;
  generateEPCR = (assistUsers: assistRequestTypes[]) => {
    assistUsers.forEach((assistUser: assistRequestTypes, index) => {
      this.epcrs.push({
        eventID: stores.eventStore.event.eventID,
        assistRequestID: assistUser.assistUserID,
        medicproviderID: stores.profile.profile.fbUserID,
        epcrNum: this.lastEpcrNum + index,
        status: 'inProgress',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    // addEPCR(this.epcrs)
    //   .then(() => {
    //     stores.assistRequests.updateEpcrNumToAssistUser(this.epcrs);
    //     stores.profile.updateStatus('inProgress');
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.epcrs = [];
    //   });
    setTimeout(() => {
      stores.assistRequests.updateEpcrNumToAssistUser(this.epcrs);
      stores.profile.updateStatus('inProgress');
    }, 2000);
  };
  reset = () => {};
}

decorate(EPCR, {
  epcrs: observable,
  generateEPCR: action,
  reset: action,
});
