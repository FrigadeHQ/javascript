# Frigade ~Storybook~ Smithy

<img align="right" src="https://github.com/FrigadeHQ/javascript/assets/28678/81734a7e-d5b2-4e66-a627-fcf96a9c0d5c" height="300" style="display: block; margin: 0 auto" />

## Viewing stories

Run the following commands from the `javascript/` root directory, because monorepo:
1. `yarn`
1. `yarn dev`
1. Storybook will be running in dev mode on [localhost:6006](http://localhost:6006/)

## Working on SDK components and/or adding new stories

For a component named `YourComponent` in the `reactv2` package:

1. Create `src/stories/YourComponent/YourComponent.stories.tsx`.
1. Copy the story config from any other `.stories` file in the repo, they're all pretty standard.
1. Any changes you make to the component in `reactv2` will hot-reload into Storybook.
1. When we have more standards around how to test components, how stories should be structured, and how much documentation should be included, we'll add that here and it'll be great.
