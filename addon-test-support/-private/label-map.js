import { dasherize } from "@ember/string";

const labelMap = new Map();

export function normalizeLabel(labelRaw) {
  return dasherize(labelRaw);
}

export function normalizedLabelCallbackFactory(callback) {
  return function withNormalizedLabel(labelRaw, ...args) {
    const label = normalizeLabel(labelRaw);
    return callback(label, ...args);
  }
}

export const setLabel    = normalizedLabelCallbackFactory((label, selector) => labelMap.set(label, selector));
export const hasLabel    = normalizedLabelCallbackFactory((label)           => labelMap.has(label));
export const getLabel    = normalizedLabelCallbackFactory((label)           => labelMap.get(label));
export const deleteLabel = normalizedLabelCallbackFactory((label)           => labelMap.delete(label));

export function clearLabels () { labelMap.clear(); }
