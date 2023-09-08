"use client";
import Ct,{createContext as Bp,useEffect as Bo,useState as Ae}from"react";import{ThemeProvider as Ep}from"styled-components";import ht,{useContext as rp,useEffect as Po,useState as ar}from"react";import{useCallback as ft,useContext as kl,useEffect as Pl}from"react";import Ho,{useMemo as Er}from"react";var Br="1.32.18";var Be="NOT_STARTED_STEP",Q="COMPLETED_FLOW",po="ABORTED_FLOW",ut="STARTED_FLOW",Ne="NOT_STARTED_FLOW",Oe="COMPLETED_STEP",co="STARTED_STEP";function Ue(){let{publicApiKey:e,userId:t,apiUrl:o}=Ho.useContext(j);return{config:Er(()=>({headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json","X-Frigade-SDK-Version":Br,"X-Frigade-SDK-Platform":"React"}}),[e,t]),apiUrl:Er(()=>`${o}/v1/public/`,[o])}}var ul="frigade-last-call-at-",fl="frigade-last-call-data-";function kt(){let{shouldGracefullyDegrade:e,readonly:t}=Ho.useContext(j);return async(o,i)=>{if(t&&(i.method==="POST"||i.method==="PUT"||i.method==="DELETE"))return Ft();if(e)return console.log(`Skipping ${o} call to Frigade due to error`),Ft();let r=ul+o,n=fl+o;if(window&&window.localStorage&&i&&i.body&&i.method==="POST"){let p=window.localStorage.getItem(r),d=window.localStorage.getItem(n);if(p&&d&&d==i.body){let a=new Date(p);if(new Date().getTime()-a.getTime()<1e3)return Ft()}window.localStorage.setItem(r,new Date().toISOString()),window.localStorage.setItem(n,i.body)}let s;try{s=await fetch(o,i)}catch(p){return Ft(p)}return s?s.ok?s:Ft(s.statusText):Ft()}}function Ft(e){return e&&console.log("Call to Frigade failed",e),{json:()=>({})}}function Pt(){let{publicApiKey:e,shouldGracefullyDegrade:t}=Ho.useContext(j);function o(){return t?(console.error("Frigade hooks cannot be used when Frigade SDK has failed to initialize"),!1):e?!0:(console.error("Frigade hooks cannot be used outside the scope of FrigadeProvider"),!1)}return{verifySDKInitiated:o}}import{useContext as wl,useState as Ar}from"react";import{useContext as xl,useEffect as hl,useState as Cl}from"react";import yl from"swr";import{useContext as gl}from"react";function Fe(){let{openFlowStates:e,setOpenFlowStates:t,hasActiveFullPageFlow:o,setCompletedFlowsToKeepOpenDuringSession:i,completedFlowsToKeepOpenDuringSession:r}=gl(j);function n(c,g=!1){return e[c]??g}function s(c,g){t(S=>({...S,[c]:g}))}function p(c){t(g=>{let{[c]:S,...T}=g;return{...T}})}function d(c){r.includes(c)||i(g=>[...g,c])}function a(c){return r.includes(c)}function C(c){return Object.entries(e).some(([g,S])=>S&&g!=c)||o}return{getOpenFlowState:n,setOpenFlowState:s,resetOpenFlowState:p,hasOpenModals:C,setKeepCompletedFlowOpenDuringSession:d,shouldKeepCompletedFlowOpenDuringSession:a}}import Sl from"swr/immutable";var bl="unknown";function Ee(){let{config:e,apiUrl:t}=Ue(),{publicApiKey:o,userId:i,organizationId:r,flows:n,setShouldGracefullyDegrade:s,readonly:p}=xl(j),{resetOpenFlowState:d}=Fe(),[a,C]=Cl(!1),c={data:n.map(y=>({flowId:y.id,flowState:Q,lastStepId:null,userId:i,foreignUserId:i,stepStates:{},shouldTrigger:!1}))},g=y=>fetch(y,e).then(E=>{if(E.ok)return E.json();throw new Error("Failed to fetch user flow states")}).catch(E=>(console.log(`Error fetching ${y}: ${E}. Will gracefully degrade and hide Frigade`),s(!0),c)),S=o&&n&&i?`${t}userFlowStates?foreignUserId=${encodeURIComponent(i)}${r?`&foreignUserGroupId=${encodeURIComponent(r)}`:""}`:null,{data:T,isLoading:k,mutate:u,error:v}=p?Sl(S,g):yl(S,g,{revalidateOnFocus:!0,revalidateIfStale:!0,keepPreviousData:!0,revalidateOnMount:!0,errorRetryInterval:1e4,errorRetryCount:3,onError:()=>c,onLoadingSlow:()=>c}),x=T==null?void 0:T.data;hl(()=>{!a&&!k&&x&&C(!0)},[x,a,k]);async function F(y){if(x&&!p){let E=x.find(O=>O.flowId===y);E&&E.flowState!==Q&&(E.flowState=Q),await u(Promise.resolve({...T,data:x}),{optimisticData:{...T,data:x},revalidate:!1,rollbackOnError:!1})}}async function N(y,E,O){if(x){let I=x.find($=>$.flowId===y);I&&(I.stepStates[E]=O,I.flowState=ut),await u(Promise.resolve({...T,data:x}),{optimisticData:{...T,data:x},revalidate:!1,rollbackOnError:!1})}}async function h(y,E,O){if(x){let I=x.find($=>$.flowId===y);I&&(I.lastStepId=E,I.stepStates[E]=O,I.flowState=ut),await u({...T,data:x},{optimisticData:{...T,data:x},revalidate:!1,rollbackOnError:!1})}}async function m(y){if(x){let E=x.find(O=>O.flowId===y);E&&E.flowState!==Ne&&(E.flowState=Ne,E.lastStepId=bl,Object.keys(E.stepStates).forEach(O=>{E.stepStates[O].actionType=Be,E.stepStates[O].createdAt=new Date().toISOString()}),await u({...T,data:x},{optimisticData:{...T,data:x},revalidate:!1,rollbackOnError:!1}),d(y))}}async function w(y,E){if(x){let O=x.find(I=>I.flowId===y);O&&O.stepStates[E]!==Be&&(O.stepStates[E]=Be),await u({...T,data:x},{optimisticData:{...T,data:x},revalidate:!1,rollbackOnError:!1})}}return{userFlowStatesData:x,isLoadingUserFlowStateData:!a,mutateUserFlowState:u,optimisticallyMarkFlowCompleted:F,optimisticallyMarkFlowNotStarted:m,optimisticallyMarkStepCompleted:N,optimisticallyMarkStepNotStarted:w,optimisticallyMarkStepStarted:h,error:v}}function Vt(){let{config:e,apiUrl:t}=Ue(),{userFlowStatesData:o,mutateUserFlowState:i}=Ee(),{failedFlowResponses:r,setFailedFlowResponses:n,flowResponses:s,setFlowResponses:p}=wl(j),[d,a]=Ar(new Set),[C,c]=Ar(new Set),g=kt();function S(u){let v=JSON.stringify(u);if(d.has(v))return null;d.add(v),a(d),C.add(u),c(C);let x=s==null?void 0:s.find(F=>F.flowSlug===u.flowSlug&&F.stepId===u.stepId&&F.actionType===u.actionType&&F.createdAt===u.createdAt);return g(`${t}flowResponses`,{...e,method:"POST",body:v}).then(F=>{F.status!==200&&F.status!==201?(console.log("Failed to send flow response for step "+u.stepId+". Will retry again later."),n([...r,u])):x||p(N=>[...N??[],u])})}async function T(u){u.foreignUserId&&(u.actionType===ut||u.actionType===Ne?await S(u):u.actionType===Q?await S(u):u.actionType===co?await S(u):u.actionType===Oe?await S(u):u.actionType===po?await S(u):u.actionType===Be&&await S(u))}function k(){let u=[];return o==null||o.forEach(v=>{if(v&&v.stepStates&&Object.keys(v.stepStates).length!==0)for(let x in v.stepStates){let F=v.stepStates[x];u.push({foreignUserId:v.foreignUserId,flowSlug:v.flowId,stepId:F.stepId,actionType:F.actionType,data:{},createdAt:new Date(F.createdAt),blocked:F.blocked,hidden:F.hidden})}}),[...u,...s]}return{addResponse:T,setFlowResponses:p,getFlowResponses:k}}import vl from"swr";var Tl=/user.flow\(([^\)]+)\) == '?COMPLETED_FLOW'?/gm,Ir=e=>{let t=Tl.exec(e);if(t===null)return null;let o=null;return t.forEach((i,r)=>{let n=Fl(i,"'","");n.startsWith("flow_")&&(o=n)}),o},Fl=function(e,t,o){return e.replace(new RegExp(t,"g"),o)};function Z(){let{config:e,apiUrl:t}=Ue(),{flows:o,setFlows:i,userId:r,publicApiKey:n,customVariables:s,setCustomVariables:p,hasActiveFullPageFlow:d,setHasActiveFullPageFlow:a,setFlowResponses:C,setShouldGracefullyDegrade:c,readonly:g}=kl(j),S={data:[]},{verifySDKInitiated:T}=Pt(),{addResponse:k,getFlowResponses:u}=Vt(),v=f=>fetch(f,e).then(b=>b.ok?b.json():(console.log(`Error fetching ${f} (${b.status}): ${b.statusText}. .Will gracefully degrade and hide Frigade`),c(!0),S)).catch(b=>(console.log(`Error fetching ${f}: ${b}. Will gracefully degrade and hide Frigade`),c(!0),S)),{userFlowStatesData:x,isLoadingUserFlowStateData:F,optimisticallyMarkFlowCompleted:N,optimisticallyMarkFlowNotStarted:h,optimisticallyMarkStepCompleted:m,optimisticallyMarkStepNotStarted:w,optimisticallyMarkStepStarted:y}=Ee(),{data:E,error:O,isLoading:I}=vl(n?`${t}flows${g?"?readonly=true":""}`:null,v,{keepPreviousData:!0});Pl(()=>{if(O){console.error(O);return}E&&E.data&&i(E.data)},[E,O]);function $(f){if(I)return null;let b=o.find(B=>B.slug===f);return!b&&o.length>0&&!F&&!I?(console.log(`Flow with slug ${f} not found`),null):(b==null?void 0:b.active)===!1?null:b}function L(f){var A;if(!$(f))return[];let b=$(f).data;return b?(b=H(b),(((A=JSON.parse(b))==null?void 0:A.data)??[]).map(J=>{let mt=Ve(J);return{handleSecondaryButtonClick:()=>{J.skippable===!0&&le(f,J.id,{skipped:!0})},...J,complete:ce(f,J.id)===Oe||mt>=1,blocked:z(f,J.id),hidden:D(f,J.id),handlePrimaryButtonClick:()=>{(!J.completionCriteria&&(J.autoMarkCompleted||J.autoMarkCompleted===void 0)||J.completionCriteria&&J.autoMarkCompleted===!0)&&le(f,J.id)},progress:mt}}).filter(J=>J.hidden!==!0)):[]}function H(f){return f.replaceAll(/\${(.*?)}/g,(b,B)=>s[B]===void 0?"":String(s[B]).replace(/[\u00A0-\u9999<>\&]/g,function(A){return"&#"+A.charCodeAt(0)+";"}).replaceAll(/[\\]/g,"\\\\").replaceAll(/[\"]/g,'\\"').replaceAll(/[\/]/g,"\\/").replaceAll(/[\b]/g,"\\b").replaceAll(/[\f]/g,"\\f").replaceAll(/[\n]/g,"\\n").replaceAll(/[\r]/g,"\\r").replaceAll(/[\t]/g,"\\t"))}function _(f){if(!$(f))return[];let b=$(f).data;return b?(b=H(b),JSON.parse(b)??{}):[]}function oe(f,b){p(B=>({...B,[f]:b}))}function R(f){!F&&!I&&f&&JSON.stringify(s)!=JSON.stringify({...s,...f})&&Object.keys(f).forEach(b=>{oe(b,f[b])})}let K=ft(async(f,b,B)=>{if(!T())return;let A={foreignUserId:r,flowSlug:f,stepId:b,actionType:co,data:B??{},createdAt:new Date,blocked:!1,hidden:!1};q(A)&&(await y(f,b,A),k(A))},[r,x]),ee=ft(async(f,b,B)=>{if(!T())return;let A={foreignUserId:r,flowSlug:f,stepId:b,actionType:Be,data:B??{},createdAt:new Date,blocked:!1,hidden:!1};q(A)&&(await w(f,b),k(A))},[r,x]),le=ft(async(f,b,B)=>{if(!T())return;let A={foreignUserId:r,flowSlug:f,stepId:b,actionType:Oe,data:B??{},createdAt:new Date,blocked:!1,hidden:!1};q(A)&&(await m(f,b,A),k(A))},[r,x]),X=ft(async(f,b)=>{if(!T()||$e(f)===Ne)return;let B={foreignUserId:r,flowSlug:f,stepId:"unknown",actionType:Ne,data:b??{},createdAt:new Date,blocked:!1,hidden:!1};await h(f),q(B)&&k(B)},[r,x]),G=ft(async(f,b)=>{if(!T())return;let B={foreignUserId:r,flowSlug:f,stepId:"unknown",actionType:ut,data:b??{},createdAt:new Date,blocked:!1,hidden:!1};q(B)&&k(B)},[r,x]),xe=ft(async(f,b)=>{if(!T())return;let B={foreignUserId:r,flowSlug:f,stepId:"unknown",actionType:Q,data:b??{},createdAt:new Date,blocked:!1,hidden:!1};q(B)&&(await N(f),k(B))},[r,x]),Te=ft(async(f,b)=>{if(!T())return;let B={foreignUserId:r,flowSlug:f,stepId:"unknown",actionType:po,data:b??{},createdAt:new Date,blocked:!1,hidden:!1};q(B)&&(await N(f),k(B))},[r,x]);function q(f){var b;if(!x&&f.actionType===Be)return!1;if(x){let B=x.find(A=>A.flowId===f.flowSlug);if(f.actionType===Be&&(!(B!=null&&B.stepStates[f.stepId])||B.stepStates[f.stepId].actionType===Be)||B&&((b=B.stepStates[f.stepId])==null?void 0:b.actionType)===f.actionType||B&&B.flowState===Q&&f.actionType===Q)return!1}return!0}function ce(f,b){let B=re(f,b);return F?null:B?B.actionType:Be}function z(f,b){let B=re(f,b);return B?B.blocked:!1}function D(f,b){let B=re(f,b);return B?B.hidden:!1}function re(f,b){if(F)return null;let B=x==null?void 0:x.find(A=>A.flowId===f);return!B||!B.stepStates[b]?null:B.stepStates[b]??null}function V(f){var B;if(F||!x)return null;if($e(f)===Ne)return L(f)[0]??null;let b=(B=x.find(A=>A.flowId===f))==null?void 0:B.lastStepId;return b?L(f).find(A=>A.id===b):null}function ie(f){let b=V(f);if(!b)return 0;let B=L(f).findIndex(A=>A.id===b.id)??0;return ce(f,b.id)===Oe&&B<L(f).length-1?B+1:B}function Ve(f){if(!f.completionCriteria)return;let b=Ir(f.completionCriteria);if(b===null)return;let B=ct(b),A=W(b);return A===0?void 0:B/A}function $e(f){let b=x==null?void 0:x.find(B=>B.flowId===f);return b?b.flowState:null}function ct(f){let b=L(f);return b.length===0?0:b.filter(A=>ce(f,A.id)===Oe).length}function W(f){return L(f).length}function ve(f){let b=o.find(B=>B.slug===f);return b?JSON.parse(b.data):null}function Me(f){if(g)return!1;if(F)return!0;if(f!=null&&f.targetingLogic&&x){let b=x.find(B=>B.flowId===f.slug);if(b)return b.shouldTrigger===!1}return!!(f!=null&&f.targetingLogic&&r&&r.startsWith("guest_"))}function Wo(f){return!Me($(f))}return{getFlow:$,getFlowData:ve,isLoading:F||I,getStepStatus:ce,getFlowSteps:L,getCurrentStepIndex:ie,markStepStarted:K,markStepCompleted:le,markFlowNotStarted:X,markFlowStarted:G,markFlowCompleted:xe,markFlowAborted:Te,markStepNotStarted:ee,getFlowStatus:$e,getNumberOfStepsCompleted:ct,getNumberOfSteps:W,targetingLogicShouldHideFlow:Me,setCustomVariable:oe,updateCustomVariables:R,customVariables:s,getStepOptionalProgress:Ve,getFlowMetadata:_,isStepBlocked:z,isStepHidden:D,hasActiveFullPageFlow:d,setHasActiveFullPageFlow:a,isFlowAvailableToUser:Wo}}import{useCallback as Nr,useContext as Bl,useEffect as El}from"react";var vt="guest_";function jt(){let{userId:e,organizationId:t,setUserId:o,setUserProperties:i,shouldGracefullyDegrade:r}=Bl(j),{config:n,apiUrl:s}=Ue(),{mutateUserFlowState:p}=Ee(),d=kt(),{verifySDKInitiated:a}=Pt();El(()=>{if(e&&!t){if(e.startsWith(vt))return;let g=`frigade-user-registered-${e}`;localStorage.getItem(g)||(d(`${s}users`,{...n,method:"POST",body:JSON.stringify({foreignId:e})}),localStorage.setItem(g,"true"))}},[e,r,t]);let C=Nr(async g=>{if(!a())return;let S={foreignId:e,properties:g};await d(`${s}users`,{...n,method:"POST",body:JSON.stringify(S)}),i(T=>({...T,...g})),p()},[e,n,r,p]),c=Nr(async(g,S)=>{if(!a())return;let k={foreignId:e,events:[{event:g,properties:S}]};await d(`${s}users`,{...n,method:"POST",body:JSON.stringify(k)}),p()},[e,n,p]);return{userId:e,setUserId:o,addPropertiesToUser:C,trackEventForUser:c}}import{v4 as ip}from"uuid";import _e,{useEffect as Ra,useState as ep}from"react";import Le,{useEffect as $l}from"react";import fo from"styled-components";import Al from"react";import Il from"styled-components";var Or="fr-",Gt="cfr-";function l(e,t){let o=`${Or}${e}`;if(!t)return o;if(t.styleOverrides&&t.styleOverrides[e]){if(typeof t.styleOverrides[e]=="string")return o+" "+t.styleOverrides[e];if(typeof t.styleOverrides[e]=="object")return o+" "+Gt+e}return o}function P(e){if(!e.className||e.className.indexOf(Gt)!==-1)return"";let o=e.className.replace(/\s+/g," ").split(" ");return o.length==1&&o[0].startsWith(Or)?"":`:not(${o.map(i=>`.${i}`).join(", ")})`}function Vo(e){return e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g,"$1-$2").toLowerCase()}function je(e){return e!=null&&e.styleOverrides?Object.keys(e.styleOverrides).map(t=>`${Vo(t)}: ${e.styleOverrides[t]};`).join(" "):""}function Ce(...e){return e.filter(Boolean).join(" ")}function qt(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Nl=Il.div`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  ${e=>P(e)} {
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
`,Lr=({onClose:e,appearance:t})=>Al.createElement(Nl,{className:l("modalBackground",t),onClick:()=>e()});import jo from"react";import Ol from"styled-components";var Ll=Ol.div`
  :hover {
    opacity: 0.8;
  }
`,ke=()=>jo.createElement(Ll,null,jo.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",fill:"none",viewBox:"0 0 20 20"},jo.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.5",d:"M5 15L15 5M5 5l10 10"})));import{Portal as Ml}from"react-portal";import qr from"react";import Go from"react";function Dl({style:e,className:t}){return Go.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"54",height:"14",fill:"none",viewBox:"0 0 54 14",style:e,className:t},Go.createElement("path",{fill:"currentColor",d:"M16.293 3.476v1.036h1.593v1.256h-1.593v5.098h-1.41V5.768H14V4.512h.883V3.244c0-.67.294-1.744 1.777-1.744.515 0 .969.049 1.361.146l-.233 1.232a5.939 5.939 0 00-.833-.073c-.442 0-.662.22-.662.67zm6.534.975V5.83c-.846 0-1.63.159-2.342.476v4.56h-1.41V4.513h1.263l.086.61c.846-.451 1.655-.67 2.403-.67zm2.505-.951c-.331.33-.944.33-1.287 0a.93.93 0 01-.246-.659c0-.268.086-.487.246-.646.343-.33.956-.33 1.287 0 .343.33.343.964 0 1.305zm.061 7.366h-1.41V4.512h1.41v6.354zm6.928-5.756c.246.146.368.402.368.756v4.976c0 1.804-.858 2.658-2.672 2.658-.92 0-1.753-.146-2.514-.439l.417-1.073c.674.22 1.336.33 1.974.33.98 0 1.385-.379 1.385-1.403v-.171c-.588.134-1.09.207-1.52.207-.907 0-1.655-.305-2.231-.902-.576-.598-.87-1.39-.87-2.354 0-.963.294-1.756.87-2.354.576-.61 1.324-.914 2.231-.914 1.005 0 1.864.232 2.562.683zm-2.488 4.634a5.15 5.15 0 001.446-.22V5.951a3.695 3.695 0 00-1.446-.292c-1.08 0-1.778.841-1.778 2.048 0 1.22.699 2.037 1.778 2.037zm7.34-5.317c1.52 0 2.28.878 2.28 2.634v3.805h-1.275l-.073-.524c-.601.414-1.288.621-2.084.621-1.263 0-2.06-.658-2.06-1.731 0-1.269 1.25-2.025 3.408-2.025.135 0 .503.013.662.013v-.171c0-1.012-.343-1.451-1.115-1.451-.675 0-1.435.158-2.256.475l-.466-1.012c1.017-.427 2.01-.634 2.979-.634zm-1.839 4.756c0 .427.343.695 1.017.695.528 0 1.251-.22 1.68-.512V8.22h-.441c-1.508 0-2.256.317-2.256.963zm9.953-4.549v-2.83h1.41v7.72c0 .354-.123.598-.368.757-.71.45-1.57.67-2.562.67-.907 0-1.655-.305-2.231-.902-.577-.61-.87-1.39-.87-2.354 0-.963.293-1.756.87-2.354.576-.61 1.324-.914 2.23-.914.43 0 .933.073 1.521.207zM43.84 9.72c.503 0 .981-.098 1.447-.293V5.854a5.15 5.15 0 00-1.447-.22c-1.078 0-1.777.817-1.777 2.037s.699 2.049 1.777 2.049zM54 7.866v.439h-4.573c.184.963.858 1.512 1.827 1.512.613 0 1.275-.146 1.986-.451l.466 1.024c-.87.378-1.729.573-2.575.573-.931 0-1.692-.304-2.268-.902-.576-.61-.87-1.402-.87-2.366 0-.975.294-1.768.87-2.366.576-.597 1.324-.902 2.244-.902.968 0 1.691.33 2.17.975.478.647.723 1.464.723 2.464zm-4.61-.586h3.298c-.086-1.073-.613-1.731-1.581-1.731-.969 0-1.582.695-1.717 1.731z"}),Go.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M1.196 1.229A4.009 4.009 0 014.08 0l4.092.027C9.183.027 10 .867 10 1.904c0 .6-.273 1.133-.7 1.478-.31.25-.7.399-1.126.4h-.001l-4.09-.027h-.002a4.804 4.804 0 00-2.614.77A4.986 4.986 0 000 5.974v-1.78C0 3.036.456 1.988 1.196 1.23zm4.525 4.65a4.282 4.282 0 00-1.184 2.513l3.637.023c.131 0 .259-.015.382-.042h.002c.81-.178 1.42-.908 1.44-1.788v-.046a1.9 1.9 0 00-.533-1.328 1.813 1.813 0 00-.908-.508h-.002l-.002-.001a1.68 1.68 0 00-.366-.042A4.084 4.084 0 005.72 5.88zm-4.525-.016A4.235 4.235 0 000 8.829C0 10.997 1.601 12.78 3.654 13V9.265h-.005l.005-.439v-.437h.023a5.175 5.175 0 011.439-3.13 5.05 5.05 0 01.72-.614l-1.754-.011H4.08c-.787 0-1.521.229-2.144.625a4.11 4.11 0 00-.74.603z",clipRule:"evenodd"}))}var Dr=Dl;import qo from"styled-components";import Re from"styled-components";var mo=Re.div`
  ${e=>P(e)} {
    background: ${e=>e.appearance.theme.colorBackground};
  }

  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: ${e=>e.appearance.theme.borderRadius}px;
  max-width: ${e=>e.maxWidth}px;
  min-width: 300px;
  padding: 22px 22px 12px;
  z-index: ${e=>e.zIndex};
`,$r=Re.div`
  display: block;
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
`,Mr=Re.img`
  ${e=>P(e)} {
    display: block;
    width: 100%;
    height: auto;
    min-height: 200px;
    margin-top: ${e=>e.dismissible?"24px":"0px"};
    margin-bottom: 16px;
  }
`,Ur=Re.div`
  ${e=>P(e)} {
    display: block;
    width: 100%;
    height: auto;
    margin-top: ${e=>e.dismissible?"24px":"0px"};
    margin-bottom: 16px;
  }
`,zr=Re.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`,_r=Re.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`,Wr=Re.div`
  display: flex;
  flex: 2;
  flex-shrink: 1;
  gap: 8px;
  height: 64px;
  ${e=>P(e)} {
    flex-direction: row;
    justify-content: ${e=>e.showStepCount?"flex-end":"flex-start"};
    align-content: center;
    align-items: center;
  }
`,Hr=Re.p`
  ${e=>P(e)} {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
    color: #808080;
  }
  margin: 0;
`;var Vr=qo.div`
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
`,jr=qo(mo)`
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
`,Gr=qo.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`;function uo({appearance:e}){return qr.createElement(Gr,{className:l("poweredByFrigadeContainer",e),appearance:e},"Powered by \xA0",qr.createElement(Dr,null))}var Ul=fo.div`
  ${e=>P(e)} {
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
    ${e=>je(e)}
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
`,zl=fo.div`
  position: relative;
  flex: 0 1 auto;
`,_l=fo.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1501;
  ${e=>P(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  }
`,Wl=fo.div`
  overflow: scroll;
  flex: 1 1;
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
`,et=({onClose:e,visible:t,headerContent:o=null,style:i=null,children:r,appearance:n,dismissible:s=!0,showFrigadeBranding:p=!1})=>($l(()=>{let d=a=>{a.key==="Escape"&&e()};return document.addEventListener("keydown",d),t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset",document.removeEventListener("keydown",d)}},[e,t]),t?Le.createElement(Ml,null,Le.createElement(Lr,{appearance:n,onClose:()=>{s&&e()}}),Le.createElement(Ul,{appearance:n,className:l("modalContainer",n),styleOverrides:i},s&&Le.createElement(_l,{className:l("modalClose",n),onClick:()=>e(),appearance:n},Le.createElement(ke,null)),o&&Le.createElement(zl,null,o),Le.createElement(Wl,null,r),p&&Le.createElement(Vr,{appearance:n,className:l("poweredByFrigadeRibbon",n)},Le.createElement(uo,{appearance:n})))):Le.createElement(Le.Fragment,null));import tt,{useEffect as Hl}from"react";import go from"styled-components";import{Portal as Vl}from"react-portal";var jl=go.div`
  ${e=>P(e)} {
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
`,Gl=go.div`
  position: relative;
  flex: 1;
`,ql=go.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1501;
  ${e=>P(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  }
`,Kl=go.div`
  overflow: scroll;
  flex: 5;
  ::-webkit-scrollbar {
    display: none;
  }
`,Kr=({onClose:e,visible:t,headerContent:o=null,children:i,appearance:r})=>(Hl(()=>{let n=s=>{s.key==="Escape"&&e()};return document.addEventListener("keydown",n),t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset",document.removeEventListener("keydown",n)}},[e,t]),t?tt.createElement(Vl,null,tt.createElement(jl,{appearance:r,className:l("cornerModalContainer",r)},tt.createElement(ql,{className:l("cornerModalClose",r),onClick:()=>e()},tt.createElement(ke,null)),o&&tt.createElement(Gl,null,o),tt.createElement(Kl,null,i))):tt.createElement(tt.Fragment,null));import{useContext as Yl}from"react";function te(){let{defaultAppearance:e}=Yl(j);function t(o){let i=JSON.parse(JSON.stringify(e));return o?{styleOverrides:Object.assign(i.styleOverrides??{},o.styleOverrides??{}),theme:Object.assign(i.theme,o.theme??{})}:i}return{mergeAppearanceWithDefault:t}}import rt,{useContext as Ca,useEffect as ya,useState as tr}from"react";import So from"styled-components";import Co,{useEffect as Xl,useState as Rr}from"react";import Xo from"styled-components";import xo from"styled-components";var Yr=xo.label`
  ${e=>P(e)} {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 5px;
    margin-top: 10px;
  }
  display: flex;
`,Xr=xo.label`
  ${e=>P(e)} {
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 5px;
  }
  display: flex;
`,Jr=xo.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextError}};
  display: flex;
  margin-right: 5px;
  margin-top: 10px;
`,ho=xo.div`
  display: flex;
  align-items: flex-start;
  justify-content: left;
  margin-bottom: 10px;
`;import Ko from"react";var Ge={theme:{colorPrimary:"#000000",colorText:"#000000",colorBackground:"#ffffff",colorBackgroundSecondary:"#d2d2d2",colorTextOnPrimaryBackground:"#ffffff",colorTextSecondary:"#505050",colorTextDisabled:"#C7C7C7",colorBorder:"#E5E5E5",colorTextError:"#c00000",borderRadius:20}};function ot({title:e,required:t,appearance:o=Ge}){return e?Ko.createElement(ho,null,t?Ko.createElement(Jr,{className:l("formLabelRequired",o),appearance:o},"*"):null,Ko.createElement(Yr,{className:l("formLabel",o)},e)):null}import Qr from"react";function Bt({title:e,appearance:t}){return e?Qr.createElement(ho,null,Qr.createElement(Xr,{className:l("formSubLabel",t)},e)):null}import{z as Yo}from"zod";function Zr(e,t){try{if(t){if(t.type=="number"){let o=Yo.number();if(t.props)for(let i of t.props)i.requirement=="min"?o=o.min(Number(i.value),i.message??"Value is too small"):i.requirement=="max"?o=o.max(Number(i.value),i.message??"Value is too large"):i.requirement=="positive"?o=o.positive(i.message??"Value must be positive"):i.requirement=="negative"&&(o=o.nonpositive(i.message??"Value must be negative"));o.parse(Number(e))}if(t.type=="string"){let o=Yo.string();if(t.props)for(let i of t.props)i.requirement=="min"?o=o.min(Number(i.value),i.message??"Value is too short"):i.requirement=="max"?o=o.max(Number(i.value),i.message??"Value is too long"):i.requirement=="regex"&&(o=o.regex(new RegExp(String(i.value)),i.message??"Value does not match requirements"));o.parse(e)}return}}catch(o){if(o instanceof Yo.ZodError)return o.issues&&o.issues.length>0?o.issues[0].message:null;console.error("Frigade Form validation failed for rule ",t,o)}return null}var Jl=Xo.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,Jo=Xo.input`
  ${e=>P(e)} {
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
`,Ql=Xo.textarea`
  ${e=>P(e)} {
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
`;function Qo({formInput:e,customFormTypeProps:t,onSaveInputData:o,setFormValidationErrors:i,inputData:r}){let n=e,[s,p]=Rr((r==null?void 0:r.text)||""),[d,a]=Rr(!1),C=Jo;Xl(()=>{s===""&&!d&&(a(!0),c(""))},[]);function c(S){if(p(S),o({text:S}),n.required===!0&&S.trim()===""){i([{id:n.id,message:`${n.title??"Field"} is required`}]);return}let T=Zr(S,n.validation);if(T){i([{id:n.id,message:T}]);return}i([])}n.multiline&&(C=Ql);function g(){var S;switch((S=n==null?void 0:n.validation)==null?void 0:S.type){case"email":return"email";case"number":return"number";case"password":return"password"}return null}return Co.createElement(Jl,null,Co.createElement(ot,{title:n.title,required:n.required,appearance:t.appearance}),Co.createElement(C,{className:l("inputComponent",t.appearance),value:s,onChange:S=>{c(S.target.value)},appearance:t.appearance,placeholder:n.placeholder,type:g()}),Co.createElement(Bt,{title:n.subtitle,appearance:t.appearance}))}import ze,{useEffect as ei,useState as ti}from"react";import oi from"styled-components";var Zo="",Zl=oi.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`,Rl=oi.select`
  ${e=>P(e)} {
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
`;function ri({formInput:e,customFormTypeProps:t,onSaveInputData:o,inputData:i,setFormValidationErrors:r}){var C,c,g,S,T,k;let n=e,[s,p]=ti(((C=i==null?void 0:i.choice)==null?void 0:C[0])||""),[d,a]=ti(!1);return ei(()=>{var u,v,x,F;if(s===""&&!d){if(a(!0),n.requireSelection){p(Zo);return}if(n.defaultValue&&((u=n.props.options)!=null&&u.find(N=>N.id===n.defaultValue))){let N=(v=n.props.options)==null?void 0:v.find(h=>h.id===n.defaultValue);p(N.id),o({choice:[N.id]})}else p(((x=n.props.options)==null?void 0:x[0].id)||""),o({choice:[((F=n.props.options)==null?void 0:F[0].id)||""]})}},[]),ei(()=>{n.requireSelection&&s===Zo?r([{message:"Please select an option",id:n.id}]):r([])},[s]),ze.createElement(Zl,null,ze.createElement(ot,{title:n.title,required:!1,appearance:t.appearance}),ze.createElement(Rl,{value:s,onChange:u=>{p(u.target.value),o({choice:[u.target.value]})},placeholder:n.placeholder,appearance:t.appearance,className:l("multipleChoiceSelect",t.appearance)},n.requireSelection&&ze.createElement("option",{key:"null-value",value:Zo,disabled:!0},n.placeholder??"Select an option"),(c=n.props.options)==null?void 0:c.map(u=>ze.createElement("option",{key:u.id,value:u.id},u.title))),((S=(g=n.props.options)==null?void 0:g.find(u=>u.id===s))==null?void 0:S.isOpenEnded)&&ze.createElement(ze.Fragment,null,ze.createElement(ot,{title:((k=(T=n.props.options)==null?void 0:T.find(u=>u.id===s))==null?void 0:k.openEndedLabel)??"Please specify",required:!1,appearance:t.appearance}),ze.createElement(Jo,{type:"text",placeholder:"Enter your answer here",onChange:u=>{o({choice:[u.target.value]})},appearance:t.appearance})),ze.createElement(Bt,{title:n.subtitle,appearance:t.appearance}))}import Xt,{useEffect as Ro,useState as ni}from"react";import si from"styled-components";import Yt from"react";import Kt from"react";import{motion as ea}from"framer-motion";var ii=({color:e,percentage:t,size:o})=>{let i=o*.5-2,r=2*Math.PI*i,n=(1-t)*r,s={duration:.3,delay:0,ease:"easeIn"},p={hidden:{strokeDashoffset:r,transition:s},show:{strokeDashoffset:n,transition:s}};return Kt.createElement(ea.circle,{r:i,cx:o*.5,cy:o*.5,fill:"transparent",stroke:n!==r?e:"",strokeWidth:"3px",strokeDasharray:r,strokeDashoffset:t?n:0,variants:p,transition:s,initial:"hidden",animate:"show"})},ta=({fillColor:e,size:t,percentage:o,children:i,bgColor:r="#D9D9D9",className:n,style:s})=>Kt.createElement("svg",{style:s,className:n,width:t,height:t,overflow:"visible"},Kt.createElement("g",{transform:`rotate(-90 ${`${t*.5} ${t*.5}`})`},Kt.createElement(ii,{color:r,size:t}),Kt.createElement(ii,{color:e,percentage:o,size:t})),i),Et=ta;import oa from"styled-components";var ra=({color:e="#FFFFFF"})=>Yt.createElement("svg",{width:10,height:8,viewBox:"0 0 10 8",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Yt.createElement("path",{d:"M1 4.34815L3.4618 7L3.4459 6.98287L9 1",stroke:e,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})),ia={width:"22px",height:"22px",borderRadius:"8px",display:"flex",justifyContent:"center",alignItems:"center"},na={width:"22px",height:"22px",borderRadius:"40px",display:"flex",justifyContent:"center",alignItems:"center"},sa={border:"1px solid #000000",color:"#FFFFFF"},la={border:"1px solid #E6E6E6"},aa={color:"#FFFFFF"},pa={border:"3px solid #D9D9D9"},da=e=>e==="square"?ia:na,ca=(e,t)=>e==="square"?t?sa:la:t?aa:pa,ma=oa.div`
  ${e=>je(e)}
`,qe=({value:e,type:t="square",primaryColor:o="#000000",progress:i,appearance:r=Ge,style:n,className:s})=>{let p=da(t),d=ca(t,e);return e===!0?p={...p,...d,backgroundColor:o,borderColor:t==="square"?o:"none"}:p={...p,...d},e!==!0&&t==="round"&&i!==void 0&&i!==1?Yt.createElement(Et,{fillColor:o,percentage:i,size:22}):Yt.createElement(ma,{styleOverrides:p,style:n,role:"checkbox",className:Ce(l("checkIconContainer",r),l(e?"checkIconContainerChecked":"checkIconContainerUnchecked",r),e?"checkIconContainerChecked":"checkIconContainerUnchecked",s)},e&&Yt.createElement(ra,{color:"#FFFFFF"}))};var ua=si.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`,fa=si.button`
  ${e=>P(e)} {
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
`;function li({formInput:e,customFormTypeProps:t,onSaveInputData:o,inputData:i,setFormValidationErrors:r}){var C;let n=e,[s,p]=ni((i==null?void 0:i.choice)||[]),[d,a]=ni(!1);return Ro(()=>{s.length==0&&!d&&(a(!0),o({choice:[]}))},[]),Ro(()=>{o({choice:s})},[s]),Ro(()=>{n.required&&(s.length<n.props.minChoices||s.length>n.props.maxChoices)?r([{message:"",id:n.id}]):r([])},[s]),Xt.createElement(ua,null,Xt.createElement(ot,{title:n.title,required:n.required,appearance:t.appearance}),(C=n.props.options)==null?void 0:C.map(c=>Xt.createElement(fa,{appearance:t.appearance,className:l("multipleChoiceListItem",t.appearance),key:c.id,value:c.id,"data-selected":s.includes(c.id),onClick:()=>{if(s.includes(c.id)){p(s.filter(g=>g!==c.id));return}s.length<n.props.maxChoices?p([...s,c.id]):s.length==1&&n.props.maxChoices==1&&p([c.id])}},c.title,Xt.createElement(qe,{type:"round",primaryColor:t.appearance.theme.colorPrimary,value:s.includes(c.id),appearance:t.appearance}))),Xt.createElement(Bt,{title:n.subtitle,appearance:t.appearance}))}import yo from"react";import ai from"styled-components";import ga from"dompurify";function ue(e){return{__html:ga.sanitize(e,{ALLOWED_TAGS:["b","i","a","span","div","p","pre","u","br","img"],ALLOWED_ATTR:["style","class","target","id","href","alt","src"]})}}var xa=ai.h1`
  ${e=>P(e)} {
    font-style: normal;
    font-weight: 600;
    font-size: ${e=>e.size=="small"?"15px":"18px"};
    line-height: ${e=>e.size=="small"?"20px":"22px"};
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    color: ${e=>e.appearance.theme.colorText};
  }
`,ha=ai.h2`
  ${e=>P(e)} {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    color: ${e=>e.appearance.theme.colorTextSecondary};
  }
`;function ye({appearance:e,title:t,subtitle:o,size:i="medium",classPrefix:r=""}){return yo.createElement(yo.Fragment,null,yo.createElement(xa,{appearance:e,className:l(`${r}${r?qt(i):i}Title`,e),dangerouslySetInnerHTML:ue(t),size:i}),o&&yo.createElement(ha,{appearance:e,className:l(`${r}${r?qt(i):i}Subtitle`,e),dangerouslySetInnerHTML:ue(o),size:i}))}import*as er from"react";var pi=e=>er.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:12,height:12,"aria-hidden":"true",viewBox:"0 0 16 16",...e},er.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"m10.115 1.308 5.635 11.269A2.365 2.365 0 0 1 13.634 16H2.365A2.365 2.365 0 0 1 .25 12.577L5.884 1.308a2.365 2.365 0 0 1 4.231 0zM8 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 9c.552 0 1-.32 1-.714V4.714C9 4.32 8.552 4 8 4s-1 .32-1 .714v3.572C7 8.68 7.448 9 8 9z"}));import{AnimatePresence as Sa,motion as ba}from"framer-motion";var wa=So.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 14px;
  overflow: visible;
`,Ta=So(ba.div)`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextError}};
  font-size: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`,Fa=So.div`
  margin-right: 4px;
  display: inline-flex;
`,ka=So.div`
  padding-left: 1px;
  padding-right: 1px;
`,Pa={text:Qo,multipleChoice:ri,multipleChoiceList:li};function di({flowId:e,stepData:t,canContinue:o,setCanContinue:i,onSaveData:r,appearance:n,customFormElements:s}){var N;let p=t.props,[d,a]=tr([]),[C,c]=tr([]),{userId:g}=jt(),[S,T]=tr(x()||{}),{readonly:k}=Ca(j),u={...Pa,...s};ya(()=>{i(d.length===0)},[d,i]);function v(h,m){let w={...S,[h.id]:m};T(w),r(w),window&&window.localStorage&&!k&&window.localStorage.setItem(F(),JSON.stringify(w))}function x(){if(window&&window.localStorage){let h=window.localStorage.getItem(F());if(h)return JSON.parse(h)}return{}}function F(){return`frigade-multiInputStepTypeData-${e}-${t.id}-${g}`}return rt.createElement(ka,{className:l("multiInput",n)},rt.createElement(ye,{appearance:n,title:t.title,subtitle:t.subtitle}),rt.createElement(wa,{className:l("multiInputContainer",n)},(N=p.data)==null?void 0:N.map(h=>{var w;let m=(w=d.reverse().find(y=>y.id===h.id))==null?void 0:w.message;return u[h.type]?rt.createElement("span",{key:h.id,"data-field-id":h.id,className:l("multiInputField",n)},u[h.type]({formInput:h,customFormTypeProps:{flowId:e,stepData:t,canContinue:o,setCanContinue:i,onSaveData:r,appearance:n},onSaveInputData:y=>{!C.includes(h.id)&&y&&(y==null?void 0:y.text)!==""&&c(E=>[...E,h.id]),v(h,y)},inputData:S[h.id],setFormValidationErrors:y=>{a(E=>y.length===0?E.filter(O=>O.id!==h.id):[...E,...y])}}),rt.createElement(Sa,null,m&&C.includes(h.id)&&rt.createElement(Ta,{initial:{opacity:0,height:0,marginBottom:0},animate:{opacity:1,height:"auto",marginBottom:12},exit:{opacity:0,height:0,marginBottom:0},key:h.id,style:{overflow:"hidden"},transition:{duration:.1,ease:"easeInOut",delay:.5},appearance:n,className:l("multiInputValidationError",n)},rt.createElement(Fa,{appearance:n,className:l("multiInputValidationErrorIcon",n)},rt.createElement(pi,null)),m))):null})))}import gt from"styled-components";var ci=gt.div`
  align-items: center;
  display: flex;
  justify-content: ${e=>e.showBackButton?"space-between":"flex-end"};
  padding-top: 14px;
`,mi=gt.div`
  color: ${e=>e.appearance.theme.colorTextError};
  font-size: 12px;
`,ui=gt.div`
  display: flex;
  gap: 12px;
`,fi=gt.div`
  display: flex;
  flex-direction: row;
  flex: 1 1;
`,gi=gt.div`
  display: flex;
  // If type is set to large-modal, use padding 60px horizontal, 80px vertical
  // Otherwise, use 4px padding
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  position: relative;
`,xi=gt.div`
  padding: ${e=>e.type==="large-modal"?"50px":"0px"};
  position: relative;
  overflow-y: auto;
`,hi=gt.div`
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
`;import it from"react";import va from"react";import Ci from"styled-components";var Ba=Ci.button`
  justify-content: center;
  align-content: center;
  ${e=>P(e)} {
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
    ${e=>je(e)}
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
`,bo=Ci.div`
  ${e=>P(e)} {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 8px;

    & > * {
      margin-right: 8px;
    }
  }
`,ne=({onClick:e,title:t,style:o,disabled:i,type:r="inline",size:n="medium",secondary:s=!1,appearance:p,withMargin:d=!0,classPrefix:a=""})=>{function C(){let c=s?"buttonSecondary":"button";return a===""?c:`${a}${qt(c)}`}return va.createElement(Ba,{secondary:s,appearance:p,disabled:i,onClick:e,styleOverrides:o,type:r,withMargin:d,size:n,className:l(C(),p)},t??"Continue")};var yi=({step:e,canContinue:t,appearance:o,onPrimaryClick:i,onSecondaryClick:r,formType:n,selectedStep:s,steps:p,onBack:d,allowBackNavigation:a,errorMessage:C})=>{let c=n==="inline"?"inline":"full-width",g=p.length>1&&s!=0&&a;return it.createElement(it.Fragment,null,C&&it.createElement(mi,{appearance:o,className:l("formCTAError",o)},C),it.createElement(ci,{showBackButton:g,className:l("formCTAContainer",o)},g&&it.createElement(ne,{title:e.backButtonTitle??"\u2190",onClick:d,secondary:!0,withMargin:!1,type:c,appearance:o,style:{width:"90px",maxWidth:"90px"},classPrefix:"back"}),it.createElement(ui,{className:l("ctaWrapper",o)},e.secondaryButtonTitle?it.createElement(ne,{title:e.secondaryButtonTitle,onClick:r,secondary:!0,withMargin:!1,type:c,appearance:o}):null," ",e.primaryButtonTitle?it.createElement(ne,{disabled:!t,withMargin:!1,title:e.primaryButtonTitle,onClick:i,type:c,appearance:o}):null)))};import or from"react";import Ea from"styled-components";var Aa=Ea.div`
  text-align: center;
`,Si=({stepCount:e=0,currentStep:t=0,className:o,appearance:i})=>{let{theme:r}=te().mergeAppearanceWithDefault(i);return or.createElement(Aa,{className:o},or.createElement("svg",{width:16*e-8,height:8,viewBox:`0 0 ${16*e-8} 8`,fill:"none"},Array(e).fill(null).map((n,s)=>or.createElement("rect",{key:s,x:16*s,y:0,width:8,height:8,rx:4,fill:t===s?r.colorPrimary:"#E6E6E6"}))))};import xt from"react";import At from"styled-components";import{useContext as Ia}from"react";function pe(){let e=Ia(j);function t(r){i(r.primaryButtonUri,r.primaryButtonUriTarget)}function o(r){i(r.secondaryButtonUri,r.secondaryButtonUriTarget)}function i(r,n){if(!r)return;let s=r.startsWith("http")?"_blank":"_self";n&&n!=="_blank"&&(s="_self"),e.navigate(r,s)}return{primaryCTAClickSideEffects:t,secondaryCTAClickSideEffects:o,handleUrl:i}}var Na=At.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
`,Oa=At.div`
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
`,La=At.img`
  width: 78px;
  height: auto;
`,Da=At.button`
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
`,$a=At.h1`
  font-weight: 700;
  font-size: 28px;
  line-height: 34px;
`,Ma=At.h2`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #7e7e7e;
  margin-top: 12px;
  margin-bottom: 16px;
  max-width: 70%;
`;function bi({stepData:e,appearance:t}){var i,r;let{handleUrl:o}=pe();return xt.createElement("div",null,xt.createElement($a,null,e.title),xt.createElement(Ma,null,e.subtitle),xt.createElement(Na,null,(r=(i=e.props)==null?void 0:i.links)==null?void 0:r.map(n=>xt.createElement(Oa,{key:n.title},xt.createElement(La,{src:n.imageUri}),xt.createElement(Da,{style:{borderColor:t.theme.colorPrimary,color:t.theme.colorPrimary},onClick:()=>{n.uri&&o(n.uri,n.uriTarget??"_blank")}},n.title)))))}import It,{useEffect as ja}from"react";import Fo from"styled-components";import rr from"react";var wo=({style:e,className:t})=>rr.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:t,style:e},rr.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}),rr.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"}));import Jt,{useRef as Ua,useState as za}from"react";import To from"styled-components";var _a=To.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`,Wa=To.div`
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
`,Ha=To.video`
  width: 100%;
  height: 100%;
  border-radius: ${e=>e.appearance.theme.borderRadius}px;
`,Va=To.iframe`
  width: 100%;
  height: 100%;
  min-height: 260px;
  border-radius: ${e=>e.appearance.theme.borderRadius}px;
`;function nt({appearance:e,videoUri:t}){let o=Ua(),[i,r]=za(!1);if(t.includes("youtube")){let n=t.split("v=")[1],s=n.indexOf("&");return s!==-1&&(n=n.substring(0,s)),Jt.createElement(Va,{width:"100%",height:"100%",src:`https://www.youtube.com/embed/${n}`,frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,appearance:e})}return Jt.createElement(_a,{className:l("videoPlayerWrapper",e),appearance:e},!i&&Jt.createElement(Wa,{onClick:()=>{r(!0),o.current.play()},appearance:e},Jt.createElement(wo,null)),Jt.createElement(Ha,{appearance:e,controls:i,ref:o,play:i,src:t}))}var Ga=Fo.div`
  ${e=>P(e)} {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`,qa=Fo.img`
  ${e=>P(e)} {
    width: 100%;
    height: auto;
    max-height: 250px;
    margin-bottom: 24px;
  }
`,Ka=Fo.div`
  ${e=>P(e)} {
    margin-bottom: 24px;
  }
`,Ya=Fo.div`
  ${e=>P(e)} {
    width: 100%;
    height: auto;
    max-height: 250px;
    margin-bottom: 24px;
  }
`;function wi({stepData:e,appearance:t,setCanContinue:o}){return ja(()=>{o(!0)},[]),It.createElement(Ga,{className:l("callToActionContainer",t)},It.createElement(Ka,{className:l("callToActionTextContainer",t)},It.createElement(ye,{appearance:t,title:e.title,subtitle:e.subtitle})),e.imageUri&&It.createElement(qa,{className:l("callToActionImage",t),src:e.imageUri}),!e.imageUri&&e.videoUri&&It.createElement(Ya,{appearance:t,className:l("callToActionVideo",t)},It.createElement(nt,{appearance:t,videoUri:e.videoUri})))}import Ke,{useEffect as ir,useState as nr}from"react";import st from"styled-components";var Ti=st.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
`,Fi=st.div`
  width: 100%;
  text-align: left;
`,ki=st.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 38px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,Pi=st.h1`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  margin-top: 16px;
  margin-bottom: 16px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`,vi=st.div`
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
`,Bi=st.div`
  padding-top: 10px;
  padding-bottom: 10px;
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
`,Ei=st.img`
  width: 42px;
  height: 42px;
  margin-right: 12px;
`,Ai=st.p`
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  display: flex;
  align-self: center;
`;var Ii=({stepData:e,setCanContinue:t,onSaveData:o,appearance:i})=>{let r=e.props,[n,s]=nr([]),[p,d]=nr(!1),[a,C]=nr(e.id);return ir(()=>{n.length==0&&!p&&(d(!0),o({choice:[]}))},[p]),ir(()=>{a!==e.id&&(C(e.id),s([]))},[e]),ir(()=>{o({choice:n}),n.length>=r.minChoices?t(!0):t(!1)},[n]),Ke.createElement(Ti,{className:l("selectListContainer",i)},Ke.createElement(Fi,null,Ke.createElement(ki,{className:l("selectListTitle",i)},e.title),Ke.createElement(Pi,{appearance:i,className:l("selectListSubtitle",i)},e.subtitle)),r.options.map((c,g)=>{let S=n.includes(c.id);return Ke.createElement(vi,{key:`select-item-${g}`,onClick:()=>{if(n.includes(c.id)){s(n.filter(T=>T!==c.id));return}n.length<r.maxChoices?s([...n,c.id]):n.length==1&&r.maxChoices==1&&s([c.id])},hideBottomBorder:g===r.options.length-1,className:l("selectListSelectItem",i)},Ke.createElement(Bi,{className:l("selectListItemImage",i)},c.imageUri&&Ke.createElement(Ei,{src:c.imageUri,alt:`select-icon-${g}`}),Ke.createElement(Ai,{appearance:i,className:l("selectListSelectItemText",i)},c.title)),Ke.createElement(qe,{appearance:i,value:S,primaryColor:i.theme.colorPrimary}))}))};import Se,{useEffect as sr,useState as Qt}from"react";import{AnimatePresence as Xa,motion as Ja}from"framer-motion";var Qa=({children:e,id:t,shouldWrap:o=!1})=>Se.createElement(Se.Fragment,null,o?Se.createElement(Xa,{initial:!1},Se.createElement(Ja.div,{key:t,initial:{opacity:1,y:"100%"},animate:{opacity:1,y:0},exit:{opacity:0,y:"-100%"},transition:{duration:.5,ease:"easeInOut"},style:{width:"100%",height:"100%",position:"absolute",top:0,left:0,zIndex:1,overflowY:"auto"}},e)):e),ko=({appearance:e,steps:t,selectedStep:o,customStepTypes:i,customVariables:r,onButtonClick:n,onStepCompletion:s,flowId:p,type:d,hideOnFlowCompletion:a,onComplete:C,setVisible:c,setShowModal:g,onDismiss:S,showPagination:T=!1,customFormElements:k,allowBackNavigation:u,validationHandler:v})=>{var z;let F={...{linkCollection:bi,multiInput:di,callToAction:wi,selectList:Ii},...i},{primaryCTAClickSideEffects:N,secondaryCTAClickSideEffects:h}=pe(),[m,w]=Qt(!1),[y,E]=Qt({}),[O,I]=Qt(!1),[$,L]=Qt(!1),[H,_]=Qt(null),oe=t[o]??null,{markStepCompleted:R,markStepStarted:K,isLoading:ee,updateCustomVariables:le,markFlowCompleted:X}=Z();sr(()=>{le(r)},[r,ee]),sr(()=>{window&&u&&!$&&(window.location.hash=t[o].id,L(!0))},[u,$,L]),sr(()=>{var D;if(window&&((D=window==null?void 0:window.location)!=null&&D.hash)&&window.location.hash.replace("#","")!==t[o].id){let re=window.location.hash.replace("#",""),V=t.findIndex(ie=>ie.id===re);V!==-1&&K(p,t[V].id)}},[(z=window==null?void 0:window.location)==null?void 0:z.hash,K,o,t]);function G(){return{data:y[t[o].id]??{},stepId:t[o].id,customVariables:r}}function xe(D,re,V){let ie=o+1<t.length?t[o+1]:null;return s&&s(D,V,ie,y,G()),n?n(D,o,re,ie):!0}function Te(D,re){E(V=>{let ie={};return ie[D.id]=re,{...V,...ie}})}function q(D){return D.selectedStep.imageUri?Se.createElement(hi,{image:D.selectedStep.imageUri,appearance:e,className:l("formContainerSidebarImage",e)}):null}let ce=Se.createElement(yi,{step:t[o],canContinue:m&&!O,formType:d,selectedStep:o,appearance:e,onPrimaryClick:async()=>{if(I(!0),v){let V=await v(t[o],o,t[o+1],y,G());if(V){_(V),I(!1);return}else _(null)}let D={...G()};await R(p,t[o].id,D),o+1<t.length&&await K(p,t[o+1].id);let re=xe(t[o],"primary",o);o+1>=t.length&&(C&&C(),S&&S(),a&&re&&(c&&c(!1),g(!1)),await X(p)),N(t[o]),I(!1),window&&u&&o+1<t.length&&(window.location.hash=t[o+1].id)},onSecondaryClick:()=>{xe(t[o],"secondary",o),h(t[o])},onBack:async()=>{o-1>=0&&(I(!0),await K(p,t[o-1].id),I(!1))},steps:t,allowBackNavigation:u,errorMessage:H});return Se.createElement(Se.Fragment,null,Se.createElement(fi,{className:l("formContainer",e)},Se.createElement(gi,null,Se.createElement(Qa,{id:o,shouldWrap:d==="large-modal"},Se.createElement(xi,{key:oe.id,type:d,className:l("formContent",e)},t.map(D=>{let re=F[D.type];return oe.id!==D.id?null:Se.createElement(re,{key:D.id,stepData:D,canContinue:m,setCanContinue:w,onSaveData:V=>{Te(D,V)},appearance:e,customFormElements:k,flowId:p})}),T&&Se.createElement(Si,{className:l("formPagination",e),appearance:e,stepCount:t.length,currentStep:o}),ce))),d=="large-modal"&&Se.createElement(q,{selectedStep:t[o]})))};import Zt from"react";import{createGlobalStyle as Za}from"styled-components";function se({appearance:e}){if(!e||!e.styleOverrides)return Zt.createElement(Zt.Fragment,null);let t=Object.entries(e.styleOverrides).filter(([i,r])=>typeof r=="object");if(t.length===0)return Zt.createElement(Zt.Fragment,null);let o=Za`
${i=>i.inlineStyles.map(([r,n])=>`.${Gt}${r}.${Gt}${r} { ${Object.entries(n).map(([s,p])=>`${Vo(s)}: ${p};`).join(" ")} }`).join(" ")}`;return Zt.createElement(o,{inlineStyles:t})}var Ni=({flowId:e,customStepTypes:t={},type:o="inline",visible:i,setVisible:r,customVariables:n,customFormElements:s,onComplete:p,appearance:d,hideOnFlowCompletion:a=!0,onStepCompletion:C,onButtonClick:c,dismissible:g=!0,endFlowOnDismiss:S=!1,modalPosition:T="center",repeatable:k=!1,onDismiss:u,showPagination:v=!1,allowBackNavigation:x=!1,validationHandler:F,showFrigadeBranding:N=!1})=>{let{getFlow:h,getFlowSteps:m,isLoading:w,targetingLogicShouldHideFlow:y,getFlowStatus:E,getCurrentStepIndex:O,markFlowCompleted:I,markFlowNotStarted:$}=Z(),L=O(e),{mergeAppearanceWithDefault:H}=te(),[_,oe]=ep(!1),{setOpenFlowState:R,getOpenFlowState:K,hasOpenModals:ee}=Fe();d=H(d);let[le,X]=i!==void 0&&r!==void 0?[i,r]:[K(e,!0),q=>R(e,q)];if(Ra(()=>{!_&&!w&&(oe(!0),E(e)===Q&&k&&$(e),oe(!0))},[_,oe,w]),w)return null;let G=h(e);if(!G||y(G))return null;let xe=m(e);if(!xe||i!==void 0&&i===!1||E(e)===Q&&a||(o=="modal"||o=="corner-modal")&&ee(e))return null;let Te=()=>{X(!1),u&&u(),S===!0&&I(e)};if(T=="center"&&o==="modal"||o==="large-modal"){let q={padding:"24px"};return o==="large-modal"?(q.width="85%",q.height="90%",q.maxHeight="800px",q.minHeight="500px",q.padding="0"):q.width="400px",_e.createElement(et,{appearance:d,onClose:Te,visible:le,style:q,dismissible:g,showFrigadeBranding:N},_e.createElement(se,{appearance:d}),_e.createElement(ko,{appearance:d,steps:xe,selectedStep:L,customStepTypes:t,customVariables:n,onButtonClick:c,onStepCompletion:C,flowId:e,type:o,hideOnFlowCompletion:a,onComplete:p,setVisible:r,setShowModal:X,onDismiss:u,showPagination:v,customFormElements:s,allowBackNavigation:x,validationHandler:F}))}return o==="modal"&&T!=="center"?_e.createElement(Kr,{appearance:d,onClose:Te,visible:le},_e.createElement(se,{appearance:d}),_e.createElement(ko,{appearance:d,steps:xe,selectedStep:L,customStepTypes:t,customVariables:n,onButtonClick:c,onStepCompletion:C,flowId:e,type:o,hideOnFlowCompletion:a,onComplete:p,setVisible:r,setShowModal:X,onDismiss:u,showPagination:v,customFormElements:s,allowBackNavigation:x,validationHandler:F})):_e.createElement(_e.Fragment,null,_e.createElement(se,{appearance:d}),_e.createElement(ko,{appearance:d,steps:xe,selectedStep:L,customStepTypes:t,customVariables:n,onButtonClick:c,onStepCompletion:C,flowId:e,type:o,hideOnFlowCompletion:a,onComplete:p,setVisible:r,setShowModal:X,onDismiss:u,showPagination:v,customFormElements:s,allowBackNavigation:x,validationHandler:F}))},Oi=Ni;import{useCallback as Li,useContext as tp,useEffect as op}from"react";function lr(){let{organizationId:e,userId:t,setOrganizationId:o}=tp(j),{mutateUserFlowState:i}=Ee(),{config:r,apiUrl:n}=Ue(),s=kt(),{verifySDKInitiated:p}=Pt();op(()=>{if(t&&e){if(t.startsWith(vt))return;let C=`frigade-user-group-registered-${t}-${e}`;localStorage.getItem(C)||(s(`${n}userGroups`,{...r,method:"POST",body:JSON.stringify({foreignUserId:t,foreignUserGroupId:e})}),localStorage.setItem(C,"true"))}},[t,e]);let d=Li(async C=>{if(!p())return;if(!e||!t){console.error("Cannot add properties to organization: Organization ID and User ID must both be set.",{organizationId:e,userId:t});return}let c={foreignUserId:t,foreignUserGroupId:e,properties:C};await s(`${n}userGroups`,{...r,method:"POST",body:JSON.stringify(c)}),i()},[e,t,r,i]),a=Li(async(C,c)=>{if(!p())return;if(!e||!t){console.error("Cannot track event for organization: Organization ID and User ID must both be set.",{organizationId:e,userId:t});return}let S={foreignUserId:t,foreignUserGroupId:e,events:[{event:C,properties:c}]};await s(`${n}userGroups`,{...r,method:"POST",body:JSON.stringify(S)}),i()},[e,t,r,i]);return{organizationId:e,setOrganizationId:o,addPropertiesToOrganization:d,trackEventForOrganization:a}}var Di="frigade-xFrigade_guestUserId",Rt="frigade-xFrigade_userId",$i=({})=>{let{setFlowResponses:e}=Vt(),{userFlowStatesData:t,isLoadingUserFlowStateData:o,mutateUserFlowState:i}=Ee(),{userId:r,setUserId:n}=jt(),[s,p]=ar(null),{getFlowStatus:d}=Z(),{flows:a,userProperties:C,setIsNewGuestUser:c,flowResponses:g}=rp(j),[S,T]=ar([]),[k,u]=ar([]),{organizationId:v}=lr();Po(()=>{if(!o&&t)for(let h=0;h<t.length;h++){let m=t[h],w=a.find(y=>y.slug===(m==null?void 0:m.flowId));if(w&&m&&m.shouldTrigger===!0&&w.type=="FORM"&&w.triggerType==="AUTOMATIC"&&!k.includes(w.slug)){setTimeout(()=>{x(m.flowId)},500);break}}},[o,t]),Po(()=>{g.length>0&&i()},[g]);function x(h){let m=a.find(w=>w.slug===h);m&&m.triggerType==="AUTOMATIC"&&!k.includes(m.slug)&&(u([...k,m.slug]),T([m]))}function F(){if(!r){let h=localStorage.getItem(Rt);if(h){n(h);return}let m=localStorage.getItem(Di);if(m){n(m);return}c(!0);let w=vt+ip();try{localStorage.setItem(Di,w)}catch(y){console.log("Failed to save guest user id locally: Local storage unavailable",y)}n(y=>y||w)}}Po(()=>{try{if(a){let h=[];a.forEach(m=>{if(m.data){let w=m.data.match(/"imageUri":"(.*?)"/g);w&&w.forEach(y=>{let E=y.replace('"imageUri":"',"").replace('"',"");if(h.includes(E))return;let O=new Image;O.src=E,h.push(E)})}})}}catch{}},[a]),Po(()=>{if(r!==s&&e([]),p(r),r&&!r.startsWith(vt))try{localStorage.setItem(Rt,r)}catch(h){console.log("Failed to save user id locally: Local storage available",h)}r===null&&setTimeout(()=>{r===null&&F()},50)},[r,a,C]);function N(){return ht.createElement(ht.Fragment,null,S.map(h=>d(h.slug)!==Ne?null:ht.createElement("span",{key:h.slug},ht.createElement(Oi,{flowId:h.slug,type:"modal",modalPosition:"center",endFlowOnDismiss:!0}))))}return ht.createElement(ht.Fragment,null,ht.createElement(N,null))};import{ErrorBoundary as Ap}from"react-error-boundary";import eo from"core-js-pure/actual/structured-clone";function pr(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function lt(...e){let t=e.shift(),o=e.length===1?e[0]:lt(...e);if(!pr(t)||!pr(o))throw new Error("deepmerge can only merge Objects");let i=eo(t);return Object.entries(o).forEach(([r,n])=>{pr(n)?i[r]!==void 0?Object.assign(i,{[r]:lt(i[r],eo(n))}):Object.assign(i,{[r]:eo(n)}):Array.isArray(n)?i[r]!==void 0?Object.assign(i,{[r]:[...i[r],...eo(n)]}):Object.assign(i,{[r]:eo(n)}):Object.assign(i,{[r]:n})}),i}var Mi={colorPrimary:"colors.primary.background",colorText:"colors.neutral.foreground",colorBackground:"colors.neutral.background",colorBackgroundSecondary:"colors.secondary.background",colorTextOnPrimaryBackground:"colors.primary.foreground",colorTextSecondary:"colors.secondary.foreground",colorTextDisabled:"colors.gray700",colorBorder:"colors.gray800",colorTextError:"colors.negative.foreground",borderRadius:"radii.lg"};function np(e){if(!e)return;let t={};return Object.entries(e).forEach(([o,i])=>{if(Mi[o]){let r=Mi[o].split("."),n=t;r.forEach((s,p)=>{n[s]||(n[s]=p===r.length-1?i:{}),n=n[s]})}}),t}function sp(e){if(!e)return;let t=lt({},e),o={};return Object.keys(t).forEach(i=>{let r=`.fr-${i}`;o[r]=t[i]}),o}function Ui(e){let{theme:t,styleOverrides:o}=e,i=np(t),r=sp(o);return{overrides:i,css:r}}import Sp from"styled-components";import{compose as bp,variant as _i}from"styled-system";import zi from"react";import lp,{ThemeProvider as ap,useTheme as pp}from"styled-components";import{border as dp,color as cp,compose as mp,get as up,shadow as fp,space as gp,system as xp,typography as hp}from"styled-system";var Cp={width:{property:"width",scale:"sizes",transform:(e,t)=>up(t,e,!(typeof e=="number"&&!isNaN(e))||e>1?e:e*100+"%")},height:{property:"height",scale:"sizes"},minWidth:{property:"minWidth",scale:"sizes"},minHeight:{property:"minHeight",scale:"sizes"},maxWidth:{property:"maxWidth",scale:"sizes"},maxHeight:{property:"maxHeight",scale:"sizes"},overflow:!0,overflowX:!0,overflowY:!0,display:!0,verticalAlign:!0},yp=lp("div")(({css:e})=>e,mp(dp,cp,fp,gp,hp,xp(Cp))),to=({as:e,children:t,overrides:o,...i})=>{let r=pp(),n={border:"none",boxSizing:"border-box",m:0,p:0},s=()=>zi.createElement(yp,{as:e,...n,...i},t);if(o!==void 0){let p=lt(r,o);return zi.createElement(ap,{theme:p},s())}return s()};var oo={Primary:{backgroundColor:"primary.background",color:"primary.foreground","&:hover":{backgroundColor:"blue400"}},Secondary:{backgroundColor:"white",border:"1px solid",borderColor:"gray800",color:"neutral.foreground","&:hover":{backgroundColor:"blue900"}},Link:{backgroundColor:"transparent",color:"primary.inverted"},Plain:{backgroundColor:"transparent",color:"neutral.foreground"}},wp={sm:{paddingX:4,paddingY:1},md:{paddingX:6,paddingY:2}},Wi=Sp(to)(()=>({whiteSpace:"nowrap"}),bp(_i({scale:"components.Button",variants:"components.Button"}),_i({prop:"size",variants:wp})));import Tp from"styled-components";import{variant as Fp,system as kp}from"styled-system";var vo={Display1:{fontSize:"5xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"4xl"},Display2:{fontSize:"4xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"3xl"},H1:{fontSize:"3xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"2xl"},H2:{fontSize:"2xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"xl"},H3:{fontSize:"xl",fontWeight:"bold",letterSpacing:"md",lineHeight:"lg"},H4:{fontSize:"lg",fontWeight:"bold",letterSpacing:"md",lineHeight:"md"},Body1:{fontSize:"md",fontWeight:"regular",letterSpacing:"md",lineHeight:"md"},Body2:{fontSize:"sm",fontWeight:"regular",letterSpacing:"md",lineHeight:"md"},Caption:{fontSize:"xs",fontWeight:"regular",letterSpacing:"md",lineHeight:"sm"}};var Hi=Tp(to)(Fp({scale:"components.Text",variants:"components.Text"}),kp({fontWeight:{property:"fontWeight",scale:"fontWeights"}}));var Vi=4,ji="px",Pp=20,vp=Object.fromEntries(Array.from(Array(Pp+1),(e,t)=>t===0?[.5,`${.5*Vi}${ji}`]:[t,`${t*Vi}${ji}`])),Nt={black:"#0F1114",gray100:"#14161A",gray200:"#181B20",gray300:"#1F2329",gray400:"#2E343D",gray500:"#4C5766",gray600:"#5A6472",gray700:"#C5CBD3",gray800:"#E2E5E9",gray900:"#F1F2F4",white:"#ffffff",blue400:"#015AC6",blue500:"#0171F8",blue800:"#DBECFF",blue900:"#F5F9FF",green400:"#009E37",green500:"#00D149",green800:"#DBFFE8",transparent:"#FFFFFF00",red500:"#c00000"},dr={colors:{...Nt,neutral:{foreground:Nt.gray300},primary:{background:Nt.blue500,foreground:Nt.white,inverted:Nt.blue500},negative:{foreground:Nt.red500}},fonts:{default:"TT Interphases Pro, sans-serif"},fontSizes:{xs:"12px",sm:"14px",md:"16px",lg:"18px",xl:"20px","2xl":"24px","3xl":"30px","4xl":"36px","5xl":"48px"},fontWeights:{regular:400,semibold:500,bold:700},letterSpacings:{md:"0.02em"},lineHeights:{xs:"18px",sm:"22px",md:"24px",lg:"26px",xl:"30px","2xl":"38px","3xl":"46px","4xl":"60px"},radii:{md:"8px",lg:"20px",round:"50%"},shadows:{md:"0px 4px 20px rgba(0, 0, 0, 0.06)"},space:vp,components:{Button:oo,Text:vo}};var Gi="https://api.frigade.com",j=Bp({publicApiKey:"",setUserId:()=>{},flows:[],setFlows:()=>{},failedFlowResponses:[],setFailedFlowResponses:()=>{},flowResponses:[],setFlowResponses:()=>{},userProperties:{},setUserProperties:()=>{},openFlowStates:{},setOpenFlowStates:()=>{},completedFlowsToKeepOpenDuringSession:[],setCompletedFlowsToKeepOpenDuringSession:()=>{},customVariables:{},setCustomVariables:()=>{},isNewGuestUser:!1,setIsNewGuestUser:()=>{},hasActiveFullPageFlow:!1,setHasActiveFullPageFlow:()=>{},organizationId:"",setOrganizationId:()=>{},navigate:()=>{},defaultAppearance:Ge,shouldGracefullyDegrade:!1,setShouldGracefullyDegrade:()=>{},apiUrl:Gi,readonly:!1});function Ip(){Object.keys(localStorage).forEach(e=>{e.startsWith("frigade-")&&localStorage.removeItem(e)})}var Np=({publicApiKey:e,userId:t,organizationId:o,config:i,children:r})=>{var K,ee;let[n,s]=Ae(t||null),[p,d]=Ae(o||null),[a,C]=Ae([]),[c,g]=Ae([]),[S,T]=Ae([]),[k,u]=Ae({}),[v,x]=Ae({}),[F,N]=Ae([]),[h,m]=Ae({}),[w,y]=Ae(!1),[E,O]=Ae(!1),[I,$]=Ae(!_(e)),L=(le,X)=>{if(X==="_blank"){window.open(le,"_blank");return}setTimeout(()=>{window.location.href=le},50)},H={theme:{...Ge.theme,...((K=i==null?void 0:i.defaultAppearance)==null?void 0:K.theme)??{}},styleOverrides:{...Ge.styleOverrides,...((ee=i==null?void 0:i.defaultAppearance)==null?void 0:ee.styleOverrides)??{}}};function _(le){return!!(le&&le.length>10&&le.substring(0,10)==="api_public")}Bo(()=>{t&&s(t)},[t]),Bo(()=>{n&&window&&window.localStorage&&window.localStorage.getItem(Rt)&&window.localStorage.getItem(Rt)!==n&&Ip()},[n]),Bo(()=>{o&&d(o)},[o]),Bo(()=>{if(_(e))$(!1);else{console.error("Frigade SDK failed to initialize. API key provided is either missing or valid."),$(!0);return}},[e,$]);let oe={publicApiKey:e,userId:n,setUserId:s,setFlows:C,flows:a,failedFlowResponses:c,setFailedFlowResponses:g,flowResponses:S,setFlowResponses:T,userProperties:k,setUserProperties:u,openFlowStates:v,setOpenFlowStates:x,completedFlowsToKeepOpenDuringSession:F,setCompletedFlowsToKeepOpenDuringSession:N,customVariables:h,setCustomVariables:m,isNewGuestUser:w,setIsNewGuestUser:y,hasActiveFullPageFlow:E,setHasActiveFullPageFlow:O,organizationId:p,setOrganizationId:d,navigate:i&&i.navigate?i.navigate:L,defaultAppearance:H,shouldGracefullyDegrade:I,setShouldGracefullyDegrade:$,apiUrl:i&&i.apiUrl?i.apiUrl:Gi,readonly:i&&i.readonly?i.readonly:!1};if(I)return Ct.createElement(j.Provider,{value:oe},r);let{overrides:R}=Ui(H);return Ct.createElement(Ap,{fallback:Ct.createElement(Ct.Fragment,null,r)},Ct.createElement(j.Provider,{value:oe},Ct.createElement(Ep,{theme:lt(H.theme,dr,R??{},(i==null?void 0:i.theme)??{})},r,Ct.createElement($i,null))))};import Ad from"react";import me,{useEffect as Cs,useState as ys}from"react";import De,{useState as td}from"react";import bt from"styled-components";import Io from"react";import yt from"react";import Ki from"styled-components";var qi=Ki.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #4d4d4d;
  display: inline-block;
  vertical-align: middle;
  margin-left: 12px;
  padding-right: 12px;
`,Op=Ki.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid ${e=>e.theme.colorBorder};
  width: 100%;
`,Eo=({label:e,value:t,labelStyle:o={},labelPosition:i="right",style:r,primaryColor:n="#000000",checkBoxType:s="square",appearance:p})=>yt.createElement(yt.Fragment,null,yt.createElement(Op,{className:l("checklistStepsContainer",p),appearance:p,style:{...r}},i==="left"&&e&&yt.createElement(qi,{className:l("checklistStepLabel",p),style:o},e),yt.createElement(qe,{appearance:p,value:t,type:s,primaryColor:n}),i==="right"&&e&&yt.createElement(qi,{className:l("checklistStepLabel",p),style:o},e)),yt.createElement(se,{appearance:p}));import{motion as Lp}from"framer-motion";import ro from"styled-components";var Yi=ro.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
`,Xi=ro.p`
  font-weight: 700;
  font-size: 18px;
  line-height: 30px;
  margin: 20px 0px 0px 0px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,Ji=ro.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 28px;
  max-width: 540px;
  margin: 8px 0px 0px 0px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`,Ao=ro.div`
  width: 4px;
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`,Qi=ro.div`
  flex-direction: row;
  justify-content: flex-start;
`;var Zi=({data:e,index:t,isSelected:o,primaryColor:i,style:r,onClick:n,appearance:s})=>{var p,d;return Io.createElement("div",{style:{position:"relative",paddingLeft:"20px"},onClick:()=>{n()}},o&&Io.createElement(Ao,{className:l("checklistStepItemSelectedIndicator",s),as:Lp.div,layoutId:"checklis-step-selected",style:{backgroundColor:((p=s==null?void 0:s.theme)==null?void 0:p.colorPrimary)??i}}),Io.createElement(Qi,{className:l("checklistStepItem",s),key:`hero-checklist-step-${t}`,role:"listitem"},Io.createElement(Eo,{value:e.complete,labelPosition:"left",label:e.stepName??e.title,style:r,primaryColor:((d=s==null?void 0:s.theme)==null?void 0:d.colorPrimary)??i,appearance:s})))};import St from"react";import{motion as Dp}from"framer-motion";import cr from"styled-components";var $p={backgroundColor:"#E6E6E6"},Mp=cr.div`
  display: flex;
  flex-direction: ${e=>e.textLocation=="top"?"column":"row"};
  justify-content: flex-start;
  align-items: ${e=>e.textLocation=="top"?"flex-end":"center"};
  width: 100%;

  ${e=>je(e)}
`,Up=cr.div`
  flex-grow: 1;
  position: relative;
  ${e=>e.textLocation=="top"?"width: 100%;":""}
`,zp=cr.span`
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  padding-right: ${e=>e.padding};
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
  margin-bottom: ${e=>e.textLocation=="top"?"8px":"0px"};
  ${e=>je(e)}
`,_p={position:"relative",left:0,top:0,width:"100%",minWidth:"40px",height:"10px",borderRadius:"20px"},Wp={position:"absolute",left:0,top:0,height:"10px",borderRadius:"20px"},Ie=({count:e,total:t,fillColor:o,bgColor:i=$p.backgroundColor,display:r="count",textLocation:n="left",style:s={},textStyle:p={},appearance:d})=>{var T,k;if(t===0)return St.createElement(St.Fragment,null);let a=e===0?"10px":`${e/t*100}%`,C=r==="compact"?"5px":"10px",c=Math.round(e/t*100),g=r==="compact"?"5px":"20px",S;return r==="count"?S=`${e} of ${t}`:r==="compact"?S=`${c}%`:r==="percent"&&(S=`${c}% complete`),n==="top"&&(g="0px"),St.createElement(Mp,{className:l("progressBarContainer",d),textLocation:n,styleOverrides:s},St.createElement(zp,{className:l("progressBarStepText",d),style:{...p,fontSize:r==="compact"?12:15,fontWeight:r==="compact"?400:500},appearance:d,padding:g,textLocation:n},S),St.createElement(Up,{textLocation:n,className:l("progressBar",d)},St.createElement(Dp.div,{style:{...Wp,width:a,height:C,backgroundColor:((T=d==null?void 0:d.theme)==null?void 0:T.colorPrimary)??o,zIndex:r=="compact"?1:5},className:l("progressBarFill",d)}),St.createElement("div",{className:l("progressBarBackground",d),style:{..._p,height:C,backgroundColor:((k=d==null?void 0:d.theme)==null?void 0:k.colorSecondary)??i}})))};import io from"react";import Vp from"styled-components";import Oo from"react";import No from"react";var Ot=({stepData:e,appearance:t})=>No.createElement(No.Fragment,null,No.createElement(Xi,{appearance:t,className:l("checklistStepTitle",t),dangerouslySetInnerHTML:ue(e.title)}),No.createElement(Ji,{appearance:t,className:l("checklistStepSubtitle",t),dangerouslySetInnerHTML:ue(e.subtitle)}));import mr from"react";var Lt=({stepData:e,appearance:t})=>{let o=()=>{e.handlePrimaryButtonClick&&e.handlePrimaryButtonClick()},i=()=>{e.handleSecondaryButtonClick&&e.handleSecondaryButtonClick()};return mr.createElement(bo,{className:l("ctaContainer",t)},e.secondaryButtonTitle&&mr.createElement(ne,{appearance:t,secondary:!0,title:e.secondaryButtonTitle,onClick:i,style:{width:"auto",marginRight:"12px"}}),mr.createElement(ne,{appearance:t,title:e.primaryButtonTitle,onClick:o}))};var Dt=({stepData:e,appearance:t})=>Oo.createElement(Oo.Fragment,null,Oo.createElement(Ot,{stepData:e,appearance:t}),Oo.createElement(Lt,{stepData:e,appearance:t}));import Hp from"react";function Ri(e){return Hp.createElement(nt,{appearance:e.appearance,videoUri:e.videoUri})}var ur="default",jp=Vp.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`,en=({stepData:e,appearance:t})=>{if(e!=null&&e.StepContent){let o=e.StepContent;return io.createElement("div",null,o)}return io.createElement(Yi,{className:l("checklistStepContent",t)},e.imageUri?io.createElement(jp,{className:l("checklistStepImage",t),src:e.imageUri,style:e.imageStyle}):null,e.videoUri?io.createElement(Ri,{videoUri:e.videoUri,appearance:t}):null,io.createElement(Dt,{stepData:e,appearance:t}))};import Pe,{useRef as Gp,useState as qp}from"react";import $t from"styled-components";var tn=$t.div`
  display: block;
`,Kp=$t.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0px;
  align-items: center;
  align-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
`,Yp=$t.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-right: 16px;
`,Xp=$t.video`
  width: 200px;
  height: 120px;
`,Jp=$t.div`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`,Qp=$t.div`
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
`,on="videoCarousel",rn=({stepData:e,appearance:t})=>{var r;if(!((r=e.props)!=null&&r.videos))return Pe.createElement(tn,null,Pe.createElement(Dt,{stepData:e,appearance:t}));function o({video:n}){let s=Gp(),[p,d]=qp(!1);return Pe.createElement(Yp,null,!p&&Pe.createElement(Qp,{onClick:()=>{d(!0),s.current.play()},appearance:t},Pe.createElement(wo,null)),Pe.createElement(Xp,{controls:p,ref:s,play:p,src:n.uri}),Pe.createElement(Jp,null,n.title))}let i=e.props;return i.videos?Pe.createElement(tn,null,Pe.createElement(Ot,{stepData:e,appearance:t}),Pe.createElement(Kp,null,i.videos.map((n,s)=>Pe.createElement("span",{key:`${n.uri}-${s}`},Pe.createElement(o,{video:n})))),Pe.createElement(Lt,{stepData:e,appearance:t})):null};import Ye from"react";import Lo from"styled-components";var nn=Lo.div`
  display: block;
`,Zp=Lo.pre`
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
`,Rp=Lo.div`
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 12px;
  margin-top: 12px;
`,ed=Lo.div`
  margin-top: 24px;
`,sn="codeSnippet",ln=({stepData:e,appearance:t})=>{var i;if(!((i=e.props)!=null&&i.codeSnippets))return Ye.createElement(nn,null,Ye.createElement(Dt,{stepData:e,appearance:t}));let o=e.props;return o.codeSnippets?Ye.createElement(nn,null,Ye.createElement(Ot,{stepData:e,appearance:t}),Ye.createElement(ed,null,o.codeSnippets.map((r,n)=>Ye.createElement("div",{key:n},r.title?Ye.createElement(Rp,null,r.title):null,r.code?Ye.createElement(Zp,null,r.code):null))),Ye.createElement(Lt,{stepData:e,appearance:t})):null};var od=bt.div`
  display: flex;
  flex-direction: row;
  min-width: ${e=>e.type!="modal"?"1000px":"100%"};
  background: ${e=>{var t;return(t=e.appearance)==null?void 0:t.theme.colorBackground}};
  box-shadow: ${e=>e.type!="modal"?"0px 6px 25px rgba(0, 0, 0, 0.06)":"none"};
  border-radius: 8px;
`,rd=bt.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,id=bt.h2`
  font-size: 15px;
  line-height: 28px;
  color: ${e=>{var t,o;return((o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary)??"#4d4d4d"}};
  margin: 10px 0px 0px 0px;
`,an=bt.div`
  padding-bottom: 16px;
`,nd=bt.div`
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  width: 300px;
`,sd=bt.div`
  width: 1px;
  margin: 40px;
  background: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBorder}};
`,ld=bt.div`
  flex: 2;
  padding: 2rem;
`,ad=({title:e,subtitle:t,steps:o=[],style:i={},selectedStep:r,setSelectedStep:n,className:s="",customStepTypes:p=new Map,appearance:d,type:a})=>{let{mergeAppearanceWithDefault:C}=te();d=C(d);let g={...{[ur]:en,[on]:rn,[sn]:ln},...p},[S,T]=td(0),k=r??S,u=n??T,v=o.filter(F=>F.complete===!0).length,x=()=>{var F;return!((F=o[k])!=null&&F.type)||!g[o[k].type]?g[ur]({stepData:o[k],appearance:d}):g[o[k].type]({stepData:o[k],appearance:d})};return De.createElement(od,{type:a,style:i,className:s,appearance:d},De.createElement(an,{style:{flex:1}},De.createElement(an,{style:{padding:"30px 0px 30px 30px",borderBottom:"none"}},De.createElement(rd,{className:l("checklistTitle",d),appearance:d},e),De.createElement(id,{className:l("checklistSubtitle",d),appearance:d},t),De.createElement(Ie,{total:o.length,count:v,fillColor:d.theme.colorPrimary,style:{marginTop:"24px"},appearance:d})),De.createElement(nd,{className:l("checklistStepsContainer",d)},o.map((F,N)=>De.createElement(Zi,{data:F,index:N,key:N,listLength:o.length,isSelected:N===k,primaryColor:d.theme.colorPrimary,style:{justifyContent:"space-between"},onClick:()=>{u(N)}})))),De.createElement(sd,{appearance:d,className:l("checklistDivider",d)}),De.createElement(ld,null,De.createElement(x,null)))},fr=ad;import U,{useState as fd}from"react";import pn from"react";import pd from"styled-components";var dd=pd.svg`
  transition: 'transform 0.35s ease-in-out';
`,Mt=({color:e="#323232",style:t,className:o})=>pn.createElement(dd,{width:"7",height:"10",viewBox:"0 0 9 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:t,className:o},pn.createElement("path",{d:"M1 13L7.5 7L0.999999 1",stroke:e,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}));import{motion as gd}from"framer-motion";import fe from"styled-components";var gr={boxShadow:"0px 6px 25px rgba(0, 0, 0, 0.06)",padding:"32px",maxHeight:"700px",msOverflowStyle:"none",scrollbarWidth:"none",paddingBottom:"12px",minHeight:"610px"},dn=fe.div`
  max-height: 350px;
  padding-bottom: 40px;
`,cn=fe.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`,mn=fe.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 36px;
  margin-bottom: 16px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
`,un=fe.h2`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 16px;
  padding-left: 1px;
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
`,fn=fe.div`
  ${e=>P(e)} {
    border: 1px solid #fafafa;
  }
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  overflow: hidden;
`,gn=fe.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`,xn=fe.p`
  ${e=>P(e)} {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    text-transform: uppercase;
    color: #8c8c8c;
    margin: 20px;
  }
`,hn=fe.div`
  display: flex;
  flex-direction: row;
`,Cn=fe.div`
  flex: 1;
`,yn=fe.div`
  ${e=>P(e)} {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    flex: 1;
    padding-left: 8px;
    padding-right: 8px;
  }
`,Sn=fe.p`
  ${e=>P(e)} {
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 26px;

    text-align: center;
    color: ${e=>e.appearance.theme.colorText};
    margin-top: 20px;
    margin-bottom: 16px;
  }
`,bn=fe.p`
  ${e=>P(e)} {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: ${e=>e.appearance.theme.colorTextSecondary};
    margin-bottom: 8px;
  }
`,wn=fe.div`
  ${e=>P(e)} {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }
`,Tn=fe.div`
  ${e=>P(e)} {
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
`,Fn=fe.p`
  ${e=>P(e)} {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${e=>e.selected?"#434343":"#BFBFBF"};
  }
  font-weight: ${e=>e.selected?500:400};
  font-size: 14px;
  line-height: 22px;
  margin: 0;
`,kn=fe.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
`,Pn=fe.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-right: 20px;
`,vn=fe.div`
  display: block;
  width: 100%;
`;import cd from"styled-components";var Bn=cd.div`
  flex-direction: column;
  justify-content: center;
  display: flex;
`;import Je from"react";import{motion as md}from"framer-motion";import Xe from"styled-components";var En=Xe.div`
  border: 1px solid #fafafa;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,An=Xe.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  row-gap: 10px;
`,In=Xe.div`
  ${e=>P(e)} {
    color: #595959;
  }
  text-transform: uppercase;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.09em;
  margin-bottom: 12px;
`,Nn=Xe.div`
  ${e=>P(e)} {
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
`,On=Xe.div`
  ${e=>P(e)} {
    background: radial-gradient(50% 50% at 50% 50%, #ffffff 0%, #f7f7f7 100%);
  }
  width: 40px;
  height: 40px;

  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`,Ln=Xe.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  width: 20px;
  height: 20px;
`,Dn=Xe.div`
  ${e=>P(e)} {
    color: #434343;
  }
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-top: 12px;
  margin-bottom: 8px;
`,$n=Xe.div`
  ${e=>P(e)} {
    color: #8c8c8c;
  }
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`,Mn=Xe.a`
  color: ${e=>e.color};
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  cursor: pointer;
`;var ud=({steps:e,style:t,title:o,primaryColor:i,appearance:r,onButtonClick:n})=>{let{primaryCTAClickSideEffects:s}=pe();return Je.createElement(En,{style:t,className:l("guideContainer",r)},Je.createElement(In,{className:l("guideTitle",r)},o),Je.createElement(An,{className:l("guideItemContainer",r)},e.map((p,d)=>Je.createElement(Nn,{key:`guide-${p.id??d}`,as:md.div,whileHover:{boxShadow:"0px 2px 8px rgba(0, 0, 0, 0.05)",transition:{duration:.25}},className:l("guideItem",r)},p.icon&&Je.createElement(On,{className:l("guideIcon",r)},Je.createElement(Ln,null,p.icon)),Je.createElement(Dn,{className:l("guideItemTitle",r),dangerouslySetInnerHTML:ue(p.title)}),Je.createElement($n,{className:l("guideItemSubtitle",r),dangerouslySetInnerHTML:ue(p.subtitle)}),Je.createElement(Mn,{className:l("guideItemLink",r),color:i,onClick:()=>{p.primaryButtonUri&&s(p),n&&n(p)}},p.primaryButtonTitle)))))},no=ud;var xd=({steps:e,title:t,subtitle:o,stepsTitle:i,visible:r,onClose:n,selectedStep:s,setSelectedStep:p,customStepTypes:d,appearance:a,guideData:C,guideTitle:c,onGuideButtonClick:g})=>{let S=({stepData:m,handleSecondaryCTAClick:w,handleCTAClick:y})=>m?U.createElement(yn,{className:l("checklistStepContainer",a),"data-testid":"checklistStepContainer"},U.createElement(Sn,{appearance:a,className:l("checklistStepTitle",a),dangerouslySetInnerHTML:ue(m.title)}),U.createElement(bn,{appearance:a,className:l("checklistStepSubtitle",a),dangerouslySetInnerHTML:ue(m.subtitle)}),U.createElement(wn,{className:l("checklistCTAContainer",a)},m.secondaryButtonTitle&&U.createElement(ne,{title:m.secondaryButtonTitle,onClick:w,appearance:a,secondary:!0}),U.createElement(ne,{title:m.primaryButtonTitle,onClick:y,appearance:a}))):U.createElement(U.Fragment,null),k={...{default:m=>{var O;if((O=e[x])!=null&&O.StepContent){let I=e[x].StepContent;return U.createElement("div",null,I)}let w=e[x];return U.createElement(S,{stepData:m,handleCTAClick:()=>{w.handlePrimaryButtonClick&&w.handlePrimaryButtonClick()},handleSecondaryCTAClick:()=>{w.handleSecondaryButtonClick&&w.handleSecondaryButtonClick()}})}},...d},[u,v]=fd(0),x=s??u,F=p??v,N=()=>{var m;return e?!((m=e[x])!=null&&m.type)||!k[e[x].type]?k.default(e[x]):k[e[x].type]({stepData:e[x],primaryColor:a.theme.colorPrimary}):U.createElement(U.Fragment,null)},h=e.filter(m=>m.complete).length;return r?(a.theme.modalContainer||(a.theme.borderRadius&&(gr.borderRadius=a.theme.borderRadius+"px"),a.theme.modalContainer=gr),U.createElement(et,{onClose:n,visible:r,appearance:a},U.createElement(vn,null,U.createElement(cn,null,U.createElement(mn,{appearance:a,className:l("checklistTitle",a)},t),U.createElement(un,{appearance:a,className:l("checklistSubtitle",a)},o)),U.createElement(dn,null,e&&e.length>0&&U.createElement(fn,{className:l("stepsContainer",a)},U.createElement(gn,null,U.createElement("div",{style:{flex:3}},U.createElement(xn,{className:l("stepsTitle",a)},i)),U.createElement(Pn,null,U.createElement(Ie,{fillColor:a.theme.colorPrimary,style:{width:"100%"},count:h,total:e.length,appearance:a}))),U.createElement(hn,null,U.createElement(Cn,{className:l("checklistStepListContainer",a),appearance:a},e.map((m,w)=>{let y=x===w;return U.createElement(Tn,{selected:y,className:l(`checklistStepListItem${y?"Selected":""}`,a),key:`checklist-guide-step-${m.id??w}`,disabled:m.blocked,onClick:()=>{m.blocked||F(w)},title:m.blocked?"Finish remaining steps to continue":void 0},y&&U.createElement(Ao,{className:l("checklistStepItemSelectedIndicator",a),as:gd.div,layoutId:"checklist-step-selected",style:{backgroundColor:a.theme.colorPrimary,borderRadius:0,height:"100%",top:"0%",width:"2px"}}),U.createElement(Fn,{selected:y,className:l(`checklistStepListStepName${y?"Selected":""}`,a)},m.stepName),U.createElement(kn,null,U.createElement(qe,{value:m.complete,type:"round",primaryColor:a.theme.colorPrimary,progress:m.progress,appearance:a}),U.createElement(Bn,null,U.createElement(Mt,{style:{marginLeft:"10px"},color:a.theme.colorBackgroundSecondary}))))})),U.createElement(N,null))),C&&C.length>0&&U.createElement(no,{steps:C,title:c,primaryColor:a.theme.colorPrimary,style:{border:"none",boxShadow:"none"},appearance:a,onButtonClick:m=>(g&&g(m),!0)}))))):U.createElement(U.Fragment,null)},xr=xd;import{useEffect as hd,useState as Cd}from"react";var Do=()=>{let e={isSmall:"(max-width: 480px)",isMedium:"(min-width: 481px) AND (max-width: 1023px)",isLarge:"(min-width: 1025px)"},t=Object.fromEntries(Object.entries(e).map(([p])=>[p,!1])),[o,i]=Cd(t),r=null,n=()=>{r!==null?clearTimeout(r):s(),r=setTimeout(()=>{s()},16)},s=()=>{let p=Object.fromEntries(Object.entries(e).map(([d,a])=>{if(!window)return[d,!1];let C=window.matchMedia(a);return C.addEventListener("change",n),[d,C.matches]}));i(p)};return hd(()=>{s()},[]),o};import we,{useEffect as Zn,useState as bd}from"react";import ge from"react";import{AnimatePresence as yd,motion as Sd}from"framer-motion";import Qe from"styled-components";var Un=Qe.div`
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
`,zn=Qe.div`
  display: flex;
  margin-bottom: 20px;
`,_n=Qe.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`,Wn=Qe.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`,Hn=Qe.p`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  margin-left: 8px;
`,Vn=Qe.div`
  padding: 20px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`,JC=Qe.div``,jn=Qe.p`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`,Gn=Qe.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;var qn=({stepData:e,collapsed:t,onClick:o,onPrimaryButtonClick:i,onSecondaryButtonClick:r,appearance:n,customStepTypes:s})=>{var C,c;let p=t?{}:{transform:"rotate(90deg)"};function d(){return ge.createElement(ge.Fragment,null,e.imageUri||e.videoUri?ge.createElement(zn,{className:l("stepMediaContainer",n)},e.imageUri?ge.createElement(_n,{className:l("stepImage",n),src:e.imageUri,style:e.imageStyle}):null,e.videoUri?ge.createElement(nt,{appearance:n,videoUri:e.videoUri}):null):null,ge.createElement(jn,{className:l("stepSubtitle",n),appearance:n,dangerouslySetInnerHTML:ue(e.subtitle)}),ge.createElement(bo,{className:l("checklistCTAContainer",n)},e.secondaryButtonTitle?ge.createElement(ne,{secondary:!0,title:e.secondaryButtonTitle,onClick:()=>r(),appearance:n}):null,ge.createElement(ne,{title:e.primaryButtonTitle??"Continue",onClick:()=>i(),appearance:n})))}function a(){if(!s)return null;let g=s[e.type];return g?g(e,n):null}return ge.createElement(Un,{onClick:()=>t?o():null,"data-testid":`step-${e.id}`,className:l("checklistStepContainer",n),appearance:n},ge.createElement(Wn,{className:l("stepHeader",n)},ge.createElement(Gn,null,ge.createElement(Eo,{value:e.complete,style:{width:"auto",borderTop:0},primaryColor:(C=n==null?void 0:n.theme)==null?void 0:C.colorPrimary,appearance:n}),ge.createElement(Hn,{appearance:n,className:l("stepTitle",n),dangerouslySetInnerHTML:ue(e.title)})),ge.createElement(Vn,{className:l("stepChevronContainer",n),onClick:()=>o()},ge.createElement(Mt,{style:{...p,transition:"transform 0.1s ease-in-out"},color:(c=n==null?void 0:n.theme)==null?void 0:c.colorTextSecondary}))),ge.createElement(yd,null,!t&&ge.createElement(Sd.div,{initial:{opacity:1,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:1,height:0},key:e.id,style:{overflow:"hidden"}},a()??d())))};import Ut from"styled-components";var d0=Ut.div`
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
`,Kn=Ut.div`
  display: flex;
  flex-direction: column;
`,Yn=Ut.h1`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorText}};
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
`,Xn=Ut.h2`
  color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorTextSecondary}};
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
  margin: 2px 0 0 0;
`,Jn=Ut.div`
  display: block;
  width: 100%;
`,Qn=Ut.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${e=>{var t,o;return(o=(t=e.appearance)==null?void 0:t.theme)==null?void 0:o.colorBackground}};
`;var wd=({title:e,subtitle:t,steps:o,onClose:i,visible:r,autoExpandFirstIncompleteStep:n=!0,autoCollapse:s=!0,autoExpandNextStep:p=!0,primaryColor:d="#000000",selectedStep:a,setSelectedStep:C,appearance:c,type:g,className:S,customStepTypes:T,style:k})=>{let u=o.filter(m=>m.complete).length,[v,x]=bd(Array(o.length).fill(!0));Zn(()=>{let m=[...v];if(n){for(let w=0;w<o.length;w++)if(!o[w].complete){m[w]=!1;break}x(m)}},[]),Zn(()=>{F(a)},[a]);let F=m=>{let w=[...v];if(s)for(let y=0;y<v.length;++y)y!==m&&(w[y]=!0);w[m]=!w[m],x(w)};if(!r&&g=="modal")return we.createElement(we.Fragment,null);let N=we.createElement(we.Fragment,null,we.createElement(Kn,null,we.createElement(Yn,{appearance:c,className:l("checklistTitle",c),dangerouslySetInnerHTML:ue(e)}),we.createElement(Xn,{appearance:c,className:l("checklistSubtitle",c),dangerouslySetInnerHTML:ue(t)})),we.createElement(Ie,{display:"percent",count:u,total:o.length,fillColor:d,style:{margin:"14px 0px 8px 0px"},appearance:c})),h=we.createElement(Jn,{className:Ce(l("checklistContainer",c),S)},o.map((m,w)=>{let y=v[w];return we.createElement(qn,{appearance:c,stepData:m,collapsed:y,key:`modal-checklist-${m.id??w}`,onClick:()=>{if(a===w){F(w);return}C(w)},onPrimaryButtonClick:()=>{m.handlePrimaryButtonClick&&m.handlePrimaryButtonClick(),p&&!m.completionCriteria&&w<v.length-1&&v[w+1]&&C(w+1)},onSecondaryButtonClick:()=>{m.handleSecondaryButtonClick&&m.handleSecondaryButtonClick()},customStepTypes:T})}));return g==="inline"?we.createElement(Qn,{appearance:c,className:Ce(l("checklistInlineContainer",c),S),style:k},N,h):we.createElement(we.Fragment,null,we.createElement(et,{onClose:i,visible:r,appearance:c,style:{maxWidth:"600px"},headerContent:N},h))},hr=wd;import ae,{useEffect as Cr,useRef as Bd,useState as wt}from"react";import zt from"react";import de,{css as Rn,keyframes as es}from"styled-components";var ts=Rn`
  border: 1px solid ${({theme:e})=>e.colorBorder};
`,Td=Rn`
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.06);
`,Fd=es`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`,kd=es`
  from {
    opacity: 1;
  } to {
    opacity: 0;
  }
`,os=de.div`
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
`,rs=de.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0 16px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`,is=de.div`
  animation: ${e=>e.reversed?kd:Fd} 0.25s ease-out;
  background: linear-gradient(
    to right,
    ${({theme:e})=>e.colorBackground}00,
    ${({theme:e})=>e.colorBackground} 100%
  );
  position: absolute;
  width: 64px;
  z-index: 10;
`,ns=de.button`
  ${ts}
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
`,ss=de.div`
  border-radius: ${({theme:e})=>e.borderRadius}px;
  padding: 20px;
`,ls=de(ss)`
  ${ts}
  background: ${({theme:e})=>e.colorBackground};
  position: relative;

  &:active {
    ${e=>e.blocked?"":`background: ${e.theme.colorBackgroundSecondary};`}
  }

  &:hover {
    ${e=>e.blocked?"":`border: 1px solid ${e.theme.colorPrimary};`}
    ${e=>e.blocked?"cursor: default":"cursor: pointer"}
  }
`,as=de.img`
  border-radius: 50%;
  height: 40px;
  margin-bottom: 12px;
  width: 40px;
`,ps=de(ss)`
  ${e=>P(e)} {
    ${Td}

    background: ${({theme:e})=>e.colorBackground};
  }
`,k0=de.div`
  color: ${({theme:e})=>e.colorPrimary};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`,P0=de.div`
  white-space: nowrap;
`,ds=de.div`
  background: #d8fed8;
  border-radius: 6px;
  float: right;
  margin-bottom: 12px;
  padding: 4px 10px;
`,Pd=de.p`
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: calc(18px * -0.01);
  margin: 0;
`,cs=de(Pd)`
  margin-bottom: 4px;
`,ms=de.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-width: 50%;
`,vd=de.p`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: calc(16px * -0.01);
  margin: 0;
`,us=de(vd)`
  margin-bottom: 4px;
  ${e=>e.blocked||e.complete?"opacity: 0.4;":`
  `}
`,at=de.p`
  color: ${({theme:e})=>e.colorText};
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
`,fs=de.p`
  color: ${({theme:e})=>e.colorText};
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  margin: 0;
`;at.Loud=de(at)`
  font-weight: 600;
`;at.Quiet=de(at)`
  color: ${({theme:e})=>e.colorTextSecondary};
  ${e=>e.blocked||e.complete?"opacity: 0.4;":`
  `}
`;var gs=({stepData:e,style:t={},appearance:o})=>{let{mergeAppearanceWithDefault:i}=te(),{primaryCTAClickSideEffects:r}=pe();o=i(o);let{imageUri:n=null,subtitle:s=null,title:p=null,complete:d=!1,blocked:a=!1}=e,C=e.primaryButtonTitle||e.secondaryButtonTitle,c=()=>{r(e)};return zt.createElement(ls,{className:l("carouselCard",o),onClick:a?null:c,style:t,blocked:a,complete:d},n&&zt.createElement(as,{className:l("carouselCardImage",o),src:n,alt:p,style:{opacity:d||a?.4:1}}),d&&zt.createElement(ds,{className:l("carouselCompletedPill",o)},zt.createElement(fs,{style:{color:"#108E0B"}},"Complete")),p&&zt.createElement(us,{blocked:a,complete:d,className:l("carouselCardTitle",o)},p),s&&zt.createElement(at.Quiet,{blocked:a,complete:d,className:l("carouselCardSubtitle",o)},s))};var Ed=()=>ae.createElement("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},ae.createElement("path",{d:"M14 6L20 12",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"}),ae.createElement("path",{d:"M14 18L20 12",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"}),ae.createElement("path",{d:"M4 12H20",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})),xs=({side:e="left",show:t=!1,onClick:o=()=>{}})=>{let[i,r]=wt(!1),[n,s]=wt(!1);Cr(()=>{t===!0&&i===!1?r(!0):t===!1&&i===!0&&s(!0)},[t]);let p=()=>{r(!1),s(!1)},d=e=="left"?{top:0,bottom:0,left:-20,transform:"rotate(180deg)"}:{top:0,bottom:0,right:-20};return i?ae.createElement(is,{style:d,reversed:n,onAnimationEnd:n?p:null},ae.createElement(ns,{onClick:()=>o(),style:{right:16,top:"calc(50% - 24px)"}},ae.createElement(Ed,null))):null},hs=({flowId:e,appearance:t,customVariables:o,className:i})=>{let r=Bd(null),[n,s]=wt(!1),[p,d]=wt(!1),[a,C]=wt(null),[c,g]=wt([]),[S,T]=wt(0),{isSmall:k}=Do(),u=k?1:3,{getFlowMetadata:v,getFlowSteps:x,getNumberOfStepsCompleted:F,updateCustomVariables:N,isLoading:h}=Z();Cr(()=>{N(o)},[o,h]),Cr(()=>{if(h)return;let I=v(e),$=F(e),L=x(e);C(I),I.data!==null&&(g(L.sort((H,_)=>Number(H.complete)-Number(_.complete))),d(L.length>u),T($))},[h]);let m=[];for(let I=0;I<c.length;I+=u)m.push(c.slice(I,I+u));let w=I=>{let $=I.target,L=$.scrollWidth-$.clientWidth,H=Math.ceil($.scrollLeft);H>0&&n===!1&&s(!0),H===0&&n===!0&&s(!1),H<L&&p===!1&&d(!0),H===L&&p===!0&&d(!1)},y=(I=!0)=>{let $=I?1:-1;r.current!==null&&r.current.scrollBy({left:r.current.clientWidth*$,behavior:"smooth"})},E=null,O=I=>{E!==null?clearTimeout(E):w(I),E=setTimeout(()=>{w(I)},16)};return h?null:ae.createElement(ps,{className:Ce(l("carouselContainer",t),i)},ae.createElement("div",{style:{display:"flex",justifyContent:k?"center":"space-between",marginBottom:20,flexWrap:k?"wrap":"nowrap",gap:k?16:20}},ae.createElement("div",null,ae.createElement(cs,{className:l("carouselTitle",t)},a==null?void 0:a.title),ae.createElement(at.Quiet,{className:l("carouselSubtitle",t)},a==null?void 0:a.subtitle)),ae.createElement(ms,{className:l("progressWrapper",t)},ae.createElement(Ie,{count:S,total:c.length,appearance:t}))),ae.createElement("div",{style:{position:"relative"}},ae.createElement(xs,{show:n,onClick:()=>y(!1)}),ae.createElement(xs,{side:"right",show:p,onClick:y}),ae.createElement(os,{ref:r,onScroll:O},m.map((I,$)=>ae.createElement(rs,{key:$,style:{flex:`0 0 calc(100% - ${c.length>u?36:0}px)`}},I.map((L,H)=>ae.createElement(gs,{key:H,stepData:L,style:{flex:c.length>u?`0 1 calc(100% / ${u} - 16px * 2 / ${u})`:1},appearance:t})))))),ae.createElement(se,{appearance:t}))};var yr=({flowId:e,title:t,subtitle:o,style:i,initialSelectedStep:r,className:n,type:s="inline",onDismiss:p,visible:d,customVariables:a,onStepCompletion:C,onButtonClick:c,appearance:g,hideOnFlowCompletion:S,setVisible:T,customStepTypes:k,checklistStyle:u="default",autoExpandFirstIncompleteStep:v,autoExpandNextStep:x,...F})=>{let{getFlow:N,getFlowSteps:h,markStepCompleted:m,getStepStatus:w,getNumberOfStepsCompleted:y,isLoading:E,targetingLogicShouldHideFlow:O,updateCustomVariables:I,getFlowMetadata:$,isStepBlocked:L,getFlowStatus:H,hasActiveFullPageFlow:_,setHasActiveFullPageFlow:oe}=Z(),{primaryCTAClickSideEffects:R,secondaryCTAClickSideEffects:K}=pe(),{getOpenFlowState:ee,setOpenFlowState:le}=Fe(),[X,G]=ys(r||0),[xe,Te]=ys(!1),q=d===void 0?ee(e):d,ce=s==="modal",{mergeAppearanceWithDefault:z}=te(),{isLarge:D}=Do();if(g=z(g),Cs(()=>{I(a)},[a,E]),Cs(()=>{d!==void 0&&(ce&&d===!0?oe(!0):ce&&d===!1&&oe(!1))},[d,T,_]),E)return null;let re=N(e);if(!re||O(re))return null;let V=h(e);if(!V||S===!0&&H(e)===Q)return null;let ie=$(e);if(ie!=null&&ie.title&&(t=ie.title),ie!=null&&ie.subtitle&&(o=ie.subtitle),!xe&&r===void 0&&y(e)>0){let A=V.findIndex(J=>J.complete===!1);G(A>-1?A:V.length-1),Te(!0)}function Ve(){if(X+1>=V.length){ce&&le(e,!1);return}L(e,V[X+1].id)||G(X+1)}function $e(A,J,mt){let vr=X+1<V.length?V[X+1]:null;c&&c(A,X,J,vr)===!0&&ce&&Me(),C&&C(A,mt,vr),!C&&!c&&(A.primaryButtonUri||A.secondaryButtonUri)&&ce&&Me()}function ct(){return V.map((A,J)=>({...A,handleSecondaryButtonClick:()=>{Ve(),K(A),A.skippable===!0&&m(e,A.id,{skipped:!0}),$e(A,"secondary",J)},handlePrimaryButtonClick:()=>{(!A.completionCriteria&&(A.autoMarkCompleted||A.autoMarkCompleted===void 0)||A.completionCriteria&&A.autoMarkCompleted===!0)&&(m(e,A.id),Ve()),$e(A,"primary",J),R(A),w(e,A.id)===Oe&&Ve()}}))}function W(){return me.createElement(se,{appearance:g})}let ve={steps:ct(),title:t,subtitle:o,primaryColor:g.theme.colorPrimary,appearance:g,customStepTypes:k,type:s,className:n,autoExpandFirstIncompleteStep:v,autoExpandNextStep:x};function Me(){le(e,!1),p&&p(),T&&T(!1)}function Wo(){return me.createElement(me.Fragment,null,me.createElement(W,null),me.createElement(hs,{flowId:e,appearance:g,customVariables:a,className:n}))}function f(){return me.createElement(me.Fragment,null,me.createElement(W,null),me.createElement(hr,{visible:q,onClose:()=>{Me()},selectedStep:X,setSelectedStep:G,autoExpandNextStep:!0,appearance:g,...ve}))}function b(){if(!D)return f();let A=F.guideFlowId,J;return A&&N(A)&&(J=h(A)),me.createElement(me.Fragment,null,me.createElement(W,null),me.createElement(xr,{visible:q,stepsTitle:ie.stepsTitle?ie.stepsTitle:"Your quick start guide",onClose:()=>{Me()},selectedStep:X,setSelectedStep:G,guideData:J,guideTitle:F.guideTitle??"Guide",appearance:g,title:t,subtitle:o,onGuideButtonClick:mt=>{$e(mt,"link",0)},customStepTypes:k,...ve}))}function B(){if(!D)return f();let A=me.createElement(fr,{flowId:e,style:i,selectedStep:X,setSelectedStep:G,appearance:g,type:s,...ve});return ce?me.createElement(et,{onClose:()=>{Me()},visible:q,appearance:g,style:{paddingTop:"0px",padding:"12px",paddingLeft:0}},me.createElement(W,null),A):me.createElement(me.Fragment,null,me.createElement(W,null),A)}switch(u){case"condensed":return f();case"with-guide":return b();case"default":return B();case"carousel":return Wo();default:return B()}};var Id=e=>Ad.createElement(yr,{type:"inline",...e});import dt,{useEffect as Od}from"react";import We from"react";import $o from"styled-components";var Ss=$o.div`
  border: 1px solid ${e=>e.appearance.theme.colorBorder};
  border-radius: 8px;
  padding: 6px 10px 6px 10px;
  min-width: 160px;
  cursor: pointer;
  background-color: ${e=>e.appearance.theme.colorBackground}};
`,bs=$o.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  flex-grow: 2;
`,ws=$o.div`
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: ${e=>e.type==="condensed"?"left":"right"};
  color: ${e=>e.appearance.theme.colorPrimary};
`,Ts=$o.div`
  width: 20px;
  margin-right: 8px;
  display: flex;
  height: 100%;
  align-items: center;
`;import{motion as Nd}from"framer-motion";var Fs=({title:e,count:t,total:o,onClick:i,style:r={},className:n,appearance:s,type:p="default"})=>We.createElement(We.Fragment,null,We.createElement(se,{appearance:s}),We.createElement(Ss,{as:Nd.div,whileHover:{opacity:.9},whileTap:{scale:.98},onClick:()=>i!==void 0&&i(),style:{...p=="condensed"?{display:"flex",justifyContent:"space-between"}:{},...r},className:Ce(n??"",l("progressRingContainer",s)),appearance:s},p=="condensed"&&o&&o!==0&&We.createElement(Ts,{className:l("progressRingContainer",s)},We.createElement(Et,{size:19,percentage:t/o,fillColor:s.theme.colorPrimary,bgColor:s.theme.colorBackgroundSecondary})),We.createElement(bs,{type:p,className:l("badgeTitleContainer",s)},We.createElement(ws,{type:p,appearance:s,className:l("badgeTitle",s)},e),i!==void 0&&We.createElement(Mt,{className:l("badgeChevron",s),color:s.theme.colorPrimary})),p=="default"&&o&&o!==0&&We.createElement(Ie,{display:"compact",count:t,total:o,fillColor:s.theme.colorPrimary,bgColor:s.theme.colorBackgroundSecondary,style:{width:"100%"},appearance:s})));import pt from"react";import so from"styled-components";var ks=so.div`
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
`,Ps=so.div`
  ${e=>P(e)} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
  }
`,vs=so.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 0;
`,Bs=so.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  min-width: 200px;
`,ky=so.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-left: 16px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;var Es=({title:e,subtitle:t,icon:o,appearance:i,count:r,total:n,className:s,style:p})=>pt.createElement(pt.Fragment,null,pt.createElement(ks,{appearance:i,className:Ce(l("fullWidthProgressBadgeContainer",i),s??""),style:p},o&&pt.createElement(Ps,{className:l("fullWidthProgressBadgeIcon",i)},o),pt.createElement(vs,null,pt.createElement(ye,{size:"small",appearance:i,title:e,subtitle:t})),pt.createElement(Bs,{className:l("fullWidthProgressBadgeProgressContainer",i)},pt.createElement(Ie,{count:r,total:n,display:"percent",textLocation:"top",fillColor:i.theme.colorPrimary}))));var Ld=({flowId:e,title:t,subtitle:o,icon:i,style:r,onClick:n,className:s,customVariables:p,hideOnFlowCompletion:d,appearance:a,type:C="default"})=>{let{getFlow:c,getFlowSteps:g,getFlowStatus:S,getNumberOfStepsCompleted:T,isLoading:k,targetingLogicShouldHideFlow:u,updateCustomVariables:v}=Z(),{mergeAppearanceWithDefault:x}=te();a=x(a);let{setOpenFlowState:F,getOpenFlowState:N}=Fe();if(Od(()=>{v(p)},[p,k]),k)return null;let h=c(e);if(!h||u(h)||d===!0&&S(e)===Q)return null;let m=g(e),w=T(e);return C==="full-width"?dt.createElement(dt.Fragment,null,dt.createElement(se,{appearance:a}),dt.createElement(Es,{title:t,subtitle:o,count:w,total:m.length,style:r,className:s,appearance:a,icon:i,onClick:()=>{}})):dt.createElement(dt.Fragment,null,dt.createElement(se,{appearance:a}),dt.createElement(Fs,{count:w,total:m.length,title:t,style:r,onClick:()=>{F(e,!0),n&&n()},type:C,className:s,appearance:a}))};import Dd from"react";var $d=({flowId:e,style:t,appearance:o,...i})=>{let{getFlow:r,targetingLogicShouldHideFlow:n,getFlowSteps:s}=Z(),{mergeAppearanceWithDefault:p}=te();o=p(o);let d=r(e);if(!d||n(d))return null;let a=s(e);return Dd.createElement(no,{steps:a,style:t,appearance:o,...i})};import Wt,{useContext as Yd,useEffect as Xd}from"react";import M,{useEffect as Mo,useLayoutEffect as Ns,useRef as Wd,useState as lo}from"react";import ao from"styled-components";import{useCallback as Md,useEffect as Ud,useState as zd}from"react";var Sr=(e,t,o,i={x:20,y:20},r)=>{let n=r=="fixed"?0:window.scrollY,s=r=="fixed"?0:window.scrollX;return!e||!e.left||!e.top?{x:0,y:0}:t==="left"?{x:e.left-o+i.x+s,y:e.top-i.y+n}:t==="right"?{x:e.left+e.width+i.x+s,y:e.top-i.y+n}:{x:0,y:0}},As={bottom:0,height:0,left:0,right:0,top:0,width:0,x:0,y:0};function _d(e){let t=As;return e&&(t=e.getBoundingClientRect()),t}function Is(e,t){let[o,i]=zd(As),r=Md(()=>{e&&i(_d(e))},[e]);return Ud(()=>(r(),window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)),[e,t]),o}var Os=300,Ls=100,Hd=500,_t=12,Vd=ao.div`
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
`,jd=ao.div`
  width: ${_t}px;
  height: ${_t}px;
  border-radius: 100px;
  background-color: ${e=>e.primaryColor};
  z-index: 20;
  opacity: 1;
`,Gd=ao.div`
  pointer-events: all;
`,Ds=ao.div`
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: ${e=>e.zIndex?e.zIndex:90};
`,qd=ao(Ds)`
  width: ${_t+12}px;
  height: ${_t+12}px;
`,Kd=({steps:e=[],onDismiss:t,onComplete:o=()=>{},tooltipPosition:i="auto",showHighlight:r=!0,primaryColor:n="#000000",offset:s={x:0,y:0},visible:p=!0,containerStyle:d={},selectedStep:a=0,customStepTypes:C,appearance:c,dismissible:g=!1,showHighlightOnly:S,showStepCount:T=!0,completedStepsCount:k=0,showFrigadeBranding:u=!1})=>{var ie,Ve,$e,ct;let[v,x]=lo(),[F,N]=lo(new Date),h=Wd(null),[m,w]=lo(document.querySelector(e[a].selector)),y=Is(m,F),[E,O]=lo(),[I,$]=lo(!S),L=(Ve=(ie=e[a])==null?void 0:ie.props)!=null&&Ve.position?e[a].props.position:"absolute",H=((ct=($e=e[a])==null?void 0:$e.props)==null?void 0:ct.zIndex)??90,_=(v==null?void 0:v.width)??Os,oe=(v==null?void 0:v.height)??Ls;Ns(()=>{h.current&&x({width:h.current.clientWidth,height:h.current.clientHeight})},[a,F,L]),Mo(()=>{S||$(!0)},[a]);let R=i==="auto"?"right":i,K=Sr(y,R,_,s,L),ee=y.right+_>(window.innerWidth||document.documentElement.clientWidth),le=y.bottom+Ls>(window.innerHeight||document.documentElement.clientHeight);ee&&i==="auto"&&(K=Sr(y,"left",_,s,L),R="left");let X=window.location.pathname.split("/").pop(),G=()=>{let W=document.querySelector(e[a].selector);if(!W){O(void 0),w(null);return}E&&E===JSON.stringify(W==null?void 0:W.getBoundingClientRect())||(w(W),N(new Date),W&&O(JSON.stringify(W.getBoundingClientRect())))};if(Mo(()=>{let W=new MutationObserver(G);return W.observe(document.body,{subtree:!0,childList:!0}),()=>W.disconnect()},[G]),Mo(()=>{let W=new MutationObserver(G);return W.observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["style","class"]}),()=>W.disconnect()},[G]),Mo(()=>{let W=setInterval(()=>{G()},10);return()=>clearInterval(W)},[G]),Ns(()=>{setTimeout(()=>{G()},Hd),G()},[a,X]),m===null)return M.createElement(M.Fragment,null);if(K.x==0&&K.y==0)return M.createElement(M.Fragment,null);if(!p)return M.createElement(M.Fragment,null);let xe=()=>{let W=()=>{if(e[a].handlePrimaryButtonClick&&(e[a].handlePrimaryButtonClick(),$(!1),setTimeout(()=>{G()},30)),k===e.length-1)return o()},ve=()=>{e[a].handleSecondaryButtonClick&&(e[a].handleSecondaryButtonClick(),S&&!e[a].secondaryButtonUri&&$(!1))};return M.createElement(M.Fragment,null,T&&e.length>1&&M.createElement(_r,null,M.createElement(Hr,{className:l("tooltipStepCounter",c)},a+1," of ",e.length)),M.createElement(Wr,{showStepCount:T,className:l("tooltipCTAContainer",c)},e[a].secondaryButtonTitle&&M.createElement(ne,{title:e[a].secondaryButtonTitle,appearance:c,onClick:ve,size:"small",withMargin:!1,secondary:!0}),e[a].primaryButtonTitle&&M.createElement(ne,{title:e[a].primaryButtonTitle,appearance:c,onClick:W,withMargin:!1,size:"small"})))},Te=()=>M.createElement(M.Fragment,null,g&&M.createElement($r,{"data-testid":"tooltip-dismiss",onClick:()=>{t&&t()},className:l("tooltipClose",c)},M.createElement(ke,null)),e[a].imageUri&&M.createElement(Mr,{dismissible:g,appearance:c,src:e[a].imageUri,className:l("tooltipImageContainer",c)}),e[a].videoUri&&!e[a].imageUri&&M.createElement(Ur,{dismissible:g,appearance:c,className:l("tooltipVideoContainer",c)},M.createElement(nt,{appearance:c,videoUri:e[a].videoUri})),M.createElement(ye,{appearance:c,title:e[a].title,subtitle:e[a].subtitle,size:"small"}),M.createElement(zr,{className:l("tooltipFooter",c)},M.createElement(xe,null))),ce={...{default:W=>{var ve;if((ve=e[a])!=null&&ve.StepContent){let Me=e[a].StepContent;return M.createElement("div",null,Me)}return M.createElement(Te,null)}},...C},z=()=>{var W;return e?!((W=e[a])!=null&&W.type)||!ce[e[a].type]?ce.default(e[a]):ce[e[a].type]({stepData:e[a],primaryColor:n}):M.createElement(M.Fragment,null)};if(S&&e[a].complete===!0)return null;let D={top:(K==null?void 0:K.y)-_t,left:(R=="left"?y.x+s.x:(K==null?void 0:K.x)-_t)??0,cursor:S?"pointer":"default",position:L},re=()=>{let ve=D.left+(R=="left"?-_:24);return Math.min(Math.max(ve,20),window.innerWidth-_-20)},V=()=>{S&&(N(new Date),$(!I))};return M.createElement(Gd,null,M.createElement(qd,{style:D,zIndex:H,className:l("tourHighlightContainer",c)},r&&e[a].showHighlight!==!1&&M.createElement(M.Fragment,null,M.createElement(jd,{style:{position:L},onClick:V,primaryColor:c.theme.colorPrimary,className:l("tourHighlightInnerCircle",c)}),M.createElement(Vd,{style:{position:"absolute"},onClick:V,primaryColor:c.theme.colorPrimary,className:l("tourHighlightOuterCircle",c)}))),M.createElement(Ds,{style:{...D,left:re()},zIndex:H+1,className:l("tooltipContainerWrapper",c)},I&&M.createElement(M.Fragment,null,M.createElement(mo,{ref:h,layoutId:"tooltip-container",style:{position:"relative",width:"max-content",right:0,top:12,...d},appearance:c,className:l("tooltipContainer",c),maxWidth:Os,zIndex:H+10},M.createElement(z,null)),u&&M.createElement(jr,{className:l("poweredByFrigadeTooltipRibbon",c),appearance:c,zIndex:H+10},M.createElement(uo,{appearance:c})))))},Uo=Kd;import{Portal as Jd}from"react-portal";var Qd=({flowId:e,customVariables:t,appearance:o,onStepCompletion:i,onButtonClick:r,showTooltipsSimultaneously:n=!1,onDismiss:s,dismissible:p,tooltipPosition:d="auto",showHighlightOnly:a=!1,dismissBehavior:C="complete-flow",onComplete:c,skipIfNotFound:g=!1,...S})=>{let{getFlow:T,getFlowSteps:k,isLoading:u,targetingLogicShouldHideFlow:v,markStepCompleted:x,markStepStarted:F,markFlowCompleted:N,updateCustomVariables:h,getCurrentStepIndex:m,getStepStatus:w,isStepBlocked:y,getFlowStatus:E,getNumberOfStepsCompleted:O}=Z(),{isLoadingUserFlowStateData:I}=Ee(),{primaryCTAClickSideEffects:$,secondaryCTAClickSideEffects:L}=pe(),{hasOpenModals:H}=Fe(),_=m(e),{openFlowStates:oe}=Yd(j),{mergeAppearanceWithDefault:R}=te();if(o=R(o),Xd(()=>{h(t)},[t,u]),I)return null;let K=T(e);if(!K||v(K)||E(e)==Q||H())return null;let ee=k(e);if(Object.keys(oe).length>0){let z=Object.keys(oe).find(D=>oe[D]===!0);if(z!==void 0&&z!==e)return Wt.createElement(Wt.Fragment,null)}async function le(z){if(await x(e,z.id),ee.map(D=>w(e,D.id)).every(D=>D===Oe)){await N(e);return}if(!a&&_+1<ee.length){if(y(e,ee[_+1].id))return;await F(e,ee[_+1].id)}}function X(z,D,re){let V=_+1<ee.length?ee[_+1]:null;r&&r(z,_,D,V),i&&i(z,re,V)}function G(){return ee.map(z=>({...z,handleSecondaryButtonClick:async()=>{L(z),z.skippable===!0&&await x(e,z.id,{skipped:!0}),X(z,"secondary",_)},handlePrimaryButtonClick:async()=>{(!z.completionCriteria&&(z.autoMarkCompleted||z.autoMarkCompleted===void 0)||z.completionCriteria&&z.autoMarkCompleted===!0)&&await le(z),X(z,"primary",_),$(z)}}))}async function xe(z){s&&s(),C==="complete-flow"?await N(e):await x(e,z.id)}function Te(){c&&c()}let q=!document.querySelector(ee[_].selector);function ce(){let z=ee.findIndex(D=>!!document.querySelector(D.selector));return ee.map((D,re)=>q&&!n&&re!==z&&g?null:Wt.createElement(Uo,{key:D.id,appearance:o,steps:G(),selectedStep:re,showTooltipsSimultaneously:n,dismissible:p,onDismiss:()=>xe(D),tooltipPosition:d,showHighlightOnly:a,completedStepsCount:O(e),onComplete:Te,...S}))}return Wt.createElement(Jd,null,Wt.createElement(se,{appearance:o}),n||q&&g?ce():Wt.createElement(Uo,{appearance:o,steps:G(),selectedStep:_,showTooltipsSimultaneously:n,dismissible:p,onDismiss:()=>xe(ee[_]),tooltipPosition:d,completedStepsCount:O(e),showHighlightOnly:a,onComplete:Te,...S}))};import be,{useEffect as Zd,useRef as Rd,useState as ec}from"react";import{Portal as tc}from"react-portal";import Tt from"styled-components";var $s=Tt.button`
  ${e=>P(e)} {
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
`,Ms=Tt.span`
  ${e=>P(e)} {
    font-size: 12px;
    display: inline-block;
  }
`,Us=Tt.span`
  ${e=>P(e)} {
    font-size: 12px;
    display: inline-block;
  }
`,zs=Tt.div`
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 50;
`,_s=Tt.button`
  ${e=>P(e)} {
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
`,Ws=Tt.div`
  ${e=>P(e)} {
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
`,Hs=Tt.button`
  ${e=>P(e)} {
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
`;import{AnimatePresence as Ks,motion as Ys}from"framer-motion";import Vs from"react";var js=({style:e,className:t})=>Vs.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"18",height:"18",fill:"none",viewBox:"0 0 18 18",style:e,className:t},Vs.createElement("path",{fill:"currentColor",d:"M13.43 4.938a4.494 4.494 0 00-1.043-1.435A4.955 4.955 0 009 2.197c-1.276 0-2.48.464-3.387 1.305A4.502 4.502 0 004.57 4.938a4.242 4.242 0 00-.386 1.773v.475c0 .109.087.197.196.197h.95a.197.197 0 00.197-.197V6.71c0-1.749 1.557-3.17 3.473-3.17s3.473 1.421 3.473 3.17c0 .718-.254 1.393-.738 1.955a3.537 3.537 0 01-1.9 1.125 1.928 1.928 0 00-1.085.682c-.271.343-.42.768-.42 1.206v.552c0 .109.088.197.197.197h.95a.197.197 0 00.196-.197v-.552c0-.276.192-.519.457-.578a4.904 4.904 0 002.625-1.56c.335-.392.597-.828.778-1.3a4.256 4.256 0 00-.103-3.303zM9 13.834a.985.985 0 10.001 1.97.985.985 0 00-.001-1.97z"}));import Gs from"react";var qs=({style:e,className:t})=>Gs.createElement("svg",{style:e,className:t,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"currentColor"},Gs.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"}));var oc=({flowId:e,style:t,onStepCompletion:o,visible:i=!0,type:r="inline",title:n="Help",appearance:s})=>{let{getFlow:p,getFlowSteps:d,markStepCompleted:a,getStepStatus:C,getNumberOfStepsCompleted:c,isLoading:g,targetingLogicShouldHideFlow:S}=Z(),{primaryCTAClickSideEffects:T}=pe(),k=Rd(null),[u,v]=ec(!1),{mergeAppearanceWithDefault:x}=te();s=x(s),Zd(()=>(document.addEventListener("click",F,!1),()=>{document.removeEventListener("click",F,!1)}),[]);let F=y=>{k.current&&!k.current.contains(y.target)&&v(!1)};if(g)return null;let N=p(e);if(!N||S(N))return null;let h=d(e);if(!h||!i)return null;function m(y,E){!y.completionCriteria&&(y.autoMarkCompleted||y.autoMarkCompleted===void 0)&&a(e,y.id),T(y),o&&o(y,E),v(!1)}function w(){return u&&be.createElement(Ws,{className:l("floatingWidgetMenu",s),as:Ys.div,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.1},type:r},h.map((y,E)=>be.createElement(Hs,{className:l("floatingWidgetMenuItem",s),key:E,onClick:()=>m(y,E)},y.title)))}return r=="inline"?be.createElement("span",{ref:k},be.createElement($s,{style:t,onClick:()=>{v(!u)},className:l("supportButton",s)},be.createElement(Us,{className:l("supportIconContainer",s)},be.createElement(qs,{className:l("supportIcon",s),style:{width:"18px",height:"18px"}})),be.createElement(Ms,{className:l("supportButtonTitle",s)},n)),be.createElement(Ks,null,be.createElement(w,null))):be.createElement(tc,null,be.createElement(zs,{style:t,ref:k},be.createElement(Ks,null,be.createElement(w,null)),be.createElement(_s,{onClick:()=>{v(!u)},as:Ys.button,whileHover:{scale:1.1},className:l("floatingWidgetButton",s)},be.createElement(js,{className:l("floatingWidgetButtonIcon",s),style:{display:"flex",width:"20px",height:"20px"}}))))};import He,{useEffect as rc}from"react";import zo from"styled-components";var Xs=zo.div`
  ${e=>P(e)} {
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
`,Js=zo.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`,Qs=zo.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
`,Zs=zo.div`
  ${e=>P(e)} {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`;var ic=({flowId:e,onDismiss:t,customVariables:o,onButtonClick:i,appearance:r,className:n,style:s,dismissible:p})=>{let{getFlow:d,markFlowCompleted:a,markStepCompleted:C,isLoading:c,targetingLogicShouldHideFlow:g,updateCustomVariables:S,getFlowSteps:T,getFlowStatus:k,getCurrentStepIndex:u}=Z(),{primaryCTAClickSideEffects:v}=pe(),{mergeAppearanceWithDefault:x}=te();if(r=x(r),rc(()=>{S(o)},[o,c]),c)return null;let F=d(e);if(!F||g(F)||k(e)===Q)return null;let h=T(e)[u(e)];return He.createElement(He.Fragment,null,He.createElement(se,{appearance:r}),He.createElement(Xs,{appearance:r,className:Ce(l("embeddedTipContainer",r),n),style:s},(p===!0||h.dismissible)&&He.createElement(Zs,{onClick:async()=>{await a(e),t&&t()},className:l("embeddedTipDismissButton",r)},He.createElement(ke,null)),He.createElement(Js,null,He.createElement(ye,{size:"small",appearance:r,title:h.title,subtitle:h.subtitle})),h.primaryButtonTitle&&He.createElement(Qs,{className:l("embeddedTipCallToActionContainer",r)},He.createElement(ne,{classPrefix:"embeddedTip",title:h.primaryButtonTitle,appearance:r,withMargin:!1,size:"small",type:"inline",onClick:async()=>{h.handlePrimaryButtonClick(),v(h),!(i&&i(h,u(e),"primary")===!1)&&(await C(e,h.id),await a(e))}}))))};import he,{useEffect as nc}from"react";import Ht from"styled-components";var Rs=Ht.div`
  // use the :not annotation
  ${e=>P(e)} {
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
`,el=Ht.div`
  ${e=>P(e)} {
    display: flex;
    width: 36px;
    height: 36px;
  }
`,tl=Ht.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
  margin-top: ${e=>e.type==="square"?"12px":"0"};
`,ol=Ht.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
`,br=Ht.div`
  display: flex;
  justify-content: ${e=>e.type==="square"?"flex-end":"center"};
  align-items: flex-end;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`,wr=Ht.div`
  display: flex;
  justify-content: ${e=>e.type==="square"?"flex-end":"center"};
  align-items: flex-end;
  margin-left: ${e=>e.type==="square"?"0px":"16px"};
`;import rl from"react";var il=({style:e,className:t})=>rl.createElement("svg",{style:e,className:t,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor"},rl.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"}));var sc=({flowId:e,title:t,subtitle:o,onDismiss:i,customVariables:r,onButtonClick:n,appearance:s,type:p="full-width",icon:d})=>{let{getFlow:a,markFlowCompleted:C,isLoading:c,targetingLogicShouldHideFlow:g,updateCustomVariables:S,getFlowMetadata:T,getFlowStatus:k,getFlowSteps:u,getCurrentStepIndex:v}=Z(),{primaryCTAClickSideEffects:x}=pe(),{mergeAppearanceWithDefault:F}=te();if(s=F(s),nc(()=>{S(r)},[r,c]),c)return null;let N=a(e);if(!N||g(N)||k(e)===Q)return null;let h=u(e),m=h.length>0?h[v(e)]:T(e);return m!=null&&m.title&&(t=m.title),m!=null&&m.subtitle&&(o=m.subtitle),he.createElement(he.Fragment,null,he.createElement(se,{appearance:s}),he.createElement(Rs,{type:p,appearance:s,className:l("bannerContainer",s)},p!="square"&&he.createElement(el,{className:l("bannerIconContainer",s)},d||he.createElement(il,null)),p==="square"&&m.dismissible&&he.createElement(wr,{type:p,className:l("bannerDismissButtonContainer",s)},he.createElement(br,{type:p,onClick:async()=>{await C(e),i&&i()},className:l("bannerDismissButton",s)},he.createElement(ke,null))),he.createElement(tl,{type:p},he.createElement(ye,{appearance:s,title:t,subtitle:o,classPrefix:"banner"})),he.createElement(ol,{type:p,className:l("bannerCallToActionContainer",s)},he.createElement(ne,{title:(m==null?void 0:m.primaryButtonTitle)??"Get started",appearance:s,onClick:()=>{x(m),n&&n(m,0,"primary")},classPrefix:"banner"})),p!=="square"&&m.dismissible&&he.createElement(wr,{type:p,className:l("bannerDismissButtonContainer",s)},he.createElement(br,{type:p,onClick:async()=>{await C(e),i&&i()},className:l("bannerDismissButton",s)},he.createElement(ke,null)))))};import Y,{useEffect as lc}from"react";import{Portal as ac}from"react-portal";import Ze from"styled-components";var nl=Ze.div`
  ${e=>P(e)} {
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
`,sl=Ze.button`
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
`,Tr=Ze.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
`,ll=Ze.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`,Fr=Ze.div`
  font-size: 12px;
  line-height: 16px;
  color: ${e=>e.appearance.theme.colorTextDisabled};
`,kr=Ze.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`,$b=Ze.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
`,al=Ze.textarea`
  ${e=>P(e)} {
    margin-top: 16px;
    border: 1px solid ${e=>e.appearance.theme.colorBorder};
    border-radius: ${e=>e.appearance.theme.borderRadius}px;
    padding: 12px 16px;
    font-size: 16px;
    line-height: 24px;
    width: 100%;
    height: 100px;
  }
`,pl=Ze.div`
  ${e=>P(e)} {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`;var pc=({flowId:e,onDismiss:t,customVariables:o,onButtonClick:i,appearance:r,className:n,style:s,type:p="modal"})=>{let{getFlow:d,markFlowCompleted:a,markStepCompleted:C,getNumberOfStepsCompleted:c,isLoading:g,targetingLogicShouldHideFlow:S,updateCustomVariables:T,getFlowSteps:k,getFlowStatus:u,getCurrentStepIndex:v}=Z(),{primaryCTAClickSideEffects:x}=pe(),{mergeAppearanceWithDefault:F}=te(),[N,h]=Y.useState(null),[m,w]=Y.useState(""),{hasOpenModals:y,setKeepCompletedFlowOpenDuringSession:E,shouldKeepCompletedFlowOpenDuringSession:O}=Fe();if(r=F(r),lc(()=>{T(o)},[o,g]),g)return null;let I=d(e);if(!I||S(I)||u(e)===Q||c(e)===1&&!O(e)||y())return null;let L=k(e)[v(e)];function H(){return Y.createElement(Y.Fragment,null,Y.createElement(kr,null,Y.createElement(ye,{size:"large",appearance:r,title:L.title,subtitle:L.subtitle})),Y.createElement(Tr,{className:l("npsNumberButtonContainer",r),appearance:r},Array.from(Array(10).keys()).map(R=>Y.createElement(sl,{className:l("npsNumberButton",r),selected:N===R+1,key:R,onClick:async()=>{E(e),h(R+1),await C(e,L.id,{score:R+1})},appearance:r},R+1))),Y.createElement(ll,{appearance:r},Y.createElement(Fr,{appearance:r},"Not likely at all"),Y.createElement(Fr,{appearance:r},"Extremely likely")))}function _(){return Y.createElement(Y.Fragment,null,Y.createElement(kr,null,Y.createElement(ye,{appearance:r,title:"Why did you choose this score?",size:"large"})),Y.createElement(al,{appearance:r,value:m,onChange:R=>{w(R.target.value)},placeHolder:"Add your optional fedback here..."}),Y.createElement(Tr,{appearance:r,className:l("npsNumberButtonContainer",r)},Y.createElement(ne,{size:"large",withMargin:!1,onClick:async()=>{await a(e),i&&i(L,1,"primary")},appearance:r,title:L.secondaryButtonTitle||"Skip",secondary:!0}),Y.createElement(ne,{size:"large",withMargin:!1,onClick:async()=>{await C(e,L.id,{feedbackText:m}),await a(e),i&&i(L,1,"primary")},appearance:r,title:L.primaryButtonTitle||"Submit"})))}function oe(){return Y.createElement(Y.Fragment,null,Y.createElement(se,{appearance:r}),Y.createElement(nl,{appearance:r,className:Ce(l("npsSurveyContainer",r),n),style:s,type:p},Y.createElement(pl,{onClick:async()=>{await a(e),t&&t()},className:l("npsSurveyDismissButton",r)},Y.createElement(ke,null)),c(e)==0&&H(),c(e)==1&&_()))}return p==="inline"?oe():Y.createElement(ac,null,oe())};import*as _o from"react";import dl from"react";var cl=({as:e="span",children:t,variant:o="Body1",...i})=>dl.createElement(Hi,{color:"neutral.foreground",fontFamily:"default",forwardedAs:e,variant:o,...i},t),dc=Object.fromEntries(Object.keys(vo).map(e=>{let t=["H1","H2","H3","H4"].includes(e)?e.toLowerCase():void 0,o=i=>dl.createElement(cl,{as:t,...i,variant:e},i.children);return o.displayName=`Text.${e}`,[e,o]})),Pr=Object.assign(cl,dc);var ml=({as:e="button",className:t,size:o="md",title:i,variant:r="Primary",...n})=>{var s;return _o.createElement(Wi,{className:`fr-button-${r.toLowerCase()}${t?` ${t}`:""}`,forwardedAs:e,variant:r,size:o,borderRadius:"md",...n},_o.createElement(Pr,{color:(s=oo[r])==null?void 0:s.color,fontWeight:"semibold"},i))},cc=Object.fromEntries(Object.keys(oo).map(e=>{let t=o=>_o.createElement(ml,{...o,variant:e});return t.displayName=`Button.${e}`,[e,t]})),mc=Object.assign(ml,cc);import{useTheme as N1}from"styled-components";export{to as Box,mc as Button,qe as CheckBox,ot as FormLabel,Qo as FormTextField,sc as FrigadeBanner,yr as FrigadeChecklist,Ge as FrigadeDefaultAppearance,ic as FrigadeEmbeddedTip,Ni as FrigadeForm,$d as FrigadeGuide,Id as FrigadeHeroChecklist,pc as FrigadeNPSSurvey,Ld as FrigadeProgressBadge,Np as FrigadeProvider,oc as FrigadeSupportWidget,Qd as FrigadeTour,Et as ProgressRing,Pr as Text,dr as tokens,Fe as useFlowOpens,Vt as useFlowResponses,Z as useFlows,lr as useOrganization,N1 as useTheme,jt as useUser};
//# sourceMappingURL=index.mjs.map