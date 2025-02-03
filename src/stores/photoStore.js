import { atom } from 'nanostores';

export const currentGroup = atom(null);

export function setPhotoGroup(group) {
  currentGroup.set(group);
}
