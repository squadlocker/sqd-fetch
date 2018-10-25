# SQD-FETCH

A small front-end library for minimal, clean API calls. 

It offers:
- Full async/await support
- TypeScript type definitions
- Internal, customizable authentication handling
- An interface for error handling
- Public methods for each commonly-used HTTP method
 
All public methods of the main Api class accept the same type of `options` object 
(`RequestInit` in TypeScript) as native fetch.

Each instance of the Api class has an `apiRoot` public member, which gets set during
instantiation. This way, you can have one main object handle calls to each API,
without having to manually set the full URL for each request.

TODO: Write better documentation

### Installation

You'll want to add this repo to your yarn dependencies. 

`yarn add git+ssh://git@github.com:squadlocker/sqd-fetch.git`