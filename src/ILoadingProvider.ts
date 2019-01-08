export default interface ILoadingProvider {
	onBegin: () => void,
	onResolve: () => void
}
