import { observable, configure, action, decorate } from "mobx";
import formTreatmentData from '../../model/formTreatment.json';
import formTreatmentFrequentlyData from '../../model/formFrequentlyUsedTreatment.json';
import {filterObjectByKey} from '../../core/utils';

configure({ enforceActions: "observed" });

export default class Treatment {

  treatmentFormData = {};
  treatmentFrequentlyUsedFormData = {};
  treatmentUserData = {};
  treatmentHideSections = {};

  getTreatmentFormData = () => {
    this.treatmentFormData = formTreatmentData.data;
    return this.treatmentFormData;
  }

  getTreatmentFrequentlyUsedFormData = () => {
    this.treatmentFrequentlyUsedFormData = formTreatmentFrequentlyData.data;
    return this.treatmentFrequentlyUsedFormData;
  }

  setTreatmentUserData = (userId: string, data: any, hideList: any) => {
    this.treatmentUserData[userId] = data;
    this.treatmentHideSections[userId] = hideList;
  }

  getAssistUserDataByID = (userId) => {
    return this.treatmentUserData[userId] ?? {};
  }

  getAssistUserHideListByID = (userId) => {
    return this.treatmentHideSections[userId] ?? [];
  }

  populateToTreatment = (userId: string, data: any, fromKey: string, toKey: string) => {

    var dataString = JSON.stringify(data);
    dataString = dataString.split(fromKey+'-').join(toKey+'-');
    var newData = JSON.parse(dataString);

    var filteredTreatmentData = filterObjectByKey(this.treatmentUserData[userId] ?? {}, (option) =>
      option.includes(toKey) == false,
    );    
    this.treatmentUserData[userId] = {...filteredTreatmentData, ...newData};
    
  }
}

decorate(Treatment, {
  treatmentFormData: observable,
  treatmentFrequentlyUsedFormData: observable,
  treatmentUserData: observable,
  treatmentHideSections: observable,
  getTreatmentFormData: action,
  getTreatmentFrequentlyUsedFormData: action,
  setTreatmentUserData: action,
  populateToTreatment: action
});
