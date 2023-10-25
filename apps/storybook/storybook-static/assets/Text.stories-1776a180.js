import{q as n,j as o,c as x}from"./index-1632965f.js";import"./index-e67e0a49.js";import"./_commonjsHelpers-de833af9.js";import"./extends-98964cd2.js";const f={title:"Components/Text",component:n},e={args:{children:"This is <Text>. It will render the <Text.Body1> variant by default."}},t={decorators:[()=>o.jsx(x,{style:{display:"flex",flexDirection:"column",gap:"12px"},children:Object.keys(n).map(r=>{const m=n[r];return o.jsx(m,{children:`Text.${r}`},r)})})]};var s,a,i;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    children: "This is <Text>. It will render the <Text.Body1> variant by default."
  }
}`,...(i=(a=e.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};var c,p,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  decorators: [() => <Box style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
        {Object.keys(Text).map(variant => {
      const Component = Text[variant];
      return <Component key={variant}>{\`Text.\${variant}\`}</Component>;
    })}
      </Box>]
}`,...(l=(p=t.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};const h=["Default","Variants"];export{e as Default,t as Variants,h as __namedExportsOrder,f as default};
//# sourceMappingURL=Text.stories-1776a180.js.map
