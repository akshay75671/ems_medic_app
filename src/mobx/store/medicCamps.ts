import {observable, action, decorate} from 'mobx';
import {fetchMedicCampsDetails} from '../../services/medicCamps';

interface medicCamp {
  name: string;
  medicCurrLocn: any;
}
export default class MedicCamps {
  medicCamps: medicCamp[] = [];
  loading: boolean;

  fetchMedicCampsData = (eventID: string) => {
    this.loading = true;
    fetchMedicCampsDetails(eventID)
      .then(
        action((response: any) => {
          this.medicCamps = response;
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
  reset = () => {};
}

decorate(MedicCamps, {
  medicCamps: observable,
  loading: observable,
  fetchMedicCampsData: action,
  reset: action,
});
