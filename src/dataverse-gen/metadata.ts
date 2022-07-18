/* eslint-disable*/
import { contactMetadata } from "./entities/Contact";

export const Entities = {
  Contact: "contact",
};

// Setup Metadata
// Usage: setMetadataCache(metadataCache);
export const metadataCache = {
  entities: {
    contact: contactMetadata,
  },
  actions: {
  }
};