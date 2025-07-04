import axios from "axios";
import { TorrentInfoResponse } from "../types";
import { State } from "./const_value";

export const getTorrentInfo = async (magnetID: string,port:string): Promise<TorrentInfoResponse> => {
  const res = await axios.get(`http://localhost:${port}/api/v2/torrents/info?hashes=${magnetID}`)
  if (res.data.length > 0) {
    return {
      info: res.data[0],
      state: res.data[0].state as State
    }

  }
  return {
    info: {},
    state: State.None
  }
}
