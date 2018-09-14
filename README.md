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

`yarn add git+ssh://git@github.com:squadlocker/sqd-fetch.git` should do the trick. You'll need
to have `ssh-agent` running and caching your private key password for this to work.

#### A note to Windows users

You'll run into some trouble installing this, as well as running `yarn install` in
any package that requires it, through PowerShell. The problem is 
that this is a private repo, and so you'll need your GitHub ssh key to access.
However, Yarn and NPM won't interrupt their process to ask you for your id_rsa password 
-- meaning,that you need to have your ssh-agent running and authenticated in the background. 
This is easy to do on Git Bash, but then, if you run Yarn on git bash, you'll likely run into 
compatibility issues with some of our NPM packages :)

I found the best answer 
[here](https://stackoverflow.com/a/4356869/2898801) -- see the third solution. 
Just run `start-ssh-agent` from your command prompt. It'll ask you for your ssh key password. 
*But of course it's not that simple*, because that command takes you out of Powershell and into
CMD. Enter `powershell` to get back to the good stuff. Your ssh-agent will still be running.