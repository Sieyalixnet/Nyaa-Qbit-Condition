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


export const getTorrentInfoRecently = async (limit:number,port:string): Promise<Array<any>> => {
  const res = await axios.get(`http://localhost:${port}/api/v2/torrents/info?limit=${limit}&sort=added_on&reverse=true`)
  if (res.data.length > 0) {
    return res.data

  }
  return []
}

export const getTorrentInfoRecentlyContainName = async (name:string,port:string,limit:number): Promise<Array<any>> => {
  const data = await getTorrentInfoRecently(limit,port)
  const trimmedName = name.trim()
  return data.filter((item:any) => item.name.includes(trimmedName || item.content_path.includes(trimmedName)))
}