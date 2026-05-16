/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "masonry-layout" {
	export default class Masonry {
		constructor(element: Element, options?: Record<string, unknown>);
		layout(): void;
		destroy(): void;
		reloadItems(): void;
	}
}
