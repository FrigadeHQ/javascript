import{_ as i,j as t,c as n}from"./index-11b1259d.js";import"./index-e67e0a49.js";import"./_commonjsHelpers-de833af9.js";import"./extends-98964cd2.js";const d={title:"Components/Tooltip",component:i,argTypes:{align:{type:"select",options:["before","start","center","end","after"]},alignOffset:{type:"number",default:0},side:{type:"select",options:["top","right","bottom","left"]},sideOffset:{type:"number",default:0}}},e={args:{align:"after",alignOffset:0,side:"bottom",sideOffset:0,spotlight:!1},decorators:[(l,a)=>t.jsxs(n,{style:{alignItems:"center",display:"flex",flexDirection:"column",justifyContent:"center",height:"100vh"},children:[t.jsx(n,{p:4,style:{background:"pink",width:"20vw"},children:"Not the anchor"}),t.jsx(n,{id:"tooltip-anchor",p:4,style:{background:"#f0f0f0",width:"20vw"},children:"Anchor here"}),t.jsx(n,{p:4,style:{background:"fuchsia",width:"20vw"},children:"Also not the anchor"}),t.jsx(i,{anchor:"#tooltip-anchor",...a.args})]})]};var o,s,r;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    align: "after",
    alignOffset: 0,
    side: "bottom",
    sideOffset: 0,
    spotlight: false
  },
  decorators: [(_: StoryFn, options: StoryContext) => <Box style={{
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100vh"
  }}>
        <Box p={4} style={{
      background: "pink",
      width: "20vw"
    }}>
          Not the anchor
        </Box>
        <Box id="tooltip-anchor" p={4} style={{
      background: "#f0f0f0",
      width: "20vw"
    }}>
          Anchor here
        </Box>
        <Box p={4} style={{
      background: "fuchsia",
      width: "20vw"
    }}>
          Also not the anchor
        </Box>

        <Tooltip anchor="#tooltip-anchor" {...options.args} />
      </Box>]
}`,...(r=(s=e.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,d as default};
//# sourceMappingURL=Tooltip.stories-a2271e96.js.map
