import { adaptApiVendorToProfile } from "../api";
import { fallbackVendorPayloads } from "./fallbackVendorPayloads";

export const fallbackVendorProfiles = fallbackVendorPayloads.map((payload) =>
  adaptApiVendorToProfile(payload),
);
