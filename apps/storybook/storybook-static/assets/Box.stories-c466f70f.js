import{c as u,j as e,q as n,t as x,Q as g}from"./index-1632965f.js";import"./index-e67e0a49.js";import"./_commonjsHelpers-de833af9.js";import"./extends-98964cd2.js";const b={title:"Components/Box",component:u},r={args:{children:e.jsx(n,{children:"This is a Box. It accepts all of our Sprinkles props:"})}},o={args:{as:"ul",children:e.jsxs(e.Fragment,{children:[e.jsx(n,{as:"li",children:"Box accepts an `as` prop, which will render the Box as the provided component (or HTML element)."}),e.jsx(n,{as:"li",children:"This Box is actually a UL, and the Text nodes inside it are LIs!"})]})}},s={decorators:[()=>e.jsxs(e.Fragment,{children:["Messing around with this dang box while we work:",e.jsx(u,{color:"blue500",className:"testing",style:{color:"green"},children:"Box will prioritize styles from the `className` prop over its own internal styles."}),e.jsx(x,{theme:{colors:{blue500:"yellow",primary:{background:"teal"},neutral:{background:"orange"}}},children:e.jsx(g,{title:"hello"})})]})]};var t,a,l;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    children: <Text>This is a Box. It accepts all of our Sprinkles props:</Text>
  }
}`,...(l=(a=r.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};var i,c,d;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    as: "ul",
    children: <>
        <Text as="li">
          Box accepts an \`as\` prop, which will render the Box as the provided
          component (or HTML element).
        </Text>
        <Text as="li">
          This Box is actually a UL, and the Text nodes inside it are LIs!
        </Text>
      </>
  }
}`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,m,h;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  decorators: [() => {
    return <>
          Messing around with this dang box while we work:
          <Box color="blue500" className="testing" style={{
        color: "green"
      }}>
            Box will prioritize styles from the \`className\` prop over its own
            internal styles.
          </Box>
          <Provider theme={{
        colors: {
          blue500: "yellow",
          primary: {
            background: "teal"
          },
          neutral: {
            background: "orange"
          }
        }
      }}>
            <Button title="hello" />
          </Provider>
        </>;
  }]
}`,...(h=(m=s.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};const j=["Default","Polymorphism","TEMP_Playground"];export{r as Default,o as Polymorphism,s as TEMP_Playground,j as __namedExportsOrder,b as default};
//# sourceMappingURL=Box.stories-c466f70f.js.map
