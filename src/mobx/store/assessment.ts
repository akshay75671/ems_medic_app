import { observable, configure, action, decorate } from "mobx";
import formAssessmentPrimaryData from '../../model/formAssessmentPrimary.json';
import formAssessmentSecondaryData from '../../model/formAssessmentSecondary.json';
import formAssessmentPrimaryFrequentlyData from '../../model/formFrequentlyUsedAssessmentPrimary.json';
import { filterObjectByKey } from '../../core/utils';
import {
  addAssessment,
  getAssessment,
} from '../../services/assessmentServices';

configure({ enforceActions: "observed" });

export default class Assessment {

  assessmentPrimaryFormData = {};
  assessmentSecondaryFormData = {};
  assessmentFrequentlyUsedFormData = {};
  assessmentUserData = {};
  assessmentHideSections = {};

  getPrimaryAssessmentFormData = () => {

    // getAssessment("OC0kBuG6lL22NStiByJk").then((res) => {
    //   console.warn("AAA: " + JSON.stringify(res));
    //   //addAssessment("OC0kBuG6lL22NStiByJk", {menu: data.data});
    // });

    // getAssessment("OC0kBuG6lL22NStiByJk").then((res: any) => {
    //   setMenuItems(res.menu);
    // });

    this.assessmentPrimaryFormData = formAssessmentPrimaryData.data;
    return this.assessmentPrimaryFormData;
  }

  getSecondaryAssessmentFormData = () => {
    this.assessmentSecondaryFormData = formAssessmentSecondaryData.data;
    return this.assessmentSecondaryFormData;
  }

  getPrimaryAssessmentFrequentlyUsedFormData = () => {
    this.assessmentFrequentlyUsedFormData = formAssessmentPrimaryFrequentlyData.data;
    return this.assessmentFrequentlyUsedFormData;
  }

  setAssessmentUserData = (userId: string, data: any, hideList: any) => {

    this.assessmentUserData[userId] = data;
    this.assessmentHideSections[userId] = hideList;
  }


  getAssistUserDataByID = (userId) => {
    return this.assessmentUserData[userId] ?? {};
  }

  getAssistUserHideListByID = (userId) => {
    return this.assessmentHideSections[userId] ?? [];
  }


  gcsOperation = (userId) => {

    //Handle GCS operation. "P2-S3-G1-Q1-XX" to "P2-S3-G1-Q2-R1"
    var gcsAnswers = filterObjectByKey(this.assessmentUserData[userId] ?? {}, (option) =>
      option.includes("P2-S3-G1-Q1") == true,
    );

    var otherAnswers = filterObjectByKey(this.assessmentUserData[userId] ?? {}, (option) =>
      option.includes("P2-S3-G1-Q2") == false,
    );

    if (Object.keys(gcsAnswers).length > 0) {
      var res = Object.values(gcsAnswers).map((i: any) => i.answer[0]);
      var total = res.reduce((pre: any, cur: any) => pre + cur.value, 0);
      console.log("GSC total: " + total);
      var gcsTotal = { "P2-S3-G1-Q2-R1": { "answer": [{ "id": "P2-S3-G1-Q2-R1-O1", "name": "Total GCS", "value": total.toString(), "type": "tf-number" }] } }
      this.assessmentUserData[userId] = { ...otherAnswers, ...gcsTotal };
    } else {
      this.assessmentUserData[userId] = { ...otherAnswers };
    }
  }

  getGCSTotal = (userId) => {

    var gcsTotalData = filterObjectByKey(this.assessmentUserData[userId], (option) =>
      option.includes("P2-S3-G1-Q2-R1") == true,
    );
    return Object.values(gcsTotalData).length > 0 ? Object.values(gcsTotalData)[0]["answer"][0]["value"] : "N/A";
  }

  getPrimaryChiefCompliant = (userId) => {
    return this.extractData(userId, "P2-S1-G1-Q1-R1");
  }

  getSecondaryChiefCompliant = (userId) => {
    return this.extractData(userId, "P2-S1-G2-Q1-R1");
  }

  getPreviousAdmissionForARTUS = (userId) => {
    //"id": "P2-S5-G1-Q2-R4", "name": "Previous admission for ARTUS"
    return this.extractData(userId, "P2-S5-G1-Q2-R4");
  }

  getPreviousAdmissionForETOH = (userId) => {
    //"id": "P2-S5-G1-Q2-R5", "name": "Previous admission for ETOH"
    return this.extractData(userId, "P2-S5-G1-Q2-R5");
  }

  extractData = (userId, queryId) => {

    var filteredData = filterObjectByKey(this.assessmentUserData[userId], (option) =>
      option.includes(queryId) == true,
    );
    return Object.values(filteredData).length > 0 ? Object.values(Object.values(Object.values(filteredData)[0]["answer"]).reduce((pv: any, cv: any) => [...pv, cv.name], [])).join(", ") : "N/A";
  }

  populateToAssessment = (userId: string, data: any, fromKey: string, toKey: string) => {

    var dataString = JSON.stringify(data);
    dataString = dataString.split(fromKey + '-').join(toKey + '-');
    var newData = JSON.parse(dataString);

    var filteredTreatmentData = filterObjectByKey(this.assessmentUserData[userId], (option) =>
      option.includes(toKey) == false,
    );

    this.assessmentUserData[userId] = { ...filteredTreatmentData, ...newData };
  }
}

decorate(Assessment, {
  assessmentPrimaryFormData: observable,
  assessmentSecondaryFormData: observable,
  assessmentFrequentlyUsedFormData: observable,
  assessmentUserData: observable,
  assessmentHideSections: observable,
  getPrimaryAssessmentFormData: action,
  getSecondaryAssessmentFormData: action,
  getPrimaryAssessmentFrequentlyUsedFormData: action,
  setAssessmentUserData: action,
  populateToAssessment: action,
  gcsOperation: action,
  getGCSTotal: action,
  getPrimaryChiefCompliant: action,
  getSecondaryChiefCompliant: action,
  getPreviousAdmissionForARTUS: action,
  getPreviousAdmissionForETOH: action
});
