import {observable, action, decorate} from 'mobx';
import {fetchEventData} from '../../services/event';

export default class EventStore {
  event: any = null;
  loading: boolean;
  fetchEventData = (eventID) => {
    fetchEventData(eventID)
      .then(
        action((response: any) => {
          if (response) this.event = response;
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

decorate(EventStore, {
  event: observable,
  loading: observable,
  fetchEventData: action,
});
