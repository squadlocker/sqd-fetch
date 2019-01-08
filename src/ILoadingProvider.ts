export default interface ILoadingProvider {
	onBegin: <T>() => T,
	onResolve: <T>() => T
}
