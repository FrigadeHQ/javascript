import { Banner, Collection, Text } from "@frigade/react";

export default {
  title: "Components/Collection",
  component: Collection,
};

export const OneCollection = {
  args: {
    collectionId: "collection_zrwaSVhX",
  },
};

export const CollectionAndSharedFlow = {
  args: {
    collectionId: "collection_zrwaSVhX",
  },
  decorators: [
    // @ts-expect-error -- Story ain't got no Storybook types added yet
    (_, { args }) => {
      return (
        <>
          <Text.H4 mt="8">Collection:</Text.H4>
          <Collection {...args} />

          <Text.H4 mt="8">Banner in same Collection:</Text.H4>

          {/* Most important banner */}
          <Banner flowId="flow_gY36aLgO" />

          {/* Least important banner */}
          <Banner flowId="flow_ZZ6Fz6nt" />
        </>
      );
    },
  ],
};

export const CollectionAndTwoSharedFlows = {
  args: {
    collectionId: "collection_rwhODKBk",
  },
  decorators: [
    // @ts-expect-error -- Story ain't got no Storybook types added yet
    (_, { args }) => {
      return (
        <>
          <Text.H4 mt="8">Collection:</Text.H4>
          <Collection {...args} />

          {/* <Text.H4 mt="8">Rule order A:</Text.H4>
          <Banner flowId="flow_EwYzCB3L" /> */}

          <Text.H4 mt="8">Rule order B:</Text.H4>
          <Banner flowId="flow_pOKjjTpK" />

          <Text.H4 mt="8">Rule order C:</Text.H4>
          <Banner flowId="flow_OZnHuyDE" />
        </>
      );
    },
  ],
};

export const CollectionAndOutsideFlow = {
  args: {
    collectionId: "collection_zrwaSVhX",
  },
  decorators: [
    // @ts-expect-error -- Story ain't got no Storybook types added yet
    (_, { args }) => {
      return (
        <>
          <Text.H4 mt="8">Collection:</Text.H4>
          <Collection {...args} />

          <Text.H4 mt="8">Banner NOT in same Collection:</Text.H4>
          <Banner flowId="flow_0jk81qpP" />
        </>
      );
    },
  ],
};

export const TwoCollectionsSeparate = {
  decorators: [
    () => (
      <>
        <Text.H4 mt="8">Rule Order 1:</Text.H4>
        <Collection collectionId="collection_rwhODKBk" />

        <Text.H4 mt="8">Rule Order 4:</Text.H4>
        <Collection collectionId="collection_uBeqsHMM" />
      </>
    ),
  ],
};

export const TwoCollectionsShared = {
  decorators: [
    () => (
      <>
        <Text.H4 mt="8">Rule Order 1:</Text.H4>
        <Collection collectionId="collection_rwhODKBk" />

        <Text.H4 mt="8">Rule Order 2:</Text.H4>
        <Collection collectionId="collection_2x7NBos7" />
      </>
    ),
  ],
};

export const TwoCollectionsSharedDifferentOrder = {
  decorators: [
    () => (
      <>
        <Text.H4 mt="8">Rule Order 1:</Text.H4>
        <Collection collectionId="collection_rwhODKBk" />

        <Text.H4 mt="8">Rule Order 3:</Text.H4>
        <Collection collectionId="collection_oZpFAyyl" />
      </>
    ),
  ],
};

export const MultipleAnnouncements = {
  decorators: [
    () => (
      <>
        {/* Built in Dialogs Collection */}
        <Collection collectionId="collection_49A28miL" />

        {/* Storybook X & Y Announcements */}
        <Collection collectionId="collection_DrlkZoXK" />
      </>
    ),
  ],
};
