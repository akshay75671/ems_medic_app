import {observable, action, decorate} from 'mobx';
import {getImageUriFromStorage} from '../../core/utils';
import {
  fetchMedicsDetails,
  fetchMedicsInfo,
  updateMedictDetails,
} from '../../services/medicProviders';

interface MEDIC {
  name: string;
  profilePicUri: string;
  medicCurrLocn: any;
  fbUserID: string;
  status: string;
}
export default class MedicProviders {
  medics: MEDIC[] = [];
  loading: boolean;

  fetchMedicData = (eventID: string) => {
    this.loading = true;
    fetchMedicsDetails(eventID)
      .then(
        action((response: any) => {
          this.medics = response;
          this.fetchMedicsDetails();
          this.loading = false;
        }),
      )
      .catch(
        action((msg) => {
          this.loading = false;
          console.log(msg);
        }),
      );
  };
  fetchMedicsDetails = () => {
    if (this.medics.length > 0) {
      this.medics.forEach((item, index) => {
        let medicDetails = new getMedicDetails();
        medicDetails.fetchData(
          item.fbUserID,
          this.setMedicDetails,
          this.setProfilePic,
        );
      });
    }
  };
  setMedicDetails = (medicID, name) => {
    this.medics.forEach((item, index) => {
      if (item.fbUserID == medicID) item.name = name;
    });
  };
  setProfilePic = (medicID, uri) => {
    this.medics.forEach((item, index) => {
      if (item.fbUserID == medicID) item.profilePicUri = uri;
    });
  };
  getMedicObjByID = (medicID) => {
    let medic = null;
    this.medics.forEach((item, index) => {
      if (item.fbUserID == medicID) medic = item;
    });
    return medic;
  };
  updateMedicStatus = (userID) => {
    let userObj = this.getMedicObjByID(userID);
    if (userObj) {
      updateMedictDetails(userObj.id, {
        status: 'inProgress',
      });
    }
  };
  reset = () => {};
}

decorate(MedicProviders, {
  medics: observable,
  loading: observable,
  fetchMedicData: action,
  setMedicDetails: action,
  setProfilePic: action,
  reset: action,
});

class getMedicDetails {
  fetchData = (medicID, nameCallback, picCallback) => {
    fetchMedicsInfo(medicID)
      .then((response: any) => {
        nameCallback(medicID, response.name);
        this.getProfilePic(medicID, response.profilePic, picCallback);
      })
      .catch((msg) => {
        console.log(msg);
      });
  };
  getProfilePic = (medicID, profilePic, picCallback) => {
    getImageUriFromStorage('profiles', profilePic)
      .then((imageUri: any) => {
        picCallback(medicID, imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
