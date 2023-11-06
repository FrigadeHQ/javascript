import{Q as n,j as r,c as u}from"./index-11b1259d.js";import"./index-e67e0a49.js";import"./_commonjsHelpers-de833af9.js";import"./extends-98964cd2.js";const y={title:"Components/Button",component:n},t={args:{title:"Hello button"}},e={decorators:[()=>r.jsx(u,{style:{display:"inline-flex",flexDirection:"column",gap:"12px"},children:Object.keys(n).map(o=>{const m=n[o];return r.jsx(m,{title:`Button.${o}`},o)})})]};var s,a,i;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    title: "Hello button"
  }
}`,...(i=(a=t.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};var c,p,l;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  decorators: [() => <Box style={{
    display: "inline-flex",
    flexDirection: "column",
    gap: "12px"
  }}>
        {Object.keys(Button).map(variant => {
      const Component = Button[variant];
      return <Component key={variant} title={\`Button.\${variant}\`} />;
    })}
      </Box>]
}`,...(l=(p=e.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};const g=["Default","Variants"];export{t as Default,e as Variants,g as __namedExportsOrder,y as default};
//# sourceMappingURL=Button.stories-578bf958.js.map
