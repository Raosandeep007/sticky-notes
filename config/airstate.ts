import { configure } from "@airstate/client";

export const airstate = {
  appKey: import.meta.env.VITE_AIRSTATE_APP_KEY,
};

configure({
  appKey: airstate.appKey,
});
