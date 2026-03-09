export type RootStackParamList = {
  Init: undefined;
  Medic: {isNewUser: boolean};
  Auth: {screen: string};
  EmailVerification: {email: string};
};

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
  Forgot: undefined;
};

export type NonClinicalParamList = {
  NonClinical: undefined;
  AddPresentation: undefined;
};

export type VitalParamList = {
  Vitals: undefined;
  AddVitals: undefined;
  ViewVitals: {vitalsObj: any};
};

export type NarrativeParamList = {
  Narratives: undefined;
  NarrativesNotes: {narrativeObj: any};
};

export type HomeDrawerMenuParamList = {
  Home: undefined;
  EventHome: undefined;
  AssistRequest: undefined;
  EnRoute: undefined;
  OnScene: undefined;
  Profile: undefined;
  Demographic: undefined;
  Disposition: undefined;
  NonClinical: undefined;
  Vitals: undefined;
  RMA: undefined;
  Safeguard: undefined;
  Assessment: undefined;
  Handover: undefined;
  Resource: undefined;
  Info: undefined;
  Chat: undefined;
  EPCR: undefined;
  Emergency: undefined;
  Treatment: undefined;
  Narratives: undefined;
  ProfileNew: undefined;
};
