import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db";
import type { Template, Submission } from "./schema";

/**
 * Templates collection - persists to localStorage
 * Each browser/visitor has their own templates
 */
export const templateCollection = createCollection(
  localStorageCollectionOptions<Template, string>({
    id: "templates",
    storageKey: "blockdocs-templates",
    getKey: (item) => item.id,
  })
);

/**
 * Submissions collection - persists to localStorage
 * Stores form submissions against templates
 */
export const submissionCollection = createCollection(
  localStorageCollectionOptions<Submission, string>({
    id: "submissions",
    storageKey: "blockdocs-submissions",
    getKey: (item) => item.id,
  })
);
