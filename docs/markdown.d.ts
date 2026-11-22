// A component's description, imported as text for its docs page, as Fluent
// imports theirs (`import descriptionMd from './ButtonDescription.md'`).
declare module "*.md?raw" {
  const content: string;
  export default content;
}
