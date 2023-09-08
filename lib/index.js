"use client";
var ql=Object.create;var Io=Object.defineProperty;var Kl=Object.getOwnPropertyDescriptor;var Yl=Object.getOwnPropertyNames;var Xl=Object.getPrototypeOf,Jl=Object.prototype.hasOwnProperty;var Ql=(e,t)=>{for(var o in t)Io(e,o,{get:t[o],enumerable:!0})},jr=(e,t,o,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Yl(t))!Jl.call(e,r)&&r!==o&&Io(e,r,{get:()=>t[r],enumerable:!(i=Kl(t,r))||i.enumerable});return e};var m=(e,t,o)=>(o=e!=null?ql(Xl(e)):{},jr(t||!e||!e.__esModule?Io(o,"default",{value:e,enumerable:!0}):o,e)),Zl=e=>jr(Io({},"__esModule",{value:!0}),e);var Zp={};Ql(Zp,{Box:()=>Qt,Button:()=>jl,CheckBox:()=>tt,FormLabel:()=>ct,FormTextField:()=>Vo,FrigadeBanner:()=>Ll,FrigadeChecklist:()=>ar,FrigadeDefaultAppearance:()=>Re,FrigadeEmbeddedTip:()=>Bl,FrigadeForm:()=>Tr,FrigadeGuide:()=>nl,FrigadeHeroChecklist:()=>Gs,FrigadeNPSSurvey:()=>Wl,FrigadeProgressBadge:()=>rl,FrigadeProvider:()=>gn,FrigadeSupportWidget:()=>Tl,FrigadeTour:()=>ml,ProgressRing:()=>It,Text:()=>dr,tokens:()=>er,useFlowOpens:()=>Ne,useFlowResponses:()=>Ht,useFlows:()=>R,useOrganization:()=>Qo,useTheme:()=>Gl.useTheme,useUser:()=>jt});module.exports=Zl(Zp);var Y=m(require("react")),mn=require("styled-components");var Ce=m(require("react"));var He=require("react");var Bt=m(require("react"));var Gr="1.32.18";var _e="NOT_STARTED_STEP",ie="COMPLETED_FLOW",No="ABORTED_FLOW",Et="STARTED_FLOW",je="NOT_STARTED_FLOW",Ge="COMPLETED_STEP",Oo="STARTED_STEP";function Ze(){let{publicApiKey:e,userId:t,apiUrl:o}=Bt.default.useContext(K);return{config:(0,Bt.useMemo)(()=>({headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json","X-Frigade-SDK-Version":Gr,"X-Frigade-SDK-Platform":"React"}}),[e,t]),apiUrl:(0,Bt.useMemo)(()=>`${o}/v1/public/`,[o])}}var Rl="frigade-last-call-at-",ea="frigade-last-call-data-";function zt(){let{shouldGracefullyDegrade:e,readonly:t}=Bt.default.useContext(K);return async(o,i)=>{if(t&&(i.method==="POST"||i.method==="PUT"||i.method==="DELETE"))return Ut();if(e)return console.log(`Skipping ${o} call to Frigade due to error`),Ut();let r=Rl+o,n=ea+o;if(window&&window.localStorage&&i&&i.body&&i.method==="POST"){let p=window.localStorage.getItem(r),d=window.localStorage.getItem(n);if(p&&d&&d==i.body){let a=new Date(p);if(new Date().getTime()-a.getTime()<1e3)return Ut()}window.localStorage.setItem(r,new Date().toISOString()),window.localStorage.setItem(n,i.body)}let s;try{s=await fetch(o,i)}catch(p){return Ut(p)}return s?s.ok?s:Ut(s.statusText):Ut()}}function Ut(e){return e&&console.log("Call to Frigade failed",e),{json:()=>({})}}function _t(){let{publicApiKey:e,shouldGracefullyDegrade:t}=Bt.default.useContext(K);function o(){return t?(console.error("Frigade hooks cannot be used when Frigade SDK has failed to initialize"),!1):e?!0:(console.error("Frigade hooks cannot be used outside the scope of FrigadeProvider"),!1)}return{verifySDKInitiated:o}}var co=require("react");var Wt=require("react");var Kr=m(require("swr"));var qr=require("react");function Ne(){let{openFlowStates:e,setOpenFlowStates:t,hasActiveFullPageFlow:o,setCompletedFlowsToKeepOpenDuringSession:i,completedFlowsToKeepOpenDuringSession:r}=(0,qr.useContext)(K);function n(c,x=!1){return e[c]??x}function s(c,x){t(b=>({...b,[c]:x}))}function p(c){t(x=>{let{[c]:b,...F}=x;return{...F}})}function d(c){r.includes(c)||i(x=>[...x,c])}function a(c){return r.includes(c)}function y(c){return Object.entries(e).some(([x,b])=>b&&x!=c)||o}return{getOpenFlowState:n,setOpenFlowState:s,resetOpenFlowState:p,hasOpenModals:y,setKeepCompletedFlowOpenDuringSession:d,shouldKeepCompletedFlowOpenDuringSession:a}}var Yr=m(require("swr/immutable")),ta="unknown";function We(){let{config:e,apiUrl:t}=Ze(),{publicApiKey:o,userId:i,organizationId:r,flows:n,setShouldGracefullyDegrade:s,readonly:p}=(0,Wt.useContext)(K),{resetOpenFlowState:d}=Ne(),[a,y]=(0,Wt.useState)(!1),c={data:n.map(S=>({flowId:S.id,flowState:ie,lastStepId:null,userId:i,foreignUserId:i,stepStates:{},shouldTrigger:!1}))},x=S=>fetch(S,e).then(A=>{if(A.ok)return A.json();throw new Error("Failed to fetch user flow states")}).catch(A=>(console.log(`Error fetching ${S}: ${A}. Will gracefully degrade and hide Frigade`),s(!0),c)),b=o&&n&&i?`${t}userFlowStates?foreignUserId=${encodeURIComponent(i)}${r?`&foreignUserGroupId=${encodeURIComponent(r)}`:""}`:null,{data:F,isLoading:P,mutate:f,error:B}=p?(0,Yr.default)(b,x):(0,Kr.default)(b,x,{revalidateOnFocus:!0,revalidateIfStale:!0,keepPreviousData:!0,revalidateOnMount:!0,errorRetryInterval:1e4,errorRetryCount:3,onError:()=>c,onLoadingSlow:()=>c}),h=F==null?void 0:F.data;(0,Wt.useEffect)(()=>{!a&&!P&&h&&y(!0)},[h,a,P]);async function k(S){if(h&&!p){let A=h.find(D=>D.flowId===S);A&&A.flowState!==ie&&(A.flowState=ie),await f(Promise.resolve({...F,data:h}),{optimisticData:{...F,data:h},revalidate:!1,rollbackOnError:!1})}}async function L(S,A,D){if(h){let O=h.find(U=>U.flowId===S);O&&(O.stepStates[A]=D,O.flowState=Et),await f(Promise.resolve({...F,data:h}),{optimisticData:{...F,data:h},revalidate:!1,rollbackOnError:!1})}}async function C(S,A,D){if(h){let O=h.find(U=>U.flowId===S);O&&(O.lastStepId=A,O.stepStates[A]=D,O.flowState=Et),await f({...F,data:h},{optimisticData:{...F,data:h},revalidate:!1,rollbackOnError:!1})}}async function u(S){if(h){let A=h.find(D=>D.flowId===S);A&&A.flowState!==je&&(A.flowState=je,A.lastStepId=ta,Object.keys(A.stepStates).forEach(D=>{A.stepStates[D].actionType=_e,A.stepStates[D].createdAt=new Date().toISOString()}),await f({...F,data:h},{optimisticData:{...F,data:h},revalidate:!1,rollbackOnError:!1}),d(S))}}async function T(S,A){if(h){let D=h.find(O=>O.flowId===S);D&&D.stepStates[A]!==_e&&(D.stepStates[A]=_e),await f({...F,data:h},{optimisticData:{...F,data:h},revalidate:!1,rollbackOnError:!1})}}return{userFlowStatesData:h,isLoadingUserFlowStateData:!a,mutateUserFlowState:f,optimisticallyMarkFlowCompleted:k,optimisticallyMarkFlowNotStarted:u,optimisticallyMarkStepCompleted:L,optimisticallyMarkStepNotStarted:T,optimisticallyMarkStepStarted:C,error:B}}function Ht(){let{config:e,apiUrl:t}=Ze(),{userFlowStatesData:o,mutateUserFlowState:i}=We(),{failedFlowResponses:r,setFailedFlowResponses:n,flowResponses:s,setFlowResponses:p}=(0,co.useContext)(K),[d,a]=(0,co.useState)(new Set),[y,c]=(0,co.useState)(new Set),x=zt();function b(f){let B=JSON.stringify(f);if(d.has(B))return null;d.add(B),a(d),y.add(f),c(y);let h=s==null?void 0:s.find(k=>k.flowSlug===f.flowSlug&&k.stepId===f.stepId&&k.actionType===f.actionType&&k.createdAt===f.createdAt);return x(`${t}flowResponses`,{...e,method:"POST",body:B}).then(k=>{k.status!==200&&k.status!==201?(console.log("Failed to send flow response for step "+f.stepId+". Will retry again later."),n([...r,f])):h||p(L=>[...L??[],f])})}async function F(f){f.foreignUserId&&(f.actionType===Et||f.actionType===je?await b(f):f.actionType===ie?await b(f):f.actionType===Oo?await b(f):f.actionType===Ge?await b(f):f.actionType===No?await b(f):f.actionType===_e&&await b(f))}function P(){let f=[];return o==null||o.forEach(B=>{if(B&&B.stepStates&&Object.keys(B.stepStates).length!==0)for(let h in B.stepStates){let k=B.stepStates[h];f.push({foreignUserId:B.foreignUserId,flowSlug:B.flowId,stepId:k.stepId,actionType:k.actionType,data:{},createdAt:new Date(k.createdAt),blocked:k.blocked,hidden:k.hidden})}}),[...f,...s]}return{addResponse:F,setFlowResponses:p,getFlowResponses:P}}var Jr=m(require("swr"));var oa=/user.flow\(([^\)]+)\) == '?COMPLETED_FLOW'?/gm,Xr=e=>{let t=oa.exec(e);if(t===null)return null;let o=null;return t.forEach((i,r)=>{let n=ra(i,"'","");n.startsWith("flow_")&&(o=n)}),o},ra=function(e,t,o){return e.replace(new RegExp(t,"g"),o)};function R(){let{config:e,apiUrl:t}=Ze(),{flows:o,setFlows:i,userId:r,publicApiKey:n,customVariables:s,setCustomVariables:p,hasActiveFullPageFlow:d,setHasActiveFullPageFlow:a,setFlowResponses:y,setShouldGracefullyDegrade:c,readonly:x}=(0,He.useContext)(K),b={data:[]},{verifySDKInitiated:F}=_t(),{addResponse:P,getFlowResponses:f}=Ht(),B=g=>fetch(g,e).then(w=>w.ok?w.json():(console.log(`Error fetching ${g} (${w.status}): ${w.statusText}. .Will gracefully degrade and hide Frigade`),c(!0),b)).catch(w=>(console.log(`Error fetching ${g}: ${w}. Will gracefully degrade and hide Frigade`),c(!0),b)),{userFlowStatesData:h,isLoadingUserFlowStateData:k,optimisticallyMarkFlowCompleted:L,optimisticallyMarkFlowNotStarted:C,optimisticallyMarkStepCompleted:u,optimisticallyMarkStepNotStarted:T,optimisticallyMarkStepStarted:S}=We(),{data:A,error:D,isLoading:O}=(0,Jr.default)(n?`${t}flows${x?"?readonly=true":""}`:null,B,{keepPreviousData:!0});(0,He.useEffect)(()=>{if(D){console.error(D);return}A&&A.data&&i(A.data)},[A,D]);function U(g){if(O)return null;let w=o.find(E=>E.slug===g);return!w&&o.length>0&&!k&&!O?(console.log(`Flow with slug ${g} not found`),null):(w==null?void 0:w.active)===!1?null:w}function $(g){var I;if(!U(g))return[];let w=U(g).data;return w?(w=j(w),(((I=JSON.parse(w))==null?void 0:I.data)??[]).map(re=>{let vt=at(re);return{handleSecondaryButtonClick:()=>{re.skippable===!0&&fe(g,re.id,{skipped:!0})},...re,complete:he(g,re.id)===Ge||vt>=1,blocked:W(g,re.id),hidden:M(g,re.id),handlePrimaryButtonClick:()=>{(!re.completionCriteria&&(re.autoMarkCompleted||re.autoMarkCompleted===void 0)||re.completionCriteria&&re.autoMarkCompleted===!0)&&fe(g,re.id)},progress:vt}}).filter(re=>re.hidden!==!0)):[]}function j(g){return g.replaceAll(/\${(.*?)}/g,(w,E)=>s[E]===void 0?"":String(s[E]).replace(/[\u00A0-\u9999<>\&]/g,function(I){return"&#"+I.charCodeAt(0)+";"}).replaceAll(/[\\]/g,"\\\\").replaceAll(/[\"]/g,'\\"').replaceAll(/[\/]/g,"\\/").replaceAll(/[\b]/g,"\\b").replaceAll(/[\f]/g,"\\f").replaceAll(/[\n]/g,"\\n").replaceAll(/[\r]/g,"\\r").replaceAll(/[\t]/g,"\\t"))}function H(g){if(!U(g))return[];let w=U(g).data;return w?(w=j(w),JSON.parse(w)??{}):[]}function ae(g,w){p(E=>({...E,[g]:w}))}function ne(g){!k&&!O&&g&&JSON.stringify(s)!=JSON.stringify({...s,...g})&&Object.keys(g).forEach(w=>{ae(w,g[w])})}let Z=(0,He.useCallback)(async(g,w,E)=>{if(!F())return;let I={foreignUserId:r,flowSlug:g,stepId:w,actionType:Oo,data:E??{},createdAt:new Date,blocked:!1,hidden:!1};J(I)&&(await S(g,w,I),P(I))},[r,h]),se=(0,He.useCallback)(async(g,w,E)=>{if(!F())return;let I={foreignUserId:r,flowSlug:g,stepId:w,actionType:_e,data:E??{},createdAt:new Date,blocked:!1,hidden:!1};J(I)&&(await T(g,w),P(I))},[r,h]),fe=(0,He.useCallback)(async(g,w,E)=>{if(!F())return;let I={foreignUserId:r,flowSlug:g,stepId:w,actionType:Ge,data:E??{},createdAt:new Date,blocked:!1,hidden:!1};J(I)&&(await u(g,w,I),P(I))},[r,h]),oe=(0,He.useCallback)(async(g,w)=>{if(!F()||Je(g)===je)return;let E={foreignUserId:r,flowSlug:g,stepId:"unknown",actionType:je,data:w??{},createdAt:new Date,blocked:!1,hidden:!1};await C(g),J(E)&&P(E)},[r,h]),X=(0,He.useCallback)(async(g,w)=>{if(!F())return;let E={foreignUserId:r,flowSlug:g,stepId:"unknown",actionType:Et,data:w??{},createdAt:new Date,blocked:!1,hidden:!1};J(E)&&P(E)},[r,h]),ve=(0,He.useCallback)(async(g,w)=>{if(!F())return;let E={foreignUserId:r,flowSlug:g,stepId:"unknown",actionType:ie,data:w??{},createdAt:new Date,blocked:!1,hidden:!1};J(E)&&(await L(g),P(E))},[r,h]),De=(0,He.useCallback)(async(g,w)=>{if(!F())return;let E={foreignUserId:r,flowSlug:g,stepId:"unknown",actionType:No,data:w??{},createdAt:new Date,blocked:!1,hidden:!1};J(E)&&(await L(g),P(E))},[r,h]);function J(g){var w;if(!h&&g.actionType===_e)return!1;if(h){let E=h.find(I=>I.flowId===g.flowSlug);if(g.actionType===_e&&(!(E!=null&&E.stepStates[g.stepId])||E.stepStates[g.stepId].actionType===_e)||E&&((w=E.stepStates[g.stepId])==null?void 0:w.actionType)===g.actionType||E&&E.flowState===ie&&g.actionType===ie)return!1}return!0}function he(g,w){let E=pe(g,w);return k?null:E?E.actionType:_e}function W(g,w){let E=pe(g,w);return E?E.blocked:!1}function M(g,w){let E=pe(g,w);return E?E.hidden:!1}function pe(g,w){if(k)return null;let E=h==null?void 0:h.find(I=>I.flowId===g);return!E||!E.stepStates[w]?null:E.stepStates[w]??null}function q(g){var E;if(k||!h)return null;if(Je(g)===je)return $(g)[0]??null;let w=(E=h.find(I=>I.flowId===g))==null?void 0:E.lastStepId;return w?$(g).find(I=>I.id===w):null}function de(g){let w=q(g);if(!w)return 0;let E=$(g).findIndex(I=>I.id===w.id)??0;return he(g,w.id)===Ge&&E<$(g).length-1?E+1:E}function at(g){if(!g.completionCriteria)return;let w=Xr(g.completionCriteria);if(w===null)return;let E=Pt(w),I=V(w);return I===0?void 0:E/I}function Je(g){let w=h==null?void 0:h.find(E=>E.flowId===g);return w?w.flowState:null}function Pt(g){let w=$(g);return w.length===0?0:w.filter(I=>he(g,I.id)===Ge).length}function V(g){return $(g).length}function ze(g){let w=o.find(E=>E.slug===g);return w?JSON.parse(w.data):null}function Qe(g){if(x)return!1;if(k)return!0;if(g!=null&&g.targetingLogic&&h){let w=h.find(E=>E.flowId===g.slug);if(w)return w.shouldTrigger===!1}return!!(g!=null&&g.targetingLogic&&r&&r.startsWith("guest_"))}function mr(g){return!Qe(U(g))}return{getFlow:U,getFlowData:ze,isLoading:k||O,getStepStatus:he,getFlowSteps:$,getCurrentStepIndex:de,markStepStarted:Z,markStepCompleted:fe,markFlowNotStarted:oe,markFlowStarted:X,markFlowCompleted:ve,markFlowAborted:De,markStepNotStarted:se,getFlowStatus:Je,getNumberOfStepsCompleted:Pt,getNumberOfSteps:V,targetingLogicShouldHideFlow:Qe,setCustomVariable:ae,updateCustomVariables:ne,customVariables:s,getStepOptionalProgress:at,getFlowMetadata:H,isStepBlocked:W,isStepHidden:M,hasActiveFullPageFlow:d,setHasActiveFullPageFlow:a,isFlowAvailableToUser:mr}}var At=require("react");var Vt="guest_";function jt(){let{userId:e,organizationId:t,setUserId:o,setUserProperties:i,shouldGracefullyDegrade:r}=(0,At.useContext)(K),{config:n,apiUrl:s}=Ze(),{mutateUserFlowState:p}=We(),d=zt(),{verifySDKInitiated:a}=_t();(0,At.useEffect)(()=>{if(e&&!t){if(e.startsWith(Vt))return;let x=`frigade-user-registered-${e}`;localStorage.getItem(x)||(d(`${s}users`,{...n,method:"POST",body:JSON.stringify({foreignId:e})}),localStorage.setItem(x,"true"))}},[e,r,t]);let y=(0,At.useCallback)(async x=>{if(!a())return;let b={foreignId:e,properties:x};await d(`${s}users`,{...n,method:"POST",body:JSON.stringify(b)}),i(F=>({...F,...x})),p()},[e,n,r,p]),c=(0,At.useCallback)(async(x,b)=>{if(!a())return;let P={foreignId:e,events:[{event:x,properties:b}]};await d(`${s}users`,{...n,method:"POST",body:JSON.stringify(P)}),p()},[e,n,p]);return{userId:e,setUserId:o,addPropertiesToUser:y,trackEventForUser:c}}var tn=require("uuid");var Ie=m(require("react"));var Oe=m(require("react")),fo=m(require("styled-components"));var Zr=m(require("react")),Rr=m(require("styled-components"));var Qr="fr-",mo="cfr-";function l(e,t){let o=`${Qr}${e}`;if(!t)return o;if(t.styleOverrides&&t.styleOverrides[e]){if(typeof t.styleOverrides[e]=="string")return o+" "+t.styleOverrides[e];if(typeof t.styleOverrides[e]=="object")return o+" "+mo+e}return o}function v(e){if(!e.className||e.className.indexOf(mo)!==-1)return"";let o=e.className.replace(/\s+/g," ").split(" ");return o.length==1&&o[0].startsWith(Qr)?"":`:not(${o.map(i=>`.${i}`).join(", ")})`}function ur(e){return e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g,"$1-$2").toLowerCase()}function pt(e){return e!=null&&e.styleOverrides?Object.keys(e.styleOverrides).map(t=>`${ur(t)}: ${e.styleOverrides[t]};`).join(" "):""}function Ee(...e){return e.filter(Boolean).join(" ")}function uo(e){return e.charAt(0).toUpperCase()+e.slice(1)}var ia=Rr.default.div`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  ${e=>v(e)} {
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1400;
  }
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-name: fadeIn;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`,ei=({onClose:e,appearance:t})=>Zr.default.createElement(ia,{className:l("modalBackground",t),onClick:()=>e()});var Lo=m(require("react")),ti=m(require("styled-components")),na=ti.default.div`
  :hover {
    opacity: 0.8;
  }
`,$e=()=>Lo.default.createElement(na,null,Lo.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",fill:"none",viewBox:"0 0 20 20"},Lo.default.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.5",d:"M5 15L15 5M5 5l10 10"})));var ui=require("react-portal");var fr=m(require("react"));var Do=m(require("react"));function sa({style:e,className:t}){return Do.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"54",height:"14",fill:"none",viewBox:"0 0 54 14",style:e,className:t},Do.default.createElement("path",{fill:"currentColor",d:"M16.293 3.476v1.036h1.593v1.256h-1.593v5.098h-1.41V5.768H14V4.512h.883V3.244c0-.67.294-1.744 1.777-1.744.515 0 .969.049 1.361.146l-.233 1.232a5.939 5.939 0 00-.833-.073c-.442 0-.662.22-.662.67zm6.534.975V5.83c-.846 0-1.63.159-2.342.476v4.56h-1.41V4.513h1.263l.086.61c.846-.451 1.655-.67 2.403-.67zm2.505-.951c-.331.33-.944.33-1.287 0a.93.93 0 01-.246-.659c0-.268.086-.487.246-.646.343-.33.956-.33 1.287 0 .343.33.343.964 0 1.305zm.061 7.366h-1.41V4.512h1.41v6.354zm6.928-5.756c.246.146.368.402.368.756v4.976c0 1.804-.858 2.658-2.672 2.658-.92 0-1.753-.146-2.514-.439l.417-1.073c.674.22 1.336.33 1.974.33.98 0 1.385-.379 1.385-1.403v-.171c-.588.134-1.09.207-1.52.207-.907 0-1.655-.305-2.231-.902-.576-.598-.87-1.39-.87-2.354 0-.963.294-1.756.87-2.354.576-.61 1.324-.914 2.231-.914 1.005 0 1.864.232 2.562.683zm-2.488 4.634a5.15 5.15 0 001.446-.22V5.951a3.695 3.695 0 00-1.446-.292c-1.08 0-1.778.841-1.778 2.048 0 1.22.699 2.037 1.778 2.037zm7.34-5.317c1.52 0 2.28.878 2.28 2.634v3.805h-1.275l-.073-.524c-.601.414-1.288.621-2.084.621-1.263 0-2.06-.658-2.06-1.731 0-1.269 1.25-2.025 3.408-2.025.135 0 .503.013.662.013v-.171c0-1.012-.343-1.451-1.115-1.451-.675 0-1.435.158-2.256.475l-.466-1.012c1.017-.427 2.01-.634 2.979-.634zm-1.839 4.756c0 .427.343.695 1.017.695.528 0 1.251-.22 1.68-.512V8.22h-.441c-1.508 0-2.256.317-2.256.963zm9.953-4.549v-2.83h1.41v7.72c0 .354-.123.598-.368.757-.71.45-1.57.67-2.562.67-.907 0-1.655-.305-2.231-.902-.577-.61-.87-1.39-.87-2.354 0-.963.293-1.756.87-2.354.576-.61 1.324-.914 2.23-.914.43 0 .933.073 1.521.207zM43.84 9.72c.503 0 .981-.098 1.447-.293V5.854a5.15 5.15 0 00-1.447-.22c-1.078 0-1.777.817-1.777 2.037s.699 2.049 1.777 2.049zM54 7.866v.439h-4.573c.184.963.858 1.512 1.827 1.512.613 0 1.275-.146 1.986-.451l.466 1.024c-.87.378-1.729.573-2.575.573-.931 0-1.692-.304-2.268-.902-.576-.61-.87-1.402-.87-2.366 0-.975.294-1.768.87-2.366.576-.597 1.324-.902 2.244-.902.968 0 1.691.33 2.17.975.478.647.723 1.464.723 2.464zm-4.61-.586h3.298c-.086-1.073-.613-1.731-1.581-1.731-.969 0-1.582.695-1.717 1.731z"}),Do.default.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M1.196 1.229A4.009 4.009 0 014.08 0l4.092.027C9.183.027 10 .867 10 1.904c0 .6-.273 1.133-.7 1.478-.31.25-.7.399-1.126.4h-.001l-4.09-.027h-.002a4.804 4.804 0 00-2.614.77A4.986 4.986 0 000 5.974v-1.78C0 3.036.456 1.988 1.196 1.23zm4.525 4.65a4.282 4.282 0 00-1.184 2.513l3.637.023c.131 0 .259-.015.382-.042h.002c.81-.178 1.42-.908 1.44-1.788v-.046a1.9 1.9 0 00-.533-1.328 1.813 1.813 0 00-.908-.508h-.002l-.002-.001a1.68 1.68 0 00-.366-.042A4.084 4.084 0 005.72 5.88zm-4.525-.016A4.235 4.235 0 000 8.829C0 10.997 1.601 12.78 3.654 13V9.265h-.005l.005-.439v-.437h.023a5.175 5.175 0 011.439-3.13 5.05 5.05 0 01.72-.614l-1.754-.011H4.08c-.787 0-1.521.229-2.144.625a4.11 4.11 0 00-.74.603z",clipRule:"evenodd"}))}var oi=sa;var Mo=m(require("styled-components"));var dt=m(require("styled-components"));var $o=dt.default.div`
  ${e=>v(e)} {
    background: ${e=>e.appearance.theme.colorBackground};
  }

  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: ${e=>e.appearance.theme.borderRadius}px;
  max-width: ${e=>e.maxWidth}px;
  min-width: 300px;
  padding: 22px 22px 12px;
  z-index: ${e=>e.zIndex};
`,ri=dt.default.div`
  display: block;
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
`,ii=dt.default.img`
  ${e=>v(e)} {
    display: block;
    width: 100%;
    height: auto;
    min-height: 200px;
    margin-top: ${e=>e.dismissible?"24px":"0px"};
    margin-bottom: 16px;
  }
`,ni=dt.default.div`
  ${e=>v(e)} {
    display: block;
    width: 100%;
    height: auto;
    margin-top: ${e=>e.dismissible?"24px":"0px"};
    margin-bottom: 16px;
  }
`,si=dt.default.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`,li=dt.default.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`,ai=dt.default.div`
  display: flex;
  flex: 2;
  flex-shrink: 1;
  gap: 8px;
  height: 64px;
  ${e=>v(e)} {
    flex-direction: row;
    justify-content: ${e=>e.showStepCount?"flex-end":"flex-start"};
    align-content: center;
    align-items: center;
  }
`,pi=dt.default.p`
  ${e=>v(e)} {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
    color: #808080;
  }
  margin: 0;
`;var di=Mo.default.div`
  background-color: ${e=>{var t;return(t=e.appearance)==null?void 0:t.theme.colorBackground}};
  position: absolute;
  bottom: -47px;
  left: 0;
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${e=>{var t;return(t=e.appearance)==null?void 0:t.theme.borderRadius}}px;
`,ci=(0,Mo.default)($o)`
  background-color: ${e=>{var t;return(t=e.appearance)==null?void 0:t.theme.colorBackground}};
  position: absolute;
  bottom: -60px;
  left: 0;
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${e=>{var t;return(t=e.appearance)==null?void 0:t.theme.borderRadius}}px;
  padding: 0;
  z-index: ${e=>e.zIndex};
`,mi=Mo.default.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`;function Uo({appearance:e}){return fr.default.createElement(mi,{className:l("poweredByFrigadeContainer",e),appearance:e},"Powered by \xA0",fr.default.createElement(oi,null))}var la=fo.default.div`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background-color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBackground}};
    /* Mobile */
    @media (max-width: 500px) {
      width: 90%;
      height: 90%;
      top: 50%;
      left: 50%;
    }

    width: ${e=>e.width??"1000px"};
    z-index: 1500;
    border-radius: ${e=>{var t,o;return((o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.borderRadius)??8}}px;
    ${e=>pt(e)}
  }

  padding: 32px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;

  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-name: fadeIn;
  box-sizing: border-box;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`,aa=fo.default.div`
  position: relative;
  flex: 0 1 auto;
`,pa=fo.default.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1501;
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  }
`,da=fo.default.div`
  overflow: scroll;
  flex: 1 1;
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
`,xt=({onClose:e,visible:t,headerContent:o=null,style:i=null,children:r,appearance:n,dismissible:s=!0,showFrigadeBranding:p=!1})=>((0,Oe.useEffect)(()=>{let d=a=>{a.key==="Escape"&&e()};return document.addEventListener("keydown",d),t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset",document.removeEventListener("keydown",d)}},[e,t]),t?Oe.default.createElement(ui.Portal,null,Oe.default.createElement(ei,{appearance:n,onClose:()=>{s&&e()}}),Oe.default.createElement(la,{appearance:n,className:l("modalContainer",n),styleOverrides:i},s&&Oe.default.createElement(pa,{className:l("modalClose",n),onClick:()=>e(),appearance:n},Oe.default.createElement($e,null)),o&&Oe.default.createElement(aa,null,o),Oe.default.createElement(da,null,r),p&&Oe.default.createElement(di,{appearance:n,className:l("poweredByFrigadeRibbon",n)},Oe.default.createElement(Uo,{appearance:n})))):Oe.default.createElement(Oe.default.Fragment,null));var qe=m(require("react")),go=m(require("styled-components")),fi=require("react-portal");var ca=go.default.div`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBackground}};
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 1500;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    width: 350px;
    padding: 24px;
  }
  right: 0;
  bottom: 0;
  margin-right: 28px;
  margin-bottom: 28px;
`,ma=go.default.div`
  position: relative;
  flex: 1;
`,ua=go.default.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1501;
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  }
`,fa=go.default.div`
  overflow: scroll;
  flex: 5;
  ::-webkit-scrollbar {
    display: none;
  }
`,gi=({onClose:e,visible:t,headerContent:o=null,children:i,appearance:r})=>((0,qe.useEffect)(()=>{let n=s=>{s.key==="Escape"&&e()};return document.addEventListener("keydown",n),t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset",document.removeEventListener("keydown",n)}},[e,t]),t?qe.default.createElement(fi.Portal,null,qe.default.createElement(ca,{appearance:r,className:l("cornerModalContainer",r)},qe.default.createElement(ua,{className:l("cornerModalClose",r),onClick:()=>e()},qe.default.createElement($e,null)),o&&qe.default.createElement(ma,null,o),qe.default.createElement(fa,null,i))):qe.default.createElement(qe.default.Fragment,null));var xi=require("react");function le(){let{defaultAppearance:e}=(0,xi.useContext)(K);function t(o){let i=JSON.parse(JSON.stringify(e));return o?{styleOverrides:Object.assign(i.styleOverrides??{},o.styleOverrides??{}),theme:Object.assign(i.theme,o.theme??{})}:i}return{mergeAppearanceWithDefault:t}}var Pe=m(require("react")),Co=m(require("styled-components"));var et=m(require("react")),Ho=m(require("styled-components"));var xo=m(require("styled-components"));var hi=xo.default.label`
  ${e=>v(e)} {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 5px;
    margin-top: 10px;
  }
  display: flex;
`,Ci=xo.default.label`
  ${e=>v(e)} {
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 5px;
  }
  display: flex;
`,yi=xo.default.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextError}};
  display: flex;
  margin-right: 5px;
  margin-top: 10px;
`,zo=xo.default.div`
  display: flex;
  align-items: flex-start;
  justify-content: left;
  margin-bottom: 10px;
`;var _o=m(require("react"));var Re={theme:{colorPrimary:"#000000",colorText:"#000000",colorBackground:"#ffffff",colorBackgroundSecondary:"#d2d2d2",colorTextOnPrimaryBackground:"#ffffff",colorTextSecondary:"#505050",colorTextDisabled:"#C7C7C7",colorBorder:"#E5E5E5",colorTextError:"#c00000",borderRadius:20}};function ct({title:e,required:t,appearance:o=Re}){return e?_o.default.createElement(zo,null,t?_o.default.createElement(yi,{className:l("formLabelRequired",o),appearance:o},"*"):null,_o.default.createElement(hi,{className:l("formLabel",o)},e)):null}var gr=m(require("react"));function Gt({title:e,appearance:t}){return e?gr.default.createElement(zo,null,gr.default.createElement(Ci,{className:l("formSubLabel",t)},e)):null}var Wo=require("zod");function Si(e,t){try{if(t){if(t.type=="number"){let o=Wo.z.number();if(t.props)for(let i of t.props)i.requirement=="min"?o=o.min(Number(i.value),i.message??"Value is too small"):i.requirement=="max"?o=o.max(Number(i.value),i.message??"Value is too large"):i.requirement=="positive"?o=o.positive(i.message??"Value must be positive"):i.requirement=="negative"&&(o=o.nonpositive(i.message??"Value must be negative"));o.parse(Number(e))}if(t.type=="string"){let o=Wo.z.string();if(t.props)for(let i of t.props)i.requirement=="min"?o=o.min(Number(i.value),i.message??"Value is too short"):i.requirement=="max"?o=o.max(Number(i.value),i.message??"Value is too long"):i.requirement=="regex"&&(o=o.regex(new RegExp(String(i.value)),i.message??"Value does not match requirements"));o.parse(e)}return}}catch(o){if(o instanceof Wo.z.ZodError)return o.issues&&o.issues.length>0?o.issues[0].message:null;console.error("Frigade Form validation failed for rule ",t,o)}return null}var ga=Ho.default.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,xr=Ho.default.input`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
    font-size: 14px;
    ::placeholder {
      color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextDisabled}};
      font-size: 14px;
    }
    border-radius: 6px;
  }
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 10px;
  margin-bottom: 10px;
`,xa=Ho.default.textarea`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
    font-size: 14px;
    padding: 10px;
    ::placeholder {
      color: #c7c7c7;
      font-size: 14px;
    }
    border-radius: 6px;
  }
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  margin-bottom: 10px;
`;function Vo({formInput:e,customFormTypeProps:t,onSaveInputData:o,setFormValidationErrors:i,inputData:r}){let n=e,[s,p]=(0,et.useState)((r==null?void 0:r.text)||""),[d,a]=(0,et.useState)(!1),y=xr;(0,et.useEffect)(()=>{s===""&&!d&&(a(!0),c(""))},[]);function c(b){if(p(b),o({text:b}),n.required===!0&&b.trim()===""){i([{id:n.id,message:`${n.title??"Field"} is required`}]);return}let F=Si(b,n.validation);if(F){i([{id:n.id,message:F}]);return}i([])}n.multiline&&(y=xa);function x(){var b;switch((b=n==null?void 0:n.validation)==null?void 0:b.type){case"email":return"email";case"number":return"number";case"password":return"password"}return null}return et.default.createElement(ga,null,et.default.createElement(ct,{title:n.title,required:n.required,appearance:t.appearance}),et.default.createElement(y,{className:l("inputComponent",t.appearance),value:s,onChange:b=>{c(b.target.value)},appearance:t.appearance,placeholder:n.placeholder,type:x()}),et.default.createElement(Gt,{title:n.subtitle,appearance:t.appearance}))}var ke=m(require("react")),Cr=m(require("styled-components"));var hr="",ha=Cr.default.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`,Ca=Cr.default.select`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
    font-size: 14px;
    border-radius: 6px;
  }
  width: 100%;
  height: 40px;
  box-sizing: border-box;

  padding: 0 10px;
  margin-bottom: 10px;
  color: ${e=>{var t,o,i,r;return e.value==""?(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextDisabled:(r=(i=e.appearance)==null?void 0:i.theme)==null?void 0:r.colorText}};

  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'><path stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/></svg>");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  -webkit-print-color-adjust: exact;
`;function bi({formInput:e,customFormTypeProps:t,onSaveInputData:o,inputData:i,setFormValidationErrors:r}){var y,c,x,b,F,P;let n=e,[s,p]=(0,ke.useState)(((y=i==null?void 0:i.choice)==null?void 0:y[0])||""),[d,a]=(0,ke.useState)(!1);return(0,ke.useEffect)(()=>{var f,B,h,k;if(s===""&&!d){if(a(!0),n.requireSelection){p(hr);return}if(n.defaultValue&&((f=n.props.options)!=null&&f.find(L=>L.id===n.defaultValue))){let L=(B=n.props.options)==null?void 0:B.find(C=>C.id===n.defaultValue);p(L.id),o({choice:[L.id]})}else p(((h=n.props.options)==null?void 0:h[0].id)||""),o({choice:[((k=n.props.options)==null?void 0:k[0].id)||""]})}},[]),(0,ke.useEffect)(()=>{n.requireSelection&&s===hr?r([{message:"Please select an option",id:n.id}]):r([])},[s]),ke.default.createElement(ha,null,ke.default.createElement(ct,{title:n.title,required:!1,appearance:t.appearance}),ke.default.createElement(Ca,{value:s,onChange:f=>{p(f.target.value),o({choice:[f.target.value]})},placeholder:n.placeholder,appearance:t.appearance,className:l("multipleChoiceSelect",t.appearance)},n.requireSelection&&ke.default.createElement("option",{key:"null-value",value:hr,disabled:!0},n.placeholder??"Select an option"),(c=n.props.options)==null?void 0:c.map(f=>ke.default.createElement("option",{key:f.id,value:f.id},f.title))),((b=(x=n.props.options)==null?void 0:x.find(f=>f.id===s))==null?void 0:b.isOpenEnded)&&ke.default.createElement(ke.default.Fragment,null,ke.default.createElement(ct,{title:((P=(F=n.props.options)==null?void 0:F.find(f=>f.id===s))==null?void 0:P.openEndedLabel)??"Please specify",required:!1,appearance:t.appearance}),ke.default.createElement(xr,{type:"text",placeholder:"Enter your answer here",onChange:f=>{o({choice:[f.target.value]})},appearance:t.appearance})),ke.default.createElement(Gt,{title:n.subtitle,appearance:t.appearance}))}var Me=m(require("react")),yr=m(require("styled-components"));var Kt=m(require("react"));var qt=m(require("react")),Ti=require("framer-motion"),wi=({color:e,percentage:t,size:o})=>{let i=o*.5-2,r=2*Math.PI*i,n=(1-t)*r,s={duration:.3,delay:0,ease:"easeIn"},p={hidden:{strokeDashoffset:r,transition:s},show:{strokeDashoffset:n,transition:s}};return qt.default.createElement(Ti.motion.circle,{r:i,cx:o*.5,cy:o*.5,fill:"transparent",stroke:n!==r?e:"",strokeWidth:"3px",strokeDasharray:r,strokeDashoffset:t?n:0,variants:p,transition:s,initial:"hidden",animate:"show"})},ya=({fillColor:e,size:t,percentage:o,children:i,bgColor:r="#D9D9D9",className:n,style:s})=>qt.default.createElement("svg",{style:s,className:n,width:t,height:t,overflow:"visible"},qt.default.createElement("g",{transform:`rotate(-90 ${`${t*.5} ${t*.5}`})`},qt.default.createElement(wi,{color:r,size:t}),qt.default.createElement(wi,{color:e,percentage:o,size:t})),i),It=ya;var Fi=m(require("styled-components")),Sa=({color:e="#FFFFFF"})=>Kt.default.createElement("svg",{width:10,height:8,viewBox:"0 0 10 8",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Kt.default.createElement("path",{d:"M1 4.34815L3.4618 7L3.4459 6.98287L9 1",stroke:e,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})),ba={width:"22px",height:"22px",borderRadius:"8px",display:"flex",justifyContent:"center",alignItems:"center"},wa={width:"22px",height:"22px",borderRadius:"40px",display:"flex",justifyContent:"center",alignItems:"center"},Ta={border:"1px solid #000000",color:"#FFFFFF"},Fa={border:"1px solid #E6E6E6"},ka={color:"#FFFFFF"},Pa={border:"3px solid #D9D9D9"},va=e=>e==="square"?ba:wa,Ba=(e,t)=>e==="square"?t?Ta:Fa:t?ka:Pa,Ea=Fi.default.div`
  ${e=>pt(e)}
`,tt=({value:e,type:t="square",primaryColor:o="#000000",progress:i,appearance:r=Re,style:n,className:s})=>{let p=va(t),d=Ba(t,e);return e===!0?p={...p,...d,backgroundColor:o,borderColor:t==="square"?o:"none"}:p={...p,...d},e!==!0&&t==="round"&&i!==void 0&&i!==1?Kt.default.createElement(It,{fillColor:o,percentage:i,size:22}):Kt.default.createElement(Ea,{styleOverrides:p,style:n,role:"checkbox",className:Ee(l("checkIconContainer",r),l(e?"checkIconContainerChecked":"checkIconContainerUnchecked",r),e?"checkIconContainerChecked":"checkIconContainerUnchecked",s)},e&&Kt.default.createElement(Sa,{color:"#FFFFFF"}))};var Aa=yr.default.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`,Ia=yr.default.button`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
    font-size: 14px;
    // Selector for when selected=true
    &[data-selected='true'] {
      border: 1px solid ${e=>e.appearance.theme.colorPrimary};
      background-color: ${e=>e.appearance.theme.colorPrimary}1a;
    }

    :hover {
      border: 1px solid ${e=>e.appearance.theme.colorPrimary};
    }
    text-align: left;
    border-radius: 6px;
  }
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 60px;
  padding: 0 18px;
  margin-bottom: 10px;
`;function ki({formInput:e,customFormTypeProps:t,onSaveInputData:o,inputData:i,setFormValidationErrors:r}){var y;let n=e,[s,p]=(0,Me.useState)((i==null?void 0:i.choice)||[]),[d,a]=(0,Me.useState)(!1);return(0,Me.useEffect)(()=>{s.length==0&&!d&&(a(!0),o({choice:[]}))},[]),(0,Me.useEffect)(()=>{o({choice:s})},[s]),(0,Me.useEffect)(()=>{n.required&&(s.length<n.props.minChoices||s.length>n.props.maxChoices)?r([{message:"",id:n.id}]):r([])},[s]),Me.default.createElement(Aa,null,Me.default.createElement(ct,{title:n.title,required:n.required,appearance:t.appearance}),(y=n.props.options)==null?void 0:y.map(c=>Me.default.createElement(Ia,{appearance:t.appearance,className:l("multipleChoiceListItem",t.appearance),key:c.id,value:c.id,"data-selected":s.includes(c.id),onClick:()=>{if(s.includes(c.id)){p(s.filter(x=>x!==c.id));return}s.length<n.props.maxChoices?p([...s,c.id]):s.length==1&&n.props.maxChoices==1&&p([c.id])}},c.title,Me.default.createElement(tt,{type:"round",primaryColor:t.appearance.theme.colorPrimary,value:s.includes(c.id),appearance:t.appearance}))),Me.default.createElement(Gt,{title:n.subtitle,appearance:t.appearance}))}var ho=m(require("react"));var Sr=m(require("styled-components"));var Pi=m(require("dompurify"));function we(e){return{__html:Pi.default.sanitize(e,{ALLOWED_TAGS:["b","i","a","span","div","p","pre","u","br","img"],ALLOWED_ATTR:["style","class","target","id","href","alt","src"]})}}var Na=Sr.default.h1`
  ${e=>v(e)} {
    font-style: normal;
    font-weight: 600;
    font-size: ${e=>e.size=="small"?"15px":"18px"};
    line-height: ${e=>e.size=="small"?"20px":"22px"};
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    color: ${e=>e.appearance.theme.colorText};
  }
`,Oa=Sr.default.h2`
  ${e=>v(e)} {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    color: ${e=>e.appearance.theme.colorTextSecondary};
  }
`;function Ae({appearance:e,title:t,subtitle:o,size:i="medium",classPrefix:r=""}){return ho.default.createElement(ho.default.Fragment,null,ho.default.createElement(Na,{appearance:e,className:l(`${r}${r?uo(i):i}Title`,e),dangerouslySetInnerHTML:we(t),size:i}),o&&ho.default.createElement(Oa,{appearance:e,className:l(`${r}${r?uo(i):i}Subtitle`,e),dangerouslySetInnerHTML:we(o),size:i}))}var br=m(require("react")),vi=e=>br.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:12,height:12,"aria-hidden":"true",viewBox:"0 0 16 16",...e},br.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"m10.115 1.308 5.635 11.269A2.365 2.365 0 0 1 13.634 16H2.365A2.365 2.365 0 0 1 .25 12.577L5.884 1.308a2.365 2.365 0 0 1 4.231 0zM8 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 9c.552 0 1-.32 1-.714V4.714C9 4.32 8.552 4 8 4s-1 .32-1 .714v3.572C7 8.68 7.448 9 8 9z"}));var jo=require("framer-motion");var La=Co.default.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 14px;
  overflow: visible;
`,Da=(0,Co.default)(jo.motion.div)`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextError}};
  font-size: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`,$a=Co.default.div`
  margin-right: 4px;
  display: inline-flex;
`,Ma=Co.default.div`
  padding-left: 1px;
  padding-right: 1px;
`,Ua={text:Vo,multipleChoice:bi,multipleChoiceList:ki};function Bi({flowId:e,stepData:t,canContinue:o,setCanContinue:i,onSaveData:r,appearance:n,customFormElements:s}){var L;let p=t.props,[d,a]=(0,Pe.useState)([]),[y,c]=(0,Pe.useState)([]),{userId:x}=jt(),[b,F]=(0,Pe.useState)(h()||{}),{readonly:P}=(0,Pe.useContext)(K),f={...Ua,...s};(0,Pe.useEffect)(()=>{i(d.length===0)},[d,i]);function B(C,u){let T={...b,[C.id]:u};F(T),r(T),window&&window.localStorage&&!P&&window.localStorage.setItem(k(),JSON.stringify(T))}function h(){if(window&&window.localStorage){let C=window.localStorage.getItem(k());if(C)return JSON.parse(C)}return{}}function k(){return`frigade-multiInputStepTypeData-${e}-${t.id}-${x}`}return Pe.default.createElement(Ma,{className:l("multiInput",n)},Pe.default.createElement(Ae,{appearance:n,title:t.title,subtitle:t.subtitle}),Pe.default.createElement(La,{className:l("multiInputContainer",n)},(L=p.data)==null?void 0:L.map(C=>{var T;let u=(T=d.reverse().find(S=>S.id===C.id))==null?void 0:T.message;return f[C.type]?Pe.default.createElement("span",{key:C.id,"data-field-id":C.id,className:l("multiInputField",n)},f[C.type]({formInput:C,customFormTypeProps:{flowId:e,stepData:t,canContinue:o,setCanContinue:i,onSaveData:r,appearance:n},onSaveInputData:S=>{!y.includes(C.id)&&S&&(S==null?void 0:S.text)!==""&&c(A=>[...A,C.id]),B(C,S)},inputData:b[C.id],setFormValidationErrors:S=>{a(A=>S.length===0?A.filter(D=>D.id!==C.id):[...A,...S])}}),Pe.default.createElement(jo.AnimatePresence,null,u&&y.includes(C.id)&&Pe.default.createElement(Da,{initial:{opacity:0,height:0,marginBottom:0},animate:{opacity:1,height:"auto",marginBottom:12},exit:{opacity:0,height:0,marginBottom:0},key:C.id,style:{overflow:"hidden"},transition:{duration:.1,ease:"easeInOut",delay:.5},appearance:n,className:l("multiInputValidationError",n)},Pe.default.createElement($a,{appearance:n,className:l("multiInputValidationErrorIcon",n)},Pe.default.createElement(vi,null)),u))):null})))}var ht=m(require("styled-components")),Ei=ht.default.div`
  align-items: center;
  display: flex;
  justify-content: ${e=>e.showBackButton?"space-between":"flex-end"};
  padding-top: 14px;
`,Ai=ht.default.div`
  color: ${e=>e.appearance.theme.colorTextError};
  font-size: 12px;
`,Ii=ht.default.div`
  display: flex;
  gap: 12px;
`,Ni=ht.default.div`
  display: flex;
  flex-direction: row;
  flex: 1 1;
`,Oi=ht.default.div`
  display: flex;
  // If type is set to large-modal, use padding 60px horizontal, 80px vertical
  // Otherwise, use 4px padding
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  position: relative;
`,Li=ht.default.div`
  padding: ${e=>e.type==="large-modal"?"50px":"0px"};
  position: relative;
  overflow-y: auto;
`,Di=ht.default.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  flex-basis: 0;
  // If props.image is set, use it as the background image
  background-image: ${e=>e.image?`url(${e.image})`:"none"};
  // scale background image to fit
  background-size: contain;
  background-position: center;
  border-top-right-radius: ${e=>e.appearance.theme.borderRadius}px;
  border-bottom-right-radius: ${e=>e.appearance.theme.borderRadius}px;
`;var mt=m(require("react"));var $i=m(require("react")),wr=m(require("styled-components"));var za=wr.default.button`
  justify-content: center;
  align-content: center;
  ${e=>v(e)} {
    display: flex;
    // Anything inside this block will be ignored if the user provides a custom class
    width: ${e=>e.type==="full-width"?"100%":"auto"};
    // Only add margin if prop withMargin is true
    ${e=>e.withMargin?"margin: 16px 0px 16px 0px;":""}

    border: 1px solid ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorPrimary}};
    color: ${e=>{var t,o,i,r;return e.secondary?(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorPrimary:(r=(i=e.appearance)==null?void 0:i.theme)==null?void 0:r.colorTextOnPrimaryBackground}};
    background-color: ${e=>{var t,o,i,r;return e.secondary?(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBackground:(r=(i=e==null?void 0:e.appearance)==null?void 0:i.theme)==null?void 0:r.colorPrimary}};
    border-radius: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.borderRadius}}px;
    padding: ${e=>e.size=="small"?"6px 14px 6px 14px":"8px 20px 8px 20px"};
    font-size: ${e=>e.size=="small"?"14px":"15px"};
    line-height: 20px;
    font-weight: 500;
    ${e=>pt(e)}
  }

  font-family: inherit;

  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`,Go=wr.default.div`
  ${e=>v(e)} {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 8px;

    & > * {
      margin-right: 8px;
    }
  }
`,ce=({onClick:e,title:t,style:o,disabled:i,type:r="inline",size:n="medium",secondary:s=!1,appearance:p,withMargin:d=!0,classPrefix:a=""})=>{function y(){let c=s?"buttonSecondary":"button";return a===""?c:`${a}${uo(c)}`}return $i.default.createElement(za,{secondary:s,appearance:p,disabled:i,onClick:e,styleOverrides:o,type:r,withMargin:d,size:n,className:l(y(),p)},t??"Continue")};var Mi=({step:e,canContinue:t,appearance:o,onPrimaryClick:i,onSecondaryClick:r,formType:n,selectedStep:s,steps:p,onBack:d,allowBackNavigation:a,errorMessage:y})=>{let c=n==="inline"?"inline":"full-width",x=p.length>1&&s!=0&&a;return mt.default.createElement(mt.default.Fragment,null,y&&mt.default.createElement(Ai,{appearance:o,className:l("formCTAError",o)},y),mt.default.createElement(Ei,{showBackButton:x,className:l("formCTAContainer",o)},x&&mt.default.createElement(ce,{title:e.backButtonTitle??"\u2190",onClick:d,secondary:!0,withMargin:!1,type:c,appearance:o,style:{width:"90px",maxWidth:"90px"},classPrefix:"back"}),mt.default.createElement(Ii,{className:l("ctaWrapper",o)},e.secondaryButtonTitle?mt.default.createElement(ce,{title:e.secondaryButtonTitle,onClick:r,secondary:!0,withMargin:!1,type:c,appearance:o}):null," ",e.primaryButtonTitle?mt.default.createElement(ce,{disabled:!t,withMargin:!1,title:e.primaryButtonTitle,onClick:i,type:c,appearance:o}):null)))};var qo=m(require("react")),Ui=m(require("styled-components"));var _a=Ui.default.div`
  text-align: center;
`,zi=({stepCount:e=0,currentStep:t=0,className:o,appearance:i})=>{let{theme:r}=le().mergeAppearanceWithDefault(i);return qo.default.createElement(_a,{className:o},qo.default.createElement("svg",{width:16*e-8,height:8,viewBox:`0 0 ${16*e-8} 8`,fill:"none"},Array(e).fill(null).map((n,s)=>qo.default.createElement("rect",{key:s,x:16*s,y:0,width:8,height:8,rx:4,fill:t===s?r.colorPrimary:"#E6E6E6"}))))};var Ct=m(require("react")),Nt=m(require("styled-components"));var _i=require("react");function ge(){let e=(0,_i.useContext)(K);function t(r){i(r.primaryButtonUri,r.primaryButtonUriTarget)}function o(r){i(r.secondaryButtonUri,r.secondaryButtonUriTarget)}function i(r,n){if(!r)return;let s=r.startsWith("http")?"_blank":"_self";n&&n!=="_blank"&&(s="_self"),e.navigate(r,s)}return{primaryCTAClickSideEffects:t,secondaryCTAClickSideEffects:o,handleUrl:i}}var Wa=Nt.default.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
`,Ha=Nt.default.div`
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 15px;
  padding: 20px;
  flex-basis: 255px;
  flex-grow: 0;
  flex-shrink: 0;
`,Va=Nt.default.img`
  width: 78px;
  height: auto;
`,ja=Nt.default.button`
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid;
  border-radius: 100px;
  padding: 8px 12px;
  margin-top: 16px;
`,Ga=Nt.default.h1`
  font-weight: 700;
  font-size: 28px;
  line-height: 34px;
`,qa=Nt.default.h2`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #7e7e7e;
  margin-top: 12px;
  margin-bottom: 16px;
  max-width: 70%;
`;function Wi({stepData:e,appearance:t}){var i,r;let{handleUrl:o}=ge();return Ct.default.createElement("div",null,Ct.default.createElement(Ga,null,e.title),Ct.default.createElement(qa,null,e.subtitle),Ct.default.createElement(Wa,null,(r=(i=e.props)==null?void 0:i.links)==null?void 0:r.map(n=>Ct.default.createElement(Ha,{key:n.title},Ct.default.createElement(Va,{src:n.imageUri}),Ct.default.createElement(ja,{style:{borderColor:t.theme.colorPrimary,color:t.theme.colorPrimary},onClick:()=>{n.uri&&o(n.uri,n.uriTarget??"_blank")}},n.title)))))}var ut=m(require("react")),So=m(require("styled-components"));var Ko=m(require("react")),Yo=({style:e,className:t})=>Ko.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:t,style:e},Ko.default.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}),Ko.default.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"}));var ot=m(require("react")),yo=m(require("styled-components"));var Ka=yo.default.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`,Ya=yo.default.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  z-index: 10;

  > svg {
    width: 40px;
    height: 40px;
    color: ${e=>e.appearance.theme.colorBackground};
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
    border-radius: 50%;
  }
`,Xa=yo.default.video`
  width: 100%;
  height: 100%;
  border-radius: ${e=>e.appearance.theme.borderRadius}px;
`,Ja=yo.default.iframe`
  width: 100%;
  height: 100%;
  min-height: 260px;
  border-radius: ${e=>e.appearance.theme.borderRadius}px;
`;function yt({appearance:e,videoUri:t}){let o=(0,ot.useRef)(),[i,r]=(0,ot.useState)(!1);if(t.includes("youtube")){let n=t.split("v=")[1],s=n.indexOf("&");return s!==-1&&(n=n.substring(0,s)),ot.default.createElement(Ja,{width:"100%",height:"100%",src:`https://www.youtube.com/embed/${n}`,frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,appearance:e})}return ot.default.createElement(Ka,{className:l("videoPlayerWrapper",e),appearance:e},!i&&ot.default.createElement(Ya,{onClick:()=>{r(!0),o.current.play()},appearance:e},ot.default.createElement(Yo,null)),ot.default.createElement(Xa,{appearance:e,controls:i,ref:o,play:i,src:t}))}var Qa=So.default.div`
  ${e=>v(e)} {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`,Za=So.default.img`
  ${e=>v(e)} {
    width: 100%;
    height: auto;
    max-height: 250px;
    margin-bottom: 24px;
  }
`,Ra=So.default.div`
  ${e=>v(e)} {
    margin-bottom: 24px;
  }
`,ep=So.default.div`
  ${e=>v(e)} {
    width: 100%;
    height: auto;
    max-height: 250px;
    margin-bottom: 24px;
  }
`;function Hi({stepData:e,appearance:t,setCanContinue:o}){return(0,ut.useEffect)(()=>{o(!0)},[]),ut.default.createElement(Qa,{className:l("callToActionContainer",t)},ut.default.createElement(Ra,{className:l("callToActionTextContainer",t)},ut.default.createElement(Ae,{appearance:t,title:e.title,subtitle:e.subtitle})),e.imageUri&&ut.default.createElement(Za,{className:l("callToActionImage",t),src:e.imageUri}),!e.imageUri&&e.videoUri&&ut.default.createElement(ep,{appearance:t,className:l("callToActionVideo",t)},ut.default.createElement(yt,{appearance:t,videoUri:e.videoUri})))}var Te=m(require("react"));var ft=m(require("styled-components")),Vi=ft.default.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
`,ji=ft.default.div`
  width: 100%;
  text-align: left;
`,Gi=ft.default.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 38px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,qi=ft.default.h1`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  margin-top: 16px;
  margin-bottom: 16px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`,Ki=ft.default.div`
  padding-top: 12px;
  padding-bottom: 12px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  cursor: pointer;
  border-bottom: ${e=>e.hideBottomBorder?"none":"1px solid #D8D8D8"};
  width: 100%;
`,Yi=ft.default.div`
  padding-top: 10px;
  padding-bottom: 10px;
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
`,Xi=ft.default.img`
  width: 42px;
  height: 42px;
  margin-right: 12px;
`,Ji=ft.default.p`
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  display: flex;
  align-self: center;
`;var Qi=({stepData:e,setCanContinue:t,onSaveData:o,appearance:i})=>{let r=e.props,[n,s]=(0,Te.useState)([]),[p,d]=(0,Te.useState)(!1),[a,y]=(0,Te.useState)(e.id);return(0,Te.useEffect)(()=>{n.length==0&&!p&&(d(!0),o({choice:[]}))},[p]),(0,Te.useEffect)(()=>{a!==e.id&&(y(e.id),s([]))},[e]),(0,Te.useEffect)(()=>{o({choice:n}),n.length>=r.minChoices?t(!0):t(!1)},[n]),Te.default.createElement(Vi,{className:l("selectListContainer",i)},Te.default.createElement(ji,null,Te.default.createElement(Gi,{className:l("selectListTitle",i)},e.title),Te.default.createElement(qi,{appearance:i,className:l("selectListSubtitle",i)},e.subtitle)),r.options.map((c,x)=>{let b=n.includes(c.id);return Te.default.createElement(Ki,{key:`select-item-${x}`,onClick:()=>{if(n.includes(c.id)){s(n.filter(F=>F!==c.id));return}n.length<r.maxChoices?s([...n,c.id]):n.length==1&&r.maxChoices==1&&s([c.id])},hideBottomBorder:x===r.options.length-1,className:l("selectListSelectItem",i)},Te.default.createElement(Yi,{className:l("selectListItemImage",i)},c.imageUri&&Te.default.createElement(Xi,{src:c.imageUri,alt:`select-icon-${x}`}),Te.default.createElement(Ji,{appearance:i,className:l("selectListSelectItemText",i)},c.title)),Te.default.createElement(tt,{appearance:i,value:b,primaryColor:i.theme.colorPrimary}))}))};var ee=m(require("react"));var Xo=require("framer-motion"),tp=({children:e,id:t,shouldWrap:o=!1})=>ee.default.createElement(ee.default.Fragment,null,o?ee.default.createElement(Xo.AnimatePresence,{initial:!1},ee.default.createElement(Xo.motion.div,{key:t,initial:{opacity:1,y:"100%"},animate:{opacity:1,y:0},exit:{opacity:0,y:"-100%"},transition:{duration:.5,ease:"easeInOut"},style:{width:"100%",height:"100%",position:"absolute",top:0,left:0,zIndex:1,overflowY:"auto"}},e)):e),Jo=({appearance:e,steps:t,selectedStep:o,customStepTypes:i,customVariables:r,onButtonClick:n,onStepCompletion:s,flowId:p,type:d,hideOnFlowCompletion:a,onComplete:y,setVisible:c,setShowModal:x,onDismiss:b,showPagination:F=!1,customFormElements:P,allowBackNavigation:f,validationHandler:B})=>{var W;let k={...{linkCollection:Wi,multiInput:Bi,callToAction:Hi,selectList:Qi},...i},{primaryCTAClickSideEffects:L,secondaryCTAClickSideEffects:C}=ge(),[u,T]=(0,ee.useState)(!1),[S,A]=(0,ee.useState)({}),[D,O]=(0,ee.useState)(!1),[U,$]=(0,ee.useState)(!1),[j,H]=(0,ee.useState)(null),ae=t[o]??null,{markStepCompleted:ne,markStepStarted:Z,isLoading:se,updateCustomVariables:fe,markFlowCompleted:oe}=R();(0,ee.useEffect)(()=>{fe(r)},[r,se]),(0,ee.useEffect)(()=>{window&&f&&!U&&(window.location.hash=t[o].id,$(!0))},[f,U,$]),(0,ee.useEffect)(()=>{var M;if(window&&((M=window==null?void 0:window.location)!=null&&M.hash)&&window.location.hash.replace("#","")!==t[o].id){let pe=window.location.hash.replace("#",""),q=t.findIndex(de=>de.id===pe);q!==-1&&Z(p,t[q].id)}},[(W=window==null?void 0:window.location)==null?void 0:W.hash,Z,o,t]);function X(){return{data:S[t[o].id]??{},stepId:t[o].id,customVariables:r}}function ve(M,pe,q){let de=o+1<t.length?t[o+1]:null;return s&&s(M,q,de,S,X()),n?n(M,o,pe,de):!0}function De(M,pe){A(q=>{let de={};return de[M.id]=pe,{...q,...de}})}function J(M){return M.selectedStep.imageUri?ee.default.createElement(Di,{image:M.selectedStep.imageUri,appearance:e,className:l("formContainerSidebarImage",e)}):null}let he=ee.default.createElement(Mi,{step:t[o],canContinue:u&&!D,formType:d,selectedStep:o,appearance:e,onPrimaryClick:async()=>{if(O(!0),B){let q=await B(t[o],o,t[o+1],S,X());if(q){H(q),O(!1);return}else H(null)}let M={...X()};await ne(p,t[o].id,M),o+1<t.length&&await Z(p,t[o+1].id);let pe=ve(t[o],"primary",o);o+1>=t.length&&(y&&y(),b&&b(),a&&pe&&(c&&c(!1),x(!1)),await oe(p)),L(t[o]),O(!1),window&&f&&o+1<t.length&&(window.location.hash=t[o+1].id)},onSecondaryClick:()=>{ve(t[o],"secondary",o),C(t[o])},onBack:async()=>{o-1>=0&&(O(!0),await Z(p,t[o-1].id),O(!1))},steps:t,allowBackNavigation:f,errorMessage:j});return ee.default.createElement(ee.default.Fragment,null,ee.default.createElement(Ni,{className:l("formContainer",e)},ee.default.createElement(Oi,null,ee.default.createElement(tp,{id:o,shouldWrap:d==="large-modal"},ee.default.createElement(Li,{key:ae.id,type:d,className:l("formContent",e)},t.map(M=>{let pe=k[M.type];return ae.id!==M.id?null:ee.default.createElement(pe,{key:M.id,stepData:M,canContinue:u,setCanContinue:T,onSaveData:q=>{De(M,q)},appearance:e,customFormElements:P,flowId:p})}),F&&ee.default.createElement(zi,{className:l("formPagination",e),appearance:e,stepCount:t.length,currentStep:o}),he))),d=="large-modal"&&ee.default.createElement(J,{selectedStep:t[o]})))};var Yt=m(require("react")),Zi=require("styled-components");function me({appearance:e}){if(!e||!e.styleOverrides)return Yt.default.createElement(Yt.default.Fragment,null);let t=Object.entries(e.styleOverrides).filter(([i,r])=>typeof r=="object");if(t.length===0)return Yt.default.createElement(Yt.default.Fragment,null);let o=Zi.createGlobalStyle`
${i=>i.inlineStyles.map(([r,n])=>`.${mo}${r}.${mo}${r} { ${Object.entries(n).map(([s,p])=>`${ur(s)}: ${p};`).join(" ")} }`).join(" ")}`;return Yt.default.createElement(o,{inlineStyles:t})}var Tr=({flowId:e,customStepTypes:t={},type:o="inline",visible:i,setVisible:r,customVariables:n,customFormElements:s,onComplete:p,appearance:d,hideOnFlowCompletion:a=!0,onStepCompletion:y,onButtonClick:c,dismissible:x=!0,endFlowOnDismiss:b=!1,modalPosition:F="center",repeatable:P=!1,onDismiss:f,showPagination:B=!1,allowBackNavigation:h=!1,validationHandler:k,showFrigadeBranding:L=!1})=>{let{getFlow:C,getFlowSteps:u,isLoading:T,targetingLogicShouldHideFlow:S,getFlowStatus:A,getCurrentStepIndex:D,markFlowCompleted:O,markFlowNotStarted:U}=R(),$=D(e),{mergeAppearanceWithDefault:j}=le(),[H,ae]=(0,Ie.useState)(!1),{setOpenFlowState:ne,getOpenFlowState:Z,hasOpenModals:se}=Ne();d=j(d);let[fe,oe]=i!==void 0&&r!==void 0?[i,r]:[Z(e,!0),J=>ne(e,J)];if((0,Ie.useEffect)(()=>{!H&&!T&&(ae(!0),A(e)===ie&&P&&U(e),ae(!0))},[H,ae,T]),T)return null;let X=C(e);if(!X||S(X))return null;let ve=u(e);if(!ve||i!==void 0&&i===!1||A(e)===ie&&a||(o=="modal"||o=="corner-modal")&&se(e))return null;let De=()=>{oe(!1),f&&f(),b===!0&&O(e)};if(F=="center"&&o==="modal"||o==="large-modal"){let J={padding:"24px"};return o==="large-modal"?(J.width="85%",J.height="90%",J.maxHeight="800px",J.minHeight="500px",J.padding="0"):J.width="400px",Ie.default.createElement(xt,{appearance:d,onClose:De,visible:fe,style:J,dismissible:x,showFrigadeBranding:L},Ie.default.createElement(me,{appearance:d}),Ie.default.createElement(Jo,{appearance:d,steps:ve,selectedStep:$,customStepTypes:t,customVariables:n,onButtonClick:c,onStepCompletion:y,flowId:e,type:o,hideOnFlowCompletion:a,onComplete:p,setVisible:r,setShowModal:oe,onDismiss:f,showPagination:B,customFormElements:s,allowBackNavigation:h,validationHandler:k}))}return o==="modal"&&F!=="center"?Ie.default.createElement(gi,{appearance:d,onClose:De,visible:fe},Ie.default.createElement(me,{appearance:d}),Ie.default.createElement(Jo,{appearance:d,steps:ve,selectedStep:$,customStepTypes:t,customVariables:n,onButtonClick:c,onStepCompletion:y,flowId:e,type:o,hideOnFlowCompletion:a,onComplete:p,setVisible:r,setShowModal:oe,onDismiss:f,showPagination:B,customFormElements:s,allowBackNavigation:h,validationHandler:k})):Ie.default.createElement(Ie.default.Fragment,null,Ie.default.createElement(me,{appearance:d}),Ie.default.createElement(Jo,{appearance:d,steps:ve,selectedStep:$,customStepTypes:t,customVariables:n,onButtonClick:c,onStepCompletion:y,flowId:e,type:o,hideOnFlowCompletion:a,onComplete:p,setVisible:r,setShowModal:oe,onDismiss:f,showPagination:B,customFormElements:s,allowBackNavigation:h,validationHandler:k}))},Ri=Tr;var Ot=require("react");function Qo(){let{organizationId:e,userId:t,setOrganizationId:o}=(0,Ot.useContext)(K),{mutateUserFlowState:i}=We(),{config:r,apiUrl:n}=Ze(),s=zt(),{verifySDKInitiated:p}=_t();(0,Ot.useEffect)(()=>{if(t&&e){if(t.startsWith(Vt))return;let y=`frigade-user-group-registered-${t}-${e}`;localStorage.getItem(y)||(s(`${n}userGroups`,{...r,method:"POST",body:JSON.stringify({foreignUserId:t,foreignUserGroupId:e})}),localStorage.setItem(y,"true"))}},[t,e]);let d=(0,Ot.useCallback)(async y=>{if(!p())return;if(!e||!t){console.error("Cannot add properties to organization: Organization ID and User ID must both be set.",{organizationId:e,userId:t});return}let c={foreignUserId:t,foreignUserGroupId:e,properties:y};await s(`${n}userGroups`,{...r,method:"POST",body:JSON.stringify(c)}),i()},[e,t,r,i]),a=(0,Ot.useCallback)(async(y,c)=>{if(!p())return;if(!e||!t){console.error("Cannot track event for organization: Organization ID and User ID must both be set.",{organizationId:e,userId:t});return}let b={foreignUserId:t,foreignUserGroupId:e,events:[{event:y,properties:c}]};await s(`${n}userGroups`,{...r,method:"POST",body:JSON.stringify(b)}),i()},[e,t,r,i]);return{organizationId:e,setOrganizationId:o,addPropertiesToOrganization:d,trackEventForOrganization:a}}var en="frigade-xFrigade_guestUserId",bo="frigade-xFrigade_userId",on=({})=>{let{setFlowResponses:e}=Ht(),{userFlowStatesData:t,isLoadingUserFlowStateData:o,mutateUserFlowState:i}=We(),{userId:r,setUserId:n}=jt(),[s,p]=(0,Ce.useState)(null),{getFlowStatus:d}=R(),{flows:a,userProperties:y,setIsNewGuestUser:c,flowResponses:x}=(0,Ce.useContext)(K),[b,F]=(0,Ce.useState)([]),[P,f]=(0,Ce.useState)([]),{organizationId:B}=Qo();(0,Ce.useEffect)(()=>{if(!o&&t)for(let C=0;C<t.length;C++){let u=t[C],T=a.find(S=>S.slug===(u==null?void 0:u.flowId));if(T&&u&&u.shouldTrigger===!0&&T.type=="FORM"&&T.triggerType==="AUTOMATIC"&&!P.includes(T.slug)){setTimeout(()=>{h(u.flowId)},500);break}}},[o,t]),(0,Ce.useEffect)(()=>{x.length>0&&i()},[x]);function h(C){let u=a.find(T=>T.slug===C);u&&u.triggerType==="AUTOMATIC"&&!P.includes(u.slug)&&(f([...P,u.slug]),F([u]))}function k(){if(!r){let C=localStorage.getItem(bo);if(C){n(C);return}let u=localStorage.getItem(en);if(u){n(u);return}c(!0);let T=Vt+(0,tn.v4)();try{localStorage.setItem(en,T)}catch(S){console.log("Failed to save guest user id locally: Local storage unavailable",S)}n(S=>S||T)}}(0,Ce.useEffect)(()=>{try{if(a){let C=[];a.forEach(u=>{if(u.data){let T=u.data.match(/"imageUri":"(.*?)"/g);T&&T.forEach(S=>{let A=S.replace('"imageUri":"',"").replace('"',"");if(C.includes(A))return;let D=new Image;D.src=A,C.push(A)})}})}}catch{}},[a]),(0,Ce.useEffect)(()=>{if(r!==s&&e([]),p(r),r&&!r.startsWith(Vt))try{localStorage.setItem(bo,r)}catch(C){console.log("Failed to save user id locally: Local storage available",C)}r===null&&setTimeout(()=>{r===null&&k()},50)},[r,a,y]);function L(){return Ce.default.createElement(Ce.default.Fragment,null,b.map(C=>d(C.slug)!==je?null:Ce.default.createElement("span",{key:C.slug},Ce.default.createElement(Ri,{flowId:C.slug,type:"modal",modalPosition:"center",endFlowOnDismiss:!0}))))}return Ce.default.createElement(Ce.default.Fragment,null,Ce.default.createElement(L,null))};var un=require("react-error-boundary");var Xt=m(require("core-js-pure/actual/structured-clone"));function Fr(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function St(...e){let t=e.shift(),o=e.length===1?e[0]:St(...e);if(!Fr(t)||!Fr(o))throw new Error("deepmerge can only merge Objects");let i=(0,Xt.default)(t);return Object.entries(o).forEach(([r,n])=>{Fr(n)?i[r]!==void 0?Object.assign(i,{[r]:St(i[r],(0,Xt.default)(n))}):Object.assign(i,{[r]:(0,Xt.default)(n)}):Array.isArray(n)?i[r]!==void 0?Object.assign(i,{[r]:[...i[r],...(0,Xt.default)(n)]}):Object.assign(i,{[r]:(0,Xt.default)(n)}):Object.assign(i,{[r]:n})}),i}var rn={colorPrimary:"colors.primary.background",colorText:"colors.neutral.foreground",colorBackground:"colors.neutral.background",colorBackgroundSecondary:"colors.secondary.background",colorTextOnPrimaryBackground:"colors.primary.foreground",colorTextSecondary:"colors.secondary.foreground",colorTextDisabled:"colors.gray700",colorBorder:"colors.gray800",colorTextError:"colors.negative.foreground",borderRadius:"radii.lg"};function op(e){if(!e)return;let t={};return Object.entries(e).forEach(([o,i])=>{if(rn[o]){let r=rn[o].split("."),n=t;r.forEach((s,p)=>{n[s]||(n[s]=p===r.length-1?i:{}),n=n[s]})}}),t}function rp(e){if(!e)return;let t=St({},e),o={};return Object.keys(t).forEach(i=>{let r=`.fr-${i}`;o[r]=t[i]}),o}function nn(e){let{theme:t,styleOverrides:o}=e,i=op(t),r=rp(o);return{overrides:i,css:r}}var sn=m(require("styled-components")),wo=require("styled-system");var kr=m(require("react")),Jt=m(require("styled-components")),Be=require("styled-system");var ip={width:{property:"width",scale:"sizes",transform:(e,t)=>(0,Be.get)(t,e,!(typeof e=="number"&&!isNaN(e))||e>1?e:e*100+"%")},height:{property:"height",scale:"sizes"},minWidth:{property:"minWidth",scale:"sizes"},minHeight:{property:"minHeight",scale:"sizes"},maxWidth:{property:"maxWidth",scale:"sizes"},maxHeight:{property:"maxHeight",scale:"sizes"},overflow:!0,overflowX:!0,overflowY:!0,display:!0,verticalAlign:!0},np=(0,Jt.default)("div")(({css:e})=>e,(0,Be.compose)(Be.border,Be.color,Be.shadow,Be.space,Be.typography,(0,Be.system)(ip))),Qt=({as:e,children:t,overrides:o,...i})=>{let r=(0,Jt.useTheme)(),n={border:"none",boxSizing:"border-box",m:0,p:0},s=()=>kr.default.createElement(np,{as:e,...n,...i},t);if(o!==void 0){let p=St(r,o);return kr.default.createElement(Jt.ThemeProvider,{theme:p},s())}return s()};var To={Primary:{backgroundColor:"primary.background",color:"primary.foreground","&:hover":{backgroundColor:"blue400"}},Secondary:{backgroundColor:"white",border:"1px solid",borderColor:"gray800",color:"neutral.foreground","&:hover":{backgroundColor:"blue900"}},Link:{backgroundColor:"transparent",color:"primary.inverted"},Plain:{backgroundColor:"transparent",color:"neutral.foreground"}},sp={sm:{paddingX:4,paddingY:1},md:{paddingX:6,paddingY:2}},ln=(0,sn.default)(Qt)(()=>({whiteSpace:"nowrap"}),(0,wo.compose)((0,wo.variant)({scale:"components.Button",variants:"components.Button"}),(0,wo.variant)({prop:"size",variants:sp})));var an=m(require("styled-components")),Zo=require("styled-system");var Ro={Display1:{fontSize:"5xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"4xl"},Display2:{fontSize:"4xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"3xl"},H1:{fontSize:"3xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"2xl"},H2:{fontSize:"2xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"xl"},H3:{fontSize:"xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"lg"},H4:{fontSize:"lg",fontWeight:"bold",letterSpacing:"md",lineHeight:"md"},Body1:{fontSize:"md",fontWeight:"regular",letterSpacing:"md",lineHeight:"md"},Body2:{fontSize:"sm",fontWeight:"regular",letterSpacing:"md",lineHeight:"md"},Caption:{fontSize:"xs",fontWeight:"regular",letterSpacing:"md",lineHeight:"sm"}};var pn=(0,an.default)(Qt)((0,Zo.variant)({scale:"components.Text",variants:"components.Text"}),(0,Zo.system)({fontWeight:{property:"fontWeight",scale:"fontWeights"}}));var dn=4,cn="px",lp=20,ap=Object.fromEntries(Array.from(Array(lp+1),(e,t)=>t===0?[.5,`${.5*dn}${cn}`]:[t,`${t*dn}${cn}`])),Zt={black:"#0F1114",gray100:"#14161A",gray200:"#181B20",gray300:"#1F2329",gray400:"#2E343D",gray500:"#4C5766",gray600:"#5A6472",gray700:"#C5CBD3",gray800:"#E2E5E9",gray900:"#F1F2F4",white:"#ffffff",blue400:"#015AC6",blue500:"#0171F8",blue800:"#DBECFF",blue900:"#F5F9FF",green400:"#009E37",green500:"#00D149",green800:"#DBFFE8",transparent:"#FFFFFF00",red500:"#c00000"},er={colors:{...Zt,neutral:{foreground:Zt.gray300},primary:{background:Zt.blue500,foreground:Zt.white,inverted:Zt.blue500},negative:{foreground:Zt.red500}},fonts:{default:"TT Interphases Pro, sans-serif"},fontSizes:{xs:"12px",sm:"14px",md:"16px",lg:"18px",xl:"20px","2xl":"24px","3xl":"30px","4xl":"36px","5xl":"48px"},fontWeights:{regular:400,semibold:500,bold:700},letterSpacings:{md:"0.02em"},lineHeights:{xs:"18px",sm:"22px",md:"24px",lg:"26px",xl:"30px","2xl":"38px","3xl":"46px","4xl":"60px"},radii:{md:"8px",lg:"20px",round:"50%"},shadows:{md:"0px 4px 20px rgba(0, 0, 0, 0.06)"},space:ap,components:{Button:To,Text:Ro}};var fn="https://api.frigade.com",K=(0,Y.createContext)({publicApiKey:"",setUserId:()=>{},flows:[],setFlows:()=>{},failedFlowResponses:[],setFailedFlowResponses:()=>{},flowResponses:[],setFlowResponses:()=>{},userProperties:{},setUserProperties:()=>{},openFlowStates:{},setOpenFlowStates:()=>{},completedFlowsToKeepOpenDuringSession:[],setCompletedFlowsToKeepOpenDuringSession:()=>{},customVariables:{},setCustomVariables:()=>{},isNewGuestUser:!1,setIsNewGuestUser:()=>{},hasActiveFullPageFlow:!1,setHasActiveFullPageFlow:()=>{},organizationId:"",setOrganizationId:()=>{},navigate:()=>{},defaultAppearance:Re,shouldGracefullyDegrade:!1,setShouldGracefullyDegrade:()=>{},apiUrl:fn,readonly:!1});function pp(){Object.keys(localStorage).forEach(e=>{e.startsWith("frigade-")&&localStorage.removeItem(e)})}var gn=({publicApiKey:e,userId:t,organizationId:o,config:i,children:r})=>{var Z,se;let[n,s]=(0,Y.useState)(t||null),[p,d]=(0,Y.useState)(o||null),[a,y]=(0,Y.useState)([]),[c,x]=(0,Y.useState)([]),[b,F]=(0,Y.useState)([]),[P,f]=(0,Y.useState)({}),[B,h]=(0,Y.useState)({}),[k,L]=(0,Y.useState)([]),[C,u]=(0,Y.useState)({}),[T,S]=(0,Y.useState)(!1),[A,D]=(0,Y.useState)(!1),[O,U]=(0,Y.useState)(!H(e)),$=(fe,oe)=>{if(oe==="_blank"){window.open(fe,"_blank");return}setTimeout(()=>{window.location.href=fe},50)},j={theme:{...Re.theme,...((Z=i==null?void 0:i.defaultAppearance)==null?void 0:Z.theme)??{}},styleOverrides:{...Re.styleOverrides,...((se=i==null?void 0:i.defaultAppearance)==null?void 0:se.styleOverrides)??{}}};function H(fe){return!!(fe&&fe.length>10&&fe.substring(0,10)==="api_public")}(0,Y.useEffect)(()=>{t&&s(t)},[t]),(0,Y.useEffect)(()=>{n&&window&&window.localStorage&&window.localStorage.getItem(bo)&&window.localStorage.getItem(bo)!==n&&pp()},[n]),(0,Y.useEffect)(()=>{o&&d(o)},[o]),(0,Y.useEffect)(()=>{if(H(e))U(!1);else{console.error("Frigade SDK failed to initialize. API key provided is either missing or valid."),U(!0);return}},[e,U]);let ae={publicApiKey:e,userId:n,setUserId:s,setFlows:y,flows:a,failedFlowResponses:c,setFailedFlowResponses:x,flowResponses:b,setFlowResponses:F,userProperties:P,setUserProperties:f,openFlowStates:B,setOpenFlowStates:h,completedFlowsToKeepOpenDuringSession:k,setCompletedFlowsToKeepOpenDuringSession:L,customVariables:C,setCustomVariables:u,isNewGuestUser:T,setIsNewGuestUser:S,hasActiveFullPageFlow:A,setHasActiveFullPageFlow:D,organizationId:p,setOrganizationId:d,navigate:i&&i.navigate?i.navigate:$,defaultAppearance:j,shouldGracefullyDegrade:O,setShouldGracefullyDegrade:U,apiUrl:i&&i.apiUrl?i.apiUrl:fn,readonly:i&&i.readonly?i.readonly:!1};if(O)return Y.default.createElement(K.Provider,{value:ae},r);let{overrides:ne}=nn(j);return Y.default.createElement(un.ErrorBoundary,{fallback:Y.default.createElement(Y.default.Fragment,null,r)},Y.default.createElement(K.Provider,{value:ae},Y.default.createElement(mn.ThemeProvider,{theme:St(j.theme,er,ne??{},(i==null?void 0:i.theme)??{})},r,Y.default.createElement(on,null))))};var js=m(require("react"));var te=m(require("react"));var Le=m(require("react")),Tt=m(require("styled-components"));var Fo=m(require("react"));var bt=m(require("react")),Pr=m(require("styled-components"));var xn=Pr.default.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #4d4d4d;
  display: inline-block;
  vertical-align: middle;
  margin-left: 12px;
  padding-right: 12px;
`,dp=Pr.default.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid ${e=>e.theme.colorBorder};
  width: 100%;
`,tr=({label:e,value:t,labelStyle:o={},labelPosition:i="right",style:r,primaryColor:n="#000000",checkBoxType:s="square",appearance:p})=>bt.default.createElement(bt.default.Fragment,null,bt.default.createElement(dp,{className:l("checklistStepsContainer",p),appearance:p,style:{...r}},i==="left"&&e&&bt.default.createElement(xn,{className:l("checklistStepLabel",p),style:o},e),bt.default.createElement(tt,{appearance:p,value:t,type:s,primaryColor:n}),i==="right"&&e&&bt.default.createElement(xn,{className:l("checklistStepLabel",p),style:o},e)),bt.default.createElement(me,{appearance:p}));var bn=require("framer-motion");var Rt=m(require("styled-components")),hn=Rt.default.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
`,Cn=Rt.default.p`
  font-weight: 700;
  font-size: 18px;
  line-height: 30px;
  margin: 20px 0px 0px 0px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,yn=Rt.default.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 28px;
  max-width: 540px;
  margin: 8px 0px 0px 0px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`,or=Rt.default.div`
  width: 4px;
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`,Sn=Rt.default.div`
  flex-direction: row;
  justify-content: flex-start;
`;var wn=({data:e,index:t,isSelected:o,primaryColor:i,style:r,onClick:n,appearance:s})=>{var p,d;return Fo.default.createElement("div",{style:{position:"relative",paddingLeft:"20px"},onClick:()=>{n()}},o&&Fo.default.createElement(or,{className:l("checklistStepItemSelectedIndicator",s),as:bn.motion.div,layoutId:"checklis-step-selected",style:{backgroundColor:((p=s==null?void 0:s.theme)==null?void 0:p.colorPrimary)??i}}),Fo.default.createElement(Sn,{className:l("checklistStepItem",s),key:`hero-checklist-step-${t}`,role:"listitem"},Fo.default.createElement(tr,{value:e.complete,labelPosition:"left",label:e.stepName??e.title,style:r,primaryColor:((d=s==null?void 0:s.theme)==null?void 0:d.colorPrimary)??i,appearance:s})))};var wt=m(require("react")),Tn=require("framer-motion"),rr=m(require("styled-components"));var cp={backgroundColor:"#E6E6E6"},mp=rr.default.div`
  display: flex;
  flex-direction: ${e=>e.textLocation=="top"?"column":"row"};
  justify-content: flex-start;
  align-items: ${e=>e.textLocation=="top"?"flex-end":"center"};
  width: 100%;

  ${e=>pt(e)}
`,up=rr.default.div`
  flex-grow: 1;
  position: relative;
  ${e=>e.textLocation=="top"?"width: 100%;":""}
`,fp=rr.default.span`
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  padding-right: ${e=>e.padding};
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
  margin-bottom: ${e=>e.textLocation=="top"?"8px":"0px"};
  ${e=>pt(e)}
`,gp={position:"relative",left:0,top:0,width:"100%",minWidth:"40px",height:"10px",borderRadius:"20px"},xp={position:"absolute",left:0,top:0,height:"10px",borderRadius:"20px"},Ve=({count:e,total:t,fillColor:o,bgColor:i=cp.backgroundColor,display:r="count",textLocation:n="left",style:s={},textStyle:p={},appearance:d})=>{var F,P;if(t===0)return wt.default.createElement(wt.default.Fragment,null);let a=e===0?"10px":`${e/t*100}%`,y=r==="compact"?"5px":"10px",c=Math.round(e/t*100),x=r==="compact"?"5px":"20px",b;return r==="count"?b=`${e} of ${t}`:r==="compact"?b=`${c}%`:r==="percent"&&(b=`${c}% complete`),n==="top"&&(x="0px"),wt.default.createElement(mp,{className:l("progressBarContainer",d),textLocation:n,styleOverrides:s},wt.default.createElement(fp,{className:l("progressBarStepText",d),style:{...p,fontSize:r==="compact"?12:15,fontWeight:r==="compact"?400:500},appearance:d,padding:x,textLocation:n},b),wt.default.createElement(up,{textLocation:n,className:l("progressBar",d)},wt.default.createElement(Tn.motion.div,{style:{...xp,width:a,height:y,backgroundColor:((F=d==null?void 0:d.theme)==null?void 0:F.colorPrimary)??o,zIndex:r=="compact"?1:5},className:l("progressBarFill",d)}),wt.default.createElement("div",{className:l("progressBarBackground",d),style:{...gp,height:y,backgroundColor:((P=d==null?void 0:d.theme)==null?void 0:P.colorSecondary)??i}})))};var ro=m(require("react")),Pn=m(require("styled-components"));var Po=m(require("react"));var ko=m(require("react"));var eo=({stepData:e,appearance:t})=>ko.default.createElement(ko.default.Fragment,null,ko.default.createElement(Cn,{appearance:t,className:l("checklistStepTitle",t),dangerouslySetInnerHTML:we(e.title)}),ko.default.createElement(yn,{appearance:t,className:l("checklistStepSubtitle",t),dangerouslySetInnerHTML:we(e.subtitle)}));var ir=m(require("react"));var to=({stepData:e,appearance:t})=>{let o=()=>{e.handlePrimaryButtonClick&&e.handlePrimaryButtonClick()},i=()=>{e.handleSecondaryButtonClick&&e.handleSecondaryButtonClick()};return ir.default.createElement(Go,{className:l("ctaContainer",t)},e.secondaryButtonTitle&&ir.default.createElement(ce,{appearance:t,secondary:!0,title:e.secondaryButtonTitle,onClick:i,style:{width:"auto",marginRight:"12px"}}),ir.default.createElement(ce,{appearance:t,title:e.primaryButtonTitle,onClick:o}))};var oo=({stepData:e,appearance:t})=>Po.default.createElement(Po.default.Fragment,null,Po.default.createElement(eo,{stepData:e,appearance:t}),Po.default.createElement(to,{stepData:e,appearance:t}));var Fn=m(require("react"));function kn(e){return Fn.default.createElement(yt,{appearance:e.appearance,videoUri:e.videoUri})}var vr="default",hp=Pn.default.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`,vn=({stepData:e,appearance:t})=>{if(e!=null&&e.StepContent){let o=e.StepContent;return ro.default.createElement("div",null,o)}return ro.default.createElement(hn,{className:l("checklistStepContent",t)},e.imageUri?ro.default.createElement(hp,{className:l("checklistStepImage",t),src:e.imageUri,style:e.imageStyle}):null,e.videoUri?ro.default.createElement(kn,{videoUri:e.videoUri,appearance:t}):null,ro.default.createElement(oo,{stepData:e,appearance:t}))};var Fe=m(require("react")),Lt=m(require("styled-components"));var Bn=Lt.default.div`
  display: block;
`,Cp=Lt.default.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0px;
  align-items: center;
  align-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
`,yp=Lt.default.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-right: 16px;
`,Sp=Lt.default.video`
  width: 200px;
  height: 120px;
`,bp=Lt.default.div`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`,wp=Lt.default.div`
  position: absolute;
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  z-index: 10;

  > svg {
    width: 40px;
    height: 40px;
    color: ${e=>e.appearance.theme.colorBackground};
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
    border-radius: 50%;
  }
`,En="videoCarousel",An=({stepData:e,appearance:t})=>{var r;if(!((r=e.props)!=null&&r.videos))return Fe.default.createElement(Bn,null,Fe.default.createElement(oo,{stepData:e,appearance:t}));function o({video:n}){let s=(0,Fe.useRef)(),[p,d]=(0,Fe.useState)(!1);return Fe.default.createElement(yp,null,!p&&Fe.default.createElement(wp,{onClick:()=>{d(!0),s.current.play()},appearance:t},Fe.default.createElement(Yo,null)),Fe.default.createElement(Sp,{controls:p,ref:s,play:p,src:n.uri}),Fe.default.createElement(bp,null,n.title))}let i=e.props;return i.videos?Fe.default.createElement(Bn,null,Fe.default.createElement(eo,{stepData:e,appearance:t}),Fe.default.createElement(Cp,null,i.videos.map((n,s)=>Fe.default.createElement("span",{key:`${n.uri}-${s}`},Fe.default.createElement(o,{video:n})))),Fe.default.createElement(to,{stepData:e,appearance:t})):null};var rt=m(require("react")),vo=m(require("styled-components"));var In=vo.default.div`
  display: block;
`,Tp=vo.default.pre`
  display: block;
  background-color: #2a2a2a;
  color: #f8f8f8;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 20px;
  font-family: 'Source Code Pro', monospace;
  width: 600px;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  margin-bottom: 24px;
`,Fp=vo.default.div`
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 12px;
  margin-top: 12px;
`,kp=vo.default.div`
  margin-top: 24px;
`,Nn="codeSnippet",On=({stepData:e,appearance:t})=>{var i;if(!((i=e.props)!=null&&i.codeSnippets))return rt.default.createElement(In,null,rt.default.createElement(oo,{stepData:e,appearance:t}));let o=e.props;return o.codeSnippets?rt.default.createElement(In,null,rt.default.createElement(eo,{stepData:e,appearance:t}),rt.default.createElement(kp,null,o.codeSnippets.map((r,n)=>rt.default.createElement("div",{key:n},r.title?rt.default.createElement(Fp,null,r.title):null,r.code?rt.default.createElement(Tp,null,r.code):null))),rt.default.createElement(to,{stepData:e,appearance:t})):null};var Pp=Tt.default.div`
  display: flex;
  flex-direction: row;
  min-width: ${e=>e.type!="modal"?"1000px":"100%"};
  background: ${e=>{var t;return(t=e.appearance)==null?void 0:t.theme.colorBackground}};
  box-shadow: ${e=>e.type!="modal"?"0px 6px 25px rgba(0, 0, 0, 0.06)":"none"};
  border-radius: 8px;
`,vp=Tt.default.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,Bp=Tt.default.h2`
  font-size: 15px;
  line-height: 28px;
  color: ${e=>{var t,o;return((o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary)??"#4d4d4d"}};
  margin: 10px 0px 0px 0px;
`,Ln=Tt.default.div`
  padding-bottom: 16px;
`,Ep=Tt.default.div`
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  width: 300px;
`,Ap=Tt.default.div`
  width: 1px;
  margin: 40px;
  background: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
`,Ip=Tt.default.div`
  flex: 2;
  padding: 2rem;
`,Np=({title:e,subtitle:t,steps:o=[],style:i={},selectedStep:r,setSelectedStep:n,className:s="",customStepTypes:p=new Map,appearance:d,type:a})=>{let{mergeAppearanceWithDefault:y}=le();d=y(d);let x={...{[vr]:vn,[En]:An,[Nn]:On},...p},[b,F]=(0,Le.useState)(0),P=r??b,f=n??F,B=o.filter(k=>k.complete===!0).length,h=()=>{var k;return!((k=o[P])!=null&&k.type)||!x[o[P].type]?x[vr]({stepData:o[P],appearance:d}):x[o[P].type]({stepData:o[P],appearance:d})};return Le.default.createElement(Pp,{type:a,style:i,className:s,appearance:d},Le.default.createElement(Ln,{style:{flex:1}},Le.default.createElement(Ln,{style:{padding:"30px 0px 30px 30px",borderBottom:"none"}},Le.default.createElement(vp,{className:l("checklistTitle",d),appearance:d},e),Le.default.createElement(Bp,{className:l("checklistSubtitle",d),appearance:d},t),Le.default.createElement(Ve,{total:o.length,count:B,fillColor:d.theme.colorPrimary,style:{marginTop:"24px"},appearance:d})),Le.default.createElement(Ep,{className:l("checklistStepsContainer",d)},o.map((k,L)=>Le.default.createElement(wn,{data:k,index:L,key:L,listLength:o.length,isSelected:L===P,primaryColor:d.theme.colorPrimary,style:{justifyContent:"space-between"},onClick:()=>{f(L)}})))),Le.default.createElement(Ap,{appearance:d,className:l("checklistDivider",d)}),Le.default.createElement(Ip,null,Le.default.createElement(h,null)))},Br=Np;var z=m(require("react"));var Er=m(require("react")),Dn=m(require("styled-components")),Op=Dn.default.svg`
  transition: 'transform 0.35s ease-in-out';
`,io=({color:e="#323232",style:t,className:o})=>Er.default.createElement(Op,{width:"7",height:"10",viewBox:"0 0 9 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:t,className:o},Er.default.createElement("path",{d:"M1 13L7.5 7L0.999999 1",stroke:e,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}));var ms=require("framer-motion");var ye=m(require("styled-components"));var Ar={boxShadow:"0px 6px 25px rgba(0, 0, 0, 0.06)",padding:"32px",maxHeight:"700px",msOverflowStyle:"none",scrollbarWidth:"none",paddingBottom:"12px",minHeight:"610px"},$n=ye.default.div`
  max-height: 350px;
  padding-bottom: 40px;
`,Mn=ye.default.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`,Un=ye.default.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 36px;
  margin-bottom: 16px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,zn=ye.default.h2`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 16px;
  padding-left: 1px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`,_n=ye.default.div`
  ${e=>v(e)} {
    border: 1px solid #fafafa;
  }
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  overflow: hidden;
`,Wn=ye.default.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`,Hn=ye.default.p`
  ${e=>v(e)} {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    text-transform: uppercase;
    color: #8c8c8c;
    margin: 20px;
  }
`,Vn=ye.default.div`
  display: flex;
  flex-direction: row;
`,jn=ye.default.div`
  flex: 1;
`,Gn=ye.default.div`
  ${e=>v(e)} {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    flex: 1;
    padding-left: 8px;
    padding-right: 8px;
  }
`,qn=ye.default.p`
  ${e=>v(e)} {
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 26px;

    text-align: center;
    color: ${e=>e.appearance.theme.colorText};
    margin-top: 20px;
    margin-bottom: 16px;
  }
`,Kn=ye.default.p`
  ${e=>v(e)} {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: ${e=>e.appearance.theme.colorTextSecondary};
    margin-bottom: 8px;
  }
`,Yn=ye.default.div`
  ${e=>v(e)} {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }
`,Xn=ye.default.div`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background-color: ${e=>e.selected?"#FAFAFA":"#FFFFFF"};
    :hover {
      background-color: #fafafa;
    }
  }
  //Check if attr disabled is true
  &[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }

  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
`,Jn=ye.default.p`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${e=>e.selected?"#434343":"#BFBFBF"};
  }
  font-weight: ${e=>e.selected?500:400};
  font-size: 14px;
  line-height: 22px;
  margin: 0;
`,Qn=ye.default.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
`,Zn=ye.default.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-right: 20px;
`,Rn=ye.default.div`
  display: block;
  width: 100%;
`;var es=m(require("styled-components")),ts=es.default.div`
  flex-direction: column;
  justify-content: center;
  display: flex;
`;var nt=m(require("react")),cs=require("framer-motion");var it=m(require("styled-components"));var os=it.default.div`
  border: 1px solid #fafafa;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,rs=it.default.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  row-gap: 10px;
`,is=it.default.div`
  ${e=>v(e)} {
    color: #595959;
  }
  text-transform: uppercase;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.09em;
  margin-bottom: 12px;
`,ns=it.default.div`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
    border: 1px solid #fafafa;
  }
  border-radius: 14px;
  padding: 20px;
  flex-direction: column;
  align-content: center;

  max-width: 150px;
  min-width: 200px;
`,ss=it.default.div`
  ${e=>v(e)} {
    background: radial-gradient(50% 50% at 50% 50%, #ffffff 0%, #f7f7f7 100%);
  }
  width: 40px;
  height: 40px;

  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`,ls=it.default.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  width: 20px;
  height: 20px;
`,as=it.default.div`
  ${e=>v(e)} {
    color: #434343;
  }
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-top: 12px;
  margin-bottom: 8px;
`,ps=it.default.div`
  ${e=>v(e)} {
    color: #8c8c8c;
  }
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`,ds=it.default.a`
  color: ${e=>e.color};
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  cursor: pointer;
`;var Lp=({steps:e,style:t,title:o,primaryColor:i,appearance:r,onButtonClick:n})=>{let{primaryCTAClickSideEffects:s}=ge();return nt.default.createElement(os,{style:t,className:l("guideContainer",r)},nt.default.createElement(is,{className:l("guideTitle",r)},o),nt.default.createElement(rs,{className:l("guideItemContainer",r)},e.map((p,d)=>nt.default.createElement(ns,{key:`guide-${p.id??d}`,as:cs.motion.div,whileHover:{boxShadow:"0px 2px 8px rgba(0, 0, 0, 0.05)",transition:{duration:.25}},className:l("guideItem",r)},p.icon&&nt.default.createElement(ss,{className:l("guideIcon",r)},nt.default.createElement(ls,null,p.icon)),nt.default.createElement(as,{className:l("guideItemTitle",r),dangerouslySetInnerHTML:we(p.title)}),nt.default.createElement(ps,{className:l("guideItemSubtitle",r),dangerouslySetInnerHTML:we(p.subtitle)}),nt.default.createElement(ds,{className:l("guideItemLink",r),color:i,onClick:()=>{p.primaryButtonUri&&s(p),n&&n(p)}},p.primaryButtonTitle)))))},Bo=Lp;var Dp=({steps:e,title:t,subtitle:o,stepsTitle:i,visible:r,onClose:n,selectedStep:s,setSelectedStep:p,customStepTypes:d,appearance:a,guideData:y,guideTitle:c,onGuideButtonClick:x})=>{let b=({stepData:u,handleSecondaryCTAClick:T,handleCTAClick:S})=>u?z.default.createElement(Gn,{className:l("checklistStepContainer",a),"data-testid":"checklistStepContainer"},z.default.createElement(qn,{appearance:a,className:l("checklistStepTitle",a),dangerouslySetInnerHTML:we(u.title)}),z.default.createElement(Kn,{appearance:a,className:l("checklistStepSubtitle",a),dangerouslySetInnerHTML:we(u.subtitle)}),z.default.createElement(Yn,{className:l("checklistCTAContainer",a)},u.secondaryButtonTitle&&z.default.createElement(ce,{title:u.secondaryButtonTitle,onClick:T,appearance:a,secondary:!0}),z.default.createElement(ce,{title:u.primaryButtonTitle,onClick:S,appearance:a}))):z.default.createElement(z.default.Fragment,null),P={...{default:u=>{var D;if((D=e[h])!=null&&D.StepContent){let O=e[h].StepContent;return z.default.createElement("div",null,O)}let T=e[h];return z.default.createElement(b,{stepData:u,handleCTAClick:()=>{T.handlePrimaryButtonClick&&T.handlePrimaryButtonClick()},handleSecondaryCTAClick:()=>{T.handleSecondaryButtonClick&&T.handleSecondaryButtonClick()}})}},...d},[f,B]=(0,z.useState)(0),h=s??f,k=p??B,L=()=>{var u;return e?!((u=e[h])!=null&&u.type)||!P[e[h].type]?P.default(e[h]):P[e[h].type]({stepData:e[h],primaryColor:a.theme.colorPrimary}):z.default.createElement(z.default.Fragment,null)},C=e.filter(u=>u.complete).length;return r?(a.theme.modalContainer||(a.theme.borderRadius&&(Ar.borderRadius=a.theme.borderRadius+"px"),a.theme.modalContainer=Ar),z.default.createElement(xt,{onClose:n,visible:r,appearance:a},z.default.createElement(Rn,null,z.default.createElement(Mn,null,z.default.createElement(Un,{appearance:a,className:l("checklistTitle",a)},t),z.default.createElement(zn,{appearance:a,className:l("checklistSubtitle",a)},o)),z.default.createElement($n,null,e&&e.length>0&&z.default.createElement(_n,{className:l("stepsContainer",a)},z.default.createElement(Wn,null,z.default.createElement("div",{style:{flex:3}},z.default.createElement(Hn,{className:l("stepsTitle",a)},i)),z.default.createElement(Zn,null,z.default.createElement(Ve,{fillColor:a.theme.colorPrimary,style:{width:"100%"},count:C,total:e.length,appearance:a}))),z.default.createElement(Vn,null,z.default.createElement(jn,{className:l("checklistStepListContainer",a),appearance:a},e.map((u,T)=>{let S=h===T;return z.default.createElement(Xn,{selected:S,className:l(`checklistStepListItem${S?"Selected":""}`,a),key:`checklist-guide-step-${u.id??T}`,disabled:u.blocked,onClick:()=>{u.blocked||k(T)},title:u.blocked?"Finish remaining steps to continue":void 0},S&&z.default.createElement(or,{className:l("checklistStepItemSelectedIndicator",a),as:ms.motion.div,layoutId:"checklist-step-selected",style:{backgroundColor:a.theme.colorPrimary,borderRadius:0,height:"100%",top:"0%",width:"2px"}}),z.default.createElement(Jn,{selected:S,className:l(`checklistStepListStepName${S?"Selected":""}`,a)},u.stepName),z.default.createElement(Qn,null,z.default.createElement(tt,{value:u.complete,type:"round",primaryColor:a.theme.colorPrimary,progress:u.progress,appearance:a}),z.default.createElement(ts,null,z.default.createElement(io,{style:{marginLeft:"10px"},color:a.theme.colorBackgroundSecondary}))))})),z.default.createElement(L,null))),y&&y.length>0&&z.default.createElement(Bo,{steps:y,title:c,primaryColor:a.theme.colorPrimary,style:{border:"none",boxShadow:"none"},appearance:a,onButtonClick:u=>(x&&x(u),!0)}))))):z.default.createElement(z.default.Fragment,null)},Ir=Dp;var nr=require("react"),sr=()=>{let e={isSmall:"(max-width: 480px)",isMedium:"(min-width: 481px) AND (max-width: 1023px)",isLarge:"(min-width: 1025px)"},t=Object.fromEntries(Object.entries(e).map(([p])=>[p,!1])),[o,i]=(0,nr.useState)(t),r=null,n=()=>{r!==null?clearTimeout(r):s(),r=setTimeout(()=>{s()},16)},s=()=>{let p=Object.fromEntries(Object.entries(e).map(([d,a])=>{if(!window)return[d,!1];let y=window.matchMedia(a);return y.addEventListener("change",n),[d,y.matches]}));i(p)};return(0,nr.useEffect)(()=>{s()},[]),o};var xe=m(require("react"));var Se=m(require("react"));var lr=require("framer-motion");var st=m(require("styled-components")),us=st.default.div`
  background-color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBackground}};
  border: 1px solid;
  border-color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
  border-radius: 6px;
  padding: 2px 20px 2px 20px;
  display: flex;
  margin-top: 14px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  transition: max-height 0.25s;
`,fs=st.default.div`
  display: flex;
  margin-bottom: 20px;
`,gs=st.default.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`,xs=st.default.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`,hs=st.default.p`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  margin-left: 8px;
`,Cs=st.default.div`
  padding: 20px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`,Dg=st.default.div``,ys=st.default.p`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`,Ss=st.default.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;var bs=({stepData:e,collapsed:t,onClick:o,onPrimaryButtonClick:i,onSecondaryButtonClick:r,appearance:n,customStepTypes:s})=>{var y,c;let p=t?{}:{transform:"rotate(90deg)"};function d(){return Se.default.createElement(Se.default.Fragment,null,e.imageUri||e.videoUri?Se.default.createElement(fs,{className:l("stepMediaContainer",n)},e.imageUri?Se.default.createElement(gs,{className:l("stepImage",n),src:e.imageUri,style:e.imageStyle}):null,e.videoUri?Se.default.createElement(yt,{appearance:n,videoUri:e.videoUri}):null):null,Se.default.createElement(ys,{className:l("stepSubtitle",n),appearance:n,dangerouslySetInnerHTML:we(e.subtitle)}),Se.default.createElement(Go,{className:l("checklistCTAContainer",n)},e.secondaryButtonTitle?Se.default.createElement(ce,{secondary:!0,title:e.secondaryButtonTitle,onClick:()=>r(),appearance:n}):null,Se.default.createElement(ce,{title:e.primaryButtonTitle??"Continue",onClick:()=>i(),appearance:n})))}function a(){if(!s)return null;let x=s[e.type];return x?x(e,n):null}return Se.default.createElement(us,{onClick:()=>t?o():null,"data-testid":`step-${e.id}`,className:l("checklistStepContainer",n),appearance:n},Se.default.createElement(xs,{className:l("stepHeader",n)},Se.default.createElement(Ss,null,Se.default.createElement(tr,{value:e.complete,style:{width:"auto",borderTop:0},primaryColor:(y=n==null?void 0:n.theme)==null?void 0:y.colorPrimary,appearance:n}),Se.default.createElement(hs,{appearance:n,className:l("stepTitle",n),dangerouslySetInnerHTML:we(e.title)})),Se.default.createElement(Cs,{className:l("stepChevronContainer",n),onClick:()=>o()},Se.default.createElement(io,{style:{...p,transition:"transform 0.1s ease-in-out"},color:(c=n==null?void 0:n.theme)==null?void 0:c.colorTextSecondary}))),Se.default.createElement(lr.AnimatePresence,null,!t&&Se.default.createElement(lr.motion.div,{initial:{opacity:1,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:1,height:0},key:e.id,style:{overflow:"hidden"}},a()??d())))};var Dt=m(require("styled-components")),qg=Dt.default.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  z-index: 10;
  padding: 32px;

  position: absolute;
  width: 80%;
  top: 20%;
  left: 20%;

  max-width: 800px;
  min-width: 350px;
`,ws=Dt.default.div`
  display: flex;
  flex-direction: column;
`,Ts=Dt.default.h1`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
`,Fs=Dt.default.h2`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
  margin: 2px 0 0 0;
`,ks=Dt.default.div`
  display: block;
  width: 100%;
`,Ps=Dt.default.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBackground}};
`;var $p=({title:e,subtitle:t,steps:o,onClose:i,visible:r,autoExpandFirstIncompleteStep:n=!0,autoCollapse:s=!0,autoExpandNextStep:p=!0,primaryColor:d="#000000",selectedStep:a,setSelectedStep:y,appearance:c,type:x,className:b,customStepTypes:F,style:P})=>{let f=o.filter(u=>u.complete).length,[B,h]=(0,xe.useState)(Array(o.length).fill(!0));(0,xe.useEffect)(()=>{let u=[...B];if(n){for(let T=0;T<o.length;T++)if(!o[T].complete){u[T]=!1;break}h(u)}},[]),(0,xe.useEffect)(()=>{k(a)},[a]);let k=u=>{let T=[...B];if(s)for(let S=0;S<B.length;++S)S!==u&&(T[S]=!0);T[u]=!T[u],h(T)};if(!r&&x=="modal")return xe.default.createElement(xe.default.Fragment,null);let L=xe.default.createElement(xe.default.Fragment,null,xe.default.createElement(ws,null,xe.default.createElement(Ts,{appearance:c,className:l("checklistTitle",c),dangerouslySetInnerHTML:we(e)}),xe.default.createElement(Fs,{appearance:c,className:l("checklistSubtitle",c),dangerouslySetInnerHTML:we(t)})),xe.default.createElement(Ve,{display:"percent",count:f,total:o.length,fillColor:d,style:{margin:"14px 0px 8px 0px"},appearance:c})),C=xe.default.createElement(ks,{className:Ee(l("checklistContainer",c),b)},o.map((u,T)=>{let S=B[T];return xe.default.createElement(bs,{appearance:c,stepData:u,collapsed:S,key:`modal-checklist-${u.id??T}`,onClick:()=>{if(a===T){k(T);return}y(T)},onPrimaryButtonClick:()=>{u.handlePrimaryButtonClick&&u.handlePrimaryButtonClick(),p&&!u.completionCriteria&&T<B.length-1&&B[T+1]&&y(T+1)},onSecondaryButtonClick:()=>{u.handleSecondaryButtonClick&&u.handleSecondaryButtonClick()},customStepTypes:F})}));return x==="inline"?xe.default.createElement(Ps,{appearance:c,className:Ee(l("checklistInlineContainer",c),b),style:P},L,C):xe.default.createElement(xe.default.Fragment,null,xe.default.createElement(xt,{onClose:i,visible:r,appearance:c,style:{maxWidth:"600px"},headerContent:L},C))},Nr=$p;var _=m(require("react"));var $t=m(require("react"));var Q=m(require("styled-components"));var vs=Q.css`
  border: 1px solid ${({theme:e})=>e.colorBorder};
`,Mp=Q.css`
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.06);
`,Up=Q.keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`,zp=Q.keyframes`
  from {
    opacity: 1;
  } to {
    opacity: 0;
  }
`,Bs=Q.default.div`
  margin: 0 -20px;
  overflow-x: auto;
  padding-left: 20px;
  padding-right: 20px;
  scroll-snap-type: x mandatory;

  display: flex;
  flex-flow: row nowrap;
  gap: 0 16px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`,Es=Q.default.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0 16px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`,As=Q.default.div`
  animation: ${e=>e.reversed?zp:Up} 0.25s ease-out;
  background: linear-gradient(
    to right,
    ${({theme:e})=>e.colorBackground}00,
    ${({theme:e})=>e.colorBackground} 100%
  );
  position: absolute;
  width: 64px;
  z-index: 10;
`,Is=Q.default.button`
  ${vs}
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  align-items: center;
  border-radius: 50%;
  background: ${({theme:e})=>e.colorBackground};
  color: ${({theme:e})=>e.colorPrimary};
  display: flex;
  height: 48px;
  justify-content: center;
  position: absolute;
  width: 48px;
`,Ns=Q.default.div`
  border-radius: ${({theme:e})=>e.borderRadius}px;
  padding: 20px;
`,Os=(0,Q.default)(Ns)`
  ${vs}
  background: ${({theme:e})=>e.colorBackground};
  position: relative;

  &:active {
    ${e=>e.blocked?"":`background: ${e.theme.colorBackgroundSecondary};`}
  }

  &:hover {
    ${e=>e.blocked?"":`border: 1px solid ${e.theme.colorPrimary};`}
    ${e=>e.blocked?"cursor: default":"cursor: pointer"}
  }
`,Ls=Q.default.img`
  border-radius: 50%;
  height: 40px;
  margin-bottom: 12px;
  width: 40px;
`,Ds=(0,Q.default)(Ns)`
  ${e=>v(e)} {
    ${Mp}

    background: ${({theme:e})=>e.colorBackground};
  }
`,nx=Q.default.div`
  color: ${({theme:e})=>e.colorPrimary};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`,sx=Q.default.div`
  white-space: nowrap;
`,$s=Q.default.div`
  background: #d8fed8;
  border-radius: 6px;
  float: right;
  margin-bottom: 12px;
  padding: 4px 10px;
`,_p=Q.default.p`
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: calc(18px * -0.01);
  margin: 0;
`,Ms=(0,Q.default)(_p)`
  margin-bottom: 4px;
`,Us=Q.default.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-width: 50%;
`,Wp=Q.default.p`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: calc(16px * -0.01);
  margin: 0;
`,zs=(0,Q.default)(Wp)`
  margin-bottom: 4px;
  ${e=>e.blocked||e.complete?"opacity: 0.4;":`
  `}
`,Ft=Q.default.p`
  color: ${({theme:e})=>e.colorText};
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
`,_s=Q.default.p`
  color: ${({theme:e})=>e.colorText};
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  margin: 0;
`;Ft.Loud=(0,Q.default)(Ft)`
  font-weight: 600;
`;Ft.Quiet=(0,Q.default)(Ft)`
  color: ${({theme:e})=>e.colorTextSecondary};
  ${e=>e.blocked||e.complete?"opacity: 0.4;":`
  `}
`;var Ws=({stepData:e,style:t={},appearance:o})=>{let{mergeAppearanceWithDefault:i}=le(),{primaryCTAClickSideEffects:r}=ge();o=i(o);let{imageUri:n=null,subtitle:s=null,title:p=null,complete:d=!1,blocked:a=!1}=e,y=e.primaryButtonTitle||e.secondaryButtonTitle,c=()=>{r(e)};return $t.default.createElement(Os,{className:l("carouselCard",o),onClick:a?null:c,style:t,blocked:a,complete:d},n&&$t.default.createElement(Ls,{className:l("carouselCardImage",o),src:n,alt:p,style:{opacity:d||a?.4:1}}),d&&$t.default.createElement($s,{className:l("carouselCompletedPill",o)},$t.default.createElement(_s,{style:{color:"#108E0B"}},"Complete")),p&&$t.default.createElement(zs,{blocked:a,complete:d,className:l("carouselCardTitle",o)},p),s&&$t.default.createElement(Ft.Quiet,{blocked:a,complete:d,className:l("carouselCardSubtitle",o)},s))};var Hp=()=>_.default.createElement("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},_.default.createElement("path",{d:"M14 6L20 12",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"}),_.default.createElement("path",{d:"M14 18L20 12",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"}),_.default.createElement("path",{d:"M4 12H20",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})),Hs=({side:e="left",show:t=!1,onClick:o=()=>{}})=>{let[i,r]=(0,_.useState)(!1),[n,s]=(0,_.useState)(!1);(0,_.useEffect)(()=>{t===!0&&i===!1?r(!0):t===!1&&i===!0&&s(!0)},[t]);let p=()=>{r(!1),s(!1)},d=e=="left"?{top:0,bottom:0,left:-20,transform:"rotate(180deg)"}:{top:0,bottom:0,right:-20};return i?_.default.createElement(As,{style:d,reversed:n,onAnimationEnd:n?p:null},_.default.createElement(Is,{onClick:()=>o(),style:{right:16,top:"calc(50% - 24px)"}},_.default.createElement(Hp,null))):null},Vs=({flowId:e,appearance:t,customVariables:o,className:i})=>{let r=(0,_.useRef)(null),[n,s]=(0,_.useState)(!1),[p,d]=(0,_.useState)(!1),[a,y]=(0,_.useState)(null),[c,x]=(0,_.useState)([]),[b,F]=(0,_.useState)(0),{isSmall:P}=sr(),f=P?1:3,{getFlowMetadata:B,getFlowSteps:h,getNumberOfStepsCompleted:k,updateCustomVariables:L,isLoading:C}=R();(0,_.useEffect)(()=>{L(o)},[o,C]),(0,_.useEffect)(()=>{if(C)return;let O=B(e),U=k(e),$=h(e);y(O),O.data!==null&&(x($.sort((j,H)=>Number(j.complete)-Number(H.complete))),d($.length>f),F(U))},[C]);let u=[];for(let O=0;O<c.length;O+=f)u.push(c.slice(O,O+f));let T=O=>{let U=O.target,$=U.scrollWidth-U.clientWidth,j=Math.ceil(U.scrollLeft);j>0&&n===!1&&s(!0),j===0&&n===!0&&s(!1),j<$&&p===!1&&d(!0),j===$&&p===!0&&d(!1)},S=(O=!0)=>{let U=O?1:-1;r.current!==null&&r.current.scrollBy({left:r.current.clientWidth*U,behavior:"smooth"})},A=null,D=O=>{A!==null?clearTimeout(A):T(O),A=setTimeout(()=>{T(O)},16)};return C?null:_.default.createElement(Ds,{className:Ee(l("carouselContainer",t),i)},_.default.createElement("div",{style:{display:"flex",justifyContent:P?"center":"space-between",marginBottom:20,flexWrap:P?"wrap":"nowrap",gap:P?16:20}},_.default.createElement("div",null,_.default.createElement(Ms,{className:l("carouselTitle",t)},a==null?void 0:a.title),_.default.createElement(Ft.Quiet,{className:l("carouselSubtitle",t)},a==null?void 0:a.subtitle)),_.default.createElement(Us,{className:l("progressWrapper",t)},_.default.createElement(Ve,{count:b,total:c.length,appearance:t}))),_.default.createElement("div",{style:{position:"relative"}},_.default.createElement(Hs,{show:n,onClick:()=>S(!1)}),_.default.createElement(Hs,{side:"right",show:p,onClick:S}),_.default.createElement(Bs,{ref:r,onScroll:D},u.map((O,U)=>_.default.createElement(Es,{key:U,style:{flex:`0 0 calc(100% - ${c.length>f?36:0}px)`}},O.map(($,j)=>_.default.createElement(Ws,{key:j,stepData:$,style:{flex:c.length>f?`0 1 calc(100% / ${f} - 16px * 2 / ${f})`:1},appearance:t})))))),_.default.createElement(me,{appearance:t}))};var ar=({flowId:e,title:t,subtitle:o,style:i,initialSelectedStep:r,className:n,type:s="inline",onDismiss:p,visible:d,customVariables:a,onStepCompletion:y,onButtonClick:c,appearance:x,hideOnFlowCompletion:b,setVisible:F,customStepTypes:P,checklistStyle:f="default",autoExpandFirstIncompleteStep:B,autoExpandNextStep:h,...k})=>{let{getFlow:L,getFlowSteps:C,markStepCompleted:u,getStepStatus:T,getNumberOfStepsCompleted:S,isLoading:A,targetingLogicShouldHideFlow:D,updateCustomVariables:O,getFlowMetadata:U,isStepBlocked:$,getFlowStatus:j,hasActiveFullPageFlow:H,setHasActiveFullPageFlow:ae}=R(),{primaryCTAClickSideEffects:ne,secondaryCTAClickSideEffects:Z}=ge(),{getOpenFlowState:se,setOpenFlowState:fe}=Ne(),[oe,X]=(0,te.useState)(r||0),[ve,De]=(0,te.useState)(!1),J=d===void 0?se(e):d,he=s==="modal",{mergeAppearanceWithDefault:W}=le(),{isLarge:M}=sr();if(x=W(x),(0,te.useEffect)(()=>{O(a)},[a,A]),(0,te.useEffect)(()=>{d!==void 0&&(he&&d===!0?ae(!0):he&&d===!1&&ae(!1))},[d,F,H]),A)return null;let pe=L(e);if(!pe||D(pe))return null;let q=C(e);if(!q||b===!0&&j(e)===ie)return null;let de=U(e);if(de!=null&&de.title&&(t=de.title),de!=null&&de.subtitle&&(o=de.subtitle),!ve&&r===void 0&&S(e)>0){let I=q.findIndex(re=>re.complete===!1);X(I>-1?I:q.length-1),De(!0)}function at(){if(oe+1>=q.length){he&&fe(e,!1);return}$(e,q[oe+1].id)||X(oe+1)}function Je(I,re,vt){let Vr=oe+1<q.length?q[oe+1]:null;c&&c(I,oe,re,Vr)===!0&&he&&Qe(),y&&y(I,vt,Vr),!y&&!c&&(I.primaryButtonUri||I.secondaryButtonUri)&&he&&Qe()}function Pt(){return q.map((I,re)=>({...I,handleSecondaryButtonClick:()=>{at(),Z(I),I.skippable===!0&&u(e,I.id,{skipped:!0}),Je(I,"secondary",re)},handlePrimaryButtonClick:()=>{(!I.completionCriteria&&(I.autoMarkCompleted||I.autoMarkCompleted===void 0)||I.completionCriteria&&I.autoMarkCompleted===!0)&&(u(e,I.id),at()),Je(I,"primary",re),ne(I),T(e,I.id)===Ge&&at()}}))}function V(){return te.default.createElement(me,{appearance:x})}let ze={steps:Pt(),title:t,subtitle:o,primaryColor:x.theme.colorPrimary,appearance:x,customStepTypes:P,type:s,className:n,autoExpandFirstIncompleteStep:B,autoExpandNextStep:h};function Qe(){fe(e,!1),p&&p(),F&&F(!1)}function mr(){return te.default.createElement(te.default.Fragment,null,te.default.createElement(V,null),te.default.createElement(Vs,{flowId:e,appearance:x,customVariables:a,className:n}))}function g(){return te.default.createElement(te.default.Fragment,null,te.default.createElement(V,null),te.default.createElement(Nr,{visible:J,onClose:()=>{Qe()},selectedStep:oe,setSelectedStep:X,autoExpandNextStep:!0,appearance:x,...ze}))}function w(){if(!M)return g();let I=k.guideFlowId,re;return I&&L(I)&&(re=C(I)),te.default.createElement(te.default.Fragment,null,te.default.createElement(V,null),te.default.createElement(Ir,{visible:J,stepsTitle:de.stepsTitle?de.stepsTitle:"Your quick start guide",onClose:()=>{Qe()},selectedStep:oe,setSelectedStep:X,guideData:re,guideTitle:k.guideTitle??"Guide",appearance:x,title:t,subtitle:o,onGuideButtonClick:vt=>{Je(vt,"link",0)},customStepTypes:P,...ze}))}function E(){if(!M)return g();let I=te.default.createElement(Br,{flowId:e,style:i,selectedStep:oe,setSelectedStep:X,appearance:x,type:s,...ze});return he?te.default.createElement(xt,{onClose:()=>{Qe()},visible:J,appearance:x,style:{paddingTop:"0px",padding:"12px",paddingLeft:0}},te.default.createElement(V,null),I):te.default.createElement(te.default.Fragment,null,te.default.createElement(V,null),I)}switch(f){case"condensed":return g();case"with-guide":return w();case"default":return E();case"carousel":return mr();default:return E()}};var Gs=e=>js.default.createElement(ar,{type:"inline",...e});var Ye=m(require("react"));var Ke=m(require("react"));var Eo=m(require("styled-components")),qs=Eo.default.div`
  border: 1px solid ${e=>e.appearance.theme.colorBorder};
  border-radius: 8px;
  padding: 6px 10px 6px 10px;
  min-width: 160px;
  cursor: pointer;
  background-color: ${e=>e.appearance.theme.colorBackground}};
`,Ks=Eo.default.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  flex-grow: 2;
`,Ys=Eo.default.div`
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: ${e=>e.type==="condensed"?"left":"right"};
  color: ${e=>e.appearance.theme.colorPrimary};
`,Xs=Eo.default.div`
  width: 20px;
  margin-right: 8px;
  display: flex;
  height: 100%;
  align-items: center;
`;var Js=require("framer-motion");var Qs=({title:e,count:t,total:o,onClick:i,style:r={},className:n,appearance:s,type:p="default"})=>Ke.default.createElement(Ke.default.Fragment,null,Ke.default.createElement(me,{appearance:s}),Ke.default.createElement(qs,{as:Js.motion.div,whileHover:{opacity:.9},whileTap:{scale:.98},onClick:()=>i!==void 0&&i(),style:{...p=="condensed"?{display:"flex",justifyContent:"space-between"}:{},...r},className:Ee(n??"",l("progressRingContainer",s)),appearance:s},p=="condensed"&&o&&o!==0&&Ke.default.createElement(Xs,{className:l("progressRingContainer",s)},Ke.default.createElement(It,{size:19,percentage:t/o,fillColor:s.theme.colorPrimary,bgColor:s.theme.colorBackgroundSecondary})),Ke.default.createElement(Ks,{type:p,className:l("badgeTitleContainer",s)},Ke.default.createElement(Ys,{type:p,appearance:s,className:l("badgeTitle",s)},e),i!==void 0&&Ke.default.createElement(io,{className:l("badgeChevron",s),color:s.theme.colorPrimary})),p=="default"&&o&&o!==0&&Ke.default.createElement(Ve,{display:"compact",count:t,total:o,fillColor:s.theme.colorPrimary,bgColor:s.theme.colorBackgroundSecondary,style:{width:"100%"},appearance:s})));var gt=m(require("react"));var no=m(require("styled-components"));var Zs=no.default.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  align-items: center;
  background-color: ${e=>e.appearance.theme.colorBackground};
  border-width: 1px;
  border-color: ${e=>e.appearance.theme.colorPrimary};
  border-radius: 12px;
`,Rs=no.default.div`
  ${e=>v(e)} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
  }
`,el=no.default.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 0;
`,tl=no.default.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  min-width: 200px;
`,Qx=no.default.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-left: 16px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;var ol=({title:e,subtitle:t,icon:o,appearance:i,count:r,total:n,className:s,style:p})=>gt.default.createElement(gt.default.Fragment,null,gt.default.createElement(Zs,{appearance:i,className:Ee(l("fullWidthProgressBadgeContainer",i),s??""),style:p},o&&gt.default.createElement(Rs,{className:l("fullWidthProgressBadgeIcon",i)},o),gt.default.createElement(el,null,gt.default.createElement(Ae,{size:"small",appearance:i,title:e,subtitle:t})),gt.default.createElement(tl,{className:l("fullWidthProgressBadgeProgressContainer",i)},gt.default.createElement(Ve,{count:r,total:n,display:"percent",textLocation:"top",fillColor:i.theme.colorPrimary}))));var rl=({flowId:e,title:t,subtitle:o,icon:i,style:r,onClick:n,className:s,customVariables:p,hideOnFlowCompletion:d,appearance:a,type:y="default"})=>{let{getFlow:c,getFlowSteps:x,getFlowStatus:b,getNumberOfStepsCompleted:F,isLoading:P,targetingLogicShouldHideFlow:f,updateCustomVariables:B}=R(),{mergeAppearanceWithDefault:h}=le();a=h(a);let{setOpenFlowState:k,getOpenFlowState:L}=Ne();if((0,Ye.useEffect)(()=>{B(p)},[p,P]),P)return null;let C=c(e);if(!C||f(C)||d===!0&&b(e)===ie)return null;let u=x(e),T=F(e);return y==="full-width"?Ye.default.createElement(Ye.default.Fragment,null,Ye.default.createElement(me,{appearance:a}),Ye.default.createElement(ol,{title:t,subtitle:o,count:T,total:u.length,style:r,className:s,appearance:a,icon:i,onClick:()=>{}})):Ye.default.createElement(Ye.default.Fragment,null,Ye.default.createElement(me,{appearance:a}),Ye.default.createElement(Qs,{count:T,total:u.length,title:t,style:r,onClick:()=>{k(e,!0),n&&n()},type:y,className:s,appearance:a}))};var il=m(require("react"));var nl=({flowId:e,style:t,appearance:o,...i})=>{let{getFlow:r,targetingLogicShouldHideFlow:n,getFlowSteps:s}=R(),{mergeAppearanceWithDefault:p}=le();o=p(o);let d=r(e);if(!d||n(d))return null;let a=s(e);return il.default.createElement(Bo,{steps:a,style:t,appearance:o,...i})};var Xe=m(require("react"));var N=m(require("react"));var ao=m(require("styled-components"));var so=require("react"),Or=(e,t,o,i={x:20,y:20},r)=>{let n=r=="fixed"?0:window.scrollY,s=r=="fixed"?0:window.scrollX;return!e||!e.left||!e.top?{x:0,y:0}:t==="left"?{x:e.left-o+i.x+s,y:e.top-i.y+n}:t==="right"?{x:e.left+e.width+i.x+s,y:e.top-i.y+n}:{x:0,y:0}},sl={bottom:0,height:0,left:0,right:0,top:0,width:0,x:0,y:0};function Vp(e){let t=sl;return e&&(t=e.getBoundingClientRect()),t}function ll(e,t){let[o,i]=(0,so.useState)(sl),r=(0,so.useCallback)(()=>{e&&i(Vp(e))},[e]);return(0,so.useEffect)(()=>(r(),window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)),[e,t]),o}var al=300,pl=100,jp=500,lo=12,Gp=ao.default.div`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  display: inline-flex;
  background-color: ${e=>e.primaryColor};
  animation-duration: 1.5s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-delay: 0.15s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: ping;
  opacity: 0.15;

  @keyframes ping {
    75%,
    to {
      transform: scale(1.75);
      opacity: 0;
    }
  }
`,qp=ao.default.div`
  width: ${lo}px;
  height: ${lo}px;
  border-radius: 100px;
  background-color: ${e=>e.primaryColor};
  z-index: 20;
  opacity: 1;
`,Kp=ao.default.div`
  pointer-events: all;
`,dl=ao.default.div`
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: ${e=>e.zIndex?e.zIndex:90};
`,Yp=(0,ao.default)(dl)`
  width: ${lo+12}px;
  height: ${lo+12}px;
`,Xp=({steps:e=[],onDismiss:t,onComplete:o=()=>{},tooltipPosition:i="auto",showHighlight:r=!0,primaryColor:n="#000000",offset:s={x:0,y:0},visible:p=!0,containerStyle:d={},selectedStep:a=0,customStepTypes:y,appearance:c,dismissible:x=!1,showHighlightOnly:b,showStepCount:F=!0,completedStepsCount:P=0,showFrigadeBranding:f=!1})=>{var de,at,Je,Pt;let[B,h]=(0,N.useState)(),[k,L]=(0,N.useState)(new Date),C=(0,N.useRef)(null),[u,T]=(0,N.useState)(document.querySelector(e[a].selector)),S=ll(u,k),[A,D]=(0,N.useState)(),[O,U]=(0,N.useState)(!b),$=(at=(de=e[a])==null?void 0:de.props)!=null&&at.position?e[a].props.position:"absolute",j=((Pt=(Je=e[a])==null?void 0:Je.props)==null?void 0:Pt.zIndex)??90,H=(B==null?void 0:B.width)??al,ae=(B==null?void 0:B.height)??pl;(0,N.useLayoutEffect)(()=>{C.current&&h({width:C.current.clientWidth,height:C.current.clientHeight})},[a,k,$]),(0,N.useEffect)(()=>{b||U(!0)},[a]);let ne=i==="auto"?"right":i,Z=Or(S,ne,H,s,$),se=S.right+H>(window.innerWidth||document.documentElement.clientWidth),fe=S.bottom+pl>(window.innerHeight||document.documentElement.clientHeight);se&&i==="auto"&&(Z=Or(S,"left",H,s,$),ne="left");let oe=window.location.pathname.split("/").pop(),X=()=>{let V=document.querySelector(e[a].selector);if(!V){D(void 0),T(null);return}A&&A===JSON.stringify(V==null?void 0:V.getBoundingClientRect())||(T(V),L(new Date),V&&D(JSON.stringify(V.getBoundingClientRect())))};if((0,N.useEffect)(()=>{let V=new MutationObserver(X);return V.observe(document.body,{subtree:!0,childList:!0}),()=>V.disconnect()},[X]),(0,N.useEffect)(()=>{let V=new MutationObserver(X);return V.observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["style","class"]}),()=>V.disconnect()},[X]),(0,N.useEffect)(()=>{let V=setInterval(()=>{X()},10);return()=>clearInterval(V)},[X]),(0,N.useLayoutEffect)(()=>{setTimeout(()=>{X()},jp),X()},[a,oe]),u===null)return N.default.createElement(N.default.Fragment,null);if(Z.x==0&&Z.y==0)return N.default.createElement(N.default.Fragment,null);if(!p)return N.default.createElement(N.default.Fragment,null);let ve=()=>{let V=()=>{if(e[a].handlePrimaryButtonClick&&(e[a].handlePrimaryButtonClick(),U(!1),setTimeout(()=>{X()},30)),P===e.length-1)return o()},ze=()=>{e[a].handleSecondaryButtonClick&&(e[a].handleSecondaryButtonClick(),b&&!e[a].secondaryButtonUri&&U(!1))};return N.default.createElement(N.default.Fragment,null,F&&e.length>1&&N.default.createElement(li,null,N.default.createElement(pi,{className:l("tooltipStepCounter",c)},a+1," of ",e.length)),N.default.createElement(ai,{showStepCount:F,className:l("tooltipCTAContainer",c)},e[a].secondaryButtonTitle&&N.default.createElement(ce,{title:e[a].secondaryButtonTitle,appearance:c,onClick:ze,size:"small",withMargin:!1,secondary:!0}),e[a].primaryButtonTitle&&N.default.createElement(ce,{title:e[a].primaryButtonTitle,appearance:c,onClick:V,withMargin:!1,size:"small"})))},De=()=>N.default.createElement(N.default.Fragment,null,x&&N.default.createElement(ri,{"data-testid":"tooltip-dismiss",onClick:()=>{t&&t()},className:l("tooltipClose",c)},N.default.createElement($e,null)),e[a].imageUri&&N.default.createElement(ii,{dismissible:x,appearance:c,src:e[a].imageUri,className:l("tooltipImageContainer",c)}),e[a].videoUri&&!e[a].imageUri&&N.default.createElement(ni,{dismissible:x,appearance:c,className:l("tooltipVideoContainer",c)},N.default.createElement(yt,{appearance:c,videoUri:e[a].videoUri})),N.default.createElement(Ae,{appearance:c,title:e[a].title,subtitle:e[a].subtitle,size:"small"}),N.default.createElement(si,{className:l("tooltipFooter",c)},N.default.createElement(ve,null))),he={...{default:V=>{var ze;if((ze=e[a])!=null&&ze.StepContent){let Qe=e[a].StepContent;return N.default.createElement("div",null,Qe)}return N.default.createElement(De,null)}},...y},W=()=>{var V;return e?!((V=e[a])!=null&&V.type)||!he[e[a].type]?he.default(e[a]):he[e[a].type]({stepData:e[a],primaryColor:n}):N.default.createElement(N.default.Fragment,null)};if(b&&e[a].complete===!0)return null;let M={top:(Z==null?void 0:Z.y)-lo,left:(ne=="left"?S.x+s.x:(Z==null?void 0:Z.x)-lo)??0,cursor:b?"pointer":"default",position:$},pe=()=>{let ze=M.left+(ne=="left"?-H:24);return Math.min(Math.max(ze,20),window.innerWidth-H-20)},q=()=>{b&&(L(new Date),U(!O))};return N.default.createElement(Kp,null,N.default.createElement(Yp,{style:M,zIndex:j,className:l("tourHighlightContainer",c)},r&&e[a].showHighlight!==!1&&N.default.createElement(N.default.Fragment,null,N.default.createElement(qp,{style:{position:$},onClick:q,primaryColor:c.theme.colorPrimary,className:l("tourHighlightInnerCircle",c)}),N.default.createElement(Gp,{style:{position:"absolute"},onClick:q,primaryColor:c.theme.colorPrimary,className:l("tourHighlightOuterCircle",c)}))),N.default.createElement(dl,{style:{...M,left:pe()},zIndex:j+1,className:l("tooltipContainerWrapper",c)},O&&N.default.createElement(N.default.Fragment,null,N.default.createElement($o,{ref:C,layoutId:"tooltip-container",style:{position:"relative",width:"max-content",right:0,top:12,...d},appearance:c,className:l("tooltipContainer",c),maxWidth:al,zIndex:j+10},N.default.createElement(W,null)),f&&N.default.createElement(ci,{className:l("poweredByFrigadeTooltipRibbon",c),appearance:c,zIndex:j+10},N.default.createElement(Uo,{appearance:c})))))},pr=Xp;var cl=require("react-portal");var ml=({flowId:e,customVariables:t,appearance:o,onStepCompletion:i,onButtonClick:r,showTooltipsSimultaneously:n=!1,onDismiss:s,dismissible:p,tooltipPosition:d="auto",showHighlightOnly:a=!1,dismissBehavior:y="complete-flow",onComplete:c,skipIfNotFound:x=!1,...b})=>{let{getFlow:F,getFlowSteps:P,isLoading:f,targetingLogicShouldHideFlow:B,markStepCompleted:h,markStepStarted:k,markFlowCompleted:L,updateCustomVariables:C,getCurrentStepIndex:u,getStepStatus:T,isStepBlocked:S,getFlowStatus:A,getNumberOfStepsCompleted:D}=R(),{isLoadingUserFlowStateData:O}=We(),{primaryCTAClickSideEffects:U,secondaryCTAClickSideEffects:$}=ge(),{hasOpenModals:j}=Ne(),H=u(e),{openFlowStates:ae}=(0,Xe.useContext)(K),{mergeAppearanceWithDefault:ne}=le();if(o=ne(o),(0,Xe.useEffect)(()=>{C(t)},[t,f]),O)return null;let Z=F(e);if(!Z||B(Z)||A(e)==ie||j())return null;let se=P(e);if(Object.keys(ae).length>0){let W=Object.keys(ae).find(M=>ae[M]===!0);if(W!==void 0&&W!==e)return Xe.default.createElement(Xe.default.Fragment,null)}async function fe(W){if(await h(e,W.id),se.map(M=>T(e,M.id)).every(M=>M===Ge)){await L(e);return}if(!a&&H+1<se.length){if(S(e,se[H+1].id))return;await k(e,se[H+1].id)}}function oe(W,M,pe){let q=H+1<se.length?se[H+1]:null;r&&r(W,H,M,q),i&&i(W,pe,q)}function X(){return se.map(W=>({...W,handleSecondaryButtonClick:async()=>{$(W),W.skippable===!0&&await h(e,W.id,{skipped:!0}),oe(W,"secondary",H)},handlePrimaryButtonClick:async()=>{(!W.completionCriteria&&(W.autoMarkCompleted||W.autoMarkCompleted===void 0)||W.completionCriteria&&W.autoMarkCompleted===!0)&&await fe(W),oe(W,"primary",H),U(W)}}))}async function ve(W){s&&s(),y==="complete-flow"?await L(e):await h(e,W.id)}function De(){c&&c()}let J=!document.querySelector(se[H].selector);function he(){let W=se.findIndex(M=>!!document.querySelector(M.selector));return se.map((M,pe)=>J&&!n&&pe!==W&&x?null:Xe.default.createElement(pr,{key:M.id,appearance:o,steps:X(),selectedStep:pe,showTooltipsSimultaneously:n,dismissible:p,onDismiss:()=>ve(M),tooltipPosition:d,showHighlightOnly:a,completedStepsCount:D(e),onComplete:De,...b}))}return Xe.default.createElement(cl.Portal,null,Xe.default.createElement(me,{appearance:o}),n||J&&x?he():Xe.default.createElement(pr,{appearance:o,steps:X(),selectedStep:H,showTooltipsSimultaneously:n,dismissible:p,onDismiss:()=>ve(se[H]),tooltipPosition:d,completedStepsCount:D(e),showHighlightOnly:a,onComplete:De,...b}))};var ue=m(require("react"));var wl=require("react-portal");var kt=m(require("styled-components"));var ul=kt.default.button`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 6px 10px;
    gap: 8px;

    background: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 21px;
    font-size: 12px;
    :hover {
      opacity: 0.8;
    }
  }
`,fl=kt.default.span`
  ${e=>v(e)} {
    font-size: 12px;
    display: inline-block;
  }
`,gl=kt.default.span`
  ${e=>v(e)} {
    font-size: 12px;
    display: inline-block;
  }
`,xl=kt.default.div`
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 50;
`,hl=kt.default.button`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background-color: #ffffff;
    border: 1px solid #f5f5f5;
  }
  width: 50px;
  height: 50px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 45px;
  cursor: pointer;
`,Cl=kt.default.div`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
  }

  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: 4px;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 22px;
  position: ${e=>e.type=="inline"?"absolute":"relative"};
  top: ${e=>e.type=="inline"?"68px":0};
  margin-left: ${e=>e.type=="inline"?"-127px":0};
`,yl=kt.default.button`
  ${e=>v(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: #434343;
    :hover {
      background-color: #f5f5f5;
    }
  }

  display: flex;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;

  padding: 8px 12px;
`;var po=require("framer-motion");var Lr=m(require("react")),Sl=({style:e,className:t})=>Lr.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"18",height:"18",fill:"none",viewBox:"0 0 18 18",style:e,className:t},Lr.default.createElement("path",{fill:"currentColor",d:"M13.43 4.938a4.494 4.494 0 00-1.043-1.435A4.955 4.955 0 009 2.197c-1.276 0-2.48.464-3.387 1.305A4.502 4.502 0 004.57 4.938a4.242 4.242 0 00-.386 1.773v.475c0 .109.087.197.196.197h.95a.197.197 0 00.197-.197V6.71c0-1.749 1.557-3.17 3.473-3.17s3.473 1.421 3.473 3.17c0 .718-.254 1.393-.738 1.955a3.537 3.537 0 01-1.9 1.125 1.928 1.928 0 00-1.085.682c-.271.343-.42.768-.42 1.206v.552c0 .109.088.197.197.197h.95a.197.197 0 00.196-.197v-.552c0-.276.192-.519.457-.578a4.904 4.904 0 002.625-1.56c.335-.392.597-.828.778-1.3a4.256 4.256 0 00-.103-3.303zM9 13.834a.985.985 0 10.001 1.97.985.985 0 00-.001-1.97z"}));var Dr=m(require("react")),bl=({style:e,className:t})=>Dr.default.createElement("svg",{style:e,className:t,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"currentColor"},Dr.default.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"}));var Tl=({flowId:e,style:t,onStepCompletion:o,visible:i=!0,type:r="inline",title:n="Help",appearance:s})=>{let{getFlow:p,getFlowSteps:d,markStepCompleted:a,getStepStatus:y,getNumberOfStepsCompleted:c,isLoading:x,targetingLogicShouldHideFlow:b}=R(),{primaryCTAClickSideEffects:F}=ge(),P=(0,ue.useRef)(null),[f,B]=(0,ue.useState)(!1),{mergeAppearanceWithDefault:h}=le();s=h(s),(0,ue.useEffect)(()=>(document.addEventListener("click",k,!1),()=>{document.removeEventListener("click",k,!1)}),[]);let k=S=>{P.current&&!P.current.contains(S.target)&&B(!1)};if(x)return null;let L=p(e);if(!L||b(L))return null;let C=d(e);if(!C||!i)return null;function u(S,A){!S.completionCriteria&&(S.autoMarkCompleted||S.autoMarkCompleted===void 0)&&a(e,S.id),F(S),o&&o(S,A),B(!1)}function T(){return f&&ue.default.createElement(Cl,{className:l("floatingWidgetMenu",s),as:po.motion.div,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.1},type:r},C.map((S,A)=>ue.default.createElement(yl,{className:l("floatingWidgetMenuItem",s),key:A,onClick:()=>u(S,A)},S.title)))}return r=="inline"?ue.default.createElement("span",{ref:P},ue.default.createElement(ul,{style:t,onClick:()=>{B(!f)},className:l("supportButton",s)},ue.default.createElement(gl,{className:l("supportIconContainer",s)},ue.default.createElement(bl,{className:l("supportIcon",s),style:{width:"18px",height:"18px"}})),ue.default.createElement(fl,{className:l("supportButtonTitle",s)},n)),ue.default.createElement(po.AnimatePresence,null,ue.default.createElement(T,null))):ue.default.createElement(wl.Portal,null,ue.default.createElement(xl,{style:t,ref:P},ue.default.createElement(po.AnimatePresence,null,ue.default.createElement(T,null)),ue.default.createElement(hl,{onClick:()=>{B(!f)},as:po.motion.button,whileHover:{scale:1.1},className:l("floatingWidgetButton",s)},ue.default.createElement(Sl,{className:l("floatingWidgetButtonIcon",s),style:{display:"flex",width:"20px",height:"20px"}}))))};var Ue=m(require("react"));var Ao=m(require("styled-components"));var Fl=Ao.default.div`
  ${e=>v(e)} {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    padding: 28px 18px;
    box-sizing: border-box;
    align-items: unset;
    background-color: ${e=>e.appearance.theme.colorBackground};
    border-width: 1px;
    border-color: ${e=>e.appearance.theme.colorBorder};
    border-radius: 12px;
    position: relative;
  }
`,kl=Ao.default.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`,Pl=Ao.default.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
`,vl=Ao.default.div`
  ${e=>v(e)} {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`;var Bl=({flowId:e,onDismiss:t,customVariables:o,onButtonClick:i,appearance:r,className:n,style:s,dismissible:p})=>{let{getFlow:d,markFlowCompleted:a,markStepCompleted:y,isLoading:c,targetingLogicShouldHideFlow:x,updateCustomVariables:b,getFlowSteps:F,getFlowStatus:P,getCurrentStepIndex:f}=R(),{primaryCTAClickSideEffects:B}=ge(),{mergeAppearanceWithDefault:h}=le();if(r=h(r),(0,Ue.useEffect)(()=>{b(o)},[o,c]),c)return null;let k=d(e);if(!k||x(k)||P(e)===ie)return null;let C=F(e)[f(e)];return Ue.default.createElement(Ue.default.Fragment,null,Ue.default.createElement(me,{appearance:r}),Ue.default.createElement(Fl,{appearance:r,className:Ee(l("embeddedTipContainer",r),n),style:s},(p===!0||C.dismissible)&&Ue.default.createElement(vl,{onClick:async()=>{await a(e),t&&t()},className:l("embeddedTipDismissButton",r)},Ue.default.createElement($e,null)),Ue.default.createElement(kl,null,Ue.default.createElement(Ae,{size:"small",appearance:r,title:C.title,subtitle:C.subtitle})),C.primaryButtonTitle&&Ue.default.createElement(Pl,{className:l("embeddedTipCallToActionContainer",r)},Ue.default.createElement(ce,{classPrefix:"embeddedTip",title:C.primaryButtonTitle,appearance:r,withMargin:!1,size:"small",type:"inline",onClick:async()=>{C.handlePrimaryButtonClick(),B(C),!(i&&i(C,f(e),"primary")===!1)&&(await y(e,C.id),await a(e))}}))))};var be=m(require("react"));var Mt=m(require("styled-components"));var El=Mt.default.div`
  // use the :not annotation
  ${e=>v(e)} {
    display: flex;
    flex-direction: ${e=>e.type==="square"?"column":"row"};
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    align-items: ${e=>e.type==="square"?"unset":"center"};
    background-color: ${e=>e.appearance.theme.colorBackground};
    border-width: 1px;
    border-color: ${e=>e.appearance.theme.colorPrimary};
    border-radius: 12px;
  }
`,Al=Mt.default.div`
  ${e=>v(e)} {
    display: flex;
    width: 36px;
    height: 36px;
  }
`,Il=Mt.default.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
  margin-top: ${e=>e.type==="square"?"12px":"0"};
`,Nl=Mt.default.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
`,$r=Mt.default.div`
  display: flex;
  justify-content: ${e=>e.type==="square"?"flex-end":"center"};
  align-items: flex-end;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`,Mr=Mt.default.div`
  display: flex;
  justify-content: ${e=>e.type==="square"?"flex-end":"center"};
  align-items: flex-end;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
`;var Ur=m(require("react")),Ol=({style:e,className:t})=>Ur.default.createElement("svg",{style:e,className:t,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor"},Ur.default.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"}));var Ll=({flowId:e,title:t,subtitle:o,onDismiss:i,customVariables:r,onButtonClick:n,appearance:s,type:p="full-width",icon:d})=>{let{getFlow:a,markFlowCompleted:y,isLoading:c,targetingLogicShouldHideFlow:x,updateCustomVariables:b,getFlowMetadata:F,getFlowStatus:P,getFlowSteps:f,getCurrentStepIndex:B}=R(),{primaryCTAClickSideEffects:h}=ge(),{mergeAppearanceWithDefault:k}=le();if(s=k(s),(0,be.useEffect)(()=>{b(r)},[r,c]),c)return null;let L=a(e);if(!L||x(L)||P(e)===ie)return null;let C=f(e),u=C.length>0?C[B(e)]:F(e);return u!=null&&u.title&&(t=u.title),u!=null&&u.subtitle&&(o=u.subtitle),be.default.createElement(be.default.Fragment,null,be.default.createElement(me,{appearance:s}),be.default.createElement(El,{type:p,appearance:s,className:l("bannerContainer",s)},p!="square"&&be.default.createElement(Al,{className:l("bannerIconContainer",s)},d||be.default.createElement(Ol,null)),p==="square"&&u.dismissible&&be.default.createElement(Mr,{type:p,className:l("bannerDismissButtonContainer",s)},be.default.createElement($r,{type:p,onClick:async()=>{await y(e),i&&i()},className:l("bannerDismissButton",s)},be.default.createElement($e,null))),be.default.createElement(Il,{type:p},be.default.createElement(Ae,{appearance:s,title:t,subtitle:o,classPrefix:"banner"})),be.default.createElement(Nl,{type:p,className:l("bannerCallToActionContainer",s)},be.default.createElement(ce,{title:(u==null?void 0:u.primaryButtonTitle)??"Get started",appearance:s,onClick:()=>{h(u),n&&n(u,0,"primary")},classPrefix:"banner"})),p!=="square"&&u.dismissible&&be.default.createElement(Mr,{type:p,className:l("bannerDismissButtonContainer",s)},be.default.createElement($r,{type:p,onClick:async()=>{await y(e),i&&i()},className:l("bannerDismissButton",s)},be.default.createElement($e,null)))))};var G=m(require("react"));var _l=require("react-portal");var lt=m(require("styled-components"));var Dl=lt.default.div`
  ${e=>v(e)} {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    padding: 28px 18px;
    box-sizing: border-box;
    align-items: unset;
    background-color: ${e=>e.appearance.theme.colorBackground};
    border-width: 1px;
    border-color: ${e=>e.appearance.theme.colorBorder};
    border-radius: ${e=>e.appearance.theme.borderRadius}px;
    position: ${e=>e.type=="modal"?"fixed":"relative"};
    left: 50%;
    transform: translate(-50%);
    bottom: 24px;
    z-index: 1000;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 550px;
  }
`,$l=lt.default.button`
  border: 1px solid ${e=>e.appearance.theme.colorBorder};
  border-radius: 8px;
  // If selected make border color primary and text color color priamry
  border-color: ${e=>e.selected?e.appearance.theme.colorPrimary:e.appearance.theme.colorBorder};
  color: ${e=>e.selected?e.appearance.theme.colorPrimary:e.appearance.theme.colorText};
  :hover {
    border-color: ${e=>e.appearance.theme.colorPrimary};
  }
  :focus {
    border-color: ${e=>e.appearance.theme.colorPrimary};
    color: ${e=>e.appearance.theme.colorPrimary};
  }
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
`,zr=lt.default.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
`,Ml=lt.default.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`,_r=lt.default.div`
  font-size: 12px;
  line-height: 16px;
  color: ${e=>e.appearance.theme.colorTextDisabled};
`,Wr=lt.default.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`,HC=lt.default.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
`,Ul=lt.default.textarea`
  ${e=>v(e)} {
    margin-top: 16px;
    border: 1px solid ${e=>e.appearance.theme.colorBorder};
    border-radius: ${e=>e.appearance.theme.borderRadius}px;
    padding: 12px 16px;
    font-size: 16px;
    line-height: 24px;
    width: 100%;
    height: 100px;
  }
`,zl=lt.default.div`
  ${e=>v(e)} {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`;var Wl=({flowId:e,onDismiss:t,customVariables:o,onButtonClick:i,appearance:r,className:n,style:s,type:p="modal"})=>{let{getFlow:d,markFlowCompleted:a,markStepCompleted:y,getNumberOfStepsCompleted:c,isLoading:x,targetingLogicShouldHideFlow:b,updateCustomVariables:F,getFlowSteps:P,getFlowStatus:f,getCurrentStepIndex:B}=R(),{primaryCTAClickSideEffects:h}=ge(),{mergeAppearanceWithDefault:k}=le(),[L,C]=G.default.useState(null),[u,T]=G.default.useState(""),{hasOpenModals:S,setKeepCompletedFlowOpenDuringSession:A,shouldKeepCompletedFlowOpenDuringSession:D}=Ne();if(r=k(r),(0,G.useEffect)(()=>{F(o)},[o,x]),x)return null;let O=d(e);if(!O||b(O)||f(e)===ie||c(e)===1&&!D(e)||S())return null;let $=P(e)[B(e)];function j(){return G.default.createElement(G.default.Fragment,null,G.default.createElement(Wr,null,G.default.createElement(Ae,{size:"large",appearance:r,title:$.title,subtitle:$.subtitle})),G.default.createElement(zr,{className:l("npsNumberButtonContainer",r),appearance:r},Array.from(Array(10).keys()).map(ne=>G.default.createElement($l,{className:l("npsNumberButton",r),selected:L===ne+1,key:ne,onClick:async()=>{A(e),C(ne+1),await y(e,$.id,{score:ne+1})},appearance:r},ne+1))),G.default.createElement(Ml,{appearance:r},G.default.createElement(_r,{appearance:r},"Not likely at all"),G.default.createElement(_r,{appearance:r},"Extremely likely")))}function H(){return G.default.createElement(G.default.Fragment,null,G.default.createElement(Wr,null,G.default.createElement(Ae,{appearance:r,title:"Why did you choose this score?",size:"large"})),G.default.createElement(Ul,{appearance:r,value:u,onChange:ne=>{T(ne.target.value)},placeHolder:"Add your optional fedback here..."}),G.default.createElement(zr,{appearance:r,className:l("npsNumberButtonContainer",r)},G.default.createElement(ce,{size:"large",withMargin:!1,onClick:async()=>{await a(e),i&&i($,1,"primary")},appearance:r,title:$.secondaryButtonTitle||"Skip",secondary:!0}),G.default.createElement(ce,{size:"large",withMargin:!1,onClick:async()=>{await y(e,$.id,{feedbackText:u}),await a(e),i&&i($,1,"primary")},appearance:r,title:$.primaryButtonTitle||"Submit"})))}function ae(){return G.default.createElement(G.default.Fragment,null,G.default.createElement(me,{appearance:r}),G.default.createElement(Dl,{appearance:r,className:Ee(l("npsSurveyContainer",r),n),style:s,type:p},G.default.createElement(zl,{onClick:async()=>{await a(e),t&&t()},className:l("npsSurveyDismissButton",r)},G.default.createElement($e,null)),c(e)==0&&j(),c(e)==1&&H()))}return p==="inline"?ae():G.default.createElement(_l.Portal,null,ae())};var cr=m(require("react"));var Hr=m(require("react"));var Hl=({as:e="span",children:t,variant:o="Body1",...i})=>Hr.default.createElement(pn,{color:"neutral.foreground",fontFamily:"default",forwardedAs:e,variant:o,...i},t),Jp=Object.fromEntries(Object.keys(Ro).map(e=>{let t=["H1","H2","H3","H4"].includes(e)?e.toLowerCase():void 0,o=i=>Hr.default.createElement(Hl,{as:t,...i,variant:e},i.children);return o.displayName=`Text.${e}`,[e,o]})),dr=Object.assign(Hl,Jp);var Vl=({as:e="button",className:t,size:o="md",title:i,variant:r="Primary",...n})=>{var s;return cr.createElement(ln,{className:`fr-button-${r.toLowerCase()}${t?` ${t}`:""}`,forwardedAs:e,variant:r,size:o,borderRadius:"md",...n},cr.createElement(dr,{color:(s=To[r])==null?void 0:s.color,fontWeight:"semibold"},i))},Qp=Object.fromEntries(Object.keys(To).map(e=>{let t=o=>cr.createElement(Vl,{...o,variant:e});return t.displayName=`Button.${e}`,[e,t]})),jl=Object.assign(Vl,Qp);var Gl=require("styled-components");0&&(module.exports={Box,Button,CheckBox,FormLabel,FormTextField,FrigadeBanner,FrigadeChecklist,FrigadeDefaultAppearance,FrigadeEmbeddedTip,FrigadeForm,FrigadeGuide,FrigadeHeroChecklist,FrigadeNPSSurvey,FrigadeProgressBadge,FrigadeProvider,FrigadeSupportWidget,FrigadeTour,ProgressRing,Text,tokens,useFlowOpens,useFlowResponses,useFlows,useOrganization,useTheme,useUser});
//# sourceMappingURL=index.js.map