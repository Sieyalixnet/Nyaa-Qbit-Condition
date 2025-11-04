import { TorrentElement } from "../types";

export let config = {
  port: "8080",
  refreshInterval: 3000,
  recent:100
};
export let infoCallback: { cb: Function; event: MouseEvent | null; info: any; recent:string|null } = {
  cb: () => { },
  event: null,
  info: null,
  recent:null
};

export const TorrentElementList: Array<TorrentElement> = [];
export const initLoadConfig = () => {
  const savedData = localStorage.getItem('nyaa_qb_config');
  if (savedData) {
    const res = JSON.parse(savedData);
    for (const key of Object.keys((res as Object))) {
      //@ts-ignore
      config[key] = (res as Object)[key];
    }
  }
};

