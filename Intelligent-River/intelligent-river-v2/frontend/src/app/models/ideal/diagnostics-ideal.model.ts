// change basically nothing

export interface Observation {
  datetime?: number;
  deploymentId?: string;
  deploymentUri?: string;
  observationId?: string;
  originalMessage?: ObservationMessage;

  // not sure if these are still being used
  deviceId?: string;
  moteTime?: number;
  baseDateTime?: string;
  offsetTime?: number;
  observationDateTime?: string;
  sequenceNumber?: number;
}

export interface ObservationMessage {
  baseDateTime?: string;
  offsetTime?: number;
  sequenceNumber?: number;

  appDiagnostics?: AppDiagnostics;
  sdi12Diagnostics?: SDI12Diagnostics;
  oneWireDiagnostics?: OneWireDiagnostics;
  adsDiagnostics?: ADSDiagnostics;
  xbee900Diagnostics?: XBee900Diagnostics;
  gm862Diagnostics?: GM862Diagnostics;
  de910Diagnostics?: DE910Diagnostics;
  logDiagnostics?: LogDiagnostics;

  // not sure if these are ever being used
  datetime?: number;
  deploymentId?: string;
  deploymentUri?: string;
  observationId?: string;
  deviceId?: string;
  moteTime?: number;
  observationDateTime?: string;
}

export interface DiagnosticObservation {
  appDiagnostics?: AppDiagnostics;
  sdi12Diagnostics?: SDI12Diagnostics;
  oneWireDiagnostics?: OneWireDiagnostics;
  adsDiagnostics?: ADSDiagnostics;
  xbee900Diagnostics?: XBee900Diagnostics;
  gm862Diagnostics?: GM862Diagnostics;
  de910Diagnostics?: DE910Diagnostics;
  logDiagnostics?: LogDiagnostics;
  sequenceNumber?: number;
}

export interface AppDiagnostics {
  sampleAttempts?: number;
  sampleFailures?: number;
  sampleLosses?: number;
  radioAttempts?: number;
  radioFailures?: number;
  crcErrors?: number;
  nvsramEntries?: number;
  cumulativeUp?: number;
}

export interface SDI12Diagnostics {
  activationErrors?: number;
  conversionErrors?: number;
  collectionErrors?: number;
  cumulativeUp?: number;
}

export interface OneWireDiagnostics {
  activationErrors?: number;
  conversionErrors?: number;
  collectionErrors?: number;
  cumulativeUp?: number;
}

export interface ADSDiagnostics {
  wakeErrors?: number;
  configErrors?: number;
  conversionErrors?: number;
  sampleErrors?: number;
  cumulativeUp?: number;
}

export interface XBee900Diagnostics {
  wakeErrors?: number;
  cmdErrors?: number;
  sendErrors?: number;
  frameErrors?: number;
  baseRSSI?: number;
  cumulativeUp?: number;
}

export interface GM862Diagnostics {
  rssi?: number;
  ip?: string;
  wakeErrors?: number;
  sleepErrors?: number;
  setProfileErrors?: number;
  gsmRegistrationErrors?: number;
  gprsRegistrationErrors?: number;
  rssiErrors?: number;
  timeErrors?: number;
  smsStartErrors?: number;
  smsEndErrors?: number;
  getIpErrors?: number;
  dropIpErrors?: number;
  emailStartErrors?: number;
  emailEndErrors?: number;
  tcpConnectErrors?: number;
  tcpDisconnectErrors?: number;
  escapeErrors?: number;
  cumulativeUp?: number;
}

export interface LogDiagnostics {
  formatErrors?: number;
  headerReadErrors?: number;
  headerWriteErrors?: number;
  headerCorruptionErrors?: number;
  recordCorruptionErrors?: number;
  validationErrors?: number;
  enqueueErrors?: number;
  overflowErrors?: number;
  dequeueErrors?: number;
  underflowErrors?: number;
}

export interface DE910Diagnostics {
  rssi?: number;
  ip?: string;
  wakeErrors?: number;
  sleepErrors?: number;
  setProfileErrors?: number;
  networkRegistrationErrors?: number;
  rssiErrors?: number;
  timeErrors?: number;
  smsStartErrors?: number;
  smsEndErrors?: number;
  getIpErrors?: number;
  dropIpErrors?: number;
  emailStartErrors?: number;
  emailEndErrors?: number;
  tcpConnectErrors?: number;
  tcpDisconnectErrors?: number;
  escapeErrors?: number;
  cumulativeUp?: number;
}
