import { statsigAdapter } from "@flags-sdk/statsig";
import { flag, dedupe } from "flags/next";
import { getUserId } from './utils/getUserId';

export const identify = dedupe(async () => ({
  userID: getUserId(),
}));

export const createFeatureGate = (key) =>
  flag({
    key,
    adapter: statsigAdapter.featureGate((gate) => gate.value, { exposureLogging: true }),
    identify,
  });
