(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
} //# sourceMappingURL=querystring.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
} //# sourceMappingURL=is-local-url.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
} //# sourceMappingURL=error-once.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _types = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/components/segment-cache/types.js [app-client] (ecmascript)");
const _erroronce = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    if (typeof window !== 'undefined') {
        const { nodeName } = e.currentTarget;
        // anchors inside an svg have a lowercase nodeName
        const isAnchorNodeName = nodeName.toUpperCase() === 'A';
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
            // ignore click for browser’s default behavior
            return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
            if (replace) {
                // browser default behavior does not replace the history state
                // so we need to do it manually
                e.preventDefault();
                location.replace(href);
            }
            // ignore click for browser’s default behavior
            return;
        }
        e.preventDefault();
        if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
                preventDefault: ()=>{
                    isDefaultPrevented = true;
                }
            });
            if (isDefaultPrevented) {
                return;
            }
        }
        const { dispatchNavigateAction } = __turbopack_context__.r("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
        _react.default.startTransition(()=>{
            dispatchNavigateAction(as || href, replace ? 'replace' : 'push', scroll ?? true, linkInstanceRef.current);
        });
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _types.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
    }["LinkComponent.useMemo"], [
        hrefProp,
        asProp
    ]);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw Object.defineProperty(new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${hrefProp}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${hrefProp}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _erroronce.errorOnce)('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _types.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _types.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "K",
    ()=>K,
    "compositionTypes",
    ()=>compositionTypes,
    "cssVarPrefix",
    ()=>cssVarPrefix,
    "cssVariableMatchRgx",
    ()=>cssVariableMatchRgx,
    "digitWithExponentRgx",
    ()=>digitWithExponentRgx,
    "doc",
    ()=>doc,
    "emptyString",
    ()=>emptyString,
    "hexTestRgx",
    ()=>hexTestRgx,
    "hslExecRgx",
    ()=>hslExecRgx,
    "hslaExecRgx",
    ()=>hslaExecRgx,
    "isBrowser",
    ()=>isBrowser,
    "isDomSymbol",
    ()=>isDomSymbol,
    "isRegisteredTargetSymbol",
    ()=>isRegisteredTargetSymbol,
    "isSvgSymbol",
    ()=>isSvgSymbol,
    "lowerCaseRgx",
    ()=>lowerCaseRgx,
    "maxFps",
    ()=>maxFps,
    "maxValue",
    ()=>maxValue,
    "minValue",
    ()=>minValue,
    "morphPointsSymbol",
    ()=>morphPointsSymbol,
    "noop",
    ()=>noop,
    "proxyTargetSymbol",
    ()=>proxyTargetSymbol,
    "relativeValuesExecRgx",
    ()=>relativeValuesExecRgx,
    "rgbExecRgx",
    ()=>rgbExecRgx,
    "rgbaExecRgx",
    ()=>rgbaExecRgx,
    "shortTransforms",
    ()=>shortTransforms,
    "tickModes",
    ()=>tickModes,
    "transformsExecRgx",
    ()=>transformsExecRgx,
    "transformsFragmentStrings",
    ()=>transformsFragmentStrings,
    "transformsSymbol",
    ()=>transformsSymbol,
    "tweenTypes",
    ()=>tweenTypes,
    "unitsExecRgx",
    ()=>unitsExecRgx,
    "validTransforms",
    ()=>validTransforms,
    "valueTypes",
    ()=>valueTypes,
    "win",
    ()=>win
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ // Environments
// TODO: Do we need to check if we're running inside a worker ?
const isBrowser = typeof window !== 'undefined';
/** @type {Window & {AnimeJS: Array}|null} */ const win = isBrowser ? window : null;
/** @type {Document|null} */ const doc = isBrowser ? document : null;
// Enums
/** @enum {Number} */ const tweenTypes = {
    OBJECT: 0,
    ATTRIBUTE: 1,
    CSS: 2,
    TRANSFORM: 3,
    CSS_VAR: 4
};
/** @enum {Number} */ const valueTypes = {
    NUMBER: 0,
    UNIT: 1,
    COLOR: 2,
    COMPLEX: 3
};
/** @enum {Number} */ const tickModes = {
    NONE: 0,
    AUTO: 1,
    FORCE: 2
};
/** @enum {Number} */ const compositionTypes = {
    replace: 0,
    none: 1,
    blend: 2
};
// Cache symbols
const isRegisteredTargetSymbol = Symbol();
const isDomSymbol = Symbol();
const isSvgSymbol = Symbol();
const transformsSymbol = Symbol();
const morphPointsSymbol = Symbol();
const proxyTargetSymbol = Symbol();
// Numbers
const minValue = 1e-11;
const maxValue = 1e12;
const K = 1e3;
const maxFps = 120;
// Strings
const emptyString = '';
const cssVarPrefix = 'var(';
const shortTransforms = /*#__PURE__*/ (()=>{
    const map = new Map();
    map.set('x', 'translateX');
    map.set('y', 'translateY');
    map.set('z', 'translateZ');
    return map;
})();
const validTransforms = [
    'translateX',
    'translateY',
    'translateZ',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scale',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skew',
    'skewX',
    'skewY',
    'matrix',
    'matrix3d',
    'perspective'
];
const transformsFragmentStrings = /*#__PURE__*/ validTransforms.reduce((a, v)=>({
        ...a,
        [v]: v + '('
    }), {});
// Functions
/** @return {void} */ const noop = ()=>{};
// Regex
const hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
const rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
const rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
const hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
const hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
// export const digitWithExponentRgx = /[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g;
const digitWithExponentRgx = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi;
// export const unitsExecRgx = /^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)+([a-z]+|%)$/i;
const unitsExecRgx = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i;
const lowerCaseRgx = /([a-z])([A-Z])/g;
const transformsExecRgx = /(\w+)(\([^)]+\)+)/g; // Match inline transforms with cacl() values, returns the value wrapped in ()
const relativeValuesExecRgx = /(\*=|\+=|-=)/;
const cssVariableMatchRgx = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaults",
    ()=>defaults,
    "globalVersions",
    ()=>globalVersions,
    "globals",
    ()=>globals,
    "scope",
    ()=>scope
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
;
/**
 * @import {
 *   DefaultsParams,
 *   DOMTarget,
 * } from '../types/index.js'
 *
 * @import {
 *   Scope,
 * } from '../scope/index.js'
*/ /** @type {DefaultsParams} */ const defaults = {
    id: null,
    keyframes: null,
    playbackEase: null,
    playbackRate: 1,
    frameRate: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxFps"],
    loop: 0,
    reversed: false,
    alternate: false,
    autoplay: true,
    persist: false,
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"],
    delay: 0,
    loopDelay: 0,
    ease: 'out(2)',
    composition: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].replace,
    modifier: (v)=>v,
    onBegin: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    onBeforeUpdate: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    onUpdate: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    onLoop: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    onPause: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    onComplete: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    onRender: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]
};
const scope = {
    /** @type {Scope} */ current: null,
    /** @type {Document|DOMTarget} */ root: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"]
};
const globals = {
    /** @type {DefaultsParams} */ defaults,
    /** @type {Number} */ precision: 4,
    /** @type {Number} equals 1 in ms mode, 0.001 in s mode */ timeScale: 1,
    /** @type {Number} */ tickThreshold: 200
};
const globalVersions = {
    version: '4.2.2',
    engine: null
};
if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"]) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["win"].AnimeJS) __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["win"].AnimeJS = [];
    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["win"].AnimeJS.push(globalVersions);
}
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PI",
    ()=>PI,
    "_round",
    ()=>_round,
    "abs",
    ()=>abs,
    "addChild",
    ()=>addChild,
    "asin",
    ()=>asin,
    "atan2",
    ()=>atan2,
    "ceil",
    ()=>ceil,
    "clamp",
    ()=>clamp,
    "clampInfinity",
    ()=>clampInfinity,
    "cloneArray",
    ()=>cloneArray,
    "cos",
    ()=>cos,
    "exp",
    ()=>exp,
    "floor",
    ()=>floor,
    "forEachChildren",
    ()=>forEachChildren,
    "isArr",
    ()=>isArr,
    "isCol",
    ()=>isCol,
    "isFnc",
    ()=>isFnc,
    "isHex",
    ()=>isHex,
    "isHsl",
    ()=>isHsl,
    "isKey",
    ()=>isKey,
    "isNil",
    ()=>isNil,
    "isNum",
    ()=>isNum,
    "isObj",
    ()=>isObj,
    "isRgb",
    ()=>isRgb,
    "isStr",
    ()=>isStr,
    "isSvg",
    ()=>isSvg,
    "isUnd",
    ()=>isUnd,
    "isValidSVGAttribute",
    ()=>isValidSVGAttribute,
    "lerp",
    ()=>lerp,
    "max",
    ()=>max,
    "mergeObjects",
    ()=>mergeObjects,
    "normalizeTime",
    ()=>normalizeTime,
    "now",
    ()=>now,
    "parseNumber",
    ()=>parseNumber,
    "pow",
    ()=>pow,
    "removeChild",
    ()=>removeChild,
    "round",
    ()=>round,
    "sin",
    ()=>sin,
    "snap",
    ()=>snap,
    "sqrt",
    ()=>sqrt,
    "stringStartsWith",
    ()=>stringStartsWith,
    "toLowerCase",
    ()=>toLowerCase
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)");
;
;
/**
 * @import {
 *   Target,
 *   DOMTarget,
 * } from '../types/index.js'
*/ // Strings
/**
 * @param  {String} str
 * @return {String}
 */ const toLowerCase = (str)=>str.replace(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerCaseRgx"], '$1-$2').toLowerCase();
/**
 * Prioritize this method instead of regex when possible
 * @param  {String} str
 * @param  {String} sub
 * @return {Boolean}
 */ const stringStartsWith = (str, sub)=>str.indexOf(sub) === 0;
// Note: Date.now is used instead of performance.now since it is precise enough for timings calculations, performs slightly faster and works in Node.js environement.
const now = Date.now;
// Types checkers
const isArr = Array.isArray;
/**@param {any} a @return {a is Record<String, any>} */ const isObj = (a)=>a && a.constructor === Object;
/**@param {any} a @return {a is Number} */ const isNum = (a)=>typeof a === 'number' && !isNaN(a);
/**@param {any} a @return {a is String} */ const isStr = (a)=>typeof a === 'string';
/**@param {any} a @return {a is Function} */ const isFnc = (a)=>typeof a === 'function';
/**@param {any} a @return {a is undefined} */ const isUnd = (a)=>typeof a === 'undefined';
/**@param {any} a @return {a is null | undefined} */ const isNil = (a)=>isUnd(a) || a === null;
/**@param {any} a @return {a is SVGElement} */ const isSvg = (a)=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"] && a instanceof SVGElement;
/**@param {any} a @return {Boolean} */ const isHex = (a)=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexTestRgx"].test(a);
/**@param {any} a @return {Boolean} */ const isRgb = (a)=>stringStartsWith(a, 'rgb');
/**@param {any} a @return {Boolean} */ const isHsl = (a)=>stringStartsWith(a, 'hsl');
/**@param {any} a @return {Boolean} */ const isCol = (a)=>isHex(a) || isRgb(a) || isHsl(a);
/**@param {any} a @return {Boolean} */ const isKey = (a)=>!__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].defaults.hasOwnProperty(a);
// SVG
// Consider the following as CSS animation
// CSS opacity animation has better default values (opacity: 1 instead of 0))
// rotate is more commonly intended to be used as a transform
const svgCssReservedProperties = [
    'opacity',
    'rotate',
    'overflow',
    'color'
];
/**
 * @param  {Target} el
 * @param  {String} propertyName
 * @return {Boolean}
 */ const isValidSVGAttribute = (el, propertyName)=>{
    if (svgCssReservedProperties.includes(propertyName)) return false;
    if (el.getAttribute(propertyName) || propertyName in el) {
        if (propertyName === 'scale') {
            const elParentNode = /** @type {DOMTarget} */ el.parentNode;
            // Only consider scale as a valid SVG attribute on filter element
            return elParentNode && elParentNode.tagName === 'filter';
        }
        return true;
    }
};
// Number
/**
 * @param  {Number|String} str
 * @return {Number}
 */ const parseNumber = (str)=>isStr(str) ? parseFloat(str) : str;
// Math
const pow = Math.pow;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;
const exp = Math.exp;
const ceil = Math.ceil;
const floor = Math.floor;
const asin = Math.asin;
const max = Math.max;
const atan2 = Math.atan2;
const PI = Math.PI;
const _round = Math.round;
/**
 * Clamps a value between min and max bounds
 *
 * @param  {Number} v - Value to clamp
 * @param  {Number} min - Minimum boundary
 * @param  {Number} max - Maximum boundary
 * @return {Number}
 */ const clamp = (v, min, max)=>v < min ? min : v > max ? max : v;
const powCache = {};
/**
 * Rounds a number to specified decimal places
 *
 * @param  {Number} v - Value to round
 * @param  {Number} decimalLength - Number of decimal places
 * @return {Number}
 */ const round = (v, decimalLength)=>{
    if (decimalLength < 0) return v;
    if (!decimalLength) return _round(v);
    let p = powCache[decimalLength];
    if (!p) p = powCache[decimalLength] = 10 ** decimalLength;
    return _round(v * p) / p;
};
/**
 * Snaps a value to nearest increment or array value
 *
 * @param  {Number} v - Value to snap
 * @param  {Number|Array<Number>} increment - Step size or array of snap points
 * @return {Number}
 */ const snap = (v, increment)=>isArr(increment) ? increment.reduce((closest, cv)=>abs(cv - v) < abs(closest - v) ? cv : closest) : increment ? _round(v / increment) * increment : v;
/**
 * Linear interpolation between two values
 *
 * @param  {Number} start - Starting value
 * @param  {Number} end - Ending value
 * @param  {Number} factor - Interpolation factor in the range [0, 1]
 * @return {Number} The interpolated value
 */ const lerp = (start, end, factor)=>start + (end - start) * factor;
/**
 * Replaces infinity with maximum safe value
 *
 * @param  {Number} v - Value to check
 * @return {Number}
 */ const clampInfinity = (v)=>v === Infinity ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxValue"] : v === -Infinity ? -__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxValue"] : v;
/**
 * Normalizes time value with minimum threshold
 *
 * @param  {Number} v - Time value to normalize
 * @return {Number}
 */ const normalizeTime = (v)=>v <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] : clampInfinity(round(v, 11));
// Arrays
/**
 * @template T
 * @param    {T[]} a
 * @return   {T[]}
 */ const cloneArray = (a)=>isArr(a) ? [
        ...a
    ] : a;
// Objects
/**
 * @template T
 * @template U
 * @param    {T} o1
 * @param    {U} o2
 * @return   {T & U}
 */ const mergeObjects = (o1, o2)=>{
    const merged = {
        ...o1
    };
    for(let p in o2){
        const o1p = /** @type {T & U} */ o1[p];
        merged[p] = isUnd(o1p) ? /** @type {T & U} */ o2[p] : o1p;
    }
    return merged;
};
// Linked lists
/**
 * @param  {Object} parent
 * @param  {Function} callback
 * @param  {Boolean} [reverse]
 * @param  {String} [prevProp]
 * @param  {String} [nextProp]
 * @return {void}
 */ const forEachChildren = (parent, callback, reverse, prevProp = '_prev', nextProp = '_next')=>{
    let next = parent._head;
    let adjustedNextProp = nextProp;
    if (reverse) {
        next = parent._tail;
        adjustedNextProp = prevProp;
    }
    while(next){
        const currentNext = next[adjustedNextProp];
        callback(next);
        next = currentNext;
    }
};
/**
 * @param  {Object} parent
 * @param  {Object} child
 * @param  {String} [prevProp]
 * @param  {String} [nextProp]
 * @return {void}
 */ const removeChild = (parent, child, prevProp = '_prev', nextProp = '_next')=>{
    const prev = child[prevProp];
    const next = child[nextProp];
    prev ? prev[nextProp] = next : parent._head = next;
    next ? next[prevProp] = prev : parent._tail = prev;
    child[prevProp] = null;
    child[nextProp] = null;
};
/**
 * @param  {Object} parent
 * @param  {Object} child
 * @param  {Function} [sortMethod]
 * @param  {String} prevProp
 * @param  {String} nextProp
 * @return {void}
 */ const addChild = (parent, child, sortMethod, prevProp = '_prev', nextProp = '_next')=>{
    let prev = parent._tail;
    while(prev && sortMethod && sortMethod(prev, child))prev = prev[prevProp];
    const next = prev ? prev[nextProp] : parent._head;
    prev ? prev[nextProp] = child : parent._head = child;
    next ? next[prevProp] = child : parent._tail = child;
    child[prevProp] = prev;
    child[nextProp] = next;
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/targets.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNodeList",
    ()=>getNodeList,
    "parseTargets",
    ()=>parseTargets,
    "registerTargets",
    ()=>registerTargets
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
;
/**
* @import {
*   DOMTarget,
*   DOMTargetsParam,
*   JSTargetsArray,
*   TargetsParam,
*   JSTargetsParam,
*   TargetsArray,
*   DOMTargetsArray,
* } from '../types/index.js'
*/ /**
 * @param  {DOMTargetsParam|TargetsParam} v
 * @return {NodeList|HTMLCollection}
 */ function getNodeList(v) {
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStr"])(v) ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scope"].root.querySelectorAll(v) : v;
    if (n instanceof NodeList || n instanceof HTMLCollection) return n;
}
/**
 * @overload
 * @param  {DOMTargetsParam} targets
 * @return {DOMTargetsArray}
 *
 * @overload
 * @param  {JSTargetsParam} targets
 * @return {JSTargetsArray}
 *
 * @overload
 * @param  {TargetsParam} targets
 * @return {TargetsArray}
 *
 * @param  {DOMTargetsParam|JSTargetsParam|TargetsParam} targets
 */ function parseTargets(targets) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNil"])(targets)) return [];
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArr"])(targets) && targets.flat(Infinity) || [
        targets
    ];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArr"])(targets)) {
        const flattened = targets.flat(Infinity);
        /** @type {TargetsArray} */ const parsed = [];
        for(let i = 0, l = flattened.length; i < l; i++){
            const item = flattened[i];
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNil"])(item)) {
                const nodeList = getNodeList(item);
                if (nodeList) {
                    for(let j = 0, jl = nodeList.length; j < jl; j++){
                        const subItem = nodeList[j];
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNil"])(subItem)) {
                            let isDuplicate = false;
                            for(let k = 0, kl = parsed.length; k < kl; k++){
                                if (parsed[k] === subItem) {
                                    isDuplicate = true;
                                    break;
                                }
                            }
                            if (!isDuplicate) {
                                parsed.push(subItem);
                            }
                        }
                    }
                } else {
                    let isDuplicate = false;
                    for(let j = 0, jl = parsed.length; j < jl; j++){
                        if (parsed[j] === item) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        parsed.push(item);
                    }
                }
            }
        }
        return parsed;
    }
    const nodeList = getNodeList(targets);
    if (nodeList) return Array.from(nodeList);
    return [
        targets
    ];
}
/**
 * @overload
 * @param  {DOMTargetsParam} targets
 * @return {DOMTargetsArray}
 *
 * @overload
 * @param  {JSTargetsParam} targets
 * @return {JSTargetsArray}
 *
 * @overload
 * @param  {TargetsParam} targets
 * @return {TargetsArray}
 *
 * @param  {DOMTargetsParam|JSTargetsParam|TargetsParam} targets
 */ function registerTargets(targets) {
    const parsedTargetsArray = parseTargets(targets);
    const parsedTargetsLength = parsedTargetsArray.length;
    if (parsedTargetsLength) {
        for(let i = 0; i < parsedTargetsLength; i++){
            const target = parsedTargetsArray[i];
            if (!target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRegisteredTargetSymbol"]]) {
                target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRegisteredTargetSymbol"]] = true;
                const isSvgType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSvg"])(target);
                const isDom = /** @type {DOMTarget} */ target.nodeType || isSvgType;
                if (isDom) {
                    target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDomSymbol"]] = true;
                    target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSvgSymbol"]] = isSvgType;
                    target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsSymbol"]] = {};
                }
            }
        }
    }
    return parsedTargetsArray;
}
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/transforms.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseInlineTransforms",
    ()=>parseInlineTransforms
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
/**
* @import {
*   DOMTarget,
* } from '../types/index.js'
*/ /**
 * @param  {DOMTarget} target
 * @param  {String} propName
 * @param  {Object} animationInlineStyles
 * @return {String}
 */ const parseInlineTransforms = (target, propName, animationInlineStyles)=>{
    const inlineTransforms = target.style.transform;
    let inlinedStylesPropertyValue;
    if (inlineTransforms) {
        const cachedTransforms = target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsSymbol"]];
        let t;
        while(t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsExecRgx"].exec(inlineTransforms)){
            const inlinePropertyName = t[1];
            // const inlinePropertyValue = t[2];
            const inlinePropertyValue = t[2].slice(1, -1);
            cachedTransforms[inlinePropertyName] = inlinePropertyValue;
            if (inlinePropertyName === propName) {
                inlinedStylesPropertyValue = inlinePropertyValue;
                // Store the new parsed inline styles if animationInlineStyles is provided
                if (animationInlineStyles) {
                    animationInlineStyles[propName] = inlinePropertyValue;
                }
            }
        }
    }
    return inlineTransforms && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(inlinedStylesPropertyValue) ? inlinedStylesPropertyValue : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringStartsWith"])(propName, 'scale') ? '1' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringStartsWith"])(propName, 'rotate') || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringStartsWith"])(propName, 'skew') ? '0deg' : '0px';
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/colors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertColorStringValuesToRgbaArray",
    ()=>convertColorStringValuesToRgbaArray
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
/**
 * @import {
 *   ColorArray,
 * } from '../types/index.js'
*/ /**
 * RGB / RGBA Color value string -> RGBA values array
 * @param  {String} rgbValue
 * @return {ColorArray}
 */ const rgbToRgba = (rgbValue)=>{
    const rgba = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgbExecRgx"].exec(rgbValue) || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgbaExecRgx"].exec(rgbValue);
    const a = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(rgba[4]) ? +rgba[4] : 1;
    return [
        +rgba[1],
        +rgba[2],
        +rgba[3],
        a
    ];
};
/**
 * HEX3 / HEX3A / HEX6 / HEX6A Color value string -> RGBA values array
 * @param  {String} hexValue
 * @return {ColorArray}
 */ const hexToRgba = (hexValue)=>{
    const hexLength = hexValue.length;
    const isShort = hexLength === 4 || hexLength === 5;
    return [
        +('0x' + hexValue[1] + hexValue[isShort ? 1 : 2]),
        +('0x' + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]),
        +('0x' + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]),
        hexLength === 5 || hexLength === 9 ? +(+('0x' + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1
    ];
};
/**
 * @param  {Number} p
 * @param  {Number} q
 * @param  {Number} t
 * @return {Number}
 */ const hue2rgb = (p, q, t)=>{
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
};
/**
 * HSL / HSLA Color value string -> RGBA values array
 * @param  {String} hslValue
 * @return {ColorArray}
 */ const hslToRgba = (hslValue)=>{
    const hsla = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hslExecRgx"].exec(hslValue) || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hslaExecRgx"].exec(hslValue);
    const h = +hsla[1] / 360;
    const s = +hsla[2] / 100;
    const l = +hsla[3] / 100;
    const a = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(hsla[4]) ? +hsla[4] : 1;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < .5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(hue2rgb(p, q, h + 1 / 3) * 255, 0);
        g = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(hue2rgb(p, q, h) * 255, 0);
        b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(hue2rgb(p, q, h - 1 / 3) * 255, 0);
    }
    return [
        r,
        g,
        b,
        a
    ];
};
/**
 * All in one color converter that converts a color string value into an array of RGBA values
 * @param  {String} colorString
 * @return {ColorArray}
 */ const convertColorStringValuesToRgbaArray = (colorString)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRgb"])(colorString) ? rgbToRgba(colorString) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHex"])(colorString) ? hexToRgba(colorString) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHsl"])(colorString) ? hslToRgba(colorString) : [
        0,
        0,
        0,
        1
    ];
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/values.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDecomposedValueTargetObject",
    ()=>createDecomposedValueTargetObject,
    "decomposeRawValue",
    ()=>decomposeRawValue,
    "decomposeTweenValue",
    ()=>decomposeTweenValue,
    "decomposedOriginalValue",
    ()=>decomposedOriginalValue,
    "getFunctionValue",
    ()=>getFunctionValue,
    "getOriginalAnimatableValue",
    ()=>getOriginalAnimatableValue,
    "getRelativeValue",
    ()=>getRelativeValue,
    "getTweenType",
    ()=>getTweenType,
    "setValue",
    ()=>setValue
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$transforms$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/transforms.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$colors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/colors.js [app-client] (ecmascript)");
;
;
;
;
/**
* @import {
*   Target,
*   DOMTarget,
*   Tween,
*   TweenPropValue,
*   TweenDecomposedValue,
* } from '../types/index.js'
*/ /**
 * @template T, D
 * @param {T|undefined} targetValue
 * @param {D} defaultValue
 * @return {T|D}
 */ const setValue = (targetValue, defaultValue)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(targetValue) ? defaultValue : targetValue;
};
/**
 * @param  {TweenPropValue} value
 * @param  {Target} target
 * @param  {Number} index
 * @param  {Number} total
 * @param  {Object} [store]
 * @return {any}
 */ const getFunctionValue = (value, target, index, total, store)=>{
    let func;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFnc"])(value)) {
        func = ()=>{
            const computed = /** @type {Function} */ value(target, index, total);
            // Fallback to 0 if the function returns undefined / NaN / null / false / 0
            return !isNaN(+computed) ? +computed : computed || 0;
        };
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStr"])(value) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringStartsWith"])(value, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cssVarPrefix"])) {
        func = ()=>{
            const match = value.match(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cssVariableMatchRgx"]);
            const cssVarName = match[1];
            const fallbackValue = match[2];
            let computed = getComputedStyle(target)?.getPropertyValue(cssVarName);
            // Use fallback if CSS variable is not set or empty
            if ((!computed || computed.trim() === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"]) && fallbackValue) {
                computed = fallbackValue.trim();
            }
            return computed || 0;
        };
    } else {
        return value;
    }
    if (store) store.func = func;
    return func();
};
/**
 * @param  {Target} target
 * @param  {String} prop
 * @return {tweenTypes}
 */ const getTweenType = (target, prop)=>{
    return !target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDomSymbol"]] ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].OBJECT : // Handle SVG attributes
    target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSvgSymbol"]] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidSVGAttribute"])(target, prop) ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].ATTRIBUTE : // Handle CSS Transform properties differently than CSS to allow individual animations
    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validTransforms"].includes(prop) || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortTransforms"].get(prop) ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM : // CSS variables
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringStartsWith"])(prop, '--') ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].CSS_VAR : // All other CSS properties
    prop in /** @type {DOMTarget} */ target.style ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].CSS : // Handle other DOM Attributes
    prop in target ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].OBJECT : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].ATTRIBUTE;
};
/**
 * @param  {DOMTarget} target
 * @param  {String} propName
 * @param  {Object} animationInlineStyles
 * @return {String}
 */ const getCSSValue = (target, propName, animationInlineStyles)=>{
    const inlineStyles = target.style[propName];
    if (inlineStyles && animationInlineStyles) {
        animationInlineStyles[propName] = inlineStyles;
    }
    const value = inlineStyles || getComputedStyle(target[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["proxyTargetSymbol"]] || target).getPropertyValue(propName);
    return value === 'auto' ? '0' : value;
};
/**
 * @param {Target} target
 * @param {String} propName
 * @param {tweenTypes} [tweenType]
 * @param {Object|void} [animationInlineStyles]
 * @return {String|Number}
 */ const getOriginalAnimatableValue = (target, propName, tweenType, animationInlineStyles)=>{
    const type = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(tweenType) ? tweenType : getTweenType(target, propName);
    return type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].OBJECT ? target[propName] || 0 : type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].ATTRIBUTE ? /** @type {DOMTarget} */ target.getAttribute(propName) : type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$transforms$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseInlineTransforms"])(target, propName, animationInlineStyles) : type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].CSS_VAR ? getCSSValue(target, propName, animationInlineStyles).trimStart() : getCSSValue(target, propName, animationInlineStyles);
};
/**
 * @param  {Number} x
 * @param  {Number} y
 * @param  {String} operator
 * @return {Number}
 */ const getRelativeValue = (x, y, operator)=>{
    return operator === '-' ? x - y : operator === '+' ? x + y : x * y;
};
/** @return {TweenDecomposedValue} */ const createDecomposedValueTargetObject = ()=>{
    return {
        /** @type {valueTypes} */ t: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].NUMBER,
        n: 0,
        u: null,
        o: null,
        d: null,
        s: null
    };
};
/**
 * @param  {String|Number} rawValue
 * @param  {TweenDecomposedValue} targetObject
 * @return {TweenDecomposedValue}
 */ const decomposeRawValue = (rawValue, targetObject)=>{
    /** @type {valueTypes} */ targetObject.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].NUMBER;
    targetObject.n = 0;
    targetObject.u = null;
    targetObject.o = null;
    targetObject.d = null;
    targetObject.s = null;
    if (!rawValue) return targetObject;
    const num = +rawValue;
    if (!isNaN(num)) {
        // It's a number
        targetObject.n = num;
        return targetObject;
    } else {
        // let str = /** @type {String} */(rawValue).trim();
        let str = rawValue;
        // Parsing operators (+=, -=, *=) manually is much faster than using regex here
        if (str[1] === '=') {
            targetObject.o = str[0];
            str = str.slice(2);
        }
        // Skip exec regex if the value type is complex or color to avoid long regex backtracking
        const unitMatch = str.includes(' ') ? false : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unitsExecRgx"].exec(str);
        if (unitMatch) {
            // Has a number and a unit
            targetObject.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT;
            targetObject.n = +unitMatch[1];
            targetObject.u = unitMatch[2];
            return targetObject;
        } else if (targetObject.o) {
            // Has an operator (+=, -=, *=)
            targetObject.n = +str;
            return targetObject;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCol"])(str)) {
            // Is a color
            targetObject.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR;
            targetObject.d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$colors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertColorStringValuesToRgbaArray"])(str);
            return targetObject;
        } else {
            // Is a more complex string (generally svg coords, calc() or filters CSS values)
            const matchedNumbers = str.match(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["digitWithExponentRgx"]);
            targetObject.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX;
            targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
            targetObject.s = str.split(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["digitWithExponentRgx"]) || [];
            return targetObject;
        }
    }
};
/**
 * @param  {Tween} tween
 * @param  {TweenDecomposedValue} targetObject
 * @return {TweenDecomposedValue}
 */ const decomposeTweenValue = (tween, targetObject)=>{
    targetObject.t = tween._valueType;
    targetObject.n = tween._toNumber;
    targetObject.u = tween._unit;
    targetObject.o = null;
    targetObject.d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(tween._toNumbers);
    targetObject.s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(tween._strings);
    return targetObject;
};
const decomposedOriginalValue = createDecomposedValueTargetObject();
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/styles.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cleanInlineStyles",
    ()=>cleanInlineStyles,
    "sanitizePropertyName",
    ()=>sanitizePropertyName
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
/**
 * @import {
 *   JSAnimation,
 * } from '../animation/animation.js'
*/ /**
* @import {
*   Target,
*   DOMTarget,
*   Renderable,
*   Tween,
* } from '../types/index.js'
*/ const propertyNamesCache = {};
/**
 * @param  {String} propertyName
 * @param  {Target} target
 * @param  {tweenTypes} tweenType
 * @return {String}
 */ const sanitizePropertyName = (propertyName, target, tweenType)=>{
    if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM) {
        const t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortTransforms"].get(propertyName);
        return t ? t : propertyName;
    } else if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].CSS || tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].ATTRIBUTE && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSvg"])(target) && propertyName in /** @type {DOMTarget} */ target.style) {
        const cachedPropertyName = propertyNamesCache[propertyName];
        if (cachedPropertyName) {
            return cachedPropertyName;
        } else {
            const lowerCaseName = propertyName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toLowerCase"])(propertyName) : propertyName;
            propertyNamesCache[propertyName] = lowerCaseName;
            return lowerCaseName;
        }
    } else {
        return propertyName;
    }
};
/**
 * @template {Renderable} T
 * @param {T} renderable
 * @return {T}
 */ const cleanInlineStyles = (renderable)=>{
    // Allow cleanInlineStyles() to be called on timelines
    if (renderable._hasChildren) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(renderable, cleanInlineStyles, true);
    } else {
        const animation = renderable;
        animation.pause();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(animation, (/** @type {Tween} */ tween)=>{
            const tweenProperty = tween.property;
            const tweenTarget = tween.target;
            if (tweenTarget[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDomSymbol"]]) {
                const targetStyle = /** @type {DOMTarget} */ tweenTarget.style;
                const originalInlinedValue = tween._inlineValue;
                const tweenHadNoInlineValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNil"])(originalInlinedValue) || originalInlinedValue === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"];
                if (tween._tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM) {
                    const cachedTransforms = tweenTarget[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsSymbol"]];
                    if (tweenHadNoInlineValue) {
                        delete cachedTransforms[tweenProperty];
                    } else {
                        cachedTransforms[tweenProperty] = originalInlinedValue;
                    }
                    if (tween._renderTransforms) {
                        if (!Object.keys(cachedTransforms).length) {
                            targetStyle.removeProperty('transform');
                        } else {
                            let str = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"];
                            for(let key in cachedTransforms){
                                str += __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsFragmentStrings"][key] + cachedTransforms[key] + ') ';
                            }
                            targetStyle.transform = str;
                        }
                    }
                } else {
                    if (tweenHadNoInlineValue) {
                        targetStyle.removeProperty((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toLowerCase"])(tweenProperty));
                    } else {
                        targetStyle[tweenProperty] = originalInlinedValue;
                    }
                }
                if (animation._tail === tween) {
                    animation.targets.forEach((t)=>{
                        if (t.getAttribute && t.getAttribute('style') === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"]) {
                            t.removeAttribute('style');
                        }
                    });
                }
            }
        });
    }
    return renderable;
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/units.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertValueUnit",
    ()=>convertValueUnit
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
const angleUnitsMap = {
    'deg': 1,
    'rad': 180 / __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PI"],
    'turn': 360
};
const convertedValuesCache = {};
/**
* @import {
*   DOMTarget,
*   TweenDecomposedValue,
* } from '../types/index.js'
*/ /**
 * @param  {DOMTarget} el
 * @param  {TweenDecomposedValue} decomposedValue
 * @param  {String} unit
 * @param  {Boolean} [force]
 * @return {TweenDecomposedValue}
 */ const convertValueUnit = (el, decomposedValue, unit, force = false)=>{
    const currentUnit = decomposedValue.u;
    const currentNumber = decomposedValue.n;
    if (decomposedValue.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT && currentUnit === unit) {
        return decomposedValue;
    }
    const cachedKey = currentNumber + currentUnit + unit;
    const cached = convertedValuesCache[cachedKey];
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(cached) && !force) {
        decomposedValue.n = cached;
    } else {
        let convertedValue;
        if (currentUnit in angleUnitsMap) {
            convertedValue = currentNumber * angleUnitsMap[currentUnit] / angleUnitsMap[unit];
        } else {
            const baseline = 100;
            const tempEl = el.cloneNode();
            const parentNode = el.parentNode;
            const parentEl = parentNode && parentNode !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"] ? parentNode : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"].body;
            parentEl.appendChild(tempEl);
            const elStyle = tempEl.style;
            elStyle.width = baseline + currentUnit;
            const currentUnitWidth = /** @type {HTMLElement} */ tempEl.offsetWidth || baseline;
            elStyle.width = baseline + unit;
            const newUnitWidth = /** @type {HTMLElement} */ tempEl.offsetWidth || baseline;
            const factor = currentUnitWidth / newUnitWidth;
            parentEl.removeChild(tempEl);
            convertedValue = factor * currentNumber;
        }
        decomposedValue.n = convertedValue;
        convertedValuesCache[cachedKey] = convertedValue;
    }
    decomposedValue.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT;
    decomposedValue.u = unit;
    return decomposedValue;
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/easings/none.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "none",
    ()=>none
]);
/**
 * Anime.js - easings - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ /**
 * @import {
 *   EasingFunction,
 * } from '../types/index.js'
*/ /** @type {EasingFunction} */ const none = (t)=>t;
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/easings/eases/parser.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easeInPower",
    ()=>easeInPower,
    "easeTypes",
    ()=>easeTypes,
    "eases",
    ()=>eases,
    "parseEase",
    ()=>parseEase,
    "parseEaseString",
    ()=>parseEaseString
]);
/**
 * Anime.js - easings - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/easings/none.js [app-client] (ecmascript)");
;
;
;
/**
 * @import {
 *   EasingFunction,
 *   EasingFunctionWithParams,
 *   EasingParam,
 *   BackEasing,
 *   ElasticEasing,
 *   PowerEasing,
 * } from '../../types/index.js'
*/ /** @type {PowerEasing} */ const easeInPower = (p = 1.68)=>(t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow"])(t, +p);
/**
 * @callback EaseType
 * @param {EasingFunction} Ease
 * @return {EasingFunction}
 */ /** @type {Record<String, EaseType>} */ const easeTypes = {
    in: (easeIn)=>(t)=>easeIn(t),
    out: (easeIn)=>(t)=>1 - easeIn(1 - t),
    inOut: (easeIn)=>(t)=>t < .5 ? easeIn(t * 2) / 2 : 1 - easeIn(t * -2 + 2) / 2,
    outIn: (easeIn)=>(t)=>t < .5 ? (1 - easeIn(1 - t * 2)) / 2 : (easeIn(t * 2 - 1) + 1) / 2
};
/**
 * Easing functions adapted and simplified from https://robertpenner.com/easing/
 * (c) 2001 Robert Penner
 */ const halfPI = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PI"] / 2;
const doublePI = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PI"] * 2;
/** @type {Record<String, EasingFunctionWithParams|EasingFunction>} */ const easeInFunctions = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"]]: easeInPower,
    Quad: easeInPower(2),
    Cubic: easeInPower(3),
    Quart: easeInPower(4),
    Quint: easeInPower(5),
    /** @type {EasingFunction} */ Sine: (t)=>1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cos"])(t * halfPI),
    /** @type {EasingFunction} */ Circ: (t)=>1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sqrt"])(1 - t * t),
    /** @type {EasingFunction} */ Expo: (t)=>t ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow"])(2, 10 * t - 10) : 0,
    /** @type {EasingFunction} */ Bounce: (t)=>{
        let pow2, b = 4;
        while(t < ((pow2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow"])(2, --b)) - 1) / 11);
        return 1 / (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow"])(4, 3 - b) - 7.5625 * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow"])((pow2 * 3 - 2) / 22 - t, 2);
    },
    /** @type {BackEasing} */ Back: (overshoot = 1.7)=>(t)=>(+overshoot + 1) * t * t * t - +overshoot * t * t,
    /** @type {ElasticEasing} */ Elastic: (amplitude = 1, period = .3)=>{
        const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(+amplitude, 1, 10);
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(+period, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"], 2);
        const s = p / doublePI * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asin"])(1 / a);
        const e = doublePI / p;
        return (t)=>t === 0 || t === 1 ? t : -a * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow"])(2, -10 * (1 - t)) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sin"])((1 - t - s) * e);
    }
};
/**
 * @typedef  {Object} EasesFunctions
 * @property {typeof none} linear
 * @property {typeof none} none
 * @property {PowerEasing} in
 * @property {PowerEasing} out
 * @property {PowerEasing} inOut
 * @property {PowerEasing} outIn
 * @property {EasingFunction} inQuad
 * @property {EasingFunction} outQuad
 * @property {EasingFunction} inOutQuad
 * @property {EasingFunction} outInQuad
 * @property {EasingFunction} inCubic
 * @property {EasingFunction} outCubic
 * @property {EasingFunction} inOutCubic
 * @property {EasingFunction} outInCubic
 * @property {EasingFunction} inQuart
 * @property {EasingFunction} outQuart
 * @property {EasingFunction} inOutQuart
 * @property {EasingFunction} outInQuart
 * @property {EasingFunction} inQuint
 * @property {EasingFunction} outQuint
 * @property {EasingFunction} inOutQuint
 * @property {EasingFunction} outInQuint
 * @property {EasingFunction} inSine
 * @property {EasingFunction} outSine
 * @property {EasingFunction} inOutSine
 * @property {EasingFunction} outInSine
 * @property {EasingFunction} inCirc
 * @property {EasingFunction} outCirc
 * @property {EasingFunction} inOutCirc
 * @property {EasingFunction} outInCirc
 * @property {EasingFunction} inExpo
 * @property {EasingFunction} outExpo
 * @property {EasingFunction} inOutExpo
 * @property {EasingFunction} outInExpo
 * @property {EasingFunction} inBounce
 * @property {EasingFunction} outBounce
 * @property {EasingFunction} inOutBounce
 * @property {EasingFunction} outInBounce
 * @property {BackEasing} inBack
 * @property {BackEasing} outBack
 * @property {BackEasing} inOutBack
 * @property {BackEasing} outInBack
 * @property {ElasticEasing} inElastic
 * @property {ElasticEasing} outElastic
 * @property {ElasticEasing} inOutElastic
 * @property {ElasticEasing} outInElastic
 */ const eases = /*#__PURE__ */ (()=>{
    const list = {
        linear: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"],
        none: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"]
    };
    for(let type in easeTypes){
        for(let name in easeInFunctions){
            const easeIn = easeInFunctions[name];
            const easeType = easeTypes[type];
            list[type + name] = name === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"] || name === 'Back' || name === 'Elastic' ? (a, b)=>easeType(/** @type {EasingFunctionWithParams} */ easeIn(a, b)) : easeType(easeIn);
        }
    }
    return list;
})();
/** @type {Record<String, EasingFunction>} */ const easesLookups = {
    linear: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"],
    none: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"]
};
/**
 * @param  {String} string
 * @return {EasingFunction}
 */ const parseEaseString = (string)=>{
    if (easesLookups[string]) return easesLookups[string];
    if (string.indexOf('(') <= -1) {
        const hasParams = easeTypes[string] || string.includes('Back') || string.includes('Elastic');
        const parsedFn = hasParams ? /** @type {EasingFunctionWithParams} */ eases[string]() : eases[string];
        return parsedFn ? easesLookups[string] = parsedFn : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"];
    } else {
        const split = string.slice(0, -1).split('(');
        const parsedFn = eases[split[0]];
        return parsedFn ? easesLookups[string] = parsedFn(...split[1].split(',')) : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"];
    }
};
const deprecated = [
    'steps(',
    'irregular(',
    'linear(',
    'cubicBezier('
];
/**
 * @param  {EasingParam} ease
 * @return {EasingFunction}
 */ const parseEase = (ease)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStr"])(ease)) {
        for(let i = 0, l = deprecated.length; i < l; i++){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringStartsWith"])(ease, deprecated[i])) {
                console.warn(`String syntax for \`ease: "${ease}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${ease}\``);
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"];
            }
        }
    }
    const easeFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFnc"])(ease) ? ease : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStr"])(ease) ? parseEaseString(ease) : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$none$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["none"];
    return easeFunc;
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/render.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "render",
    ()=>render,
    "tick",
    ()=>tick
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
;
/**
 *   @import {
 *   Tickable,
 *   Renderable,
 *   CallbackArgument,
 *   Tween,
 *   DOMTarget,
 * } from '../types/index.js'
*/ /**
 * @import {
 *   JSAnimation,
 * } from '../animation/animation.js'
*/ /**
 * @import {
 *   Timeline,
 * } from '../timeline/timeline.js'
*/ /**
 * @param  {Tickable} tickable
 * @param  {Number} time
 * @param  {Number} muteCallbacks
 * @param  {Number} internalRender
 * @param  {tickModes} tickMode
 * @return {Number}
 */ const render = (tickable, time, muteCallbacks, internalRender, tickMode)=>{
    const parent = tickable.parent;
    const duration = tickable.duration;
    const completed = tickable.completed;
    const iterationDuration = tickable.iterationDuration;
    const iterationCount = tickable.iterationCount;
    const _currentIteration = tickable._currentIteration;
    const _loopDelay = tickable._loopDelay;
    const _reversed = tickable._reversed;
    const _alternate = tickable._alternate;
    const _hasChildren = tickable._hasChildren;
    const tickableDelay = tickable._delay;
    const tickablePrevAbsoluteTime = tickable._currentTime; // TODO: rename ._currentTime to ._absoluteCurrentTime
    const tickableEndTime = tickableDelay + iterationDuration;
    const tickableAbsoluteTime = time - tickableDelay;
    const tickablePrevTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(tickablePrevAbsoluteTime, -tickableDelay, duration);
    const tickableCurrentTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(tickableAbsoluteTime, -tickableDelay, duration);
    const deltaTime = tickableAbsoluteTime - tickablePrevAbsoluteTime;
    const isCurrentTimeAboveZero = tickableCurrentTime > 0;
    const isCurrentTimeEqualOrAboveDuration = tickableCurrentTime >= duration;
    const isSetter = duration <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
    const forcedTick = tickMode === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].FORCE;
    let isOdd = 0;
    let iterationElapsedTime = tickableAbsoluteTime;
    // Render checks
    // Used to also check if the children have rendered in order to trigger the onRender callback on the parent timer
    let hasRendered = 0;
    // Execute the "expensive" iterations calculations only when necessary
    if (iterationCount > 1) {
        // bitwise NOT operator seems to be generally faster than Math.floor() across browsers
        const currentIteration = ~~(tickableCurrentTime / (iterationDuration + (isCurrentTimeEqualOrAboveDuration ? 0 : _loopDelay)));
        tickable._currentIteration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(currentIteration, 0, iterationCount);
        // Prevent the iteration count to go above the max iterations when reaching the end of the animation
        if (isCurrentTimeEqualOrAboveDuration) tickable._currentIteration--;
        isOdd = tickable._currentIteration % 2;
        iterationElapsedTime = tickableCurrentTime % (iterationDuration + _loopDelay) || 0;
    }
    // Checks if exactly one of _reversed and (_alternate && isOdd) is true
    const isReversed = _reversed ^ (_alternate && isOdd);
    const _ease = /** @type {Renderable} */ tickable._ease;
    let iterationTime = isCurrentTimeEqualOrAboveDuration ? isReversed ? 0 : duration : isReversed ? iterationDuration - iterationElapsedTime : iterationElapsedTime;
    if (_ease) iterationTime = iterationDuration * _ease(iterationTime / iterationDuration) || 0;
    const isRunningBackwards = (parent ? parent.backwards : tickableAbsoluteTime < tickablePrevAbsoluteTime) ? !isReversed : !!isReversed;
    tickable._currentTime = tickableAbsoluteTime;
    tickable._iterationTime = iterationTime;
    tickable.backwards = isRunningBackwards;
    if (isCurrentTimeAboveZero && !tickable.began) {
        tickable.began = true;
        if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
            tickable.onBegin(tickable);
        }
    } else if (tickableAbsoluteTime <= 0) {
        tickable.began = false;
    }
    // Only triggers onLoop for tickable without children, otherwise call the the onLoop callback in the tick function
    // Make sure to trigger the onLoop before rendering to allow .refresh() to pickup the current values
    if (!muteCallbacks && !_hasChildren && isCurrentTimeAboveZero && tickable._currentIteration !== _currentIteration) {
        tickable.onLoop(tickable);
    }
    if (forcedTick || tickMode === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].AUTO && (time >= tickableDelay && time <= tickableEndTime || // Normal render
    time <= tickableDelay && tickablePrevTime > tickableDelay || // Playhead is before the animation start time so make sure the animation is at its initial state
    time >= tickableEndTime && tickablePrevTime !== duration // Playhead is after the animation end time so make sure the animation is at its end state
    ) || iterationTime >= tickableEndTime && tickablePrevTime !== duration || iterationTime <= tickableDelay && tickablePrevTime > 0 || time <= tickablePrevTime && tickablePrevTime === duration && completed || // Force a render if a seek occurs on an completed animation
    isCurrentTimeEqualOrAboveDuration && !completed && isSetter // This prevents 0 duration tickables to be skipped
    ) {
        if (isCurrentTimeAboveZero) {
            // Trigger onUpdate callback before rendering
            tickable.computeDeltaTime(tickablePrevTime);
            if (!muteCallbacks) tickable.onBeforeUpdate(tickable);
        }
        // Start tweens rendering
        if (!_hasChildren) {
            // Time has jumped more than globals.tickThreshold so consider this tick manual
            const forcedRender = forcedTick || (isRunningBackwards ? deltaTime * -1 : deltaTime) >= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].tickThreshold;
            const absoluteTime = tickable._offset + (parent ? parent._offset : 0) + tickableDelay + iterationTime;
            // Only Animation can have tweens, Timer returns undefined
            let tween = /** @type {JSAnimation} */ tickable._head;
            let tweenTarget;
            let tweenStyle;
            let tweenTargetTransforms;
            let tweenTargetTransformsProperties;
            let tweenTransformsNeedUpdate = 0;
            while(tween){
                const tweenComposition = tween._composition;
                const tweenCurrentTime = tween._currentTime;
                const tweenChangeDuration = tween._changeDuration;
                const tweenAbsEndTime = tween._absoluteStartTime + tween._changeDuration;
                const tweenNextRep = tween._nextRep;
                const tweenPrevRep = tween._prevRep;
                const tweenHasComposition = tweenComposition !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].none;
                if ((forcedRender || (tweenCurrentTime !== tweenChangeDuration || absoluteTime <= tweenAbsEndTime + (tweenNextRep ? tweenNextRep._delay : 0)) && (tweenCurrentTime !== 0 || absoluteTime >= tween._absoluteStartTime)) && (!tweenHasComposition || !tween._isOverridden && (!tween._isOverlapped || absoluteTime <= tweenAbsEndTime) && (!tweenNextRep || tweenNextRep._isOverridden || absoluteTime <= tweenNextRep._absoluteStartTime) && (!tweenPrevRep || tweenPrevRep._isOverridden || absoluteTime >= tweenPrevRep._absoluteStartTime + tweenPrevRep._changeDuration + tween._delay))) {
                    const tweenNewTime = tween._currentTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(iterationTime - tween._startTime, 0, tweenChangeDuration);
                    const tweenProgress = tween._ease(tweenNewTime / tween._updateDuration);
                    const tweenModifier = tween._modifier;
                    const tweenValueType = tween._valueType;
                    const tweenType = tween._tweenType;
                    const tweenIsObject = tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].OBJECT;
                    const tweenIsNumber = tweenValueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].NUMBER;
                    // Only round the in-between frames values if the final value is a string
                    const tweenPrecision = tweenIsNumber && tweenIsObject || tweenProgress === 0 || tweenProgress === 1 ? -1 : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].precision;
                    // Recompose tween value
                    /** @type {String|Number} */ let value;
                    /** @type {Number} */ let number;
                    if (tweenIsNumber) {
                        value = number = tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
                    } else if (tweenValueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT) {
                        // Rounding the values speed up string composition
                        number = tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
                        value = `${number}${tween._unit}`;
                    } else if (tweenValueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR) {
                        const fn = tween._fromNumbers;
                        const tn = tween._toNumbers;
                        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(fn[0], tn[0], tweenProgress)), 0, 255), 0);
                        const g = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(fn[1], tn[1], tweenProgress)), 0, 255), 0);
                        const b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(fn[2], tn[2], tweenProgress)), 0, 255), 0);
                        const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(fn[3], tn[3], tweenProgress), tweenPrecision)), 0, 1);
                        value = `rgba(${r},${g},${b},${a})`;
                        if (tweenHasComposition) {
                            const ns = tween._numbers;
                            ns[0] = r;
                            ns[1] = g;
                            ns[2] = b;
                            ns[3] = a;
                        }
                    } else if (tweenValueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX) {
                        value = tween._strings[0];
                        for(let j = 0, l = tween._toNumbers.length; j < l; j++){
                            const n = tweenModifier((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(tween._fromNumbers[j], tween._toNumbers[j], tweenProgress), tweenPrecision));
                            const s = tween._strings[j + 1];
                            value += `${s ? n + s : n}`;
                            if (tweenHasComposition) {
                                tween._numbers[j] = n;
                            }
                        }
                    }
                    // For additive tweens and Animatables
                    if (tweenHasComposition) {
                        tween._number = number;
                    }
                    if (!internalRender && tweenComposition !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].blend) {
                        const tweenProperty = tween.property;
                        tweenTarget = tween.target;
                        if (tweenIsObject) {
                            tweenTarget[tweenProperty] = value;
                        } else if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].ATTRIBUTE) {
                            /** @type {DOMTarget} */ tweenTarget.setAttribute(tweenProperty, value);
                        } else {
                            tweenStyle = /** @type {DOMTarget} */ tweenTarget.style;
                            if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM) {
                                if (tweenTarget !== tweenTargetTransforms) {
                                    tweenTargetTransforms = tweenTarget;
                                    // NOTE: Referencing the cachedTransforms in the tween property directly can be a little bit faster but appears to increase memory usage.
                                    tweenTargetTransformsProperties = tweenTarget[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsSymbol"]];
                                }
                                tweenTargetTransformsProperties[tweenProperty] = value;
                                tweenTransformsNeedUpdate = 1;
                            } else if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].CSS) {
                                tweenStyle[tweenProperty] = value;
                            } else if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].CSS_VAR) {
                                tweenStyle.setProperty(tweenProperty, value);
                            }
                        }
                        if (isCurrentTimeAboveZero) hasRendered = 1;
                    } else {
                        // Used for composing timeline tweens without having to do a real render
                        tween._value = value;
                    }
                }
                // NOTE: Possible improvement: Use translate(x,y) / translate3d(x,y,z) syntax
                // to reduce memory usage on string composition
                if (tweenTransformsNeedUpdate && tween._renderTransforms) {
                    let str = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyString"];
                    for(let key in tweenTargetTransformsProperties){
                        str += `${__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformsFragmentStrings"][key]}${tweenTargetTransformsProperties[key]}) `;
                    }
                    tweenStyle.transform = str;
                    tweenTransformsNeedUpdate = 0;
                }
                tween = tween._next;
            }
            if (!muteCallbacks && hasRendered) {
                /** @type {JSAnimation} */ tickable.onRender(tickable);
            }
        }
        if (!muteCallbacks && isCurrentTimeAboveZero) {
            tickable.onUpdate(tickable);
        }
    }
    // End tweens rendering
    // Handle setters on timeline differently and allow re-trigering the onComplete callback when seeking backwards
    if (parent && isSetter) {
        if (!muteCallbacks && (// (tickableAbsoluteTime > 0 instead) of (tickableAbsoluteTime >= duration) to prevent floating point precision issues
        // see: https://github.com/juliangarnier/anime/issues/1088
        parent.began && !isRunningBackwards && tickableAbsoluteTime > 0 && !completed || isRunningBackwards && tickableAbsoluteTime <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] && completed)) {
            tickable.onComplete(tickable);
            tickable.completed = !isRunningBackwards;
        }
    // If currentTime is both above 0 and at least equals to duration, handles normal onComplete or infinite loops
    } else if (isCurrentTimeAboveZero && isCurrentTimeEqualOrAboveDuration) {
        if (iterationCount === Infinity) {
            // Offset the tickable _startTime with its duration to reset _currentTime to 0 and continue the infinite timer
            tickable._startTime += tickable.duration;
        } else if (tickable._currentIteration >= iterationCount - 1) {
            // By setting paused to true, we tell the engine loop to not render this tickable and removes it from the list on the next tick
            tickable.paused = true;
            if (!completed && !_hasChildren) {
                // If the tickable has children, triggers onComplete() only when all children have completed in the tick function
                tickable.completed = true;
                if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
                    tickable.onComplete(tickable);
                    tickable._resolve(tickable);
                }
            }
        }
    // Otherwise set the completed flag to false
    } else {
        tickable.completed = false;
    }
    // NOTE: hasRendered * direction (negative for backwards) this way we can remove the tickable.backwards property completly ?
    return hasRendered;
};
/**
 * @param  {Tickable} tickable
 * @param  {Number} time
 * @param  {Number} muteCallbacks
 * @param  {Number} internalRender
 * @param  {Number} tickMode
 * @return {void}
 */ const tick = (tickable, time, muteCallbacks, internalRender, tickMode)=>{
    const _currentIteration = tickable._currentIteration;
    render(tickable, time, muteCallbacks, internalRender, tickMode);
    if (tickable._hasChildren) {
        const tl = tickable;
        const tlIsRunningBackwards = tl.backwards;
        const tlChildrenTime = internalRender ? time : tl._iterationTime;
        const tlCildrenTickTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])();
        let tlChildrenHasRendered = 0;
        let tlChildrenHaveCompleted = true;
        // If the timeline has looped forward, we need to manually triggers children skipped callbacks
        if (!internalRender && tl._currentIteration !== _currentIteration) {
            const tlIterationDuration = tl.iterationDuration;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(tl, (/** @type {JSAnimation} */ child)=>{
                if (!tlIsRunningBackwards) {
                    // Force an internal render to trigger the callbacks if the child has not completed on loop
                    if (!child.completed && !child.backwards && child._currentTime < child.iterationDuration) {
                        render(child, tlIterationDuration, muteCallbacks, 1, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].FORCE);
                    }
                    // Reset their began and completed flags to allow retrigering callbacks on the next iteration
                    child.began = false;
                    child.completed = false;
                } else {
                    const childDuration = child.duration;
                    const childStartTime = child._offset + child._delay;
                    const childEndTime = childStartTime + childDuration;
                    // Triggers the onComplete callback on reverse for children on the edges of the timeline
                    if (!muteCallbacks && childDuration <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] && (!childStartTime || childEndTime === tlIterationDuration)) {
                        child.onComplete(child);
                    }
                }
            });
            if (!muteCallbacks) tl.onLoop(tl);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(tl, (/** @type {JSAnimation} */ child)=>{
            const childTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((tlChildrenTime - child._offset) * child._speed, 12); // Rounding is needed when using seconds
            const childTickMode = child._fps < tl._fps ? child.requestTick(tlCildrenTickTime) : tickMode;
            tlChildrenHasRendered += render(child, childTime, muteCallbacks, internalRender, childTickMode);
            if (!child.completed && tlChildrenHaveCompleted) tlChildrenHaveCompleted = false;
        }, tlIsRunningBackwards);
        // Renders on timeline are triggered by its children so it needs to be set after rendering the children
        if (!muteCallbacks && tlChildrenHasRendered) tl.onRender(tl);
        // Triggers the timeline onComplete() once all chindren all completed and the current time has reached the end
        if ((tlChildrenHaveCompleted || tlIsRunningBackwards) && tl._currentTime >= tl.duration) {
            // Make sure the paused flag is false in case it has been skipped in the render function
            tl.paused = true;
            if (!tl.completed) {
                tl.completed = true;
                if (!muteCallbacks) {
                    tl.onComplete(tl);
                    tl._resolve(tl);
                }
            }
        }
    }
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/clock.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Clock",
    ()=>Clock
]);
/**
 * Anime.js - core - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
;
;
/**
 * @import {
 *   Tickable,
 *   Tween,
 * } from '../types/index.js'
*/ /*
 * Base class to control framerate and playback rate.
 * Inherited by Engine, Timer, Animation and Timeline.
 */ class Clock {
    /** @param {Number} [initTime] */ constructor(initTime = 0){
        /** @type {Number} */ this.deltaTime = 0;
        /** @type {Number} */ this._currentTime = initTime;
        /** @type {Number} */ this._elapsedTime = initTime;
        /** @type {Number} */ this._startTime = initTime;
        /** @type {Number} */ this._lastTime = initTime;
        /** @type {Number} */ this._scheduledTime = 0;
        /** @type {Number} */ this._frameDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"] / __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxFps"], 0);
        /** @type {Number} */ this._fps = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxFps"];
        /** @type {Number} */ this._speed = 1;
        /** @type {Boolean} */ this._hasChildren = false;
        /** @type {Tickable|Tween} */ this._head = null;
        /** @type {Tickable|Tween} */ this._tail = null;
    }
    get fps() {
        return this._fps;
    }
    set fps(frameRate) {
        const previousFrameDuration = this._frameDuration;
        const fr = +frameRate;
        const fps = fr < __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] : fr;
        const frameDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"] / fps, 0);
        this._fps = fps;
        this._frameDuration = frameDuration;
        this._scheduledTime += frameDuration - previousFrameDuration;
    }
    get speed() {
        return this._speed;
    }
    set speed(playbackRate) {
        const pbr = +playbackRate;
        this._speed = pbr < __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] : pbr;
    }
    /**
   * @param  {Number} time
   * @return {tickModes}
   */ requestTick(time) {
        const scheduledTime = this._scheduledTime;
        const elapsedTime = this._elapsedTime;
        this._elapsedTime += time - elapsedTime;
        // If the elapsed time is lower than the scheduled time
        // this means not enough time has passed to hit one frameDuration
        // so skip that frame
        if (elapsedTime < scheduledTime) return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].NONE;
        const frameDuration = this._frameDuration;
        const frameDelta = elapsedTime - scheduledTime;
        // Ensures that _scheduledTime progresses in steps of at least 1 frameDuration.
        // Skips ahead if the actual elapsed time is higher.
        this._scheduledTime += frameDelta < frameDuration ? frameDuration : frameDelta;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].AUTO;
    }
    /**
   * @param  {Number} time
   * @return {Number}
   */ computeDeltaTime(time) {
        const delta = time - this._lastTime;
        this.deltaTime = delta;
        this._lastTime = time;
        return delta;
    }
}
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/additive.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAdditiveAnimation",
    ()=>addAdditiveAnimation,
    "additive",
    ()=>additive
]);
/**
 * Anime.js - animation - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/render.js [app-client] (ecmascript)");
;
;
;
const additive = {
    animation: null,
    update: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]
};
/**
 * @import {
 *   Tween,
 *   TweenAdditiveLookups,
 * } from '../types/index.js'
 */ /**
 * @typedef AdditiveAnimation
 * @property {Number} duration
 * @property {Number} _offset
 * @property {Number} _delay
 * @property {Tween} _head
 * @property {Tween} _tail
 */ /**
 * @param  {TweenAdditiveLookups} lookups
 * @return {AdditiveAnimation}
 */ const addAdditiveAnimation = (lookups)=>{
    let animation = additive.animation;
    if (!animation) {
        animation = {
            duration: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"],
            computeDeltaTime: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
            _offset: 0,
            _delay: 0,
            _head: null,
            _tail: null
        };
        additive.animation = animation;
        additive.update = ()=>{
            lookups.forEach((propertyAnimation)=>{
                for(let propertyName in propertyAnimation){
                    const tweens = propertyAnimation[propertyName];
                    const lookupTween = tweens._head;
                    if (lookupTween) {
                        const valueType = lookupTween._valueType;
                        const additiveValues = valueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX || valueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(lookupTween._fromNumbers) : null;
                        let additiveValue = lookupTween._fromNumber;
                        let tween = tweens._tail;
                        while(tween && tween !== lookupTween){
                            if (additiveValues) {
                                for(let i = 0, l = tween._numbers.length; i < l; i++)additiveValues[i] += tween._numbers[i];
                            } else {
                                additiveValue += tween._number;
                            }
                            tween = tween._prevAdd;
                        }
                        lookupTween._toNumber = additiveValue;
                        lookupTween._toNumbers = additiveValues;
                    }
                }
            });
            // TODO: Avoid polymorphism here, idealy the additive animation should be a regular animation with a higher priority in the render loop
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["render"])(animation, 1, 1, 0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].FORCE);
        };
    }
    return animation;
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/engine/engine.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "engine",
    ()=>engine
]);
/**
 * Anime.js - engine - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/clock.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/render.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/additive.js [app-client] (ecmascript)");
;
;
;
;
;
;
/**
 * @import {
 *   DefaultsParams,
 * } from '../types/index.js'
*/ /**
 * @import {
 *   Tickable,
 * } from '../types/index.js'
*/ const engineTickMethod = /*#__PURE__*/ (()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"] ? requestAnimationFrame : setImmediate)();
const engineCancelMethod = /*#__PURE__*/ (()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"] ? cancelAnimationFrame : clearImmediate)();
class Engine extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"] {
    /** @param {Number} [initTime] */ constructor(initTime){
        super(initTime);
        this.useDefaultMainLoop = true;
        this.pauseOnDocumentHidden = true;
        /** @type {DefaultsParams} */ this.defaults = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"];
        // this.paused = isBrowser && doc.hidden ? true  : false;
        this.paused = true;
        /** @type {Number|NodeJS.Immediate} */ this.reqId = 0;
    }
    update() {
        const time = this._currentTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])();
        if (this.requestTick(time)) {
            this.computeDeltaTime(time);
            const engineSpeed = this._speed;
            const engineFps = this._fps;
            let activeTickable = this._head;
            while(activeTickable){
                const nextTickable = activeTickable._next;
                if (!activeTickable.paused) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tick"])(activeTickable, (time - activeTickable._startTime) * activeTickable._speed * engineSpeed, 0, 0, activeTickable._fps < engineFps ? activeTickable.requestTick(time) : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].AUTO);
                } else {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(this, activeTickable);
                    this._hasChildren = !!this._tail;
                    activeTickable._running = false;
                    if (activeTickable.completed && !activeTickable._cancelled) {
                        activeTickable.cancel();
                    }
                }
                activeTickable = nextTickable;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["additive"].update();
        }
    }
    wake() {
        if (this.useDefaultMainLoop && !this.reqId) {
            // Imediatly request a tick to update engine._elapsedTime and get accurate offsetPosition calculation in timer.js
            this.requestTick((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])());
            this.reqId = engineTickMethod(tickEngine);
        }
        return this;
    }
    pause() {
        if (!this.reqId) return;
        this.paused = true;
        return killEngine();
    }
    resume() {
        if (!this.paused) return;
        this.paused = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Tickable} */ child)=>child.resetTime());
        return this.wake();
    }
    // Getter and setter for speed
    get speed() {
        return this._speed * (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].timeScale === 1 ? 1 : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"]);
    }
    set speed(playbackRate) {
        this._speed = playbackRate * __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].timeScale;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Tickable} */ child)=>child.speed = child._speed);
    }
    // Getter and setter for timeUnit
    get timeUnit() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].timeScale === 1 ? 'ms' : 's';
    }
    set timeUnit(unit) {
        const secondsScale = 0.001;
        const isSecond = unit === 's';
        const newScale = isSecond ? secondsScale : 1;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].timeScale !== newScale) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].timeScale = newScale;
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].tickThreshold = 200 * newScale;
            const scaleFactor = isSecond ? secondsScale : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"];
            /** @type {Number} */ this.defaults.duration *= scaleFactor;
            this._speed *= scaleFactor;
        }
    }
    // Getter and setter for precision
    get precision() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].precision;
    }
    set precision(precision) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].precision = precision;
    }
}
const engine = /*#__PURE__*/ (()=>{
    const engine = new Engine((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])());
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"]) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalVersions"].engine = engine;
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"].addEventListener('visibilitychange', ()=>{
            if (!engine.pauseOnDocumentHidden) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"].hidden ? engine.pause() : engine.resume();
        });
    }
    return engine;
})();
const tickEngine = ()=>{
    if (engine._head) {
        engine.reqId = engineTickMethod(tickEngine);
        engine.update();
    } else {
        engine.reqId = 0;
    }
};
const killEngine = ()=>{
    engineCancelMethod(engine.reqId);
    engine.reqId = 0;
    return engine;
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/composition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "composeTween",
    ()=>composeTween,
    "getTweenSiblings",
    ()=>getTweenSiblings,
    "overrideTween",
    ()=>overrideTween,
    "removeTargetsFromRenderable",
    ()=>removeTargetsFromRenderable,
    "removeTweenSliblings",
    ()=>removeTweenSliblings
]);
/**
 * Anime.js - animation - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$styles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/styles.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/engine/engine.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/additive.js [app-client] (ecmascript)");
;
;
;
;
;
/**
 * @import {
 *   TweenReplaceLookups,
 *   TweenAdditiveLookups,
 *   TweenPropertySiblings,
 *   Tween,
 *   Target,
 *   TargetsArray,
 *   Renderable,
 * } from '../types/index.js'
 *
 * @import {
 *   JSAnimation,
 * } from '../animation/animation.js'
*/ const lookups = {
    /** @type {TweenReplaceLookups} */ _rep: new WeakMap(),
    /** @type {TweenAdditiveLookups} */ _add: new Map()
};
/**
 * @param  {Target} target
 * @param  {String} property
 * @param  {String} lookup
 * @return {TweenPropertySiblings}
 */ const getTweenSiblings = (target, property, lookup = '_rep')=>{
    const lookupMap = lookups[lookup];
    let targetLookup = lookupMap.get(target);
    if (!targetLookup) {
        targetLookup = {};
        lookupMap.set(target, targetLookup);
    }
    return targetLookup[property] ? targetLookup[property] : targetLookup[property] = {
        _head: null,
        _tail: null
    };
};
/**
 * @param  {Tween} p
 * @param  {Tween} c
 * @return {Number|Boolean}
 */ const addTweenSortMethod = (p, c)=>{
    return p._isOverridden || p._absoluteStartTime > c._absoluteStartTime;
};
/**
 * @param {Tween} tween
 */ const overrideTween = (tween)=>{
    tween._isOverlapped = 1;
    tween._isOverridden = 1;
    tween._changeDuration = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
    tween._currentTime = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
};
/**
 * @param  {Tween} tween
 * @param  {TweenPropertySiblings} siblings
 * @return {Tween}
 */ const composeTween = (tween, siblings)=>{
    const tweenCompositionType = tween._composition;
    // Handle replaced tweens
    if (tweenCompositionType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].replace) {
        const tweenAbsStartTime = tween._absoluteStartTime;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(siblings, tween, addTweenSortMethod, '_prevRep', '_nextRep');
        const prevSibling = tween._prevRep;
        // Update the previous siblings for composition replace tweens
        if (prevSibling) {
            const prevParent = prevSibling.parent;
            const prevAbsEndTime = prevSibling._absoluteStartTime + prevSibling._changeDuration;
            // Handle looped animations tween
            if (// Check if the previous tween is from a different animation
            tween.parent.id !== prevParent.id && // Check if the animation has loops
            prevParent.iterationCount > 1 && // Check if _absoluteChangeEndTime of last loop overlaps the current tween
            prevAbsEndTime + (prevParent.duration - prevParent.iterationDuration) > tweenAbsStartTime) {
                // TODO: Find a way to only override the iterations overlapping with the tween
                overrideTween(prevSibling);
                let prevPrevSibling = prevSibling._prevRep;
                // If the tween was part of a set of keyframes, override its siblings
                while(prevPrevSibling && prevPrevSibling.parent.id === prevParent.id){
                    overrideTween(prevPrevSibling);
                    prevPrevSibling = prevPrevSibling._prevRep;
                }
            }
            const absoluteUpdateStartTime = tweenAbsStartTime - tween._delay;
            if (prevAbsEndTime > absoluteUpdateStartTime) {
                const prevChangeStartTime = prevSibling._startTime;
                const prevTLOffset = prevAbsEndTime - (prevChangeStartTime + prevSibling._updateDuration);
                // Rounding is necessary here to minimize floating point errors when working in seconds
                const updatedPrevChangeDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(absoluteUpdateStartTime - prevTLOffset - prevChangeStartTime, 12);
                prevSibling._changeDuration = updatedPrevChangeDuration;
                prevSibling._currentTime = updatedPrevChangeDuration;
                prevSibling._isOverlapped = 1;
                // Override the previous tween if its new _changeDuration is lower than minValue
                // TODO: See if it's even neceseeary to test against minValue, checking for 0 might be enough
                if (updatedPrevChangeDuration < __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"]) {
                    overrideTween(prevSibling);
                }
            }
            // Pause (and cancel) the parent if it only contains overlapped tweens
            let pausePrevParentAnimation = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(prevParent, (/** @type Tween */ t)=>{
                if (!t._isOverlapped) pausePrevParentAnimation = false;
            });
            if (pausePrevParentAnimation) {
                const prevParentTL = prevParent.parent;
                if (prevParentTL) {
                    let pausePrevParentTL = true;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(prevParentTL, (/** @type JSAnimation */ a)=>{
                        if (a !== prevParent) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(a, (/** @type Tween */ t)=>{
                                if (!t._isOverlapped) pausePrevParentTL = false;
                            });
                        }
                    });
                    if (pausePrevParentTL) {
                        prevParentTL.cancel();
                    }
                } else {
                    prevParent.cancel();
                // Previously, calling .cancel() on a timeline child would affect the render order of other children
                // Worked around this by marking it as .completed and using .pause() for safe removal in the engine loop
                // This is no longer needed since timeline tween composition is now handled separately
                // Keeping this here for reference
                // prevParent.completed = true;
                // prevParent.pause();
                }
            }
        }
    // let nextSibling = tween._nextRep;
    // // All the next siblings are automatically overridden
    // if (nextSibling && nextSibling._absoluteStartTime >= tweenAbsStartTime) {
    //   while (nextSibling) {
    //     overrideTween(nextSibling);
    //     nextSibling = nextSibling._nextRep;
    //   }
    // }
    // if (nextSibling && nextSibling._absoluteStartTime < tweenAbsStartTime) {
    //   while (nextSibling) {
    //     overrideTween(nextSibling);
    //     console.log(tween.id, nextSibling.id);
    //     nextSibling = nextSibling._nextRep;
    //   }
    // }
    // Handle additive tweens composition
    } else if (tweenCompositionType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].blend) {
        const additiveTweenSiblings = getTweenSiblings(tween.target, tween.property, '_add');
        const additiveAnimation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addAdditiveAnimation"])(lookups._add);
        let lookupTween = additiveTweenSiblings._head;
        if (!lookupTween) {
            lookupTween = {
                ...tween
            };
            lookupTween._composition = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].replace;
            lookupTween._updateDuration = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
            lookupTween._startTime = 0;
            lookupTween._numbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(tween._fromNumbers);
            lookupTween._number = 0;
            lookupTween._next = null;
            lookupTween._prev = null;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(additiveTweenSiblings, lookupTween);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(additiveAnimation, lookupTween);
        }
        // Convert the values of TO to FROM and set TO to 0
        const toNumber = tween._toNumber;
        tween._fromNumber = lookupTween._fromNumber - toNumber;
        tween._toNumber = 0;
        tween._numbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(tween._fromNumbers);
        tween._number = 0;
        lookupTween._fromNumber = toNumber;
        if (tween._toNumbers) {
            const toNumbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(tween._toNumbers);
            if (toNumbers) {
                toNumbers.forEach((value, i)=>{
                    tween._fromNumbers[i] = lookupTween._fromNumbers[i] - value;
                    tween._toNumbers[i] = 0;
                });
            }
            lookupTween._fromNumbers = toNumbers;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(additiveTweenSiblings, tween, null, '_prevAdd', '_nextAdd');
    }
    return tween;
};
/**
 * @param  {Tween} tween
 * @return {Tween}
 */ const removeTweenSliblings = (tween)=>{
    const tweenComposition = tween._composition;
    if (tweenComposition !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].none) {
        const tweenTarget = tween.target;
        const tweenProperty = tween.property;
        const replaceTweensLookup = lookups._rep;
        const replaceTargetProps = replaceTweensLookup.get(tweenTarget);
        const tweenReplaceSiblings = replaceTargetProps[tweenProperty];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(tweenReplaceSiblings, tween, '_prevRep', '_nextRep');
        if (tweenComposition === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].blend) {
            const addTweensLookup = lookups._add;
            const addTargetProps = addTweensLookup.get(tweenTarget);
            if (!addTargetProps) return;
            const additiveTweenSiblings = addTargetProps[tweenProperty];
            const additiveAnimation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["additive"].animation;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(additiveTweenSiblings, tween, '_prevAdd', '_nextAdd');
            // If only one tween is left in the additive lookup, it's the tween lookup
            const lookupTween = additiveTweenSiblings._head;
            if (lookupTween && lookupTween === additiveTweenSiblings._tail) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(additiveTweenSiblings, lookupTween, '_prevAdd', '_nextAdd');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(additiveAnimation, lookupTween);
                let shouldClean = true;
                for(let prop in addTargetProps){
                    if (addTargetProps[prop]._head) {
                        shouldClean = false;
                        break;
                    }
                }
                if (shouldClean) {
                    addTweensLookup.delete(tweenTarget);
                }
            }
        }
    }
    return tween;
};
/**
 * @param  {TargetsArray} targetsArray
 * @param  {JSAnimation} animation
 * @param  {String} [propertyName]
 * @return {Boolean}
 */ const removeTargetsFromJSAnimation = (targetsArray, animation, propertyName)=>{
    let tweensMatchesTargets = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(animation, (/**@type {Tween} */ tween)=>{
        const tweenTarget = tween.target;
        if (targetsArray.includes(tweenTarget)) {
            const tweenName = tween.property;
            const tweenType = tween._tweenType;
            const normalizePropName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$styles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePropertyName"])(propertyName, tweenTarget, tweenType);
            if (!normalizePropName || normalizePropName && normalizePropName === tweenName) {
                // Make sure to flag the previous CSS transform tween to renderTransform
                if (tween.parent._tail === tween && tween._tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM && tween._prev && tween._prev._tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM) {
                    tween._prev._renderTransforms = 1;
                }
                // Removes the tween from the selected animation
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(animation, tween);
                // Detach the tween from its siblings to make sure blended tweens are correctlly removed
                removeTweenSliblings(tween);
                tweensMatchesTargets = true;
            }
        }
    }, true);
    return tweensMatchesTargets;
};
/**
 * @param  {TargetsArray} targetsArray
 * @param  {Renderable} [renderable]
 * @param  {String} [propertyName]
 */ const removeTargetsFromRenderable = (targetsArray, renderable, propertyName)=>{
    const parent = renderable ? renderable : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"];
    let removeMatches;
    if (parent._hasChildren) {
        let iterationDuration = 0;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(parent, (/** @type {Renderable} */ child)=>{
            if (!child._hasChildren) {
                removeMatches = removeTargetsFromJSAnimation(targetsArray, child, propertyName);
                // Remove the child from its parent if no tweens and no children left after the removal
                if (removeMatches && !child._head) {
                    child.cancel();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeChild"])(parent, child);
                } else {
                    // Calculate the new iterationDuration value to handle onComplete with last child in render()
                    const childTLOffset = child._offset + child._delay;
                    const childDur = childTLOffset + child.duration;
                    if (childDur > iterationDuration) {
                        iterationDuration = childDur;
                    }
                }
            }
            // Make sure to also remove engine's children targets
            // NOTE: Avoid recursion?
            if (child._head) {
                removeTargetsFromRenderable(targetsArray, child, propertyName);
            } else {
                child._hasChildren = false;
            }
        }, true);
        // Update iterationDuration value to handle onComplete with last child in render()
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(/** @type {Renderable} */ parent.iterationDuration)) {
            /** @type {Renderable} */ parent.iterationDuration = iterationDuration;
        }
    } else {
        removeMatches = removeTargetsFromJSAnimation(targetsArray, parent, propertyName);
    }
    if (removeMatches && !parent._head) {
        parent._hasChildren = false;
        // Cancel the parent if there are no tweens and no children left after the removal
        // We have to check if the .cancel() method exist to handle cases where the parent is the engine itself
        if (/** @type {Renderable} */ parent.cancel) /** @type {Renderable} */ parent.cancel();
    }
};
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/timer/timer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Timer",
    ()=>Timer,
    "createTimer",
    ()=>createTimer
]);
/**
 * Anime.js - timer - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/values.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/render.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/composition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/clock.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/engine/engine.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
/**
 * @import {
 *   Callback,
 *   TimerParams,
 *   Renderable,
 *   Tween,
 * } from '../types/index.js'
*/ /**
 * @import {
 *   ScrollObserver,
 * } from '../events/scroll.js'
*/ /**
 * @import {
 *   Timeline,
 * } from '../timeline/timeline.js'
*/ /**
 * @param  {Timer} timer
 * @return {Timer}
 */ const resetTimerProperties = (timer)=>{
    timer.paused = true;
    timer.began = false;
    timer.completed = false;
    return timer;
};
/**
 * @param  {Timer} timer
 * @return {Timer}
 */ const reviveTimer = (timer)=>{
    if (!timer._cancelled) return timer;
    if (timer._hasChildren) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(timer, reviveTimer);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(timer, (/** @type {Tween} tween */ tween)=>{
            if (tween._composition !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].none) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeTween"])(tween, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTweenSiblings"])(tween.target, tween.property));
            }
        });
    }
    timer._cancelled = 0;
    return timer;
};
let timerId = 0;
/**
 * Base class used to create Timers, Animations and Timelines
 */ class Timer extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"] {
    /**
   * @param {TimerParams} [parameters]
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   */ constructor(parameters = {}, parent = null, parentPosition = 0){
        super(0);
        const { id, delay, duration, reversed, alternate, loop, loopDelay, autoplay, frameRate, playbackRate, onComplete, onLoop, onPause, onBegin, onBeforeUpdate, onUpdate } = parameters;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scope"].current) __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scope"].current.register(this);
        const timerInitTime = parent ? 0 : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"]._elapsedTime;
        const timerDefaults = parent ? parent.defaults : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].defaults;
        const timerDelay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFnc"])(delay) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(delay) ? timerDefaults.delay : +delay;
        const timerDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFnc"])(duration) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(duration) ? Infinity : +duration;
        const timerLoop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(loop, timerDefaults.loop);
        const timerLoopDelay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(loopDelay, timerDefaults.loopDelay);
        const timerIterationCount = timerLoop === true || timerLoop === Infinity || /** @type {Number} */ timerLoop < 0 ? Infinity : /** @type {Number} */ timerLoop + 1;
        let offsetPosition = 0;
        if (parent) {
            offsetPosition = parentPosition;
        } else {
            // Make sure to tick the engine once if not currently running to get up to date engine._elapsedTime
            // to avoid big gaps with the following offsetPosition calculation
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"].reqId) __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"].requestTick((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])());
            // Make sure to scale the offset position with globals.timeScale to properly handle seconds unit
            offsetPosition = (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"]._elapsedTime - __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"]._startTime) * __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].timeScale;
        }
        // Timer's parameters
        this.id = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(id) ? id : ++timerId;
        /** @type {Timeline} */ this.parent = parent;
        // Total duration of the timer
        this.duration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampInfinity"])((timerDuration + timerLoopDelay) * timerIterationCount - timerLoopDelay) || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
        /** @type {Boolean} */ this.backwards = false;
        /** @type {Boolean} */ this.paused = true;
        /** @type {Boolean} */ this.began = false;
        /** @type {Boolean} */ this.completed = false;
        /** @type {Callback<this>} */ this.onBegin = onBegin || timerDefaults.onBegin;
        /** @type {Callback<this>} */ this.onBeforeUpdate = onBeforeUpdate || timerDefaults.onBeforeUpdate;
        /** @type {Callback<this>} */ this.onUpdate = onUpdate || timerDefaults.onUpdate;
        /** @type {Callback<this>} */ this.onLoop = onLoop || timerDefaults.onLoop;
        /** @type {Callback<this>} */ this.onPause = onPause || timerDefaults.onPause;
        /** @type {Callback<this>} */ this.onComplete = onComplete || timerDefaults.onComplete;
        /** @type {Number} */ this.iterationDuration = timerDuration; // Duration of one loop
        /** @type {Number} */ this.iterationCount = timerIterationCount; // Number of loops
        /** @type {Boolean|ScrollObserver} */ this._autoplay = parent ? false : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(autoplay, timerDefaults.autoplay);
        /** @type {Number} */ this._offset = offsetPosition;
        /** @type {Number} */ this._delay = timerDelay;
        /** @type {Number} */ this._loopDelay = timerLoopDelay;
        /** @type {Number} */ this._iterationTime = 0;
        /** @type {Number} */ this._currentIteration = 0; // Current loop index
        /** @type {Function} */ this._resolve = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]; // Used by .then()
        /** @type {Boolean} */ this._running = false;
        /** @type {Number} */ this._reversed = +(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(reversed, timerDefaults.reversed);
        /** @type {Number} */ this._reverse = this._reversed;
        /** @type {Number} */ this._cancelled = 0;
        /** @type {Boolean} */ this._alternate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(alternate, timerDefaults.alternate);
        /** @type {Renderable} */ this._prev = null;
        /** @type {Renderable} */ this._next = null;
        // Clock's parameters
        /** @type {Number} */ this._elapsedTime = timerInitTime;
        /** @type {Number} */ this._startTime = timerInitTime;
        /** @type {Number} */ this._lastTime = timerInitTime;
        /** @type {Number} */ this._fps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(frameRate, timerDefaults.frameRate);
        /** @type {Number} */ this._speed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(playbackRate, timerDefaults.playbackRate);
    }
    get cancelled() {
        return !!this._cancelled;
    }
    set cancelled(cancelled) {
        cancelled ? this.cancel() : this.reset(true).play();
    }
    get currentTime() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(this._currentTime, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].precision), -this._delay, this.duration);
    }
    set currentTime(time) {
        const paused = this.paused;
        // Pausing the timer is necessary to avoid time jumps on a running instance
        this.pause().seek(+time);
        if (!paused) this.resume();
    }
    get iterationCurrentTime() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(this._iterationTime, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].precision);
    }
    set iterationCurrentTime(time) {
        this.currentTime = this.iterationDuration * this._currentIteration + time;
    }
    get progress() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(this._currentTime / this.duration, 10), 0, 1);
    }
    set progress(progress) {
        this.currentTime = this.duration * progress;
    }
    get iterationProgress() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(this._iterationTime / this.iterationDuration, 10), 0, 1);
    }
    set iterationProgress(progress) {
        const iterationDuration = this.iterationDuration;
        this.currentTime = iterationDuration * this._currentIteration + iterationDuration * progress;
    }
    get currentIteration() {
        return this._currentIteration;
    }
    set currentIteration(iterationCount) {
        this.currentTime = this.iterationDuration * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(+iterationCount, 0, this.iterationCount - 1);
    }
    get reversed() {
        return !!this._reversed;
    }
    set reversed(reverse) {
        reverse ? this.reverse() : this.play();
    }
    get speed() {
        return super.speed;
    }
    set speed(playbackRate) {
        super.speed = playbackRate;
        this.resetTime();
    }
    /**
   * @param  {Boolean} [softReset]
   * @return {this}
   */ reset(softReset = false) {
        // If cancelled, revive the timer before rendering in order to have propertly composed tweens siblings
        reviveTimer(this);
        if (this._reversed && !this._reverse) this.reversed = false;
        // Rendering before updating the completed flag to prevent skips and to make sure the properties are not overridden
        // Setting the iterationTime at the end to force the rendering to happend backwards, otherwise calling .reset() on Timelines might not render children in the right order
        // NOTE: This is only required for Timelines and might be better to move to the Timeline class?
        this._iterationTime = this.iterationDuration;
        // Set tickMode to tickModes.FORCE to force rendering
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tick"])(this, 0, 1, ~~softReset, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].FORCE);
        // Reset timer properties after revive / render to make sure the props are not updated again
        resetTimerProperties(this);
        // Also reset children properties
        if (this._hasChildren) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, resetTimerProperties);
        }
        return this;
    }
    /**
   * @param  {Boolean} internalRender
   * @return {this}
   */ init(internalRender = false) {
        this.fps = this._fps;
        this.speed = this._speed;
        // Manually calling .init() on timelines should render all children intial state
        // Forces all children to render once then render to 0 when reseted
        if (!internalRender && this._hasChildren) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tick"])(this, this.duration, 1, ~~internalRender, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].FORCE);
        }
        this.reset(internalRender);
        // Make sure to set autoplay to false to child timers so it doesn't attempt to autoplay / link
        const autoplay = this._autoplay;
        if (autoplay === true) {
            this.resume();
        } else if (autoplay && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(/** @type {ScrollObserver} */ autoplay.linked)) {
            /** @type {ScrollObserver} */ autoplay.link(this);
        }
        return this;
    }
    /** @return {this} */ resetTime() {
        const timeScale = 1 / (this._speed * __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"]._speed);
        // TODO: See if we can safely use engine._elapsedTime here
        // if (!engine.reqId) engine.requestTick(now())
        // this._startTime = engine._elapsedTime - (this._currentTime + this._delay) * timeScale;
        this._startTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])() - (this._currentTime + this._delay) * timeScale;
        return this;
    }
    /** @return {this} */ pause() {
        if (this.paused) return this;
        this.paused = true;
        this.onPause(this);
        return this;
    }
    /** @return {this} */ resume() {
        if (!this.paused) return this;
        this.paused = false;
        // We can safely imediatly render a timer that has no duration and no children
        if (this.duration <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] && !this._hasChildren) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tick"])(this, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"], 0, 0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].FORCE);
        } else {
            if (!this._running) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"], this);
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"]._hasChildren = true;
                this._running = true;
            }
            this.resetTime();
            // Forces the timer to advance by at least one frame when the next tick occurs
            this._startTime -= 12;
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$engine$2f$engine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["engine"].wake();
        }
        return this;
    }
    /** @return {this} */ restart() {
        return this.reset().resume();
    }
    /**
   * @param  {Number} time
   * @param  {Boolean|Number} [muteCallbacks]
   * @param  {Boolean|Number} [internalRender]
   * @return {this}
   */ seek(time, muteCallbacks = 0, internalRender = 0) {
        // Recompose the tween siblings in case the timer has been cancelled
        reviveTimer(this);
        // If you seek a completed animation, otherwise the next play will starts at 0
        this.completed = false;
        const isPaused = this.paused;
        this.paused = true;
        // timer, time, muteCallbacks, internalRender, tickMode
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tick"])(this, time + this._delay, ~~muteCallbacks, ~~internalRender, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].AUTO);
        return isPaused ? this : this.resume();
    }
    /** @return {this} */ alternate() {
        const reversed = this._reversed;
        const count = this.iterationCount;
        const duration = this.iterationDuration;
        // Calculate the maximum iterations possible given the iteration duration
        const iterations = count === Infinity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floor"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxValue"] / duration) : count;
        this._reversed = +(this._alternate && !(iterations % 2) ? reversed : !reversed);
        if (count === Infinity) {
            // Handle infinite loops to loop on themself
            this.iterationProgress = this._reversed ? 1 - this.iterationProgress : this.iterationProgress;
        } else {
            this.seek(duration * iterations - this._currentTime);
        }
        this.resetTime();
        return this;
    }
    /** @return {this} */ play() {
        if (this._reversed) this.alternate();
        return this.resume();
    }
    /** @return {this} */ reverse() {
        if (!this._reversed) this.alternate();
        return this.resume();
    }
    // TODO: Move all the animation / tweens / children related code to Animation / Timeline
    /** @return {this} */ cancel() {
        if (this._hasChildren) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Renderable} */ child)=>child.cancel(), true);
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeTweenSliblings"]);
        }
        this._cancelled = 1;
        // Pausing the timer removes it from the engine
        return this.pause();
    }
    /**
   * @param  {Number} newDuration
   * @return {this}
   */ stretch(newDuration) {
        const currentDuration = this.duration;
        const normlizedDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTime"])(newDuration);
        if (currentDuration === normlizedDuration) return this;
        const timeScale = newDuration / currentDuration;
        const isSetter = newDuration <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
        this.duration = isSetter ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] : normlizedDuration;
        this.iterationDuration = isSetter ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTime"])(this.iterationDuration * timeScale);
        this._offset *= timeScale;
        this._delay *= timeScale;
        this._loopDelay *= timeScale;
        return this;
    }
    /**
   * Cancels the timer by seeking it back to 0 and reverting the attached scroller if necessary
   * @return {this}
   */ revert() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$render$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tick"])(this, 0, 1, 0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickModes"].AUTO);
        const ap = this._autoplay;
        if (ap && ap.linked && ap.linked === this) ap.revert();
        return this.cancel();
    }
    /**
   * Imediatly completes the timer, cancels it and triggers the onComplete callback
   * @return {this}
   */ complete() {
        return this.seek(this.duration).cancel();
    }
    /**
   * @typedef {this & {then: null}} ResolvedTimer
   */ /**
   * @param  {Callback<ResolvedTimer>} [callback]
   * @return Promise<this>
   */ then(callback = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]) {
        const then = this.then;
        const onResolve = ()=>{
            // this.then = null prevents infinite recursion if returned by an async function
            // https://github.com/juliangarnierorg/anime-beta/issues/26
            this.then = null;
            callback(this);
            this.then = then;
            this._resolve = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
        };
        return new Promise((r)=>{
            this._resolve = ()=>r(onResolve());
            // Make sure to resolve imediatly if the timer has already completed
            if (this.completed) this._resolve();
            return this;
        });
    }
}
/**
 * @param {TimerParams} [parameters]
 * @return {Timer}
 */ const createTimer = (parameters)=>new Timer(parameters, null, 0).init();
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/animation.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JSAnimation",
    ()=>JSAnimation,
    "animate",
    ()=>animate
]);
/**
 * Anime.js - animation - ESM
 * @version v4.2.2
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/consts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$targets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/targets.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/values.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$styles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/styles.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$units$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/core/units.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$eases$2f$parser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/easings/eases/parser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$timer$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/timer/timer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/composition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/animejs/dist/modules/animation/additive.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
/**
 * @import {
 *   Tween,
 *   TweenKeyValue,
 *   TweenParamsOptions,
 *   TweenValues,
 *   DurationKeyframes,
 *   PercentageKeyframes,
 *   AnimationParams,
 *   TweenPropValue,
 *   ArraySyntaxValue,
 *   TargetsParam,
 *   TimerParams,
 *   TweenParamValue,
 *   DOMTarget,
 *   TargetsArray,
 *   Callback,
 *   EasingFunction,
 * } from '../types/index.js'
 *
 * @import {
 *   Timeline,
 * } from '../timeline/timeline.js'
 *
 * @import {
 *   Spring,
 * } from '../easings/spring/index.js'
 */ // Defines decomposed values target objects only once and mutate their properties later to avoid GC
// TODO: Maybe move the objects creation to values.js and use the decompose function to create the base object
const fromTargetObject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDecomposedValueTargetObject"])();
const toTargetObject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDecomposedValueTargetObject"])();
const inlineStylesStore = {};
const toFunctionStore = {
    func: null
};
const keyframesTargetArray = [
    null
];
const fastSetValuesArray = [
    null,
    null
];
/** @type {TweenKeyValue} */ const keyObjectTarget = {
    to: null
};
let tweenId = 0;
let keyframes;
/** @type {TweenParamsOptions & TweenValues} */ let key;
/**
 * @param {DurationKeyframes | PercentageKeyframes} keyframes
 * @param {AnimationParams} parameters
 * @return {AnimationParams}
 */ const generateKeyframes = (keyframes, parameters)=>{
    /** @type {AnimationParams} */ const properties = {};
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArr"])(keyframes)) {
        const propertyNames = [].concat(.../** @type {DurationKeyframes} */ keyframes.map((key)=>Object.keys(key))).filter(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isKey"]);
        for(let i = 0, l = propertyNames.length; i < l; i++){
            const propName = propertyNames[i];
            const propArray = /** @type {DurationKeyframes} */ keyframes.map((key)=>{
                /** @type {TweenKeyValue} */ const newKey = {};
                for(let p in key){
                    const keyValue = key[p];
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isKey"])(p)) {
                        if (p === propName) {
                            newKey.to = keyValue;
                        }
                    } else {
                        newKey[p] = keyValue;
                    }
                }
                return newKey;
            });
            properties[propName] = propArray;
        }
    } else {
        const totalDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(parameters.duration, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].defaults.duration);
        const keys = Object.keys(keyframes).map((key)=>{
            return {
                o: parseFloat(key) / 100,
                p: keyframes[key]
            };
        }).sort((a, b)=>a.o - b.o);
        keys.forEach((key)=>{
            const offset = key.o;
            const prop = key.p;
            for(let name in prop){
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isKey"])(name)) {
                    let propArray = properties[name];
                    if (!propArray) propArray = properties[name] = [];
                    const duration = offset * totalDuration;
                    let length = propArray.length;
                    let prevKey = propArray[length - 1];
                    const keyObj = {
                        to: prop[name]
                    };
                    let durProgress = 0;
                    for(let i = 0; i < length; i++){
                        durProgress += propArray[i].duration;
                    }
                    if (length === 1) {
                        keyObj.from = prevKey.to;
                    }
                    if (prop.ease) {
                        keyObj.ease = prop.ease;
                    }
                    keyObj.duration = duration - (length ? durProgress : 0);
                    propArray.push(keyObj);
                }
            }
            return key;
        });
        for(let name in properties){
            const propArray = properties[name];
            let prevEase;
            // let durProgress = 0
            for(let i = 0, l = propArray.length; i < l; i++){
                const prop = propArray[i];
                // Emulate WAPPI easing parameter position
                const currentEase = prop.ease;
                prop.ease = prevEase ? prevEase : undefined;
                prevEase = currentEase;
            // durProgress += prop.duration;
            // if (i === l - 1 && durProgress !== totalDuration) {
            //   propArray.push({ from: prop.to, ease: prop.ease, duration: totalDuration - durProgress })
            // }
            }
            if (!propArray[0].duration) {
                propArray.shift();
            }
        }
    }
    return properties;
};
class JSAnimation extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$timer$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timer"] {
    /**
   * @param {TargetsParam} targets
   * @param {AnimationParams} parameters
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   * @param {Boolean} [fastSet=false]
   * @param {Number} [index=0]
   * @param {Number} [length=0]
   */ constructor(targets, parameters, parent, parentPosition, fastSet = false, index = 0, length = 0){
        super(parameters, parent, parentPosition);
        const parsedTargets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$targets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerTargets"])(targets);
        const targetsLength = parsedTargets.length;
        // If the parameters object contains a "keyframes" property, convert all the keyframes values to regular properties
        const kfParams = /** @type {AnimationParams} */ parameters.keyframes;
        const params = kfParams ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeObjects"])(generateKeyframes(kfParams, parameters), parameters) : parameters;
        const { delay, duration, ease, playbackEase, modifier, composition, onRender } = params;
        const animDefaults = parent ? parent.defaults : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globals"].defaults;
        const animaPlaybackEase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(playbackEase, animDefaults.playbackEase);
        const animEase = animaPlaybackEase ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$eases$2f$parser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseEase"])(animaPlaybackEase) : null;
        const hasSpring = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(ease) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(/** @type {Spring} */ ease.ease);
        const tEasing = hasSpring ? /** @type {Spring} */ ease.ease : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(ease, animEase ? 'linear' : animDefaults.ease);
        const tDuration = hasSpring ? /** @type {Spring} */ ease.settlingDuration : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(duration, animDefaults.duration);
        const tDelay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(delay, animDefaults.delay);
        const tModifier = modifier || animDefaults.modifier;
        // If no composition is defined and the targets length is high (>= 1000) set the composition to 'none' (0) for faster tween creation
        const tComposition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(composition) && targetsLength >= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].none : !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(composition) ? composition : animDefaults.composition;
        // const absoluteOffsetTime = this._offset;
        const absoluteOffsetTime = this._offset + (parent ? parent._offset : 0);
        // This allows targeting the current animation in the spring onComplete callback
        if (hasSpring) /** @type {Spring} */ ease.parent = this;
        let iterationDuration = NaN;
        let iterationDelay = NaN;
        let animationAnimationLength = 0;
        let shouldTriggerRender = 0;
        for(let targetIndex = 0; targetIndex < targetsLength; targetIndex++){
            const target = parsedTargets[targetIndex];
            const ti = index || targetIndex;
            const tl = length || targetsLength;
            let lastTransformGroupIndex = NaN;
            let lastTransformGroupLength = NaN;
            for(let p in params){
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isKey"])(p)) {
                    const tweenType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTweenType"])(target, p);
                    const propName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$styles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePropertyName"])(p, target, tweenType);
                    let propValue = params[p];
                    const isPropValueArray = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArr"])(propValue);
                    if (fastSet && !isPropValueArray) {
                        fastSetValuesArray[0] = propValue;
                        fastSetValuesArray[1] = propValue;
                        propValue = fastSetValuesArray;
                    }
                    // TODO: Allow nested keyframes inside ObjectValue value (prop: { to: [.5, 1, .75, 2, 3] })
                    // Normalize property values to valid keyframe syntax:
                    // [x, y] to [{to: [x, y]}] or {to: x} to [{to: x}] or keep keys syntax [{}, {}, {}...]
                    // const keyframes = isArr(propValue) ? propValue.length === 2 && !isObj(propValue[0]) ? [{ to: propValue }] : propValue : [propValue];
                    if (isPropValueArray) {
                        const arrayLength = /** @type {Array} */ propValue.length;
                        const isNotObjectValue = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObj"])(propValue[0]);
                        // Convert [x, y] to [{to: [x, y]}]
                        if (arrayLength === 2 && isNotObjectValue) {
                            keyObjectTarget.to = propValue;
                            keyframesTargetArray[0] = keyObjectTarget;
                            keyframes = keyframesTargetArray;
                        // Convert [x, y, z] to [[x, y], z]
                        } else if (arrayLength > 2 && isNotObjectValue) {
                            keyframes = [];
                            /** @type {Array.<Number>} */ propValue.forEach((v, i)=>{
                                if (!i) {
                                    fastSetValuesArray[0] = v;
                                } else if (i === 1) {
                                    fastSetValuesArray[1] = v;
                                    keyframes.push(fastSetValuesArray);
                                } else {
                                    keyframes.push(v);
                                }
                            });
                        } else {
                            keyframes = propValue;
                        }
                    } else {
                        keyframesTargetArray[0] = propValue;
                        keyframes = keyframesTargetArray;
                    }
                    let siblings = null;
                    let prevTween = null;
                    let firstTweenChangeStartTime = NaN;
                    let lastTweenChangeEndTime = 0;
                    let tweenIndex = 0;
                    for(let l = keyframes.length; tweenIndex < l; tweenIndex++){
                        const keyframe = keyframes[tweenIndex];
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObj"])(keyframe)) {
                            key = keyframe;
                        } else {
                            keyObjectTarget.to = keyframe;
                            key = keyObjectTarget;
                        }
                        toFunctionStore.func = null;
                        const computedToValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])(key.to, target, ti, tl, toFunctionStore);
                        let tweenToValue;
                        // Allows function based values to return an object syntax value ({to: v})
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObj"])(computedToValue) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(computedToValue.to)) {
                            key = computedToValue;
                            tweenToValue = computedToValue.to;
                        } else {
                            tweenToValue = computedToValue;
                        }
                        const tweenFromValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])(key.from, target, ti, tl);
                        const keyEasing = key.ease;
                        const hasSpring = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(keyEasing) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(/** @type {Spring} */ keyEasing.ease);
                        // Easing are treated differently and don't accept function based value to prevent having to pass a function wrapper that returns an other function all the time
                        const tweenEasing = hasSpring ? /** @type {Spring} */ keyEasing.ease : keyEasing || tEasing;
                        // Calculate default individual keyframe duration by dividing the tl of keyframes
                        const tweenDuration = hasSpring ? /** @type {Spring} */ keyEasing.settlingDuration : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(key.duration, l > 1 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])(tDuration, target, ti, tl) / l : tDuration), target, ti, tl);
                        // Default delay value should only be applied to the first tween
                        const tweenDelay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(key.delay, !tweenIndex ? tDelay : 0), target, ti, tl);
                        const computedComposition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(key.composition, tComposition), target, ti, tl);
                        const tweenComposition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNum"])(computedComposition) ? computedComposition : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"][computedComposition];
                        // Modifiers are treated differently and don't accept function based value to prevent having to pass a function wrapper
                        const tweenModifier = key.modifier || tModifier;
                        const hasFromvalue = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(tweenFromValue);
                        const hasToValue = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(tweenToValue);
                        const isFromToArray = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArr"])(tweenToValue);
                        const isFromToValue = isFromToArray || hasFromvalue && hasToValue;
                        const tweenStartTime = prevTween ? lastTweenChangeEndTime + tweenDelay : tweenDelay;
                        // Rounding is necessary here to minimize floating point errors when working in seconds
                        const absoluteStartTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(absoluteOffsetTime + tweenStartTime, 12);
                        // Force a onRender callback if the animation contains at least one from value and autoplay is set to false
                        if (!shouldTriggerRender && (hasFromvalue || isFromToArray)) shouldTriggerRender = 1;
                        let prevSibling = prevTween;
                        if (tweenComposition !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].none) {
                            if (!siblings) siblings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTweenSiblings"])(target, propName);
                            let nextSibling = siblings._head;
                            // Iterate trough all the next siblings until we find a sibling with an equal or inferior start time
                            while(nextSibling && !nextSibling._isOverridden && nextSibling._absoluteStartTime <= absoluteStartTime){
                                prevSibling = nextSibling;
                                nextSibling = nextSibling._nextRep;
                                // Overrides all the next siblings if the next sibling starts at the same time of after as the new tween start time
                                if (nextSibling && nextSibling._absoluteStartTime >= absoluteStartTime) {
                                    while(nextSibling){
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["overrideTween"])(nextSibling);
                                        // This will ends both the current while loop and the upper one once all the next sibllings have been overriden
                                        nextSibling = nextSibling._nextRep;
                                    }
                                }
                            }
                        }
                        // Decompose values
                        if (isFromToValue) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(isFromToArray ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])(tweenToValue[0], target, ti, tl) : tweenFromValue, fromTargetObject);
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(isFromToArray ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFunctionValue"])(tweenToValue[1], target, ti, tl, toFunctionStore) : tweenToValue, toTargetObject);
                            if (fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].NUMBER) {
                                if (prevSibling) {
                                    if (prevSibling._valueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT) {
                                        fromTargetObject.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT;
                                        fromTargetObject.u = prevSibling._unit;
                                    }
                                } else {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOriginalAnimatableValue"])(target, propName, tweenType, inlineStylesStore), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"]);
                                    if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"].t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT) {
                                        fromTargetObject.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT;
                                        fromTargetObject.u = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"].u;
                                    }
                                }
                            }
                        } else {
                            if (hasToValue) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(tweenToValue, toTargetObject);
                            } else {
                                if (prevTween) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeTweenValue"])(prevTween, toTargetObject);
                                } else {
                                    // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOriginalAnimatableValue"])(target, propName, tweenType, inlineStylesStore), toTargetObject);
                                }
                            }
                            if (hasFromvalue) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(tweenFromValue, fromTargetObject);
                            } else {
                                if (prevTween) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeTweenValue"])(prevTween, fromTargetObject);
                                } else {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOriginalAnimatableValue"])(target, propName, tweenType, inlineStylesStore), fromTargetObject);
                                }
                            }
                        }
                        // Apply operators
                        if (fromTargetObject.o) {
                            fromTargetObject.n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRelativeValue"])(!prevSibling ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOriginalAnimatableValue"])(target, propName, tweenType, inlineStylesStore), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"]).n : prevSibling._toNumber, fromTargetObject.n, fromTargetObject.o);
                        }
                        if (toTargetObject.o) {
                            toTargetObject.n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRelativeValue"])(fromTargetObject.n, toTargetObject.n, toTargetObject.o);
                        }
                        // Values omogenisation in cases of type difference between "from" and "to"
                        if (fromTargetObject.t !== toTargetObject.t) {
                            if (fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX || toTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX) {
                                const complexValue = fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX ? fromTargetObject : toTargetObject;
                                const notComplexValue = fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX ? toTargetObject : fromTargetObject;
                                notComplexValue.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COMPLEX;
                                notComplexValue.s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(complexValue.s);
                                notComplexValue.d = complexValue.d.map(()=>notComplexValue.n);
                            } else if (fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT || toTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT) {
                                const unitValue = fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT ? fromTargetObject : toTargetObject;
                                const notUnitValue = fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT ? toTargetObject : fromTargetObject;
                                notUnitValue.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].UNIT;
                                notUnitValue.u = unitValue.u;
                            } else if (fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR || toTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR) {
                                const colorValue = fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR ? fromTargetObject : toTargetObject;
                                const notColorValue = fromTargetObject.t === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR ? toTargetObject : fromTargetObject;
                                notColorValue.t = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueTypes"].COLOR;
                                notColorValue.s = colorValue.s;
                                notColorValue.d = [
                                    0,
                                    0,
                                    0,
                                    1
                                ];
                            }
                        }
                        // Unit conversion
                        if (fromTargetObject.u !== toTargetObject.u) {
                            let valueToConvert = toTargetObject.u ? fromTargetObject : toTargetObject;
                            valueToConvert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$units$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertValueUnit"])(target, valueToConvert, toTargetObject.u ? toTargetObject.u : fromTargetObject.u, false);
                        // TODO:
                        // convertValueUnit(target, to.u ? from : to, to.u ? to.u : from.u);
                        }
                        // Fill in non existing complex values
                        if (toTargetObject.d && fromTargetObject.d && toTargetObject.d.length !== fromTargetObject.d.length) {
                            const longestValue = fromTargetObject.d.length > toTargetObject.d.length ? fromTargetObject : toTargetObject;
                            const shortestValue = longestValue === fromTargetObject ? toTargetObject : fromTargetObject;
                            // TODO: Check if n should be used instead of 0 for default complex values
                            shortestValue.d = longestValue.d.map((/** @type {Number} */ _, /** @type {Number} */ i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnd"])(shortestValue.d[i]) ? 0 : shortestValue.d[i]);
                            shortestValue.s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(longestValue.s);
                        }
                        // Tween factory
                        // Rounding is necessary here to minimize floating point errors when working in seconds
                        const tweenUpdateDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(+tweenDuration || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"], 12);
                        // Copy the value of the iniline style if it exist and imediatly nullify it to prevents false positive on other targets
                        let inlineValue = inlineStylesStore[propName];
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNil"])(inlineValue)) inlineStylesStore[propName] = null;
                        /** @type {Tween} */ const tween = {
                            parent: this,
                            id: tweenId++,
                            property: propName,
                            target: target,
                            _value: null,
                            _func: toFunctionStore.func,
                            _ease: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$easings$2f$eases$2f$parser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseEase"])(tweenEasing),
                            _fromNumbers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(fromTargetObject.d),
                            _toNumbers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(toTargetObject.d),
                            _strings: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(toTargetObject.s),
                            _fromNumber: fromTargetObject.n,
                            _toNumber: toTargetObject.n,
                            _numbers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(fromTargetObject.d),
                            _number: fromTargetObject.n,
                            _unit: toTargetObject.u,
                            _modifier: tweenModifier,
                            _currentTime: 0,
                            _startTime: tweenStartTime,
                            _delay: +tweenDelay,
                            _updateDuration: tweenUpdateDuration,
                            _changeDuration: tweenUpdateDuration,
                            _absoluteStartTime: absoluteStartTime,
                            // NOTE: Investigate bit packing to stores ENUM / BOOL
                            _tweenType: tweenType,
                            _valueType: toTargetObject.t,
                            _composition: tweenComposition,
                            _isOverlapped: 0,
                            _isOverridden: 0,
                            _renderTransforms: 0,
                            _inlineValue: inlineValue,
                            _prevRep: null,
                            _nextRep: null,
                            _prevAdd: null,
                            _nextAdd: null,
                            _prev: null,
                            _next: null
                        };
                        if (tweenComposition !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].none) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$composition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeTween"])(tween, siblings);
                        }
                        if (isNaN(firstTweenChangeStartTime)) {
                            firstTweenChangeStartTime = tween._startTime;
                        }
                        // Rounding is necessary here to minimize floating point errors when working in seconds
                        lastTweenChangeEndTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(tweenStartTime + tweenUpdateDuration, 12);
                        prevTween = tween;
                        animationAnimationLength++;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(this, tween);
                    }
                    // Update animation timings with the added tweens properties
                    if (isNaN(iterationDelay) || firstTweenChangeStartTime < iterationDelay) {
                        iterationDelay = firstTweenChangeStartTime;
                    }
                    if (isNaN(iterationDuration) || lastTweenChangeEndTime > iterationDuration) {
                        iterationDuration = lastTweenChangeEndTime;
                    }
                    // TODO: Find a way to inline tween._renderTransforms = 1 here
                    if (tweenType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenTypes"].TRANSFORM) {
                        lastTransformGroupIndex = animationAnimationLength - tweenIndex;
                        lastTransformGroupLength = animationAnimationLength;
                    }
                }
            }
            // Set _renderTransforms to last transform property to correctly render the transforms list
            if (!isNaN(lastTransformGroupIndex)) {
                let i = 0;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Tween} */ tween)=>{
                    if (i >= lastTransformGroupIndex && i < lastTransformGroupLength) {
                        tween._renderTransforms = 1;
                        if (tween._composition === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositionTypes"].blend) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$animation$2f$additive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["additive"].animation, (/** @type {Tween} */ additiveTween)=>{
                                if (additiveTween.id === tween.id) {
                                    additiveTween._renderTransforms = 1;
                                }
                            });
                        }
                    }
                    i++;
                });
            }
        }
        if (!targetsLength) {
            console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
        }
        if (iterationDelay) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Tween} */ tween)=>{
                // If (startTime - delay) equals 0, this means the tween is at the begining of the animation so we need to trim the delay too
                if (!(tween._startTime - tween._delay)) {
                    tween._delay -= iterationDelay;
                }
                tween._startTime -= iterationDelay;
            });
            iterationDuration -= iterationDelay;
        } else {
            iterationDelay = 0;
        }
        // Prevents iterationDuration to be NaN if no valid animatable props have been provided
        // Prevents _iterationCount to be NaN if no valid animatable props have been provided
        if (!iterationDuration) {
            iterationDuration = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
            this.iterationCount = 0;
        }
        /** @type {TargetsArray} */ this.targets = parsedTargets;
        /** @type {Number} */ this.duration = iterationDuration === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampInfinity"])((iterationDuration + this._loopDelay) * this.iterationCount - this._loopDelay) || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"];
        /** @type {Callback<this>} */ this.onRender = onRender || animDefaults.onRender;
        /** @type {EasingFunction} */ this._ease = animEase;
        /** @type {Number} */ this._delay = iterationDelay;
        // NOTE: I'm keeping delay values separated from offsets in timelines because delays can override previous tweens and it could be confusing to debug a timeline with overridden tweens and no associated visible delays.
        // this._delay = parent ? 0 : iterationDelay;
        // this._offset += parent ? iterationDelay : 0;
        /** @type {Number} */ this.iterationDuration = iterationDuration;
        if (!this._autoplay && shouldTriggerRender) this.onRender(this);
    }
    /**
   * @param  {Number} newDuration
   * @return {this}
   */ stretch(newDuration) {
        const currentDuration = this.duration;
        if (currentDuration === (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTime"])(newDuration)) return this;
        const timeScale = newDuration / currentDuration;
        // NOTE: Find a better way to handle the stretch of an animation after stretch = 0
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Tween} */ tween)=>{
            // Rounding is necessary here to minimize floating point errors
            tween._updateDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTime"])(tween._updateDuration * timeScale);
            tween._changeDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTime"])(tween._changeDuration * timeScale);
            tween._currentTime *= timeScale;
            tween._startTime *= timeScale;
            tween._absoluteStartTime *= timeScale;
        });
        return super.stretch(newDuration);
    }
    /**
   * @return {this}
   */ refresh() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChildren"])(this, (/** @type {Tween} */ tween)=>{
            const tweenFunc = tween._func;
            if (tweenFunc) {
                const ogValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOriginalAnimatableValue"])(tween.target, tween.property, tween._tweenType);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(ogValue, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"]);
                // TODO: Check for from / to Array based values here,
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposeRawValue"])(tweenFunc(), toTargetObject);
                tween._fromNumbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"].d);
                tween._fromNumber = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"].n;
                tween._toNumbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(toTargetObject.d);
                tween._strings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneArray"])(toTargetObject.s);
                // Make sure to apply relative operators https://github.com/juliangarnier/anime/issues/1025
                tween._toNumber = toTargetObject.o ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRelativeValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$values$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decomposedOriginalValue"].n, toTargetObject.n, toTargetObject.o) : toTargetObject.n;
            }
        });
        // This forces setter animations to render once
        if (this.duration === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$consts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minValue"]) this.restart();
        return this;
    }
    /**
   * Cancel the animation and revert all the values affected by this animation to their original state
   * @return {this}
   */ revert() {
        super.revert();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$animejs$2f$dist$2f$modules$2f$core$2f$styles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cleanInlineStyles"])(this);
    }
    /**
   * @typedef {this & {then: null}} ResolvedJSAnimation
   */ /**
   * @param  {Callback<ResolvedJSAnimation>} [callback]
   * @return Promise<this>
   */ then(callback) {
        return super.then(callback);
    }
}
/**
 * @param {TargetsParam} targets
 * @param {AnimationParams} parameters
 * @return {JSAnimation}
 */ const animate = (targets, parameters)=>new JSAnimation(targets, parameters, null, 0, false).init();
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Menu
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M4 5h16",
            key: "1tepv9"
        }
    ],
    [
        "path",
        {
            d: "M4 12h16",
            key: "1lakjw"
        }
    ],
    [
        "path",
        {
            d: "M4 19h16",
            key: "1djgab"
        }
    ]
];
const Menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("menu", __iconNode);
;
 //# sourceMappingURL=menu.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Menu",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript)");
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>X
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("x", __iconNode);
;
 //# sourceMappingURL=x.js.map
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=d605f_41bc8cde._.js.map