import { State } from "./script/const_value"

export type messageType = "command"|"config"|"getConfig"
export type PopoutMessage = {
    type:messageType
    content:any
}
export type ResponseMessage = {
    response:any
}
export type TorrentElement = {
  el: HTMLAnchorElement;
  magnetID: string;
  info: any;
};
export type TorrentInfoResponse = {
  info: any;
  state: State;
};
