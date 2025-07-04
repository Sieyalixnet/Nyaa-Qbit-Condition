import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { initLoadConfig } from "./link_value";
import { config, infoCallback } from "./link_value";
import { round } from "./utils";

function ConfigContainer() {

  const [detailConfig, editDetailConfig] = useState<typeof config>({ port: "8080", refreshInterval: 3000 });
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
    {showTips ? <div>
      <p style={{ color: "red" }}>Refresh the page to apply the changes</p>
    </div> : <></>}
    <div style={{ marginTop: "4px", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
      <button onClick={saveDetailConfig}>Save</button>
    </div>
  </div>);
}
export function initRoot() {
  const appContainer = document.createElement("div");
  appContainer.id = "formatter_app";
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);

  const RenderConfig = () => {
    const [show, setShow] = useState(false);


    return (<div style={{ position: "fixed", top: "0px", left: "0px", zIndex: "1000" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <button style={{ border: `${show ? '1px solid rgb(40,120,80)' : '1px solid rgb(40,120,255)'}`, backgroundColor: "rgb(20,20,40)", color: "white", borderRadius: "2px", cursor: "pointer" }} onClick={() => setShow(!show)}>{show ? 'Hide' : 'Config'}</button></div>
      <div style={{ display: show ? "block" : "none" }}>
        <ConfigContainer></ConfigContainer>

      </div>
    </div>);
  };

  const RenderInfo = () => {
    const [show, setShow] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [info, setInfo] = useState({
      name: "",
      content_path: "",
      total_size: "",
      // addded_on: "",
      percentage:"",
      // completion_on:""
    });

    infoCallback.cb = (showSwitch?:boolean) => {
      if(showSwitch)setShow(!show);
      // console.log(infoCallback.event);
      // console.log(infoCallback.info);
      if(show===true||showSwitch===true){
      setMousePosition({ x: (infoCallback.event as MouseEvent).pageX, y: (infoCallback.event as MouseEvent).pageY });}
      setInfo(infoCallback.info);
      const new_info = {
        name: infoCallback.info.name,
        content_path: infoCallback.info.content_path,
        total_size: String(round(infoCallback.info.total_size / 1024 / 1024, 2)) + "mb",
        // addded_on: moment(infoCallback.info.addded_on).format("YYYY-MM-DD HH:mm:ss"),
        percentage: String(round((infoCallback.info.completed/infoCallback.info.total_size)*100,2))+"%"
        // completion_on:moment(infoCallback.info.completion_on).format("YYYY-MM-DD HH:mm:ss")
      };
      setInfo(new_info);
    };


    return (
      <>{show ? <div style={{ position: "absolute", top: mousePosition.y + 10 + "px", left: mousePosition.x + 10 + "px", zIndex: "1000", backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid rgb(40,120,255)', borderRadius: '2px', padding: '4px' }}>

        <div style={{ display: "block", maxWidth: "400px" }}>
          {/* @ts-ignore */}
          {Object.entries(info).map(([key, value]) => (
            <div key={key} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", width: "100%", borderBottom: '1px solid rgb(40,120,255)', padding: '2px' }}>
              <p style={{ color: "rgb(0,80,80)", fontWeight: "bold", paddingRight: "4px" }}>{key}</p> <p style={{ color: "rgb(90,0,0)" }}>{value}</p>
            </div>
          ))}

        </div>
      </div> : <></>}</>);
  };
  root.render(
    <React.StrictMode>
      <RenderConfig></RenderConfig>
      <RenderInfo></RenderInfo>
    </React.StrictMode>
  );

}
