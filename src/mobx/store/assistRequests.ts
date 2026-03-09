import {observable, action, decorate} from 'mobx';
import PushNotification from 'react-native-push-notification';
import {getImageUriFromStorage, moveArrayItem} from '../../core/utils';
import stores from '../index';

import {
  startRequestListner,
  stopRequestListner,
  startHandoverListner,
  stopHandoverListner,
  getFamilyMemebers,
  addExcludeMedic,
  startAssistPositionListener,
  updateAssistRequestDetails,
  updateAssistFamilyRequestDetails,
  getAssistUserDetails,
} from '../../services/assistRequest';
import {getPTPDistance} from '../../services/locationService';
import {epcrTypes} from './epcr';

export interface assistRequestTypes {
  id: string;
  eventID: string;
  status: string;
  epcrNum: number;
  assistLocn: any;
  fullName: string;
  age: string;
  gender: string;
  desc: string;
  profilePic: string;
  profilePicUri: string;
  assistUserID: string;
  requesterType: string;
  distance: string;
  info: string[];
  excludeMedics: string[];
}
export default class AssistRequests {
  isEPCRgenerated: boolean = false;
  assistRequests: assistRequestTypes[] = [];
  activeAssistUser: assistRequestTypes = null;
  selectedProfile: string = undefined;
  requesters: string[] = [];
  familyList: any[] = [];
  familyFirst: any[] = [];
  loading: boolean = false;

  getAssistObject = (assistID) => {
    let user: assistRequestTypes = null;
    this.assistRequests.forEach((item, index) => {
      if (item.assistUserID == assistID) user = item;
    });
    return user;
  };
  getFamilyMemberObject = (assistID) => {
    let user: assistRequestTypes = null;
    this.familyList.forEach((item, index) => {
      if (item.assistUserID == assistID) user = item;
    });
    return user;
  };
  setProfilePic = (assistID, imageUri) => {
    let userObj = this.getAssistObject(assistID);
    if (userObj != null) userObj.profilePicUri = imageUri;
  };
  setMembersProfilePic = (assistID, imageUri) => {
    this.familyFirst.forEach((item, index) => {
      if (item.assistUserID == assistID) {
        item.profilePicUri = imageUri;
        //console.log(imageUri);
      }
    });
  };
  setDistance = (item) => {
    if (this.assistRequests.length == 0) return;
    item.distance = getPTPDistance(
      stores.profile.profile.medicLocn,
      item.assistLocn,
    );
  };
  getProfilePic = (item) => {
    if (this.assistRequests.length == 0) return;
    getImageUriFromStorage('profiles', item.profilePic)
      .then((imageUri: any) => {
        this.setProfilePic(item.assistUserID, imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getMembersProfilePic = (membersObj) => {
    getImageUriFromStorage('profiles', membersObj.profilePic)
      .then((imageUri: any) => {
        this.setMembersProfilePic(membersObj.assistUserID, imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  updateEpcrNumToAssistUser = (epcrs: epcrTypes[]) => {
    let assistRefIDs: string[] = [];
    epcrs.forEach((epcr, index) => {
      let userObj = this.getFamilyMemberObject(epcr.assistRequestID);
      if (userObj) {
        userObj.epcrNum = epcr.epcrNum;
        userObj.status = 'inProgress';
        if (this.activeAssistUser.assistUserID != epcr.assistRequestID)
          assistRefIDs.push(userObj.id);
      }
      if (this.activeAssistUser.assistUserID == epcr.assistRequestID) {
        // updateAssistRequestDetails(this.activeAssistUser.id, {
        //   epcrNum: epcr.epcrNum,
        //   status: 'inProgress',
        // });
        this.activeAssistUser.epcrNum = epcr.epcrNum;
        this.activeAssistUser.status = 'inProgress';
      }
    });
    // if (assistRefIDs.length > 0) {
    //   updateAssistFamilyRequestDetails(assistRefIDs)
    //     .then(
    //       action(() => {
    //         this.loading = false;
    //         this.startAssistPositionListener();
    //         this.isEPCRgenerated = true;
    //         this.assistRequests = [];
    //       }),
    //     )
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
    this.loading = false;
    this.startAssistPositionListener();
    this.isEPCRgenerated = true;
    this.assistRequests = [];
  };
  generateEpcrNumToAssistUser = (assistID, epcrNum) => {
    this.loading = true;
    let userObj = this.getAssistObject(assistID);
    if (userObj != null) {
      this.activeAssistUser = userObj;
      this.selectedProfile = assistID;
      let firstMember = {...userObj, parent: true};
      if (epcrNum) {
        firstMember['epcrNum'] = epcrNum;
        firstMember['status'] = 'inProgress';
      }
      this.familyList.push(firstMember);

      if (userObj.requesterType == 'Family Member') {
        this.familyFirst.forEach((item, index) => {
          this.familyList.push(item);
        });
      }
      if (this.familyList.length > 0 && !epcrNum)
        stores.epcr.generateEPCR(this.familyList);
    }
  };
  checkFamilyMembers = (assistObj) => {
    if (assistObj.requesterType == 'Family Member') {
      getFamilyMemebers(assistObj.assistUserID)
        .then((members: any) => {
          members.forEach((item, index) => {
            getAssistUserDetails(item.assistUserID)
              .then(
                action((details: any) => {
                  let userObj = {...item, ...details};
                  this.familyFirst.push(userObj);
                  this.getMembersProfilePic(userObj);
                }),
              )
              .catch((error) => {
                console.log(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  startRequestListener = (eventID) => {
    startRequestListner(eventID);
  };
  stopRequestListner = () => {
    stopRequestListner();
  };
  startHandoverListener = (eventID, userID) => {
    startHandoverListner(eventID, userID);
  };
  stopHandoverListner = () => {
    stopHandoverListner();
  };
  startAssistPositionListener = () => {
    startAssistPositionListener(this.activeAssistUser.id);
  };
  updateAssistPosition = (assistPosition) => {
    this.activeAssistUser.assistLocn.latitude = assistPosition.latitude;
    this.activeAssistUser.assistLocn.longitude = assistPosition.longitude;
  };
  gettingDataFromHandoverListener = (data) => {
    if (stores.profile.profile.status != 'available') return;
    if (data) {
      this.generateEpcrNumToAssistUser(data.assistUserID, data.epcrNum);
      let oldMedic = stores.medicProviders.getMedicObjByID(data.oldFbUserID);
      if (oldMedic)
        this.showPushNotification(
          'EPCR Handover',
          oldMedic + ' has transfered EPCR Number ' + data.epcrNum,
        );
      this.isEPCRgenerated = true;
    }
  };
  gettingDataFromRequestListener = (data) => {
    if (stores.profile.profile.status != 'available') return;
    data.forEach((item, index) => {
      if (item.excludeMedics) {
        if (item.excludeMedics.indexOf(stores.profile.profile.fbUserID) == -1) {
          if (this.requesters.indexOf(item.assistUserID) == -1)
            this.setUpItems(item);
        } else {
          let index = this.requesters.indexOf(item.assistUserID);
          let tempArr = [...this.assistRequests];
          if (index != -1) {
            this.requesters.splice(index, 1);
            tempArr.splice(index, 1);
            this.assistRequests = tempArr;
          }
        }
      } else {
        if (this.requesters.indexOf(item.assistUserID) == -1)
          this.setUpItems(item);
      }
    });
  };
  setUpItems = (item: any) => {
    let _self = this;
    getAssistUserDetails(item.assistUserID)
      .then(
        action((details: any) => {
          let userObj: assistRequestTypes = {...item, ...details};
          _self.requesters.push(item.assistUserID);
          _self.assistRequests.push(userObj);
          _self.getProfilePic(userObj);
          _self.setDistance(userObj);
          _self.checkFamilyMembers(userObj);
          _self.showPushNotification(
            'New Request',
            userObj.fullName + ' has send request',
          );
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  };
  removeRequest = (assistID) => {
    let userObj = this.getAssistObject(assistID);
    let tempArr: string[] = userObj.excludeMedics ? userObj.excludeMedics : [];
    tempArr.push(stores.profile.profile.fbUserID);
    addExcludeMedic(userObj.id, tempArr);
  };
  setAssistSelection = (assistID) => {
    this.selectedProfile = assistID;
  };
  showPushNotification = (_title, _message) => {
    // PushNotification.localNotification({
    //   channelId: 'ems_medic_channel',
    //   title: _title,
    //   message: _message,
    // });
  };
  reset = () => {};
}

decorate(AssistRequests, {
  isEPCRgenerated: observable,
  assistRequests: observable,
  activeAssistUser: observable,
  familyList: observable,
  familyFirst: observable,
  loading: observable,
  selectedProfile: observable,
  requesters: observable,
  setUpItems: action,
  gettingDataFromRequestListener: action,
  gettingDataFromHandoverListener: action,
  setAssistSelection: action,
  removeRequest: action,
  checkFamilyMembers: action,
  getAssistObject: action,
  getFamilyMemberObject: action,
  getProfilePic: action,
  setDistance: action,
  setProfilePic: action,
  setMembersProfilePic: action,
  getMembersProfilePic: action,
  generateEpcrNumToAssistUser: action,
  updateEpcrNumToAssistUser: action,
  updateAssistPosition: action,
  reset: action,
});
