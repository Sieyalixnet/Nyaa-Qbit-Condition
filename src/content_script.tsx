import { gettTorrentEmoji, mag_regex, State } from "./script/const_value";
import { getTorrentInfo } from "./script/api";
import { config, infoCallback, initLoadConfig, TorrentElementList } from "./script/link_value";
import { initRoot } from "./script/react_pages";


function editElBasingOnState(el: HTMLAnchorElement, state: State, resInfo: any) {
  el.innerHTML = gettTorrentEmoji(state)
  if (state !== State.None) {
    el.style.cursor = "pointer"
    //update if not click
    if (resInfo.hash === infoCallback.recent) {
      infoCallback.info = resInfo
      if (infoCallback.cb) infoCallback.cb(false)
    }

    el.onclick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      //update if click, show up the toolip
      infoCallback.event = e
      infoCallback.info = resInfo
      infoCallback.recent = resInfo.hash
      if (infoCallback.cb) infoCallback.cb(true)
      //
    }
  } else {
    el.style.cursor = "default"
  }
}


const init = async () => {
  initRoot()
  initLoadConfig()
  const tables: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("table tbody td a")
  for (const item of tables) {
    const el = document.createElement("a")
    if (String(item.href).startsWith("magnet:?") && item.parentElement) {
      el.innerHTML = ""
      const magnetID = String(item.href).match(mag_regex)?.[1]
      if (!magnetID) continue
      let res = null
      res = await getTorrentInfo(magnetID, config.port)
      item.parentElement.appendChild(el)
      editElBasingOnState(el, res.state, res.info)
      TorrentElementList.push({ el, magnetID, info: res.info })
    }
  }
  setInterval(update, config.refreshInterval || 3000)
}

const update = async () => {
  for (const item of TorrentElementList) {
    const res = await getTorrentInfo(item.magnetID, config.port)
    editElBasingOnState(item.el, res.state, res.info)

  }
}

init()