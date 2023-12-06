				import worker, * as OTHER_EXPORTS from "D:\\Mestrado\\23_24\\New folder\\TP3\\worker-cors\\index.js";
				import * as __MIDDLEWARE_0__ from "D:\\Mestrado\\23_24\\New folder\\TP3\\worker-cors\\node_modules\\wrangler\\templates\\middleware\\middleware-miniflare3-json-error.ts";
				const envWrappers = [__MIDDLEWARE_0__.wrap].filter(Boolean);
				const facade = {
					...worker,
					envWrappers,
					middleware: [
						__MIDDLEWARE_0__.default,
            ...(worker.middleware ? worker.middleware : []),
					].filter(Boolean)
				}
				export * from "D:\\Mestrado\\23_24\\New folder\\TP3\\worker-cors\\index.js";

				const maskDurableObjectDefinition = (cls) =>
					class extends cls {
						constructor(state, env) {
							let wrappedEnv = env
							for (const wrapFn of envWrappers) {
								wrappedEnv = wrapFn(wrappedEnv)
							}
							super(state, wrappedEnv);
						}
					};
				

				export default facade;