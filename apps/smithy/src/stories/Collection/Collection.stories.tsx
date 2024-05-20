import { Banner, Collection, Text } from "@frigade/react";

export default {
  title: "Components/Collection",
  component: Collection,
};

export const Default = {
  args: {
    collectionId: "collection_zrwaSVhX",
  },
};

export const MultipleComponents = {
  args: {
    collectionId: "collection_zrwaSVhX",
    css: {
      ".fr-banner[data-id='flow_ZZ6Fz6nt']": {
        backgroundColor: "turquoise",
      },
    },
  },
  decorators: [
    (_, { args }) => {
      return (
        <>
          <Text.H4 mt="8">Collection:</Text.H4>
          <Collection {...args} />

          {/* <Text.H4 mt="8">Banner in same Collection:</Text.H4>
          <Banner flowId="flow_gY36aLgO" /> */}

          <Text.H4 mt="8">Banner NOT in same Collection:</Text.H4>
          <Banner flowId="flow_0jk81qpP" />

          {/* <Text.H4 mt="8">Duplicate Banner NOT in same Collection:</Text.H4>
          <Banner flowId="flow_0jk81qpP" /> */}
        </>
      );
    },
  ],
};
