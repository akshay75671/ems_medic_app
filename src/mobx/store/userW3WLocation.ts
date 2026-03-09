import { observable, configure, action, decorate, runInAction } from "mobx";
import { LatLng } from "react-native-maps";
import { convertTow3w } from '../../services/w3wServices';

configure({ enforceActions: "observed" });

export default class UserW3WLocation {

  w3words = "";

  convertGeoToW3W = (coordinate: LatLng) => {

    convertTow3w(coordinate).then((data: any) => {

      // {"data":{"convertTo3wa":{"data":"{\"country\":\"US\",\"square\":{\"southwest\":{\"lng\":-85.922918,\"lat\":39.47348},\"northeast\":{\"lng\":-85.922883,\"lat\":39.473507}},\"nearestPlace\":\"Franklin, Indiana\",\"coordinates\":{\"lng\":-85.922901,\"lat\":39.473493},\"words\":\"anyone.sequel.degrading\",\"language\":\"en\",\"map\":\"https://w3w.co/anyone.sequel.degrading\"}","status":"Success","message":"What 3 words retrieved from coordinates."}}}

      runInAction(() => {
        this.w3words = JSON.parse(data["data"]["convertTo3wa"]["data"]).words;
      })

    }).catch(error => {
      runInAction(() => {
        this.w3words = "";
      })
    })
  }
}

decorate(UserW3WLocation, {
  w3words: observable,
});
