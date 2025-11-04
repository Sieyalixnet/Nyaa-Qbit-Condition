import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { initLoadConfig } from "./link_value";
import { config, infoCallback } from "./link_value";
import { round } from "./utils";
import {getTorrentInfoRecently,getTorrentInfoRecentlyContainName} from "./api"
function SearchConatiner() {

  const [selectedText, setSelectedText] = useState("");
  const [mouseIn, setMouseIn] = useState(false);
  const [recentData, setRecentData] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [infoIndex, setInfoIndex] = useState(-1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [info, setInfo] = useState({
      name: "",
      content_path: "",
      total_size: "",
      // addded_on: "",
      percentage: "",
      // completion_on:""
    });
  const initTextSelect = () => {
    document.addEventListener("selectionchange", (e: Event) => {
      const selection = (window.getSelection() as any).toString().trim();
      setSelectedText(selection);
    })

  }
    useEffect(() => {
    initTextSelect()
  }, [])

  useEffect(() => {
    if (selectedText.length === 0) {
      return
    }
  }, [selectedText]);

  const searchRecently = async () => {
    const data = await getTorrentInfoRecentlyContainName(selectedText, config.port,config.recent);
    setRecentData(data)
  }

  const showInfoCallBack=(index:number,event:MouseEvent)=>{
    setShow(true)
    setInfoIndex(index)
    const new_info = {
        name: recentData[index].name,
        content_path: recentData[index].content_path,
        total_size: String(round(recentData[index].total_size / 1024 / 1024, 2)) + "mb",
        // addded_on: moment(recentData[index].addded_on).format("YYYY-MM-DD HH:mm:ss"),
        percentage: String(round((recentData[index].completed / recentData[index].total_size) * 100, 2)) + "%"
        // completion_on:moment(recentData[index].completion_on).format("YYYY-MM-DD HH:mm:ss")
      };
    setMousePosition({ x: 0, y: event.clientY+20 });
    setInfo(new_info);
  }
  const openPage=(index:number)=>{
    window.open(`https://nyaa.si/?f=0&c=0_0&q=${recentData[index].name}`);
  }

  return (
    <div style={{backgroundColor: 'rgba(255,255,255,0.8)',maxHeight:"40vh", width: "300px", border: "1px solid rgb(40,120,80)",display:selectedText.length===0?"none":"flex", padding: "8px", margin: "1px", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", opacity: mouseIn ? "0.9" : "0.2", borderRadius: "2px"}} onMouseEnter={() => setMouseIn(true)} onMouseLeave={() => setMouseIn(false)}>
      <div style={{borderBottom:"1px solid rgb(40,120,255)", paddingBottom:"2px",width:"100%"}}>
      <p>{selectedText}</p>
      <button onClick={searchRecently}>Search in Recent</button>
      </div>
      <div style={{ minHeight: "100px", maxHeight: "35vh", overflowY: "scroll",overflowX:"hidden",flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
      {recentData.length > 0 ? recentData.map((item: any,index:number) => {
        return <p onMouseOver={(e)=>showInfoCallBack(index,e as any)} style={{cursor:"pointer",color:"rgb(40,80,120)",textDecoration:"underline", textOverflow: "ellipsis",whiteSpace:"nowrap"}} key={item.name} onMouseOut={()=>{setShow(false)}}>{item.name}</p>
      }) : <p>no data</p>}</div>
      {show?<InfoWindow info={info} mousePosition={mousePosition}></InfoWindow>:null}
    </div>
  )

}

function ConfigContainer() {

  const [detailConfig, editDetailConfig] = useState<typeof config>({ port: "8080", refreshInterval: 3000,recent:100 });
  const [mouseIn, setMouseIn] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const saveDetailConfig = () => {
    setShowTips(true);
    localStorage.setItem('nyaa_qb_config', JSON.stringify(detailConfig));
    for (const key of Object.keys(config)) {
      //@ts-ignore
      config[key] = detailConfig[key];
    }
  };
  const loadDetailConfig = () => {
    initLoadConfig();
    for (const key of Object.keys(config)) {
      //@ts-ignore
      detailConfig[key] = config[key];
    }
  };
  useEffect(() => {

    loadDetailConfig();
  }, []);

  return (<div style={{ backgroundColor: 'rgba(255,255,255,0.8)', minHeight: "100px", maxHeight: "40vh", overflowY: "scroll", width: "300px", border: "1px solid rgb(40,120,80)", padding: "8px", margin: "1px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", opacity: mouseIn ? "0.9" : "0.2", borderRadius: "2px" }} onMouseEnter={() => setMouseIn(true)} onMouseLeave={() => setMouseIn(false)}>

    <div style={{ marginTop: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", width: "100%" }}>
      <p style={{ color: "rgb(0,0,0)", fontWeight: "bold" }}> Port:</p>
      <input value={detailConfig.port} onChange={(e) => { editDetailConfig({ ...detailConfig, port: e.target.value }); }}></input>
    </div>
    <div style={{ marginTop: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", width: "100%" }}>
      <p style={{ color: "rgb(0,0,0)", fontWeight: "bold" }}> Refresh(ms):</p>
      <input value={detailConfig.refreshInterval} onChange={(e) => { editDetailConfig({ ...detailConfig, refreshInterval: Number(e.target.value) }); }}></input>
    </div>
    <div style={{ marginTop: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", width: "100%" }}>
      <p style={{ color: "rgb(0,0,0)", fontWeight: "bold" }}> Recent:</p>
      <input value={detailConfig.recent} onChange={(e) => { editDetailConfig({ ...detailConfig, recent: Number(e.target.value) }); }}></input>
    </div>
    {showTips ? <div>
      <p style={{ color: "red" }}>Refresh the page to apply the changes</p>
    </div> : <></>}
    <div style={{ marginTop: "4px", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
      <button onClick={saveDetailConfig}>Save</button>
    </div>
  </div>);
}
function InfoWindow(props:{info:any,mousePosition:any}) {
  const { info, mousePosition } = props

  return(
  <div style={{ position: "absolute", top: mousePosition.y + "px", left: mousePosition.x  + "px", zIndex: "1000", backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid rgb(40,120,255)', borderRadius: '2px', padding: '4px' }}>

        <div style={{ display: "block", maxWidth: "400px" }}>
          {/* @ts-ignore */}
          {Object.entries(info).map(([key, value]) => (
            <div key={key} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", width: "100%", borderBottom: '1px solid rgb(40,120,255)', padding: '2px' }}>
              <p style={{ color: "rgb(0,80,80)", fontWeight: "bold", paddingRight: "4px" }}>{key}</p> <p style={{ color: "rgb(90,0,0)" }}>{value}</p>
            </div>
          ))}

        </div>
      </div>
      )
}
export function initRoot() {
  const appContainer = document.createElement("div");
  appContainer.id = "formatter_app";
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);

  const RenderConfig = () => {
    const [show, setShow] = useState(false);


    return (
    <>
    <div style={{ position: "fixed", top: "0px", left: "0px", zIndex: "1000" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <button style={{ border: `${show ? '1px solid rgb(40,120,80)' : '1px solid rgb(40,120,255)'}`, backgroundColor: "rgb(20,20,40)", color: "white", borderRadius: "2px", cursor: "pointer" }} onClick={() => setShow(!show)}>{show ? 'Hide' : 'Config'}</button></div>
      <div style={{ display: show ? "block" : "none" }}>
        <ConfigContainer></ConfigContainer>

      </div>
    </div>
    <div style={{ position: "fixed", top: "0px", right: "0px", zIndex: "1000" }}>
      <SearchConatiner></SearchConatiner>
    </div>
    </>
    );
  };


  const RenderInfo = () => {
    const [show, setShow] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [info, setInfo] = useState({
      name: "",
      content_path: "",
      total_size: "",
      // addded_on: "",
      percentage: "",
      // completion_on:""
    });

    infoCallback.cb = (showSwitch?: boolean) => {
      if (showSwitch) setShow(!show);
      // console.log(infoCallback.event);
      // console.log(infoCallback.info);
      if (show === true || showSwitch === true) {
        setMousePosition({ x: (infoCallback.event as MouseEvent).pageX +10, y: (infoCallback.event as MouseEvent).pageY +10 });
      }
      setInfo(infoCallback.info);
      const new_info = {
        name: infoCallback.info.name,
        content_path: infoCallback.info.content_path,
        total_size: String(round(infoCallback.info.total_size / 1024 / 1024, 2)) + "mb",
        // addded_on: moment(infoCallback.info.addded_on).format("YYYY-MM-DD HH:mm:ss"),
        percentage: String(round((infoCallback.info.completed / infoCallback.info.total_size) * 100, 2)) + "%"
        // completion_on:moment(infoCallback.info.completion_on).format("YYYY-MM-DD HH:mm:ss")
      };
      setInfo(new_info);
    };


    return (
      <>{show ? <InfoWindow info={info} mousePosition={mousePosition}></InfoWindow> : <></>}</>);
  };
  root.render(
    <React.StrictMode>
      <RenderConfig></RenderConfig>
      <RenderInfo></RenderInfo>
    </React.StrictMode>
  );

}
