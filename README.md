# GraphQL Liftoff

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![travis](https://travis-ci.org/target/graphql-liftoff.svg)](https://travis-ci.org/target/graphql-liftoff)
[![release](http://img.shields.io/github/release/target/graphql-liftoff.svg)](https://github.com/target/graphql-liftoff/releases/latest)
[![watch](https://img.shields.io/github/watchers/target/graphql-liftoff.svg?style=social)](https://github.com/target/graphql-liftoff/watchers)
[![star](https://img.shields.io/github/stars/target/graphql-liftoff.svg?style=social)](https://github.com/target/graphql-liftoff/stargazers)
[![twitter](https://img.shields.io/twitter/url/https/target/graphql-liftoff.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20graphql-liftoff!%20https://github.com/target/graphql-liftoff)

**graphql-liftoff** is a GraphQL schema type generator. It takes in an existing data model and maps it to type definitions by using a domain specific parser. This reduces the amount of work needed to migrate existing REST APIs to GraphQL.

# CLI Demo
#

[demo YAML source](https://github.com/OAI/OpenAPI-Specification/blob/db87315c2074ef69196dc0018335422dbfeb8a73/examples/v2.0/yaml/petstore.yaml)
![graphql-liftoff demo](resources/example.gif)

# Roadmap
- [x] Swagger 2.0 support
- [ ] 100% unit test code coverage
- [ ] CLI integration tests
- [ ] [TypeDoc comments](http://typedoc.org/guides/doccomments/) on all functions
- [ ] Swagger 1.0 support
- [ ] OpenAPI (Swagger 3.0) support
- [ ] RAML 1.0 support
- [ ] [Your idea here!](https://github.com/target/graphql-liftoff/issues/new/)

# Quick start

```sh
# CLI utility
npm install -g git+https://github.com/target/graphql-liftoff.git
yarn global add git+https://github.com/target/graphql-liftoff.git

# npm package
npm install git+https://github.com/target/graphql-liftoff.git
yarn add git+https://github.com/target/graphql-liftoff.git

# development
Fork this repo
git clone https://github.com/YourName/graphql-liftoff.git
cd graphql-liftoff
npm install or yarn

# scripts
build        # run typescript compiler
watch        # watch on file changes - then run typescript compiler
start <args> # run graphql-liftoff CLI locally
             # NOTE: npm strips out flags like -y or --yaml
             # yarn works as intended.
             # you can still manually run the commands:
             # node ./build/bin/cli.js <args>
lint         # run tslint
test         # run jest and generate coverage files
test:watch   # watch on file chages - then run jest
coverage     # open html coverage in browser (MacOS only)
```

# Module Usage
graphql-liftoff exports an `async generateSchema` function, which returns a stringified Graphql Schema

```javascript
await generateSchema('swagger', {'yaml': true, data: './example-swagger.yaml'}).then(schema => {
    console.log(schema)
}).catch(err => {
    console.error(err)
})
```

# Bugs and Feature Requests

Found something that doesn't seem right or have a feature request? First, checkout our [contribution guidelines](CONTRIBUTING.md), then [open a new issue](https://github.com/target/graphql-liftoff/issues/new/).

# Contributors

A huge shoutout to all contributors and supporters of this project. THANK YOU!

<a href="https://github.com/StephenRadachy/" target="_blank">
  <img src="https://github.com/StephenRadachy.png?size=64" width="64" height="64" alt="StephenRadachy">
</a>
<a href="https://github.com/Piefayth/" target="_blank">
  <img src="https://github.com/Piefayth.png?size=64" width="64" height="64" alt="Piefayth">
</a>
<a href="https://github.com/timrs2998/" target="_blank">
  <img src="https://github.com/timrs2998.png?size=64" width="64" height="64" alt="timrs2998">
</a>

# Copyright and License
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

Copyright (c) 2017 Target Brands, Inc.
