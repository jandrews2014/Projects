import { ObservationMessage } from './diagnostics-ideal.model';
import { Data } from './data-ideal.model';

// remove deployment key and replace it with deploymentId
export interface Status {
  deploymentId?: {
    // remove deployment object, remove lastmessage key with the diagnostics and sdi12 samples key
    diagnostics: ObservationMessage;

    // give me ONLY one, not 3 and have me figure out which one is the latest
    // change the sdi12samples key to just data
    data?: Data;
  };
}
