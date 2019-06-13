export default interface ISqdProvider {
  onBegin: (options) => { return (options) },
  onResolve: (options, response) => { return (options, response) },
  onFail: (options, response, error) => { return (options, response, error) }
}
