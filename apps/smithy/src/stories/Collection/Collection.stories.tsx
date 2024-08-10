import { Banner, Collection, Text, useUser } from "@frigade/react";

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

          <Text.H4 mt="8">Most important banner:</Text.H4>
          {/* Most important banner */}
          <Banner flowId="flow_gY36aLgO" />

          <Text.H4 mt="8">Least important banner:</Text.H4>
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

export const SameCollectionTwice = {
  decorators: [
    () => (
      <>
        <Text.H4 mt="8">Rule Order 1:</Text.H4>
        <Collection collectionId="collection_rwhODKBk" />

        <Text.H4 mt="8">Rule Order 1:</Text.H4>
        <Collection collectionId="collection_rwhODKBk" />
      </>
    ),
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

export const TwoCollectionsSharedWithATC = {
  decorators: [
    () => (
      <>
        <Text.H4 mt="8">Rule Order 1:</Text.H4>
        <Collection collectionId="collection_rwhODKBk" />

        <Text.H4 mt="8">Rule Order 2:</Text.H4>
        <Collection collectionId="collection_2x7NBos7" />

        <Text.H4>
          Not visible: "Outside Cool-offs" Collection running ATC for prev 2
          Collections
        </Text.H4>
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

export const FlowVisibilityChange = {
  decorators: [
    () => {
      const { addProperties } = useUser();

      function handleClick() {
        addProperties({
          testProperty: "bananas",
        });
      }
      return (
        <>
          <button onClick={handleClick}>Add testProperty</button>
          <Text.H4 mt="8">Rule Order 1 Collection:</Text.H4>
          <Collection collectionId="collection_rwhODKBk" />

          <Text.H4 mt="8">Rule order - A Flow:</Text.H4>
          <Banner flowId="flow_EwYzCB3L" />
        </>
      );
    },
  ],
};
