import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, h, resolveComponent, computed, hasInjectionContext, inject, getCurrentInstance, createElementBlock, provide, cloneVNode, defineAsyncComponent, useSSRContext, markRaw, mergeModels, ref, createRenderer, reactive, toRefs, openBlock, unref, renderSlot, createElementVNode, watch, watchEffect, createBlock, useSlots, useAttrs, isRef, createVNode, render, createCommentVNode, createApp, onServerPrefetch, useModel, mergeProps, withCtx, createTextVNode, toDisplayString, resolveDynamicComponent, toRef, Fragment, renderList, useId, Transition, withModifiers, withKeys, onErrorCaptured, shallowReactive, effectScope, isReadonly, isShallow, isReactive, toRaw, toValue, toHandlers, getCurrentScope, nextTick, onScopeDispose } from 'vue';
import { a as serialize, p as parseQuery, h as hasProtocol, j as joinURL, w as withQuery, b as withTrailingSlash, e as withoutTrailingSlash, i as isScriptProtocol, f as sanitizeStatusCode, k as getContext, $ as $fetch$1, l as baseURL, m as defuFn, n as klona, o as defu, q as createHooks, c as createError$1, r as isEqual, t as isEqual$1, u as stringifyParsedURL, v as stringifyQuery, x as toRouteMatcher, y as createRouter } from '../_/nitro.mjs';
import { defineStore, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import colors from 'tailwindcss/colors';
import { Icon, _api, addAPIProvider, setCustomIconsLoader, getIcon, loadIcon as loadIcon$1 } from '@iconify/vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderList, ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrRenderSuspense } from 'vue/server-renderer';
import { Primitive, Slot, useForwardProps, ToastProvider, ToastPortal, ToastViewport, ConfigProvider, TooltipProvider, useForwardPropsEmits, NumberFieldRoot, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement, SwitchRoot, SwitchThumb, Label, ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, VisuallyHidden, ProgressRoot, ProgressIndicator, SliderRoot, SliderTrack, SliderRange, SliderThumb, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow } from 'reka-ui';
import { createEventHook, useRafFn, reactiveOmit, reactivePick, useVModel, createSharedComposable, useDebounceFn, watchPausable, watchThrottled, useElementBounding, useEventListener } from '@vueuse/core';
import { createTV } from 'tailwind-variants';
import { getIconCSS } from '@iconify/utils/lib/css/icon';
import { DrawerRootNested, DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerHandle, DrawerTitle, DrawerDescription } from 'vaul-vue';
import { HoverCard, Popover } from 'reka-ui/namespaced';
import * as THREE from 'three';
import { AudioListener, Clock, REVISION, PropertyBinding, InterpolateLinear, Color, Triangle, Vector3, Euler, Ray, Plane, Quaternion, Matrix4, Audio, AudioLoader, BufferGeometry, InterleavedBuffer, InterleavedBufferAttribute, MathUtils, Box3, Vector2, UniformsLib, UniformsUtils, ShaderLib, Vector4, Line3, Sphere, DoubleSide, PlaneGeometry, ShaderMaterial, BufferAttribute, Mesh, PerspectiveCamera, WebGLRenderTarget, HalfFloatType, MeshBasicMaterial, FramebufferTexture, RawShaderMaterial, AdditiveBlending, Box2, UnsignedByteType, BackSide, BoxGeometry, OrthographicCamera, IcosahedronGeometry, Points, SRGBColorSpace, CompressedTexture, Texture, RGBAFormat, InterpolateDiscrete, Scene, TOUCH, Uniform, WebGLRenderer, EventDispatcher, MOUSE, Spherical, NearestFilter, NearestMipmapNearestFilter, NearestMipmapLinearFilter, LinearFilter, LinearMipmapNearestFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping, RepeatWrapping, MirroredRepeatWrapping, ShapePath } from 'three';
import { isClient } from '@vueuse/shared';
import { ColorTranslator } from 'colortranslator';
import { BlendFunction, VignetteTechnique, EffectPass, VignetteEffect, NoiseEffect, EffectComposer, BloomEffect, RenderPass, NormalPass, DepthDownsamplingPass } from 'postprocessing';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

function diff(obj1, obj2) {
  const h1 = _toHashedObject(obj1);
  const h2 = _toHashedObject(obj2);
  return _diff(h1, h2);
}
function _diff(h1, h2) {
  const diffs = [];
  const allProps = /* @__PURE__ */ new Set([
    ...Object.keys(h1.props || {}),
    ...Object.keys(h2.props || {})
  ]);
  if (h1.props && h2.props) {
    for (const prop of allProps) {
      const p1 = h1.props[prop];
      const p2 = h2.props[prop];
      if (p1 && p2) {
        diffs.push(..._diff(h1.props?.[prop], h2.props?.[prop]));
      } else if (p1 || p2) {
        diffs.push(
          new DiffEntry((p2 || p1).key, p1 ? "removed" : "added", p2, p1)
        );
      }
    }
  }
  if (allProps.size === 0 && h1.hash !== h2.hash) {
    diffs.push(new DiffEntry((h2 || h1).key, "changed", h2, h1));
  }
  return diffs;
}
function _toHashedObject(obj, key = "") {
  if (obj && typeof obj !== "object") {
    return new DiffHashedObject(key, obj, serialize(obj));
  }
  const props = {};
  const hashes = [];
  for (const _key in obj) {
    props[_key] = _toHashedObject(obj[_key], key ? `${key}.${_key}` : _key);
    hashes.push(props[_key].hash);
  }
  return new DiffHashedObject(key, obj, `{${hashes.join(":")}}`, props);
}
class DiffEntry {
  constructor(key, type, newValue, oldValue) {
    this.key = key;
    this.type = type;
    this.newValue = newValue;
    this.oldValue = oldValue;
  }
  toString() {
    return this.toJSON();
  }
  toJSON() {
    switch (this.type) {
      case "added": {
        return `Added   \`${this.key}\``;
      }
      case "removed": {
        return `Removed \`${this.key}\``;
      }
      case "changed": {
        return `Changed \`${this.key}\` from \`${this.oldValue?.toString() || "-"}\` to \`${this.newValue.toString()}\``;
      }
    }
  }
}
class DiffHashedObject {
  constructor(key, value, hash, props) {
    this.key = key;
    this.value = value;
    this.hash = hash;
    this.props = props;
  }
  toString() {
    if (this.props) {
      return `{${Object.keys(this.props).join(",")}}`;
    } else {
      return JSON.stringify(this.value);
    }
  }
  toJSON() {
    const k = this.key || ".";
    if (this.props) {
      return `${k}({${Object.keys(this.props).join(",")}})`;
    }
    return `${k}(${this.value})`;
  }
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.1.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index2 = routes.findIndex((route2) => route2.name === name);
        if (index2 !== -1) {
          routes.splice(index2, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!nuxtApp._asyncData[key.value]?._init) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e2) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$2 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const inlineConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowDown": "i-lucide-arrow-down",
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "arrowUp": "i-lucide-arrow-up",
      "caution": "i-lucide-circle-alert",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "copy": "i-lucide-copy",
      "copyCheck": "i-lucide-copy-check",
      "dark": "i-lucide-moon",
      "ellipsis": "i-lucide-ellipsis",
      "error": "i-lucide-circle-x",
      "external": "i-lucide-arrow-up-right",
      "eye": "i-lucide-eye",
      "eyeOff": "i-lucide-eye-off",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "hash": "i-lucide-hash",
      "info": "i-lucide-info",
      "light": "i-lucide-sun",
      "loading": "i-lucide-loader-circle",
      "menu": "i-lucide-menu",
      "minus": "i-lucide-minus",
      "panelClose": "i-lucide-panel-left-close",
      "panelOpen": "i-lucide-panel-left-open",
      "plus": "i-lucide-plus",
      "reload": "i-lucide-rotate-ccw",
      "search": "i-lucide-search",
      "stop": "i-lucide-square",
      "success": "i-lucide-circle-check",
      "system": "i-lucide-monitor",
      "tip": "i-lucide-lightbulb",
      "upload": "i-lucide-upload",
      "warning": "i-lucide-triangle-alert"
    }
  },
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(appConfig);
  return nuxtApp._appConfig;
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(() => index).then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function getColor(color, shade) {
  if (color in colors && typeof colors[color] === "object" && shade in colors[color]) {
    return colors[color][shade];
  }
  return "";
}
function generateShades(key, value) {
  return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
const colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo = /* @__PURE__ */ defineNuxtPlugin(() => {
  const appConfig2 = useAppConfig();
  useNuxtApp();
  const root = computed(() => {
    const { neutral, ...colors2 } = appConfig2.ui.colors;
    return `@layer base {
  :root {
  ${Object.entries(appConfig2.ui.colors).map(([key, value]) => generateShades(key, value)).join("\n  ")}
  }
  :root, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: "nuxt-ui-colors"
    }]
  };
  useHead(headData);
});
const preference = "system";
const plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo,
  plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8
];
function omit(data, keys) {
  const result = { ...data };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
function get(object, path, defaultValue) {
  if (typeof path === "string") {
    path = path.split(".").map((key) => {
      const numKey = Number(key);
      return Number.isNaN(numKey) ? key : numKey;
    });
  }
  let result = object;
  for (const key of path) {
    if (result === void 0 || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  return result !== void 0 ? result : defaultValue;
}
function looseToNumber(val) {
  const n = Number.parseFloat(val);
  return Number.isNaN(n) ? val : n;
}
function mergeClasses(appConfigClass, propClass) {
  if (!appConfigClass && !propClass) {
    return "";
  }
  return [
    ...Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass],
    propClass
  ].filter(Boolean);
}
function buildTranslator(locale) {
  return (path, option) => translate(path, option, unref(locale));
}
function translate(path, option, locale) {
  const prop = get(locale, `messages.${path}`, path);
  return prop.replace(
    /\{(\w+)\}/g,
    (_2, key) => `${option?.[key] ?? `{${key}}`}`
  );
}
function buildLocaleContext(locale) {
  const lang = computed(() => unref(locale).name);
  const code = computed(() => unref(locale).code);
  const dir = computed(() => unref(locale).dir);
  const localeRef = isRef(locale) ? locale : ref(locale);
  return {
    lang,
    code,
    dir,
    locale: localeRef,
    t: buildTranslator(locale)
  };
}
// @__NO_SIDE_EFFECTS__
function defineLocale(options) {
  return defu(options, { dir: "ltr" });
}
const en$1 = /* @__PURE__ */ defineLocale({
  name: "English",
  code: "en",
  messages: {
    alert: {
      close: "Close"
    },
    authForm: {
      hidePassword: "Hide password",
      showPassword: "Show password",
      submit: "Continue"
    },
    banner: {
      close: "Close"
    },
    calendar: {
      nextMonth: "Next month",
      nextYear: "Next year",
      prevMonth: "Previous month",
      prevYear: "Previous year"
    },
    carousel: {
      dots: "Choose slide to display",
      goto: "Go to slide {slide}",
      next: "Next",
      prev: "Prev"
    },
    chatPrompt: {
      placeholder: "Type your message here…"
    },
    chatPromptSubmit: {
      label: "Send prompt"
    },
    colorMode: {
      dark: "Dark",
      light: "Light",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      system: "System"
    },
    commandPalette: {
      back: "Back",
      close: "Close",
      noData: "No data",
      noMatch: "No matching data",
      placeholder: "Type a command or search…"
    },
    contentSearch: {
      links: "Links",
      theme: "Theme"
    },
    contentSearchButton: {
      label: "Search…"
    },
    contentToc: {
      title: "On this page"
    },
    dashboardSearch: {
      theme: "Theme"
    },
    dashboardSearchButton: {
      label: "Search…"
    },
    dashboardSidebarCollapse: {
      collapse: "Collapse sidebar",
      expand: "Expand sidebar"
    },
    dashboardSidebarToggle: {
      close: "Close sidebar",
      open: "Open sidebar"
    },
    error: {
      clear: "Back to home"
    },
    fileUpload: {
      removeFile: "Remove {filename}"
    },
    header: {
      close: "Close menu",
      open: "Open menu"
    },
    inputMenu: {
      create: 'Create "{label}"',
      noData: "No data",
      noMatch: "No matching data"
    },
    inputNumber: {
      decrement: "Decrement",
      increment: "Increment"
    },
    modal: {
      close: "Close"
    },
    pricingTable: {
      caption: "Pricing plan comparison"
    },
    prose: {
      codeCollapse: {
        closeText: "Collapse",
        name: "code",
        openText: "Expand"
      },
      collapsible: {
        closeText: "Hide",
        name: "properties",
        openText: "Show"
      },
      pre: {
        copy: "Copy code to clipboard"
      }
    },
    selectMenu: {
      create: 'Create "{label}"',
      noData: "No data",
      noMatch: "No matching data",
      search: "Search…"
    },
    slideover: {
      close: "Close"
    },
    table: {
      noData: "No data"
    },
    toast: {
      close: "Close"
    }
  }
});
const localeContextInjectionKey = Symbol.for("nuxt-ui.locale-context");
const _useLocale = (localeOverrides) => {
  const locale = localeOverrides || toRef(inject(localeContextInjectionKey, en$1));
  return buildLocaleContext(computed(() => locale.value || en$1));
};
const useLocale = _useLocale;
const portalTargetInjectionKey = Symbol("nuxt-ui.portal-target");
function usePortal(portal) {
  const globalPortal = inject(portalTargetInjectionKey, void 0);
  const value = computed(() => portal.value === true ? globalPortal?.value : portal.value);
  const disabled = computed(() => typeof value.value === "boolean" ? !value.value : false);
  const to = computed(() => typeof value.value === "boolean" ? "body" : value.value);
  return computed(() => ({
    to: to.value,
    disabled: disabled.value
  }));
}
function useToast() {
  const toasts = useState("toasts", () => []);
  const running = ref(false);
  const queue = [];
  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  async function processQueue() {
    if (running.value || queue.length === 0) {
      return;
    }
    running.value = true;
    while (queue.length > 0) {
      const toast = queue.shift();
      await nextTick();
      toasts.value = [...toasts.value, toast].slice(-5);
    }
    running.value = false;
  }
  function add(toast) {
    const body = {
      id: generateId(),
      open: true,
      ...toast
    };
    queue.push(body);
    processQueue();
    return body;
  }
  function update(id, toast) {
    const index2 = toasts.value.findIndex((t) => t.id === id);
    if (index2 !== -1) {
      toasts.value[index2] = {
        ...toasts.value[index2],
        ...toast
      };
    }
  }
  function remove(id) {
    const index2 = toasts.value.findIndex((t) => t.id === id);
    if (index2 !== -1) {
      toasts.value[index2] = {
        ...toasts.value[index2],
        open: false
      };
    }
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 200);
  }
  function clear() {
    toasts.value = [];
  }
  return {
    toasts,
    add,
    update,
    remove,
    clear
  };
}
const appConfigTv = appConfig;
const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv);
async function loadIcon(name, timeout) {
  if (!name)
    return null;
  const _icon = getIcon(name);
  if (_icon)
    return _icon;
  let timeoutWarn;
  const load = loadIcon$1(name).catch(() => {
    console.warn(`[Icon] failed to load icon \`${name}\``);
    return null;
  });
  if (timeout > 0)
    await Promise.race([
      load,
      new Promise((resolve) => {
        timeoutWarn = setTimeout(() => {
          console.warn(`[Icon] loading icon \`${name}\` timed out after ${timeout}ms`);
          resolve();
        }, timeout);
      })
    ]).finally(() => clearTimeout(timeoutWarn));
  else
    await load;
  return getIcon(name);
}
function useResolvedName(getName) {
  const options = useAppConfig().icon;
  const collections = (options.collections || []).sort((a, b) => b.length - a.length);
  return computed(() => {
    const name = getName();
    const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
    const resolved = options.aliases?.[bare] || bare;
    if (!resolved.includes(":")) {
      const collection = collections.find((c) => resolved.startsWith(c + "-"));
      return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
    }
    return resolved;
  });
}
function resolveCustomizeFn(customize, globalCustomize) {
  if (customize === false) return void 0;
  if (customize === true || customize === null) return globalCustomize;
  return customize;
}
const SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
  return selector.replace(/([^\w-])/g, "\\$1");
}
const NuxtIconCss = /* @__PURE__ */ defineComponent({
  name: "NuxtIconCss",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props) {
    const nuxt = useNuxtApp();
    const options = useAppConfig().icon;
    const cssClass = computed(() => props.name ? options.cssSelectorPrefix + props.name : "");
    const selector = computed(() => "." + escapeCssSelector(cssClass.value));
    function getCSS(icon, withLayer = true) {
      let iconSelector = selector.value;
      if (options.cssWherePseudo) {
        iconSelector = `:where(${iconSelector})`;
      }
      const css = getIconCSS(icon, {
        iconSelector,
        format: "compressed",
        customise: resolveCustomizeFn(props.customize, options.customize)
      });
      if (options.cssLayer && withLayer) {
        return `@layer ${options.cssLayer} { ${css} }`;
      }
      return css;
    }
    onServerPrefetch(async () => {
      {
        const configs = (/* @__PURE__ */ useRuntimeConfig()).icon || {};
        if (!configs?.serverKnownCssClasses?.includes(cssClass.value)) {
          const icon = await loadIcon(props.name, options.fetchTimeout).catch(() => null);
          if (!icon)
            return null;
          let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
          if (!ssrCSS) {
            ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
            nuxt.runWithContext(() => {
              useHead({
                style: [
                  () => {
                    const sep = "";
                    let css = Array.from(ssrCSS.values()).sort().join(sep);
                    if (options.cssLayer) {
                      css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
                    }
                    return { innerHTML: css };
                  }
                ]
              }, {
                tagPriority: "low"
              });
            });
          }
          if (props.name && !ssrCSS.has(props.name)) {
            const css = getCSS(icon, false);
            ssrCSS.set(props.name, css);
          }
          return null;
        }
      }
    });
    return () => h("span", { class: ["iconify", cssClass.value] });
  }
});
const NuxtIconSvg = /* @__PURE__ */ defineComponent({
  name: "NuxtIconSvg",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    useNuxtApp();
    const options = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const storeKey = "i-" + name.value;
    if (name.value) {
      onServerPrefetch(async () => {
        {
          await useAsyncData(
            storeKey,
            async () => await loadIcon(name.value, options.fetchTimeout),
            { deep: false }
          );
        }
      });
    }
    return () => h(Icon, {
      icon: name.value,
      ssr: true,
      // Iconify uses `customise`, where we expose `customize` for consistency
      customise: resolveCustomizeFn(props.customize, options.customize)
    }, slots);
  }
});
const __nuxt_component_0$1 = defineComponent({
  name: "NuxtIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: [Number, String],
      required: false,
      default: null
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    const nuxtApp = useNuxtApp();
    const runtimeOptions = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const component = computed(
      () => nuxtApp.vueApp?.component(name.value) || ((props.mode || runtimeOptions.mode) === "svg" ? NuxtIconSvg : NuxtIconCss)
    );
    const style = computed(() => {
      const size = props.size || runtimeOptions.size;
      return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
    });
    return () => h(
      component.value,
      {
        ...runtimeOptions.attrs,
        name: name.value,
        class: runtimeOptions.class,
        style: style.value,
        customize: props.customize
      },
      slots
    );
  }
});
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$u = {
  __name: "UIcon",
  __ssrInlineRender: true,
  props: {
    name: { type: [String, Object], required: true },
    mode: { type: String, required: false },
    size: { type: [String, Number], required: false },
    customize: { type: Function, required: false }
  },
  setup(__props) {
    const props = __props;
    const iconProps = useForwardProps(reactivePick(props, "name", "mode", "size", "customize"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      if (typeof __props.name === "string") {
        _push(ssrRenderComponent(_component_Icon, mergeProps(unref(iconProps), _attrs), null, _parent));
      } else {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.name), _attrs, null), _parent);
      }
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Icon.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const ImageComponent = "img";
const avatarGroupInjectionKey = Symbol("nuxt-ui.avatar-group");
function useAvatarGroup(props) {
  const avatarGroup = inject(avatarGroupInjectionKey, void 0);
  const size = computed(() => props.size ?? avatarGroup?.value.size);
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value })));
  return {
    size
  };
}
const theme$h = {
  "slots": {
    "root": "relative inline-flex items-center justify-center shrink-0",
    "base": "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
  },
  "variants": {
    "color": {
      "primary": "bg-primary",
      "secondary": "bg-secondary",
      "success": "bg-success",
      "info": "bg-info",
      "warning": "bg-warning",
      "error": "bg-error",
      "neutral": "bg-inverted"
    },
    "size": {
      "3xs": "h-[4px] min-w-[4px] text-[4px]",
      "2xs": "h-[5px] min-w-[5px] text-[5px]",
      "xs": "h-[6px] min-w-[6px] text-[6px]",
      "sm": "h-[7px] min-w-[7px] text-[7px]",
      "md": "h-[8px] min-w-[8px] text-[8px]",
      "lg": "h-[9px] min-w-[9px] text-[9px]",
      "xl": "h-[10px] min-w-[10px] text-[10px]",
      "2xl": "h-[11px] min-w-[11px] text-[11px]",
      "3xl": "h-[12px] min-w-[12px] text-[12px]"
    },
    "position": {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-left": "bottom-0 left-0"
    },
    "inset": {
      "false": ""
    },
    "standalone": {
      "false": "absolute"
    }
  },
  "compoundVariants": [
    {
      "position": "top-right",
      "inset": false,
      "class": "-translate-y-1/2 translate-x-1/2 transform"
    },
    {
      "position": "bottom-right",
      "inset": false,
      "class": "translate-y-1/2 translate-x-1/2 transform"
    },
    {
      "position": "top-left",
      "inset": false,
      "class": "-translate-y-1/2 -translate-x-1/2 transform"
    },
    {
      "position": "bottom-left",
      "inset": false,
      "class": "translate-y-1/2 -translate-x-1/2 transform"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "position": "top-right"
  }
};
const _sfc_main$t = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UChip",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    text: { type: [String, Number], required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    position: { type: null, required: false },
    inset: { type: Boolean, required: false, default: false },
    standalone: { type: Boolean, required: false, default: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  }, {
    "show": { type: Boolean, ...{ default: true } },
    "showModifiers": {}
  }),
  emits: ["update:show"],
  setup(__props) {
    const props = __props;
    const show = useModel(__props, "show", { type: Boolean, ...{ default: true } });
    const { size } = useAvatarGroup(props);
    const appConfig2 = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme$h), ...appConfig2.ui?.chip || {} })({
      color: props.color,
      size: size.value,
      position: props.position,
      inset: props.inset,
      standalone: props.standalone
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Slot), _ctx.$attrs, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            if (show.value) {
              _push2(`<span class="${ssrRenderClass(ui.value.base({ class: props.ui?.base }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                _push2(`${ssrInterpolate(__props.text)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Slot), _ctx.$attrs, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 16),
              show.value ? (openBlock(), createBlock("span", {
                key: 0,
                class: ui.value.base({ class: props.ui?.base })
              }, [
                renderSlot(_ctx.$slots, "content", {}, () => [
                  createTextVNode(toDisplayString(__props.text), 1)
                ])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Chip.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const theme$g = {
  "slots": {
    "root": "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-elevated",
    "image": "h-full w-full rounded-[inherit] object-cover",
    "fallback": "font-medium leading-none text-muted truncate",
    "icon": "text-muted shrink-0"
  },
  "variants": {
    "size": {
      "3xs": {
        "root": "size-4 text-[8px]"
      },
      "2xs": {
        "root": "size-5 text-[10px]"
      },
      "xs": {
        "root": "size-6 text-xs"
      },
      "sm": {
        "root": "size-7 text-sm"
      },
      "md": {
        "root": "size-8 text-base"
      },
      "lg": {
        "root": "size-9 text-lg"
      },
      "xl": {
        "root": "size-10 text-xl"
      },
      "2xl": {
        "root": "size-11 text-[22px]"
      },
      "3xl": {
        "root": "size-12 text-2xl"
      }
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const _sfc_main$s = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UAvatar",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "span" },
    src: { type: String, required: false },
    alt: { type: String, required: false },
    icon: { type: [String, Object], required: false },
    text: { type: String, required: false },
    size: { type: null, required: false },
    chip: { type: [Boolean, Object], required: false },
    class: { type: null, required: false },
    style: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const fallback = computed(() => props.text || (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2));
    const appConfig2 = useAppConfig();
    const { size } = useAvatarGroup(props);
    const ui = computed(() => tv({ extend: tv(theme$g), ...appConfig2.ui?.avatar || {} })({
      size: size.value
    }));
    const sizePx = computed(() => ({
      "3xs": 16,
      "2xs": 20,
      "xs": 24,
      "sm": 28,
      "md": 32,
      "lg": 36,
      "xl": 40,
      "2xl": 44,
      "3xl": 48
    })[props.size || "md"]);
    const error = ref(false);
    watch(() => props.src, () => {
      if (error.value) {
        error.value = false;
      }
    });
    function onError() {
      error.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(props.chip ? _sfc_main$t : unref(Primitive)), mergeProps({ as: __props.as }, props.chip ? typeof props.chip === "object" ? { inset: true, ...props.chip } : { inset: true } : {}, {
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        style: props.style
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.src && !error.value) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(ImageComponent)), mergeProps({
                src: __props.src,
                alt: __props.alt,
                width: sizePx.value,
                height: sizePx.value
              }, _ctx.$attrs, {
                class: ui.value.image({ class: props.ui?.image }),
                onError
              }), null), _parent2, _scopeId);
            } else {
              _push2(ssrRenderComponent(unref(Slot), _ctx.$attrs, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                      if (__props.icon) {
                        _push3(ssrRenderComponent(_sfc_main$u, {
                          name: __props.icon,
                          class: ui.value.icon({ class: props.ui?.icon })
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<span class="${ssrRenderClass(ui.value.fallback({ class: props.ui?.fallback }))}"${_scopeId2}>${ssrInterpolate(fallback.value || " ")}</span>`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {}, () => [
                        __props.icon ? (openBlock(), createBlock(_sfc_main$u, {
                          key: 0,
                          name: __props.icon,
                          class: ui.value.icon({ class: props.ui?.icon })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: ui.value.fallback({ class: props.ui?.fallback })
                        }, toDisplayString(fallback.value || " "), 3))
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            }
          } else {
            return [
              __props.src && !error.value ? (openBlock(), createBlock(resolveDynamicComponent(unref(ImageComponent)), mergeProps({
                key: 0,
                src: __props.src,
                alt: __props.alt,
                width: sizePx.value,
                height: sizePx.value
              }, _ctx.$attrs, {
                class: ui.value.image({ class: props.ui?.image }),
                onError
              }), null, 16, ["src", "alt", "width", "height", "class"])) : (openBlock(), createBlock(unref(Slot), mergeProps({ key: 1 }, _ctx.$attrs), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    __props.icon ? (openBlock(), createBlock(_sfc_main$u, {
                      key: 0,
                      name: __props.icon,
                      class: ui.value.icon({ class: props.ui?.icon })
                    }, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: ui.value.fallback({ class: props.ui?.fallback })
                    }, toDisplayString(fallback.value || " "), 3))
                  ])
                ]),
                _: 3
              }, 16))
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
function useComponentIcons(componentProps) {
  const appConfig2 = useAppConfig();
  const props = computed(() => toValue(componentProps));
  const isLeading = computed(() => props.value.icon && props.value.leading || props.value.icon && !props.value.trailing || props.value.loading && !props.value.trailing || !!props.value.leadingIcon);
  const isTrailing = computed(() => props.value.icon && props.value.trailing || props.value.loading && props.value.trailing || !!props.value.trailingIcon);
  const leadingIconName = computed(() => {
    if (props.value.loading) {
      return props.value.loadingIcon || appConfig2.ui.icons.loading;
    }
    return props.value.leadingIcon || props.value.icon;
  });
  const trailingIconName = computed(() => {
    if (props.value.loading && !isLeading.value) {
      return props.value.loadingIcon || appConfig2.ui.icons.loading;
    }
    return props.value.trailingIcon || props.value.icon;
  });
  return {
    isLeading,
    isTrailing,
    leadingIconName,
    trailingIconName
  };
}
const fieldGroupInjectionKey = Symbol("nuxt-ui.field-group");
function useFieldGroup(props) {
  const fieldGroup = inject(fieldGroupInjectionKey, void 0);
  return {
    orientation: computed(() => fieldGroup?.value.orientation),
    size: computed(() => props?.size ?? fieldGroup?.value.size)
  };
}
const formOptionsInjectionKey = Symbol("nuxt-ui.form-options");
const formBusInjectionKey = Symbol("nuxt-ui.form-events");
const formFieldInjectionKey = Symbol("nuxt-ui.form-field");
const inputIdInjectionKey = Symbol("nuxt-ui.input-id");
const formInputsInjectionKey = Symbol("nuxt-ui.form-inputs");
const formLoadingInjectionKey = Symbol("nuxt-ui.form-loading");
const formErrorsInjectionKey = Symbol("nuxt-ui.form-errors");
function useFormField(props, opts) {
  const formOptions = inject(formOptionsInjectionKey, void 0);
  const formBus = inject(formBusInjectionKey, void 0);
  const formField = inject(formFieldInjectionKey, void 0);
  const inputId = inject(inputIdInjectionKey, void 0);
  provide(formFieldInjectionKey, void 0);
  if (formField && inputId) {
    if (opts?.bind === false) {
      inputId.value = void 0;
    } else if (props?.id) {
      inputId.value = props?.id;
    }
  }
  function emitFormEvent(type, name, eager) {
    if (formBus && formField && name) {
      formBus.emit({ type, name, eager });
    }
  }
  function emitFormBlur() {
    emitFormEvent("blur", formField?.value.name);
  }
  function emitFormFocus() {
    emitFormEvent("focus", formField?.value.name);
  }
  function emitFormChange() {
    emitFormEvent("change", formField?.value.name);
  }
  const emitFormInput = useDebounceFn(
    () => {
      emitFormEvent("input", formField?.value.name, !opts?.deferInputValidation || formField?.value.eagerValidation);
    },
    formField?.value.validateOnInputDelay ?? formOptions?.value.validateOnInputDelay ?? 0
  );
  return {
    id: computed(() => props?.id ?? inputId?.value),
    name: computed(() => props?.name ?? formField?.value.name),
    size: computed(() => props?.size ?? formField?.value.size),
    color: computed(() => formField?.value.error ? "error" : props?.color),
    highlight: computed(() => formField?.value.error ? true : props?.highlight),
    disabled: computed(() => formOptions?.value.disabled || props?.disabled),
    emitFormBlur,
    emitFormInput,
    emitFormChange,
    emitFormFocus,
    ariaAttrs: computed(() => {
      if (!formField?.value) return;
      const descriptiveAttrs = ["error", "hint", "description", "help"].filter((type) => formField?.value?.[type]).map((type) => `${formField?.value.ariaId}-${type}`) || [];
      const attrs = {
        "aria-invalid": !!formField?.value.error
      };
      if (descriptiveAttrs.length > 0) {
        attrs["aria-describedby"] = descriptiveAttrs.join(" ");
      }
      return attrs;
    })
  };
}
function pickLinkProps(link) {
  const keys = Object.keys(link);
  const ariaKeys = keys.filter((key) => key.startsWith("aria-"));
  const dataKeys = keys.filter((key) => key.startsWith("data-"));
  const propsToInclude = [
    "active",
    "activeClass",
    "ariaCurrentValue",
    "as",
    "disabled",
    "exact",
    "exactActiveClass",
    "exactHash",
    "exactQuery",
    "external",
    "href",
    "download",
    "inactiveClass",
    "noPrefetch",
    "noRel",
    "prefetch",
    "prefetchedClass",
    "rel",
    "replace",
    "target",
    "to",
    "type",
    "title",
    "onClick",
    ...ariaKeys,
    ...dataKeys
  ];
  return reactivePick(link, ...propsToInclude);
}
function isPartiallyEqual(item1, item2) {
  const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
    if (q.type === "added") {
      filtered.add(q.key);
    }
    return filtered;
  }, /* @__PURE__ */ new Set());
  const item1Filtered = Object.fromEntries(Object.entries(item1).filter(([key]) => !diffedKeys.has(key)));
  const item2Filtered = Object.fromEntries(Object.entries(item2).filter(([key]) => !diffedKeys.has(key)));
  return isEqual$1(item1Filtered, item2Filtered);
}
const _sfc_main$r = {
  __name: "ULinkBase",
  __ssrInlineRender: true,
  props: {
    as: { type: String, required: false, default: "button" },
    type: { type: String, required: false, default: "button" },
    disabled: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    href: { type: String, required: false },
    navigate: { type: Function, required: false },
    target: { type: [String, Object, null], required: false },
    rel: { type: [String, Object, null], required: false },
    active: { type: Boolean, required: false },
    isExternal: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    function onClickWrapper(e) {
      if (props.disabled) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (props.onClick) {
        for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) {
          onClick(e);
        }
      }
      if (props.href && props.navigate && !props.isExternal) {
        props.navigate(e);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps(__props.href ? {
        "as": "a",
        "href": __props.disabled ? void 0 : __props.href,
        "aria-disabled": __props.disabled ? "true" : void 0,
        "role": __props.disabled ? "link" : void 0,
        "tabindex": __props.disabled ? -1 : void 0
      } : __props.as === "button" ? {
        as: __props.as,
        type: __props.type,
        disabled: __props.disabled
      } : {
        as: __props.as
      }, {
        rel: __props.rel,
        target: __props.target,
        onClick: onClickWrapper
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const theme$f = {
  "base": "focus-visible:outline-primary",
  "variants": {
    "active": {
      "true": "text-primary",
      "false": "text-muted"
    },
    "disabled": {
      "true": "cursor-not-allowed opacity-75"
    }
  },
  "compoundVariants": [
    {
      "active": false,
      "disabled": false,
      "class": [
        "hover:text-default",
        "transition-colors"
      ]
    }
  ]
};
const _sfc_main$q = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "ULink",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "button" },
    type: { type: null, required: false, default: "button" },
    disabled: { type: Boolean, required: false },
    active: { type: Boolean, required: false, default: void 0 },
    exact: { type: Boolean, required: false },
    exactQuery: { type: [Boolean, String], required: false },
    exactHash: { type: Boolean, required: false },
    inactiveClass: { type: String, required: false },
    custom: { type: Boolean, required: false },
    raw: { type: Boolean, required: false },
    class: { type: null, required: false },
    to: { type: null, required: false },
    href: { type: null, required: false },
    external: { type: Boolean, required: false },
    target: { type: [String, Object, null], required: false },
    rel: { type: [String, Object, null], required: false },
    noRel: { type: Boolean, required: false },
    prefetchedClass: { type: String, required: false },
    prefetch: { type: Boolean, required: false },
    prefetchOn: { type: [String, Object], required: false },
    noPrefetch: { type: Boolean, required: false },
    activeClass: { type: String, required: false },
    exactActiveClass: { type: String, required: false },
    ariaCurrentValue: { type: String, required: false, default: "page" },
    viewTransition: { type: Boolean, required: false },
    replace: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const appConfig2 = useAppConfig();
    const nuxtLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "class"));
    const ui = computed(() => tv({
      extend: tv(theme$f),
      ...defu({
        variants: {
          active: {
            true: mergeClasses(appConfig2.ui?.link?.variants?.active?.true, props.activeClass),
            false: mergeClasses(appConfig2.ui?.link?.variants?.active?.false, props.inactiveClass)
          }
        }
      }, appConfig2.ui?.link || {})
    }));
    const to = computed(() => props.to ?? props.href);
    function isLinkActive({ route: linkRoute, isActive, isExactActive }) {
      if (props.active !== void 0) {
        return props.active;
      }
      if (props.exactQuery === "partial") {
        if (!isPartiallyEqual(linkRoute.query, route.query)) return false;
      } else if (props.exactQuery === true) {
        if (!isEqual$1(linkRoute.query, route.query)) return false;
      }
      if (props.exactHash && linkRoute.hash !== route.hash) {
        return false;
      }
      if (props.exact && isExactActive) {
        return true;
      }
      if (!props.exact && isActive) {
        return true;
      }
      return false;
    }
    function resolveLinkClass({ route: route2, isActive, isExactActive }) {
      const active = isLinkActive({ route: route2, isActive, isExactActive });
      if (props.raw) {
        return [props.class, active ? props.activeClass : props.inactiveClass];
      }
      return ui.value({ class: props.class, active, disabled: props.disabled });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps(unref(nuxtLinkProps), {
        to: to.value,
        custom: ""
      }, _attrs), {
        default: withCtx(({ href, navigate, route: linkRoute, rel, target, isExternal, isActive, isExactActive }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.custom) {
              ssrRenderSlot(_ctx.$slots, "default", {
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal,
                active: isLinkActive({ route: linkRoute, isActive, isExactActive })
              }, null, _push2, _parent2, _scopeId);
            } else {
              _push2(ssrRenderComponent(_sfc_main$r, mergeProps({
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal
              }, {
                class: resolveLinkClass({ route: linkRoute, isActive, isExactActive })
              }), {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {
                      active: isLinkActive({ route: linkRoute, isActive, isExactActive })
                    }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {
                        active: isLinkActive({ route: linkRoute, isActive, isExactActive })
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            }
          } else {
            return [
              __props.custom ? renderSlot(_ctx.$slots, "default", mergeProps({ key: 0 }, {
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal,
                active: isLinkActive({ route: linkRoute, isActive, isExactActive })
              })) : (openBlock(), createBlock(_sfc_main$r, mergeProps({ key: 1 }, {
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal
              }, {
                class: resolveLinkClass({ route: linkRoute, isActive, isExactActive })
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {
                    active: isLinkActive({ route: linkRoute, isActive, isExactActive })
                  })
                ]),
                _: 2
              }, 1040, ["class"]))
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Link.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const theme$e = {
  "slots": {
    "base": [
      "rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75",
      "transition-colors"
    ],
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": "",
      "ghost": "",
      "link": ""
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6"
      }
    },
    "block": {
      "true": {
        "base": "w-full justify-center",
        "trailingIcon": "ms-auto"
      }
    },
    "square": {
      "true": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "active": {
      "true": {
        "base": ""
      },
      "false": {
        "base": ""
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "text-inverted bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "text-inverted bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "text-inverted bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "ring ring-inset ring-secondary/50 text-secondary hover:bg-secondary/10 active:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 focus:outline-none focus-visible:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 focus:outline-none focus-visible:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "text-success bg-success/10 hover:bg-success/15 active:bg-success/15 focus:outline-none focus-visible:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "text-info bg-info/10 hover:bg-info/15 active:bg-info/15 focus:outline-none focus-visible:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 focus:outline-none focus-visible:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "text-error bg-error/10 hover:bg-error/15 active:bg-error/15 focus:outline-none focus-visible:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
    },
    {
      "color": "primary",
      "variant": "ghost",
      "class": "text-primary hover:bg-primary/10 active:bg-primary/10 focus:outline-none focus-visible:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "secondary",
      "variant": "ghost",
      "class": "text-secondary hover:bg-secondary/10 active:bg-secondary/10 focus:outline-none focus-visible:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "success",
      "variant": "ghost",
      "class": "text-success hover:bg-success/10 active:bg-success/10 focus:outline-none focus-visible:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "info",
      "variant": "ghost",
      "class": "text-info hover:bg-info/10 active:bg-info/10 focus:outline-none focus-visible:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "warning",
      "variant": "ghost",
      "class": "text-warning hover:bg-warning/10 active:bg-warning/10 focus:outline-none focus-visible:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "error",
      "variant": "ghost",
      "class": "text-error hover:bg-error/10 active:bg-error/10 focus:outline-none focus-visible:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "primary",
      "variant": "link",
      "class": "text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": "link",
      "class": "text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": "link",
      "class": "text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": "link",
      "class": "text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": "link",
      "class": "text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": "link",
      "class": "text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 focus:outline-none focus-visible:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "variant": "ghost",
      "class": "text-default hover:bg-elevated active:bg-elevated focus:outline-none focus-visible:bg-elevated hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
    },
    {
      "color": "neutral",
      "variant": "link",
      "class": "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "size": "xs",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "sm",
      "square": true,
      "class": "p-1.5"
    },
    {
      "size": "md",
      "square": true,
      "class": "p-1.5"
    },
    {
      "size": "lg",
      "square": true,
      "class": "p-2"
    },
    {
      "size": "xl",
      "square": true,
      "class": "p-2"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid",
    "size": "md"
  }
};
const _sfc_main$p = {
  __name: "UButton",
  __ssrInlineRender: true,
  props: {
    label: { type: String, required: false },
    color: { type: null, required: false },
    activeColor: { type: null, required: false },
    variant: { type: null, required: false },
    activeVariant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    block: { type: Boolean, required: false },
    loadingAuto: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: [String, Object], required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: [String, Object], required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: [String, Object], required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: [String, Object], required: false },
    as: { type: null, required: false },
    type: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    active: { type: Boolean, required: false },
    exact: { type: Boolean, required: false },
    exactQuery: { type: [Boolean, String], required: false },
    exactHash: { type: Boolean, required: false },
    inactiveClass: { type: String, required: false },
    to: { type: null, required: false },
    href: { type: null, required: false },
    external: { type: Boolean, required: false },
    target: { type: [String, Object, null], required: false },
    rel: { type: [String, Object, null], required: false },
    noRel: { type: Boolean, required: false },
    prefetchedClass: { type: String, required: false },
    prefetch: { type: Boolean, required: false },
    prefetchOn: { type: [String, Object], required: false },
    noPrefetch: { type: Boolean, required: false },
    activeClass: { type: String, required: false },
    exactActiveClass: { type: String, required: false },
    ariaCurrentValue: { type: String, required: false },
    viewTransition: { type: Boolean, required: false },
    replace: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const { orientation, size: buttonSize } = useFieldGroup(props);
    const linkProps = useForwardProps(pickLinkProps(props));
    const loadingAutoState = ref(false);
    const formLoading = inject(formLoadingInjectionKey, void 0);
    async function onClickWrapper(event) {
      loadingAutoState.value = true;
      const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
      try {
        await Promise.all(callbacks.map((fn) => fn?.(event)));
      } finally {
        loadingAutoState.value = false;
      }
    }
    const isLoading = computed(() => {
      return props.loading || props.loadingAuto && (loadingAutoState.value || formLoading?.value && props.type === "submit");
    });
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(
      computed(() => ({ ...props, loading: isLoading.value }))
    );
    const ui = computed(() => tv({
      extend: tv(theme$e),
      ...defu({
        variants: {
          active: {
            true: {
              base: mergeClasses(appConfig2.ui?.button?.variants?.active?.true?.base, props.activeClass)
            },
            false: {
              base: mergeClasses(appConfig2.ui?.button?.variants?.active?.false?.base, props.inactiveClass)
            }
          }
        }
      }, appConfig2.ui?.button || {})
    })({
      color: props.color,
      variant: props.variant,
      size: buttonSize.value,
      loading: isLoading.value,
      block: props.block,
      square: props.square || !slots.default && !props.label,
      leading: isLeading.value,
      trailing: isTrailing.value,
      fieldGroup: orientation.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$q, mergeProps({
        type: __props.type,
        disabled: __props.disabled || isLoading.value
      }, unref(omit)(unref(linkProps), ["type", "disabled", "onClick"]), { custom: "" }, _attrs), {
        default: withCtx(({ active, ...slotProps }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$r, mergeProps(slotProps, {
              class: ui.value.base({
                class: [props.ui?.base, props.class],
                active,
                ...active && __props.activeVariant ? { variant: __props.activeVariant } : {},
                ...active && __props.activeColor ? { color: __props.activeColor } : {}
              }),
              onClick: onClickWrapper
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "leading", {}, () => {
                    if (unref(isLeading) && unref(leadingIconName)) {
                      _push3(ssrRenderComponent(_sfc_main$u, {
                        name: unref(leadingIconName),
                        class: ui.value.leadingIcon({ class: props.ui?.leadingIcon, active })
                      }, null, _parent3, _scopeId2));
                    } else if (!!__props.avatar) {
                      _push3(ssrRenderComponent(_sfc_main$s, mergeProps({
                        size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                      }, __props.avatar, {
                        class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar, active })
                      }), null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    if (__props.label !== void 0 && __props.label !== null) {
                      _push3(`<span class="${ssrRenderClass(ui.value.label({ class: props.ui?.label, active }))}"${_scopeId2}>${ssrInterpolate(__props.label)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                  ssrRenderSlot(_ctx.$slots, "trailing", {}, () => {
                    if (unref(isTrailing) && unref(trailingIconName)) {
                      _push3(ssrRenderComponent(_sfc_main$u, {
                        name: unref(trailingIconName),
                        class: ui.value.trailingIcon({ class: props.ui?.trailingIcon, active })
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "leading", {}, () => [
                      unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                        key: 0,
                        name: unref(leadingIconName),
                        class: ui.value.leadingIcon({ class: props.ui?.leadingIcon, active })
                      }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$s, mergeProps({
                        key: 1,
                        size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                      }, __props.avatar, {
                        class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar, active })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                    ]),
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      __props.label !== void 0 && __props.label !== null ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: ui.value.label({ class: props.ui?.label, active })
                      }, toDisplayString(__props.label), 3)) : createCommentVNode("", true)
                    ]),
                    renderSlot(_ctx.$slots, "trailing", {}, () => [
                      unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                        key: 0,
                        name: unref(trailingIconName),
                        class: ui.value.trailingIcon({ class: props.ui?.trailingIcon, active })
                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$r, mergeProps(slotProps, {
                class: ui.value.base({
                  class: [props.ui?.base, props.class],
                  active,
                  ...active && __props.activeVariant ? { variant: __props.activeVariant } : {},
                  ...active && __props.activeColor ? { color: __props.activeColor } : {}
                }),
                onClick: onClickWrapper
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "leading", {}, () => [
                    unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                      key: 0,
                      name: unref(leadingIconName),
                      class: ui.value.leadingIcon({ class: props.ui?.leadingIcon, active })
                    }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$s, mergeProps({
                      key: 1,
                      size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                    }, __props.avatar, {
                      class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar, active })
                    }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                  ]),
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    __props.label !== void 0 && __props.label !== null ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: ui.value.label({ class: props.ui?.label, active })
                    }, toDisplayString(__props.label), 3)) : createCommentVNode("", true)
                  ]),
                  renderSlot(_ctx.$slots, "trailing", {}, () => [
                    unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                      key: 0,
                      name: unref(trailingIconName),
                      class: ui.value.trailingIcon({ class: props.ui?.trailingIcon, active })
                    }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                  ])
                ]),
                _: 2
              }, 1040, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Button.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const theme$d = {
  "slots": {
    "root": "gap-2",
    "base": "relative overflow-hidden rounded-full bg-accented",
    "indicator": "rounded-full size-full transition-transform duration-200 ease-out",
    "status": "flex text-dimmed transition-[width] duration-200",
    "steps": "grid items-end",
    "step": "truncate text-end row-start-1 col-start-1 transition-opacity"
  },
  "variants": {
    "animation": {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    "color": {
      "primary": {
        "indicator": "bg-primary",
        "steps": "text-primary"
      },
      "secondary": {
        "indicator": "bg-secondary",
        "steps": "text-secondary"
      },
      "success": {
        "indicator": "bg-success",
        "steps": "text-success"
      },
      "info": {
        "indicator": "bg-info",
        "steps": "text-info"
      },
      "warning": {
        "indicator": "bg-warning",
        "steps": "text-warning"
      },
      "error": {
        "indicator": "bg-error",
        "steps": "text-error"
      },
      "neutral": {
        "indicator": "bg-inverted",
        "steps": "text-inverted"
      }
    },
    "size": {
      "2xs": {
        "status": "text-xs",
        "steps": "text-xs"
      },
      "xs": {
        "status": "text-xs",
        "steps": "text-xs"
      },
      "sm": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "md": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "lg": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "xl": {
        "status": "text-base",
        "steps": "text-base"
      },
      "2xl": {
        "status": "text-base",
        "steps": "text-base"
      }
    },
    "step": {
      "active": {
        "step": "opacity-100"
      },
      "first": {
        "step": "opacity-100 text-muted"
      },
      "other": {
        "step": "opacity-0"
      },
      "last": {
        "step": ""
      }
    },
    "orientation": {
      "horizontal": {
        "root": "w-full flex flex-col",
        "base": "w-full",
        "status": "flex-row items-center justify-end min-w-fit"
      },
      "vertical": {
        "root": "h-full flex flex-row-reverse",
        "base": "h-full",
        "status": "flex-col justify-end min-h-fit"
      }
    },
    "inverted": {
      "true": {
        "status": "self-end"
      }
    }
  },
  "compoundVariants": [
    {
      "inverted": true,
      "orientation": "horizontal",
      "class": {
        "step": "text-start",
        "status": "flex-row-reverse"
      }
    },
    {
      "inverted": true,
      "orientation": "vertical",
      "class": {
        "steps": "items-start",
        "status": "flex-col-reverse"
      }
    },
    {
      "orientation": "horizontal",
      "size": "2xs",
      "class": "h-px"
    },
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": "h-0.5"
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": "h-1"
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": "h-2"
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": "h-3"
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": "h-4"
    },
    {
      "orientation": "horizontal",
      "size": "2xl",
      "class": "h-5"
    },
    {
      "orientation": "vertical",
      "size": "2xs",
      "class": "w-px"
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": "w-0.5"
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": "w-1"
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": "w-2"
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": "w-3"
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": "w-4"
    },
    {
      "orientation": "vertical",
      "size": "2xl",
      "class": "w-5"
    },
    {
      "orientation": "horizontal",
      "animation": "carousel",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "carousel",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "carousel-inverse",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "carousel-inverse",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "swing",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "swing",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "elastic",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "elastic",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]"
      }
    }
  ],
  "defaultVariants": {
    "animation": "carousel",
    "color": "primary",
    "size": "md"
  }
};
const _sfc_main$o = {
  __name: "UProgress",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    max: { type: [Number, Array], required: false },
    status: { type: Boolean, required: false },
    inverted: { type: Boolean, required: false, default: false },
    size: { type: null, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    animation: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    getValueLabel: { type: Function, required: false },
    getValueText: { type: Function, required: false },
    modelValue: { type: [Number, null], required: false, default: null }
  },
  emits: ["update:modelValue", "update:max"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { dir } = useLocale();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "getValueLabel", "getValueText", "modelValue"), emits);
    const isIndeterminate = computed(() => rootProps.value.modelValue === null);
    const hasSteps = computed(() => Array.isArray(props.max));
    const realMax = computed(() => {
      if (isIndeterminate.value || !props.max) {
        return void 0;
      }
      if (Array.isArray(props.max)) {
        return props.max.length - 1;
      }
      return Number(props.max);
    });
    const percent = computed(() => {
      if (isIndeterminate.value) {
        return void 0;
      }
      switch (true) {
        case rootProps.value.modelValue < 0:
          return 0;
        case rootProps.value.modelValue > (realMax.value ?? 100):
          return 100;
        default:
          return Math.round(rootProps.value.modelValue / (realMax.value ?? 100) * 100);
      }
    });
    const indicatorStyle = computed(() => {
      if (percent.value === void 0) {
        return;
      }
      if (props.orientation === "vertical") {
        return {
          transform: `translateY(${props.inverted ? "" : "-"}${100 - percent.value}%)`
        };
      } else {
        if (dir.value === "rtl") {
          return {
            transform: `translateX(${props.inverted ? "-" : ""}${100 - percent.value}%)`
          };
        } else {
          return {
            transform: `translateX(${props.inverted ? "" : "-"}${100 - percent.value}%)`
          };
        }
      }
    });
    const statusStyle = computed(() => {
      const value = `${Math.max(percent.value ?? 0, 0)}%`;
      return props.orientation === "vertical" ? { height: value } : { width: value };
    });
    function isActive(index2) {
      return index2 === Number(props.modelValue);
    }
    function isFirst(index2) {
      return index2 === 0;
    }
    function isLast(index2) {
      return index2 === realMax.value;
    }
    function stepVariant(index2) {
      index2 = Number(index2);
      if (isActive(index2) && !isFirst(index2)) {
        return "active";
      }
      if (isFirst(index2) && isActive(index2)) {
        return "first";
      }
      if (isLast(index2) && isActive(index2)) {
        return "last";
      }
      return "other";
    }
    const ui = computed(() => tv({ extend: tv(theme$d), ...appConfig2.ui?.progress || {} })({
      animation: props.animation,
      size: props.size,
      color: props.color,
      orientation: props.orientation,
      inverted: props.inverted
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "data-orientation": __props.orientation,
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!isIndeterminate.value && (__props.status || !!slots.status)) {
              _push2(`<div class="${ssrRenderClass(ui.value.status({ class: props.ui?.status }))}" style="${ssrRenderStyle(statusStyle.value)}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "status", { percent: percent.value }, () => {
                _push2(`${ssrInterpolate(percent.value)}% `);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(ProgressRoot), mergeProps(unref(rootProps), {
              max: realMax.value,
              class: ui.value.base({ class: props.ui?.base }),
              style: { "transform": "translateZ(0)" }
            }), {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ProgressIndicator), {
                    class: ui.value.indicator({ class: props.ui?.indicator }),
                    style: indicatorStyle.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ProgressIndicator), {
                      class: ui.value.indicator({ class: props.ui?.indicator }),
                      style: indicatorStyle.value
                    }, null, 8, ["class", "style"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (hasSteps.value) {
              _push2(`<div class="${ssrRenderClass(ui.value.steps({ class: props.ui?.steps }))}"${_scopeId}><!--[-->`);
              ssrRenderList(__props.max, (step, index2) => {
                _push2(`<div class="${ssrRenderClass(ui.value.step({ class: props.ui?.step, step: stepVariant(index2) }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, `step-${index2}`, { step }, () => {
                  _push2(`${ssrInterpolate(step)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !isIndeterminate.value && (__props.status || !!slots.status) ? (openBlock(), createBlock("div", {
                key: 0,
                class: ui.value.status({ class: props.ui?.status }),
                style: statusStyle.value
              }, [
                renderSlot(_ctx.$slots, "status", { percent: percent.value }, () => [
                  createTextVNode(toDisplayString(percent.value) + "% ", 1)
                ])
              ], 6)) : createCommentVNode("", true),
              createVNode(unref(ProgressRoot), mergeProps(unref(rootProps), {
                max: realMax.value,
                class: ui.value.base({ class: props.ui?.base }),
                style: { "transform": "translateZ(0)" }
              }), {
                default: withCtx(() => [
                  createVNode(unref(ProgressIndicator), {
                    class: ui.value.indicator({ class: props.ui?.indicator }),
                    style: indicatorStyle.value
                  }, null, 8, ["class", "style"])
                ]),
                _: 1
              }, 16, ["max", "class"]),
              hasSteps.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: ui.value.steps({ class: props.ui?.steps })
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.max, (step, index2) => {
                  return openBlock(), createBlock("div", {
                    key: index2,
                    class: ui.value.step({ class: props.ui?.step, step: stepVariant(index2) })
                  }, [
                    renderSlot(_ctx.$slots, `step-${index2}`, { step }, () => [
                      createTextVNode(toDisplayString(step), 1)
                    ])
                  ], 2);
                }), 128))
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Progress.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const theme$c = {
  "slots": {
    "root": "relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 focus:outline-none",
    "wrapper": "w-0 flex-1 flex flex-col",
    "title": "text-sm font-medium text-highlighted",
    "description": "text-sm text-muted",
    "icon": "shrink-0 size-5",
    "avatar": "shrink-0",
    "avatarSize": "2xl",
    "actions": "flex gap-1.5 shrink-0",
    "progress": "absolute inset-x-0 bottom-0",
    "close": "p-0"
  },
  "variants": {
    "color": {
      "primary": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        "icon": "text-primary"
      },
      "secondary": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary",
        "icon": "text-secondary"
      },
      "success": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success",
        "icon": "text-success"
      },
      "info": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info",
        "icon": "text-info"
      },
      "warning": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning",
        "icon": "text-warning"
      },
      "error": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error",
        "icon": "text-error"
      },
      "neutral": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted",
        "icon": "text-highlighted"
      }
    },
    "orientation": {
      "horizontal": {
        "root": "items-center",
        "actions": "items-center"
      },
      "vertical": {
        "root": "items-start",
        "actions": "items-start mt-2.5"
      }
    },
    "title": {
      "true": {
        "description": "mt-1"
      }
    }
  },
  "defaultVariants": {
    "color": "primary"
  }
};
const _sfc_main$n = {
  __name: "UToast",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: [String, Object, Function], required: false },
    description: { type: [String, Object, Function], required: false },
    icon: { type: [String, Object], required: false },
    avatar: { type: Object, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "vertical" },
    close: { type: [Boolean, Object], required: false, default: true },
    closeIcon: { type: [String, Object], required: false },
    actions: { type: Array, required: false },
    progress: { type: [Boolean, Object], required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    type: { type: String, required: false },
    duration: { type: Number, required: false }
  },
  emits: ["escapeKeyDown", "pause", "resume", "swipeStart", "swipeMove", "swipeCancel", "swipeEnd", "update:open"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultOpen", "open", "duration", "type"), emits);
    const ui = computed(() => tv({ extend: tv(theme$c), ...appConfig2.ui?.toast || {} })({
      color: props.color,
      orientation: props.orientation,
      title: !!props.title || !!slots.title
    }));
    const el = ref();
    const height = ref(0);
    __expose({
      height
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ToastRoot), mergeProps({
        ref_key: "el",
        ref: el
      }, unref(rootProps), {
        "data-orientation": __props.orientation,
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        style: { "--height": height.value }
      }, _attrs), {
        default: withCtx(({ remaining, duration, open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "leading", {}, () => {
              if (__props.avatar) {
                _push2(ssrRenderComponent(_sfc_main$s, mergeProps({
                  size: props.ui?.avatarSize || ui.value.avatarSize()
                }, __props.avatar, {
                  class: ui.value.avatar({ class: props.ui?.avatar })
                }), null, _parent2, _scopeId));
              } else if (__props.icon) {
                _push2(ssrRenderComponent(_sfc_main$u, {
                  name: __props.icon,
                  class: ui.value.icon({ class: props.ui?.icon })
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            _push2(`<div class="${ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
            if (__props.title || !!slots.title) {
              _push2(ssrRenderComponent(unref(ToastTitle), {
                class: ui.value.title({ class: props.ui?.title })
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                      if (typeof __props.title === "function") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.title()), null, null), _parent3, _scopeId2);
                      } else if (typeof __props.title === "object") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.title), null, null), _parent3, _scopeId2);
                      } else {
                        _push3(`<!--[-->${ssrInterpolate(__props.title)}<!--]-->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "title", {}, () => [
                        typeof __props.title === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title()), { key: 0 })) : typeof __props.title === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                          createTextVNode(toDisplayString(__props.title), 1)
                        ], 64))
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.description || !!slots.description) {
              _push2(ssrRenderComponent(unref(ToastDescription), {
                class: ui.value.description({ class: props.ui?.description })
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                      if (typeof __props.description === "function") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.description()), null, null), _parent3, _scopeId2);
                      } else if (typeof __props.description === "object") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.description), null, null), _parent3, _scopeId2);
                      } else {
                        _push3(`<!--[-->${ssrInterpolate(__props.description)}<!--]-->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "description", {}, () => [
                        typeof __props.description === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description()), { key: 0 })) : typeof __props.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                          createTextVNode(toDisplayString(__props.description), 1)
                        ], 64))
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.orientation === "vertical" && (__props.actions?.length || !!slots.actions)) {
              _push2(`<div class="${ssrRenderClass(ui.value.actions({ class: props.ui?.actions }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                _push2(`<!--[-->`);
                ssrRenderList(__props.actions, (action, index2) => {
                  _push2(ssrRenderComponent(unref(ToastAction), {
                    key: index2,
                    "alt-text": action.label || "Action",
                    "as-child": "",
                    onClick: () => {
                    }
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_sfc_main$p, mergeProps({
                          size: "xs",
                          color: __props.color
                        }, { ref_for: true }, action), null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_sfc_main$p, mergeProps({
                            size: "xs",
                            color: __props.color
                          }, { ref_for: true }, action), null, 16, ["color"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) || __props.close) {
              _push2(`<div class="${ssrRenderClass(ui.value.actions({ class: props.ui?.actions, orientation: "horizontal" }))}"${_scopeId}>`);
              if (__props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions)) {
                ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                  _push2(`<!--[-->`);
                  ssrRenderList(__props.actions, (action, index2) => {
                    _push2(ssrRenderComponent(unref(ToastAction), {
                      key: index2,
                      "alt-text": action.label || "Action",
                      "as-child": "",
                      onClick: () => {
                      }
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(ssrRenderComponent(_sfc_main$p, mergeProps({
                            size: "xs",
                            color: __props.color
                          }, { ref_for: true }, action), null, _parent3, _scopeId2));
                        } else {
                          return [
                            createVNode(_sfc_main$p, mergeProps({
                              size: "xs",
                              color: __props.color
                            }, { ref_for: true }, action), null, 16, ["color"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  });
                  _push2(`<!--]-->`);
                }, _push2, _parent2, _scopeId);
              } else {
                _push2(`<!---->`);
              }
              if (__props.close || !!slots.close) {
                _push2(ssrRenderComponent(unref(ToastClose), { "as-child": "" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                        if (__props.close) {
                          _push3(ssrRenderComponent(_sfc_main$p, mergeProps({
                            icon: __props.closeIcon || unref(appConfig2).ui.icons.close,
                            color: "neutral",
                            variant: "link",
                            "aria-label": unref(t)("toast.close")
                          }, typeof __props.close === "object" ? __props.close : {}, {
                            class: ui.value.close({ class: props.ui?.close }),
                            onClick: () => {
                            }
                          }), null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                          __props.close ? (openBlock(), createBlock(_sfc_main$p, mergeProps({
                            key: 0,
                            icon: __props.closeIcon || unref(appConfig2).ui.icons.close,
                            color: "neutral",
                            variant: "link",
                            "aria-label": unref(t)("toast.close")
                          }, typeof __props.close === "object" ? __props.close : {}, {
                            class: ui.value.close({ class: props.ui?.close }),
                            onClick: withModifiers(() => {
                            }, ["stop"])
                          }), null, 16, ["icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.progress && open && remaining > 0 && duration) {
              _push2(ssrRenderComponent(_sfc_main$o, mergeProps({
                "model-value": remaining / duration * 100,
                color: __props.color
              }, typeof __props.progress === "object" ? __props.progress : {}, {
                size: "sm",
                class: ui.value.progress({ class: props.ui?.progress })
              }), null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              renderSlot(_ctx.$slots, "leading", {}, () => [
                __props.avatar ? (openBlock(), createBlock(_sfc_main$s, mergeProps({
                  key: 0,
                  size: props.ui?.avatarSize || ui.value.avatarSize()
                }, __props.avatar, {
                  class: ui.value.avatar({ class: props.ui?.avatar })
                }), null, 16, ["size", "class"])) : __props.icon ? (openBlock(), createBlock(_sfc_main$u, {
                  key: 1,
                  name: __props.icon,
                  class: ui.value.icon({ class: props.ui?.icon })
                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
              ]),
              createVNode("div", {
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.title || !!slots.title ? (openBlock(), createBlock(unref(ToastTitle), {
                  key: 0,
                  class: ui.value.title({ class: props.ui?.title })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "title", {}, () => [
                      typeof __props.title === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title()), { key: 0 })) : typeof __props.title === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode(toDisplayString(__props.title), 1)
                      ], 64))
                    ])
                  ]),
                  _: 3
                }, 8, ["class"])) : createCommentVNode("", true),
                __props.description || !!slots.description ? (openBlock(), createBlock(unref(ToastDescription), {
                  key: 1,
                  class: ui.value.description({ class: props.ui?.description })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "description", {}, () => [
                      typeof __props.description === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description()), { key: 0 })) : typeof __props.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode(toDisplayString(__props.description), 1)
                      ], 64))
                    ])
                  ]),
                  _: 3
                }, 8, ["class"])) : createCommentVNode("", true),
                __props.orientation === "vertical" && (__props.actions?.length || !!slots.actions) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: ui.value.actions({ class: props.ui?.actions })
                }, [
                  renderSlot(_ctx.$slots, "actions", {}, () => [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.actions, (action, index2) => {
                      return openBlock(), createBlock(unref(ToastAction), {
                        key: index2,
                        "alt-text": action.label || "Action",
                        "as-child": "",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$p, mergeProps({
                            size: "xs",
                            color: __props.color
                          }, { ref_for: true }, action), null, 16, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["alt-text", "onClick"]);
                    }), 128))
                  ])
                ], 2)) : createCommentVNode("", true)
              ], 2),
              __props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) || __props.close ? (openBlock(), createBlock("div", {
                key: 0,
                class: ui.value.actions({ class: props.ui?.actions, orientation: "horizontal" })
              }, [
                __props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) ? renderSlot(_ctx.$slots, "actions", { key: 0 }, () => [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.actions, (action, index2) => {
                    return openBlock(), createBlock(unref(ToastAction), {
                      key: index2,
                      "alt-text": action.label || "Action",
                      "as-child": "",
                      onClick: withModifiers(() => {
                      }, ["stop"])
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$p, mergeProps({
                          size: "xs",
                          color: __props.color
                        }, { ref_for: true }, action), null, 16, ["color"])
                      ]),
                      _: 2
                    }, 1032, ["alt-text", "onClick"]);
                  }), 128))
                ]) : createCommentVNode("", true),
                __props.close || !!slots.close ? (openBlock(), createBlock(unref(ToastClose), {
                  key: 1,
                  "as-child": ""
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                      __props.close ? (openBlock(), createBlock(_sfc_main$p, mergeProps({
                        key: 0,
                        icon: __props.closeIcon || unref(appConfig2).ui.icons.close,
                        color: "neutral",
                        variant: "link",
                        "aria-label": unref(t)("toast.close")
                      }, typeof __props.close === "object" ? __props.close : {}, {
                        class: ui.value.close({ class: props.ui?.close }),
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }), null, 16, ["icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 3
                })) : createCommentVNode("", true)
              ], 2)) : createCommentVNode("", true),
              __props.progress && open && remaining > 0 && duration ? (openBlock(), createBlock(_sfc_main$o, mergeProps({
                key: 1,
                "model-value": remaining / duration * 100,
                color: __props.color
              }, typeof __props.progress === "object" ? __props.progress : {}, {
                size: "sm",
                class: ui.value.progress({ class: props.ui?.progress })
              }), null, 16, ["model-value", "color", "class"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Toast.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const theme$b = {
  "slots": {
    "viewport": "fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-[100] data-[expanded=true]:h-(--height) focus:outline-none",
    "base": "pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[expanded=false]:data-[front=false]:h-(--front-height) data-[expanded=false]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_ease-in-out] data-[state=closed]:data-[expanded=false]:data-[front=false]:animate-[toast-collapsed-closed_200ms_ease-in-out] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out"
  },
  "variants": {
    "position": {
      "top-left": {
        "viewport": "left-4"
      },
      "top-center": {
        "viewport": "left-1/2 transform -translate-x-1/2"
      },
      "top-right": {
        "viewport": "right-4"
      },
      "bottom-left": {
        "viewport": "left-4"
      },
      "bottom-center": {
        "viewport": "left-1/2 transform -translate-x-1/2"
      },
      "bottom-right": {
        "viewport": "right-4"
      }
    },
    "swipeDirection": {
      "up": "data-[swipe=end]:animate-[toast-slide-up_200ms_ease-out]",
      "right": "data-[swipe=end]:animate-[toast-slide-right_200ms_ease-out]",
      "down": "data-[swipe=end]:animate-[toast-slide-down_200ms_ease-out]",
      "left": "data-[swipe=end]:animate-[toast-slide-left_200ms_ease-out]"
    }
  },
  "compoundVariants": [
    {
      "position": [
        "top-left",
        "top-center",
        "top-right"
      ],
      "class": {
        "viewport": "top-4",
        "base": "top-0 data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out]"
      }
    },
    {
      "position": [
        "bottom-left",
        "bottom-center",
        "bottom-right"
      ],
      "class": {
        "viewport": "bottom-4",
        "base": "bottom-0 data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out]"
      }
    },
    {
      "swipeDirection": [
        "left",
        "right"
      ],
      "class": "data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0"
    },
    {
      "swipeDirection": [
        "up",
        "down"
      ],
      "class": "data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0"
    }
  ],
  "defaultVariants": {
    "position": "bottom-right"
  }
};
const __default__$1 = {
  name: "Toaster"
};
const _sfc_main$m = /* @__PURE__ */ Object.assign(__default__$1, {
  __ssrInlineRender: true,
  props: {
    position: { type: null, required: false },
    expand: { type: Boolean, required: false, default: true },
    progress: { type: Boolean, required: false, default: true },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    label: { type: String, required: false },
    duration: { type: Number, required: false, default: 5e3 },
    swipeThreshold: { type: Number, required: false }
  },
  setup(__props) {
    const props = __props;
    const { toasts, remove } = useToast();
    const appConfig2 = useAppConfig();
    const providerProps = useForwardProps(reactivePick(props, "duration", "label", "swipeThreshold"));
    const portalProps = usePortal(toRef(() => props.portal));
    const swipeDirection = computed(() => {
      switch (props.position) {
        case "top-center":
          return "up";
        case "top-right":
        case "bottom-right":
          return "right";
        case "bottom-center":
          return "down";
        case "top-left":
        case "bottom-left":
          return "left";
      }
      return "right";
    });
    const ui = computed(() => tv({ extend: tv(theme$b), ...appConfig2.ui?.toaster || {} })({
      position: props.position,
      swipeDirection: swipeDirection.value
    }));
    function onUpdateOpen(value, id) {
      if (value) {
        return;
      }
      remove(id);
    }
    const hovered = ref(false);
    const expanded = computed(() => props.expand || hovered.value);
    const refs = ref([]);
    const height = computed(() => refs.value.reduce((acc, { height: height2 }) => acc + height2 + 16, 0));
    const frontHeight = computed(() => refs.value[refs.value.length - 1]?.height || 0);
    function getOffset(index2) {
      return refs.value.slice(index2 + 1).reduce((acc, { height: height2 }) => acc + height2 + 16, 0);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ToastProvider), mergeProps({ "swipe-direction": swipeDirection.value }, unref(providerProps), _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`<!--[-->`);
            ssrRenderList(unref(toasts), (toast, index2) => {
              _push2(ssrRenderComponent(_sfc_main$n, mergeProps({
                key: toast.id,
                ref_for: true,
                ref_key: "refs",
                ref: refs,
                progress: __props.progress
              }, { ref_for: true }, unref(omit)(toast, ["id", "close"]), {
                close: toast.close,
                "data-expanded": expanded.value,
                "data-front": !expanded.value && index2 === unref(toasts).length - 1,
                style: {
                  "--index": index2 - unref(toasts).length + unref(toasts).length,
                  "--before": unref(toasts).length - 1 - index2,
                  "--offset": getOffset(index2),
                  "--scale": expanded.value ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
                  "--translate": expanded.value ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
                  "--transform": "translateY(var(--translate)) scale(var(--scale))"
                },
                class: ui.value.base({ class: [props.ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
                "onUpdate:open": ($event) => onUpdateOpen($event, toast.id),
                onClick: ($event) => toast.onClick && toast.onClick(toast)
              }), null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(ToastPortal), unref(portalProps), {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ToastViewport), {
                    "data-expanded": expanded.value,
                    class: ui.value.viewport({ class: [props.ui?.viewport, props.class] }),
                    style: {
                      "--scale-factor": "0.05",
                      "--translate-factor": __props.position?.startsWith("top") ? "1px" : "-1px",
                      "--gap": __props.position?.startsWith("top") ? "16px" : "-16px",
                      "--front-height": `${frontHeight.value}px`,
                      "--height": `${height.value}px`
                    },
                    onMouseenter: ($event) => hovered.value = true,
                    onMouseleave: ($event) => hovered.value = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ToastViewport), {
                      "data-expanded": expanded.value,
                      class: ui.value.viewport({ class: [props.ui?.viewport, props.class] }),
                      style: {
                        "--scale-factor": "0.05",
                        "--translate-factor": __props.position?.startsWith("top") ? "1px" : "-1px",
                        "--gap": __props.position?.startsWith("top") ? "16px" : "-16px",
                        "--front-height": `${frontHeight.value}px`,
                        "--height": `${height.value}px`
                      },
                      onMouseenter: ($event) => hovered.value = true,
                      onMouseleave: ($event) => hovered.value = false
                    }, null, 8, ["data-expanded", "class", "style", "onMouseenter", "onMouseleave"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              (openBlock(true), createBlock(Fragment, null, renderList(unref(toasts), (toast, index2) => {
                return openBlock(), createBlock(_sfc_main$n, mergeProps({
                  key: toast.id,
                  ref_for: true,
                  ref_key: "refs",
                  ref: refs,
                  progress: __props.progress
                }, { ref_for: true }, unref(omit)(toast, ["id", "close"]), {
                  close: toast.close,
                  "data-expanded": expanded.value,
                  "data-front": !expanded.value && index2 === unref(toasts).length - 1,
                  style: {
                    "--index": index2 - unref(toasts).length + unref(toasts).length,
                    "--before": unref(toasts).length - 1 - index2,
                    "--offset": getOffset(index2),
                    "--scale": expanded.value ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
                    "--translate": expanded.value ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
                    "--transform": "translateY(var(--translate)) scale(var(--scale))"
                  },
                  class: ui.value.base({ class: [props.ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
                  "onUpdate:open": ($event) => onUpdateOpen($event, toast.id),
                  onClick: ($event) => toast.onClick && toast.onClick(toast)
                }), null, 16, ["progress", "close", "data-expanded", "data-front", "style", "class", "onUpdate:open", "onClick"]);
              }), 128)),
              createVNode(unref(ToastPortal), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(ToastViewport), {
                    "data-expanded": expanded.value,
                    class: ui.value.viewport({ class: [props.ui?.viewport, props.class] }),
                    style: {
                      "--scale-factor": "0.05",
                      "--translate-factor": __props.position?.startsWith("top") ? "1px" : "-1px",
                      "--gap": __props.position?.startsWith("top") ? "16px" : "-16px",
                      "--front-height": `${frontHeight.value}px`,
                      "--height": `${height.value}px`
                    },
                    onMouseenter: ($event) => hovered.value = true,
                    onMouseleave: ($event) => hovered.value = false
                  }, null, 8, ["data-expanded", "class", "style", "onMouseenter", "onMouseleave"])
                ]),
                _: 1
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const UToaster = Object.assign(_sfc_main$m, { __name: "UToaster" });
function _useOverlay() {
  const overlays = shallowReactive([]);
  const create = (component, _options) => {
    const { props, defaultOpen, destroyOnClose } = _options || {};
    const options = reactive({
      id: Symbol(""),
      isOpen: !!defaultOpen,
      component: markRaw(component),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      originalProps: props || {},
      props: { ...props }
    });
    overlays.push(options);
    return {
      ...options,
      open: (props2) => open(options.id, props2),
      close: (value) => close(options.id, value),
      patch: (props2) => patch(options.id, props2)
    };
  };
  const open = (id, props) => {
    const overlay = getOverlay(id);
    if (props) {
      overlay.props = { ...overlay.originalProps, ...props };
    } else {
      overlay.props = { ...overlay.originalProps };
    }
    overlay.isOpen = true;
    overlay.isMounted = true;
    const result = new Promise((resolve) => overlay.resolvePromise = resolve);
    return Object.assign(result, {
      id,
      isMounted: overlay.isMounted,
      isOpen: overlay.isOpen,
      result
    });
  };
  const close = (id, value) => {
    const overlay = getOverlay(id);
    overlay.isOpen = false;
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value);
      overlay.resolvePromise = void 0;
    }
  };
  const closeAll = () => {
    overlays.forEach((overlay) => close(overlay.id));
  };
  const unmount = (id) => {
    const overlay = getOverlay(id);
    overlay.isMounted = false;
    if (overlay.destroyOnClose) {
      const index2 = overlays.findIndex((overlay2) => overlay2.id === id);
      overlays.splice(index2, 1);
    }
  };
  const patch = (id, props) => {
    const overlay = getOverlay(id);
    overlay.props = { ...overlay.props, ...props };
  };
  const getOverlay = (id) => {
    const overlay = overlays.find((overlay2) => overlay2.id === id);
    if (!overlay) {
      throw new Error("Overlay not found");
    }
    return overlay;
  };
  const isOpen = (id) => {
    const overlay = getOverlay(id);
    return overlay.isOpen;
  };
  return {
    overlays,
    open,
    close,
    closeAll,
    create,
    patch,
    unmount,
    isOpen
  };
}
const useOverlay = /* @__PURE__ */ createSharedComposable(_useOverlay);
const _sfc_main$l = {
  __name: "UOverlayProvider",
  __ssrInlineRender: true,
  setup(__props) {
    const { overlays, unmount, close } = useOverlay();
    const mountedOverlays = computed(() => overlays.filter((overlay) => overlay.isMounted));
    const onAfterLeave = (id) => {
      close(id);
      unmount(id);
    };
    const onClose = (id, value) => {
      close(id, value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(mountedOverlays.value, (overlay) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(overlay.component), mergeProps({
          key: overlay.id
        }, { ref_for: true }, overlay.props, {
          open: overlay.isOpen,
          "onUpdate:open": ($event) => overlay.isOpen = $event,
          onClose: (value) => onClose(overlay.id, value),
          "onAfter:leave": ($event) => onAfterLeave(overlay.id)
        }), null), _parent);
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __default__ = {
  name: "App"
};
const _sfc_main$k = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  props: {
    tooltip: { type: Object, required: false },
    toaster: { type: [Object, null], required: false },
    locale: { type: Object, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: "body" },
    scrollBody: { type: [Boolean, Object], required: false },
    nonce: { type: String, required: false }
  },
  setup(__props) {
    const props = __props;
    const configProviderProps = useForwardProps(reactivePick(props, "scrollBody"));
    const tooltipProps = toRef(() => props.tooltip);
    const toasterProps = toRef(() => props.toaster);
    const locale = toRef(() => props.locale);
    provide(localeContextInjectionKey, locale);
    const portal = toRef(() => props.portal);
    provide(portalTargetInjectionKey, portal);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ConfigProvider), mergeProps({
        "use-id": () => useId(),
        dir: locale.value?.dir,
        locale: locale.value?.code
      }, unref(configProviderProps), _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TooltipProvider), tooltipProps.value, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.toaster !== null) {
                    _push3(ssrRenderComponent(UToaster, toasterProps.value, {
                      default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "default")
                          ];
                        }
                      }),
                      _: 3
                    }, _parent3, _scopeId2));
                  } else {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  }
                  _push3(ssrRenderComponent(_sfc_main$l, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    __props.toaster !== null ? (openBlock(), createBlock(UToaster, mergeProps({ key: 0 }, toasterProps.value), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 16)) : renderSlot(_ctx.$slots, "default", { key: 1 }),
                    createVNode(_sfc_main$l)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(TooltipProvider), tooltipProps.value, {
                default: withCtx(() => [
                  __props.toaster !== null ? (openBlock(), createBlock(UToaster, mergeProps({ key: 0 }, toasterProps.value), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 16)) : renderSlot(_ctx.$slots, "default", { key: 1 }),
                  createVNode(_sfc_main$l)
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/App.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$k, { __name: "UApp" });
const theme$a = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default ring ring-default flex focus:outline-none",
    "handle": [
      "shrink-0 !bg-accented",
      "transition-opacity"
    ],
    "container": "w-full flex flex-col gap-4 p-4 overflow-y-auto",
    "header": "",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "body": "flex-1",
    "footer": "flex flex-col gap-1.5"
  },
  "variants": {
    "direction": {
      "top": {
        "content": "mb-24 flex-col-reverse",
        "handle": "mb-4"
      },
      "right": {
        "content": "flex-row",
        "handle": "!ml-4"
      },
      "bottom": {
        "content": "mt-24 flex-col",
        "handle": "mt-4"
      },
      "left": {
        "content": "flex-row-reverse",
        "handle": "!mr-4"
      }
    },
    "inset": {
      "true": {
        "content": "rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]"
      }
    },
    "snapPoints": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "direction": [
        "top",
        "bottom"
      ],
      "class": {
        "content": "h-auto max-h-[96%]",
        "handle": "!w-12 !h-1.5 mx-auto"
      }
    },
    {
      "direction": [
        "top",
        "bottom"
      ],
      "snapPoints": true,
      "class": {
        "content": "h-full"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "class": {
        "content": "w-auto max-w-[calc(100%-2rem)]",
        "handle": "!h-12 !w-1.5 mt-auto mb-auto"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "snapPoints": true,
      "class": {
        "content": "w-full"
      }
    },
    {
      "direction": "top",
      "inset": true,
      "class": {
        "content": "inset-x-4 top-4"
      }
    },
    {
      "direction": "top",
      "inset": false,
      "class": {
        "content": "inset-x-0 top-0 rounded-b-lg"
      }
    },
    {
      "direction": "bottom",
      "inset": true,
      "class": {
        "content": "inset-x-4 bottom-4"
      }
    },
    {
      "direction": "bottom",
      "inset": false,
      "class": {
        "content": "inset-x-0 bottom-0 rounded-t-lg"
      }
    },
    {
      "direction": "left",
      "inset": true,
      "class": {
        "content": "inset-y-4 left-4"
      }
    },
    {
      "direction": "left",
      "inset": false,
      "class": {
        "content": "inset-y-0 left-0 rounded-r-lg"
      }
    },
    {
      "direction": "right",
      "inset": true,
      "class": {
        "content": "inset-y-4 right-4"
      }
    },
    {
      "direction": "right",
      "inset": false,
      "class": {
        "content": "inset-y-0 right-0 rounded-l-lg"
      }
    }
  ]
};
const _sfc_main$j = {
  __name: "UDrawer",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    inset: { type: Boolean, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    handle: { type: Boolean, required: false, default: true },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    nested: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    activeSnapPoint: { type: [Number, String, null], required: false },
    closeThreshold: { type: Number, required: false },
    shouldScaleBackground: { type: Boolean, required: false },
    setBackgroundColorOnScale: { type: Boolean, required: false },
    scrollLockTimeout: { type: Number, required: false },
    fixed: { type: Boolean, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    modal: { type: Boolean, required: false, default: true },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    direction: { type: String, required: false, default: "bottom" },
    noBodyStyles: { type: Boolean, required: false },
    handleOnly: { type: Boolean, required: false },
    preventScrollRestoration: { type: Boolean, required: false },
    snapPoints: { type: Array, required: false }
  },
  emits: ["close:prevent", "drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      const defaultEvents = {
        closeAutoFocus: (e) => e.preventDefault()
      };
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, defaultEvents);
      }
      return defaultEvents;
    });
    const ui = computed(() => tv({ extend: tv(theme$a), ...appConfig2.ui?.drawer || {} })({
      direction: props.direction,
      inset: props.inset,
      snapPoints: props.snapPoints && props.snapPoints.length > 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.nested ? unref(DrawerRootNested) : unref(DrawerRoot)), mergeProps(unref(rootProps), _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(ssrRenderComponent(unref(DrawerTrigger), {
                "as-child": "",
                class: props.class
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default")
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(DrawerPortal), unref(portalProps), {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.overlay) {
                    _push3(ssrRenderComponent(unref(DrawerOverlay), {
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(DrawerContent), mergeProps({
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, toHandlers(contentEvents.value)), {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.handle) {
                          _push4(ssrRenderComponent(unref(DrawerHandle), {
                            class: ui.value.handle({ class: props.ui?.handle })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (!!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description))) {
                          _push4(ssrRenderComponent(unref(VisuallyHidden), null, {
                            default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.title || !!slots.title) {
                                  _push5(ssrRenderComponent(unref(DrawerTitle), null, {
                                    default: withCtx((_6, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                          _push6(`${ssrInterpolate(__props.title)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 3
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.description || !!slots.description) {
                                  _push5(ssrRenderComponent(unref(DrawerDescription), null, {
                                    default: withCtx((_6, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                          _push6(`${ssrInterpolate(__props.description)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 3
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 3
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                          _push4(`<div class="${ssrRenderClass(ui.value.container({ class: props.ui?.container }))}"${_scopeId3}>`);
                          if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description)) {
                            _push4(`<div class="${ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "header", {}, () => {
                              if (__props.title || !!slots.title) {
                                _push4(ssrRenderComponent(unref(DrawerTitle), {
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                        _push5(`${ssrInterpolate(__props.title)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 3
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              if (__props.description || !!slots.description) {
                                _push4(ssrRenderComponent(unref(DrawerDescription), {
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                        _push5(`${ssrInterpolate(__props.description)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 3
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                            }, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.body) {
                            _push4(`<div class="${ssrRenderClass(ui.value.body({ class: props.ui?.body }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "body", {}, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.footer) {
                            _push4(`<div class="${ssrRenderClass(ui.value.footer({ class: props.ui?.footer }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                            key: 0,
                            class: ui.value.handle({ class: props.ui?.handle })
                          }, null, 8, ["class"])) : createCommentVNode("", true),
                          !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 1 }, {
                            default: withCtx(() => [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "content", {}, () => [
                            createVNode("div", {
                              class: ui.value.container({ class: props.ui?.container })
                            }, [
                              !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: ui.value.header({ class: props.ui?.header })
                              }, [
                                renderSlot(_ctx.$slots, "header", {}, () => [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                    key: 0,
                                    class: ui.value.title({ class: props.ui?.title })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                    key: 1,
                                    class: ui.value.description({ class: props.ui?.description })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ])
                              ], 2)) : createCommentVNode("", true),
                              !!slots.body ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: ui.value.body({ class: props.ui?.body })
                              }, [
                                renderSlot(_ctx.$slots, "body")
                              ], 2)) : createCommentVNode("", true),
                              !!slots.footer ? (openBlock(), createBlock("div", {
                                key: 2,
                                class: ui.value.footer({ class: props.ui?.footer })
                              }, [
                                renderSlot(_ctx.$slots, "footer")
                              ], 2)) : createCommentVNode("", true)
                            ], 2)
                          ])
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                      key: 0,
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true),
                    createVNode(unref(DrawerContent), mergeProps({
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, contentProps.value, toHandlers(contentEvents.value)), {
                      default: withCtx(() => [
                        __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                          key: 0,
                          class: ui.value.handle({ class: props.ui?.handle })
                        }, null, 8, ["class"])) : createCommentVNode("", true),
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 1 }, {
                          default: withCtx(() => [
                            __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "title", {}, () => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "description", {}, () => [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true)
                          ]),
                          _: 3
                        })) : createCommentVNode("", true),
                        renderSlot(_ctx.$slots, "content", {}, () => [
                          createVNode("div", {
                            class: ui.value.container({ class: props.ui?.container })
                          }, [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: ui.value.header({ class: props.ui?.header })
                            }, [
                              renderSlot(_ctx.$slots, "header", {}, () => [
                                __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                  key: 0,
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "title", {}, () => [
                                      createTextVNode(toDisplayString(__props.title), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : createCommentVNode("", true),
                                __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                  key: 1,
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "description", {}, () => [
                                      createTextVNode(toDisplayString(__props.description), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ])
                            ], 2)) : createCommentVNode("", true),
                            !!slots.body ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: ui.value.body({ class: props.ui?.body })
                            }, [
                              renderSlot(_ctx.$slots, "body")
                            ], 2)) : createCommentVNode("", true),
                            !!slots.footer ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: ui.value.footer({ class: props.ui?.footer })
                            }, [
                              renderSlot(_ctx.$slots, "footer")
                            ], 2)) : createCommentVNode("", true)
                          ], 2)
                        ])
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (openBlock(), createBlock(unref(DrawerTrigger), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 8, ["class"])) : createCommentVNode("", true),
              createVNode(unref(DrawerPortal), unref(portalProps), {
                default: withCtx(() => [
                  __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                    key: 0,
                    class: ui.value.overlay({ class: props.ui?.overlay })
                  }, null, 8, ["class"])) : createCommentVNode("", true),
                  createVNode(unref(DrawerContent), mergeProps({
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, toHandlers(contentEvents.value)), {
                    default: withCtx(() => [
                      __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                        key: 0,
                        class: ui.value.handle({ class: props.ui?.handle })
                      }, null, 8, ["class"])) : createCommentVNode("", true),
                      !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 1 }, {
                        default: withCtx(() => [
                          __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "title", {}, () => [
                                createTextVNode(toDisplayString(__props.title), 1)
                              ])
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "description", {}, () => [
                                createTextVNode(toDisplayString(__props.description), 1)
                              ])
                            ]),
                            _: 3
                          })) : createCommentVNode("", true)
                        ]),
                        _: 3
                      })) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "content", {}, () => [
                        createVNode("div", {
                          class: ui.value.container({ class: props.ui?.container })
                        }, [
                          !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ui.value.header({ class: props.ui?.header })
                          }, [
                            renderSlot(_ctx.$slots, "header", {}, () => [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                key: 0,
                                class: ui.value.title({ class: props.ui?.title })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                key: 1,
                                class: ui.value.description({ class: props.ui?.description })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : createCommentVNode("", true)
                            ])
                          ], 2)) : createCommentVNode("", true),
                          !!slots.body ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: ui.value.body({ class: props.ui?.body })
                          }, [
                            renderSlot(_ctx.$slots, "body")
                          ], 2)) : createCommentVNode("", true),
                          !!slots.footer ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: ui.value.footer({ class: props.ui?.footer })
                          }, [
                            renderSlot(_ctx.$slots, "footer")
                          ], 2)) : createCommentVNode("", true)
                        ], 2)
                      ])
                    ]),
                    _: 3
                  }, 16, ["class"])
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const theme$9 = {
  "slots": {
    "content": "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
    "arrow": "fill-default"
  }
};
const _sfc_main$i = {
  __name: "UPopover",
  __ssrInlineRender: true,
  props: {
    mode: { type: String, required: false, default: "click" },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    modal: { type: Boolean, required: false },
    openDelay: { type: Number, required: false, default: 0 },
    closeDelay: { type: Number, required: false, default: 0 }
  },
  emits: ["close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const pick2 = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay") : reactivePick(props, "defaultOpen", "open", "modal");
    const rootProps = useForwardPropsEmits(pick2, emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {};
    });
    const arrowProps = toRef(() => props.arrow);
    const ui = computed(() => tv({ extend: tv(theme$9), ...appConfig2.ui?.popover || {} })({
      side: contentProps.value.side
    }));
    const Component = computed(() => props.mode === "hover" ? HoverCard : Popover);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Component).Root, mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!__props.reference) {
              _push2(ssrRenderComponent(unref(Component).Trigger, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if ("Anchor" in Component.value && !!slots.anchor) {
              _push2(ssrRenderComponent(unref(Component).Anchor, { "as-child": "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "anchor", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "anchor")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Component).Portal, unref(portalProps), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Component).Content, mergeProps(contentProps.value, {
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, toHandlers(contentEvents.value)), {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "content", {}, null, _push4, _parent4, _scopeId3);
                        if (!!__props.arrow) {
                          _push4(ssrRenderComponent(unref(Component).Arrow, mergeProps(arrowProps.value, {
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "content"),
                          !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, toHandlers(contentEvents.value)), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "content"),
                        !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                          class: ui.value.arrow({ class: props.ui?.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!__props.reference ? (openBlock(), createBlock(unref(Component).Trigger, {
                key: 0,
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["reference", "class"])) : createCommentVNode("", true),
              "Anchor" in Component.value && !!slots.anchor ? (openBlock(), createBlock(unref(Component).Anchor, {
                key: 1,
                "as-child": ""
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "anchor")
                ]),
                _: 3
              })) : createCommentVNode("", true),
              createVNode(unref(Component).Portal, unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, toHandlers(contentEvents.value)), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "content"),
                      !!__props.arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                        class: ui.value.arrow({ class: props.ui?.arrow })
                      }), null, 16, ["class"])) : createCommentVNode("", true)
                    ]),
                    _: 3
                  }, 16, ["class"])
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Popover.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
var audioCtx = null;
var masterGain = null;
var mixBus = null;
var listener = null;
const usePlayerStore = defineStore("player", {
  state: () => ({
    analyser: null,
    trackList: [],
    audioBuffers: [],
    isStarted: false,
    timerId: null,
    activeSources: [],
    eqNodes: [],
    eqInput: null,
    currentTrack: {
      index: -1,
      startTime: 0,
      duration: 0,
      bufferStart: 0,
      startPoint: 0,
      endPoint: 0,
      fileDuration: 0,
      bpm: 0,
      rmsData: []
    },
    fadeDuration: 4,
    fadeOutDuration: 15,
    trackStartTime: 0,
    audioVolume: 0.1,
    currentTime: 0,
    isVibeAuto: true,
    isFlashEnabled: true,
    transitionState: {
      active: false,
      fromName: ""
    },
    processingState: {
      isProcessing: false,
      current: 0,
      total: 0
    },
    uniforms: {
      u_time: { value: 0 },
      u_speed: { value: 1 },
      u_intensity: { value: 0.15 },
      u_partical_size: { value: 265 },
      u_color_a: { value: "#3f3089" },
      u_color_b: { value: "#00bcff" },
      u_bass: { value: 0 },
      u_high: { value: 0 }
    }
  }),
  actions: {
    init() {
      audioCtx = THREE.AudioContext.getContext();
      listener = new AudioListener();
      masterGain = audioCtx.createGain();
      masterGain.connect(listener.getInput());
      mixBus = audioCtx.createGain();
      mixBus.connect(masterGain);
      this.analyser = new THREE.AudioAnalyser(new THREE.Audio(listener), 256);
      mixBus.connect(this.analyser.analyser);
      this.initEqualizer();
    },
    initEqualizer() {
      if (!audioCtx || !mixBus) return;
      const frequencies = [60, 150, 400, 1e3, 2400, 6e3, 15e3];
      this.eqInput = audioCtx.createGain();
      let previousNode = this.eqInput;
      frequencies.forEach((freq, index2) => {
        const filter = audioCtx.createBiquadFilter();
        if (index2 === 0) filter.type = "lowshelf";
        else if (index2 === frequencies.length - 1) filter.type = "highshelf";
        else filter.type = "peaking";
        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1;
        previousNode.connect(filter);
        previousNode = filter;
        this.eqNodes.push(filter);
      });
      previousNode.connect(mixBus);
    },
    setEqGain(index2, val) {
      if (this.eqNodes[index2]) {
        this.eqNodes[index2].gain.value = val;
      }
    },
    setFadeDuration(val) {
      this.fadeDuration = val;
    },
    setAudioVolume(volume) {
      this.audioVolume = volume;
      if (masterGain) {
        masterGain.gain.setValueAtTime(volume, masterGain.context.currentTime);
      }
    },
    updateCurrentTime(ctxTime) {
      this.currentTime = ctxTime;
    },
    setCurrentTrack(data) {
      this.currentTrack = data;
    },
    getProgress() {
      const elapsed = this.currentTime - this.currentTrack.startTime;
      return Math.min(Math.max(elapsed / this.currentTrack.duration, 0), 1);
    },
    getFileProgress() {
      if (!this.currentTrack.fileDuration || this.currentTrack.fileDuration === 0) return 0;
      const playedTime = Math.max(0, this.currentTime - this.currentTrack.startTime);
      const currentFilePos = this.currentTrack.startPoint + playedTime;
      return Math.min(Math.max(currentFilePos / this.currentTrack.fileDuration, 0), 1);
    },
    getLowEnergy() {
      const data = this.getFrequencyData();
      return data.bass * 255;
    },
    getFrequencyData() {
      if (!this.analyser) return { bass: 0, mid: 0, high: 0 };
      const data = this.analyser.getFrequencyData();
      let bass = 0;
      let mid = 0;
      let high = 0;
      for (let i = 0; i < 3; i++) bass += data[i];
      bass /= 3;
      for (let i = 3; i < 20; i++) mid += data[i];
      mid /= 17;
      for (let i = 20; i < 100; i++) high += data[i];
      high /= 80;
      return {
        // Normalize 0-255 to 0-1
        bass: bass / 255,
        mid: mid / 255,
        high: high / 255
      };
    },
    async addTracks(newTracks) {
      if (!audioCtx) return;
      this.processingState.isProcessing = true;
      this.processingState.total = newTracks.length;
      this.processingState.current = 0;
      return;
    },
    determineVibe(bpm, energy, brightness) {
      console.log(`[VibeCheck] BPM: ${bpm}, Energy: ${energy?.toFixed(3)}, Brightness: ${brightness?.toFixed(3)}`);
      if (bpm > 135 && energy > 0.3) {
        return { name: "Rage", colorA: "#ff2929", colorB: "#ffaa00", speed: 2.5, intensity: 0.25 };
      }
      if (bpm < 100 && energy < 0.15) {
        return { name: "Chill", colorA: "#00d2ff", colorB: "#3a7bd5", speed: 0.5, intensity: 0.1 };
      }
      if (brightness < 0.05) {
        return { name: "Deep", colorA: "#0f0c29", colorB: "#302b63", speed: 0.8, intensity: 0.2 };
      }
      if (brightness > 0.15) {
        return { name: "Pop", colorA: "#FF0099", colorB: "#493240", speed: 1.2, intensity: 0.18 };
      }
      return { name: "Neutral", colorA: "#3f3089", colorB: "#00bcff", speed: 1, intensity: 0.15 };
    },
    reorderTracks(from, to) {
      if (from === to) return;
      const track = this.trackList.splice(from, 1)[0];
      this.trackList.splice(to, 0, track);
      const buffer = this.audioBuffers.splice(from, 1)[0];
      this.audioBuffers.splice(to, 0, buffer);
      if (this.currentTrack.index === from) {
        this.currentTrack.index = to;
      } else if (this.currentTrack.index > from && this.currentTrack.index <= to) {
        this.currentTrack.index--;
      } else if (this.currentTrack.index < from && this.currentTrack.index >= to) {
        this.currentTrack.index++;
      }
    },
    stop() {
      if (this.timerId) clearTimeout(this.timerId);
      this.activeSources.forEach((source) => {
        try {
          source.stop();
        } catch (e) {
        }
      });
      this.activeSources = [];
    },
    seek(progress) {
      if (!audioCtx || this.currentTrack.index === -1) return;
      this.stop();
      const trackData = this.currentTrack;
      const buffer = this.audioBuffers[trackData.index];
      const startPoint = trackData.bufferStart;
      const playDuration = trackData.duration;
      const offset = startPoint + playDuration * progress;
      const remainingDuration = playDuration * (1 - progress);
      const when = audioCtx.currentTime;
      const source = audioCtx.createBufferSource();
      source.buffer = buffer.buffer;
      const gain = audioCtx.createGain();
      source.connect(gain);
      gain.connect(this.eqInput || masterGain);
      source.start(when, offset);
      source.stop(when + remainingDuration);
      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx > -1) this.activeSources.splice(idx, 1);
      };
      this.setCurrentTrack({
        ...trackData,
        startTime: when - playDuration * progress
      });
      const reconstructedTrackData = {
        source,
        gain,
        startPoint: trackData.bufferStart,
        endPoint: trackData.endPoint,
        playDuration: trackData.duration,
        rmsValues: trackData.rmsData,
        startTime: this.currentTrack.startTime,
        // Should be this updated time
        bpm: trackData.bpm,
        fileDuration: trackData.fileDuration,
        vibe: trackData.vibe
      };
      this.queueNext(trackData.index, reconstructedTrackData);
    },
    playTrack(index2) {
      if (!audioCtx) return;
      this.stop();
      const track = this.scheduleTrack(index2, audioCtx.currentTime);
      this.queueNext(index2, track);
    },
    scheduleTrack(index2, when) {
      if (!audioCtx || !masterGain) {
        throw new Error("Audio context not initialized");
      }
      console.log(`Scheduling track ${index2} at ${when.toFixed(2)}s`);
      const bufferData = this.audioBuffers[index2];
      if (!bufferData) throw new Error(`Buffer at index ${index2} is undefined`);
      const buffer = bufferData.buffer;
      const allRmsValues = bufferData.rmsValues;
      const startPoint = bufferData.startPoint;
      const endPoint = bufferData.endPoint;
      let playDuration = endPoint - startPoint;
      const currentBPM = bufferData.bpm;
      const sr = buffer.sampleRate;
      const hopSize = Math.floor(buffer.length / allRmsValues.length);
      const startIndex = Math.floor(startPoint * sr / hopSize);
      const endIndex = Math.floor(endPoint * sr / hopSize);
      allRmsValues.slice(startIndex, endIndex);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx > -1) this.activeSources.splice(idx, 1);
      };
      const gain = audioCtx.createGain();
      source.connect(gain);
      gain.connect(this.eqInput || masterGain);
      source.start(when, startPoint);
      source.stop(when + playDuration);
      console.log(`Scheduled track ${index2} to start at ${when.toFixed(2)}s (startPoint: ${startPoint.toFixed(2)}s, endPoint: ${endPoint.toFixed(2)}s, duration: ${playDuration.toFixed(2)}s)`);
      const fileDuration = buffer.duration;
      const vibe = bufferData.vibe;
      return { source, gain, startPoint, endPoint, playDuration, rmsValues: allRmsValues, startTime: when, bpm: currentBPM, fileDuration, vibe };
    },
    queueNext(index2, trackData) {
      console.log("Scheduling next track...");
      const vibe = trackData.vibe || { name: "Neutral", colorA: "#3f3089", colorB: "#00bcff", speed: 1 };
      this.setCurrentTrack({
        index: index2,
        startTime: trackData.startTime,
        duration: trackData.playDuration,
        bufferStart: trackData.startPoint,
        bpm: trackData.bpm,
        startPoint: trackData.startPoint,
        endPoint: trackData.endPoint,
        fileDuration: trackData.fileDuration,
        rmsData: markRaw(trackData.rmsValues),
        vibe
      });
      const nextStartTime = trackData.startTime + (trackData.playDuration - this.fadeOutDuration);
      const now = audioCtx.currentTime;
      let delay = nextStartTime - now;
      if (delay < 0) delay = 0;
      const msUntilNextQueue = delay * 1e3;
      this.timerId = setTimeout(() => {
        const activeIndex = this.currentTrack.index;
        const nextIndex = activeIndex + 1;
        if (nextIndex >= this.audioBuffers.length) {
          console.log("Reached end of playlist.");
          return;
        }
        const fromName = this.trackList[activeIndex].name?.replace(/\.[^/.]+$/, "") || "Track";
        this.transitionState = { active: true, fromName };
        setTimeout(() => {
          this.transitionState = { active: false, fromName: "" };
        }, this.fadeDuration * 1e3);
        const nextTrack = this.scheduleTrack(nextIndex, nextStartTime);
        console.log(`[QueueNext] Switching to Track ${nextIndex}.`);
        console.log(`[QueueNext] Scheduled StartTime: ${nextStartTime.toFixed(3)}`);
        console.log(`[QueueNext] Actual AudioCtx Time: ${audioCtx.currentTime.toFixed(3)}`);
        console.log(`[QueueNext] Diff (Delay): ${(audioCtx.currentTime - nextStartTime).toFixed(3)}s`);
        try {
          trackData.gain.gain.setValueAtTime(1, nextStartTime);
          trackData.gain.gain.linearRampToValueAtTime(0, nextStartTime + this.fadeOutDuration);
        } catch (e) {
          console.warn("Gain auto error", e);
        }
        nextTrack.gain.gain.linearRampToValueAtTime(0, nextStartTime);
        nextTrack.gain.gain.linearRampToValueAtTime(1, nextStartTime + this.fadeDuration);
        let playbackRate = 1;
        try {
          if (trackData.bpm > 0 && nextTrack.bpm > 0) {
            playbackRate = nextTrack.bpm / trackData.bpm;
          }
          trackData.source.playbackRate.setValueAtTime(1, nextStartTime);
          trackData.source.playbackRate.linearRampToValueAtTime(playbackRate, nextStartTime + this.fadeOutDuration);
        } catch (e) {
        }
        nextTrack.source.playbackRate.setValueAtTime(1, nextStartTime);
        this.queueNext(nextIndex, nextTrack);
      }, msUntilNextQueue);
    },
    startPlayer() {
      if (this.audioBuffers.length === 0 || !audioCtx) return;
      this.stop();
      this.isStarted = true;
      const firstTrack = this.scheduleTrack(0, audioCtx.currentTime);
      this.queueNext(0, firstTrack);
    },
    pausePlayer() {
      if (!audioCtx) return;
      if (audioCtx.state === "running") {
        audioCtx.suspend();
      } else if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    },
    getTrackData() {
      return this.currentTrack;
    },
    getAudioContext() {
      return audioCtx;
    }
  }
});
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "Waveform",
  __ssrInlineRender: true,
  setup(__props) {
    const player = usePlayerStore();
    const canvasRef = ref(null);
    ref([]);
    computed(() => player.getFileProgress());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<canvas${ssrRenderAttrs(mergeProps({
        ref_key: "canvasRef",
        ref: canvasRef,
        class: "w-full h-full cursor-pointer"
      }, _attrs))}></canvas>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Waveform.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$h, { __name: "Waveform" });
const kbdKeysMap = {
  meta: "",
  ctrl: "",
  alt: "",
  win: "⊞",
  command: "⌘",
  shift: "⇧",
  control: "⌃",
  option: "⌥",
  enter: "↵",
  delete: "⌦",
  backspace: "⌫",
  escape: "Esc",
  tab: "⇥",
  capslock: "⇪",
  arrowup: "↑",
  arrowright: "→",
  arrowdown: "↓",
  arrowleft: "←",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘"
};
const _useKbd = () => {
  const macOS = computed(() => false);
  const kbdKeysSpecificMap = reactive({
    meta: " ",
    alt: " ",
    ctrl: " "
  });
  function getKbdKey(value) {
    if (!value) {
      return;
    }
    if (["meta", "alt", "ctrl"].includes(value)) {
      return kbdKeysSpecificMap[value];
    }
    return kbdKeysMap[value] || value.toUpperCase();
  }
  return {
    macOS,
    getKbdKey
  };
};
const useKbd = /* @__PURE__ */ createSharedComposable(_useKbd);
const theme$8 = {
  "base": "inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans",
  "variants": {
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "sm": "h-4 min-w-[16px] text-[10px]",
      "md": "h-5 min-w-[20px] text-[11px]",
      "lg": "h-6 min-w-[24px] text-[12px]"
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "text-inverted bg-primary"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "text-inverted bg-secondary"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "text-inverted bg-success"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "text-inverted bg-info"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "text-inverted bg-warning"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "text-inverted bg-error"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "ring ring-inset ring-primary/50 text-primary"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "ring ring-inset ring-secondary/50 text-secondary"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "ring ring-inset ring-success/50 text-success"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "ring ring-inset ring-info/50 text-info"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "ring ring-inset ring-warning/50 text-warning"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "ring ring-inset ring-error/50 text-error"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "text-primary bg-primary/10"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "text-secondary bg-secondary/10"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "text-success bg-success/10"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "text-info bg-info/10"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "text-warning bg-warning/10"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "text-error bg-error/10"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "text-primary ring ring-inset ring-primary/25 bg-primary/10"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "text-success ring ring-inset ring-success/25 bg-success/10"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "text-info ring ring-inset ring-info/25 bg-info/10"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "text-warning ring ring-inset ring-warning/25 bg-warning/10"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "text-error ring ring-inset ring-error/25 bg-error/10"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated"
    }
  ],
  "defaultVariants": {
    "variant": "outline",
    "color": "neutral",
    "size": "md"
  }
};
const _sfc_main$g = {
  __name: "UKbd",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "kbd" },
    value: { type: null, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    class: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const { getKbdKey } = useKbd();
    const appConfig2 = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme$8), ...appConfig2.ui?.kbd || {} }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value({ class: props.class, color: props.color, variant: props.variant, size: props.size })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(`${ssrInterpolate(unref(getKbdKey)(__props.value))}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createTextVNode(toDisplayString(unref(getKbdKey)(__props.value)), 1)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const theme$7 = {
  "slots": {
    "content": "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
    "arrow": "fill-default",
    "text": "truncate",
    "kbds": "hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['·'] not-first-of-type:before:me-0.5",
    "kbdsSize": "sm"
  }
};
const _sfc_main$f = {
  __name: "UTooltip",
  __ssrInlineRender: true,
  props: {
    text: { type: String, required: false },
    kbds: { type: Array, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    delayDuration: { type: Number, required: false },
    disableHoverableContent: { type: Boolean, required: false },
    disableClosingTrigger: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    ignoreNonKeyboardFocus: { type: Boolean, required: false }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const arrowProps = toRef(() => props.arrow);
    const ui = computed(() => tv({ extend: tv(theme$7), ...appConfig2.ui?.tooltip || {} })({
      side: contentProps.value.side
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipRoot), mergeProps(unref(rootProps), {
        disabled: !(__props.text || __props.kbds?.length || !!slots.content) || props.disabled
      }, _attrs), {
        default: withCtx(({ open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!__props.reference) {
              _push2(ssrRenderComponent(unref(TooltipTrigger), mergeProps(_ctx.$attrs, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }), {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(TooltipPortal), unref(portalProps), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(TooltipContent), mergeProps(contentProps.value, {
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }), {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                          if (__props.text) {
                            _push4(`<span class="${ssrRenderClass(ui.value.text({ class: props.ui?.text }))}"${_scopeId3}>${ssrInterpolate(__props.text)}</span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (__props.kbds?.length) {
                            _push4(`<span class="${ssrRenderClass(ui.value.kbds({ class: props.ui?.kbds }))}"${_scopeId3}><!--[-->`);
                            ssrRenderList(__props.kbds, (kbd, index2) => {
                              _push4(ssrRenderComponent(_sfc_main$g, mergeProps({
                                key: index2,
                                size: props.ui?.kbdsSize || ui.value.kbdsSize()
                              }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, _parent4, _scopeId3));
                            });
                            _push4(`<!--]--></span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        }, _push4, _parent4, _scopeId3);
                        if (!!__props.arrow) {
                          _push4(ssrRenderComponent(unref(TooltipArrow), mergeProps(arrowProps.value, {
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "content", {}, () => [
                            __props.text ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: ui.value.text({ class: props.ui?.text })
                            }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                            __props.kbds?.length ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: ui.value.kbds({ class: props.ui?.kbds })
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index2) => {
                                return openBlock(), createBlock(_sfc_main$g, mergeProps({
                                  key: index2,
                                  size: props.ui?.kbdsSize || ui.value.kbdsSize()
                                }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                              }), 128))
                            ], 2)) : createCommentVNode("", true)
                          ]),
                          !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow), mergeProps({ key: 0 }, arrowProps.value, {
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(TooltipContent), mergeProps(contentProps.value, {
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "content", {}, () => [
                          __props.text ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: ui.value.text({ class: props.ui?.text })
                          }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                          __props.kbds?.length ? (openBlock(), createBlock("span", {
                            key: 1,
                            class: ui.value.kbds({ class: props.ui?.kbds })
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index2) => {
                              return openBlock(), createBlock(_sfc_main$g, mergeProps({
                                key: index2,
                                size: props.ui?.kbdsSize || ui.value.kbdsSize()
                              }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                            }), 128))
                          ], 2)) : createCommentVNode("", true)
                        ]),
                        !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow), mergeProps({ key: 0 }, arrowProps.value, {
                          class: ui.value.arrow({ class: props.ui?.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!__props.reference ? (openBlock(), createBlock(unref(TooltipTrigger), mergeProps({ key: 0 }, _ctx.$attrs, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1040, ["reference", "class"])) : createCommentVNode("", true),
              createVNode(unref(TooltipPortal), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(TooltipContent), mergeProps(contentProps.value, {
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "content", {}, () => [
                        __props.text ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: ui.value.text({ class: props.ui?.text })
                        }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                        __props.kbds?.length ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: ui.value.kbds({ class: props.ui?.kbds })
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index2) => {
                            return openBlock(), createBlock(_sfc_main$g, mergeProps({
                              key: index2,
                              size: props.ui?.kbdsSize || ui.value.kbdsSize()
                            }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                          }), 128))
                        ], 2)) : createCommentVNode("", true)
                      ]),
                      !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow), mergeProps({ key: 0 }, arrowProps.value, {
                        class: ui.value.arrow({ class: props.ui?.arrow })
                      }), null, 16, ["class"])) : createCommentVNode("", true)
                    ]),
                    _: 3
                  }, 16, ["class"])
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const theme$6 = {
  "slots": {
    "root": "relative flex items-center select-none touch-none",
    "track": "relative bg-accented overflow-hidden rounded-full grow",
    "range": "absolute rounded-full",
    "thumb": "rounded-full bg-default ring-2 focus-visible:outline-2 focus-visible:outline-offset-2"
  },
  "variants": {
    "color": {
      "primary": {
        "range": "bg-primary",
        "thumb": "ring-primary focus-visible:outline-primary/50"
      },
      "secondary": {
        "range": "bg-secondary",
        "thumb": "ring-secondary focus-visible:outline-secondary/50"
      },
      "success": {
        "range": "bg-success",
        "thumb": "ring-success focus-visible:outline-success/50"
      },
      "info": {
        "range": "bg-info",
        "thumb": "ring-info focus-visible:outline-info/50"
      },
      "warning": {
        "range": "bg-warning",
        "thumb": "ring-warning focus-visible:outline-warning/50"
      },
      "error": {
        "range": "bg-error",
        "thumb": "ring-error focus-visible:outline-error/50"
      },
      "neutral": {
        "range": "bg-inverted",
        "thumb": "ring-inverted focus-visible:outline-inverted/50"
      }
    },
    "size": {
      "xs": {
        "thumb": "size-3"
      },
      "sm": {
        "thumb": "size-3.5"
      },
      "md": {
        "thumb": "size-4"
      },
      "lg": {
        "thumb": "size-4.5"
      },
      "xl": {
        "thumb": "size-5"
      }
    },
    "orientation": {
      "horizontal": {
        "root": "w-full",
        "range": "h-full"
      },
      "vertical": {
        "root": "flex-col h-full",
        "range": "w-full"
      }
    },
    "disabled": {
      "true": {
        "root": "opacity-75 cursor-not-allowed"
      }
    }
  },
  "compoundVariants": [
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": {
        "track": "h-[6px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": {
        "track": "h-[7px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": {
        "track": "h-[8px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": {
        "track": "h-[9px]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": {
        "track": "h-[10px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": {
        "track": "w-[6px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": {
        "track": "w-[7px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": {
        "track": "w-[8px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": {
        "track": "w-[9px]"
      }
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": {
        "track": "w-[10px]"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary"
  }
};
const _sfc_main$e = {
  __name: "USlider",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    size: { type: null, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    tooltip: { type: [Boolean, Object], required: false },
    defaultValue: { type: [Number, Array], required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    name: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    inverted: { type: Boolean, required: false },
    min: { type: Number, required: false, default: 0 },
    max: { type: Number, required: false, default: 100 },
    step: { type: Number, required: false, default: 1 },
    minStepsBetweenThumbs: { type: Number, required: false }
  }, {
    "modelValue": { type: null },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useModel(__props, "modelValue");
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "orientation", "min", "max", "step", "minStepsBetweenThumbs", "inverted"), emits);
    const { id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
    const defaultSliderValue = computed(() => {
      if (typeof props.defaultValue === "number") {
        return [props.defaultValue];
      }
      return props.defaultValue;
    });
    const sliderValue = computed({
      get() {
        if (typeof modelValue.value === "number") {
          return [modelValue.value];
        }
        return modelValue.value ?? defaultSliderValue.value;
      },
      set(value) {
        modelValue.value = value?.length !== 1 ? value : value[0];
      }
    });
    const thumbs = computed(() => sliderValue.value?.length ?? 1);
    const ui = computed(() => tv({ extend: tv(theme$6), ...appConfig2.ui?.slider || {} })({
      disabled: disabled.value,
      size: size.value,
      color: color.value,
      orientation: props.orientation
    }));
    function onChange(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SliderRoot), mergeProps({ ...unref(rootProps), ...unref(ariaAttrs) }, {
        id: unref(id),
        modelValue: sliderValue.value,
        "onUpdate:modelValue": [($event) => sliderValue.value = $event, ($event) => unref(emitFormInput)()],
        name: unref(name),
        disabled: unref(disabled),
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        "default-value": defaultSliderValue.value,
        onValueCommit: onChange
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SliderTrack), {
              class: ui.value.track({ class: props.ui?.track })
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(SliderRange), {
                    class: ui.value.range({ class: props.ui?.range })
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SliderRange), {
                      class: ui.value.range({ class: props.ui?.range })
                    }, null, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(thumbs.value, (thumb) => {
              _push2(`<!--[-->`);
              if (!!__props.tooltip) {
                _push2(ssrRenderComponent(_sfc_main$f, mergeProps({
                  text: thumbs.value > 1 ? String(sliderValue.value?.[thumb - 1]) : String(sliderValue.value),
                  "disable-closing-trigger": ""
                }, { ref_for: true }, typeof __props.tooltip === "object" ? __props.tooltip : {}), {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(SliderThumb), {
                        class: ui.value.thumb({ class: props.ui?.thumb })
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(SliderThumb), {
                          class: ui.value.thumb({ class: props.ui?.thumb })
                        }, null, 8, ["class"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(SliderThumb), {
                  class: ui.value.thumb({ class: props.ui?.thumb })
                }, null, _parent2, _scopeId));
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              createVNode(unref(SliderTrack), {
                class: ui.value.track({ class: props.ui?.track })
              }, {
                default: withCtx(() => [
                  createVNode(unref(SliderRange), {
                    class: ui.value.range({ class: props.ui?.range })
                  }, null, 8, ["class"])
                ]),
                _: 1
              }, 8, ["class"]),
              (openBlock(true), createBlock(Fragment, null, renderList(thumbs.value, (thumb) => {
                return openBlock(), createBlock(Fragment, { key: thumb }, [
                  !!__props.tooltip ? (openBlock(), createBlock(_sfc_main$f, mergeProps({
                    key: 0,
                    text: thumbs.value > 1 ? String(sliderValue.value?.[thumb - 1]) : String(sliderValue.value),
                    "disable-closing-trigger": ""
                  }, { ref_for: true }, typeof __props.tooltip === "object" ? __props.tooltip : {}), {
                    default: withCtx(() => [
                      createVNode(unref(SliderThumb), {
                        class: ui.value.thumb({ class: props.ui?.thumb })
                      }, null, 8, ["class"])
                    ]),
                    _: 2
                  }, 1040, ["text"])) : (openBlock(), createBlock(unref(SliderThumb), {
                    key: 1,
                    class: ui.value.thumb({ class: props.ui?.thumb })
                  }, null, 8, ["class"]))
                ], 64);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Slider.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const theme$5 = {
  "slots": {
    "root": "",
    "wrapper": "",
    "labelWrapper": "flex content-center items-center justify-between",
    "label": "block font-medium text-default",
    "container": "mt-1 relative",
    "description": "text-muted",
    "error": "mt-2 text-error",
    "hint": "text-muted",
    "help": "mt-2 text-muted"
  },
  "variants": {
    "size": {
      "xs": {
        "root": "text-xs"
      },
      "sm": {
        "root": "text-xs"
      },
      "md": {
        "root": "text-sm"
      },
      "lg": {
        "root": "text-sm"
      },
      "xl": {
        "root": "text-base"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const _sfc_main$d = {
  __name: "UFormField",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    name: { type: String, required: false },
    errorPattern: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    help: { type: String, required: false },
    error: { type: [Boolean, String], required: false },
    hint: { type: String, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    eagerValidation: { type: Boolean, required: false },
    validateOnInputDelay: { type: Number, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme$5), ...appConfig2.ui?.formField || {} })({
      size: props.size,
      required: props.required
    }));
    const formErrors = inject(formErrorsInjectionKey, null);
    const error = computed(() => props.error || formErrors?.value?.find((error2) => error2.name === props.name || props.errorPattern && error2.name?.match(props.errorPattern))?.message);
    const id = ref(useId());
    const ariaId = id.value;
    const formInputs = inject(formInputsInjectionKey, void 0);
    watch(id, () => {
      if (formInputs && props.name) {
        formInputs.value[props.name] = { id: id.value, pattern: props.errorPattern };
      }
    }, { immediate: true });
    provide(inputIdInjectionKey, id);
    provide(formFieldInjectionKey, computed(() => ({
      error: error.value,
      name: props.name,
      size: props.size,
      eagerValidation: props.eagerValidation,
      validateOnInputDelay: props.validateOnInputDelay,
      errorPattern: props.errorPattern,
      hint: props.hint,
      description: props.description,
      help: props.help,
      ariaId
    })));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
            if (__props.label || !!slots.label) {
              _push2(`<div class="${ssrRenderClass(ui.value.labelWrapper({ class: props.ui?.labelWrapper }))}"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Label), {
                for: id.value,
                class: ui.value.label({ class: props.ui?.label })
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "label", { label: __props.label }, () => {
                      _push3(`${ssrInterpolate(__props.label)}`);
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                        createTextVNode(toDisplayString(__props.label), 1)
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              if (__props.hint || !!slots.hint) {
                _push2(`<span${ssrRenderAttr("id", `${unref(ariaId)}-hint`)} class="${ssrRenderClass(ui.value.hint({ class: props.ui?.hint }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "hint", { hint: __props.hint }, () => {
                  _push2(`${ssrInterpolate(__props.hint)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.description || !!slots.description) {
              _push2(`<p${ssrRenderAttr("id", `${unref(ariaId)}-description`)} class="${ssrRenderClass(ui.value.description({ class: props.ui?.description }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "description", { description: __props.description }, () => {
                _push2(`${ssrInterpolate(__props.description)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${ssrRenderClass([(__props.label || !!slots.label || __props.description || !!slots.description) && ui.value.container({ class: props.ui?.container })])}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", { error: error.value }, null, _push2, _parent2, _scopeId);
            if (typeof error.value === "string" && error.value || !!slots.error) {
              _push2(`<div${ssrRenderAttr("id", `${unref(ariaId)}-error`)} class="${ssrRenderClass(ui.value.error({ class: props.ui?.error }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "error", { error: error.value }, () => {
                _push2(`${ssrInterpolate(error.value)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else if (__props.help || !!slots.help) {
              _push2(`<div${ssrRenderAttr("id", `${unref(ariaId)}-help`)} class="${ssrRenderClass(ui.value.help({ class: props.ui?.help }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "help", { help: __props.help }, () => {
                _push2(`${ssrInterpolate(__props.help)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.label || !!slots.label ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: ui.value.labelWrapper({ class: props.ui?.labelWrapper })
                }, [
                  createVNode(unref(Label), {
                    for: id.value,
                    class: ui.value.label({ class: props.ui?.label })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                        createTextVNode(toDisplayString(__props.label), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["for", "class"]),
                  __props.hint || !!slots.hint ? (openBlock(), createBlock("span", {
                    key: 0,
                    id: `${unref(ariaId)}-hint`,
                    class: ui.value.hint({ class: props.ui?.hint })
                  }, [
                    renderSlot(_ctx.$slots, "hint", { hint: __props.hint }, () => [
                      createTextVNode(toDisplayString(__props.hint), 1)
                    ])
                  ], 10, ["id"])) : createCommentVNode("", true)
                ], 2)) : createCommentVNode("", true),
                __props.description || !!slots.description ? (openBlock(), createBlock("p", {
                  key: 1,
                  id: `${unref(ariaId)}-description`,
                  class: ui.value.description({ class: props.ui?.description })
                }, [
                  renderSlot(_ctx.$slots, "description", { description: __props.description }, () => [
                    createTextVNode(toDisplayString(__props.description), 1)
                  ])
                ], 10, ["id"])) : createCommentVNode("", true)
              ], 2),
              createVNode("div", {
                class: [(__props.label || !!slots.label || __props.description || !!slots.description) && ui.value.container({ class: props.ui?.container })]
              }, [
                renderSlot(_ctx.$slots, "default", { error: error.value }),
                typeof error.value === "string" && error.value || !!slots.error ? (openBlock(), createBlock("div", {
                  key: 0,
                  id: `${unref(ariaId)}-error`,
                  class: ui.value.error({ class: props.ui?.error })
                }, [
                  renderSlot(_ctx.$slots, "error", { error: error.value }, () => [
                    createTextVNode(toDisplayString(error.value), 1)
                  ])
                ], 10, ["id"])) : __props.help || !!slots.help ? (openBlock(), createBlock("div", {
                  key: 1,
                  id: `${unref(ariaId)}-help`,
                  class: ui.value.help({ class: props.ui?.help })
                }, [
                  renderSlot(_ctx.$slots, "help", { help: __props.help }, () => [
                    createTextVNode(toDisplayString(__props.help), 1)
                  ])
                ], 10, ["id"])) : createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/FormField.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const theme$4 = {
  "slots": {
    "root": "relative inline-flex items-center",
    "base": [
      "w-full rounded-md border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "increment": "absolute flex items-center",
    "decrement": "absolute flex items-center"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
      },
      "vertical": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
      }
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "size": {
      "xs": "px-2 py-1 text-xs gap-1",
      "sm": "px-2.5 py-1.5 text-xs gap-1.5",
      "md": "px-2.5 py-1.5 text-sm gap-1.5",
      "lg": "px-3 py-2 text-sm gap-2",
      "xl": "px-3 py-2 text-base gap-2"
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "disabled": {
      "true": {
        "increment": "opacity-75 cursor-not-allowed",
        "decrement": "opacity-75 cursor-not-allowed"
      }
    },
    "orientation": {
      "horizontal": {
        "base": "text-center",
        "increment": "inset-y-0 end-0 pe-1",
        "decrement": "inset-y-0 start-0 ps-1"
      },
      "vertical": {
        "increment": "top-0 end-0 pe-1 [&>button]:py-0 scale-80",
        "decrement": "bottom-0 end-0 pe-1 [&>button]:py-0 scale-80"
      }
    },
    "highlight": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": "px-7"
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": "px-8"
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": "px-9"
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": "px-10"
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": "px-11"
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": "pe-7"
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": "pe-8"
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": "pe-9"
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": "pe-10"
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": "pe-11"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$c = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UInputNumber",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    placeholder: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    highlight: { type: Boolean, required: false },
    orientation: { type: String, required: false, default: "horizontal" },
    increment: { type: Object, required: false },
    incrementIcon: { type: [String, Object], required: false },
    incrementDisabled: { type: Boolean, required: false },
    decrement: { type: Object, required: false },
    decrementIcon: { type: [String, Object], required: false },
    decrementDisabled: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false },
    modelModifiers: { type: Object, required: false },
    locale: { type: String, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    modelValue: { type: [Number, null], required: false },
    defaultValue: { type: Number, required: false },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    stepSnapping: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    required: { type: Boolean, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    formatOptions: { type: null, required: false },
    disableWheelChange: { type: Boolean, required: false },
    invertWheelChange: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false }
  },
  emits: ["update:modelValue", "blur", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
    const { t, code: codeLocale } = useLocale();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultValue", "min", "max", "step", "stepSnapping", "formatOptions", "disableWheelChange", "invertWheelChange", "readonly"), emits);
    const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const locale = computed(() => props.locale || codeLocale.value);
    const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value);
    const ui = computed(() => tv({ extend: tv(theme$4), ...appConfig2.ui?.inputNumber || {} })({
      color: color.value,
      variant: props.variant,
      size: inputSize.value,
      highlight: highlight.value,
      orientation: props.orientation,
      fieldGroup: orientation.value
    }));
    const incrementIcon = computed(() => props.incrementIcon || (props.orientation === "horizontal" ? appConfig2.ui.icons.plus : appConfig2.ui.icons.chevronUp));
    const decrementIcon = computed(() => props.decrementIcon || (props.orientation === "horizontal" ? appConfig2.ui.icons.minus : appConfig2.ui.icons.chevronDown));
    const inputRef = ref(null);
    function onUpdate(value) {
      if (props.modelModifiers?.optional) {
        value = value ?? void 0;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    function onBlur(event) {
      emitFormBlur();
      emits("blur", event);
    }
    __expose({
      inputRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NumberFieldRoot), mergeProps(unref(rootProps), {
        id: unref(id),
        "model-value": unref(modelValue),
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        name: unref(name),
        disabled: unref(disabled),
        locale: locale.value,
        "onUpdate:modelValue": onUpdate
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NumberFieldInput), mergeProps({ ..._ctx.$attrs, ...unref(ariaAttrs) }, {
              ref_key: "inputRef",
              ref: inputRef,
              placeholder: __props.placeholder,
              required: __props.required,
              class: ui.value.base({ class: props.ui?.base }),
              onBlur,
              onFocus: unref(emitFormFocus)
            }), null, _parent2, _scopeId));
            _push2(`<div class="${ssrRenderClass(ui.value.increment({ class: props.ui?.increment }))}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(NumberFieldIncrement), {
              "as-child": "",
              disabled: unref(disabled) || __props.incrementDisabled
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "increment", {}, () => {
                    _push3(ssrRenderComponent(_sfc_main$p, mergeProps({
                      icon: incrementIcon.value,
                      color: unref(color),
                      size: __props.size,
                      variant: "link",
                      "aria-label": unref(t)("inputNumber.increment")
                    }, typeof __props.increment === "object" ? __props.increment : void 0), null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "increment", {}, () => [
                      createVNode(_sfc_main$p, mergeProps({
                        icon: incrementIcon.value,
                        color: unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": unref(t)("inputNumber.increment")
                      }, typeof __props.increment === "object" ? __props.increment : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`</div><div class="${ssrRenderClass(ui.value.decrement({ class: props.ui?.decrement }))}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(NumberFieldDecrement), {
              "as-child": "",
              disabled: unref(disabled) || __props.decrementDisabled
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "decrement", {}, () => {
                    _push3(ssrRenderComponent(_sfc_main$p, mergeProps({
                      icon: decrementIcon.value,
                      color: unref(color),
                      size: __props.size,
                      variant: "link",
                      "aria-label": unref(t)("inputNumber.decrement")
                    }, typeof __props.decrement === "object" ? __props.decrement : void 0), null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "decrement", {}, () => [
                      createVNode(_sfc_main$p, mergeProps({
                        icon: decrementIcon.value,
                        color: unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": unref(t)("inputNumber.decrement")
                      }, typeof __props.decrement === "object" ? __props.decrement : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(NumberFieldInput), mergeProps({ ..._ctx.$attrs, ...unref(ariaAttrs) }, {
                ref_key: "inputRef",
                ref: inputRef,
                placeholder: __props.placeholder,
                required: __props.required,
                class: ui.value.base({ class: props.ui?.base }),
                onBlur,
                onFocus: unref(emitFormFocus)
              }), null, 16, ["placeholder", "required", "class", "onFocus"]),
              createVNode("div", {
                class: ui.value.increment({ class: props.ui?.increment })
              }, [
                createVNode(unref(NumberFieldIncrement), {
                  "as-child": "",
                  disabled: unref(disabled) || __props.incrementDisabled
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "increment", {}, () => [
                      createVNode(_sfc_main$p, mergeProps({
                        icon: incrementIcon.value,
                        color: unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": unref(t)("inputNumber.increment")
                      }, typeof __props.increment === "object" ? __props.increment : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                    ])
                  ]),
                  _: 3
                }, 8, ["disabled"])
              ], 2),
              createVNode("div", {
                class: ui.value.decrement({ class: props.ui?.decrement })
              }, [
                createVNode(unref(NumberFieldDecrement), {
                  "as-child": "",
                  disabled: unref(disabled) || __props.decrementDisabled
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "decrement", {}, () => [
                      createVNode(_sfc_main$p, mergeProps({
                        icon: decrementIcon.value,
                        color: unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": unref(t)("inputNumber.decrement")
                      }, typeof __props.decrement === "object" ? __props.decrement : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                    ])
                  ]),
                  _: 3
                }, 8, ["disabled"])
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/InputNumber.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const theme$3 = {
  "slots": {
    "root": "relative flex items-start",
    "base": [
      "inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-accented",
      "transition-[background] duration-200"
    ],
    "container": "flex items-center",
    "thumb": "group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center",
    "icon": [
      "absolute shrink-0 group-data-[state=unchecked]:text-dimmed opacity-0 size-10/12",
      "transition-[color,opacity] duration-200"
    ],
    "wrapper": "ms-2",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "data-[state=checked]:bg-primary focus-visible:outline-primary",
        "icon": "group-data-[state=checked]:text-primary"
      },
      "secondary": {
        "base": "data-[state=checked]:bg-secondary focus-visible:outline-secondary",
        "icon": "group-data-[state=checked]:text-secondary"
      },
      "success": {
        "base": "data-[state=checked]:bg-success focus-visible:outline-success",
        "icon": "group-data-[state=checked]:text-success"
      },
      "info": {
        "base": "data-[state=checked]:bg-info focus-visible:outline-info",
        "icon": "group-data-[state=checked]:text-info"
      },
      "warning": {
        "base": "data-[state=checked]:bg-warning focus-visible:outline-warning",
        "icon": "group-data-[state=checked]:text-warning"
      },
      "error": {
        "base": "data-[state=checked]:bg-error focus-visible:outline-error",
        "icon": "group-data-[state=checked]:text-error"
      },
      "neutral": {
        "base": "data-[state=checked]:bg-inverted focus-visible:outline-inverted",
        "icon": "group-data-[state=checked]:text-highlighted"
      }
    },
    "size": {
      "xs": {
        "base": "w-7",
        "container": "h-4",
        "thumb": "size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3",
        "wrapper": "text-xs"
      },
      "sm": {
        "base": "w-8",
        "container": "h-4",
        "thumb": "size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5",
        "wrapper": "text-xs"
      },
      "md": {
        "base": "w-9",
        "container": "h-5",
        "thumb": "size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4",
        "wrapper": "text-sm"
      },
      "lg": {
        "base": "w-10",
        "container": "h-5",
        "thumb": "size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5",
        "wrapper": "text-sm"
      },
      "xl": {
        "base": "w-11",
        "container": "h-6",
        "thumb": "size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5",
        "wrapper": "text-base"
      }
    },
    "checked": {
      "true": {
        "icon": "group-data-[state=checked]:opacity-100"
      }
    },
    "unchecked": {
      "true": {
        "icon": "group-data-[state=unchecked]:opacity-100"
      }
    },
    "loading": {
      "true": {
        "icon": "animate-spin"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    "disabled": {
      "true": {
        "base": "cursor-not-allowed opacity-75",
        "label": "cursor-not-allowed opacity-75",
        "description": "cursor-not-allowed opacity-75"
      }
    }
  },
  "defaultVariants": {
    "color": "primary",
    "size": "md"
  }
};
const _sfc_main$b = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USwitch",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: [String, Object], required: false },
    checkedIcon: { type: [String, Object], required: false },
    uncheckedIcon: { type: [String, Object], required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    value: { type: String, required: false },
    defaultValue: { type: Boolean, required: false }
  }, {
    "modelValue": { type: Boolean, ...{ default: void 0 } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const slots = useSlots();
    const emits = __emit;
    const modelValue = useModel(__props, "modelValue", { type: Boolean, ...{ default: void 0 } });
    const appConfig2 = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "required", "value", "defaultValue"));
    const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
    const id = _id.value ?? useId();
    const ui = computed(() => tv({ extend: tv(theme$3), ...appConfig2.ui?.switch || {} })({
      size: size.value,
      color: color.value,
      required: props.required,
      loading: props.loading,
      disabled: disabled.value || props.loading
    }));
    function onUpdate(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass(ui.value.container({ class: props.ui?.container }))}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SwitchRoot), mergeProps({ id: unref(id) }, { ...unref(rootProps), ..._ctx.$attrs, ...unref(ariaAttrs) }, {
              modelValue: modelValue.value,
              "onUpdate:modelValue": [($event) => modelValue.value = $event, onUpdate],
              name: unref(name),
              disabled: unref(disabled) || __props.loading,
              class: ui.value.base({ class: props.ui?.base })
            }), {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(SwitchThumb), {
                    class: ui.value.thumb({ class: props.ui?.thumb })
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.loading) {
                          _push4(ssrRenderComponent(_sfc_main$u, {
                            name: __props.loadingIcon || unref(appConfig2).ui.icons.loading,
                            class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!--[-->`);
                          if (__props.checkedIcon) {
                            _push4(ssrRenderComponent(_sfc_main$u, {
                              name: __props.checkedIcon,
                              class: ui.value.icon({ class: props.ui?.icon, checked: true })
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          if (__props.uncheckedIcon) {
                            _push4(ssrRenderComponent(_sfc_main$u, {
                              name: __props.uncheckedIcon,
                              class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<!--]-->`);
                        }
                      } else {
                        return [
                          __props.loading ? (openBlock(), createBlock(_sfc_main$u, {
                            key: 0,
                            name: __props.loadingIcon || unref(appConfig2).ui.icons.loading,
                            class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                          }, null, 8, ["name", "class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            __props.checkedIcon ? (openBlock(), createBlock(_sfc_main$u, {
                              key: 0,
                              name: __props.checkedIcon,
                              class: ui.value.icon({ class: props.ui?.icon, checked: true })
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                            __props.uncheckedIcon ? (openBlock(), createBlock(_sfc_main$u, {
                              key: 1,
                              name: __props.uncheckedIcon,
                              class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SwitchThumb), {
                      class: ui.value.thumb({ class: props.ui?.thumb })
                    }, {
                      default: withCtx(() => [
                        __props.loading ? (openBlock(), createBlock(_sfc_main$u, {
                          key: 0,
                          name: __props.loadingIcon || unref(appConfig2).ui.icons.loading,
                          class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          __props.checkedIcon ? (openBlock(), createBlock(_sfc_main$u, {
                            key: 0,
                            name: __props.checkedIcon,
                            class: ui.value.icon({ class: props.ui?.icon, checked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                          __props.uncheckedIcon ? (openBlock(), createBlock(_sfc_main$u, {
                            key: 1,
                            name: __props.uncheckedIcon,
                            class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.label || !!slots.label || (__props.description || !!slots.description)) {
              _push2(`<div class="${ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
              if (__props.label || !!slots.label) {
                _push2(ssrRenderComponent(unref(Label), {
                  for: unref(id),
                  class: ui.value.label({ class: props.ui?.label })
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, "label", { label: __props.label }, () => {
                        _push3(`${ssrInterpolate(__props.label)}`);
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                          createTextVNode(toDisplayString(__props.label), 1)
                        ])
                      ];
                    }
                  }),
                  _: 3
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (__props.description || !!slots.description) {
                _push2(`<p class="${ssrRenderClass(ui.value.description({ class: props.ui?.description }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "description", { description: __props.description }, () => {
                  _push2(`${ssrInterpolate(__props.description)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", {
                class: ui.value.container({ class: props.ui?.container })
              }, [
                createVNode(unref(SwitchRoot), mergeProps({ id: unref(id) }, { ...unref(rootProps), ..._ctx.$attrs, ...unref(ariaAttrs) }, {
                  modelValue: modelValue.value,
                  "onUpdate:modelValue": [($event) => modelValue.value = $event, onUpdate],
                  name: unref(name),
                  disabled: unref(disabled) || __props.loading,
                  class: ui.value.base({ class: props.ui?.base })
                }), {
                  default: withCtx(() => [
                    createVNode(unref(SwitchThumb), {
                      class: ui.value.thumb({ class: props.ui?.thumb })
                    }, {
                      default: withCtx(() => [
                        __props.loading ? (openBlock(), createBlock(_sfc_main$u, {
                          key: 0,
                          name: __props.loadingIcon || unref(appConfig2).ui.icons.loading,
                          class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          __props.checkedIcon ? (openBlock(), createBlock(_sfc_main$u, {
                            key: 0,
                            name: __props.checkedIcon,
                            class: ui.value.icon({ class: props.ui?.icon, checked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                          __props.uncheckedIcon ? (openBlock(), createBlock(_sfc_main$u, {
                            key: 1,
                            name: __props.uncheckedIcon,
                            class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ]),
                  _: 1
                }, 16, ["id", "modelValue", "onUpdate:modelValue", "name", "disabled", "class"])
              ], 2),
              __props.label || !!slots.label || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                key: 0,
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.label || !!slots.label ? (openBlock(), createBlock(unref(Label), {
                  key: 0,
                  for: unref(id),
                  class: ui.value.label({ class: props.ui?.label })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                      createTextVNode(toDisplayString(__props.label), 1)
                    ])
                  ]),
                  _: 3
                }, 8, ["for", "class"])) : createCommentVNode("", true),
                __props.description || !!slots.description ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: ui.value.description({ class: props.ui?.description })
                }, [
                  renderSlot(_ctx.$slots, "description", { description: __props.description }, () => [
                    createTextVNode(toDisplayString(__props.description), 1)
                  ])
                ], 2)) : createCommentVNode("", true)
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Switch.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const theme$2 = {
  "slots": {
    "root": "data-[disabled]:opacity-75",
    "picker": "flex gap-4",
    "selector": "rounded-md touch-none",
    "selectorBackground": "w-full h-full relative rounded-md",
    "selectorThumb": "-translate-y-1/2 -translate-x-1/2 absolute size-4 ring-2 ring-(--color-white) rounded-full cursor-pointer data-[disabled]:cursor-not-allowed",
    "track": "w-[8px] relative rounded-md touch-none",
    "trackThumb": "absolute transform -translate-y-1/2 -translate-x-[4px] rtl:translate-x-[4px] size-4 rounded-full ring-2 ring-(--color-white) cursor-pointer data-[disabled]:cursor-not-allowed"
  },
  "variants": {
    "size": {
      "xs": {
        "selector": "w-38 h-38",
        "track": "h-38"
      },
      "sm": {
        "selector": "w-40 h-40",
        "track": "h-40"
      },
      "md": {
        "selector": "w-42 h-42",
        "track": "h-42"
      },
      "lg": {
        "selector": "w-44 h-44",
        "track": "h-44"
      },
      "xl": {
        "selector": "w-46 h-46",
        "track": "h-46"
      }
    }
  },
  "compoundVariants": [],
  "defaultVariants": {
    "size": "md"
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function HSLtoHSV(hsl) {
  const x2 = hsl.S * (hsl.L < 50 ? hsl.L : 100 - hsl.L);
  const v2 = hsl.L + x2 / 100;
  return {
    h: hsl.H,
    s: hsl.L === 0 ? hsl.S : 2 * x2 / v2,
    v: v2
  };
}
function HSVtoHSL(hsv) {
  const x2 = (200 - hsv.s) * hsv.v / 100;
  return {
    H: hsv.h,
    S: x2 === 0 || x2 === 200 ? 0 : Math.round(hsv.s * hsv.v / (x2 <= 100 ? x2 : 200 - x2)),
    L: x2 / 2
  };
}
const _sfc_main$a = {
  __name: "UColorPicker",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    throttle: { type: Number, required: false, default: 50 },
    disabled: { type: Boolean, required: false },
    defaultValue: { type: String, required: false, default: "#FFFFFF" },
    format: { type: String, required: false, default: "hex" },
    size: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  }, {
    "modelValue": { type: String, ...void 0 },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const modelValue = useModel(__props, "modelValue", { type: String, ...void 0 });
    const appConfig2 = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme$2), ...appConfig2.ui?.colorPicker || {} })({
      size: props.size
    }));
    const pickedColor = computed({
      get() {
        try {
          const color = new ColorTranslator(modelValue.value || props.defaultValue);
          return HSLtoHSV(color.HSLObject);
        } catch (_2) {
          return { h: 0, s: 0, v: 100 };
        }
      },
      set(value) {
        const color = new ColorTranslator(HSVtoHSL(value), {
          labUnit: "percent",
          cmykUnit: "percent",
          cmykFunction: "cmyk"
        });
        switch (props.format) {
          case "rgb":
            modelValue.value = color.RGB;
            break;
          case "hsl":
            modelValue.value = color.HSL;
            break;
          case "cmyk":
            modelValue.value = color.CMYK;
            break;
          case "lab":
            modelValue.value = color.CIELab;
            break;
          case "hex":
          default:
            modelValue.value = color.HEX;
        }
      }
    });
    function useColorDraggable(targetElement, containerElement, axis = "both", initialPosition = { x: 0, y: 0 }, disabled2) {
      const position = ref(initialPosition);
      const pressedDelta = ref();
      const targetRect = useElementBounding(targetElement);
      const containerRect = useElementBounding(containerElement);
      function start(event) {
        if (toValue(disabled2)) return event.preventDefault();
        const container = toValue(containerElement);
        pressedDelta.value = {
          x: event.clientX - (container ? event.clientX - containerRect.left.value + container.scrollLeft : targetRect.left.value),
          y: event.clientY - (container ? event.clientY - containerRect.top.value + container.scrollTop : targetRect.top.value)
        };
        move(event);
      }
      function move(event) {
        if (!pressedDelta.value) return;
        const container = toValue(containerElement);
        let { x: x2, y } = position.value;
        if (container && (axis === "x" || axis === "both")) {
          x2 = Math.min(Math.max(0, (event.clientX - pressedDelta.value.x) / container.scrollWidth * 100), 100);
        }
        if (container && (axis === "y" || axis === "both")) {
          y = Math.min(Math.max(0, (event.clientY - pressedDelta.value.y) / container.scrollHeight * 100), 100);
        }
        position.value = { x: x2, y };
      }
      function end() {
        if (!pressedDelta.value) {
          return;
        }
        pressedDelta.value = void 0;
      }
      if (isClient) {
        useEventListener(containerElement, "pointerdown", start);
        useEventListener(void 0, "pointermove", move);
        useEventListener(void 0, "pointerup", end);
      }
      return {
        position
      };
    }
    function normalizeHue(hue, dir = "left") {
      if (dir === "right") {
        return hue * 100 / 360;
      }
      return hue / 100 * 360;
    }
    function normalizeBrightness(brightness) {
      return 100 - brightness;
    }
    const selectorRef = ref(null);
    const selectorThumbRef = ref(null);
    const trackRef = ref(null);
    const trackThumbRef = ref(null);
    const disabled = computed(() => props.disabled);
    const { position: selectorThumbPosition } = useColorDraggable(selectorThumbRef, selectorRef, "both", {
      x: pickedColor.value.s,
      y: normalizeBrightness(pickedColor.value.v)
    }, disabled);
    const { position: trackThumbPosition } = useColorDraggable(trackThumbRef, trackRef, "y", {
      x: 0,
      y: normalizeHue(pickedColor.value.h, "right")
    }, disabled);
    const { pause: pauseWatchColor, resume: resumeWatchColor } = watchPausable(pickedColor, (hsb) => {
      selectorThumbPosition.value = {
        x: hsb.s,
        y: normalizeBrightness(hsb.v)
      };
      trackThumbPosition.value = {
        x: 0,
        y: normalizeHue(hsb.h, "right")
      };
    });
    watchThrottled([selectorThumbPosition, trackThumbPosition], () => {
      pauseWatchColor();
      pickedColor.value = {
        h: normalizeHue(trackThumbPosition.value.y),
        s: selectorThumbPosition.value.x,
        v: normalizeBrightness(selectorThumbPosition.value.y)
      };
      nextTick(resumeWatchColor);
    }, { throttle: () => props.throttle });
    const trackThumbColor = computed(() => new ColorTranslator(HSVtoHSL({
      h: normalizeHue(trackThumbPosition.value.y),
      s: 100,
      v: 100
    })).HEX);
    const selectorStyle = computed(() => ({
      backgroundColor: trackThumbColor.value
    }));
    const selectorThumbStyle = computed(() => ({
      backgroundColor: new ColorTranslator(modelValue.value || props.defaultValue).HEX,
      left: `${selectorThumbPosition.value.x}%`,
      top: `${selectorThumbPosition.value.y}%`
    }));
    const trackThumbStyle = computed(() => ({
      backgroundColor: trackThumbColor.value,
      top: `${trackThumbPosition.value.y}%`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        "data-disabled": disabled.value ? true : void 0
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass(ui.value.picker({ class: props.ui?.picker }))}" data-v-d80b2140${_scopeId}><div class="${ssrRenderClass(ui.value.selector({ class: props.ui?.selector }))}" style="${ssrRenderStyle(selectorStyle.value)}" data-v-d80b2140${_scopeId}><div class="${ssrRenderClass(ui.value.selectorBackground({ class: props.ui?.selectorBackground }))}" data-color-picker-background data-v-d80b2140${_scopeId}><div class="${ssrRenderClass(ui.value.selectorThumb({ class: props.ui?.selectorThumb }))}" style="${ssrRenderStyle(selectorThumbStyle.value)}"${ssrRenderAttr("data-disabled", disabled.value ? true : void 0)} data-v-d80b2140${_scopeId}></div></div></div><div class="${ssrRenderClass(ui.value.track({ class: props.ui?.track }))}" data-color-picker-track data-v-d80b2140${_scopeId}><div class="${ssrRenderClass(ui.value.trackThumb({ class: props.ui?.trackThumb }))}" style="${ssrRenderStyle(trackThumbStyle.value)}"${ssrRenderAttr("data-disabled", disabled.value ? true : void 0)} data-v-d80b2140${_scopeId}></div></div></div>`);
          } else {
            return [
              createVNode("div", {
                class: ui.value.picker({ class: props.ui?.picker })
              }, [
                createVNode("div", {
                  ref_key: "selectorRef",
                  ref: selectorRef,
                  class: ui.value.selector({ class: props.ui?.selector }),
                  style: selectorStyle.value
                }, [
                  createVNode("div", {
                    class: ui.value.selectorBackground({ class: props.ui?.selectorBackground }),
                    "data-color-picker-background": ""
                  }, [
                    createVNode("div", {
                      ref_key: "selectorThumbRef",
                      ref: selectorThumbRef,
                      class: ui.value.selectorThumb({ class: props.ui?.selectorThumb }),
                      style: selectorThumbStyle.value,
                      "data-disabled": disabled.value ? true : void 0
                    }, null, 14, ["data-disabled"])
                  ], 2)
                ], 6),
                createVNode("div", {
                  ref_key: "trackRef",
                  ref: trackRef,
                  class: ui.value.track({ class: props.ui?.track }),
                  "data-color-picker-track": ""
                }, [
                  createVNode("div", {
                    ref_key: "trackThumbRef",
                    ref: trackThumbRef,
                    class: ui.value.trackThumb({ class: props.ui?.trackThumb }),
                    style: trackThumbStyle.value,
                    "data-disabled": disabled.value ? true : void 0
                  }, null, 14, ["data-disabled"])
                ], 2)
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/ColorPicker.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_10 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-d80b2140"]]);
const theme$1 = {
  "slots": {
    "base": "font-medium inline-flex items-center",
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "xs": {
        "base": "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "sm": {
        "base": "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "md": {
        "base": "text-xs px-2 py-1 gap-1 rounded-md",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "lg": {
        "base": "text-sm px-2 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "text-base px-2.5 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-6"
      }
    },
    "square": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "bg-primary text-inverted"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "bg-secondary text-inverted"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "bg-success text-inverted"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "bg-info text-inverted"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "bg-warning text-inverted"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "bg-error text-inverted"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "text-primary ring ring-inset ring-primary/50"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "text-secondary ring ring-inset ring-secondary/50"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "text-success ring ring-inset ring-success/50"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "text-info ring ring-inset ring-info/50"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "text-warning ring ring-inset ring-warning/50"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "text-error ring ring-inset ring-error/50"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "bg-primary/10 text-primary"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "bg-secondary/10 text-secondary"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "bg-success/10 text-success"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "bg-info/10 text-info"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "bg-warning/10 text-warning"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "bg-error/10 text-error"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "bg-success/10 text-success ring ring-inset ring-success/25"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "bg-info/10 text-info ring ring-inset ring-info/25"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "bg-error/10 text-error ring ring-inset ring-error/25"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated"
    },
    {
      "size": "xs",
      "square": true,
      "class": "p-0.5"
    },
    {
      "size": "sm",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "md",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "lg",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "xl",
      "square": true,
      "class": "p-1"
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid",
    "size": "md"
  }
};
const _sfc_main$9 = {
  __name: "UBadge",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "span" },
    label: { type: [String, Number], required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: [String, Object], required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: [String, Object], required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: [String, Object], required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const ui = computed(() => tv({ extend: tv(theme$1), ...appConfig2.ui?.badge || {} })({
      color: props.color,
      variant: props.variant,
      size: fieldGroupSize.value || props.size,
      square: props.square || !slots.default && !props.label,
      fieldGroup: orientation.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.base({ class: [props.ui?.base, props.class] })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "leading", {}, () => {
              if (unref(isLeading) && unref(leadingIconName)) {
                _push2(ssrRenderComponent(_sfc_main$u, {
                  name: unref(leadingIconName),
                  class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                }, null, _parent2, _scopeId));
              } else if (!!__props.avatar) {
                _push2(ssrRenderComponent(_sfc_main$s, mergeProps({
                  size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                }, __props.avatar, {
                  class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar })
                }), null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              if (__props.label !== void 0 && __props.label !== null) {
                _push2(`<span class="${ssrRenderClass(ui.value.label({ class: props.ui?.label }))}"${_scopeId}>${ssrInterpolate(__props.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "trailing", {}, () => {
              if (unref(isTrailing) && unref(trailingIconName)) {
                _push2(ssrRenderComponent(_sfc_main$u, {
                  name: unref(trailingIconName),
                  class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "leading", {}, () => [
                unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                  key: 0,
                  name: unref(leadingIconName),
                  class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$s, mergeProps({
                  key: 1,
                  size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                }, __props.avatar, {
                  class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar })
                }), null, 16, ["size", "class"])) : createCommentVNode("", true)
              ]),
              renderSlot(_ctx.$slots, "default", {}, () => [
                __props.label !== void 0 && __props.label !== null ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: ui.value.label({ class: props.ui?.label })
                }, toDisplayString(__props.label), 3)) : createCommentVNode("", true)
              ]),
              renderSlot(_ctx.$slots, "trailing", {}, () => [
                unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                  key: 0,
                  name: unref(trailingIconName),
                  class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Badge.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "root": "relative inline-flex items-center",
    "base": [
      "w-full rounded-md border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
      },
      "vertical": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
      }
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$8 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UInput",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    type: { type: null, required: false, default: "text" },
    placeholder: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    autocomplete: { type: null, required: false, default: "off" },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    disabled: { type: Boolean, required: false },
    highlight: { type: Boolean, required: false },
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelModifiers: { type: Object, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: [String, Object], required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: [String, Object], required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: [String, Object], required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: [String, Object], required: false }
  },
  emits: ["update:modelValue", "blur", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
    const appConfig2 = useAppConfig();
    const { emitFormBlur, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField(props, { deferInputValidation: true });
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value);
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig2.ui?.input || {} })({
      type: props.type,
      color: color.value,
      variant: props.variant,
      size: inputSize?.value,
      loading: props.loading,
      highlight: highlight.value,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing,
      fieldGroup: orientation.value
    }));
    const inputRef = ref(null);
    function updateInput(value) {
      if (props.modelModifiers?.trim) {
        value = value?.trim() ?? null;
      }
      if (props.modelModifiers?.number || props.type === "number") {
        value = looseToNumber(value);
      }
      if (props.modelModifiers?.nullable) {
        value ||= null;
      }
      if (props.modelModifiers?.optional) {
        value ||= void 0;
      }
      modelValue.value = value;
      emitFormInput();
    }
    function onInput(event) {
      if (!props.modelModifiers?.lazy) {
        updateInput(event.target.value);
      }
    }
    function onChange(event) {
      const value = event.target.value;
      if (props.modelModifiers?.lazy) {
        updateInput(value);
      }
      if (props.modelModifiers?.trim) {
        event.target.value = value.trim();
      }
      emitFormChange();
      emits("change", event);
    }
    function onBlur(event) {
      emitFormBlur();
      emits("blur", event);
    }
    __expose({
      inputRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<input${ssrRenderAttrs(mergeProps({
              id: unref(id),
              ref_key: "inputRef",
              ref: inputRef,
              type: __props.type,
              value: unref(modelValue),
              name: unref(name),
              placeholder: __props.placeholder,
              class: ui.value.base({ class: props.ui?.base }),
              disabled: unref(disabled),
              required: __props.required,
              autocomplete: __props.autocomplete
            }, { ..._ctx.$attrs, ...unref(ariaAttrs) }))}${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            if (unref(isLeading) || !!__props.avatar || !!slots.leading) {
              _push2(`<span class="${ssrRenderClass(ui.value.leading({ class: props.ui?.leading }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "leading", {}, () => {
                if (unref(isLeading) && unref(leadingIconName)) {
                  _push2(ssrRenderComponent(_sfc_main$u, {
                    name: unref(leadingIconName),
                    class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                  }, null, _parent2, _scopeId));
                } else if (!!__props.avatar) {
                  _push2(ssrRenderComponent(_sfc_main$s, mergeProps({
                    size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                  }, __props.avatar, {
                    class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar })
                  }), null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(isTrailing) || !!slots.trailing) {
              _push2(`<span class="${ssrRenderClass(ui.value.trailing({ class: props.ui?.trailing }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "trailing", {}, () => {
                if (unref(trailingIconName)) {
                  _push2(ssrRenderComponent(_sfc_main$u, {
                    name: unref(trailingIconName),
                    class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("input", mergeProps({
                id: unref(id),
                ref_key: "inputRef",
                ref: inputRef,
                type: __props.type,
                value: unref(modelValue),
                name: unref(name),
                placeholder: __props.placeholder,
                class: ui.value.base({ class: props.ui?.base }),
                disabled: unref(disabled),
                required: __props.required,
                autocomplete: __props.autocomplete
              }, { ..._ctx.$attrs, ...unref(ariaAttrs) }, {
                onInput,
                onBlur,
                onChange,
                onFocus: unref(emitFormFocus)
              }), null, 16, ["id", "type", "value", "name", "placeholder", "disabled", "required", "autocomplete", "onFocus"]),
              renderSlot(_ctx.$slots, "default"),
              unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                key: 0,
                class: ui.value.leading({ class: props.ui?.leading })
              }, [
                renderSlot(_ctx.$slots, "leading", {}, () => [
                  unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                    key: 0,
                    name: unref(leadingIconName),
                    class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                  }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$s, mergeProps({
                    key: 1,
                    size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                  }, __props.avatar, {
                    class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar })
                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                ])
              ], 2)) : createCommentVNode("", true),
              unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                key: 1,
                class: ui.value.trailing({ class: props.ui?.trailing })
              }, [
                renderSlot(_ctx.$slots, "trailing", {}, () => [
                  unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$u, {
                    key: 0,
                    name: unref(trailingIconName),
                    class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                ])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Input.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Overflow",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const player = usePlayerStore();
    const currentTrack = computed(() => player.getTrackData());
    const uniforms = computed(() => player.uniforms);
    const seekProgress = computed({
      get: () => player.getProgress() * 100,
      set: (val) => {
        player.seek(val / 100);
      }
    });
    ref([]);
    ref(false);
    const volume = ref(player.audioVolume);
    const youtubeUrl = ref("");
    const isDownloading = ref(false);
    watch(volume, (newVolume) => {
      player.setAudioVolume(newVolume);
    });
    const primaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_a.value }));
    const secondaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_b.value }));
    async function addYoutubeTrack() {
      if (!youtubeUrl.value) return;
      isDownloading.value = true;
      const toastId = "yt-download";
      toast.add({ id: toastId, title: "Downloading...", description: "Fetching audio from YouTube", icon: "i-lucide-loader-2", color: "primary", timeout: 0 });
      try {
        const response = await fetch(`/api/youtube?url=${encodeURIComponent(youtubeUrl.value)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.statusMessage || response.statusText || "Failed to fetch");
        }
        const disposition = response.headers.get("Content-Disposition");
        let filename = "YouTube Track.mp3";
        if (disposition && disposition.indexOf("filename=") !== -1) {
          const match = /filename="?([^"]+)"?/.exec(disposition);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1]);
            if (!filename.endsWith(".mp3")) filename += ".mp3";
          }
        }
        const blob = await response.blob();
        const file = new File([blob], filename, { type: "audio/mpeg" });
        await player.addTracks([file]);
        youtubeUrl.value = "";
        toast.remove(toastId);
        toast.add({ title: "Success", description: "Track added to queue", icon: "i-heroicons-check", color: "green" });
      } catch (e) {
        toast.remove(toastId);
        toast.add({ title: "Error", description: "Could not load YouTube track", icon: "i-heroicons-exclamation-triangle", color: "red" });
      } finally {
        isDownloading.value = false;
      }
    }
    function onTrackClick(index2) {
      if (player.currentTrack.index === index2) return;
      player.playTrack(index2);
    }
    function onDragStart(event, index2) {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", index2.toString());
      }
    }
    function onDrop(event, toIndex) {
      if (event.dataTransfer) {
        const fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
        if (!isNaN(fromIndex)) {
          player.reorderTracks(fromIndex, toIndex);
        }
      }
    }
    function onNativeFileChange(event) {
      const input = event.target;
      if (input.files && input.files.length > 0) {
        const files = Array.from(input.files);
        player.addTracks(files);
        input.value = "";
        toast.add({
          title: "Analyzing Tracks",
          description: `Vibe AI is processing ${files.length} new tracks...`,
          icon: "i-heroicons-sparkles-20-solid",
          color: "primary"
        });
      }
    }
    function formatTime(seconds) {
      if (!seconds) return "0:00";
      const m2 = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m2}:${s.toString().padStart(2, "0")}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDrawer = _sfc_main$j;
      const _component_UButton = _sfc_main$p;
      const _component_UIcon = _sfc_main$u;
      const _component_UPopover = _sfc_main$i;
      const _component_Waveform = __nuxt_component_4;
      const _component_URange = resolveComponent("URange");
      const _component_UProgress = _sfc_main$o;
      const _component_USlider = _sfc_main$e;
      const _component_UFormField = _sfc_main$d;
      const _component_UInputNumber = _sfc_main$c;
      const _component_USwitch = _sfc_main$b;
      const _component_UColorPicker = __nuxt_component_10;
      const _component_UBadge = _sfc_main$9;
      const _component_UInput = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute inset-0 h-fit z-10 p-4 sm:p-6 pointer-events-none" }, _attrs))} data-v-44542033>`);
      _push(ssrRenderComponent(_component_UDrawer, {
        "handle-only": "",
        title: "AUDIO CONTROL",
        description: "Manage playback, visuals and queue.",
        inset: "",
        ui: {
          content: "bg-gray-950/80 backdrop-blur-xl border-t border-white/10 ring-1 ring-white/5",
          header: "hidden",
          body: "p-0 sm:p-0",
          handle: "bg-white/20 hover:bg-white/40 w-16 h-1.5 mt-2"
        },
        class: "pointer-events-auto"
      }, {
        body: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full h-[85vh] sm:h-auto overflow-y-auto sm:overflow-visible bg-gray-950/90 sm:bg-transparent" data-v-44542033${_scopeId}><div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" data-v-44542033${_scopeId}><div class="grid grid-cols-1 lg:grid-cols-12 grid-rows-1 gap-6 lg:gap-8 h-full" data-v-44542033${_scopeId}><div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full lg:overflow-y-auto custom-scrollbar pr-1" data-v-44542033${_scopeId}><div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 shadow-2xl" data-v-44542033${_scopeId}><div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" data-v-44542033${_scopeId}></div><div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6" data-v-44542033${_scopeId}><div class="min-w-0 flex-1" data-v-44542033${_scopeId}>`);
            if (unref(player).transitionState.active) {
              _push2(`<div class="flex items-center gap-2 text-primary-400 mb-1" data-v-44542033${_scopeId}><span class="relative flex h-2 w-2" data-v-44542033${_scopeId}><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" data-v-44542033${_scopeId}></span><span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500" data-v-44542033${_scopeId}></span></span><span class="text-[10px] uppercase tracking-widest font-bold" data-v-44542033${_scopeId}>Mixing from ${ssrInterpolate(unref(player).transitionState.fromName)}</span></div>`);
            } else {
              _push2(`<div class="flex items-center gap-2 text-gray-500 mb-1" data-v-44542033${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-green-500" data-v-44542033${_scopeId}></span><span class="text-[10px] uppercase tracking-widest font-bold" data-v-44542033${_scopeId}>Now Playing</span></div>`);
            }
            _push2(`<h2 class="text-2xl sm:text-3xl font-bold text-white truncate tracking-tight"${ssrRenderAttr("title", unref(player).trackList[unref(player).currentTrack.index]?.name)} data-v-44542033${_scopeId}>${ssrInterpolate(unref(player).currentTrack.index !== -1 && unref(player).trackList[unref(player).currentTrack.index] ? unref(player).trackList[unref(player).currentTrack.index].name.replace(/\.[^/.]+$/, "") : "No Track Selected")}</h2></div><div class="flex flex-wrap gap-2" data-v-44542033${_scopeId}><div class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-musical-note",
              class: "w-3 h-3 text-gray-500"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(currentTrack).bpm)} BPM </div><div class="${ssrRenderClass([unref(currentTrack).duration > 0 ? "text-primary-400 border-primary-500/20 bg-primary-500/5" : "text-gray-300", "px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono flex items-center gap-1.5"])}" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clock",
              class: ["w-3 h-3", unref(currentTrack).duration > 0 ? "text-primary-500" : "text-gray-500"]
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(formatTime(unref(currentTrack).duration))}</div></div></div><div class="bg-black/40 rounded-xl border border-white/5 p-4 mb-6 relative group" data-v-44542033${_scopeId}><div class="flex justify-between items-center mb-3" data-v-44542033${_scopeId}><span class="text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chart-bar",
              class: "w-3 h-3"
            }, null, _parent2, _scopeId));
            _push2(` Analysis </span>`);
            _push2(ssrRenderComponent(_component_UPopover, { ui: { content: "w-64 bg-gray-900 border border-white/10 p-0 overflow-hidden rounded-lg shadow-xl" } }, {
              content: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-3 bg-gray-950" data-v-44542033${_scopeId2}><div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono" data-v-44542033${_scopeId2}><div class="text-gray-500" data-v-44542033${_scopeId2}>VIBE</div><div class="text-right text-white font-bold" data-v-44542033${_scopeId2}>${ssrInterpolate(unref(player).currentTrack.vibe?.name || "--")}</div><div class="text-gray-500" data-v-44542033${_scopeId2}>ENERGY</div><div class="text-right text-primary-400 font-bold" data-v-44542033${_scopeId2}>${ssrInterpolate(unref(player).currentTrack.vibe?.intensity?.toFixed(2) || "0.00")}</div><div class="col-span-2 h-px bg-white/10 my-1" data-v-44542033${_scopeId2}></div><div class="text-gray-500" data-v-44542033${_scopeId2}>BASS ENERGY</div><div class="text-right text-yellow-500 font-bold" data-v-44542033${_scopeId2}>${ssrInterpolate(unref(player).getLowEnergy().toFixed(0))}</div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-3 bg-gray-950" }, [
                      createVNode("div", { class: "grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono" }, [
                        createVNode("div", { class: "text-gray-500" }, "VIBE"),
                        createVNode("div", { class: "text-right text-white font-bold" }, toDisplayString(unref(player).currentTrack.vibe?.name || "--"), 1),
                        createVNode("div", { class: "text-gray-500" }, "ENERGY"),
                        createVNode("div", { class: "text-right text-primary-400 font-bold" }, toDisplayString(unref(player).currentTrack.vibe?.intensity?.toFixed(2) || "0.00"), 1),
                        createVNode("div", { class: "col-span-2 h-px bg-white/10 my-1" }),
                        createVNode("div", { class: "text-gray-500" }, "BASS ENERGY"),
                        createVNode("div", { class: "text-right text-yellow-500 font-bold" }, toDisplayString(unref(player).getLowEnergy().toFixed(0)), 1)
                      ])
                    ])
                  ];
                }
              }),
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<button class="text-[10px] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1" data-v-44542033${_scopeId2}> VIEW STATS `);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-chevron-down",
                    class: "w-3 h-3"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button>`);
                } else {
                  return [
                    createVNode("button", { class: "text-[10px] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1" }, [
                      createTextVNode(" VIEW STATS "),
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-chevron-down",
                        class: "w-3 h-3"
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="h-28 w-full relative flex items-center justify-center rounded-lg overflow-hidden bg-gray-900/50 mb-4 ring-1 ring-white/5" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Waveform, { class: "opacity-80 group-hover:opacity-100 transition-opacity duration-500" }, null, _parent2, _scopeId));
            _push2(`</div><div class="relative h-4 group/seek" data-v-44542033${_scopeId}>`);
            if (unref(player).currentTrack.duration > 0) {
              _push2(ssrRenderComponent(_component_URange, {
                modelValue: unref(seekProgress),
                "onUpdate:modelValue": ($event) => isRef(seekProgress) ? seekProgress.value = $event : null,
                min: 0,
                max: 100,
                step: 0.1,
                size: "xs",
                color: "primary",
                ui: {
                  base: "cursor-pointer",
                  track: { base: "h-1.5 group-hover/seek:h-2 transition-all bg-gray-700" },
                  thumb: { base: "w-3 h-3 group-hover/seek:w-4 group-hover/seek:h-4 transition-all" }
                }
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_UProgress, {
                value: 0,
                size: "xs",
                color: "gray",
                class: "h-1.5"
              }, null, _parent2, _scopeId));
            }
            _push2(`</div></div><div class="flex items-center gap-4 bg-black/20 rounded-lg p-3 border border-white/5" data-v-44542033${_scopeId}><div class="flex items-center gap-3 flex-1" data-v-44542033${_scopeId}><button class="text-gray-400 hover:text-white transition-colors" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: unref(volume) === 0 ? "i-heroicons-speaker-x-mark" : "i-heroicons-speaker-wave",
              class: "w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`</button>`);
            _push2(ssrRenderComponent(_component_USlider, {
              min: 0,
              max: 1,
              step: 0.01,
              modelValue: unref(volume),
              "onUpdate:modelValue": ($event) => isRef(volume) ? volume.value = $event : null,
              size: "sm",
              color: "white",
              class: "flex-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="h-6 w-px bg-white/10 mx-1" data-v-44542033${_scopeId}></div>`);
            _push2(ssrRenderComponent(_component_UPopover, { ui: { content: "w-auto bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-0" } }, {
              content: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-5 flex gap-4 bg-gray-950/95 backdrop-blur rounded-xl" data-v-44542033${_scopeId2}><!--[-->`);
                  ssrRenderList([60, 400, 2400, 15e3], (freq, index2) => {
                    _push3(`<div class="flex flex-col items-center gap-2 group" data-v-44542033${_scopeId2}><div class="h-32 flex items-center justify-center bg-gray-900/50 rounded-full p-1 ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all" data-v-44542033${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_USlider, {
                      orientation: "vertical",
                      min: -12,
                      max: 12,
                      step: 0.1,
                      "model-value": unref(player).eqNodes[[0, 2, 4, 6][index2]]?.gain.value || 0,
                      "onUpdate:modelValue": (val) => unref(player).setEqGain([0, 2, 4, 6][index2], val),
                      size: "xs",
                      color: "primary",
                      ui: { track: { background: "bg-gray-800" } }
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="text-center" data-v-44542033${_scopeId2}><div class="text-[9px] uppercase font-bold text-gray-500 mb-0.5" data-v-44542033${_scopeId2}>${ssrInterpolate(["Bass", "Lo-Mid", "Hi-Mid", "Air"][index2])}</div><div class="text-[9px] text-gray-600 font-mono" data-v-44542033${_scopeId2}>${ssrInterpolate(freq >= 1e3 ? freq / 1e3 + "k" : freq)}Hz</div></div></div>`);
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-5 flex gap-4 bg-gray-950/95 backdrop-blur rounded-xl" }, [
                      (openBlock(), createBlock(Fragment, null, renderList([60, 400, 2400, 15e3], (freq, index2) => {
                        return createVNode("div", {
                          key: freq,
                          class: "flex flex-col items-center gap-2 group"
                        }, [
                          createVNode("div", { class: "h-32 flex items-center justify-center bg-gray-900/50 rounded-full p-1 ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all" }, [
                            createVNode(_component_USlider, {
                              orientation: "vertical",
                              min: -12,
                              max: 12,
                              step: 0.1,
                              "model-value": unref(player).eqNodes[[0, 2, 4, 6][index2]]?.gain.value || 0,
                              "onUpdate:modelValue": (val) => unref(player).setEqGain([0, 2, 4, 6][index2], val),
                              size: "xs",
                              color: "primary",
                              ui: { track: { background: "bg-gray-800" } }
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("div", { class: "text-[9px] uppercase font-bold text-gray-500 mb-0.5" }, toDisplayString(["Bass", "Lo-Mid", "Hi-Mid", "Air"][index2]), 1),
                            createVNode("div", { class: "text-[9px] text-gray-600 font-mono" }, toDisplayString(freq >= 1e3 ? freq / 1e3 + "k" : freq) + "Hz", 1)
                          ])
                        ]);
                      }), 64))
                    ])
                  ];
                }
              }),
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    label: "EQ",
                    color: "neutral",
                    variant: "ghost",
                    size: "xs",
                    class: "font-mono font-bold",
                    "trailing-icon": "i-heroicons-adjustments-vertical"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      label: "EQ",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      class: "font-mono font-bold",
                      "trailing-icon": "i-heroicons-adjustments-vertical"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-44542033${_scopeId}><div class="bg-gray-900/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors" data-v-44542033${_scopeId}><div class="flex items-center gap-2 mb-4 text-gray-400" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-path-rounded-square",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs uppercase tracking-widest font-bold" data-v-44542033${_scopeId}>Automix</span></div><div class="grid grid-cols-2 gap-4" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Fade In (s)",
              ui: { label: "text-[10px] uppercase font-bold text-gray-500" }
            }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInputNumber, {
                    modelValue: unref(player).fadeDuration,
                    "onUpdate:modelValue": ($event) => unref(player).fadeDuration = $event,
                    size: "sm",
                    min: 0,
                    max: 30,
                    class: "font-mono"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInputNumber, {
                      modelValue: unref(player).fadeDuration,
                      "onUpdate:modelValue": ($event) => unref(player).fadeDuration = $event,
                      size: "sm",
                      min: 0,
                      max: 30,
                      class: "font-mono"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Fade Out (s)",
              ui: { label: "text-[10px] uppercase font-bold text-gray-500" }
            }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInputNumber, {
                    modelValue: unref(player).fadeOutDuration,
                    "onUpdate:modelValue": ($event) => unref(player).fadeOutDuration = $event,
                    size: "sm",
                    min: 0,
                    max: 30,
                    class: "font-mono"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInputNumber, {
                      modelValue: unref(player).fadeOutDuration,
                      "onUpdate:modelValue": ($event) => unref(player).fadeOutDuration = $event,
                      size: "sm",
                      min: 0,
                      max: 30,
                      class: "font-mono"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="bg-gray-900/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors" data-v-44542033${_scopeId}><div class="flex justify-between items-center mb-4" data-v-44542033${_scopeId}><div class="flex items-center gap-2 text-gray-400" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-eye",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs uppercase tracking-widest font-bold" data-v-44542033${_scopeId}>Visuals</span></div><div class="flex items-center gap-2" data-v-44542033${_scopeId}><span class="text-[9px] font-bold text-primary-500/80 uppercase" data-v-44542033${_scopeId}>Auto-Vibe</span>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(player).isVibeAuto,
              "onUpdate:modelValue": ($event) => unref(player).isVibeAuto = $event,
              color: "primary",
              size: "xs"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="space-y-4" data-v-44542033${_scopeId}><div class="grid grid-cols-2 gap-3" data-v-44542033${_scopeId}><div class="space-y-1" data-v-44542033${_scopeId}><label class="text-[9px] uppercase font-bold text-gray-500" data-v-44542033${_scopeId}>Speed</label>`);
            _push2(ssrRenderComponent(_component_USlider, {
              min: 0,
              max: 2,
              step: 0.1,
              modelValue: unref(uniforms).u_speed.value,
              "onUpdate:modelValue": ($event) => unref(uniforms).u_speed.value = $event,
              size: "xs",
              color: "gray"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-1" data-v-44542033${_scopeId}><label class="text-[9px] uppercase font-bold text-gray-500" data-v-44542033${_scopeId}>Density</label>`);
            _push2(ssrRenderComponent(_component_USlider, {
              min: 50,
              max: 500,
              step: 10,
              modelValue: unref(uniforms).u_partical_size.value,
              "onUpdate:modelValue": ($event) => unref(uniforms).u_partical_size.value = $event,
              size: "xs",
              color: "gray"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex items-center justify-between pt-2 border-t border-white/5" data-v-44542033${_scopeId}><div class="flex items-center gap-2" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(player).isFlashEnabled,
              "onUpdate:modelValue": ($event) => unref(player).isFlashEnabled = $event,
              color: "primary",
              size: "xs"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-[10px] font-bold text-gray-500 uppercase" data-v-44542033${_scopeId}>Flash FX</span></div>`);
            _push2(ssrRenderComponent(_component_UPopover, null, {
              content: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-3 p-3 bg-gray-950 border border-white/10 rounded-xl" data-v-44542033${_scopeId2}><div class="text-center space-y-1" data-v-44542033${_scopeId2}><div class="text-[8px] uppercase text-gray-500 font-bold" data-v-44542033${_scopeId2}>Primary</div>`);
                  _push3(ssrRenderComponent(_component_UColorPicker, {
                    modelValue: unref(uniforms).u_color_a.value,
                    "onUpdate:modelValue": ($event) => unref(uniforms).u_color_a.value = $event,
                    class: "p-0"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="text-center space-y-1" data-v-44542033${_scopeId2}><div class="text-[8px] uppercase text-gray-500 font-bold" data-v-44542033${_scopeId2}>Secondary</div>`);
                  _push3(ssrRenderComponent(_component_UColorPicker, {
                    modelValue: unref(uniforms).u_color_b.value,
                    "onUpdate:modelValue": ($event) => unref(uniforms).u_color_b.value = $event,
                    class: "p-0"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-3 p-3 bg-gray-950 border border-white/10 rounded-xl" }, [
                      createVNode("div", { class: "text-center space-y-1" }, [
                        createVNode("div", { class: "text-[8px] uppercase text-gray-500 font-bold" }, "Primary"),
                        createVNode(_component_UColorPicker, {
                          modelValue: unref(uniforms).u_color_a.value,
                          "onUpdate:modelValue": ($event) => unref(uniforms).u_color_a.value = $event,
                          class: "p-0"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "text-center space-y-1" }, [
                        createVNode("div", { class: "text-[8px] uppercase text-gray-500 font-bold" }, "Secondary"),
                        createVNode(_component_UColorPicker, {
                          modelValue: unref(uniforms).u_color_b.value,
                          "onUpdate:modelValue": ($event) => unref(uniforms).u_color_b.value = $event,
                          class: "p-0"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ])
                  ];
                }
              }),
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors" data-v-44542033${_scopeId2}><span class="text-[10px] font-bold text-gray-400 uppercase" data-v-44542033${_scopeId2}>Theme</span><div class="flex -space-x-1.5" data-v-44542033${_scopeId2}><span style="${ssrRenderStyle(unref(primaryChip))}" class="size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm" data-v-44542033${_scopeId2}></span><span style="${ssrRenderStyle(unref(secondaryChip))}" class="size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm" data-v-44542033${_scopeId2}></span></div></button>`);
                } else {
                  return [
                    createVNode("button", { class: "flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors" }, [
                      createVNode("span", { class: "text-[10px] font-bold text-gray-400 uppercase" }, "Theme"),
                      createVNode("div", { class: "flex -space-x-1.5" }, [
                        createVNode("span", {
                          style: unref(primaryChip),
                          class: "size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm"
                        }, null, 4),
                        createVNode("span", {
                          style: unref(secondaryChip),
                          class: "size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm"
                        }, null, 4)
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></div></div><div class="lg:col-span-5 xl:col-span-4 flex flex-col h-[500px] lg:h-0 lg:min-h-full bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm" data-v-44542033${_scopeId}><div class="p-4 border-b border-white/5 bg-gray-900/50 flex justify-between items-center" data-v-44542033${_scopeId}><div class="flex items-center gap-2" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-queue-list",
              class: "w-4 h-4 text-primary-400"
            }, null, _parent2, _scopeId));
            _push2(`<span class="font-bold text-sm text-white" data-v-44542033${_scopeId}>QUEUE</span>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "soft",
              size: "xs",
              class: "font-mono ml-1"
            }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(player).trackList.length)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(player).trackList.length), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(player).trackList.length > 0) {
              _push2(ssrRenderComponent(_component_UButton, {
                icon: "i-heroicons-trash",
                color: "neutral",
                variant: "ghost",
                size: "xs",
                onClick: ($event) => {
                  unref(player).trackList = [];
                  unref(player).stop();
                }
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative" data-v-44542033${_scopeId}>`);
            if (unref(player).trackList.length === 0) {
              _push2(`<div class="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-6 text-center border-2 border-dashed border-gray-800 m-4 rounded-xl" data-v-44542033${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-musical-note",
                class: "text-4xl mb-3 text-gray-800"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm font-medium text-gray-500" data-v-44542033${_scopeId}>Your queue is empty</span><span class="text-xs text-gray-600 mt-1" data-v-44542033${_scopeId}>Upload tracks below to start the party</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(player).trackList, (file, index2) => {
              _push2(`<div draggable="true" class="${ssrRenderClass([[
                unref(player).currentTrack.index === index2 ? "bg-primary-500/10 border-primary-500/20 shadow-[0_0_20px_rgba(var(--color-primary-500),0.05)]" : "hover:bg-white/5 hover:border-white/5"
              ], "group relative flex items-center gap-3 p-2.5 rounded-lg cursor-pointer select-none transition-all border border-transparent"])}" data-v-44542033${_scopeId}><div class="w-8 flex justify-center items-center text-gray-500 font-mono text-xs" data-v-44542033${_scopeId}>`);
              if (unref(player).currentTrack.index === index2) {
                _push2(`<div class="flex items-end gap-[2px] h-3" data-v-44542033${_scopeId}><div class="w-0.5 bg-primary-400 animate-[audio-eq_0.6s_ease-in-out_infinite] h-full" data-v-44542033${_scopeId}></div><div class="w-0.5 bg-primary-400 animate-[audio-eq_0.8s_ease-in-out_infinite_0.1s] h-full" data-v-44542033${_scopeId}></div><div class="w-0.5 bg-primary-400 animate-[audio-eq_0.5s_ease-in-out_infinite_0.2s] h-full" data-v-44542033${_scopeId}></div></div>`);
              } else {
                _push2(`<span class="group-hover:hidden" data-v-44542033${_scopeId}>${ssrInterpolate(index2 + 1)}</span>`);
              }
              if (unref(player).currentTrack.index !== index2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-play-solid",
                  class: "hidden group-hover:block w-3 h-3 text-white"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex-1 min-w-0" data-v-44542033${_scopeId}><div class="flex justify-between items-start" data-v-44542033${_scopeId}><p class="${ssrRenderClass([unref(player).currentTrack.index === index2 ? "text-primary-100" : "text-gray-300", "truncate text-sm font-medium mb-0.5"])}" data-v-44542033${_scopeId}>${ssrInterpolate(file.name.replace(/\.[^/.]+$/, ""))}</p></div><div class="flex items-center gap-2" data-v-44542033${_scopeId}>`);
              if (index2 === unref(player).currentTrack.index + 1) {
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "primary",
                  variant: "solid",
                  size: "xs",
                  class: "text-[8px] px-1 py-0 h-3.5 leading-none"
                }, {
                  default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`NEXT`);
                    } else {
                      return [
                        createTextVNode("NEXT")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(player).audioBuffers[index2]?.vibe) {
                _push2(`<div class="flex gap-2 text-[9px] items-center text-gray-500 font-mono" data-v-44542033${_scopeId}><span data-v-44542033${_scopeId}>${ssrInterpolate(unref(player).audioBuffers[index2].bpm)} BPM</span><span class="w-0.5 h-0.5 rounded-full bg-gray-600" data-v-44542033${_scopeId}></span><span class="font-bold tracking-wider" style="${ssrRenderStyle({ color: unref(player).audioBuffers[index2].vibe.colorA })}" data-v-44542033${_scopeId}>${ssrInterpolate(unref(player).audioBuffers[index2].vibe.name.toUpperCase())}</span></div>`);
              } else {
                _push2(`<div class="h-2 w-16 bg-white/5 rounded animate-pulse" data-v-44542033${_scopeId}></div>`);
              }
              _push2(`</div></div><div class="text-xs font-mono text-gray-600 group-hover:text-gray-400" data-v-44542033${_scopeId}>`);
              if (unref(player).audioBuffers[index2]) {
                _push2(`<span data-v-44542033${_scopeId}>${ssrInterpolate(formatTime(unref(player).audioBuffers[index2].buffer.duration))}</span>`);
              } else {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-loader-2",
                  class: "animate-spin w-3 h-3"
                }, null, _parent2, _scopeId));
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div><div class="p-4 bg-gray-900/80 border-t border-white/5 flex gap-2" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => unref(player).startPlayer(),
              disabled: unref(player).trackList.length == 0,
              label: unref(player).isPlaying ? "Restart" : "Start Playback",
              icon: unref(player).isPlaying ? "i-heroicons-arrow-path" : "i-heroicons-play-20-solid",
              color: "primary",
              variant: "solid",
              size: "md",
              block: "",
              class: "flex-1 font-bold shadow-lg shadow-primary-500/20"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => unref(player).pausePlayer(),
              icon: "i-heroicons-pause-20-solid",
              color: "neutral",
              variant: "soft",
              size: "md"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => unref(player).stop(),
              icon: "i-heroicons-stop-20-solid",
              color: "neutral",
              variant: "soft",
              size: "md"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="p-3 bg-gray-950 border-t border-white/5 space-y-3" data-v-44542033${_scopeId}><div class="flex gap-2" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(youtubeUrl),
              "onUpdate:modelValue": ($event) => isRef(youtubeUrl) ? youtubeUrl.value = $event : null,
              placeholder: "Paste YouTube URL...",
              size: "xs",
              color: "gray",
              variant: "outline",
              class: "flex-1 font-mono text-[10px]",
              ui: { icon: { trailing: { pointer: "" } } },
              onKeyup: addYoutubeTrack
            }, {
              trailing: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(youtubeUrl)) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      loading: unref(isDownloading),
                      onClick: addYoutubeTrack,
                      color: "primary",
                      variant: "ghost",
                      size: "2xs",
                      icon: "i-heroicons-arrow-right-20-solid"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(youtubeUrl) ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      loading: unref(isDownloading),
                      onClick: addYoutubeTrack,
                      color: "primary",
                      variant: "ghost",
                      size: "2xs",
                      icon: "i-heroicons-arrow-right-20-solid"
                    }, null, 8, ["loading"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="relative group" data-v-44542033${_scopeId}><label class="flex flex-col items-center justify-center w-full h-12 border border-gray-800 border-dashed rounded-lg cursor-pointer bg-gray-900/30 hover:bg-gray-800 hover:border-gray-600 transition-all" data-v-44542033${_scopeId}><div class="flex items-center gap-2 text-gray-500 group-hover:text-gray-300" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-up-tray",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-[10px] font-medium uppercase tracking-wider" data-v-44542033${_scopeId}>Drop / Click to Upload</span></div><input type="file" class="hidden" multiple accept="audio/*" data-v-44542033${_scopeId}></label>`);
            if (unref(player).processingState.isProcessing) {
              _push2(`<div class="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-between px-4 z-10 border border-primary-500/30" data-v-44542033${_scopeId}><div class="flex items-center gap-3" data-v-44542033${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-2",
                class: "w-4 h-4 text-primary-400 animate-spin"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex flex-col" data-v-44542033${_scopeId}><span class="text-[10px] font-bold text-primary-400 uppercase tracking-wide" data-v-44542033${_scopeId}>Analyzing Vibes</span><span class="text-[9px] text-gray-500 font-mono" data-v-44542033${_scopeId}>${ssrInterpolate(unref(player).processingState.current)} / ${ssrInterpolate(unref(player).processingState.total)} tracks</span></div></div><div class="w-20" data-v-44542033${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UProgress, {
                value: unref(player).processingState.current / unref(player).processingState.total * 100,
                size: "xs",
                color: "primary"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full h-[85vh] sm:h-auto overflow-y-auto sm:overflow-visible bg-gray-950/90 sm:bg-transparent" }, [
                createVNode("div", { class: "max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" }, [
                  createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-12 grid-rows-1 gap-6 lg:gap-8 h-full" }, [
                    createVNode("div", { class: "lg:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full lg:overflow-y-auto custom-scrollbar pr-1" }, [
                      createVNode("div", { class: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 shadow-2xl" }, [
                        createVNode("div", { class: "absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" }),
                        createVNode("div", { class: "relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6" }, [
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode(Transition, {
                              name: "fade",
                              mode: "out-in"
                            }, {
                              default: withCtx(() => [
                                unref(player).transitionState.active ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "flex items-center gap-2 text-primary-400 mb-1"
                                }, [
                                  createVNode("span", { class: "relative flex h-2 w-2" }, [
                                    createVNode("span", { class: "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" }),
                                    createVNode("span", { class: "relative inline-flex rounded-full h-2 w-2 bg-primary-500" })
                                  ]),
                                  createVNode("span", { class: "text-[10px] uppercase tracking-widest font-bold" }, "Mixing from " + toDisplayString(unref(player).transitionState.fromName), 1)
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "flex items-center gap-2 text-gray-500 mb-1"
                                }, [
                                  createVNode("span", { class: "w-1.5 h-1.5 rounded-full bg-green-500" }),
                                  createVNode("span", { class: "text-[10px] uppercase tracking-widest font-bold" }, "Now Playing")
                                ]))
                              ]),
                              _: 1
                            }),
                            createVNode("h2", {
                              class: "text-2xl sm:text-3xl font-bold text-white truncate tracking-tight",
                              title: unref(player).trackList[unref(player).currentTrack.index]?.name
                            }, toDisplayString(unref(player).currentTrack.index !== -1 && unref(player).trackList[unref(player).currentTrack.index] ? unref(player).trackList[unref(player).currentTrack.index].name.replace(/\.[^/.]+$/, "") : "No Track Selected"), 9, ["title"])
                          ]),
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            createVNode("div", { class: "px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-musical-note",
                                class: "w-3 h-3 text-gray-500"
                              }),
                              createTextVNode(" " + toDisplayString(unref(currentTrack).bpm) + " BPM ", 1)
                            ]),
                            createVNode("div", {
                              class: ["px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono flex items-center gap-1.5", unref(currentTrack).duration > 0 ? "text-primary-400 border-primary-500/20 bg-primary-500/5" : "text-gray-300"]
                            }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-clock",
                                class: ["w-3 h-3", unref(currentTrack).duration > 0 ? "text-primary-500" : "text-gray-500"]
                              }, null, 8, ["class"]),
                              createTextVNode(" " + toDisplayString(formatTime(unref(currentTrack).duration)), 1)
                            ], 2)
                          ])
                        ]),
                        createVNode("div", { class: "bg-black/40 rounded-xl border border-white/5 p-4 mb-6 relative group" }, [
                          createVNode("div", { class: "flex justify-between items-center mb-3" }, [
                            createVNode("span", { class: "text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-chart-bar",
                                class: "w-3 h-3"
                              }),
                              createTextVNode(" Analysis ")
                            ]),
                            createVNode(_component_UPopover, { ui: { content: "w-64 bg-gray-900 border border-white/10 p-0 overflow-hidden rounded-lg shadow-xl" } }, {
                              content: withCtx(() => [
                                createVNode("div", { class: "p-3 bg-gray-950" }, [
                                  createVNode("div", { class: "grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono" }, [
                                    createVNode("div", { class: "text-gray-500" }, "VIBE"),
                                    createVNode("div", { class: "text-right text-white font-bold" }, toDisplayString(unref(player).currentTrack.vibe?.name || "--"), 1),
                                    createVNode("div", { class: "text-gray-500" }, "ENERGY"),
                                    createVNode("div", { class: "text-right text-primary-400 font-bold" }, toDisplayString(unref(player).currentTrack.vibe?.intensity?.toFixed(2) || "0.00"), 1),
                                    createVNode("div", { class: "col-span-2 h-px bg-white/10 my-1" }),
                                    createVNode("div", { class: "text-gray-500" }, "BASS ENERGY"),
                                    createVNode("div", { class: "text-right text-yellow-500 font-bold" }, toDisplayString(unref(player).getLowEnergy().toFixed(0)), 1)
                                  ])
                                ])
                              ]),
                              default: withCtx(() => [
                                createVNode("button", { class: "text-[10px] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1" }, [
                                  createTextVNode(" VIEW STATS "),
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-chevron-down",
                                    class: "w-3 h-3"
                                  })
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "h-28 w-full relative flex items-center justify-center rounded-lg overflow-hidden bg-gray-900/50 mb-4 ring-1 ring-white/5" }, [
                            createVNode(_component_Waveform, { class: "opacity-80 group-hover:opacity-100 transition-opacity duration-500" })
                          ]),
                          createVNode("div", { class: "relative h-4 group/seek" }, [
                            unref(player).currentTrack.duration > 0 ? (openBlock(), createBlock(_component_URange, {
                              key: 0,
                              modelValue: unref(seekProgress),
                              "onUpdate:modelValue": ($event) => isRef(seekProgress) ? seekProgress.value = $event : null,
                              min: 0,
                              max: 100,
                              step: 0.1,
                              size: "xs",
                              color: "primary",
                              ui: {
                                base: "cursor-pointer",
                                track: { base: "h-1.5 group-hover/seek:h-2 transition-all bg-gray-700" },
                                thumb: { base: "w-3 h-3 group-hover/seek:w-4 group-hover/seek:h-4 transition-all" }
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UProgress, {
                              key: 1,
                              value: 0,
                              size: "xs",
                              color: "gray",
                              class: "h-1.5"
                            }))
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center gap-4 bg-black/20 rounded-lg p-3 border border-white/5" }, [
                          createVNode("div", { class: "flex items-center gap-3 flex-1" }, [
                            createVNode("button", {
                              onClick: ($event) => unref(volume) === 0 ? volume.value = 0.5 : volume.value = 0,
                              class: "text-gray-400 hover:text-white transition-colors"
                            }, [
                              createVNode(_component_UIcon, {
                                name: unref(volume) === 0 ? "i-heroicons-speaker-x-mark" : "i-heroicons-speaker-wave",
                                class: "w-5 h-5"
                              }, null, 8, ["name"])
                            ], 8, ["onClick"]),
                            createVNode(_component_USlider, {
                              min: 0,
                              max: 1,
                              step: 0.01,
                              modelValue: unref(volume),
                              "onUpdate:modelValue": ($event) => isRef(volume) ? volume.value = $event : null,
                              size: "sm",
                              color: "white",
                              class: "flex-1"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "h-6 w-px bg-white/10 mx-1" }),
                          createVNode(_component_UPopover, { ui: { content: "w-auto bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-0" } }, {
                            content: withCtx(() => [
                              createVNode("div", { class: "p-5 flex gap-4 bg-gray-950/95 backdrop-blur rounded-xl" }, [
                                (openBlock(), createBlock(Fragment, null, renderList([60, 400, 2400, 15e3], (freq, index2) => {
                                  return createVNode("div", {
                                    key: freq,
                                    class: "flex flex-col items-center gap-2 group"
                                  }, [
                                    createVNode("div", { class: "h-32 flex items-center justify-center bg-gray-900/50 rounded-full p-1 ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all" }, [
                                      createVNode(_component_USlider, {
                                        orientation: "vertical",
                                        min: -12,
                                        max: 12,
                                        step: 0.1,
                                        "model-value": unref(player).eqNodes[[0, 2, 4, 6][index2]]?.gain.value || 0,
                                        "onUpdate:modelValue": (val) => unref(player).setEqGain([0, 2, 4, 6][index2], val),
                                        size: "xs",
                                        color: "primary",
                                        ui: { track: { background: "bg-gray-800" } }
                                      }, null, 8, ["model-value", "onUpdate:modelValue"])
                                    ]),
                                    createVNode("div", { class: "text-center" }, [
                                      createVNode("div", { class: "text-[9px] uppercase font-bold text-gray-500 mb-0.5" }, toDisplayString(["Bass", "Lo-Mid", "Hi-Mid", "Air"][index2]), 1),
                                      createVNode("div", { class: "text-[9px] text-gray-600 font-mono" }, toDisplayString(freq >= 1e3 ? freq / 1e3 + "k" : freq) + "Hz", 1)
                                    ])
                                  ]);
                                }), 64))
                              ])
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_UButton, {
                                label: "EQ",
                                color: "neutral",
                                variant: "ghost",
                                size: "xs",
                                class: "font-mono font-bold",
                                "trailing-icon": "i-heroicons-adjustments-vertical"
                              })
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "bg-gray-900/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors" }, [
                          createVNode("div", { class: "flex items-center gap-2 mb-4 text-gray-400" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-arrow-path-rounded-square",
                              class: "w-4 h-4"
                            }),
                            createVNode("span", { class: "text-xs uppercase tracking-widest font-bold" }, "Automix")
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormField, {
                              label: "Fade In (s)",
                              ui: { label: "text-[10px] uppercase font-bold text-gray-500" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInputNumber, {
                                  modelValue: unref(player).fadeDuration,
                                  "onUpdate:modelValue": ($event) => unref(player).fadeDuration = $event,
                                  size: "sm",
                                  min: 0,
                                  max: 30,
                                  class: "font-mono"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormField, {
                              label: "Fade Out (s)",
                              ui: { label: "text-[10px] uppercase font-bold text-gray-500" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInputNumber, {
                                  modelValue: unref(player).fadeOutDuration,
                                  "onUpdate:modelValue": ($event) => unref(player).fadeOutDuration = $event,
                                  size: "sm",
                                  min: 0,
                                  max: 30,
                                  class: "font-mono"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        createVNode("div", { class: "bg-gray-900/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors" }, [
                          createVNode("div", { class: "flex justify-between items-center mb-4" }, [
                            createVNode("div", { class: "flex items-center gap-2 text-gray-400" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-eye",
                                class: "w-4 h-4"
                              }),
                              createVNode("span", { class: "text-xs uppercase tracking-widest font-bold" }, "Visuals")
                            ]),
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode("span", { class: "text-[9px] font-bold text-primary-500/80 uppercase" }, "Auto-Vibe"),
                              createVNode(_component_USwitch, {
                                modelValue: unref(player).isVibeAuto,
                                "onUpdate:modelValue": ($event) => unref(player).isVibeAuto = $event,
                                color: "primary",
                                size: "xs"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ]),
                          createVNode("div", { class: "space-y-4" }, [
                            createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                              createVNode("div", { class: "space-y-1" }, [
                                createVNode("label", { class: "text-[9px] uppercase font-bold text-gray-500" }, "Speed"),
                                createVNode(_component_USlider, {
                                  min: 0,
                                  max: 2,
                                  step: 0.1,
                                  modelValue: unref(uniforms).u_speed.value,
                                  "onUpdate:modelValue": ($event) => unref(uniforms).u_speed.value = $event,
                                  size: "xs",
                                  color: "gray"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", { class: "space-y-1" }, [
                                createVNode("label", { class: "text-[9px] uppercase font-bold text-gray-500" }, "Density"),
                                createVNode(_component_USlider, {
                                  min: 50,
                                  max: 500,
                                  step: 10,
                                  modelValue: unref(uniforms).u_partical_size.value,
                                  "onUpdate:modelValue": ($event) => unref(uniforms).u_partical_size.value = $event,
                                  size: "xs",
                                  color: "gray"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ])
                            ]),
                            createVNode("div", { class: "flex items-center justify-between pt-2 border-t border-white/5" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode(_component_USwitch, {
                                  modelValue: unref(player).isFlashEnabled,
                                  "onUpdate:modelValue": ($event) => unref(player).isFlashEnabled = $event,
                                  color: "primary",
                                  size: "xs"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("span", { class: "text-[10px] font-bold text-gray-500 uppercase" }, "Flash FX")
                              ]),
                              createVNode(_component_UPopover, null, {
                                content: withCtx(() => [
                                  createVNode("div", { class: "flex gap-3 p-3 bg-gray-950 border border-white/10 rounded-xl" }, [
                                    createVNode("div", { class: "text-center space-y-1" }, [
                                      createVNode("div", { class: "text-[8px] uppercase text-gray-500 font-bold" }, "Primary"),
                                      createVNode(_component_UColorPicker, {
                                        modelValue: unref(uniforms).u_color_a.value,
                                        "onUpdate:modelValue": ($event) => unref(uniforms).u_color_a.value = $event,
                                        class: "p-0"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode("div", { class: "text-center space-y-1" }, [
                                      createVNode("div", { class: "text-[8px] uppercase text-gray-500 font-bold" }, "Secondary"),
                                      createVNode(_component_UColorPicker, {
                                        modelValue: unref(uniforms).u_color_b.value,
                                        "onUpdate:modelValue": ($event) => unref(uniforms).u_color_b.value = $event,
                                        class: "p-0"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ])
                                  ])
                                ]),
                                default: withCtx(() => [
                                  createVNode("button", { class: "flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors" }, [
                                    createVNode("span", { class: "text-[10px] font-bold text-gray-400 uppercase" }, "Theme"),
                                    createVNode("div", { class: "flex -space-x-1.5" }, [
                                      createVNode("span", {
                                        style: unref(primaryChip),
                                        class: "size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm"
                                      }, null, 4),
                                      createVNode("span", {
                                        style: unref(secondaryChip),
                                        class: "size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm"
                                      }, null, 4)
                                    ])
                                  ])
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "lg:col-span-5 xl:col-span-4 flex flex-col h-[500px] lg:h-0 lg:min-h-full bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm" }, [
                      createVNode("div", { class: "p-4 border-b border-white/5 bg-gray-900/50 flex justify-between items-center" }, [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-queue-list",
                            class: "w-4 h-4 text-primary-400"
                          }),
                          createVNode("span", { class: "font-bold text-sm text-white" }, "QUEUE"),
                          createVNode(_component_UBadge, {
                            color: "neutral",
                            variant: "soft",
                            size: "xs",
                            class: "font-mono ml-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(player).trackList.length), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        unref(player).trackList.length > 0 ? (openBlock(), createBlock(_component_UButton, {
                          key: 0,
                          icon: "i-heroicons-trash",
                          color: "neutral",
                          variant: "ghost",
                          size: "xs",
                          onClick: ($event) => {
                            unref(player).trackList = [];
                            unref(player).stop();
                          }
                        }, null, 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative" }, [
                        unref(player).trackList.length === 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-6 text-center border-2 border-dashed border-gray-800 m-4 rounded-xl"
                        }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-musical-note",
                            class: "text-4xl mb-3 text-gray-800"
                          }),
                          createVNode("span", { class: "text-sm font-medium text-gray-500" }, "Your queue is empty"),
                          createVNode("span", { class: "text-xs text-gray-600 mt-1" }, "Upload tracks below to start the party")
                        ])) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(player).trackList, (file, index2) => {
                          return openBlock(), createBlock("div", {
                            key: file.name + index2,
                            draggable: "true",
                            onDragstart: ($event) => onDragStart($event, index2),
                            onDrop: ($event) => onDrop($event, index2),
                            onDragover: withModifiers(() => {
                            }, ["prevent"]),
                            onClick: ($event) => onTrackClick(index2),
                            class: ["group relative flex items-center gap-3 p-2.5 rounded-lg cursor-pointer select-none transition-all border border-transparent", [
                              unref(player).currentTrack.index === index2 ? "bg-primary-500/10 border-primary-500/20 shadow-[0_0_20px_rgba(var(--color-primary-500),0.05)]" : "hover:bg-white/5 hover:border-white/5"
                            ]]
                          }, [
                            createVNode("div", { class: "w-8 flex justify-center items-center text-gray-500 font-mono text-xs" }, [
                              unref(player).currentTrack.index === index2 ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex items-end gap-[2px] h-3"
                              }, [
                                createVNode("div", { class: "w-0.5 bg-primary-400 animate-[audio-eq_0.6s_ease-in-out_infinite] h-full" }),
                                createVNode("div", { class: "w-0.5 bg-primary-400 animate-[audio-eq_0.8s_ease-in-out_infinite_0.1s] h-full" }),
                                createVNode("div", { class: "w-0.5 bg-primary-400 animate-[audio-eq_0.5s_ease-in-out_infinite_0.2s] h-full" })
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "group-hover:hidden"
                              }, toDisplayString(index2 + 1), 1)),
                              unref(player).currentTrack.index !== index2 ? (openBlock(), createBlock(_component_UIcon, {
                                key: 2,
                                name: "i-heroicons-play-solid",
                                class: "hidden group-hover:block w-3 h-3 text-white"
                              })) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "flex-1 min-w-0" }, [
                              createVNode("div", { class: "flex justify-between items-start" }, [
                                createVNode("p", {
                                  class: ["truncate text-sm font-medium mb-0.5", unref(player).currentTrack.index === index2 ? "text-primary-100" : "text-gray-300"]
                                }, toDisplayString(file.name.replace(/\.[^/.]+$/, "")), 3)
                              ]),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                index2 === unref(player).currentTrack.index + 1 ? (openBlock(), createBlock(_component_UBadge, {
                                  key: 0,
                                  color: "primary",
                                  variant: "solid",
                                  size: "xs",
                                  class: "text-[8px] px-1 py-0 h-3.5 leading-none"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("NEXT")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                unref(player).audioBuffers[index2]?.vibe ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "flex gap-2 text-[9px] items-center text-gray-500 font-mono"
                                }, [
                                  createVNode("span", null, toDisplayString(unref(player).audioBuffers[index2].bpm) + " BPM", 1),
                                  createVNode("span", { class: "w-0.5 h-0.5 rounded-full bg-gray-600" }),
                                  createVNode("span", {
                                    class: "font-bold tracking-wider",
                                    style: { color: unref(player).audioBuffers[index2].vibe.colorA }
                                  }, toDisplayString(unref(player).audioBuffers[index2].vibe.name.toUpperCase()), 5)
                                ])) : (openBlock(), createBlock("div", {
                                  key: 2,
                                  class: "h-2 w-16 bg-white/5 rounded animate-pulse"
                                }))
                              ])
                            ]),
                            createVNode("div", { class: "text-xs font-mono text-gray-600 group-hover:text-gray-400" }, [
                              unref(player).audioBuffers[index2] ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(formatTime(unref(player).audioBuffers[index2].buffer.duration)), 1)) : (openBlock(), createBlock(_component_UIcon, {
                                key: 1,
                                name: "i-lucide-loader-2",
                                class: "animate-spin w-3 h-3"
                              }))
                            ])
                          ], 42, ["onDragstart", "onDrop", "onDragover", "onClick"]);
                        }), 128))
                      ]),
                      createVNode("div", { class: "p-4 bg-gray-900/80 border-t border-white/5 flex gap-2" }, [
                        createVNode(_component_UButton, {
                          onClick: ($event) => unref(player).startPlayer(),
                          disabled: unref(player).trackList.length == 0,
                          label: unref(player).isPlaying ? "Restart" : "Start Playback",
                          icon: unref(player).isPlaying ? "i-heroicons-arrow-path" : "i-heroicons-play-20-solid",
                          color: "primary",
                          variant: "solid",
                          size: "md",
                          block: "",
                          class: "flex-1 font-bold shadow-lg shadow-primary-500/20"
                        }, null, 8, ["onClick", "disabled", "label", "icon"]),
                        createVNode(_component_UButton, {
                          onClick: ($event) => unref(player).pausePlayer(),
                          icon: "i-heroicons-pause-20-solid",
                          color: "neutral",
                          variant: "soft",
                          size: "md"
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          onClick: ($event) => unref(player).stop(),
                          icon: "i-heroicons-stop-20-solid",
                          color: "neutral",
                          variant: "soft",
                          size: "md"
                        }, null, 8, ["onClick"])
                      ]),
                      createVNode("div", { class: "p-3 bg-gray-950 border-t border-white/5 space-y-3" }, [
                        createVNode("div", { class: "flex gap-2" }, [
                          createVNode(_component_UInput, {
                            modelValue: unref(youtubeUrl),
                            "onUpdate:modelValue": ($event) => isRef(youtubeUrl) ? youtubeUrl.value = $event : null,
                            placeholder: "Paste YouTube URL...",
                            size: "xs",
                            color: "gray",
                            variant: "outline",
                            class: "flex-1 font-mono text-[10px]",
                            ui: { icon: { trailing: { pointer: "" } } },
                            onKeyup: withKeys(addYoutubeTrack, ["enter"])
                          }, {
                            trailing: withCtx(() => [
                              unref(youtubeUrl) ? (openBlock(), createBlock(_component_UButton, {
                                key: 0,
                                loading: unref(isDownloading),
                                onClick: addYoutubeTrack,
                                color: "primary",
                                variant: "ghost",
                                size: "2xs",
                                icon: "i-heroicons-arrow-right-20-solid"
                              }, null, 8, ["loading"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "relative group" }, [
                          createVNode("label", { class: "flex flex-col items-center justify-center w-full h-12 border border-gray-800 border-dashed rounded-lg cursor-pointer bg-gray-900/30 hover:bg-gray-800 hover:border-gray-600 transition-all" }, [
                            createVNode("div", { class: "flex items-center gap-2 text-gray-500 group-hover:text-gray-300" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-arrow-up-tray",
                                class: "w-4 h-4"
                              }),
                              createVNode("span", { class: "text-[10px] font-medium uppercase tracking-wider" }, "Drop / Click to Upload")
                            ]),
                            createVNode("input", {
                              type: "file",
                              class: "hidden",
                              multiple: "",
                              accept: "audio/*",
                              onChange: onNativeFileChange
                            }, null, 32)
                          ]),
                          createVNode(Transition, { name: "fade" }, {
                            default: withCtx(() => [
                              unref(player).processingState.isProcessing ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-between px-4 z-10 border border-primary-500/30"
                              }, [
                                createVNode("div", { class: "flex items-center gap-3" }, [
                                  createVNode(_component_UIcon, {
                                    name: "i-lucide-loader-2",
                                    class: "w-4 h-4 text-primary-400 animate-spin"
                                  }),
                                  createVNode("div", { class: "flex flex-col" }, [
                                    createVNode("span", { class: "text-[10px] font-bold text-primary-400 uppercase tracking-wide" }, "Analyzing Vibes"),
                                    createVNode("span", { class: "text-[9px] text-gray-500 font-mono" }, toDisplayString(unref(player).processingState.current) + " / " + toDisplayString(unref(player).processingState.total) + " tracks", 1)
                                  ])
                                ]),
                                createVNode("div", { class: "w-20" }, [
                                  createVNode(_component_UProgress, {
                                    value: unref(player).processingState.current / unref(player).processingState.total * 100,
                                    size: "xs",
                                    color: "primary"
                                  }, null, 8, ["value"])
                                ])
                              ])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-center w-full pb-2 pt-1" data-v-44542033${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              label: "CONTROLS",
              color: "neutral",
              variant: "ghost",
              size: "xs",
              class: "font-mono tracking-widest text-gray-500 hover:text-white",
              "trailing-icon": "i-lucide-chevron-up"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-center w-full pb-2 pt-1" }, [
                createVNode(_component_UButton, {
                  label: "CONTROLS",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  class: "font-mono tracking-widest text-gray-500 hover:text-white",
                  "trailing-icon": "i-lucide-chevron-up"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Overflow.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__scopeId", "data-v-44542033"]]), { __name: "Overflow" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "TrackTitle",
  __ssrInlineRender: true,
  props: {
    text: {},
    visible: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      if (props.visible && props.text) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "track-title-overlay" }, _attrs))} data-v-096f9741><span class="track-title-text" data-v-096f9741>${ssrInterpolate(props.text)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrackTitle.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["__scopeId", "data-v-096f9741"]]), { __name: "TrackTitle" });
const _sfc_main$5 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<span${ssrRenderAttrs(_attrs)}></span>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@tresjs/nuxt/dist/runtime/TresCanvas.server.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender]]), { __name: "TresCanvas" });
const _e = createEventHook(), be$1 = createEventHook(), re$1 = createEventHook(), j$1 = new Clock();
let V = 0, F = 0;
const { pause: Wt, resume: Vt, isActive: Ft } = useRafFn(
  () => {
    _e.trigger({ delta: V, elapsed: F, clock: j$1 }), be$1.trigger({ delta: V, elapsed: F, clock: j$1 }), re$1.trigger({ delta: V, elapsed: F, clock: j$1 });
  },
  { immediate: false }
);
re$1.on(() => {
  V = j$1.getDelta(), F = j$1.getElapsedTime();
});
const G$1 = () => ({
  onBeforeLoop: _e.on,
  onLoop: be$1.on,
  onAfterLoop: re$1.on,
  pause: Wt,
  resume: Vt,
  isActive: Ft
}), I = "[TresJS ▲ ■ ●] ";
function P() {
  function e(...o) {
    typeof o[0] == "string" ? o[0] = I + o[0] : o.unshift(I), console.error(...o);
  }
  function r(...o) {
    typeof o[0] == "string" ? o[0] = I + o[0] : o.unshift(I), console.warn(...o);
  }
  function t(o, s) {
  }
  return {
    logError: e,
    logWarning: r,
    logMessage: t
  };
}
const Qt = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", qt = /* @__PURE__ */ Jt(Qt);
function ce(e) {
  return e && e.nodeType === 1;
}
function $(e) {
  return e.replace(/-([a-z])/g, (r, t) => t.toUpperCase());
}
function Jt(e, r) {
  const t = /* @__PURE__ */ Object.create(null), o = e.split(",");
  for (let s = 0; s < o.length; s++)
    t[o[s]] = true;
  return (s) => !!t[s];
}
function Ce$1(e, r) {
  if (ce(e) && ce(r)) {
    const s = e.attributes, i = r.attributes;
    return s.length !== i.length ? false : Array.from(s).every(({ name: n, value: a }) => r.getAttribute(n) === a);
  }
  if (e === r)
    return true;
  if (e === null || typeof e != "object" || r === null || typeof r != "object")
    return false;
  const t = Object.keys(e), o = Object.keys(r);
  if (t.length !== o.length)
    return false;
  for (const s of t)
    if (!o.includes(s) || !Ce$1(e[s], r[s]))
      return false;
  return true;
}
function Xt(e, r) {
  if (!Array.isArray(e) || !Array.isArray(r) || e.length !== r.length)
    return false;
  for (let t = 0; t < e.length; t++)
    if (!Ce$1(e[t], r[t]))
      return false;
  return true;
}
Number.parseInt(REVISION.replace("dev", ""));
const fe = (e) => typeof e == "function";
const Z = ref({}), oe = (e) => Object.assign(Z.value, e);
function dr() {
  const e = inject("useTres");
  if (!e)
    throw new Error("useTresContext must be used together with useTresContextProvider");
  return e;
}
let g = null;
const { logError: pe } = P(), J = [
  "onClick",
  "onPointerMove",
  "onPointerEnter",
  "onPointerLeave"
], fr = {
  createElement(e, r, t, o) {
    var n, a;
    if (o || (o = {}), o.args || (o.args = []), e === "template" || qt(e))
      return null;
    let s = e.replace("Tres", ""), i;
    if (e === "primitive") {
      (o == null ? void 0 : o.object) === void 0 && pe("Tres primitives need a prop 'object'");
      const l = o.object;
      s = l.type, i = Object.assign(l, { type: s, attach: o.attach, primitive: true });
    } else {
      const l = Z.value[s];
      l || pe(`${s} is not defined on the THREE namespace. Use extend to add it to the catalog.`), i = new l(...o.args);
    }
    return i.isCamera && (o != null && o.position || i.position.set(3, 3, 3), o != null && o.lookAt || i.lookAt(0, 0, 0)), (o == null ? void 0 : o.attach) === void 0 && (i.isMaterial ? i.attach = "material" : i.isBufferGeometry && (i.attach = "geometry")), i.isObject3D && ((n = o == null ? void 0 : o.material) != null && n.isMaterial && (i.userData.tres__materialViaProp = true), (a = o == null ? void 0 : o.geometry) != null && a.isBufferGeometry && (i.userData.tres__geometryViaProp = true)), i.userData = {
      ...i.userData,
      tres__name: s
    }, i;
  },
  insert(e, r) {
    var o, s, i, n;
    r && r.isScene && (g = r);
    const t = r || g;
    if (e != null && e.isObject3D) {
      if (e != null && e.isCamera) {
        if (!(g != null && g.userData.tres__registerCamera))
          throw new Error("could not find tres__registerCamera on scene's userData");
        (s = g == null ? void 0 : (o = g.userData).tres__registerCamera) == null || s.call(o, e);
      }
      if (e && J.some((a) => e[a])) {
        if (!(g != null && g.userData.tres__registerAtPointerEventHandler))
          throw new Error("could not find tres__registerAtPointerEventHandler on scene's userData");
        (n = g == null ? void 0 : (i = g.userData).tres__registerAtPointerEventHandler) == null || n.call(i, e);
      }
    }
    e != null && e.isObject3D && (t != null && t.isObject3D) ? (t.add(e), e.dispatchEvent({ type: "added" })) : e != null && e.isFog ? t.fog = e : typeof (e == null ? void 0 : e.attach) == "string" && (e.__previousAttach = e[t == null ? void 0 : t.attach], t && (t[e.attach] = e));
  },
  remove(e) {
    var r, t;
    if (e) {
      if (e.isObject3D) {
        const o = e, s = (c) => {
          var d, u;
          const m2 = c;
          c.userData.tres__materialViaProp || ((d = m2.material) == null || d.dispose(), m2.material = void 0), c.userData.tres__geometryViaProp || ((u = m2.geometry) == null || u.dispose(), m2.geometry = void 0);
        }, i = g == null ? void 0 : g.userData.tres__deregisterAtPointerEventHandler, n = g == null ? void 0 : g.userData.tres__deregisterBlockingObjectAtPointerEventHandler, a = (c) => {
          var m2, d;
          if (!n)
            throw new Error("could not find tres__deregisterBlockingObjectAtPointerEventHandler on scene's userData");
          if ((d = g == null ? void 0 : (m2 = g.userData).tres__deregisterBlockingObjectAtPointerEventHandler) == null || d.call(m2, c), !i)
            throw new Error("could not find tres__deregisterAtPointerEventHandler on scene's userData");
          c && J.some((u) => c[u]) && (i == null || i(c));
        }, l = (c) => {
          const m2 = g == null ? void 0 : g.userData.tres__deregisterCamera;
          if (!m2)
            throw new Error("could not find tres__deregisterCamera on scene's userData");
          c.isCamera && (m2 == null || m2(c));
        };
        (r = e.removeFromParent) == null || r.call(e), o.traverse((c) => {
          s(c), l(c), a == null || a(c);
        }), s(o), l(o), a == null || a(o);
      }
      (t = e.dispose) == null || t.call(e);
    }
  },
  patchProp(e, r, t, o) {
    var s, i, n, a;
    if (e) {
      let l = e, c = r;
      if (e.isObject3D && c === "blocks-pointer-events") {
        o || o === "" ? (i = g == null ? void 0 : (s = g.userData).tres__registerBlockingObjectAtPointerEventHandler) == null || i.call(s, e) : (a = g == null ? void 0 : (n = g.userData).tres__deregisterBlockingObjectAtPointerEventHandler) == null || a.call(n, e);
        return;
      }
      let m2 = $(c), d = l == null ? void 0 : l[m2];
      if (c === "args") {
        const f = e, h2 = t ?? [], p = o ?? [], y = e.userData.tres__name || e.type;
        y && h2.length && !Xt(h2, p) && (l = Object.assign(f, new Z.value[y](...o)));
        return;
      }
      if (l.type === "BufferGeometry") {
        if (c === "args")
          return;
        l.setAttribute(
          $(c),
          new BufferAttribute(...o)
        );
        return;
      }
      if (c.includes("-") && d === void 0) {
        const f = c.split("-");
        d = f.reduce((h2, p) => h2[$(p)], l), c = f.pop(), m2 = c.toLowerCase(), d != null && d.set || (l = f.reduce((h2, p) => h2[$(p)], l));
      }
      let u = o;
      if (u === "" && (u = true), fe(d)) {
        J.includes(r) || (Array.isArray(u) ? e[m2](...u) : e[m2](u));
        return;
      }
      !(d != null && d.set) && !fe(d) ? l[m2] = u : d.constructor === u.constructor && (d != null && d.copy) ? d == null || d.copy(u) : Array.isArray(u) ? d.set(...u) : !d.isColor && d.setScalar ? d.setScalar(u) : d.set(u);
    }
  },
  parentNode(e) {
    return (e == null ? void 0 : e.parent) || null;
  },
  createText: () => void 0,
  createComment: () => void 0,
  setText: () => void 0,
  setElementText: () => void 0,
  nextSibling: () => void 0,
  querySelector: () => void 0,
  setScopeId: () => void 0,
  cloneNode: () => void 0,
  insertStaticContent: () => void 0
}, { render: pr$1 } = createRenderer(fr);
oe(THREE);
reactive({
  sceneGraph: null
});
const Pa = parseInt(REVISION.replace(/\D+/g, ""));
var xc = Object.defineProperty, wc = (o, e, t) => e in o ? xc(o, e, { enumerable: true, configurable: true, writable: true, value: t }) : o[e] = t, Tc = (o, e, t) => (wc(o, e + "", t), t);
async function Vr(o) {
  const e = await o.arrayBuffer(), t = btoa(String.fromCharCode(...new Uint8Array(e)));
  return `data:${o.type || ""};base64,${t}`;
}
let zs, Ti, Nn, Hs;
function bi(o, e = 1 / 0, t = null) {
  Ti || (Ti = new PlaneGeometry(2, 2, 1, 1)), Nn || (Nn = new ShaderMaterial({
    uniforms: { blitTexture: new Uniform(o) },
    vertexShader: (
      /* glsl */
      `
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = vec4(position.xy * 1.0,0.,.999999);
        }
      `
    ),
    fragmentShader: (
      /* glsl */
      `
          uniform sampler2D blitTexture; 
          varying vec2 vUv;

          void main(){ 
              gl_FragColor = vec4(vUv.xy, 0, 1);
              
              #ifdef IS_SRGB
              gl_FragColor = LinearTosRGB( texture2D( blitTexture, vUv) );
              #else
              gl_FragColor = texture2D( blitTexture, vUv);
              #endif
          }
      `
    )
  })), Nn.uniforms.blitTexture.value = o, Nn.defines.IS_SRGB = "colorSpace" in o ? o.colorSpace === "srgb" : o.encoding === 3001, Nn.needsUpdate = true, Hs || (Hs = new Mesh(Ti, Nn), Hs.frustrumCulled = false);
  const n = new PerspectiveCamera(), s = new Scene();
  s.add(Hs), t || (t = zs = new WebGLRenderer({ antialias: false })), t.setSize(Math.min(o.image.width, e), Math.min(o.image.height, e)), t.clear(), t.render(s, n);
  const i = new Texture(t.domElement);
  return i.minFilter = o.minFilter, i.magFilter = o.magFilter, i.wrapS = o.wrapS, i.wrapT = o.wrapT, i.name = o.name, zs && (zs.dispose(), zs = null), i;
}
const Yr = {
  POSITION: [
    "byte",
    "byte normalized",
    "unsigned byte",
    "unsigned byte normalized",
    "short",
    "short normalized",
    "unsigned short",
    "unsigned short normalized"
  ],
  NORMAL: ["byte normalized", "short normalized"],
  TANGENT: ["byte normalized", "short normalized"],
  TEXCOORD: ["byte", "byte normalized", "unsigned byte", "short", "short normalized", "unsigned short"]
};
class Mr {
  constructor() {
    this.pluginCallbacks = [], this.register(function(e) {
      return new Dc(e);
    }), this.register(function(e) {
      return new Oc(e);
    }), this.register(function(e) {
      return new kc(e);
    }), this.register(function(e) {
      return new Bc(e);
    }), this.register(function(e) {
      return new Uc(e);
    }), this.register(function(e) {
      return new Nc(e);
    }), this.register(function(e) {
      return new Lc(e);
    }), this.register(function(e) {
      return new Fc(e);
    }), this.register(function(e) {
      return new zc(e);
    }), this.register(function(e) {
      return new Hc(e);
    }), this.register(function(e) {
      return new jc(e);
    });
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  /**
   * Parse scenes and generate GLTF output
   * @param  {Scene or [THREE.Scenes]} input   Scene or Array of THREE.Scenes
   * @param  {Function} onDone  Callback on completed
   * @param  {Function} onError  Callback on errors
   * @param  {Object} options options
   */
  parse(e, t, n, s) {
    const i = new Rc(), r = [];
    for (let a = 0, l = this.pluginCallbacks.length; a < l; a++)
      r.push(this.pluginCallbacks[a](i));
    i.setPlugins(r), i.write(e, t, s).catch(n);
  }
  parseAsync(e, t) {
    const n = this;
    return new Promise(function(s, i) {
      n.parse(e, s, i, t);
    });
  }
}
Tc(Mr, "Utils", {
  insertKeyframe: function(o, e) {
    const n = o.getValueSize(), s = new o.TimeBufferType(o.times.length + 1), i = new o.ValueBufferType(o.values.length + n), r = o.createInterpolant(new o.ValueBufferType(n));
    let a;
    if (o.times.length === 0) {
      s[0] = e;
      for (let l = 0; l < n; l++)
        i[l] = 0;
      a = 0;
    } else if (e < o.times[0]) {
      if (Math.abs(o.times[0] - e) < 1e-3)
        return 0;
      s[0] = e, s.set(o.times, 1), i.set(r.evaluate(e), 0), i.set(o.values, n), a = 0;
    } else if (e > o.times[o.times.length - 1]) {
      if (Math.abs(o.times[o.times.length - 1] - e) < 1e-3)
        return o.times.length - 1;
      s[s.length - 1] = e, s.set(o.times, 0), i.set(o.values, 0), i.set(r.evaluate(e), o.values.length), a = s.length - 1;
    } else
      for (let l = 0; l < o.times.length; l++) {
        if (Math.abs(o.times[l] - e) < 1e-3)
          return l;
        if (o.times[l] < e && o.times[l + 1] > e) {
          s.set(o.times.slice(0, l + 1), 0), s[l + 1] = e, s.set(o.times.slice(l + 1), l + 2), i.set(o.values.slice(0, (l + 1) * n), 0), i.set(r.evaluate(e), (l + 1) * n), i.set(o.values.slice((l + 1) * n), (l + 2) * n), a = l + 1;
          break;
        }
      }
    return o.times = s, o.values = i, a;
  },
  mergeMorphTargetTracks: function(o, e) {
    const t = [], n = {}, s = o.tracks;
    for (let i = 0; i < s.length; ++i) {
      let r = s[i];
      const a = PropertyBinding.parseTrackName(r.name), l = PropertyBinding.findNode(e, a.nodeName);
      if (a.propertyName !== "morphTargetInfluences" || a.propertyIndex === void 0) {
        t.push(r);
        continue;
      }
      if (r.createInterpolant !== r.InterpolantFactoryMethodDiscrete && r.createInterpolant !== r.InterpolantFactoryMethodLinear) {
        if (r.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)
          throw new Error("THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.");
        console.warn("THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead."), r = r.clone(), r.setInterpolation(InterpolateLinear);
      }
      const c = l.morphTargetInfluences.length, u = l.morphTargetDictionary[a.propertyIndex];
      if (u === void 0)
        throw new Error("THREE.GLTFExporter: Morph target name not found: " + a.propertyIndex);
      let h2;
      if (n[l.uuid] === void 0) {
        h2 = r.clone();
        const p = new h2.ValueBufferType(c * h2.times.length);
        for (let y = 0; y < h2.times.length; y++)
          p[y * c + u] = h2.values[y];
        h2.name = (a.nodeName || "") + ".morphTargetInfluences", h2.values = p, n[l.uuid] = h2, t.push(h2);
        continue;
      }
      const f = r.createInterpolant(new r.ValueBufferType(1));
      h2 = n[l.uuid];
      for (let p = 0; p < h2.times.length; p++)
        h2.values[p * c + u] = f.evaluate(h2.times[p]);
      for (let p = 0; p < r.times.length; p++) {
        const y = this.insertKeyframe(h2, r.times[p]);
        h2.values[y * c + u] = r.values[p];
      }
    }
    return o.tracks = t, o;
  }
});
const Ce = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  INT: 5124,
  UNSIGNED_INT: 5125,
  FLOAT: 5126,
  ARRAY_BUFFER: 34962,
  ELEMENT_ARRAY_BUFFER: 34963,
  NEAREST: 9728,
  LINEAR: 9729,
  NEAREST_MIPMAP_NEAREST: 9984,
  LINEAR_MIPMAP_NEAREST: 9985,
  NEAREST_MIPMAP_LINEAR: 9986,
  LINEAR_MIPMAP_LINEAR: 9987,
  CLAMP_TO_EDGE: 33071,
  MIRRORED_REPEAT: 33648,
  REPEAT: 10497
}, Ei = "KHR_mesh_quantization", yt = {};
yt[NearestFilter] = Ce.NEAREST;
yt[NearestMipmapNearestFilter] = Ce.NEAREST_MIPMAP_NEAREST;
yt[NearestMipmapLinearFilter] = Ce.NEAREST_MIPMAP_LINEAR;
yt[LinearFilter] = Ce.LINEAR;
yt[LinearMipmapNearestFilter] = Ce.LINEAR_MIPMAP_NEAREST;
yt[LinearMipmapLinearFilter] = Ce.LINEAR_MIPMAP_LINEAR;
yt[ClampToEdgeWrapping] = Ce.CLAMP_TO_EDGE;
yt[RepeatWrapping] = Ce.REPEAT;
yt[MirroredRepeatWrapping] = Ce.MIRRORED_REPEAT;
const Wr = {
  scale: "scale",
  position: "translation",
  quaternion: "rotation",
  morphTargetInfluences: "weights"
}, bc = new Color(), Xr = 12, Ec = 1179937895, Sc = 2, $r = 8, Mc = 1313821514, Ac = 5130562;
function ys(o, e) {
  return o.length === e.length && o.every(function(t, n) {
    return t === e[n];
  });
}
function Pc(o) {
  return new TextEncoder().encode(o).buffer;
}
function Cc(o) {
  return ys(o.elements, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
function Ic(o, e, t) {
  const n = {
    min: new Array(o.itemSize).fill(Number.POSITIVE_INFINITY),
    max: new Array(o.itemSize).fill(Number.NEGATIVE_INFINITY)
  };
  for (let s = e; s < e + t; s++)
    for (let i = 0; i < o.itemSize; i++) {
      let r;
      o.itemSize > 4 ? r = o.array[s * o.itemSize + i] : (i === 0 ? r = o.getX(s) : i === 1 ? r = o.getY(s) : i === 2 ? r = o.getZ(s) : i === 3 && (r = o.getW(s)), o.normalized === true && (r = MathUtils.normalize(r, o.array))), n.min[i] = Math.min(n.min[i], r), n.max[i] = Math.max(n.max[i], r);
    }
  return n;
}
function Ca(o) {
  return Math.ceil(o / 4) * 4;
}
function Si(o, e = 0) {
  const t = Ca(o.byteLength);
  if (t !== o.byteLength) {
    const n = new Uint8Array(t);
    if (n.set(new Uint8Array(o)), e !== 0)
      for (let s = o.byteLength; s < t; s++)
        n[s] = e;
    return n.buffer;
  }
  return o;
}
function Zr() {
  return typeof OffscreenCanvas < "u" ? new OffscreenCanvas(1, 1) : (void 0).createElement("canvas");
}
function qr(o, e) {
  if (o.toBlob !== void 0)
    return new Promise((n) => o.toBlob(n, e));
  let t;
  return e === "image/jpeg" ? t = 0.92 : e === "image/webp" && (t = 0.8), o.convertToBlob({
    type: e,
    quality: t
  });
}
class Rc {
  constructor() {
    this.plugins = [], this.options = {}, this.pending = [], this.buffers = [], this.byteOffset = 0, this.buffers = [], this.nodeMap = /* @__PURE__ */ new Map(), this.skins = [], this.extensionsUsed = {}, this.extensionsRequired = {}, this.uids = /* @__PURE__ */ new Map(), this.uid = 0, this.json = {
      asset: {
        version: "2.0",
        generator: "THREE.GLTFExporter"
      }
    }, this.cache = {
      meshes: /* @__PURE__ */ new Map(),
      attributes: /* @__PURE__ */ new Map(),
      attributesNormalized: /* @__PURE__ */ new Map(),
      materials: /* @__PURE__ */ new Map(),
      textures: /* @__PURE__ */ new Map(),
      images: /* @__PURE__ */ new Map()
    };
  }
  setPlugins(e) {
    this.plugins = e;
  }
  /**
   * Parse scenes and generate GLTF output
   * @param  {Scene or [THREE.Scenes]} input   Scene or Array of THREE.Scenes
   * @param  {Function} onDone  Callback on completed
   * @param  {Object} options options
   */
  async write(e, t, n = {}) {
    this.options = Object.assign(
      {
        // default options
        binary: false,
        trs: false,
        onlyVisible: true,
        maxTextureSize: 1 / 0,
        animations: [],
        includeCustomExtensions: false
      },
      n
    ), this.options.animations.length > 0 && (this.options.trs = true), this.processInput(e), await Promise.all(this.pending);
    const s = this, i = s.buffers, r = s.json;
    n = s.options;
    const a = s.extensionsUsed, l = s.extensionsRequired, c = new Blob(i, { type: "application/octet-stream" }), u = Object.keys(a), h2 = Object.keys(l);
    u.length > 0 && (r.extensionsUsed = u), h2.length > 0 && (r.extensionsRequired = h2), r.buffers && r.buffers.length > 0 && (r.buffers[0].byteLength = c.size), n.binary === true ? c.arrayBuffer().then((f) => {
      const p = Si(f), y = new DataView(new ArrayBuffer($r));
      y.setUint32(0, p.byteLength, true), y.setUint32(4, Ac, true);
      const g2 = Si(Pc(JSON.stringify(r)), 32), v2 = new DataView(new ArrayBuffer($r));
      v2.setUint32(0, g2.byteLength, true), v2.setUint32(4, Mc, true);
      const d = new ArrayBuffer(Xr), w = new DataView(d);
      w.setUint32(0, Ec, true), w.setUint32(4, Sc, true);
      const x2 = Xr + v2.byteLength + g2.byteLength + y.byteLength + p.byteLength;
      w.setUint32(8, x2, true), new Blob([d, v2, g2, y, p], {
        type: "application/octet-stream"
      }).arrayBuffer().then(t);
    }) : r.buffers && r.buffers.length > 0 ? Vr(c).then((f) => {
      r.buffers[0].uri = f, t(r);
    }) : t(r);
  }
  /**
   * Serializes a userData.
   *
   * @param {THREE.Object3D|THREE.Material} object
   * @param {Object} objectDef
   */
  serializeUserData(e, t) {
    if (Object.keys(e.userData).length === 0)
      return;
    const n = this.options, s = this.extensionsUsed;
    try {
      const i = JSON.parse(JSON.stringify(e.userData));
      if (n.includeCustomExtensions && i.gltfExtensions) {
        t.extensions === void 0 && (t.extensions = {});
        for (const r in i.gltfExtensions)
          t.extensions[r] = i.gltfExtensions[r], s[r] = true;
        delete i.gltfExtensions;
      }
      Object.keys(i).length > 0 && (t.extras = i);
    } catch (i) {
      console.warn(
        "THREE.GLTFExporter: userData of '" + e.name + "' won't be serialized because of JSON.stringify error - " + i.message
      );
    }
  }
  /**
   * Returns ids for buffer attributes.
   * @param  {Object} object
   * @return {Integer}
   */
  getUID(e, t = false) {
    if (this.uids.has(e) === false) {
      const s = /* @__PURE__ */ new Map();
      s.set(true, this.uid++), s.set(false, this.uid++), this.uids.set(e, s);
    }
    return this.uids.get(e).get(t);
  }
  /**
   * Checks if normal attribute values are normalized.
   *
   * @param {BufferAttribute} normal
   * @returns {Boolean}
   */
  isNormalizedNormalAttribute(e) {
    if (this.cache.attributesNormalized.has(e))
      return false;
    const n = new Vector3();
    for (let s = 0, i = e.count; s < i; s++)
      if (Math.abs(n.fromBufferAttribute(e, s).length() - 1) > 5e-4)
        return false;
    return true;
  }
  /**
   * Creates normalized normal buffer attribute.
   *
   * @param {BufferAttribute} normal
   * @returns {BufferAttribute}
   *
   */
  createNormalizedNormalAttribute(e) {
    const t = this.cache;
    if (t.attributesNormalized.has(e))
      return t.attributesNormalized.get(e);
    const n = e.clone(), s = new Vector3();
    for (let i = 0, r = n.count; i < r; i++)
      s.fromBufferAttribute(n, i), s.x === 0 && s.y === 0 && s.z === 0 ? s.setX(1) : s.normalize(), n.setXYZ(i, s.x, s.y, s.z);
    return t.attributesNormalized.set(e, n), n;
  }
  /**
   * Applies a texture transform, if present, to the map definition. Requires
   * the KHR_texture_transform extension.
   *
   * @param {Object} mapDef
   * @param {THREE.Texture} texture
   */
  applyTextureTransform(e, t) {
    let n = false;
    const s = {};
    (t.offset.x !== 0 || t.offset.y !== 0) && (s.offset = t.offset.toArray(), n = true), t.rotation !== 0 && (s.rotation = t.rotation, n = true), (t.repeat.x !== 1 || t.repeat.y !== 1) && (s.scale = t.repeat.toArray(), n = true), n && (e.extensions = e.extensions || {}, e.extensions.KHR_texture_transform = s, this.extensionsUsed.KHR_texture_transform = true);
  }
  buildMetalRoughTexture(e, t) {
    if (e === t)
      return e;
    function n(p) {
      return ("colorSpace" in p ? p.colorSpace === "srgb" : p.encoding === 3001) ? function(g2) {
        return g2 < 0.04045 ? g2 * 0.0773993808 : Math.pow(g2 * 0.9478672986 + 0.0521327014, 2.4);
      } : function(g2) {
        return g2;
      };
    }
    console.warn("THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures."), e instanceof CompressedTexture && (e = bi(e)), t instanceof CompressedTexture && (t = bi(t));
    const s = e ? e.image : null, i = t ? t.image : null, r = Math.max(s ? s.width : 0, i ? i.width : 0), a = Math.max(s ? s.height : 0, i ? i.height : 0), l = Zr();
    l.width = r, l.height = a;
    const c = l.getContext("2d");
    c.fillStyle = "#00ffff", c.fillRect(0, 0, r, a);
    const u = c.getImageData(0, 0, r, a);
    if (s) {
      c.drawImage(s, 0, 0, r, a);
      const p = n(e), y = c.getImageData(0, 0, r, a).data;
      for (let g2 = 2; g2 < y.length; g2 += 4)
        u.data[g2] = p(y[g2] / 256) * 256;
    }
    if (i) {
      c.drawImage(i, 0, 0, r, a);
      const p = n(t), y = c.getImageData(0, 0, r, a).data;
      for (let g2 = 1; g2 < y.length; g2 += 4)
        u.data[g2] = p(y[g2] / 256) * 256;
    }
    c.putImageData(u, 0, 0);
    const f = (e || t).clone();
    return f.source = new Texture(l).source, "colorSpace" in f ? f.colorSpace = "" : f.encoding = 3e3, f.channel = (e || t).channel, e && t && e.channel !== t.channel && console.warn("THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match."), f;
  }
  /**
   * Process a buffer to append to the default one.
   * @param  {ArrayBuffer} buffer
   * @return {Integer}
   */
  processBuffer(e) {
    const t = this.json, n = this.buffers;
    return t.buffers || (t.buffers = [{ byteLength: 0 }]), n.push(e), 0;
  }
  /**
   * Process and generate a BufferView
   * @param  {BufferAttribute} attribute
   * @param  {number} componentType
   * @param  {number} start
   * @param  {number} count
   * @param  {number} target (Optional) Target usage of the BufferView
   * @return {Object}
   */
  processBufferView(e, t, n, s, i) {
    const r = this.json;
    r.bufferViews || (r.bufferViews = []);
    let a;
    switch (t) {
      case Ce.BYTE:
      case Ce.UNSIGNED_BYTE:
        a = 1;
        break;
      case Ce.SHORT:
      case Ce.UNSIGNED_SHORT:
        a = 2;
        break;
      default:
        a = 4;
    }
    const l = Ca(s * e.itemSize * a), c = new DataView(new ArrayBuffer(l));
    let u = 0;
    for (let p = n; p < n + s; p++)
      for (let y = 0; y < e.itemSize; y++) {
        let g2;
        e.itemSize > 4 ? g2 = e.array[p * e.itemSize + y] : (y === 0 ? g2 = e.getX(p) : y === 1 ? g2 = e.getY(p) : y === 2 ? g2 = e.getZ(p) : y === 3 && (g2 = e.getW(p)), e.normalized === true && (g2 = MathUtils.normalize(g2, e.array))), t === Ce.FLOAT ? c.setFloat32(u, g2, true) : t === Ce.INT ? c.setInt32(u, g2, true) : t === Ce.UNSIGNED_INT ? c.setUint32(u, g2, true) : t === Ce.SHORT ? c.setInt16(u, g2, true) : t === Ce.UNSIGNED_SHORT ? c.setUint16(u, g2, true) : t === Ce.BYTE ? c.setInt8(u, g2) : t === Ce.UNSIGNED_BYTE && c.setUint8(u, g2), u += a;
      }
    const h2 = {
      buffer: this.processBuffer(c.buffer),
      byteOffset: this.byteOffset,
      byteLength: l
    };
    return i !== void 0 && (h2.target = i), i === Ce.ARRAY_BUFFER && (h2.byteStride = e.itemSize * a), this.byteOffset += l, r.bufferViews.push(h2), {
      id: r.bufferViews.length - 1,
      byteLength: 0
    };
  }
  /**
   * Process and generate a BufferView from an image Blob.
   * @param {Blob} blob
   * @return {Promise<Integer>}
   */
  processBufferViewImage(e) {
    const t = this, n = t.json;
    return n.bufferViews || (n.bufferViews = []), e.arrayBuffer().then((s) => {
      const i = Si(s), r = {
        buffer: t.processBuffer(i),
        byteOffset: t.byteOffset,
        byteLength: i.byteLength
      };
      return t.byteOffset += i.byteLength, n.bufferViews.push(r) - 1;
    });
  }
  /**
   * Process attribute to generate an accessor
   * @param  {BufferAttribute} attribute Attribute to process
   * @param  {THREE.BufferGeometry} geometry (Optional) Geometry used for truncated draw range
   * @param  {Integer} start (Optional)
   * @param  {Integer} count (Optional)
   * @return {Integer|null} Index of the processed accessor on the "accessors" array
   */
  processAccessor(e, t, n, s) {
    const i = this.json, r = {
      1: "SCALAR",
      2: "VEC2",
      3: "VEC3",
      4: "VEC4",
      9: "MAT3",
      16: "MAT4"
    };
    let a;
    if (e.array.constructor === Float32Array)
      a = Ce.FLOAT;
    else if (e.array.constructor === Int32Array)
      a = Ce.INT;
    else if (e.array.constructor === Uint32Array)
      a = Ce.UNSIGNED_INT;
    else if (e.array.constructor === Int16Array)
      a = Ce.SHORT;
    else if (e.array.constructor === Uint16Array)
      a = Ce.UNSIGNED_SHORT;
    else if (e.array.constructor === Int8Array)
      a = Ce.BYTE;
    else if (e.array.constructor === Uint8Array)
      a = Ce.UNSIGNED_BYTE;
    else
      throw new Error(
        "THREE.GLTFExporter: Unsupported bufferAttribute component type: " + e.array.constructor.name
      );
    if (n === void 0 && (n = 0), s === void 0 && (s = e.count), s === 0)
      return null;
    const l = Ic(e, n, s);
    let c;
    t !== void 0 && (c = e === t.index ? Ce.ELEMENT_ARRAY_BUFFER : Ce.ARRAY_BUFFER);
    const u = this.processBufferView(e, a, n, s, c), h2 = {
      bufferView: u.id,
      byteOffset: u.byteOffset,
      componentType: a,
      count: s,
      max: l.max,
      min: l.min,
      type: r[e.itemSize]
    };
    return e.normalized === true && (h2.normalized = true), i.accessors || (i.accessors = []), i.accessors.push(h2) - 1;
  }
  /**
   * Process image
   * @param  {Image} image to process
   * @param  {Integer} format of the image (RGBAFormat)
   * @param  {Boolean} flipY before writing out the image
   * @param  {String} mimeType export format
   * @return {Integer}     Index of the processed texture in the "images" array
   */
  processImage(e, t, n, s = "image/png") {
    if (e !== null) {
      const i = this, r = i.cache, a = i.json, l = i.options, c = i.pending;
      r.images.has(e) || r.images.set(e, {});
      const u = r.images.get(e), h2 = s + ":flipY/" + n.toString();
      if (u[h2] !== void 0)
        return u[h2];
      a.images || (a.images = []);
      const f = { mimeType: s }, p = Zr();
      p.width = Math.min(e.width, l.maxTextureSize), p.height = Math.min(e.height, l.maxTextureSize);
      const y = p.getContext("2d");
      if (n === true && (y.translate(0, p.height), y.scale(1, -1)), e.data !== void 0) {
        t !== RGBAFormat && console.error("GLTFExporter: Only RGBAFormat is supported.", t), (e.width > l.maxTextureSize || e.height > l.maxTextureSize) && console.warn("GLTFExporter: Image size is bigger than maxTextureSize", e);
        const v2 = new Uint8ClampedArray(e.height * e.width * 4);
        for (let d = 0; d < v2.length; d += 4)
          v2[d + 0] = e.data[d + 0], v2[d + 1] = e.data[d + 1], v2[d + 2] = e.data[d + 2], v2[d + 3] = e.data[d + 3];
        y.putImageData(new ImageData(v2, e.width, e.height), 0, 0);
      } else
        y.drawImage(e, 0, 0, p.width, p.height);
      l.binary === true ? c.push(
        qr(p, s).then((v2) => i.processBufferViewImage(v2)).then((v2) => {
          f.bufferView = v2;
        })
      ) : p.toDataURL !== void 0 ? f.uri = p.toDataURL(s) : c.push(
        qr(p, s).then(Vr).then((v2) => {
          f.uri = v2;
        })
      );
      const g2 = a.images.push(f) - 1;
      return u[h2] = g2, g2;
    } else
      throw new Error("THREE.GLTFExporter: No valid image data found. Unable to process texture.");
  }
  /**
   * Process sampler
   * @param  {Texture} map Texture to process
   * @return {Integer}     Index of the processed texture in the "samplers" array
   */
  processSampler(e) {
    const t = this.json;
    t.samplers || (t.samplers = []);
    const n = {
      magFilter: yt[e.magFilter],
      minFilter: yt[e.minFilter],
      wrapS: yt[e.wrapS],
      wrapT: yt[e.wrapT]
    };
    return t.samplers.push(n) - 1;
  }
  /**
   * Process texture
   * @param  {Texture} map Map to process
   * @return {Integer} Index of the processed texture in the "textures" array
   */
  processTexture(e) {
    const n = this.options, s = this.cache, i = this.json;
    if (s.textures.has(e))
      return s.textures.get(e);
    i.textures || (i.textures = []), e instanceof CompressedTexture && (e = bi(e, n.maxTextureSize));
    let r = e.userData.mimeType;
    r === "image/webp" && (r = "image/png");
    const a = {
      sampler: this.processSampler(e),
      source: this.processImage(e.image, e.format, e.flipY, r)
    };
    e.name && (a.name = e.name), this._invokeAll(function(c) {
      c.writeTexture && c.writeTexture(e, a);
    });
    const l = i.textures.push(a) - 1;
    return s.textures.set(e, l), l;
  }
  /**
   * Process material
   * @param  {THREE.Material} material Material to process
   * @return {Integer|null} Index of the processed material in the "materials" array
   */
  processMaterial(e) {
    const t = this.cache, n = this.json;
    if (t.materials.has(e))
      return t.materials.get(e);
    if (e.isShaderMaterial)
      return console.warn("GLTFExporter: THREE.ShaderMaterial not supported."), null;
    n.materials || (n.materials = []);
    const s = { pbrMetallicRoughness: {} };
    e.isMeshStandardMaterial !== true && e.isMeshBasicMaterial !== true && console.warn("GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.");
    const i = e.color.toArray().concat([e.opacity]);
    if (ys(i, [1, 1, 1, 1]) || (s.pbrMetallicRoughness.baseColorFactor = i), e.isMeshStandardMaterial ? (s.pbrMetallicRoughness.metallicFactor = e.metalness, s.pbrMetallicRoughness.roughnessFactor = e.roughness) : (s.pbrMetallicRoughness.metallicFactor = 0.5, s.pbrMetallicRoughness.roughnessFactor = 0.5), e.metalnessMap || e.roughnessMap) {
      const a = this.buildMetalRoughTexture(e.metalnessMap, e.roughnessMap), l = {
        index: this.processTexture(a),
        channel: a.channel
      };
      this.applyTextureTransform(l, a), s.pbrMetallicRoughness.metallicRoughnessTexture = l;
    }
    if (e.map) {
      const a = {
        index: this.processTexture(e.map),
        texCoord: e.map.channel
      };
      this.applyTextureTransform(a, e.map), s.pbrMetallicRoughness.baseColorTexture = a;
    }
    if (e.emissive) {
      const a = e.emissive;
      if (Math.max(a.r, a.g, a.b) > 0 && (s.emissiveFactor = e.emissive.toArray()), e.emissiveMap) {
        const c = {
          index: this.processTexture(e.emissiveMap),
          texCoord: e.emissiveMap.channel
        };
        this.applyTextureTransform(c, e.emissiveMap), s.emissiveTexture = c;
      }
    }
    if (e.normalMap) {
      const a = {
        index: this.processTexture(e.normalMap),
        texCoord: e.normalMap.channel
      };
      e.normalScale && e.normalScale.x !== 1 && (a.scale = e.normalScale.x), this.applyTextureTransform(a, e.normalMap), s.normalTexture = a;
    }
    if (e.aoMap) {
      const a = {
        index: this.processTexture(e.aoMap),
        texCoord: e.aoMap.channel
      };
      e.aoMapIntensity !== 1 && (a.strength = e.aoMapIntensity), this.applyTextureTransform(a, e.aoMap), s.occlusionTexture = a;
    }
    e.transparent ? s.alphaMode = "BLEND" : e.alphaTest > 0 && (s.alphaMode = "MASK", s.alphaCutoff = e.alphaTest), e.side === DoubleSide && (s.doubleSided = true), e.name !== "" && (s.name = e.name), this.serializeUserData(e, s), this._invokeAll(function(a) {
      a.writeMaterial && a.writeMaterial(e, s);
    });
    const r = n.materials.push(s) - 1;
    return t.materials.set(e, r), r;
  }
  /**
   * Process mesh
   * @param  {THREE.Mesh} mesh Mesh to process
   * @return {Integer|null} Index of the processed mesh in the "meshes" array
   */
  processMesh(e) {
    const t = this.cache, n = this.json, s = [e.geometry.uuid];
    if (Array.isArray(e.material))
      for (let x2 = 0, T = e.material.length; x2 < T; x2++)
        s.push(e.material[x2].uuid);
    else
      s.push(e.material.uuid);
    const i = s.join(":");
    if (t.meshes.has(i))
      return t.meshes.get(i);
    const r = e.geometry;
    let a;
    e.isLineSegments ? a = Ce.LINES : e.isLineLoop ? a = Ce.LINE_LOOP : e.isLine ? a = Ce.LINE_STRIP : e.isPoints ? a = Ce.POINTS : a = e.material.wireframe ? Ce.LINES : Ce.TRIANGLES;
    const l = {}, c = {}, u = [], h2 = [], f = {
      ...Pa >= 152 ? {
        uv: "TEXCOORD_0",
        uv1: "TEXCOORD_1",
        uv2: "TEXCOORD_2",
        uv3: "TEXCOORD_3"
      } : {
        uv: "TEXCOORD_0",
        uv2: "TEXCOORD_1"
      },
      color: "COLOR_0",
      skinWeight: "WEIGHTS_0",
      skinIndex: "JOINTS_0"
    }, p = r.getAttribute("normal");
    p !== void 0 && !this.isNormalizedNormalAttribute(p) && (console.warn("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one."), r.setAttribute("normal", this.createNormalizedNormalAttribute(p)));
    let y = null;
    for (let x2 in r.attributes) {
      if (x2.slice(0, 5) === "morph")
        continue;
      const T = r.attributes[x2];
      if (x2 = f[x2] || x2.toUpperCase(), /^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(x2) || (x2 = "_" + x2), t.attributes.has(this.getUID(T))) {
        c[x2] = t.attributes.get(this.getUID(T));
        continue;
      }
      y = null;
      const S = T.array;
      x2 === "JOINTS_0" && !(S instanceof Uint16Array) && !(S instanceof Uint8Array) && (console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'), y = new BufferAttribute(new Uint16Array(S), T.itemSize, T.normalized));
      const M2 = this.processAccessor(y || T, r);
      M2 !== null && (x2.startsWith("_") || this.detectMeshQuantization(x2, T), c[x2] = M2, t.attributes.set(this.getUID(T), M2));
    }
    if (p !== void 0 && r.setAttribute("normal", p), Object.keys(c).length === 0)
      return null;
    if (e.morphTargetInfluences !== void 0 && e.morphTargetInfluences.length > 0) {
      const x2 = [], T = [], P2 = {};
      if (e.morphTargetDictionary !== void 0)
        for (const S in e.morphTargetDictionary)
          P2[e.morphTargetDictionary[S]] = S;
      for (let S = 0; S < e.morphTargetInfluences.length; ++S) {
        const M2 = {};
        let m2 = false;
        for (const b in r.morphAttributes) {
          if (b !== "position" && b !== "normal") {
            m2 || (console.warn("GLTFExporter: Only POSITION and NORMAL morph are supported."), m2 = true);
            continue;
          }
          const _2 = r.morphAttributes[b][S], I2 = b.toUpperCase(), R = r.attributes[b];
          if (t.attributes.has(this.getUID(_2, true))) {
            M2[I2] = t.attributes.get(this.getUID(_2, true));
            continue;
          }
          const z = _2.clone();
          if (!r.morphTargetsRelative)
            for (let k = 0, G2 = _2.count; k < G2; k++)
              for (let U = 0; U < _2.itemSize; U++)
                U === 0 && z.setX(k, _2.getX(k) - R.getX(k)), U === 1 && z.setY(k, _2.getY(k) - R.getY(k)), U === 2 && z.setZ(k, _2.getZ(k) - R.getZ(k)), U === 3 && z.setW(k, _2.getW(k) - R.getW(k));
          M2[I2] = this.processAccessor(z, r), t.attributes.set(this.getUID(R, true), M2[I2]);
        }
        h2.push(M2), x2.push(e.morphTargetInfluences[S]), e.morphTargetDictionary !== void 0 && T.push(P2[S]);
      }
      l.weights = x2, T.length > 0 && (l.extras = {}, l.extras.targetNames = T);
    }
    const g2 = Array.isArray(e.material);
    if (g2 && r.groups.length === 0)
      return null;
    const v2 = g2 ? e.material : [e.material], d = g2 ? r.groups : [{ materialIndex: 0, start: void 0, count: void 0 }];
    for (let x2 = 0, T = d.length; x2 < T; x2++) {
      const P2 = {
        mode: a,
        attributes: c
      };
      if (this.serializeUserData(r, P2), h2.length > 0 && (P2.targets = h2), r.index !== null) {
        let M2 = this.getUID(r.index);
        (d[x2].start !== void 0 || d[x2].count !== void 0) && (M2 += ":" + d[x2].start + ":" + d[x2].count), t.attributes.has(M2) ? P2.indices = t.attributes.get(M2) : (P2.indices = this.processAccessor(r.index, r, d[x2].start, d[x2].count), t.attributes.set(M2, P2.indices)), P2.indices === null && delete P2.indices;
      }
      const S = this.processMaterial(v2[d[x2].materialIndex]);
      S !== null && (P2.material = S), u.push(P2);
    }
    l.primitives = u, n.meshes || (n.meshes = []), this._invokeAll(function(x2) {
      x2.writeMesh && x2.writeMesh(e, l);
    });
    const w = n.meshes.push(l) - 1;
    return t.meshes.set(i, w), w;
  }
  /**
   * If a vertex attribute with a
   * [non-standard data type](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#meshes-overview)
   * is used, it is checked whether it is a valid data type according to the
   * [KHR_mesh_quantization](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md)
   * extension.
   * In this case the extension is automatically added to the list of used extensions.
   *
   * @param {string} attributeName
   * @param {THREE.BufferAttribute} attribute
   */
  detectMeshQuantization(e, t) {
    if (this.extensionsUsed[Ei])
      return;
    let n;
    switch (t.array.constructor) {
      case Int8Array:
        n = "byte";
        break;
      case Uint8Array:
        n = "unsigned byte";
        break;
      case Int16Array:
        n = "short";
        break;
      case Uint16Array:
        n = "unsigned short";
        break;
      default:
        return;
    }
    t.normalized && (n += " normalized");
    const s = e.split("_", 1)[0];
    Yr[s] && Yr[s].includes(n) && (this.extensionsUsed[Ei] = true, this.extensionsRequired[Ei] = true);
  }
  /**
   * Process camera
   * @param  {THREE.Camera} camera Camera to process
   * @return {Integer}      Index of the processed mesh in the "camera" array
   */
  processCamera(e) {
    const t = this.json;
    t.cameras || (t.cameras = []);
    const n = e.isOrthographicCamera, s = {
      type: n ? "orthographic" : "perspective"
    };
    return n ? s.orthographic = {
      xmag: e.right * 2,
      ymag: e.top * 2,
      zfar: e.far <= 0 ? 1e-3 : e.far,
      znear: e.near < 0 ? 0 : e.near
    } : s.perspective = {
      aspectRatio: e.aspect,
      yfov: MathUtils.degToRad(e.fov),
      zfar: e.far <= 0 ? 1e-3 : e.far,
      znear: e.near < 0 ? 0 : e.near
    }, e.name !== "" && (s.name = e.type), t.cameras.push(s) - 1;
  }
  /**
   * Creates glTF animation entry from AnimationClip object.
   *
   * Status:
   * - Only properties listed in PATH_PROPERTIES may be animated.
   *
   * @param {THREE.AnimationClip} clip
   * @param {THREE.Object3D} root
   * @return {number|null}
   */
  processAnimation(e, t) {
    const n = this.json, s = this.nodeMap;
    n.animations || (n.animations = []), e = Mr.Utils.mergeMorphTargetTracks(e.clone(), t);
    const i = e.tracks, r = [], a = [];
    for (let l = 0; l < i.length; ++l) {
      const c = i[l], u = PropertyBinding.parseTrackName(c.name);
      let h2 = PropertyBinding.findNode(t, u.nodeName);
      const f = Wr[u.propertyName];
      if (u.objectName === "bones" && (h2.isSkinnedMesh === true ? h2 = h2.skeleton.getBoneByName(u.objectIndex) : h2 = void 0), !h2 || !f)
        return console.warn('THREE.GLTFExporter: Could not export animation track "%s".', c.name), null;
      const p = 1;
      let y = c.values.length / c.times.length;
      f === Wr.morphTargetInfluences && (y /= h2.morphTargetInfluences.length);
      let g2;
      c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline === true ? (g2 = "CUBICSPLINE", y /= 3) : c.getInterpolation() === InterpolateDiscrete ? g2 = "STEP" : g2 = "LINEAR", a.push({
        input: this.processAccessor(new BufferAttribute(c.times, p)),
        output: this.processAccessor(new BufferAttribute(c.values, y)),
        interpolation: g2
      }), r.push({
        sampler: a.length - 1,
        target: {
          node: s.get(h2),
          path: f
        }
      });
    }
    return n.animations.push({
      name: e.name || "clip_" + n.animations.length,
      samplers: a,
      channels: r
    }), n.animations.length - 1;
  }
  /**
   * @param {THREE.Object3D} object
   * @return {number|null}
   */
  processSkin(e) {
    const t = this.json, n = this.nodeMap, s = t.nodes[n.get(e)], i = e.skeleton;
    if (i === void 0)
      return null;
    const r = e.skeleton.bones[0];
    if (r === void 0)
      return null;
    const a = [], l = new Float32Array(i.bones.length * 16), c = new Matrix4();
    for (let h2 = 0; h2 < i.bones.length; ++h2)
      a.push(n.get(i.bones[h2])), c.copy(i.boneInverses[h2]), c.multiply(e.bindMatrix).toArray(l, h2 * 16);
    return t.skins === void 0 && (t.skins = []), t.skins.push({
      inverseBindMatrices: this.processAccessor(new BufferAttribute(l, 16)),
      joints: a,
      skeleton: n.get(r)
    }), s.skin = t.skins.length - 1;
  }
  /**
   * Process Object3D node
   * @param  {THREE.Object3D} node Object3D to processNode
   * @return {Integer} Index of the node in the nodes list
   */
  processNode(e) {
    const t = this.json, n = this.options, s = this.nodeMap;
    t.nodes || (t.nodes = []);
    const i = {};
    if (n.trs) {
      const a = e.quaternion.toArray(), l = e.position.toArray(), c = e.scale.toArray();
      ys(a, [0, 0, 0, 1]) || (i.rotation = a), ys(l, [0, 0, 0]) || (i.translation = l), ys(c, [1, 1, 1]) || (i.scale = c);
    } else
      e.matrixAutoUpdate && e.updateMatrix(), Cc(e.matrix) === false && (i.matrix = e.matrix.elements);
    if (e.name !== "" && (i.name = String(e.name)), this.serializeUserData(e, i), e.isMesh || e.isLine || e.isPoints) {
      const a = this.processMesh(e);
      a !== null && (i.mesh = a);
    } else
      e.isCamera && (i.camera = this.processCamera(e));
    if (e.isSkinnedMesh && this.skins.push(e), e.children.length > 0) {
      const a = [];
      for (let l = 0, c = e.children.length; l < c; l++) {
        const u = e.children[l];
        if (u.visible || n.onlyVisible === false) {
          const h2 = this.processNode(u);
          h2 !== null && a.push(h2);
        }
      }
      a.length > 0 && (i.children = a);
    }
    this._invokeAll(function(a) {
      a.writeNode && a.writeNode(e, i);
    });
    const r = t.nodes.push(i) - 1;
    return s.set(e, r), r;
  }
  /**
   * Process Scene
   * @param  {Scene} node Scene to process
   */
  processScene(e) {
    const t = this.json, n = this.options;
    t.scenes || (t.scenes = [], t.scene = 0);
    const s = {};
    e.name !== "" && (s.name = e.name), t.scenes.push(s);
    const i = [];
    for (let r = 0, a = e.children.length; r < a; r++) {
      const l = e.children[r];
      if (l.visible || n.onlyVisible === false) {
        const c = this.processNode(l);
        c !== null && i.push(c);
      }
    }
    i.length > 0 && (s.nodes = i), this.serializeUserData(e, s);
  }
  /**
   * Creates a Scene to hold a list of objects and parse it
   * @param  {Array} objects List of objects to process
   */
  processObjects(e) {
    const t = new Scene();
    t.name = "AuxScene";
    for (let n = 0; n < e.length; n++)
      t.children.push(e[n]);
    this.processScene(t);
  }
  /**
   * @param {THREE.Object3D|Array<THREE.Object3D>} input
   */
  processInput(e) {
    const t = this.options;
    e = e instanceof Array ? e : [e], this._invokeAll(function(s) {
      s.beforeParse && s.beforeParse(e);
    });
    const n = [];
    for (let s = 0; s < e.length; s++)
      e[s] instanceof Scene ? this.processScene(e[s]) : n.push(e[s]);
    n.length > 0 && this.processObjects(n);
    for (let s = 0; s < this.skins.length; ++s)
      this.processSkin(this.skins[s]);
    for (let s = 0; s < t.animations.length; ++s)
      this.processAnimation(t.animations[s], e[0]);
    this._invokeAll(function(s) {
      s.afterParse && s.afterParse(e);
    });
  }
  _invokeAll(e) {
    for (let t = 0, n = this.plugins.length; t < n; t++)
      e(this.plugins[t]);
  }
}
class Dc {
  constructor(e) {
    this.writer = e, this.name = "KHR_lights_punctual";
  }
  writeNode(e, t) {
    if (!e.isLight)
      return;
    if (!e.isDirectionalLight && !e.isPointLight && !e.isSpotLight) {
      console.warn("THREE.GLTFExporter: Only directional, point, and spot lights are supported.", e);
      return;
    }
    const n = this.writer, s = n.json, i = n.extensionsUsed, r = {};
    e.name && (r.name = e.name), r.color = e.color.toArray(), r.intensity = e.intensity, e.isDirectionalLight ? r.type = "directional" : e.isPointLight ? (r.type = "point", e.distance > 0 && (r.range = e.distance)) : e.isSpotLight && (r.type = "spot", e.distance > 0 && (r.range = e.distance), r.spot = {}, r.spot.innerConeAngle = (e.penumbra - 1) * e.angle * -1, r.spot.outerConeAngle = e.angle), e.decay !== void 0 && e.decay !== 2 && console.warn(
      "THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2."
    ), e.target && (e.target.parent !== e || e.target.position.x !== 0 || e.target.position.y !== 0 || e.target.position.z !== -1) && console.warn(
      "THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1."
    ), i[this.name] || (s.extensions = s.extensions || {}, s.extensions[this.name] = { lights: [] }, i[this.name] = true);
    const a = s.extensions[this.name].lights;
    a.push(r), t.extensions = t.extensions || {}, t.extensions[this.name] = { light: a.length - 1 };
  }
}
let Oc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_unlit";
  }
  writeMaterial(e, t) {
    if (!e.isMeshBasicMaterial)
      return;
    const s = this.writer.extensionsUsed;
    t.extensions = t.extensions || {}, t.extensions[this.name] = {}, s[this.name] = true, t.pbrMetallicRoughness.metallicFactor = 0, t.pbrMetallicRoughness.roughnessFactor = 0.9;
  }
}, Lc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_clearcoat";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.clearcoat === 0)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (i.clearcoatFactor = e.clearcoat, e.clearcoatMap) {
      const r = {
        index: n.processTexture(e.clearcoatMap),
        texCoord: e.clearcoatMap.channel
      };
      n.applyTextureTransform(r, e.clearcoatMap), i.clearcoatTexture = r;
    }
    if (i.clearcoatRoughnessFactor = e.clearcoatRoughness, e.clearcoatRoughnessMap) {
      const r = {
        index: n.processTexture(e.clearcoatRoughnessMap),
        texCoord: e.clearcoatRoughnessMap.channel
      };
      n.applyTextureTransform(r, e.clearcoatRoughnessMap), i.clearcoatRoughnessTexture = r;
    }
    if (e.clearcoatNormalMap) {
      const r = {
        index: n.processTexture(e.clearcoatNormalMap),
        texCoord: e.clearcoatNormalMap.channel
      };
      n.applyTextureTransform(r, e.clearcoatNormalMap), i.clearcoatNormalTexture = r;
    }
    t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, Fc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_iridescence";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.iridescence === 0)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (i.iridescenceFactor = e.iridescence, e.iridescenceMap) {
      const r = {
        index: n.processTexture(e.iridescenceMap),
        texCoord: e.iridescenceMap.channel
      };
      n.applyTextureTransform(r, e.iridescenceMap), i.iridescenceTexture = r;
    }
    if (i.iridescenceIor = e.iridescenceIOR, i.iridescenceThicknessMinimum = e.iridescenceThicknessRange[0], i.iridescenceThicknessMaximum = e.iridescenceThicknessRange[1], e.iridescenceThicknessMap) {
      const r = {
        index: n.processTexture(e.iridescenceThicknessMap),
        texCoord: e.iridescenceThicknessMap.channel
      };
      n.applyTextureTransform(r, e.iridescenceThicknessMap), i.iridescenceThicknessTexture = r;
    }
    t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, kc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_transmission";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.transmission === 0)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (i.transmissionFactor = e.transmission, e.transmissionMap) {
      const r = {
        index: n.processTexture(e.transmissionMap),
        texCoord: e.transmissionMap.channel
      };
      n.applyTextureTransform(r, e.transmissionMap), i.transmissionTexture = r;
    }
    t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, Bc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_volume";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.transmission === 0)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (i.thicknessFactor = e.thickness, e.thicknessMap) {
      const r = {
        index: n.processTexture(e.thicknessMap),
        texCoord: e.thicknessMap.channel
      };
      n.applyTextureTransform(r, e.thicknessMap), i.thicknessTexture = r;
    }
    i.attenuationDistance = e.attenuationDistance, i.attenuationColor = e.attenuationColor.toArray(), t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, Uc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_ior";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.ior === 1.5)
      return;
    const s = this.writer.extensionsUsed, i = {};
    i.ior = e.ior, t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, Nc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_specular";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.specularIntensity === 1 && e.specularColor.equals(bc) && !e.specularIntensityMap && !e.specularColorTexture)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (e.specularIntensityMap) {
      const r = {
        index: n.processTexture(e.specularIntensityMap),
        texCoord: e.specularIntensityMap.channel
      };
      n.applyTextureTransform(r, e.specularIntensityMap), i.specularTexture = r;
    }
    if (e.specularColorMap) {
      const r = {
        index: n.processTexture(e.specularColorMap),
        texCoord: e.specularColorMap.channel
      };
      n.applyTextureTransform(r, e.specularColorMap), i.specularColorTexture = r;
    }
    i.specularFactor = e.specularIntensity, i.specularColorFactor = e.specularColor.toArray(), t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, zc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_sheen";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.sheen == 0)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (e.sheenRoughnessMap) {
      const r = {
        index: n.processTexture(e.sheenRoughnessMap),
        texCoord: e.sheenRoughnessMap.channel
      };
      n.applyTextureTransform(r, e.sheenRoughnessMap), i.sheenRoughnessTexture = r;
    }
    if (e.sheenColorMap) {
      const r = {
        index: n.processTexture(e.sheenColorMap),
        texCoord: e.sheenColorMap.channel
      };
      n.applyTextureTransform(r, e.sheenColorMap), i.sheenColorTexture = r;
    }
    i.sheenRoughnessFactor = e.sheenRoughness, i.sheenColorFactor = e.sheenColor.toArray(), t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, Hc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_anisotropy";
  }
  writeMaterial(e, t) {
    if (!e.isMeshPhysicalMaterial || e.anisotropy == 0)
      return;
    const n = this.writer, s = n.extensionsUsed, i = {};
    if (e.anisotropyMap) {
      const r = { index: n.processTexture(e.anisotropyMap) };
      n.applyTextureTransform(r, e.anisotropyMap), i.anisotropyTexture = r;
    }
    i.anisotropyStrength = e.anisotropy, i.anisotropyRotation = e.anisotropyRotation, t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
}, jc = class {
  constructor(e) {
    this.writer = e, this.name = "KHR_materials_emissive_strength";
  }
  writeMaterial(e, t) {
    if (!e.isMeshStandardMaterial || e.emissiveIntensity === 1)
      return;
    const s = this.writer.extensionsUsed, i = {};
    i.emissiveStrength = e.emissiveIntensity, t.extensions = t.extensions || {}, t.extensions[this.name] = i, s[this.name] = true;
  }
};
var Et = Uint8Array, yn = Uint16Array, ar = Uint32Array, Ia = new Et([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Ra = new Et([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), Da = function(o, e) {
  for (var t = new yn(31), n = 0; n < 31; ++n)
    t[n] = e += 1 << o[n - 1];
  for (var s = new ar(t[30]), n = 1; n < 30; ++n)
    for (var i = t[n]; i < t[n + 1]; ++i)
      s[i] = i - t[n] << 5 | n;
  return [t, s];
}, Oa = Da(Ia, 2), La = Oa[0], Vc = Oa[1];
La[28] = 258, Vc[258] = 28;
Da(Ra, 0);
var lr = new yn(32768);
for (var Ge = 0; Ge < 32768; ++Ge) {
  var an = (Ge & 43690) >>> 1 | (Ge & 21845) << 1;
  an = (an & 52428) >>> 2 | (an & 13107) << 2, an = (an & 61680) >>> 4 | (an & 3855) << 4, lr[Ge] = ((an & 65280) >>> 8 | (an & 255) << 8) >>> 1;
}
var Ps = new Et(288);
for (var Ge = 0; Ge < 144; ++Ge)
  Ps[Ge] = 8;
for (var Ge = 144; Ge < 256; ++Ge)
  Ps[Ge] = 9;
for (var Ge = 256; Ge < 280; ++Ge)
  Ps[Ge] = 7;
for (var Ge = 280; Ge < 288; ++Ge)
  Ps[Ge] = 8;
var Fa = new Et(32);
for (var Ge = 0; Ge < 32; ++Ge)
  Fa[Ge] = 5;
var Qc = /* @__PURE__ */ new Et(0);
var tu = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), nu = 0;
try {
  tu.decode(Qc, { stream: true }), nu = 1;
} catch {
}
new Triangle();
new Vector3();
new Euler(0, 0, 0, "YXZ");
new Vector3();
var pu = Object.defineProperty, mu = (o, e, t) => e in o ? pu(o, e, { enumerable: true, configurable: true, writable: true, value: t }) : o[e] = t, we = (o, e, t) => (mu(o, typeof e != "symbol" ? e + "" : e, t), t);
const Gs = new Ray(), Qr = new Plane(), gu = Math.cos(70 * (Math.PI / 180)), Jr = (o, e) => (o % e + e) % e;
class ka extends EventDispatcher {
  constructor(e, t) {
    super(), we(this, "object"), we(this, "domElement"), we(this, "enabled", true), we(this, "target", new Vector3()), we(this, "minDistance", 0), we(this, "maxDistance", 1 / 0), we(this, "minZoom", 0), we(this, "maxZoom", 1 / 0), we(this, "minPolarAngle", 0), we(this, "maxPolarAngle", Math.PI), we(this, "minAzimuthAngle", -1 / 0), we(this, "maxAzimuthAngle", 1 / 0), we(this, "enableDamping", false), we(this, "dampingFactor", 0.05), we(this, "enableZoom", true), we(this, "zoomSpeed", 1), we(this, "enableRotate", true), we(this, "rotateSpeed", 1), we(this, "enablePan", true), we(this, "panSpeed", 1), we(this, "screenSpacePanning", true), we(this, "keyPanSpeed", 7), we(this, "zoomToCursor", false), we(this, "autoRotate", false), we(this, "autoRotateSpeed", 2), we(this, "reverseOrbit", false), we(this, "reverseHorizontalOrbit", false), we(this, "reverseVerticalOrbit", false), we(this, "keys", { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }), we(this, "mouseButtons", {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN
    }), we(this, "touches", { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }), we(this, "target0"), we(this, "position0"), we(this, "zoom0"), we(this, "_domElementKeyEvents", null), we(this, "getPolarAngle"), we(this, "getAzimuthalAngle"), we(this, "setPolarAngle"), we(this, "setAzimuthalAngle"), we(this, "getDistance"), we(this, "listenToKeyEvents"), we(this, "stopListenToKeyEvents"), we(this, "saveState"), we(this, "reset"), we(this, "update"), we(this, "connect"), we(this, "dispose"), this.object = e, this.domElement = t, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = () => u.phi, this.getAzimuthalAngle = () => u.theta, this.setPolarAngle = (X) => {
      let ie = Jr(X, 2 * Math.PI), Te = u.phi;
      Te < 0 && (Te += 2 * Math.PI), ie < 0 && (ie += 2 * Math.PI);
      let Be = Math.abs(ie - Te);
      2 * Math.PI - Be < Be && (ie < Te ? ie += 2 * Math.PI : Te += 2 * Math.PI), h2.phi = ie - Te, n.update();
    }, this.setAzimuthalAngle = (X) => {
      let ie = Jr(X, 2 * Math.PI), Te = u.theta;
      Te < 0 && (Te += 2 * Math.PI), ie < 0 && (ie += 2 * Math.PI);
      let Be = Math.abs(ie - Te);
      2 * Math.PI - Be < Be && (ie < Te ? ie += 2 * Math.PI : Te += 2 * Math.PI), h2.theta = ie - Te, n.update();
    }, this.getDistance = () => n.object.position.distanceTo(n.target), this.listenToKeyEvents = (X) => {
      X.addEventListener("keydown", sn), this._domElementKeyEvents = X;
    }, this.stopListenToKeyEvents = () => {
      this._domElementKeyEvents.removeEventListener("keydown", sn), this._domElementKeyEvents = null;
    }, this.saveState = () => {
      n.target0.copy(n.target), n.position0.copy(n.object.position), n.zoom0 = n.object.zoom;
    }, this.reset = () => {
      n.target.copy(n.target0), n.object.position.copy(n.position0), n.object.zoom = n.zoom0, n.object.updateProjectionMatrix(), n.dispatchEvent(s), n.update(), l = a.NONE;
    }, this.update = (() => {
      const X = new Vector3(), ie = new Vector3(0, 1, 0), Te = new Quaternion().setFromUnitVectors(e.up, ie), Be = Te.clone().invert(), Je = new Vector3(), Gt = new Quaternion(), rn = 2 * Math.PI;
      return function() {
        const zr = n.object.position;
        Te.setFromUnitVectors(e.up, ie), Be.copy(Te).invert(), X.copy(zr).sub(n.target), X.applyQuaternion(Te), u.setFromVector3(X), n.autoRotate && l === a.NONE && k(R()), n.enableDamping ? (u.theta += h2.theta * n.dampingFactor, u.phi += h2.phi * n.dampingFactor) : (u.theta += h2.theta, u.phi += h2.phi);
        let Vt2 = n.minAzimuthAngle, Yt = n.maxAzimuthAngle;
        isFinite(Vt2) && isFinite(Yt) && (Vt2 < -Math.PI ? Vt2 += rn : Vt2 > Math.PI && (Vt2 -= rn), Yt < -Math.PI ? Yt += rn : Yt > Math.PI && (Yt -= rn), Vt2 <= Yt ? u.theta = Math.max(Vt2, Math.min(Yt, u.theta)) : u.theta = u.theta > (Vt2 + Yt) / 2 ? Math.max(Vt2, u.theta) : Math.min(Yt, u.theta)), u.phi = Math.max(n.minPolarAngle, Math.min(n.maxPolarAngle, u.phi)), u.makeSafe(), n.enableDamping === true ? n.target.addScaledVector(p, n.dampingFactor) : n.target.add(p), n.zoomToCursor && b || n.object.isOrthographicCamera ? u.radius = de2(u.radius) : u.radius = de2(u.radius * f), X.setFromSpherical(u), X.applyQuaternion(Be), zr.copy(n.target).add(X), n.object.matrixAutoUpdate || n.object.updateMatrix(), n.object.lookAt(n.target), n.enableDamping === true ? (h2.theta *= 1 - n.dampingFactor, h2.phi *= 1 - n.dampingFactor, p.multiplyScalar(1 - n.dampingFactor)) : (h2.set(0, 0, 0), p.set(0, 0, 0));
        let os = false;
        if (n.zoomToCursor && b) {
          let as = null;
          if (n.object instanceof PerspectiveCamera && n.object.isPerspectiveCamera) {
            const ls = X.length();
            as = de2(ls * f);
            const Fs = ls - as;
            n.object.position.addScaledVector(M2, Fs), n.object.updateMatrixWorld();
          } else if (n.object.isOrthographicCamera) {
            const ls = new Vector3(m2.x, m2.y, 0);
            ls.unproject(n.object), n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / f)), n.object.updateProjectionMatrix(), os = true;
            const Fs = new Vector3(m2.x, m2.y, 0);
            Fs.unproject(n.object), n.object.position.sub(Fs).add(ls), n.object.updateMatrixWorld(), as = X.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), n.zoomToCursor = false;
          as !== null && (n.screenSpacePanning ? n.target.set(0, 0, -1).transformDirection(n.object.matrix).multiplyScalar(as).add(n.object.position) : (Gs.origin.copy(n.object.position), Gs.direction.set(0, 0, -1).transformDirection(n.object.matrix), Math.abs(n.object.up.dot(Gs.direction)) < gu ? e.lookAt(n.target) : (Qr.setFromNormalAndCoplanarPoint(n.object.up, n.target), Gs.intersectPlane(Qr, n.target))));
        } else
          n.object instanceof OrthographicCamera && n.object.isOrthographicCamera && (os = f !== 1, os && (n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / f)), n.object.updateProjectionMatrix()));
        return f = 1, b = false, os || Je.distanceToSquared(n.object.position) > c || 8 * (1 - Gt.dot(n.object.quaternion)) > c ? (n.dispatchEvent(s), Je.copy(n.object.position), Gt.copy(n.object.quaternion), os = false, true) : false;
      };
    })(), this.connect = (X) => {
      X === void 0 && console.error(
        'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'
      ), n.domElement = X, n.domElement.style.touchAction = "none", n.domElement.addEventListener("contextmenu", rs), n.domElement.addEventListener("pointerdown", fe2), n.domElement.addEventListener("pointercancel", je), n.domElement.addEventListener("wheel", gt, { passive: true });
    }, this.dispose = () => {
      var X, ie, Te, Be, Je, Gt;
      n.domElement && (n.domElement.style.touchAction = "auto"), (X = n.domElement) == null || X.removeEventListener("contextmenu", rs), (ie = n.domElement) == null || ie.removeEventListener("pointerdown", fe2), (Te = n.domElement) == null || Te.removeEventListener("pointercancel", je), (Be = n.domElement) == null || Be.removeEventListener("wheel", gt), (Je = n.domElement) == null || Je.ownerDocument.removeEventListener("pointermove", Me), (Gt = n.domElement) == null || Gt.ownerDocument.removeEventListener("pointerup", Xe), n._domElementKeyEvents !== null && n._domElementKeyEvents.removeEventListener("keydown", sn);
    };
    const n = this, s = { type: "change" }, i = { type: "start" }, r = { type: "end" }, a = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let l = a.NONE;
    const c = 1e-6, u = new Spherical(), h2 = new Spherical();
    let f = 1;
    const p = new Vector3(), y = new Vector2(), g2 = new Vector2(), v2 = new Vector2(), d = new Vector2(), w = new Vector2(), x2 = new Vector2(), T = new Vector2(), P2 = new Vector2(), S = new Vector2(), M2 = new Vector3(), m2 = new Vector2();
    let b = false;
    const _2 = [], I2 = {};
    function R() {
      return 2 * Math.PI / 60 / 60 * n.autoRotateSpeed;
    }
    function z() {
      return Math.pow(0.95, n.zoomSpeed);
    }
    function k(X) {
      n.reverseOrbit || n.reverseHorizontalOrbit ? h2.theta += X : h2.theta -= X;
    }
    function G2(X) {
      n.reverseOrbit || n.reverseVerticalOrbit ? h2.phi += X : h2.phi -= X;
    }
    const U = (() => {
      const X = new Vector3();
      return function(Te, Be) {
        X.setFromMatrixColumn(Be, 0), X.multiplyScalar(-Te), p.add(X);
      };
    })(), q = (() => {
      const X = new Vector3();
      return function(Te, Be) {
        n.screenSpacePanning === true ? X.setFromMatrixColumn(Be, 1) : (X.setFromMatrixColumn(Be, 0), X.crossVectors(n.object.up, X)), X.multiplyScalar(Te), p.add(X);
      };
    })(), $2 = (() => {
      const X = new Vector3();
      return function(Te, Be) {
        const Je = n.domElement;
        if (Je && n.object instanceof PerspectiveCamera && n.object.isPerspectiveCamera) {
          const Gt = n.object.position;
          X.copy(Gt).sub(n.target);
          let rn = X.length();
          rn *= Math.tan(n.object.fov / 2 * Math.PI / 180), U(2 * Te * rn / Je.clientHeight, n.object.matrix), q(2 * Be * rn / Je.clientHeight, n.object.matrix);
        } else
          Je && n.object instanceof OrthographicCamera && n.object.isOrthographicCamera ? (U(
            Te * (n.object.right - n.object.left) / n.object.zoom / Je.clientWidth,
            n.object.matrix
          ), q(
            Be * (n.object.top - n.object.bottom) / n.object.zoom / Je.clientHeight,
            n.object.matrix
          )) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), n.enablePan = false);
      };
    })();
    function te(X) {
      n.object instanceof PerspectiveCamera && n.object.isPerspectiveCamera || n.object instanceof OrthographicCamera && n.object.isOrthographicCamera ? f /= X : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = false);
    }
    function ee2(X) {
      n.object instanceof PerspectiveCamera && n.object.isPerspectiveCamera || n.object instanceof OrthographicCamera && n.object.isOrthographicCamera ? f *= X : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = false);
    }
    function oe2(X) {
      if (!n.zoomToCursor || !n.domElement)
        return;
      b = true;
      const ie = n.domElement.getBoundingClientRect(), Te = X.clientX - ie.left, Be = X.clientY - ie.top, Je = ie.width, Gt = ie.height;
      m2.x = Te / Je * 2 - 1, m2.y = -(Be / Gt) * 2 + 1, M2.set(m2.x, m2.y, 1).unproject(n.object).sub(n.object.position).normalize();
    }
    function de2(X) {
      return Math.max(n.minDistance, Math.min(n.maxDistance, X));
    }
    function xe(X) {
      y.set(X.clientX, X.clientY);
    }
    function C(X) {
      oe2(X), T.set(X.clientX, X.clientY);
    }
    function B(X) {
      d.set(X.clientX, X.clientY);
    }
    function L(X) {
      g2.set(X.clientX, X.clientY), v2.subVectors(g2, y).multiplyScalar(n.rotateSpeed);
      const ie = n.domElement;
      ie && (k(2 * Math.PI * v2.x / ie.clientHeight), G2(2 * Math.PI * v2.y / ie.clientHeight)), y.copy(g2), n.update();
    }
    function O(X) {
      P2.set(X.clientX, X.clientY), S.subVectors(P2, T), S.y > 0 ? te(z()) : S.y < 0 && ee2(z()), T.copy(P2), n.update();
    }
    function N(X) {
      w.set(X.clientX, X.clientY), x2.subVectors(w, d).multiplyScalar(n.panSpeed), $2(x2.x, x2.y), d.copy(w), n.update();
    }
    function E2(X) {
      oe2(X), X.deltaY < 0 ? ee2(z()) : X.deltaY > 0 && te(z()), n.update();
    }
    function A2(X) {
      let ie = false;
      switch (X.code) {
        case n.keys.UP:
          $2(0, n.keyPanSpeed), ie = true;
          break;
        case n.keys.BOTTOM:
          $2(0, -n.keyPanSpeed), ie = true;
          break;
        case n.keys.LEFT:
          $2(n.keyPanSpeed, 0), ie = true;
          break;
        case n.keys.RIGHT:
          $2(-n.keyPanSpeed, 0), ie = true;
          break;
      }
      ie && (X.preventDefault(), n.update());
    }
    function D() {
      if (_2.length == 1)
        y.set(_2[0].pageX, _2[0].pageY);
      else {
        const X = 0.5 * (_2[0].pageX + _2[1].pageX), ie = 0.5 * (_2[0].pageY + _2[1].pageY);
        y.set(X, ie);
      }
    }
    function W2() {
      if (_2.length == 1)
        d.set(_2[0].pageX, _2[0].pageY);
      else {
        const X = 0.5 * (_2[0].pageX + _2[1].pageX), ie = 0.5 * (_2[0].pageY + _2[1].pageY);
        d.set(X, ie);
      }
    }
    function Y() {
      const X = _2[0].pageX - _2[1].pageX, ie = _2[0].pageY - _2[1].pageY, Te = Math.sqrt(X * X + ie * ie);
      T.set(0, Te);
    }
    function j2() {
      n.enableZoom && Y(), n.enablePan && W2();
    }
    function J2() {
      n.enableZoom && Y(), n.enableRotate && D();
    }
    function ne(X) {
      if (_2.length == 1)
        g2.set(X.pageX, X.pageY);
      else {
        const Te = gi(X), Be = 0.5 * (X.pageX + Te.x), Je = 0.5 * (X.pageY + Te.y);
        g2.set(Be, Je);
      }
      v2.subVectors(g2, y).multiplyScalar(n.rotateSpeed);
      const ie = n.domElement;
      ie && (k(2 * Math.PI * v2.x / ie.clientHeight), G2(2 * Math.PI * v2.y / ie.clientHeight)), y.copy(g2);
    }
    function se(X) {
      if (_2.length == 1)
        w.set(X.pageX, X.pageY);
      else {
        const ie = gi(X), Te = 0.5 * (X.pageX + ie.x), Be = 0.5 * (X.pageY + ie.y);
        w.set(Te, Be);
      }
      x2.subVectors(w, d).multiplyScalar(n.panSpeed), $2(x2.x, x2.y), d.copy(w);
    }
    function V2(X) {
      const ie = gi(X), Te = X.pageX - ie.x, Be = X.pageY - ie.y, Je = Math.sqrt(Te * Te + Be * Be);
      P2.set(0, Je), S.set(0, Math.pow(P2.y / T.y, n.zoomSpeed)), te(S.y), T.copy(P2);
    }
    function F2(X) {
      n.enableZoom && V2(X), n.enablePan && se(X);
    }
    function re2(X) {
      n.enableZoom && V2(X), n.enableRotate && ne(X);
    }
    function fe2(X) {
      var ie, Te;
      n.enabled !== false && (_2.length === 0 && ((ie = n.domElement) == null || ie.ownerDocument.addEventListener("pointermove", Me), (Te = n.domElement) == null || Te.ownerDocument.addEventListener("pointerup", Xe)), Ds(X), X.pointerType === "touch" ? is(X) : _t(X));
    }
    function Me(X) {
      n.enabled !== false && (X.pointerType === "touch" ? Un(X) : nn(X));
    }
    function Xe(X) {
      var ie, Te, Be;
      Os(X), _2.length === 0 && ((ie = n.domElement) == null || ie.releasePointerCapture(X.pointerId), (Te = n.domElement) == null || Te.ownerDocument.removeEventListener("pointermove", Me), (Be = n.domElement) == null || Be.ownerDocument.removeEventListener("pointerup", Xe)), n.dispatchEvent(r), l = a.NONE;
    }
    function je(X) {
      Os(X);
    }
    function _t(X) {
      let ie;
      switch (X.button) {
        case 0:
          ie = n.mouseButtons.LEFT;
          break;
        case 1:
          ie = n.mouseButtons.MIDDLE;
          break;
        case 2:
          ie = n.mouseButtons.RIGHT;
          break;
        default:
          ie = -1;
      }
      switch (ie) {
        case MOUSE.DOLLY:
          if (n.enableZoom === false)
            return;
          C(X), l = a.DOLLY;
          break;
        case MOUSE.ROTATE:
          if (X.ctrlKey || X.metaKey || X.shiftKey) {
            if (n.enablePan === false)
              return;
            B(X), l = a.PAN;
          } else {
            if (n.enableRotate === false)
              return;
            xe(X), l = a.ROTATE;
          }
          break;
        case MOUSE.PAN:
          if (X.ctrlKey || X.metaKey || X.shiftKey) {
            if (n.enableRotate === false)
              return;
            xe(X), l = a.ROTATE;
          } else {
            if (n.enablePan === false)
              return;
            B(X), l = a.PAN;
          }
          break;
        default:
          l = a.NONE;
      }
      l !== a.NONE && n.dispatchEvent(i);
    }
    function nn(X) {
      if (n.enabled !== false)
        switch (l) {
          case a.ROTATE:
            if (n.enableRotate === false)
              return;
            L(X);
            break;
          case a.DOLLY:
            if (n.enableZoom === false)
              return;
            O(X);
            break;
          case a.PAN:
            if (n.enablePan === false)
              return;
            N(X);
            break;
        }
    }
    function gt(X) {
      n.enabled === false || n.enableZoom === false || l !== a.NONE && l !== a.ROTATE || (n.dispatchEvent(i), E2(X), n.dispatchEvent(r));
    }
    function sn(X) {
      n.enabled === false || n.enablePan === false || A2(X);
    }
    function is(X) {
      switch (Ls(X), _2.length) {
        case 1:
          switch (n.touches.ONE) {
            case TOUCH.ROTATE:
              if (n.enableRotate === false)
                return;
              D(), l = a.TOUCH_ROTATE;
              break;
            case TOUCH.PAN:
              if (n.enablePan === false)
                return;
              W2(), l = a.TOUCH_PAN;
              break;
            default:
              l = a.NONE;
          }
          break;
        case 2:
          switch (n.touches.TWO) {
            case TOUCH.DOLLY_PAN:
              if (n.enableZoom === false && n.enablePan === false)
                return;
              j2(), l = a.TOUCH_DOLLY_PAN;
              break;
            case TOUCH.DOLLY_ROTATE:
              if (n.enableZoom === false && n.enableRotate === false)
                return;
              J2(), l = a.TOUCH_DOLLY_ROTATE;
              break;
            default:
              l = a.NONE;
          }
          break;
        default:
          l = a.NONE;
      }
      l !== a.NONE && n.dispatchEvent(i);
    }
    function Un(X) {
      switch (Ls(X), l) {
        case a.TOUCH_ROTATE:
          if (n.enableRotate === false)
            return;
          ne(X), n.update();
          break;
        case a.TOUCH_PAN:
          if (n.enablePan === false)
            return;
          se(X), n.update();
          break;
        case a.TOUCH_DOLLY_PAN:
          if (n.enableZoom === false && n.enablePan === false)
            return;
          F2(X), n.update();
          break;
        case a.TOUCH_DOLLY_ROTATE:
          if (n.enableZoom === false && n.enableRotate === false)
            return;
          re2(X), n.update();
          break;
        default:
          l = a.NONE;
      }
    }
    function rs(X) {
      n.enabled !== false && X.preventDefault();
    }
    function Ds(X) {
      _2.push(X);
    }
    function Os(X) {
      delete I2[X.pointerId];
      for (let ie = 0; ie < _2.length; ie++)
        if (_2[ie].pointerId == X.pointerId) {
          _2.splice(ie, 1);
          return;
        }
    }
    function Ls(X) {
      let ie = I2[X.pointerId];
      ie === void 0 && (ie = new Vector2(), I2[X.pointerId] = ie), ie.set(X.pageX, X.pageY);
    }
    function gi(X) {
      const ie = X.pointerId === _2[0].pointerId ? _2[1] : _2[0];
      return I2[ie.pointerId];
    }
    t !== void 0 && this.connect(t), this.update();
  }
}
new Quaternion();
new Matrix4();
new Vector3();
new Euler();
new Vector3();
var _h = Object.defineProperty, xh = (o, e, t) => e in o ? _h(o, e, { enumerable: true, configurable: true, writable: true, value: t }) : o[e] = t, Ar = (o, e, t) => (xh(o, typeof e != "symbol" ? e + "" : e, t), t);
class Pr {
  constructor(e) {
    Ar(this, "data"), this.data = e;
  }
  generateShapes(e, t = 100, n) {
    const s = [], i = { letterSpacing: 0, lineHeight: 1, ...n }, r = Th(e, t, this.data, i);
    for (let a = 0, l = r.length; a < l; a++)
      Array.prototype.push.apply(s, r[a].toShapes(false));
    return s;
  }
}
Ar(Pr, "isFont");
Ar(Pr, "type");
function Th(o, e, t, n) {
  const s = Array.from(o), i = e / t.resolution, r = (t.boundingBox.yMax - t.boundingBox.yMin + t.underlineThickness) * i, a = [];
  let l = 0, c = 0;
  for (let u = 0; u < s.length; u++) {
    const h2 = s[u];
    if (h2 === `
`)
      l = 0, c -= r * n.lineHeight;
    else {
      const f = bh(h2, i, l, c, t);
      f && (l += f.offsetX + n.letterSpacing, a.push(f.path));
    }
  }
  return a;
}
function bh(o, e, t, n, s) {
  const i = s.glyphs[o] || s.glyphs["?"];
  if (!i) {
    console.error('THREE.Font: character "' + o + '" does not exists in font family ' + s.familyName + ".");
    return;
  }
  const r = new ShapePath();
  let a, l, c, u, h2, f, p, y;
  if (i.o) {
    const g2 = i._cachedOutline || (i._cachedOutline = i.o.split(" "));
    for (let v2 = 0, d = g2.length; v2 < d; )
      switch (g2[v2++]) {
        case "m":
          a = parseInt(g2[v2++]) * e + t, l = parseInt(g2[v2++]) * e + n, r.moveTo(a, l);
          break;
        case "l":
          a = parseInt(g2[v2++]) * e + t, l = parseInt(g2[v2++]) * e + n, r.lineTo(a, l);
          break;
        case "q":
          c = parseInt(g2[v2++]) * e + t, u = parseInt(g2[v2++]) * e + n, h2 = parseInt(g2[v2++]) * e + t, f = parseInt(g2[v2++]) * e + n, r.quadraticCurveTo(h2, f, c, u);
          break;
        case "b":
          c = parseInt(g2[v2++]) * e + t, u = parseInt(g2[v2++]) * e + n, h2 = parseInt(g2[v2++]) * e + t, f = parseInt(g2[v2++]) * e + n, p = parseInt(g2[v2++]) * e + t, y = parseInt(g2[v2++]) * e + n, r.bezierCurveTo(h2, f, p, y, c, u);
          break;
      }
  }
  return { offsetX: i.ha * e, path: r };
}
class Ts extends Mesh {
  constructor(e, t = {}) {
    super(e), this.isReflector = true, this.type = "Reflector", this.camera = new PerspectiveCamera();
    const n = this, s = t.color !== void 0 ? new Color(t.color) : new Color(8355711), i = t.textureWidth || 512, r = t.textureHeight || 512, a = t.clipBias || 0, l = t.shader || Ts.ReflectorShader, c = t.multisample !== void 0 ? t.multisample : 4, u = new Plane(), h2 = new Vector3(), f = new Vector3(), p = new Vector3(), y = new Matrix4(), g2 = new Vector3(0, 0, -1), v2 = new Vector4(), d = new Vector3(), w = new Vector3(), x2 = new Vector4(), T = new Matrix4(), P2 = this.camera, S = new WebGLRenderTarget(i, r, { samples: c, type: HalfFloatType }), M2 = new ShaderMaterial({
      name: l.name !== void 0 ? l.name : "unspecified",
      uniforms: UniformsUtils.clone(l.uniforms),
      fragmentShader: l.fragmentShader,
      vertexShader: l.vertexShader
    });
    M2.uniforms.tDiffuse.value = S.texture, M2.uniforms.color.value = s, M2.uniforms.textureMatrix.value = T, this.material = M2, this.onBeforeRender = function(m2, b, _2) {
      if (f.setFromMatrixPosition(n.matrixWorld), p.setFromMatrixPosition(_2.matrixWorld), y.extractRotation(n.matrixWorld), h2.set(0, 0, 1), h2.applyMatrix4(y), d.subVectors(f, p), d.dot(h2) > 0)
        return;
      d.reflect(h2).negate(), d.add(f), y.extractRotation(_2.matrixWorld), g2.set(0, 0, -1), g2.applyMatrix4(y), g2.add(p), w.subVectors(f, g2), w.reflect(h2).negate(), w.add(f), P2.position.copy(d), P2.up.set(0, 1, 0), P2.up.applyMatrix4(y), P2.up.reflect(h2), P2.lookAt(w), P2.far = _2.far, P2.updateMatrixWorld(), P2.projectionMatrix.copy(_2.projectionMatrix), T.set(
        0.5,
        0,
        0,
        0.5,
        0,
        0.5,
        0,
        0.5,
        0,
        0,
        0.5,
        0.5,
        0,
        0,
        0,
        1
      ), T.multiply(P2.projectionMatrix), T.multiply(P2.matrixWorldInverse), T.multiply(n.matrixWorld), u.setFromNormalAndCoplanarPoint(h2, f), u.applyMatrix4(P2.matrixWorldInverse), v2.set(u.normal.x, u.normal.y, u.normal.z, u.constant);
      const I2 = P2.projectionMatrix;
      x2.x = (Math.sign(v2.x) + I2.elements[8]) / I2.elements[0], x2.y = (Math.sign(v2.y) + I2.elements[9]) / I2.elements[5], x2.z = -1, x2.w = (1 + I2.elements[10]) / I2.elements[14], v2.multiplyScalar(2 / v2.dot(x2)), I2.elements[2] = v2.x, I2.elements[6] = v2.y, I2.elements[10] = v2.z + 1 - a, I2.elements[14] = v2.w, n.visible = false;
      const R = m2.getRenderTarget(), z = m2.xr.enabled, k = m2.shadowMap.autoUpdate;
      m2.xr.enabled = false, m2.shadowMap.autoUpdate = false, m2.setRenderTarget(S), m2.state.buffers.depth.setMask(true), m2.autoClear === false && m2.clear(), m2.render(b, P2), m2.xr.enabled = z, m2.shadowMap.autoUpdate = k, m2.setRenderTarget(R);
      const G2 = _2.viewport;
      G2 !== void 0 && m2.state.viewport(G2), n.visible = true;
    }, this.getRenderTarget = function() {
      return S;
    }, this.dispose = function() {
      S.dispose(), n.material.dispose();
    };
  }
}
Ts.ReflectorShader = {
  name: "ReflectorShader",
  uniforms: {
    color: {
      value: null
    },
    tDiffuse: {
      value: null
    },
    textureMatrix: {
      value: null
    }
  },
  vertexShader: (
    /* glsl */
    `
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`
  ),
  fragmentShader: (
    /* glsl */
    `
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`
  )
};
const Ph = ["args", "material-uniforms-color-value"], Ch = /* @__PURE__ */ createElementVNode("TresPlaneGeometry", { args: [5, 5] }, null, -1), lg = /* @__PURE__ */ defineComponent({
  __name: "Reflector",
  props: {
    color: { default: "#333" },
    textureWidth: { default: 512 },
    textureHeight: { default: 512 },
    clipBias: { default: 0 },
    multisample: { default: 4 },
    shader: { default: Ts.ReflectorShader }
  },
  setup(o, { expose: e }) {
    const t = o, { extend: n } = dr(), s = shallowRef();
    n({ Reflector: Ts });
    const { color: i, textureWidth: r, textureHeight: a, clipBias: l, multisample: c, shader: u } = toRefs(t);
    return e({
      reflectorRef: s
    }), (h2, f) => (openBlock(), createElementBlock("TresReflector", {
      ref_key: "reflectorRef",
      ref: s,
      args: [void 0, { textureWidth: unref(r), textureHeight: unref(a), clipBias: unref(l), multisample: unref(c), shader: unref(u) }],
      "material-uniforms-color-value": unref(i)
    }, [
      renderSlot(h2.$slots, "default", {}, () => [
        Ch
      ])
    ], 8, Ph));
  }
});
function Cr(o) {
  return getCurrentScope() ? (onScopeDispose(o), true) : false;
}
function vt(o) {
  return typeof o == "function" ? o() : unref(o);
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Rh = Object.prototype.toString, Dh = (o) => Rh.call(o) === "[object Object]", kn = () => {
};
function _n(o) {
  var e;
  const t = vt(o);
  return (e = t == null ? void 0 : t.$el) != null ? e : t;
}
const en = void 0;
function Ye(...o) {
  let e, t, n, s;
  if (typeof o[0] == "string" || Array.isArray(o[0]) ? ([t, n, s] = o, e = en) : [e, t, n, s] = o, !e)
    return kn;
  Array.isArray(t) || (t = [t]), Array.isArray(n) || (n = [n]);
  const i = [], r = () => {
    i.forEach((u) => u()), i.length = 0;
  }, a = (u, h2, f, p) => (u.addEventListener(h2, f, p), () => u.removeEventListener(h2, f, p)), l = watch(
    () => [_n(e), vt(s)],
    ([u, h2]) => {
      if (r(), !u)
        return;
      const f = Dh(h2) ? { ...h2 } : h2;
      i.push(
        ...t.flatMap((p) => n.map((y) => a(u, p, y, f)))
      );
    },
    { immediate: true, flush: "post" }
  ), c = () => {
    l(), r();
  };
  return Cr(c), c;
}
defineComponent({
  name: "GlobalAudio",
  props: [
    "src",
    "loop",
    "volume",
    "playbackRate",
    "playTrigger",
    "stopTrigger"
  ],
  async setup(o, { expose: e, emit: t }) {
    var h2;
    const { camera: n, renderer: s } = dr(), i = new AudioListener();
    (h2 = n.value) == null || h2.add(i);
    const r = new Audio(i), a = new AudioLoader();
    e({ sound: r }), watch(() => [o.playbackRate], () => r.setPlaybackRate(o.playbackRate ?? 1), { immediate: true }), watch(() => [o.volume], () => r.setVolume(o.volume ?? 0.5), { immediate: true }), watch(() => [o.loop], () => r.setLoop(o.loop ?? false), { immediate: true }), watch(() => [o.src], async () => {
      const f = await a.loadAsync(o.src);
      r.setBuffer(f);
    }, { immediate: true });
    const c = (void 0).getElementById(o.playTrigger ?? "") || s.value.domElement;
    Ye(c, "click", () => {
      r.isPlaying ? r.pause() : r.play(), t("isPlaying", r.isPlaying);
    });
    const u = (void 0).getElementById(o.stopTrigger ?? "");
    return u && Ye(u, "click", () => {
      r.stop(), t("isPlaying", r.isPlaying);
    }), null;
  }
});
class bs extends Mesh {
  constructor() {
    super(bs.Geometry, new MeshBasicMaterial({ opacity: 0, transparent: true })), this.isLensflare = true, this.type = "Lensflare", this.frustumCulled = false, this.renderOrder = 1 / 0;
    const e = new Vector3(), t = new Vector3(), n = new FramebufferTexture(16, 16), s = new FramebufferTexture(16, 16);
    let i = UnsignedByteType;
    const r = bs.Geometry, a = new RawShaderMaterial({
      uniforms: {
        scale: { value: null },
        screenPosition: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`
      ),
      fragmentShader: (
        /* glsl */
        `

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`
      ),
      depthTest: true,
      depthWrite: false,
      transparent: false
    }), l = new RawShaderMaterial({
      uniforms: {
        map: { value: n },
        scale: { value: null },
        screenPosition: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`
      ),
      fragmentShader: (
        /* glsl */
        `

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`
      ),
      depthTest: false,
      depthWrite: false,
      transparent: false
    }), c = new Mesh(r, a), u = [], h2 = $a.Shader, f = new RawShaderMaterial({
      name: h2.name,
      uniforms: {
        map: { value: null },
        occlusionMap: { value: s },
        color: { value: new Color(16777215) },
        scale: { value: new Vector2() },
        screenPosition: { value: new Vector3() }
      },
      vertexShader: h2.vertexShader,
      fragmentShader: h2.fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false
    }), p = new Mesh(r, f);
    this.addElement = function(w) {
      u.push(w);
    };
    const y = new Vector2(), g2 = new Vector2(), v2 = new Box2(), d = new Vector4();
    this.onBeforeRender = function(w, x2, T) {
      w.getCurrentViewport(d);
      const P2 = w.getRenderTarget(), S = P2 !== null ? P2.texture.type : UnsignedByteType;
      i !== S && (n.dispose(), s.dispose(), n.type = s.type = S, i = S);
      const M2 = d.w / d.z, m2 = d.z / 2, b = d.w / 2;
      let _2 = 16 / d.w;
      if (y.set(_2 * M2, _2), v2.min.set(d.x, d.y), v2.max.set(d.x + (d.z - 16), d.y + (d.w - 16)), t.setFromMatrixPosition(this.matrixWorld), t.applyMatrix4(T.matrixWorldInverse), !(t.z > 0) && (e.copy(t).applyMatrix4(T.projectionMatrix), g2.x = d.x + e.x * m2 + m2 - 8, g2.y = d.y + e.y * b + b - 8, v2.containsPoint(g2))) {
        w.copyFramebufferToTexture(g2, n);
        let I2 = a.uniforms;
        I2.scale.value = y, I2.screenPosition.value = e, w.renderBufferDirect(T, null, r, a, c, null), w.copyFramebufferToTexture(g2, s), I2 = l.uniforms, I2.scale.value = y, I2.screenPosition.value = e, w.renderBufferDirect(T, null, r, l, c, null);
        const R = -e.x * 2, z = -e.y * 2;
        for (let k = 0, G2 = u.length; k < G2; k++) {
          const U = u[k], q = f.uniforms;
          q.color.value.copy(U.color), q.map.value = U.texture, q.screenPosition.value.x = e.x + R * U.distance, q.screenPosition.value.y = e.y + z * U.distance, _2 = U.size / d.w;
          const $2 = d.w / d.z;
          q.scale.value.set(_2 * $2, _2), f.uniformsNeedUpdate = true, w.renderBufferDirect(T, null, r, f, p, null);
        }
      }
    }, this.dispose = function() {
      a.dispose(), l.dispose(), f.dispose(), n.dispose(), s.dispose();
      for (let w = 0, x2 = u.length; w < x2; w++)
        u[w].texture.dispose();
    };
  }
}
class $a {
  constructor(e, t = 1, n = 0, s = new Color(16777215)) {
    this.texture = e, this.size = t, this.distance = n, this.color = s;
  }
}
$a.Shader = {
  name: "LensflareElementShader",
  uniforms: {
    map: { value: null },
    occlusionMap: { value: null },
    color: { value: null },
    scale: { value: null },
    screenPosition: { value: null }
  },
  vertexShader: (
    /* glsl */
    `

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`
  )
};
bs.Geometry = (function() {
  const o = new BufferGeometry(), e = new Float32Array([
    -1,
    -1,
    0,
    0,
    0,
    1,
    -1,
    0,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    -1,
    1,
    0,
    0,
    1
  ]), t = new InterleavedBuffer(e, 5);
  return o.setIndex([0, 1, 2, 0, 2, 3]), o.setAttribute("position", new InterleavedBufferAttribute(t, 3, 0, false)), o.setAttribute("uv", new InterleavedBufferAttribute(t, 2, 3, false)), o;
})();
MathUtils.clamp;
MathUtils.lerp;
const Mf = ["target", "auto-rotate", "auto-rotate-speed", "enable-damping", "damping-factor", "enable-pan", "key-pan-speed", "keys", "max-azimuth-angle", "min-azimuth-angle", "max-polar-angle", "min-polar-angle", "min-distance", "max-distance", "min-zoom", "max-zoom", "touches", "enable-zoom", "zoom-speed", "enable-rotate", "rotate-speed", "args"], xg = /* @__PURE__ */ defineComponent({
  __name: "OrbitControls",
  props: {
    makeDefault: { type: Boolean, default: false },
    camera: {},
    domElement: {},
    target: { default: () => [0, 0, 0] },
    enableDamping: { type: Boolean, default: true },
    dampingFactor: { default: 0.05 },
    autoRotate: { type: Boolean, default: false },
    autoRotateSpeed: { default: 2 },
    enablePan: { type: Boolean, default: true },
    keyPanSpeed: { default: 7 },
    keys: {},
    maxAzimuthAngle: { default: Number.POSITIVE_INFINITY },
    minAzimuthAngle: { default: Number.NEGATIVE_INFINITY },
    maxPolarAngle: { default: Math.PI },
    minPolarAngle: { default: 0 },
    minDistance: { default: 0 },
    maxDistance: { default: Number.POSITIVE_INFINITY },
    minZoom: { default: 0 },
    maxZoom: { default: Number.POSITIVE_INFINITY },
    touches: { default: () => ({ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }) },
    enableZoom: { type: Boolean, default: true },
    zoomSpeed: { default: 1 },
    enableRotate: { type: Boolean, default: true },
    rotateSpeed: { default: 1 }
  },
  emits: ["change", "start", "end"],
  setup(o, { expose: e, emit: t }) {
    const n = o, s = t, {
      makeDefault: i,
      autoRotate: r,
      autoRotateSpeed: a,
      enableDamping: l,
      dampingFactor: c,
      enablePan: u,
      keyPanSpeed: h2,
      maxAzimuthAngle: f,
      minAzimuthAngle: p,
      maxPolarAngle: y,
      minPolarAngle: g2,
      minDistance: v2,
      maxDistance: d,
      minZoom: w,
      maxZoom: x2,
      enableZoom: T,
      zoomSpeed: P2,
      enableRotate: S,
      touches: M2,
      rotateSpeed: m2,
      target: b
    } = toRefs(n), { camera: _2, renderer: I2, extend: R, controls: z } = dr(), k = ref(null);
    R({ OrbitControls: ka }), watch(k, (q) => {
      G2(), q && i.value ? z.value = q : z.value = null;
    });
    function G2() {
      Ye(k.value, "change", () => s("change", k.value)), Ye(k.value, "start", () => s("start", k.value)), Ye(k.value, "end", () => s("end", k.value));
    }
    const { onLoop: U } = G$1();
    return U(() => {
      k.value && (l.value || r.value) && k.value.update();
    }), e({ value: k }), (q, $2) => (q.camera || unref(_2)) && (q.domElement || unref(I2)) ? (openBlock(), createElementBlock("TresOrbitControls", {
      key: 0,
      ref_key: "controlsRef",
      ref: k,
      target: unref(b),
      "auto-rotate": unref(r),
      "auto-rotate-speed": unref(a),
      "enable-damping": unref(l),
      "damping-factor": unref(c),
      "enable-pan": unref(u),
      "key-pan-speed": unref(h2),
      keys: q.keys,
      "max-azimuth-angle": unref(f),
      "min-azimuth-angle": unref(p),
      "max-polar-angle": unref(y),
      "min-polar-angle": unref(g2),
      "min-distance": unref(v2),
      "max-distance": unref(d),
      "min-zoom": unref(w),
      "max-zoom": unref(x2),
      touches: unref(M2),
      "enable-zoom": unref(T),
      "zoom-speed": unref(P2),
      "enable-rotate": unref(S),
      "rotate-speed": unref(m2),
      args: [q.camera || unref(_2), q.domElement || unref(I2).domElement]
    }, null, 8, Mf)) : createCommentVNode("", true);
  }
});
var Bi;
/Mac/.test((Bi = globalThis == null ? void 0 : globalThis.navigator) === null || Bi === void 0 ? void 0 : Bi.platform);
var Yf = typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Is(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function Qs(o) {
  throw new Error('Could not dynamically require "' + o + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var il = { exports: {} };
(function(o, e) {
  (function(t) {
    o.exports = t();
  })(function() {
    return (function t(n, s, i) {
      function r(c, u) {
        if (!s[c]) {
          if (!n[c]) {
            var h2 = typeof Qs == "function" && Qs;
            if (!u && h2)
              return h2(c, true);
            if (a)
              return a(c, true);
            throw new Error("Cannot find module '" + c + "'");
          }
          u = s[c] = { exports: {} }, n[c][0].call(u.exports, function(f) {
            var p = n[c][1][f];
            return r(p || f);
          }, u, u.exports, t, n, s, i);
        }
        return s[c].exports;
      }
      for (var a = typeof Qs == "function" && Qs, l = 0; l < i.length; l++)
        r(i[l]);
      return r;
    })({ 1: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        var y = t("crypto");
        function g2(S, M2) {
          M2 = w(S, M2);
          var m2;
          return (m2 = M2.algorithm !== "passthrough" ? y.createHash(M2.algorithm) : new P2()).write === void 0 && (m2.write = m2.update, m2.end = m2.update), T(M2, m2).dispatch(S), m2.update || m2.end(""), m2.digest ? m2.digest(M2.encoding === "buffer" ? void 0 : M2.encoding) : (S = m2.read(), M2.encoding !== "buffer" ? S.toString(M2.encoding) : S);
        }
        (s = n.exports = g2).sha1 = function(S) {
          return g2(S);
        }, s.keys = function(S) {
          return g2(S, { excludeValues: true, algorithm: "sha1", encoding: "hex" });
        }, s.MD5 = function(S) {
          return g2(S, { algorithm: "md5", encoding: "hex" });
        }, s.keysMD5 = function(S) {
          return g2(S, { algorithm: "md5", encoding: "hex", excludeValues: true });
        };
        var v2 = y.getHashes ? y.getHashes().slice() : ["sha1", "md5"], d = (v2.push("passthrough"), ["buffer", "hex", "binary", "base64"]);
        function w(S, M2) {
          var m2 = {};
          if (m2.algorithm = (M2 = M2 || {}).algorithm || "sha1", m2.encoding = M2.encoding || "hex", m2.excludeValues = !!M2.excludeValues, m2.algorithm = m2.algorithm.toLowerCase(), m2.encoding = m2.encoding.toLowerCase(), m2.ignoreUnknown = M2.ignoreUnknown === true, m2.respectType = M2.respectType !== false, m2.respectFunctionNames = M2.respectFunctionNames !== false, m2.respectFunctionProperties = M2.respectFunctionProperties !== false, m2.unorderedArrays = M2.unorderedArrays === true, m2.unorderedSets = M2.unorderedSets !== false, m2.unorderedObjects = M2.unorderedObjects !== false, m2.replacer = M2.replacer || void 0, m2.excludeKeys = M2.excludeKeys || void 0, S === void 0)
            throw new Error("Object argument required.");
          for (var b = 0; b < v2.length; ++b)
            v2[b].toLowerCase() === m2.algorithm.toLowerCase() && (m2.algorithm = v2[b]);
          if (v2.indexOf(m2.algorithm) === -1)
            throw new Error('Algorithm "' + m2.algorithm + '"  not supported. supported values: ' + v2.join(", "));
          if (d.indexOf(m2.encoding) === -1 && m2.algorithm !== "passthrough")
            throw new Error('Encoding "' + m2.encoding + '"  not supported. supported values: ' + d.join(", "));
          return m2;
        }
        function x2(S) {
          if (typeof S == "function")
            return /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(S)) != null;
        }
        function T(S, M2, m2) {
          m2 = m2 || [];
          function b(_2) {
            return M2.update ? M2.update(_2, "utf8") : M2.write(_2, "utf8");
          }
          return { dispatch: function(_2) {
            return this["_" + ((_2 = S.replacer ? S.replacer(_2) : _2) === null ? "null" : typeof _2)](_2);
          }, _object: function(_2) {
            var I2, R = Object.prototype.toString.call(_2), z = /\[object (.*)\]/i.exec(R);
            if (z = (z = z ? z[1] : "unknown:[" + R + "]").toLowerCase(), 0 <= (R = m2.indexOf(_2)))
              return this.dispatch("[CIRCULAR:" + R + "]");
            if (m2.push(_2), a !== void 0 && a.isBuffer && a.isBuffer(_2))
              return b("buffer:"), b(_2);
            if (z === "object" || z === "function" || z === "asyncfunction")
              return R = Object.keys(_2), S.unorderedObjects && (R = R.sort()), S.respectType === false || x2(_2) || R.splice(0, 0, "prototype", "__proto__", "constructor"), S.excludeKeys && (R = R.filter(function(k) {
                return !S.excludeKeys(k);
              })), b("object:" + R.length + ":"), I2 = this, R.forEach(function(k) {
                I2.dispatch(k), b(":"), S.excludeValues || I2.dispatch(_2[k]), b(",");
              });
            if (!this["_" + z]) {
              if (S.ignoreUnknown)
                return b("[" + z + "]");
              throw new Error('Unknown object type "' + z + '"');
            }
            this["_" + z](_2);
          }, _array: function(_2, k) {
            k = k !== void 0 ? k : S.unorderedArrays !== false;
            var R = this;
            if (b("array:" + _2.length + ":"), !k || _2.length <= 1)
              return _2.forEach(function(G2) {
                return R.dispatch(G2);
              });
            var z = [], k = _2.map(function(G2) {
              var U = new P2(), q = m2.slice();
              return T(S, U, q).dispatch(G2), z = z.concat(q.slice(m2.length)), U.read().toString();
            });
            return m2 = m2.concat(z), k.sort(), this._array(k, false);
          }, _date: function(_2) {
            return b("date:" + _2.toJSON());
          }, _symbol: function(_2) {
            return b("symbol:" + _2.toString());
          }, _error: function(_2) {
            return b("error:" + _2.toString());
          }, _boolean: function(_2) {
            return b("bool:" + _2.toString());
          }, _string: function(_2) {
            b("string:" + _2.length + ":"), b(_2.toString());
          }, _function: function(_2) {
            b("fn:"), x2(_2) ? this.dispatch("[native]") : this.dispatch(_2.toString()), S.respectFunctionNames !== false && this.dispatch("function-name:" + String(_2.name)), S.respectFunctionProperties && this._object(_2);
          }, _number: function(_2) {
            return b("number:" + _2.toString());
          }, _xml: function(_2) {
            return b("xml:" + _2.toString());
          }, _null: function() {
            return b("Null");
          }, _undefined: function() {
            return b("Undefined");
          }, _regexp: function(_2) {
            return b("regex:" + _2.toString());
          }, _uint8array: function(_2) {
            return b("uint8array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _uint8clampedarray: function(_2) {
            return b("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _int8array: function(_2) {
            return b("int8array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _uint16array: function(_2) {
            return b("uint16array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _int16array: function(_2) {
            return b("int16array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _uint32array: function(_2) {
            return b("uint32array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _int32array: function(_2) {
            return b("int32array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _float32array: function(_2) {
            return b("float32array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _float64array: function(_2) {
            return b("float64array:"), this.dispatch(Array.prototype.slice.call(_2));
          }, _arraybuffer: function(_2) {
            return b("arraybuffer:"), this.dispatch(new Uint8Array(_2));
          }, _url: function(_2) {
            return b("url:" + _2.toString());
          }, _map: function(_2) {
            return b("map:"), _2 = Array.from(_2), this._array(_2, S.unorderedSets !== false);
          }, _set: function(_2) {
            return b("set:"), _2 = Array.from(_2), this._array(_2, S.unorderedSets !== false);
          }, _file: function(_2) {
            return b("file:"), this.dispatch([_2.name, _2.size, _2.type, _2.lastModfied]);
          }, _blob: function() {
            if (S.ignoreUnknown)
              return b("[blob]");
            throw Error(`Hashing Blob objects is currently not supported
(see https://github.com/puleos/object-hash/issues/26)
Use "options.replacer" or "options.ignoreUnknown"
`);
          }, _domwindow: function() {
            return b("domwindow");
          }, _bigint: function(_2) {
            return b("bigint:" + _2.toString());
          }, _process: function() {
            return b("process");
          }, _timer: function() {
            return b("timer");
          }, _pipe: function() {
            return b("pipe");
          }, _tcp: function() {
            return b("tcp");
          }, _udp: function() {
            return b("udp");
          }, _tty: function() {
            return b("tty");
          }, _statwatcher: function() {
            return b("statwatcher");
          }, _securecontext: function() {
            return b("securecontext");
          }, _connection: function() {
            return b("connection");
          }, _zlib: function() {
            return b("zlib");
          }, _context: function() {
            return b("context");
          }, _nodescript: function() {
            return b("nodescript");
          }, _httpparser: function() {
            return b("httpparser");
          }, _dataview: function() {
            return b("dataview");
          }, _signal: function() {
            return b("signal");
          }, _fsevent: function() {
            return b("fsevent");
          }, _tlswrap: function() {
            return b("tlswrap");
          } };
        }
        function P2() {
          return { buf: "", write: function(S) {
            this.buf += S;
          }, end: function(S) {
            this.buf += S;
          }, read: function() {
            return this.buf;
          } };
        }
        s.writeToStream = function(S, M2, m2) {
          return m2 === void 0 && (m2 = M2, M2 = {}), T(M2 = w(S, M2), m2).dispatch(S);
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_9a5aa49d.js", "/");
    }, { buffer: 3, crypto: 5, lYpoI2: 11 }], 2: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        (function(y) {
          var g2 = typeof Uint8Array < "u" ? Uint8Array : Array, v2 = 43, d = 47, w = 48, x2 = 97, T = 65, P2 = 45, S = 95;
          function M2(m2) {
            return m2 = m2.charCodeAt(0), m2 === v2 || m2 === P2 ? 62 : m2 === d || m2 === S ? 63 : m2 < w ? -1 : m2 < w + 10 ? m2 - w + 26 + 26 : m2 < T + 26 ? m2 - T : m2 < x2 + 26 ? m2 - x2 + 26 : void 0;
          }
          y.toByteArray = function(m2) {
            var b, _2;
            if (0 < m2.length % 4)
              throw new Error("Invalid string. Length must be a multiple of 4");
            var I2 = m2.length, I2 = m2.charAt(I2 - 2) === "=" ? 2 : m2.charAt(I2 - 1) === "=" ? 1 : 0, R = new g2(3 * m2.length / 4 - I2), z = 0 < I2 ? m2.length - 4 : m2.length, k = 0;
            function G2(U) {
              R[k++] = U;
            }
            for (b = 0; b < z; b += 4, 0)
              G2((16711680 & (_2 = M2(m2.charAt(b)) << 18 | M2(m2.charAt(b + 1)) << 12 | M2(m2.charAt(b + 2)) << 6 | M2(m2.charAt(b + 3)))) >> 16), G2((65280 & _2) >> 8), G2(255 & _2);
            return I2 == 2 ? G2(255 & (_2 = M2(m2.charAt(b)) << 2 | M2(m2.charAt(b + 1)) >> 4)) : I2 == 1 && (G2((_2 = M2(m2.charAt(b)) << 10 | M2(m2.charAt(b + 1)) << 4 | M2(m2.charAt(b + 2)) >> 2) >> 8 & 255), G2(255 & _2)), R;
          }, y.fromByteArray = function(m2) {
            var b, _2, I2, R, z = m2.length % 3, k = "";
            function G2(U) {
              return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(U);
            }
            for (b = 0, I2 = m2.length - z; b < I2; b += 3)
              _2 = (m2[b] << 16) + (m2[b + 1] << 8) + m2[b + 2], k += G2((R = _2) >> 18 & 63) + G2(R >> 12 & 63) + G2(R >> 6 & 63) + G2(63 & R);
            switch (z) {
              case 1:
                k = (k += G2((_2 = m2[m2.length - 1]) >> 2)) + G2(_2 << 4 & 63) + "==";
                break;
              case 2:
                k = (k = (k += G2((_2 = (m2[m2.length - 2] << 8) + m2[m2.length - 1]) >> 10)) + G2(_2 >> 4 & 63)) + G2(_2 << 2 & 63) + "=";
            }
            return k;
          };
        })(s === void 0 ? this.base64js = {} : s);
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
    }, { buffer: 3, lYpoI2: 11 }], 3: [function(t, n, s) {
      (function(i, r, v2, l, c, u, h2, f, p) {
        var y = t("base64-js"), g2 = t("ieee754");
        function v2(E2, A2, D) {
          if (!(this instanceof v2))
            return new v2(E2, A2, D);
          var W2, Y, j2, J2, ne = typeof E2;
          if (A2 === "base64" && ne == "string")
            for (E2 = (J2 = E2).trim ? J2.trim() : J2.replace(/^\s+|\s+$/g, ""); E2.length % 4 != 0; )
              E2 += "=";
          if (ne == "number")
            W2 = $2(E2);
          else if (ne == "string")
            W2 = v2.byteLength(E2, A2);
          else {
            if (ne != "object")
              throw new Error("First argument needs to be a number, array or string.");
            W2 = $2(E2.length);
          }
          if (v2._useTypedArrays ? Y = v2._augment(new Uint8Array(W2)) : ((Y = this).length = W2, Y._isBuffer = true), v2._useTypedArrays && typeof E2.byteLength == "number")
            Y._set(E2);
          else if (te(J2 = E2) || v2.isBuffer(J2) || J2 && typeof J2 == "object" && typeof J2.length == "number")
            for (j2 = 0; j2 < W2; j2++)
              v2.isBuffer(E2) ? Y[j2] = E2.readUInt8(j2) : Y[j2] = E2[j2];
          else if (ne == "string")
            Y.write(E2, 0, A2);
          else if (ne == "number" && !v2._useTypedArrays && !D)
            for (j2 = 0; j2 < W2; j2++)
              Y[j2] = 0;
          return Y;
        }
        function d(E2, A2, D, W2) {
          return v2._charsWritten = xe((function(Y) {
            for (var j2 = [], J2 = 0; J2 < Y.length; J2++)
              j2.push(255 & Y.charCodeAt(J2));
            return j2;
          })(A2), E2, D, W2);
        }
        function w(E2, A2, D, W2) {
          return v2._charsWritten = xe((function(Y) {
            for (var j2, J2, ne = [], se = 0; se < Y.length; se++)
              J2 = Y.charCodeAt(se), j2 = J2 >> 8, J2 = J2 % 256, ne.push(J2), ne.push(j2);
            return ne;
          })(A2), E2, D, W2);
        }
        function x2(E2, A2, D) {
          var W2 = "";
          D = Math.min(E2.length, D);
          for (var Y = A2; Y < D; Y++)
            W2 += String.fromCharCode(E2[Y]);
          return W2;
        }
        function T(E2, A2, D, j2) {
          j2 || (N(typeof D == "boolean", "missing or invalid endian"), N(A2 != null, "missing offset"), N(A2 + 1 < E2.length, "Trying to read beyond buffer length"));
          var Y, j2 = E2.length;
          if (!(j2 <= A2))
            return D ? (Y = E2[A2], A2 + 1 < j2 && (Y |= E2[A2 + 1] << 8)) : (Y = E2[A2] << 8, A2 + 1 < j2 && (Y |= E2[A2 + 1])), Y;
        }
        function P2(E2, A2, D, j2) {
          j2 || (N(typeof D == "boolean", "missing or invalid endian"), N(A2 != null, "missing offset"), N(A2 + 3 < E2.length, "Trying to read beyond buffer length"));
          var Y, j2 = E2.length;
          if (!(j2 <= A2))
            return D ? (A2 + 2 < j2 && (Y = E2[A2 + 2] << 16), A2 + 1 < j2 && (Y |= E2[A2 + 1] << 8), Y |= E2[A2], A2 + 3 < j2 && (Y += E2[A2 + 3] << 24 >>> 0)) : (A2 + 1 < j2 && (Y = E2[A2 + 1] << 16), A2 + 2 < j2 && (Y |= E2[A2 + 2] << 8), A2 + 3 < j2 && (Y |= E2[A2 + 3]), Y += E2[A2] << 24 >>> 0), Y;
        }
        function S(E2, A2, D, W2) {
          if (W2 || (N(typeof D == "boolean", "missing or invalid endian"), N(A2 != null, "missing offset"), N(A2 + 1 < E2.length, "Trying to read beyond buffer length")), !(E2.length <= A2))
            return W2 = T(E2, A2, D, true), 32768 & W2 ? -1 * (65535 - W2 + 1) : W2;
        }
        function M2(E2, A2, D, W2) {
          if (W2 || (N(typeof D == "boolean", "missing or invalid endian"), N(A2 != null, "missing offset"), N(A2 + 3 < E2.length, "Trying to read beyond buffer length")), !(E2.length <= A2))
            return W2 = P2(E2, A2, D, true), 2147483648 & W2 ? -1 * (4294967295 - W2 + 1) : W2;
        }
        function m2(E2, A2, D, W2) {
          return W2 || (N(typeof D == "boolean", "missing or invalid endian"), N(A2 + 3 < E2.length, "Trying to read beyond buffer length")), g2.read(E2, A2, D, 23, 4);
        }
        function b(E2, A2, D, W2) {
          return W2 || (N(typeof D == "boolean", "missing or invalid endian"), N(A2 + 7 < E2.length, "Trying to read beyond buffer length")), g2.read(E2, A2, D, 52, 8);
        }
        function _2(E2, A2, D, W2, Y) {
          if (Y || (N(A2 != null, "missing value"), N(typeof W2 == "boolean", "missing or invalid endian"), N(D != null, "missing offset"), N(D + 1 < E2.length, "trying to write beyond buffer length"), B(A2, 65535)), Y = E2.length, !(Y <= D))
            for (var j2 = 0, J2 = Math.min(Y - D, 2); j2 < J2; j2++)
              E2[D + j2] = (A2 & 255 << 8 * (W2 ? j2 : 1 - j2)) >>> 8 * (W2 ? j2 : 1 - j2);
        }
        function I2(E2, A2, D, W2, Y) {
          if (Y || (N(A2 != null, "missing value"), N(typeof W2 == "boolean", "missing or invalid endian"), N(D != null, "missing offset"), N(D + 3 < E2.length, "trying to write beyond buffer length"), B(A2, 4294967295)), Y = E2.length, !(Y <= D))
            for (var j2 = 0, J2 = Math.min(Y - D, 4); j2 < J2; j2++)
              E2[D + j2] = A2 >>> 8 * (W2 ? j2 : 3 - j2) & 255;
        }
        function R(E2, A2, D, W2, Y) {
          Y || (N(A2 != null, "missing value"), N(typeof W2 == "boolean", "missing or invalid endian"), N(D != null, "missing offset"), N(D + 1 < E2.length, "Trying to write beyond buffer length"), L(A2, 32767, -32768)), E2.length <= D || _2(E2, 0 <= A2 ? A2 : 65535 + A2 + 1, D, W2, Y);
        }
        function z(E2, A2, D, W2, Y) {
          Y || (N(A2 != null, "missing value"), N(typeof W2 == "boolean", "missing or invalid endian"), N(D != null, "missing offset"), N(D + 3 < E2.length, "Trying to write beyond buffer length"), L(A2, 2147483647, -2147483648)), E2.length <= D || I2(E2, 0 <= A2 ? A2 : 4294967295 + A2 + 1, D, W2, Y);
        }
        function k(E2, A2, D, W2, Y) {
          Y || (N(A2 != null, "missing value"), N(typeof W2 == "boolean", "missing or invalid endian"), N(D != null, "missing offset"), N(D + 3 < E2.length, "Trying to write beyond buffer length"), O(A2, 34028234663852886e22, -34028234663852886e22)), E2.length <= D || g2.write(E2, A2, D, W2, 23, 4);
        }
        function G2(E2, A2, D, W2, Y) {
          Y || (N(A2 != null, "missing value"), N(typeof W2 == "boolean", "missing or invalid endian"), N(D != null, "missing offset"), N(D + 7 < E2.length, "Trying to write beyond buffer length"), O(A2, 17976931348623157e292, -17976931348623157e292)), E2.length <= D || g2.write(E2, A2, D, W2, 52, 8);
        }
        s.Buffer = v2, s.SlowBuffer = v2, s.INSPECT_MAX_BYTES = 50, v2.poolSize = 8192, v2._useTypedArrays = (function() {
          try {
            var E2 = new ArrayBuffer(0), A2 = new Uint8Array(E2);
            return A2.foo = function() {
              return 42;
            }, A2.foo() === 42 && typeof A2.subarray == "function";
          } catch {
            return false;
          }
        })(), v2.isEncoding = function(E2) {
          switch (String(E2).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "raw":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        }, v2.isBuffer = function(E2) {
          return !(E2 == null || !E2._isBuffer);
        }, v2.byteLength = function(E2, A2) {
          var D;
          switch (E2 += "", A2 || "utf8") {
            case "hex":
              D = E2.length / 2;
              break;
            case "utf8":
            case "utf-8":
              D = oe2(E2).length;
              break;
            case "ascii":
            case "binary":
            case "raw":
              D = E2.length;
              break;
            case "base64":
              D = de2(E2).length;
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              D = 2 * E2.length;
              break;
            default:
              throw new Error("Unknown encoding");
          }
          return D;
        }, v2.concat = function(E2, A2) {
          if (N(te(E2), `Usage: Buffer.concat(list, [totalLength])
list should be an Array.`), E2.length === 0)
            return new v2(0);
          if (E2.length === 1)
            return E2[0];
          if (typeof A2 != "number")
            for (Y = A2 = 0; Y < E2.length; Y++)
              A2 += E2[Y].length;
          for (var D = new v2(A2), W2 = 0, Y = 0; Y < E2.length; Y++) {
            var j2 = E2[Y];
            j2.copy(D, W2), W2 += j2.length;
          }
          return D;
        }, v2.prototype.write = function(E2, A2, D, W2) {
          isFinite(A2) ? isFinite(D) || (W2 = D, D = void 0) : (se = W2, W2 = A2, A2 = D, D = se), A2 = Number(A2) || 0;
          var Y, j2, J2, ne, se = this.length - A2;
          switch ((!D || se < (D = Number(D))) && (D = se), W2 = String(W2 || "utf8").toLowerCase()) {
            case "hex":
              Y = (function(V2, F2, re2, fe2) {
                re2 = Number(re2) || 0;
                var Me = V2.length - re2;
                (!fe2 || Me < (fe2 = Number(fe2))) && (fe2 = Me), N((Me = F2.length) % 2 == 0, "Invalid hex string"), Me / 2 < fe2 && (fe2 = Me / 2);
                for (var Xe = 0; Xe < fe2; Xe++) {
                  var je = parseInt(F2.substr(2 * Xe, 2), 16);
                  N(!isNaN(je), "Invalid hex string"), V2[re2 + Xe] = je;
                }
                return v2._charsWritten = 2 * Xe, Xe;
              })(this, E2, A2, D);
              break;
            case "utf8":
            case "utf-8":
              j2 = this, J2 = A2, ne = D, Y = v2._charsWritten = xe(oe2(E2), j2, J2, ne);
              break;
            case "ascii":
            case "binary":
              Y = d(this, E2, A2, D);
              break;
            case "base64":
              j2 = this, J2 = A2, ne = D, Y = v2._charsWritten = xe(de2(E2), j2, J2, ne);
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              Y = w(this, E2, A2, D);
              break;
            default:
              throw new Error("Unknown encoding");
          }
          return Y;
        }, v2.prototype.toString = function(E2, A2, D) {
          var W2, Y, j2, J2, ne = this;
          if (E2 = String(E2 || "utf8").toLowerCase(), A2 = Number(A2) || 0, (D = D !== void 0 ? Number(D) : ne.length) === A2)
            return "";
          switch (E2) {
            case "hex":
              W2 = (function(se, V2, F2) {
                var re2 = se.length;
                (!V2 || V2 < 0) && (V2 = 0), (!F2 || F2 < 0 || re2 < F2) && (F2 = re2);
                for (var fe2 = "", Me = V2; Me < F2; Me++)
                  fe2 += ee2(se[Me]);
                return fe2;
              })(ne, A2, D);
              break;
            case "utf8":
            case "utf-8":
              W2 = (function(se, V2, F2) {
                var re2 = "", fe2 = "";
                F2 = Math.min(se.length, F2);
                for (var Me = V2; Me < F2; Me++)
                  se[Me] <= 127 ? (re2 += C(fe2) + String.fromCharCode(se[Me]), fe2 = "") : fe2 += "%" + se[Me].toString(16);
                return re2 + C(fe2);
              })(ne, A2, D);
              break;
            case "ascii":
            case "binary":
              W2 = x2(ne, A2, D);
              break;
            case "base64":
              Y = ne, J2 = D, W2 = (j2 = A2) === 0 && J2 === Y.length ? y.fromByteArray(Y) : y.fromByteArray(Y.slice(j2, J2));
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              W2 = (function(se, V2, F2) {
                for (var re2 = se.slice(V2, F2), fe2 = "", Me = 0; Me < re2.length; Me += 2)
                  fe2 += String.fromCharCode(re2[Me] + 256 * re2[Me + 1]);
                return fe2;
              })(ne, A2, D);
              break;
            default:
              throw new Error("Unknown encoding");
          }
          return W2;
        }, v2.prototype.toJSON = function() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        }, v2.prototype.copy = function(E2, A2, D, W2) {
          if (A2 = A2 || 0, (W2 = W2 || W2 === 0 ? W2 : this.length) !== (D = D || 0) && E2.length !== 0 && this.length !== 0) {
            N(D <= W2, "sourceEnd < sourceStart"), N(0 <= A2 && A2 < E2.length, "targetStart out of bounds"), N(0 <= D && D < this.length, "sourceStart out of bounds"), N(0 <= W2 && W2 <= this.length, "sourceEnd out of bounds"), W2 > this.length && (W2 = this.length);
            var Y = (W2 = E2.length - A2 < W2 - D ? E2.length - A2 + D : W2) - D;
            if (Y < 100 || !v2._useTypedArrays)
              for (var j2 = 0; j2 < Y; j2++)
                E2[j2 + A2] = this[j2 + D];
            else
              E2._set(this.subarray(D, D + Y), A2);
          }
        }, v2.prototype.slice = function(E2, A2) {
          var D = this.length;
          if (E2 = q(E2, D, 0), A2 = q(A2, D, D), v2._useTypedArrays)
            return v2._augment(this.subarray(E2, A2));
          for (var W2 = A2 - E2, Y = new v2(W2, void 0, true), j2 = 0; j2 < W2; j2++)
            Y[j2] = this[j2 + E2];
          return Y;
        }, v2.prototype.get = function(E2) {
          return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(E2);
        }, v2.prototype.set = function(E2, A2) {
          return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(E2, A2);
        }, v2.prototype.readUInt8 = function(E2, A2) {
          if (A2 || (N(E2 != null, "missing offset"), N(E2 < this.length, "Trying to read beyond buffer length")), !(E2 >= this.length))
            return this[E2];
        }, v2.prototype.readUInt16LE = function(E2, A2) {
          return T(this, E2, true, A2);
        }, v2.prototype.readUInt16BE = function(E2, A2) {
          return T(this, E2, false, A2);
        }, v2.prototype.readUInt32LE = function(E2, A2) {
          return P2(this, E2, true, A2);
        }, v2.prototype.readUInt32BE = function(E2, A2) {
          return P2(this, E2, false, A2);
        }, v2.prototype.readInt8 = function(E2, A2) {
          if (A2 || (N(E2 != null, "missing offset"), N(E2 < this.length, "Trying to read beyond buffer length")), !(E2 >= this.length))
            return 128 & this[E2] ? -1 * (255 - this[E2] + 1) : this[E2];
        }, v2.prototype.readInt16LE = function(E2, A2) {
          return S(this, E2, true, A2);
        }, v2.prototype.readInt16BE = function(E2, A2) {
          return S(this, E2, false, A2);
        }, v2.prototype.readInt32LE = function(E2, A2) {
          return M2(this, E2, true, A2);
        }, v2.prototype.readInt32BE = function(E2, A2) {
          return M2(this, E2, false, A2);
        }, v2.prototype.readFloatLE = function(E2, A2) {
          return m2(this, E2, true, A2);
        }, v2.prototype.readFloatBE = function(E2, A2) {
          return m2(this, E2, false, A2);
        }, v2.prototype.readDoubleLE = function(E2, A2) {
          return b(this, E2, true, A2);
        }, v2.prototype.readDoubleBE = function(E2, A2) {
          return b(this, E2, false, A2);
        }, v2.prototype.writeUInt8 = function(E2, A2, D) {
          D || (N(E2 != null, "missing value"), N(A2 != null, "missing offset"), N(A2 < this.length, "trying to write beyond buffer length"), B(E2, 255)), A2 >= this.length || (this[A2] = E2);
        }, v2.prototype.writeUInt16LE = function(E2, A2, D) {
          _2(this, E2, A2, true, D);
        }, v2.prototype.writeUInt16BE = function(E2, A2, D) {
          _2(this, E2, A2, false, D);
        }, v2.prototype.writeUInt32LE = function(E2, A2, D) {
          I2(this, E2, A2, true, D);
        }, v2.prototype.writeUInt32BE = function(E2, A2, D) {
          I2(this, E2, A2, false, D);
        }, v2.prototype.writeInt8 = function(E2, A2, D) {
          D || (N(E2 != null, "missing value"), N(A2 != null, "missing offset"), N(A2 < this.length, "Trying to write beyond buffer length"), L(E2, 127, -128)), A2 >= this.length || (0 <= E2 ? this.writeUInt8(E2, A2, D) : this.writeUInt8(255 + E2 + 1, A2, D));
        }, v2.prototype.writeInt16LE = function(E2, A2, D) {
          R(this, E2, A2, true, D);
        }, v2.prototype.writeInt16BE = function(E2, A2, D) {
          R(this, E2, A2, false, D);
        }, v2.prototype.writeInt32LE = function(E2, A2, D) {
          z(this, E2, A2, true, D);
        }, v2.prototype.writeInt32BE = function(E2, A2, D) {
          z(this, E2, A2, false, D);
        }, v2.prototype.writeFloatLE = function(E2, A2, D) {
          k(this, E2, A2, true, D);
        }, v2.prototype.writeFloatBE = function(E2, A2, D) {
          k(this, E2, A2, false, D);
        }, v2.prototype.writeDoubleLE = function(E2, A2, D) {
          G2(this, E2, A2, true, D);
        }, v2.prototype.writeDoubleBE = function(E2, A2, D) {
          G2(this, E2, A2, false, D);
        }, v2.prototype.fill = function(E2, A2, D) {
          if (A2 = A2 || 0, D = D || this.length, N(typeof (E2 = typeof (E2 = E2 || 0) == "string" ? E2.charCodeAt(0) : E2) == "number" && !isNaN(E2), "value is not a number"), N(A2 <= D, "end < start"), D !== A2 && this.length !== 0) {
            N(0 <= A2 && A2 < this.length, "start out of bounds"), N(0 <= D && D <= this.length, "end out of bounds");
            for (var W2 = A2; W2 < D; W2++)
              this[W2] = E2;
          }
        }, v2.prototype.inspect = function() {
          for (var E2 = [], A2 = this.length, D = 0; D < A2; D++)
            if (E2[D] = ee2(this[D]), D === s.INSPECT_MAX_BYTES) {
              E2[D + 1] = "...";
              break;
            }
          return "<Buffer " + E2.join(" ") + ">";
        }, v2.prototype.toArrayBuffer = function() {
          if (typeof Uint8Array > "u")
            throw new Error("Buffer.toArrayBuffer not supported in this browser");
          if (v2._useTypedArrays)
            return new v2(this).buffer;
          for (var E2 = new Uint8Array(this.length), A2 = 0, D = E2.length; A2 < D; A2 += 1)
            E2[A2] = this[A2];
          return E2.buffer;
        };
        var U = v2.prototype;
        function q(E2, A2, D) {
          return typeof E2 != "number" ? D : A2 <= (E2 = ~~E2) ? A2 : 0 <= E2 || 0 <= (E2 += A2) ? E2 : 0;
        }
        function $2(E2) {
          return (E2 = ~~Math.ceil(+E2)) < 0 ? 0 : E2;
        }
        function te(E2) {
          return (Array.isArray || function(A2) {
            return Object.prototype.toString.call(A2) === "[object Array]";
          })(E2);
        }
        function ee2(E2) {
          return E2 < 16 ? "0" + E2.toString(16) : E2.toString(16);
        }
        function oe2(E2) {
          for (var A2 = [], D = 0; D < E2.length; D++) {
            var W2 = E2.charCodeAt(D);
            if (W2 <= 127)
              A2.push(E2.charCodeAt(D));
            else
              for (var Y = D, j2 = (55296 <= W2 && W2 <= 57343 && D++, encodeURIComponent(E2.slice(Y, D + 1)).substr(1).split("%")), J2 = 0; J2 < j2.length; J2++)
                A2.push(parseInt(j2[J2], 16));
          }
          return A2;
        }
        function de2(E2) {
          return y.toByteArray(E2);
        }
        function xe(E2, A2, D, W2) {
          for (var Y = 0; Y < W2 && !(Y + D >= A2.length || Y >= E2.length); Y++)
            A2[Y + D] = E2[Y];
          return Y;
        }
        function C(E2) {
          try {
            return decodeURIComponent(E2);
          } catch {
            return "�";
          }
        }
        function B(E2, A2) {
          N(typeof E2 == "number", "cannot write a non-number as a number"), N(0 <= E2, "specified a negative value for writing an unsigned value"), N(E2 <= A2, "value is larger than maximum value for type"), N(Math.floor(E2) === E2, "value has a fractional component");
        }
        function L(E2, A2, D) {
          N(typeof E2 == "number", "cannot write a non-number as a number"), N(E2 <= A2, "value larger than maximum allowed value"), N(D <= E2, "value smaller than minimum allowed value"), N(Math.floor(E2) === E2, "value has a fractional component");
        }
        function O(E2, A2, D) {
          N(typeof E2 == "number", "cannot write a non-number as a number"), N(E2 <= A2, "value larger than maximum allowed value"), N(D <= E2, "value smaller than minimum allowed value");
        }
        function N(E2, A2) {
          if (!E2)
            throw new Error(A2 || "Failed assertion");
        }
        v2._augment = function(E2) {
          return E2._isBuffer = true, E2._get = E2.get, E2._set = E2.set, E2.get = U.get, E2.set = U.set, E2.write = U.write, E2.toString = U.toString, E2.toLocaleString = U.toString, E2.toJSON = U.toJSON, E2.copy = U.copy, E2.slice = U.slice, E2.readUInt8 = U.readUInt8, E2.readUInt16LE = U.readUInt16LE, E2.readUInt16BE = U.readUInt16BE, E2.readUInt32LE = U.readUInt32LE, E2.readUInt32BE = U.readUInt32BE, E2.readInt8 = U.readInt8, E2.readInt16LE = U.readInt16LE, E2.readInt16BE = U.readInt16BE, E2.readInt32LE = U.readInt32LE, E2.readInt32BE = U.readInt32BE, E2.readFloatLE = U.readFloatLE, E2.readFloatBE = U.readFloatBE, E2.readDoubleLE = U.readDoubleLE, E2.readDoubleBE = U.readDoubleBE, E2.writeUInt8 = U.writeUInt8, E2.writeUInt16LE = U.writeUInt16LE, E2.writeUInt16BE = U.writeUInt16BE, E2.writeUInt32LE = U.writeUInt32LE, E2.writeUInt32BE = U.writeUInt32BE, E2.writeInt8 = U.writeInt8, E2.writeInt16LE = U.writeInt16LE, E2.writeInt16BE = U.writeInt16BE, E2.writeInt32LE = U.writeInt32LE, E2.writeInt32BE = U.writeInt32BE, E2.writeFloatLE = U.writeFloatLE, E2.writeFloatBE = U.writeFloatBE, E2.writeDoubleLE = U.writeDoubleLE, E2.writeDoubleBE = U.writeDoubleBE, E2.fill = U.fill, E2.inspect = U.inspect, E2.toArrayBuffer = U.toArrayBuffer, E2;
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
    }, { "base64-js": 2, buffer: 3, ieee754: 10, lYpoI2: 11 }], 4: [function(t, n, s) {
      (function(i, r, y, l, c, u, h2, f, p) {
        var y = t("buffer").Buffer, g2 = 4, v2 = new y(g2);
        v2.fill(0), n.exports = { hash: function(d, w, x2, T) {
          for (var P2 = w((function(_2, I2) {
            _2.length % g2 != 0 && (R = _2.length + (g2 - _2.length % g2), _2 = y.concat([_2, v2], R));
            for (var R, z = [], k = I2 ? _2.readInt32BE : _2.readInt32LE, G2 = 0; G2 < _2.length; G2 += g2)
              z.push(k.call(_2, G2));
            return z;
          })(d = y.isBuffer(d) ? d : new y(d), T), 8 * d.length), w = T, S = new y(x2), M2 = w ? S.writeInt32BE : S.writeInt32LE, m2 = 0; m2 < P2.length; m2++)
            M2.call(S, P2[m2], 4 * m2, true);
          return S;
        } };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { buffer: 3, lYpoI2: 11 }], 5: [function(t, n, s) {
      (function(i, r, y, l, c, u, h2, f, p) {
        var y = t("buffer").Buffer, g2 = t("./sha"), v2 = t("./sha256"), d = t("./rng"), w = { sha1: g2, sha256: v2, md5: t("./md5") }, x2 = 64, T = new y(x2);
        function P2(_2, I2) {
          var R = w[_2 = _2 || "sha1"], z = [];
          return R || S("algorithm:", _2, "is not yet supported"), { update: function(k) {
            return y.isBuffer(k) || (k = new y(k)), z.push(k), k.length, this;
          }, digest: function(k) {
            var G2 = y.concat(z), G2 = I2 ? (function(U, q, $2) {
              y.isBuffer(q) || (q = new y(q)), y.isBuffer($2) || ($2 = new y($2)), q.length > x2 ? q = U(q) : q.length < x2 && (q = y.concat([q, T], x2));
              for (var te = new y(x2), ee2 = new y(x2), oe2 = 0; oe2 < x2; oe2++)
                te[oe2] = 54 ^ q[oe2], ee2[oe2] = 92 ^ q[oe2];
              return $2 = U(y.concat([te, $2])), U(y.concat([ee2, $2]));
            })(R, I2, G2) : R(G2);
            return z = null, k ? G2.toString(k) : G2;
          } };
        }
        function S() {
          var _2 = [].slice.call(arguments).join(" ");
          throw new Error([_2, "we accept pull requests", "http://github.com/dominictarr/crypto-browserify"].join(`
`));
        }
        T.fill(0), s.createHash = function(_2) {
          return P2(_2);
        }, s.createHmac = P2, s.randomBytes = function(_2, I2) {
          if (!I2 || !I2.call)
            return new y(d(_2));
          try {
            I2.call(this, void 0, new y(d(_2)));
          } catch (R) {
            I2(R);
          }
        };
        var M2, m2 = ["createCredentials", "createCipher", "createCipheriv", "createDecipher", "createDecipheriv", "createSign", "createVerify", "createDiffieHellman", "pbkdf2"], b = function(_2) {
          s[_2] = function() {
            S("sorry,", _2, "is not implemented yet");
          };
        };
        for (M2 in m2)
          b(m2[M2]);
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./md5": 6, "./rng": 7, "./sha": 8, "./sha256": 9, buffer: 3, lYpoI2: 11 }], 6: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        var y = t("./helpers");
        function g2(S, M2) {
          S[M2 >> 5] |= 128 << M2 % 32, S[14 + (M2 + 64 >>> 9 << 4)] = M2;
          for (var m2 = 1732584193, b = -271733879, _2 = -1732584194, I2 = 271733878, R = 0; R < S.length; R += 16) {
            var z = m2, k = b, G2 = _2, U = I2, m2 = d(m2, b, _2, I2, S[R + 0], 7, -680876936), I2 = d(I2, m2, b, _2, S[R + 1], 12, -389564586), _2 = d(_2, I2, m2, b, S[R + 2], 17, 606105819), b = d(b, _2, I2, m2, S[R + 3], 22, -1044525330);
            m2 = d(m2, b, _2, I2, S[R + 4], 7, -176418897), I2 = d(I2, m2, b, _2, S[R + 5], 12, 1200080426), _2 = d(_2, I2, m2, b, S[R + 6], 17, -1473231341), b = d(b, _2, I2, m2, S[R + 7], 22, -45705983), m2 = d(m2, b, _2, I2, S[R + 8], 7, 1770035416), I2 = d(I2, m2, b, _2, S[R + 9], 12, -1958414417), _2 = d(_2, I2, m2, b, S[R + 10], 17, -42063), b = d(b, _2, I2, m2, S[R + 11], 22, -1990404162), m2 = d(m2, b, _2, I2, S[R + 12], 7, 1804603682), I2 = d(I2, m2, b, _2, S[R + 13], 12, -40341101), _2 = d(_2, I2, m2, b, S[R + 14], 17, -1502002290), m2 = w(m2, b = d(b, _2, I2, m2, S[R + 15], 22, 1236535329), _2, I2, S[R + 1], 5, -165796510), I2 = w(I2, m2, b, _2, S[R + 6], 9, -1069501632), _2 = w(_2, I2, m2, b, S[R + 11], 14, 643717713), b = w(b, _2, I2, m2, S[R + 0], 20, -373897302), m2 = w(m2, b, _2, I2, S[R + 5], 5, -701558691), I2 = w(I2, m2, b, _2, S[R + 10], 9, 38016083), _2 = w(_2, I2, m2, b, S[R + 15], 14, -660478335), b = w(b, _2, I2, m2, S[R + 4], 20, -405537848), m2 = w(m2, b, _2, I2, S[R + 9], 5, 568446438), I2 = w(I2, m2, b, _2, S[R + 14], 9, -1019803690), _2 = w(_2, I2, m2, b, S[R + 3], 14, -187363961), b = w(b, _2, I2, m2, S[R + 8], 20, 1163531501), m2 = w(m2, b, _2, I2, S[R + 13], 5, -1444681467), I2 = w(I2, m2, b, _2, S[R + 2], 9, -51403784), _2 = w(_2, I2, m2, b, S[R + 7], 14, 1735328473), m2 = x2(m2, b = w(b, _2, I2, m2, S[R + 12], 20, -1926607734), _2, I2, S[R + 5], 4, -378558), I2 = x2(I2, m2, b, _2, S[R + 8], 11, -2022574463), _2 = x2(_2, I2, m2, b, S[R + 11], 16, 1839030562), b = x2(b, _2, I2, m2, S[R + 14], 23, -35309556), m2 = x2(m2, b, _2, I2, S[R + 1], 4, -1530992060), I2 = x2(I2, m2, b, _2, S[R + 4], 11, 1272893353), _2 = x2(_2, I2, m2, b, S[R + 7], 16, -155497632), b = x2(b, _2, I2, m2, S[R + 10], 23, -1094730640), m2 = x2(m2, b, _2, I2, S[R + 13], 4, 681279174), I2 = x2(I2, m2, b, _2, S[R + 0], 11, -358537222), _2 = x2(_2, I2, m2, b, S[R + 3], 16, -722521979), b = x2(b, _2, I2, m2, S[R + 6], 23, 76029189), m2 = x2(m2, b, _2, I2, S[R + 9], 4, -640364487), I2 = x2(I2, m2, b, _2, S[R + 12], 11, -421815835), _2 = x2(_2, I2, m2, b, S[R + 15], 16, 530742520), m2 = T(m2, b = x2(b, _2, I2, m2, S[R + 2], 23, -995338651), _2, I2, S[R + 0], 6, -198630844), I2 = T(I2, m2, b, _2, S[R + 7], 10, 1126891415), _2 = T(_2, I2, m2, b, S[R + 14], 15, -1416354905), b = T(b, _2, I2, m2, S[R + 5], 21, -57434055), m2 = T(m2, b, _2, I2, S[R + 12], 6, 1700485571), I2 = T(I2, m2, b, _2, S[R + 3], 10, -1894986606), _2 = T(_2, I2, m2, b, S[R + 10], 15, -1051523), b = T(b, _2, I2, m2, S[R + 1], 21, -2054922799), m2 = T(m2, b, _2, I2, S[R + 8], 6, 1873313359), I2 = T(I2, m2, b, _2, S[R + 15], 10, -30611744), _2 = T(_2, I2, m2, b, S[R + 6], 15, -1560198380), b = T(b, _2, I2, m2, S[R + 13], 21, 1309151649), m2 = T(m2, b, _2, I2, S[R + 4], 6, -145523070), I2 = T(I2, m2, b, _2, S[R + 11], 10, -1120210379), _2 = T(_2, I2, m2, b, S[R + 2], 15, 718787259), b = T(b, _2, I2, m2, S[R + 9], 21, -343485551), m2 = P2(m2, z), b = P2(b, k), _2 = P2(_2, G2), I2 = P2(I2, U);
          }
          return Array(m2, b, _2, I2);
        }
        function v2(S, M2, m2, b, _2, I2) {
          return P2((M2 = P2(P2(M2, S), P2(b, I2))) << _2 | M2 >>> 32 - _2, m2);
        }
        function d(S, M2, m2, b, _2, I2, R) {
          return v2(M2 & m2 | ~M2 & b, S, M2, _2, I2, R);
        }
        function w(S, M2, m2, b, _2, I2, R) {
          return v2(M2 & b | m2 & ~b, S, M2, _2, I2, R);
        }
        function x2(S, M2, m2, b, _2, I2, R) {
          return v2(M2 ^ m2 ^ b, S, M2, _2, I2, R);
        }
        function T(S, M2, m2, b, _2, I2, R) {
          return v2(m2 ^ (M2 | ~b), S, M2, _2, I2, R);
        }
        function P2(S, M2) {
          var m2 = (65535 & S) + (65535 & M2);
          return (S >> 16) + (M2 >> 16) + (m2 >> 16) << 16 | 65535 & m2;
        }
        n.exports = function(S) {
          return y.hash(S, g2, 16);
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 7: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        n.exports = function(y) {
          for (var g2, v2 = new Array(y), d = 0; d < y; d++)
            !(3 & d) && (g2 = 4294967296 * Math.random()), v2[d] = g2 >>> ((3 & d) << 3) & 255;
          return v2;
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { buffer: 3, lYpoI2: 11 }], 8: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        var y = t("./helpers");
        function g2(w, x2) {
          w[x2 >> 5] |= 128 << 24 - x2 % 32, w[15 + (x2 + 64 >> 9 << 4)] = x2;
          for (var T, P2, S, M2 = Array(80), m2 = 1732584193, b = -271733879, _2 = -1732584194, I2 = 271733878, R = -1009589776, z = 0; z < w.length; z += 16) {
            for (var k = m2, G2 = b, U = _2, q = I2, $2 = R, te = 0; te < 80; te++) {
              M2[te] = te < 16 ? w[z + te] : d(M2[te - 3] ^ M2[te - 8] ^ M2[te - 14] ^ M2[te - 16], 1);
              var ee2 = v2(v2(d(m2, 5), (ee2 = b, P2 = _2, S = I2, (T = te) < 20 ? ee2 & P2 | ~ee2 & S : !(T < 40) && T < 60 ? ee2 & P2 | ee2 & S | P2 & S : ee2 ^ P2 ^ S)), v2(v2(R, M2[te]), (T = te) < 20 ? 1518500249 : T < 40 ? 1859775393 : T < 60 ? -1894007588 : -899497514)), R = I2, I2 = _2, _2 = d(b, 30), b = m2, m2 = ee2;
            }
            m2 = v2(m2, k), b = v2(b, G2), _2 = v2(_2, U), I2 = v2(I2, q), R = v2(R, $2);
          }
          return Array(m2, b, _2, I2, R);
        }
        function v2(w, x2) {
          var T = (65535 & w) + (65535 & x2);
          return (w >> 16) + (x2 >> 16) + (T >> 16) << 16 | 65535 & T;
        }
        function d(w, x2) {
          return w << x2 | w >>> 32 - x2;
        }
        n.exports = function(w) {
          return y.hash(w, g2, 20, true);
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 9: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        function y(x2, T) {
          var P2 = (65535 & x2) + (65535 & T);
          return (x2 >> 16) + (T >> 16) + (P2 >> 16) << 16 | 65535 & P2;
        }
        function g2(x2, T) {
          var P2, S = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298), M2 = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225), m2 = new Array(64);
          x2[T >> 5] |= 128 << 24 - T % 32, x2[15 + (T + 64 >> 9 << 4)] = T;
          for (var b, _2, I2 = 0; I2 < x2.length; I2 += 16) {
            for (var R = M2[0], z = M2[1], k = M2[2], G2 = M2[3], U = M2[4], q = M2[5], $2 = M2[6], te = M2[7], ee2 = 0; ee2 < 64; ee2++)
              m2[ee2] = ee2 < 16 ? x2[ee2 + I2] : y(y(y((_2 = m2[ee2 - 2], d(_2, 17) ^ d(_2, 19) ^ w(_2, 10)), m2[ee2 - 7]), (_2 = m2[ee2 - 15], d(_2, 7) ^ d(_2, 18) ^ w(_2, 3))), m2[ee2 - 16]), P2 = y(y(y(y(te, d(_2 = U, 6) ^ d(_2, 11) ^ d(_2, 25)), U & q ^ ~U & $2), S[ee2]), m2[ee2]), b = y(d(b = R, 2) ^ d(b, 13) ^ d(b, 22), R & z ^ R & k ^ z & k), te = $2, $2 = q, q = U, U = y(G2, P2), G2 = k, k = z, z = R, R = y(P2, b);
            M2[0] = y(R, M2[0]), M2[1] = y(z, M2[1]), M2[2] = y(k, M2[2]), M2[3] = y(G2, M2[3]), M2[4] = y(U, M2[4]), M2[5] = y(q, M2[5]), M2[6] = y($2, M2[6]), M2[7] = y(te, M2[7]);
          }
          return M2;
        }
        var v2 = t("./helpers"), d = function(x2, T) {
          return x2 >>> T | x2 << 32 - T;
        }, w = function(x2, T) {
          return x2 >>> T;
        };
        n.exports = function(x2) {
          return v2.hash(x2, g2, 32, true);
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 10: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        s.read = function(y, g2, v2, d, I2) {
          var x2, T, P2 = 8 * I2 - d - 1, S = (1 << P2) - 1, M2 = S >> 1, m2 = -7, b = v2 ? I2 - 1 : 0, _2 = v2 ? -1 : 1, I2 = y[g2 + b];
          for (b += _2, x2 = I2 & (1 << -m2) - 1, I2 >>= -m2, m2 += P2; 0 < m2; x2 = 256 * x2 + y[g2 + b], b += _2, m2 -= 8)
            ;
          for (T = x2 & (1 << -m2) - 1, x2 >>= -m2, m2 += d; 0 < m2; T = 256 * T + y[g2 + b], b += _2, m2 -= 8)
            ;
          if (x2 === 0)
            x2 = 1 - M2;
          else {
            if (x2 === S)
              return T ? NaN : 1 / 0 * (I2 ? -1 : 1);
            T += Math.pow(2, d), x2 -= M2;
          }
          return (I2 ? -1 : 1) * T * Math.pow(2, x2 - d);
        }, s.write = function(y, g2, v2, d, w, R) {
          var T, P2, S = 8 * R - w - 1, M2 = (1 << S) - 1, m2 = M2 >> 1, b = w === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, _2 = d ? 0 : R - 1, I2 = d ? 1 : -1, R = g2 < 0 || g2 === 0 && 1 / g2 < 0 ? 1 : 0;
          for (g2 = Math.abs(g2), isNaN(g2) || g2 === 1 / 0 ? (P2 = isNaN(g2) ? 1 : 0, T = M2) : (T = Math.floor(Math.log(g2) / Math.LN2), g2 * (d = Math.pow(2, -T)) < 1 && (T--, d *= 2), 2 <= (g2 += 1 <= T + m2 ? b / d : b * Math.pow(2, 1 - m2)) * d && (T++, d /= 2), M2 <= T + m2 ? (P2 = 0, T = M2) : 1 <= T + m2 ? (P2 = (g2 * d - 1) * Math.pow(2, w), T += m2) : (P2 = g2 * Math.pow(2, m2 - 1) * Math.pow(2, w), T = 0)); 8 <= w; y[v2 + _2] = 255 & P2, _2 += I2, P2 /= 256, w -= 8)
            ;
          for (T = T << w | P2, S += w; 0 < S; y[v2 + _2] = 255 & T, _2 += I2, T /= 256, S -= 8)
            ;
          y[v2 + _2 - I2] |= 128 * R;
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/ieee754/index.js", "/node_modules/gulp-browserify/node_modules/ieee754");
    }, { buffer: 3, lYpoI2: 11 }], 11: [function(t, n, s) {
      (function(i, r, a, l, c, u, h2, f, p) {
        var y, g2, v2;
        function d() {
        }
        (i = n.exports = {}).nextTick = (g2 = "undefined" < "u", v2 = "undefined" < "u", g2 ? function(w) {
          return (void 0).setImmediate(w);
        } : v2 ? (y = [], (void 0).addEventListener("message", function(w) {
          var x2 = w.source;
          x2 !== void 0 && x2 !== null || w.data !== "process-tick" || (w.stopPropagation(), 0 < y.length && y.shift()());
        }, true), function(w) {
          y.push(w), (void 0).postMessage("process-tick", "*");
        }) : function(w) {
          setTimeout(w, 0);
        }), i.title = "browser", i.browser = true, i.env = {}, i.argv = [], i.on = d, i.addListener = d, i.once = d, i.off = d, i.removeListener = d, i.removeAllListeners = d, i.emit = d, i.binding = function(w) {
          throw new Error("process.binding is not supported");
        }, i.cwd = function() {
          return "/";
        }, i.chdir = function(w) {
          throw new Error("process.chdir is not supported");
        };
      }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
    }, { buffer: 3, lYpoI2: 11 }] }, {}, [1])(1);
  });
})(il);
var ol = [
  // Keep this list sorted
  "abs",
  "acos",
  "all",
  "any",
  "asin",
  "atan",
  "ceil",
  "clamp",
  "cos",
  "cross",
  "dFdx",
  "dFdy",
  "degrees",
  "distance",
  "dot",
  "equal",
  "exp",
  "exp2",
  "faceforward",
  "floor",
  "fract",
  "gl_BackColor",
  "gl_BackLightModelProduct",
  "gl_BackLightProduct",
  "gl_BackMaterial",
  "gl_BackSecondaryColor",
  "gl_ClipPlane",
  "gl_ClipVertex",
  "gl_Color",
  "gl_DepthRange",
  "gl_DepthRangeParameters",
  "gl_EyePlaneQ",
  "gl_EyePlaneR",
  "gl_EyePlaneS",
  "gl_EyePlaneT",
  "gl_Fog",
  "gl_FogCoord",
  "gl_FogFragCoord",
  "gl_FogParameters",
  "gl_FragColor",
  "gl_FragCoord",
  "gl_FragData",
  "gl_FragDepth",
  "gl_FragDepthEXT",
  "gl_FrontColor",
  "gl_FrontFacing",
  "gl_FrontLightModelProduct",
  "gl_FrontLightProduct",
  "gl_FrontMaterial",
  "gl_FrontSecondaryColor",
  "gl_LightModel",
  "gl_LightModelParameters",
  "gl_LightModelProducts",
  "gl_LightProducts",
  "gl_LightSource",
  "gl_LightSourceParameters",
  "gl_MaterialParameters",
  "gl_MaxClipPlanes",
  "gl_MaxCombinedTextureImageUnits",
  "gl_MaxDrawBuffers",
  "gl_MaxFragmentUniformComponents",
  "gl_MaxLights",
  "gl_MaxTextureCoords",
  "gl_MaxTextureImageUnits",
  "gl_MaxTextureUnits",
  "gl_MaxVaryingFloats",
  "gl_MaxVertexAttribs",
  "gl_MaxVertexTextureImageUnits",
  "gl_MaxVertexUniformComponents",
  "gl_ModelViewMatrix",
  "gl_ModelViewMatrixInverse",
  "gl_ModelViewMatrixInverseTranspose",
  "gl_ModelViewMatrixTranspose",
  "gl_ModelViewProjectionMatrix",
  "gl_ModelViewProjectionMatrixInverse",
  "gl_ModelViewProjectionMatrixInverseTranspose",
  "gl_ModelViewProjectionMatrixTranspose",
  "gl_MultiTexCoord0",
  "gl_MultiTexCoord1",
  "gl_MultiTexCoord2",
  "gl_MultiTexCoord3",
  "gl_MultiTexCoord4",
  "gl_MultiTexCoord5",
  "gl_MultiTexCoord6",
  "gl_MultiTexCoord7",
  "gl_Normal",
  "gl_NormalMatrix",
  "gl_NormalScale",
  "gl_ObjectPlaneQ",
  "gl_ObjectPlaneR",
  "gl_ObjectPlaneS",
  "gl_ObjectPlaneT",
  "gl_Point",
  "gl_PointCoord",
  "gl_PointParameters",
  "gl_PointSize",
  "gl_Position",
  "gl_ProjectionMatrix",
  "gl_ProjectionMatrixInverse",
  "gl_ProjectionMatrixInverseTranspose",
  "gl_ProjectionMatrixTranspose",
  "gl_SecondaryColor",
  "gl_TexCoord",
  "gl_TextureEnvColor",
  "gl_TextureMatrix",
  "gl_TextureMatrixInverse",
  "gl_TextureMatrixInverseTranspose",
  "gl_TextureMatrixTranspose",
  "gl_Vertex",
  "greaterThan",
  "greaterThanEqual",
  "inversesqrt",
  "length",
  "lessThan",
  "lessThanEqual",
  "log",
  "log2",
  "matrixCompMult",
  "max",
  "min",
  "mix",
  "mod",
  "normalize",
  "not",
  "notEqual",
  "pow",
  "radians",
  "reflect",
  "refract",
  "sign",
  "sin",
  "smoothstep",
  "sqrt",
  "step",
  "tan",
  "texture2D",
  "texture2DLod",
  "texture2DProj",
  "texture2DProjLod",
  "textureCube",
  "textureCubeLod",
  "texture2DLodEXT",
  "texture2DProjLodEXT",
  "textureCubeLodEXT",
  "texture2DGradEXT",
  "texture2DProjGradEXT",
  "textureCubeGradEXT"
], pr = ol;
pr = pr.slice().filter(function(o) {
  return !/^(gl\_|texture)/.test(o);
});
pr.concat([
  // the updated gl_ constants
  "gl_VertexID",
  "gl_InstanceID",
  "gl_Position",
  "gl_PointSize",
  "gl_FragCoord",
  "gl_FrontFacing",
  "gl_FragDepth",
  "gl_PointCoord",
  "gl_MaxVertexAttribs",
  "gl_MaxVertexUniformVectors",
  "gl_MaxVertexOutputVectors",
  "gl_MaxFragmentInputVectors",
  "gl_MaxVertexTextureImageUnits",
  "gl_MaxCombinedTextureImageUnits",
  "gl_MaxTextureImageUnits",
  "gl_MaxFragmentUniformVectors",
  "gl_MaxDrawBuffers",
  "gl_MinProgramTexelOffset",
  "gl_MaxProgramTexelOffset",
  "gl_DepthRangeParameters",
  "gl_DepthRange",
  "trunc",
  "round",
  "roundEven",
  "isnan",
  "isinf",
  "floatBitsToInt",
  "floatBitsToUint",
  "intBitsToFloat",
  "uintBitsToFloat",
  "packSnorm2x16",
  "unpackSnorm2x16",
  "packUnorm2x16",
  "unpackUnorm2x16",
  "packHalf2x16",
  "unpackHalf2x16",
  "outerProduct",
  "transpose",
  "determinant",
  "inverse",
  "texture",
  "textureSize",
  "textureProj",
  "textureLod",
  "textureOffset",
  "texelFetch",
  "texelFetchOffset",
  "textureProjOffset",
  "textureLodOffset",
  "textureProjLod",
  "textureProjLodOffset",
  "textureGrad",
  "textureGradOffset",
  "textureProjGrad",
  "textureProjGradOffset"
]);
function yd(o, e) {
  if (typeof o != "object" || o === null)
    return o;
  var t = o[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(o, e);
    if (typeof n != "object")
      return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(o);
}
function al(o) {
  var e = yd(o, "string");
  return typeof e == "symbol" ? e : String(e);
}
function Ne(o, e, t) {
  return e = al(e), e in o ? Object.defineProperty(o, e, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : o[e] = t, o;
}
var be = {
  position: "csm_Position",
  positionRaw: "csm_PositionRaw",
  pointSize: "csm_PointSize",
  fragColor: "csm_FragColor",
  // PBR
  diffuseColor: "csm_DiffuseColor",
  // Color + alpha
  normal: "csm_Normal",
  // Normal
  roughness: "csm_Roughness",
  // Roughness
  metalness: "csm_Metalness",
  // Metalness
  emissive: "csm_Emissive",
  // Emissive
  ao: "csm_AO",
  // AO
  bump: "csm_Bump",
  // Bump
  depthAlpha: "csm_DepthAlpha"
  // Depth
}, ft, $n;
ft = {}, Ne(ft, "".concat(be.normal), {
  "#include <beginnormal_vertex>": `
    vec3 objectNormal = `.concat(be.normal, `;
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `)
}), Ne(ft, "".concat(be.position), {
  "#include <begin_vertex>": `
    vec3 transformed = `.concat(be.position, `;
  `)
}), Ne(ft, "".concat(be.positionRaw), {
  "#include <begin_vertex>": `
    vec4 csm_internal_positionUnprojected = `.concat(be.positionRaw, `;
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `)
}), Ne(ft, "".concat(be.pointSize), {
  "gl_PointSize = size;": `
    gl_PointSize = `.concat(be.pointSize, `;
    `)
}), Ne(ft, "".concat(be.diffuseColor), {
  "#include <color_fragment>": `
    #include <color_fragment>
    diffuseColor = `.concat(be.diffuseColor, `;
  `)
}), Ne(ft, "".concat(be.fragColor), {
  "#include <dithering_fragment>": `
    #include <dithering_fragment>
    gl_FragColor  = `.concat(be.fragColor, `;
  `)
}), Ne(ft, "".concat(be.emissive), {
  "vec3 totalEmissiveRadiance = emissive;": `
    vec3 totalEmissiveRadiance = `.concat(be.emissive, `;
    `)
}), Ne(ft, "".concat(be.roughness), {
  "#include <roughnessmap_fragment>": `
    #include <roughnessmap_fragment>
    roughnessFactor = `.concat(be.roughness, `;
    `)
}), Ne(ft, "".concat(be.metalness), {
  "#include <metalnessmap_fragment>": `
    #include <metalnessmap_fragment>
    metalnessFactor = `.concat(be.metalness, `;
    `)
}), Ne(ft, "".concat(be.ao), {
  "#include <aomap_fragment>": `
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - `.concat(be.ao, `;
    `)
}), Ne(ft, "".concat(be.bump), {
  "#include <normal_fragment_maps>": `
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = `.concat(be.bump, " - (dot(").concat(be.bump, `, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `)
}), Ne(ft, "".concat(be.depthAlpha), {
  "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * `.concat(be.depthAlpha, ` );
    `),
  "gl_FragColor = packDepthToRGBA( fragCoordZ );": `
      gl_FragColor = packDepthToRGBA( fragCoordZ );
      gl_FragColor.a *= `.concat(be.depthAlpha, `;
    `)
});
$n = {}, Ne($n, "".concat(be.position), {
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": `
    gl_Position = projectionMatrix * modelViewMatrix * vec4( `.concat(be.position, `, 1.0 );
  `)
}), Ne($n, "".concat(be.positionRaw), {
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": `
    gl_Position = `.concat(be.position, `;
  `)
}), Ne($n, "".concat(be.diffuseColor), {
  "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": `
    gl_FragColor = `.concat(be.diffuseColor, `;
  `)
}), Ne($n, "".concat(be.fragColor), {
  "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": `
    gl_FragColor = `.concat(be.fragColor, `;
  `)
});
var dt;
dt = {}, Ne(dt, "".concat(be.position), "*"), Ne(dt, "".concat(be.positionRaw), "*"), Ne(dt, "".concat(be.normal), "*"), Ne(dt, "".concat(be.pointSize), ["PointsMaterial"]), Ne(dt, "".concat(be.diffuseColor), "*"), Ne(dt, "".concat(be.fragColor), "*"), Ne(dt, "".concat(be.emissive), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), Ne(dt, "".concat(be.roughness), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), Ne(dt, "".concat(be.metalness), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), Ne(dt, "".concat(be.ao), ["MeshStandardMaterial", "MeshPhysicalMaterial", "MeshBasicMaterial", "MeshLambertMaterial", "MeshPhongMaterial", "MeshToonMaterial"]), Ne(dt, "".concat(be.bump), ["MeshLambertMaterial", "MeshMatcapMaterial", "MeshNormalMaterial", "MeshPhongMaterial", "MeshPhysicalMaterial", "MeshStandardMaterial", "MeshToonMaterial", "ShadowMaterial"]), Ne(dt, "".concat(be.depthAlpha), "*");
new Box3();
new Vector3();
UniformsLib.line = {
  worldUnits: { value: 1 },
  linewidth: { value: 1 },
  resolution: { value: new Vector2(1, 1) },
  dashOffset: { value: 0 },
  dashScale: { value: 1 },
  dashSize: { value: 1 },
  gapSize: { value: 1 }
  // todo FIX - maybe change to totalSize
};
ShaderLib.line = {
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    UniformsLib.fog,
    UniformsLib.line
  ]),
  vertexShader: (
    /* glsl */
    `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`
  ),
  fragmentShader: (
    /* glsl */
    `
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`
  )
};
new Vector3();
new Vector3();
new Vector4();
new Vector4();
new Vector4();
new Vector3();
new Matrix4();
new Line3();
new Vector3();
new Box3();
new Sphere();
new Vector4();
const Up = {
  key: 0,
  args: [0, 1, 64]
}, Np = {
  key: 1,
  args: [0.5, 1, 64]
}, zp = { key: 2 }, Hp = ["tone-mapped", "map", "side", "color"];
/* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    args: { default: null },
    from: { default: "rect" },
    toneMapped: { type: Boolean, default: false },
    map: { default: null },
    intensity: { default: 1 },
    color: { default: new Color(16777215) }
  },
  setup(o) {
    const e = o, t = ref();
    return watchEffect(() => {
      t.value && (t.value.color.multiplyScalar(e.intensity), t.value.needsUpdate = true);
    }), (n, s) => (openBlock(), createElementBlock("TresMesh", null, [
      n.from === "circle" ? (openBlock(), createElementBlock("TresRingGeometry", Up)) : n.from === "ring" ? (openBlock(), createElementBlock("TresRingGeometry", Np)) : n.from === "rect" ? (openBlock(), createElementBlock("TresPlaneGeometry", zp)) : (openBlock(), createBlock(e.from, {
        key: 3,
        args: e
      })),
      createElementVNode("TresMeshBasicMaterial", {
        ref_key: "material",
        ref: t,
        "tone-mapped": n.toneMapped,
        map: n.map,
        side: unref(DoubleSide),
        color: n.color
      }, null, 8, Hp)
    ]));
  }
});
class mi extends Mesh {
  constructor() {
    const e = mi.SkyShader, t = new ShaderMaterial({
      name: e.name,
      uniforms: UniformsUtils.clone(e.uniforms),
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader,
      side: BackSide,
      depthWrite: false
    });
    super(new BoxGeometry(1, 1, 1), t), this.isSky = true;
  }
}
mi.SkyShader = {
  name: "SkyShader",
  uniforms: {
    turbidity: { value: 2 },
    rayleigh: { value: 1 },
    mieCoefficient: { value: 5e-3 },
    mieDirectionalG: { value: 0.8 },
    sunPosition: { value: new Vector3() },
    up: { value: new Vector3(0, 1, 0) }
  },
  vertexShader: (
    /* glsl */
    `
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`
  ),
  fragmentShader: (
    /* glsl */
    `
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`
  )
};
var fl = { exports: {} };
(function(o, e) {
  (function(t, n) {
    o.exports = n();
  })(Yf, function() {
    var t = function() {
      function n(p) {
        return r.appendChild(p.dom), p;
      }
      function s(p) {
        for (var y = 0; y < r.children.length; y++)
          r.children[y].style.display = y === p ? "block" : "none";
        i = p;
      }
      var i = 0, r = (void 0).createElement("div");
      r.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", r.addEventListener("click", function(p) {
        p.preventDefault(), s(++i % r.children.length);
      }, false);
      var a = (performance || Date).now(), l = a, c = 0, u = n(new t.Panel("FPS", "#0ff", "#002")), h2 = n(new t.Panel("MS", "#0f0", "#020"));
      if (self.performance && self.performance.memory)
        var f = n(new t.Panel("MB", "#f08", "#201"));
      return s(0), { REVISION: 16, dom: r, addPanel: n, showPanel: s, begin: function() {
        a = (performance || Date).now();
      }, end: function() {
        c++;
        var p = (performance || Date).now();
        if (h2.update(p - a, 200), p > l + 1e3 && (u.update(1e3 * c / (p - l), 100), l = p, c = 0, f)) {
          var y = performance.memory;
          f.update(y.usedJSHeapSize / 1048576, y.jsHeapSizeLimit / 1048576);
        }
        return p;
      }, update: function() {
        a = this.end();
      }, domElement: r, setMode: s };
    };
    return t.Panel = function(n, s, i) {
      var r = 1 / 0, a = 0, l = Math.round, c = l((void 0).devicePixelRatio || 1), u = 80 * c, h2 = 48 * c, f = 3 * c, p = 2 * c, y = 3 * c, g2 = 15 * c, v2 = 74 * c, d = 30 * c, w = (void 0).createElement("canvas");
      w.width = u, w.height = h2, w.style.cssText = "width:80px;height:48px";
      var x2 = w.getContext("2d");
      return x2.font = "bold " + 9 * c + "px Helvetica,Arial,sans-serif", x2.textBaseline = "top", x2.fillStyle = i, x2.fillRect(0, 0, u, h2), x2.fillStyle = s, x2.fillText(n, f, p), x2.fillRect(y, g2, v2, d), x2.fillStyle = i, x2.globalAlpha = 0.9, x2.fillRect(y, g2, v2, d), { dom: w, update: function(T, P2) {
        r = Math.min(r, T), a = Math.max(a, T), x2.fillStyle = i, x2.globalAlpha = 1, x2.fillRect(0, 0, u, g2), x2.fillStyle = s, x2.fillText(l(T) + " " + n + " (" + l(r) + "-" + l(a) + ")", f, p), x2.drawImage(w, y + c, g2, v2 - c, d, y, g2, v2 - c, d), x2.fillRect(y + v2 - c, g2, c, d), x2.fillStyle = i, x2.globalAlpha = 0.9, x2.fillRect(y + v2 - c, g2, c, l((1 - T / P2) * d));
      } };
    }, t;
  });
})(fl);
var bm = fl.exports;
const Em = /* @__PURE__ */ Is(bm);
defineComponent({
  name: "Stats",
  props: {
    showPanel: {
      type: Number,
      default: 0
    }
  },
  setup(o, { expose: e }) {
    const t = new Em();
    e({ stats: t });
    const n = (void 0).body;
    t.showPanel(o.showPanel || 0), n == null || n.appendChild(t.dom);
    const { onBeforeLoop: s, onAfterLoop: i, resume: r } = G$1();
    r(), s(() => t.begin()), i(() => t.end());
  }
});
class Sm {
  constructor(e, t, n) {
    this.name = e, this.fg = t, this.bg = n, this.PR = Math.round((void 0).devicePixelRatio || 1), this.WIDTH = 90 * this.PR, this.HEIGHT = 48 * this.PR, this.TEXT_X = 3 * this.PR, this.TEXT_Y = 2 * this.PR, this.GRAPH_X = 3 * this.PR, this.GRAPH_Y = 15 * this.PR, this.GRAPH_WIDTH = 84 * this.PR, this.GRAPH_HEIGHT = 30 * this.PR, this.canvas = (void 0).createElement("canvas"), this.canvas.width = 90 * this.PR, this.canvas.height = 48 * this.PR, this.canvas.style.width = "90px", this.canvas.style.position = "absolute", this.canvas.style.height = "48px", this.canvas.style.cssText = "width:90px;height:48px", this.context = this.canvas.getContext("2d"), this.context && (this.context.font = "bold " + 9 * this.PR + "px Helvetica,Arial,sans-serif", this.context.textBaseline = "top", this.context.fillStyle = this.bg, this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT), this.context.fillStyle = this.fg, this.context.fillText(this.name, this.TEXT_X, this.TEXT_Y), this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT), this.context.fillStyle = this.bg, this.context.globalAlpha = 0.9, this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT));
  }
  update(e, t, n, s, i = 0) {
    let r = 1 / 0, a = 0;
    this.context && (r = Math.min(r, e), a = Math.max(n, e), s = Math.max(s, t), this.context.fillStyle = this.bg, this.context.globalAlpha = 1, this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y), this.context.fillStyle = this.fg, this.context.fillText(e.toFixed(i) + " " + this.name + " (" + r.toFixed(i) + "-" + parseFloat(a.toFixed(i)) + ")", this.TEXT_X, this.TEXT_Y), this.context.drawImage(this.canvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT), this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT), this.context.fillStyle = this.bg, this.context.globalAlpha = 0.9, this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, (1 - t / s) * this.GRAPH_HEIGHT));
  }
}
const dl = class qn {
  constructor({ logsPerSecond: e = 20, samplesLog: t = 100, samplesGraph: n = 10, precision: s = 2, minimal: i = false, horizontal: r = true, mode: a = 0 } = {}) {
    this.totalCpuDuration = 0, this.totalGpuDuration = 0, this.totalGpuDurationCompute = 0, this.totalFps = 0, this.activeQuery = null, this.gpuQueries = [], this.renderCount = 0, this.mode = a, this.horizontal = r, this.dom = (void 0).createElement("div"), this.dom.style.cssText = "position:fixed;top:0;left:0;opacity:0.9;z-index:10000;", i && (this.dom.style.cssText += "cursor:pointer"), this.gl = null, this.query = null, this.isRunningCPUProfiling = false, this.minimal = i, this.beginTime = (performance || Date).now(), this.prevTime = this.beginTime, this.prevCpuTime = this.beginTime, this.frames = 0, this.renderCount = 0, this.threeRendererPatched = false, this.averageCpu = {
      logs: [],
      graph: []
    }, this.averageGpu = {
      logs: [],
      graph: []
    }, this.averageGpuCompute = {
      logs: [],
      graph: []
    }, this.queryCreated = false, this.fpsPanel = this.addPanel(new qn.Panel("FPS", "#0ff", "#002"), 0), this.msPanel = this.addPanel(new qn.Panel("CPU", "#0f0", "#020"), 1), this.gpuPanel = null, this.gpuPanelCompute = null, this.samplesLog = t, this.samplesGraph = n, this.precision = s, this.logsPerSecond = e, this.minimal ? (this.dom.addEventListener("click", (l) => {
      l.preventDefault(), this.showPanel(++this.mode % this.dom.children.length);
    }, false), this.mode = a, this.showPanel(this.mode)) : (void 0).addEventListener("resize", () => {
      this.resizePanel(this.fpsPanel, 0), this.resizePanel(this.msPanel, 1), this.gpuPanel && this.resizePanel(this.gpuPanel, 2), this.gpuPanelCompute && this.resizePanel(this.gpuPanelCompute, 3);
    });
  }
  patchThreeRenderer(e) {
    const t = e.render, n = this;
    e.render = function(s, i) {
      n.begin(), t.call(this, s, i), n.end();
    }, this.threeRendererPatched = true;
  }
  resizePanel(e, t) {
    e.canvas.style.position = "absolute", this.minimal ? e.canvas.style.display = "none" : (e.canvas.style.display = "block", this.horizontal ? (e.canvas.style.top = "0px", e.canvas.style.left = t * e.WIDTH / e.PR + "px") : (e.canvas.style.left = "0px", e.canvas.style.top = t * e.HEIGHT / e.PR + "px"));
  }
  addPanel(e, t) {
    return e.canvas && (this.dom.appendChild(e.canvas), this.resizePanel(e, t)), e;
  }
  showPanel(e) {
    for (let t = 0; t < this.dom.children.length; t++) {
      const n = this.dom.children[t];
      n.style.display = t === e ? "block" : "none";
    }
    this.mode = e;
  }
  async init(e) {
    if (!e) {
      console.error('Stats: The "canvas" parameter is undefined.');
      return;
    }
    if (e.isWebGLRenderer && !this.threeRendererPatched) {
      const t = e;
      this.patchThreeRenderer(t), this.gl = t.getContext();
    } else
      !this.gl && e instanceof WebGL2RenderingContext && (this.gl = e);
    if (e.isWebGPURenderer) {
      e.backend.trackTimestamp = true, await e.hasFeatureAsync("timestamp-query") && (this.gpuPanel = this.addPanel(new qn.Panel("GPU", "#ff0", "#220"), 2), this.gpuPanelCompute = this.addPanel(new qn.Panel("CPT", "#e1e1e1", "#212121"), 3), this.info = e.info);
      return;
    } else if (!this.gl && e instanceof HTMLCanvasElement || e instanceof OffscreenCanvas) {
      if (this.gl = e.getContext("webgl2"), !this.gl) {
        console.error("Stats: Unable to obtain WebGL2 context.");
        return;
      }
    } else if (!this.gl) {
      console.error("Stats: Invalid input type. Expected WebGL2RenderingContext, HTMLCanvasElement, or OffscreenCanvas.");
      return;
    }
    this.ext = this.gl.getExtension("EXT_disjoint_timer_query_webgl2"), this.ext && (this.gpuPanel = this.addPanel(new qn.Panel("GPU", "#ff0", "#220"), 2));
  }
  begin() {
    this.isRunningCPUProfiling || this.beginProfiling("cpu-started"), !(!this.gl || !this.ext) && this.gl && this.ext && (this.activeQuery && this.gl.endQuery(this.ext.TIME_ELAPSED_EXT), this.activeQuery = this.gl.createQuery(), this.activeQuery !== null && this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, this.activeQuery));
  }
  end() {
    this.renderCount++, this.gl && this.ext && this.activeQuery && (this.gl.endQuery(this.ext.TIME_ELAPSED_EXT), this.gpuQueries.push({ query: this.activeQuery }), this.activeQuery = null);
  }
  processGpuQueries() {
    !this.gl || !this.ext || (this.totalGpuDuration = 0, this.gpuQueries.forEach((e, t) => {
      if (this.gl) {
        const n = this.gl.getQueryParameter(e.query, this.gl.QUERY_RESULT_AVAILABLE), s = this.gl.getParameter(this.ext.GPU_DISJOINT_EXT);
        if (n && !s) {
          const r = this.gl.getQueryParameter(e.query, this.gl.QUERY_RESULT) * 1e-6;
          this.totalGpuDuration += r, this.gl.deleteQuery(e.query), this.gpuQueries.splice(t, 1);
        }
      }
    }));
  }
  update() {
    this.info === void 0 ? this.processGpuQueries() : (this.totalGpuDuration = this.info.render.timestamp, this.totalGpuDurationCompute = this.info.compute.timestamp, this.addToAverage(this.totalGpuDurationCompute, this.averageGpuCompute)), this.endProfiling("cpu-started", "cpu-finished", "cpu-duration"), this.addToAverage(this.totalCpuDuration, this.averageCpu), this.addToAverage(this.totalGpuDuration, this.averageGpu), this.renderCount = 0, this.totalCpuDuration === 0 && this.beginProfiling("cpu-started"), this.totalCpuDuration = 0, this.totalFps = 0, this.beginTime = this.endInternal();
  }
  endInternal() {
    this.frames++;
    const e = (performance || Date).now();
    if (e >= this.prevCpuTime + 1e3 / this.logsPerSecond && (this.updatePanel(this.msPanel, this.averageCpu), this.updatePanel(this.gpuPanel, this.averageGpu), this.gpuPanelCompute && this.updatePanel(this.gpuPanelCompute, this.averageGpuCompute), this.prevCpuTime = e), e >= this.prevTime + 1e3) {
      const t = this.frames * 1e3 / (e - this.prevTime);
      this.fpsPanel.update(t, t, 100, 100, 0), this.prevTime = e, this.frames = 0;
    }
    return e;
  }
  addToAverage(e, t) {
    t.logs.push(e), t.logs.length > this.samplesLog && t.logs.shift(), t.graph.push(e), t.graph.length > this.samplesGraph && t.graph.shift();
  }
  beginProfiling(e) {
    (void 0).performance && ((void 0).performance.mark(e), this.isRunningCPUProfiling = true);
  }
  endProfiling(e, t, n) {
    if ((void 0).performance && t && this.isRunningCPUProfiling) {
      (void 0).performance.mark(t);
      const s = performance.measure(n, e, t);
      this.totalCpuDuration += s.duration, this.isRunningCPUProfiling = false;
    }
  }
  updatePanel(e, t) {
    if (t.logs.length > 0) {
      let n = 0, s = 0.01;
      for (let a = 0; a < t.logs.length; a++)
        n += t.logs[a], t.logs[a] > s && (s = t.logs[a]);
      let i = 0, r = 0.01;
      for (let a = 0; a < t.graph.length; a++)
        i += t.graph[a], t.graph[a] > r && (r = t.graph[a]);
      e && e.update(n / Math.min(t.logs.length, this.samplesLog), i / Math.min(t.graph.length, this.samplesGraph), s, r, this.precision);
    }
  }
  get domElement() {
    return this.dom;
  }
  get container() {
    return console.warn("Stats: Deprecated! this.container as been replaced to this.dom "), this.dom;
  }
};
dl.Panel = Sm;
let Mm = dl;
defineComponent({
  name: "StatsGl",
  props: [
    "logsPerSecond",
    "samplesLog",
    "samplesGraph",
    "precision",
    "horizontal",
    "minimal",
    "mode"
  ],
  async setup(o, { expose: e }) {
    const t = new Mm({
      logsPerSecond: o.logsPerSecond,
      samplesLog: o.samplesLog,
      samplesGraph: o.samplesGraph,
      precision: o.precision,
      horizontal: o.horizontal,
      minimal: o.minimal,
      mode: o.mode
    });
    e({ statsGl: t });
    const n = (void 0).body, s = t.dom || t.container;
    n == null || n.appendChild(s);
    const { renderer: i } = dr(), { onAfterLoop: r, resume: a } = G$1();
    t.init(i.value), a(), r(() => {
      t.update();
    });
  }
});
defineComponent({
  name: "BakeShadows",
  setup() {
    const { renderer: o } = dr();
    watchEffect(() => {
      o.value.shadowMap.autoUpdate = false, o.value.shadowMap.needsUpdate = true;
    });
  }
});
var Am = `#include <common>

void main() {
  vec2 center = vec2(0., 1.);
  float rotation = 0.0;

  
  
  float size = 0.03;

  vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
  vec2 scale;
  scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
  scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

  bool isPerspective = isPerspectiveMatrix( projectionMatrix );
  if ( isPerspective ) scale *= - mvPosition.z;

  vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
  vec2 rotatedPosition;
  rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
  rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
  mvPosition.xy += rotatedPosition;

  gl_Position = projectionMatrix * mvPosition;
}`, Pm = `void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}`;
const Rs = new Vector3(0, 0, 0), Nr = new Vector3(0, 0, 0), Cm = new Vector3(0, 0, 0);
function qo(o, e, t) {
  const n = Rs.setFromMatrixPosition(o.matrixWorld);
  n.project(e);
  const s = t.width / 2, i = t.height / 2;
  return [
    (Number.isNaN(n.x) ? 0 : n.x) * s + s,
    -(n.y * i) + i
  ];
}
function Im(o, e) {
  const t = Rs.setFromMatrixPosition(o.matrixWorld), n = Nr.setFromMatrixPosition(e.matrixWorld), s = t.sub(n), i = e.getWorldDirection(Cm);
  return s.angleTo(i) > Math.PI / 2;
}
function Rm(o, e, t, n) {
  const s = Rs.setFromMatrixPosition(o.matrixWorld), i = s.clone();
  i.project(e), t.setFromCamera(new Vector2(i.x, i.y), e);
  const r = t.intersectObjects(n, true);
  if (r.length > 0) {
    const a = r[0].distance;
    return s.distanceTo(t.ray.origin) < a;
  }
  return true;
}
function Dm(o, e) {
  if (e instanceof OrthographicCamera)
    return e.zoom;
  if (e instanceof PerspectiveCamera) {
    const t = Rs.setFromMatrixPosition(o.matrixWorld), n = Nr.setFromMatrixPosition(e.matrixWorld), s = e.fov * Math.PI / 180, i = t.distanceTo(n);
    return 1 / (2 * Math.tan(s / 2) * i);
  } else
    return 1;
}
function Om(o, e, t) {
  if (e instanceof PerspectiveCamera || e instanceof OrthographicCamera) {
    const n = Rs.setFromMatrixPosition(o.matrixWorld), s = Nr.setFromMatrixPosition(e.matrixWorld), i = n.distanceTo(s), r = (t[1] - t[0]) / (e.far - e.near), a = t[1] - r * e.far;
    return Math.round(r * i + a);
  }
}
const gr = (o) => Math.abs(o) < 1e-10 ? 0 : o;
function pl(o, e, t = "") {
  let n = "matrix3d(";
  for (let s = 0; s !== 16; s++)
    n += gr(e[s] * o.elements[s]) + (s !== 15 ? "," : ")");
  return t + n;
}
const Lm = /* @__PURE__ */ ((o) => (e) => pl(e, o))([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]), Fm = /* @__PURE__ */ ((o) => (e, t) => pl(e, o(t), "translate(-50%,-50%)"))((o) => [1 / o, 1 / o, 1 / o, 1, -1 / o, -1 / o, -1 / o, -1, 1 / o, 1 / o, 1 / o, 1, 1, 1, 1, 1]), km = ["geometry", "material"];
/* @__PURE__ */ defineComponent({
  __name: "HTML",
  props: {
    geometry: { default: new PlaneGeometry() },
    material: {},
    as: { default: "div" },
    transform: { type: Boolean, default: false },
    portal: {},
    wrapperClass: {},
    eps: { default: 1e-4 },
    distanceFactor: {},
    fullscreen: { type: Boolean },
    center: { type: Boolean },
    pointerEvents: { default: "auto" },
    sprite: { type: Boolean, default: false },
    zIndexRange: { default: () => [16777271, 0] },
    occlude: { type: [Array, Boolean, String] }
  },
  emits: ["onOcclude"],
  setup(o, { emit: e }) {
    const t = o, n = e, s = useSlots(), i = useAttrs(), r = ref(), a = ref(), {
      geometry: l,
      material: c,
      as: u,
      transform: h2,
      portal: f,
      wrapperClass: p,
      eps: y,
      distanceFactor: g2,
      fullscreen: v2,
      center: d,
      pointerEvents: w,
      sprite: x2,
      occlude: T,
      zIndexRange: P2
    } = toRefs(t), { renderer: S, scene: M2, camera: m2, raycaster: b, sizes: _2 } = dr(), I2 = computed(() => (void 0).createElement(u.value)), R = ref([0, 0]), z = ref(0), k = ref(), G2 = computed(() => h2.value ? {
      position: "absolute",
      top: 0,
      left: 0,
      width: `${_2.width.value}px`,
      height: `${_2.height.value}px`,
      transformStyle: "preserve-3d",
      pointerEvents: "none",
      zIndex: 2,
      willChange: "transform"
    } : {
      position: "absolute",
      transform: d.value ? "translate3d(-50%,-50%,0)" : "none",
      ...v2.value && {
        top: -_2.height.value / 2,
        left: -_2.width.value / 2,
        width: `${_2.width.value}px`,
        height: `${_2.height.value}px`
      },
      zIndex: 2,
      ...i.style,
      willChange: "transform"
    }), U = computed(() => ({
      position: "absolute",
      pointerEvents: w.value
    })), q = ref(null), $2 = ref(false), te = computed(
      () => (T == null ? void 0 : T.value) && (T == null ? void 0 : T.value) !== "blending" || Array.isArray(T == null ? void 0 : T.value) && (T == null ? void 0 : T.value.length) && isRef(T.value[0])
    );
    watch(
      () => T,
      (C) => {
        C && C === "blending" ? (I2.value.style.zIndex = `${Math.floor(P2.value[0] / 2)}`, I2.value.style.position = "absolute", I2.value.style.pointerEvents = "none") : (I2.value.style.zIndex = null, I2.value.style.position = null, I2.value.style.pointerEvents = null);
      }
    ), watch(
      () => {
        var C;
        return [r.value, S.value, _2.width.value, _2.height.value, (C = s.default) == null ? void 0 : C.call(s)];
      },
      ([C, B]) => {
        var L, O, N, E2, A2, D;
        if (C && B) {
          const W2 = (f == null ? void 0 : f.value) || B.domElement;
          if ((L = M2.value) == null || L.updateMatrixWorld(), h2.value)
            I2.value.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";
          else {
            const Y = qo(C, m2.value, {
              width: _2.width.value,
              height: _2.height.value
            });
            I2.value.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${Y[0]}px,${Y[1]}px,0);transform-origin:0 0;`;
          }
          W2 && !I2.value.parentNode && ((O = W2.parentNode) == null || O.appendChild(I2.value)), h2.value ? k.value = createVNode("div", { id: "outer", style: G2.value }, [
            createVNode("div", { id: "inner", style: U.value }, [
              createVNode("div", {
                key: (N = a.value) == null ? void 0 : N.uuid,
                id: M2 == null ? void 0 : M2.value.uuid,
                class: i.class,
                style: i.style
              }, (E2 = s.default) == null ? void 0 : E2.call(s))
            ])
          ]) : k.value = createVNode("div", {
            key: (A2 = a.value) == null ? void 0 : A2.uuid,
            id: M2 == null ? void 0 : M2.value.uuid,
            style: G2.value
          }, (D = s.default) == null ? void 0 : D.call(s)), render(k.value, I2.value);
        }
      }
    ), watchEffect(() => {
      p != null && p.value && (I2.value.className = p.value);
    });
    const ee2 = ref(true), { onLoop: oe2 } = G$1();
    oe2(() => {
      var C, B, L, O, N, E2, A2;
      if (r.value && m2.value && S.value) {
        (C = m2.value) == null || C.updateMatrixWorld(), r.value.updateWorldMatrix(true, false);
        const D = h2.value ? R.value : qo(r.value, m2.value, {
          width: _2.width.value || 0,
          height: _2.height.value || 0
        });
        if (h2.value || Math.abs(z.value - m2.value.zoom) > y.value || Math.abs(R.value[0] - D[0]) > y.value || Math.abs(R.value[1] - D[1]) > y.value) {
          const W2 = Im(r.value, m2.value);
          let Y = false;
          te.value && (Array.isArray(T == null ? void 0 : T.value) ? Y = T == null ? void 0 : T.value : (T == null ? void 0 : T.value) !== "blending" && (Y = [M2.value]));
          const j2 = ee2.value;
          if (Y) {
            const se = Rm(
              r.value,
              m2.value,
              b.value,
              Y
            );
            ee2.value = se && !W2;
          } else
            ee2.value = !W2;
          j2 !== ee2.value && (n("onOcclude", !ee2.value), I2.value.style.display = ee2.value ? "block" : "none");
          const J2 = Math.floor(P2.value[0] / 2), ne = T != null && T.value ? te.value ? [P2.value[0], J2] : [J2 - 1, 0] : P2.value;
          if (I2.value.style.zIndex = `${Om(r.value, m2.value, ne)}`, I2.value.style.willChange = "transform", h2.value) {
            const [se, V2] = [
              _2.width.value / 2,
              _2.height.value / 2
            ], F2 = m2.value.projectionMatrix.elements[5] * V2, { isOrthographicCamera: re2, top: fe2, left: Me, bottom: Xe, right: je } = m2.value, _t = Lm(m2.value.matrixWorldInverse), nn = re2 ? `scale(${F2})translate(${gr(-(je + Me) / 2)}px,${gr((fe2 + Xe) / 2)}px)` : `translateZ(${F2}px)`;
            let gt = r.value.matrixWorld;
            x2.value && (gt = m2.value.matrixWorldInverse.clone().transpose().copyPosition(gt).scale(r.value.scale), gt.elements[3] = gt.elements[7] = gt.elements[11] = 0, gt.elements[15] = 1), I2.value.style.width = `${_2.width.value}px`, I2.value.style.height = `${_2.height.value}px`, I2.value.style.perspective = re2 ? "" : `${F2}px`, (B = k.value) != null && B.el && ((L = k.value) != null && L.children) && (k.value.el.style.willChange = "transform", k.value.el.style.transform = `${nn}${_t}translate(${se}px,${V2}px)`, k.value.children[0].willChange = "transform", k.value.children[0].el.style.transform = Fm(
              gt,
              1 / (((g2 == null ? void 0 : g2.value) || 10) / 400)
            ));
          } else {
            const se = (g2 == null ? void 0 : g2.value) === void 0 ? 1 : Dm(r.value, m2.value) * (g2 == null ? void 0 : g2.value);
            I2.value.style.transform = `translate3d(${D[0]}px,${D[1]}px,0) scale(${se})`;
          }
        }
        R.value = D, z.value = m2.value.zoom;
      }
      if (!te.value && a.value && !$2.value)
        if (h2.value) {
          if ((O = k.value) != null && O.el && ((N = k.value) != null && N.children)) {
            const D = (E2 = k.value) == null ? void 0 : E2.children[0];
            if (D != null && D.clientWidth && (D != null && D.clientHeight)) {
              const { isOrthographicCamera: W2 } = m2.value;
              if (W2 || l)
                i.scale && (Array.isArray(i.scale) ? i.scale instanceof Vector3 ? a.value.scale.copy(i.scale.clone().divideScalar(1)) : a.value.scale.set(1 / i.scale[0], 1 / i.scale[1], 1 / i.scale[2]) : a.value.scale.setScalar(1 / i.scale));
              else {
                const Y = ((g2 == null ? void 0 : g2.value) || 10) / 400, j2 = D.clientWidth * Y, J2 = D.clientHeight * Y;
                a.value.scale.set(j2, J2, 1);
              }
              $2.value = true;
            }
          }
        } else {
          const D = I2.value.children[0];
          if (D != null && D.clientWidth && (D != null && D.clientHeight)) {
            const Y = D.clientWidth * 1, j2 = D.clientHeight * 1;
            a.value.scale.set(Y, j2, 1), $2.value = true;
          }
          q.value.lookAt((A2 = m2.value) == null ? void 0 : A2.position);
        }
    });
    const de2 = computed(() => ({
      vertexShader: h2.value ? void 0 : Am,
      fragmentShader: Pm
    })), xe = computed(() => {
      const C = de2.value;
      return c.value || new ShaderMaterial({
        vertexShader: C.vertexShader,
        fragmentShader: C.fragmentShader,
        side: DoubleSide
      });
    });
    return (C, B) => (openBlock(), createElementBlock("TresGroup", {
      ref_key: "groupRef",
      ref: r
    }, [
      unref(T) && !te.value ? (openBlock(), createElementBlock("TresMesh", {
        key: 0,
        ref_key: "meshRef",
        ref: a,
        geometry: unref(l),
        material: xe.value
      }, null, 8, km)) : createCommentVNode("", true)
    ], 512));
  }
});
const vertexShader = `
vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise
  float cnoise(vec3 P)
  {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  uniform float u_time;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_bass;
  uniform float u_high;
  uniform float u_partical_size;
  uniform vec3 u_color_a;
  varying vec2 v_uv;
  varying float v_displacement;

  void main() {
    v_uv = uv;
    v_displacement = cnoise(position + vec3(u_time * u_speed));
    
    // Use intensity + bass for punch
    float distort = u_intensity + (u_bass * 0.5);
    
    v_displacement = v_displacement * distort;
    
    // Fix: Displace along the normal (radial direction)
    // Since it's a sphere centered at 0, normalize(position) gives the normal.
    vec3 newPos = position + (normalize(position) * v_displacement);
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = u_partical_size * (1.0 / - viewPosition.z);
  }
`;
const fragmentShader = `
uniform float u_time;
uniform float u_high;
  uniform vec3 u_color_a;
  uniform vec3 u_color_b;
  varying vec2 v_uv;
  varying float v_displacement;

  void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = step(0.5, strength);
    strength = 1.0 - strength;

    vec3 color = mix(u_color_a, u_color_b, clamp(v_displacement, 0.0, 1.0));
    
    // Highs boost the brightness of the EXISTING color (preserving hue)
    // instead of washing it out with white
    color += color * (u_high * 2.5);
    
    color = mix(vec3(0.0), color, strength);
    
    // Clamp to prevent weird bloom artifacts
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Sphere",
  __ssrInlineRender: true,
  props: {
    uniforms: {
      type: Object,
      default: {
        u_time: {
          value: 0
        },
        u_speed: {
          value: 1
        },
        u_intensity: {
          value: 0.15
        },
        u_partical_size: {
          value: 265
        },
        u_color_a: {
          value: "#3f3089"
        },
        u_color_b: {
          value: "#00bcff"
        },
        u_bass: { value: 0 },
        u_high: { value: 0 }
      }
    }
  },
  setup(__props) {
    const props = __props;
    const geometry = new IcosahedronGeometry(4, 25);
    const material = new ShaderMaterial({
      blending: AdditiveBlending,
      uniforms: {
        ...props.uniforms,
        u_color_a: { value: new Color(props.uniforms.u_color_a.value) },
        u_color_b: { value: new Color(props.uniforms.u_color_b.value) }
      },
      fragmentShader,
      vertexShader,
      depthWrite: false
    });
    const dot = new Points(geometry, material);
    dot.renderOrder = 1;
    watch(() => props.uniforms.u_color_a.value, (newValue) => {
      console.log("Sphere Color A update:", newValue);
      material.uniforms.u_color_a.value = new Color(newValue);
    });
    watch(() => props.uniforms.u_color_b.value, (newValue) => {
      console.log("Sphere Color B update:", newValue);
      material.uniforms.u_color_b.value = new Color(newValue);
    });
    watch(() => props.uniforms.u_speed.value, (newValue) => {
      material.uniforms.u_speed.value = newValue;
    });
    watch(() => props.uniforms.u_intensity.value, (newValue) => {
      material.uniforms.u_intensity.value = newValue;
    });
    watch(() => props.uniforms.u_bass.value, (newValue) => {
      material.uniforms.u_bass.value = newValue;
    });
    watch(() => props.uniforms.u_high.value, (newValue) => {
      material.uniforms.u_high.value = newValue;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<primitive${ssrRenderAttrs(mergeProps({ object: unref(dot) }, _attrs))}></primitive>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sphere.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$4, { __name: "Sphere" });
const G = Symbol(), m = (l) => {
  const t = inject(G), e = shallowRef(null), n = shallowRef(null), { scene: o, camera: a } = dr();
  watchEffect(() => {
    !a.value || !(n != null && n.value) || (n.value.mainCamera = a.value);
  });
  let s = () => {
  };
  return s = watchEffect(() => {
    !a.value || !(t != null && t.value) || !o.value || (s(), !n.value && (n.value = l(), e.value = new EffectPass(a.value, n.value), t.value.addPass(e.value)));
  }), {
    pass: e,
    effect: n
  };
}, W = /([^[.\]])+/g, ee = (l, t) => {
  if (!t)
    return;
  const e = Array.isArray(t) ? t : t.match(W);
  return e == null ? void 0 : e.reduce((n, o) => n && n[o], l);
}, A = (l, t, e) => {
  const n = Array.isArray(t) ? t : t.match(W);
  n && n.reduce((o, a, s) => (o[a] === void 0 && (o[a] = {}), s === n.length - 1 && (o[a] = e), o[a]), l);
}, E = (l, t) => {
  const e = { ...l };
  return t.forEach((n) => delete e[n]), e;
}, j = (l, t, e, n, o = {}) => watch(
  l,
  (a) => {
    var s;
    if (t.value)
      if (a === void 0) {
        const r = n();
        A(t.value, e, ee(r, e)), (s = r.dispose) == null || s.call(r);
      } else
        A(t.value, e, l());
  },
  o
), x = (l, t, e) => l.map(([n, o]) => j(
  n,
  t,
  o,
  e
)), _ = (l, t, e) => Object.keys(l).map((n) => j(
  () => l[n],
  t,
  n,
  e
)), ae = /* @__PURE__ */ defineComponent({
  __name: "Bloom",
  props: {
    blendFunction: {},
    intensity: {},
    kernelSize: {},
    luminanceThreshold: {},
    luminanceSmoothing: {},
    mipmapBlur: { type: Boolean, default: void 0 }
  },
  setup(l, { expose: t }) {
    const e = l, { pass: n, effect: o } = m(() => new BloomEffect(e));
    return t({ pass: n, effect: o }), x(
      [
        // blendFunction is not updated, because it has no setter in BloomEffect
        [() => e.intensity, "intensity"],
        [() => e.kernelSize, "kernelSize"],
        [() => e.luminanceSmoothing, "luminanceMaterial.smoothing"],
        [() => e.luminanceThreshold, "luminanceMaterial.threshold"]
      ],
      o,
      () => new BloomEffect()
    ), (a, s) => null;
  }
});
let v;
function M() {
  var l;
  if (v !== void 0)
    return v;
  try {
    let t;
    const e = (void 0).createElement("canvas");
    return v = !!((void 0).WebGL2RenderingContext && (t = e.getContext("webgl2"))), t && ((l = t.getExtension("WEBGL_lose_context")) == null || l.loseContext()), v;
  } catch {
    return v = false;
  }
}
const re = /* @__PURE__ */ defineComponent({
  __name: "EffectComposer",
  props: {
    enabled: { type: Boolean, default: true },
    children: {},
    depthBuffer: { type: Boolean, default: void 0 },
    disableNormalPass: { type: Boolean, default: false },
    stencilBuffer: { type: Boolean, default: void 0 },
    resolutionScale: {},
    autoClear: { type: Boolean, default: true },
    multisampling: { default: 0 },
    frameBufferType: { default: HalfFloatType }
  },
  setup(l, { expose: t }) {
    const e = l, { scene: n, camera: o, renderer: a, sizes: s } = dr(), r = shallowRef(null);
    let i = null, c = null;
    provide(G, r), t({ composer: r });
    const f = () => {
      r.value && (c = new NormalPass(n.value, o.value), c.enabled = false, r.value.addPass(c), e.resolutionScale !== void 0 && M() && (i = new DepthDownsamplingPass({
        normalBuffer: c.texture,
        resolutionScale: e.resolutionScale
      }), i.enabled = false, r.value.addPass(i)));
    }, B = computed(() => {
      const u = new EffectComposer(), p = {
        depthBuffer: e.depthBuffer !== void 0 ? e.depthBuffer : u.inputBuffer.depthBuffer,
        stencilBuffer: e.stencilBuffer !== void 0 ? e.stencilBuffer : u.inputBuffer.stencilBuffer,
        multisampling: M() ? e.multisampling !== void 0 ? e.multisampling : u.multisampling : 0,
        frameBufferType: e.frameBufferType !== void 0 ? e.frameBufferType : HalfFloatType
      };
      return u.dispose(), p;
    }), y = () => {
      !a.value && !n.value && !o.value || (r.value = new EffectComposer(a.value, B.value), r.value.addPass(new RenderPass(n.value, o.value)), e.disableNormalPass || f());
    };
    watch([a, n, o, () => e.disableNormalPass], () => {
      !s.width.value || !s.height.value || y();
    }), watch(() => [s.width.value, s.height.value], ([u, p]) => {
      !u && !p || (r.value ? r.value.setSize(u, p) : y());
    }, {
      immediate: true
    });
    const { onLoop: X } = G$1();
    return X(({ delta: u }) => {
      if (e.enabled && a.value && r.value && s.width.value && s.height.value) {
        const p = a.value.autoClear;
        a.value.autoClear = e.autoClear, e.stencilBuffer && !e.autoClear && a.value.clearStencil(), r.value.render(u), a.value.autoClear = p;
      }
    }), (u, p) => renderSlot(u.$slots, "default");
  }
});
/* @__PURE__ */ defineComponent({
  __name: "Vignette",
  props: {
    technique: { default: VignetteTechnique.DEFAULT },
    blendFunction: { default: BlendFunction.NORMAL },
    offset: { default: 0.5 },
    darkness: { default: 0.5 }
  },
  setup(l, { expose: t }) {
    const e = l, { pass: n, effect: o } = m(() => new VignetteEffect(e));
    return t({ pass: n, effect: o }), _(
      E(e, ["blendFunction"]),
      o,
      () => new VignetteEffect()
    ), (a, s) => null;
  }
});
const de = /* @__PURE__ */ defineComponent({
  __name: "Noise",
  props: {
    premultiply: { type: Boolean, default: false },
    blendFunction: { default: BlendFunction.SCREEN }
  },
  setup(l, { expose: t }) {
    const e = l, { pass: n, effect: o } = m(() => new NoiseEffect(e));
    return t({ pass: n, effect: o }), _(
      E(e, ["blendFunction"]),
      o,
      () => new NoiseEffect()
    ), (a, s) => null;
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Plane",
  __ssrInlineRender: true,
  props: {
    intensity: {
      type: Number,
      default: 0
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><TresAmbientLight></TresAmbientLight>`);
      _push(ssrRenderComponent(unref(lg), {
        rotation: [-Math.PI * 0.5, 0, 0],
        position: [0, -4.5, 0],
        clipBias: 3e-3,
        textureWidth: 1e3,
        textureHeight: 1e3,
        color: "#333333"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<TresCircleGeometry${ssrRenderAttr("args", [17, 1024])}${_scopeId}></TresCircleGeometry>`);
          } else {
            return [
              createVNode("TresCircleGeometry", { args: [17, 1024] })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(re), { "depth-buffer": true }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(de), { premultiply: "" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ae), {
              intensity: props.intensity,
              "luminance-threshold": 0.4,
              "luminance-smoothing": 0.5,
              "mipmap-blur": true,
              "blend-function": unref(BlendFunction).ADD
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(de), { premultiply: "" }),
              createVNode(unref(ae), {
                intensity: props.intensity,
                "luminance-threshold": 0.4,
                "luminance-smoothing": 0.5,
                "mipmap-blur": true,
                "blend-function": unref(BlendFunction).ADD
              }, null, 8, ["intensity", "blend-function"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Plane.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$3, { __name: "Plane" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const player = usePlayerStore();
    const uniforms = computed(() => player.uniforms);
    computed(() => player.getAudioContext());
    new Clock();
    const bloomIntensity = ref(50);
    function scaleValue(value, minInput, maxInput, minOutput, maxOutput) {
      value = Math.min(Math.max(value, minInput), maxInput);
      const normalizedValue = (value - minInput) / (maxInput - minInput);
      return normalizedValue * (maxOutput - minOutput) + minOutput;
    }
    const cameraPosition = new Vector3(0, 0, 40);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UApp = __nuxt_component_0;
      const _component_Overflow = __nuxt_component_1;
      const _component_TrackTitle = __nuxt_component_2;
      const _component_TresCanvas = __nuxt_component_3;
      const _component_OrbitControls = xg;
      const _component_Sphere = __nuxt_component_5;
      const _component_Plane = __nuxt_component_6;
      _push(ssrRenderComponent(_component_UApp, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Overflow, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TrackTitle, {
              key: `${unref(player).trackList[unref(player).currentTrack.index]?.name || "empty"}-${unref(player).currentTrack.index}`,
              text: (unref(player).trackList[unref(player).currentTrack.index]?.name?.replace(/\.[^/.]+$/, "") || "").toUpperCase(),
              visible: unref(player).currentTime - unref(player).currentTrack.startTime < 8
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TresCanvas, {
              "window-size": "",
              antialias: true,
              alpha: true,
              transparent: false,
              clearColor: "#000000",
              "output-encoding": unref(SRGBColorSpace)
            }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<TresPerspectiveCamera${ssrRenderAttr("position", unref(cameraPosition))}${ssrRenderAttr("fov", 20)}${_scopeId2}></TresPerspectiveCamera>`);
                  _push3(ssrRenderComponent(_component_OrbitControls, {
                    autoRotate: true,
                    autoRotateSpeed: 0.03,
                    enableZoom: false,
                    enablePan: false,
                    minPolarAngle: Math.PI / 2,
                    maxPolarAngle: Math.PI / 2
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Sphere, { uniforms: uniforms.value }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Plane, {
                    intensity: scaleValue(bloomIntensity.value, 0, 250, 0, 4)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("TresPerspectiveCamera", {
                      position: unref(cameraPosition),
                      fov: 20
                    }, null, 8, ["position"]),
                    createVNode(_component_OrbitControls, {
                      autoRotate: true,
                      autoRotateSpeed: 0.03,
                      enableZoom: false,
                      enablePan: false,
                      minPolarAngle: Math.PI / 2,
                      maxPolarAngle: Math.PI / 2
                    }, null, 8, ["minPolarAngle", "maxPolarAngle"]),
                    createVNode(_component_Sphere, { uniforms: uniforms.value }, null, 8, ["uniforms"]),
                    createVNode(_component_Plane, {
                      intensity: scaleValue(bloomIntensity.value, 0, 250, 0, 4)
                    }, null, 8, ["intensity"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Overflow),
              (openBlock(), createBlock(_component_TrackTitle, {
                key: `${unref(player).trackList[unref(player).currentTrack.index]?.name || "empty"}-${unref(player).currentTrack.index}`,
                text: (unref(player).trackList[unref(player).currentTrack.index]?.name?.replace(/\.[^/.]+$/, "") || "").toUpperCase(),
                visible: unref(player).currentTime - unref(player).currentTrack.startTime < 8
              }, null, 8, ["text", "visible"])),
              createVNode(_component_TresCanvas, {
                "window-size": "",
                antialias: true,
                alpha: true,
                transparent: false,
                clearColor: "#000000",
                "output-encoding": unref(SRGBColorSpace)
              }, {
                default: withCtx(() => [
                  createVNode("TresPerspectiveCamera", {
                    position: unref(cameraPosition),
                    fov: 20
                  }, null, 8, ["position"]),
                  createVNode(_component_OrbitControls, {
                    autoRotate: true,
                    autoRotateSpeed: 0.03,
                    enableZoom: false,
                    enablePan: false,
                    minPolarAngle: Math.PI / 2,
                    maxPolarAngle: Math.PI / 2
                  }, null, 8, ["minPolarAngle", "maxPolarAngle"]),
                  createVNode(_component_Sphere, { uniforms: uniforms.value }, null, 8, ["uniforms"]),
                  createVNode(_component_Plane, {
                    intensity: scaleValue(bloomIntensity.value, 0, 250, 0, 4)
                  }, null, 8, ["intensity"])
                ]),
                _: 1
              }, 8, ["output-encoding"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-CC_iq216.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-Dg68ueT-.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, __nuxt_component_0$2 as a, entry$1 as default, useHead as u };
//# sourceMappingURL=server.mjs.map
