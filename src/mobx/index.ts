import AssistRequests from './store/assistRequests';
import UserW3WLocation from './store/userW3WLocation';
import EPCR from './store/epcr';
import Profile from './store/profile';
import Demographic from './store/demographic';
import Disposition from './store/disposition';
import MedicProviders from './store/medicProvider';
import MedicCamps from './store/medicCamps';
import EventStore from './store/event';
import AssessmentStore from './store/assessment';
import TreatmentStore from './store/treatment';
import Narratives from './store/narratives';
import NonClinical from './store/nonClinical';
import Vitals from './store/vitals';
import Safeguard from './store/safeguard';
import Resource from "./store/resource";

class StoreRoot {
  public userW3WLocation = new UserW3WLocation();
  public assistRequests = new AssistRequests();
  public demographic = new Demographic();
  public disposition = new Disposition();
  public medicProviders = new MedicProviders();
  public medicCamps = new MedicCamps();
  public epcr = new EPCR();
  public profile = new Profile();
  public eventStore = new EventStore();
  public assessmentStore = new AssessmentStore();
  public treatmentStore = new TreatmentStore();
  public nonClinical = new NonClinical();
  public vitals = new Vitals();
  public safeguard = new Safeguard();
  public narratives = new Narratives();
  public resource = new Resource();
  public reset = () => {};
}

export default new StoreRoot();
