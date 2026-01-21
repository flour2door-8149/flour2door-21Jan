(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/features/cart/cartSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToCart",
    ()=>addToCart,
    "clearCart",
    ()=>clearCart,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteItemFromCart",
    ()=>deleteItemFromCart,
    "fetchCart",
    ()=>fetchCart,
    "removeFromCart",
    ()=>removeFromCart,
    "uploadCart",
    ()=>uploadCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
;
let debounceTimer = null;
const uploadCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('cart/uploadCart', async (param, thunkAPI)=>{
    let { getToken } = param;
    try {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async ()=>{
            const { cartItems } = thunkAPI.getState().cart;
            const token = await getToken();
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/api/cart', {
                cart: cartItems
            }, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
        }, 1000);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const fetchCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('cart/fetchCart', async (param, thunkAPI)=>{
    let { getToken } = param;
    try {
        const token = await getToken();
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/api/cart', {
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const cartSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {}
    },
    reducers: {
        addToCart: (state, action)=>{
            const { productId } = action.payload;
            if (state.cartItems[productId]) {
                state.cartItems[productId]++;
            } else {
                state.cartItems[productId] = 1;
            }
            state.total += 1;
        },
        removeFromCart: (state, action)=>{
            const { productId } = action.payload;
            if (state.cartItems[productId]) {
                state.cartItems[productId]--;
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId];
                }
            }
            state.total -= 1;
        },
        deleteItemFromCart: (state, action)=>{
            const { productId } = action.payload;
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0;
            delete state.cartItems[productId];
        },
        clearCart: (state)=>{
            state.cartItems = {};
            state.total = 0;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCart.fulfilled, (state, action)=>{
            state.cartItems = action.payload.cart;
            state.total = Object.values(action.payload.cart).reduce((acc, item)=>acc + item, 0);
        });
    }
});
const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions;
const __TURBOPACK__default__export__ = cartSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/features/product/productSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearProduct",
    ()=>clearProduct,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchProducts",
    ()=>fetchProducts,
    "setProduct",
    ()=>setProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('product/fetchProducts', async (param, thunkAPI)=>{
    let { storeId } = param;
    try {
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/api/products' + (storeId ? "?storeId=".concat(storeId) : ''));
        return data.products;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const productSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'product',
    initialState: {
        list: []
    },
    reducers: {
        setProduct: (state, action)=>{
            state.list = action.payload;
        },
        clearProduct: (state)=>{
            state.list = [];
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.list = action.payload;
        });
    }
});
const { setProduct, clearProduct } = productSlice.actions;
const __TURBOPACK__default__export__ = productSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/features/address/addressSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAddress",
    ()=>addAddress,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchAddress",
    ()=>fetchAddress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('address/fetchAddress', async (param, thunkAPI)=>{
    let { getToken } = param;
    try {
        const token = await getToken();
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/api/address', {
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        return data ? data.addresses : [];
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const addressSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'address',
    initialState: {
        list: []
    },
    reducers: {
        addAddress: (state, action)=>{
            state.list.push(action.payload);
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchAddress.fulfilled, (state, action)=>{
            state.list = action.payload;
        });
    }
});
const { addAddress } = addressSlice.actions;
const __TURBOPACK__default__export__ = addressSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/features/rating/ratingSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addRating",
    ()=>addRating,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchUserRatings",
    ()=>fetchUserRatings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchUserRatings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('rating/fetchUserRatings', async (param, thunkAPI)=>{
    let { getToken } = param;
    try {
        const token = await getToken();
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/api/rating', {
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        return data ? data.ratings : [];
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const ratingSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'rating',
    initialState: {
        ratings: []
    },
    reducers: {
        addRating: (state, action)=>{
            state.ratings.push(action.payload);
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUserRatings.fulfilled, (state, action)=>{
            state.ratings = action.payload;
        });
    }
});
const { addRating } = ratingSlice.actions;
const __TURBOPACK__default__export__ = ratingSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeStore",
    ()=>makeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$cart$2f$cartSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/features/cart/cartSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$product$2f$productSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/features/product/productSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$address$2f$addressSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/features/address/addressSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$rating$2f$ratingSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/features/rating/ratingSlice.js [app-client] (ecmascript)");
;
;
;
;
;
const makeStore = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: {
            cart: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$cart$2f$cartSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            product: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$product$2f$productSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$address$2f$addressSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            rating: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$features$2f$rating$2f$ratingSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        }
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/StoreProvider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function StoreProvider(param) {
    let { children } = param;
    _s();
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeStore"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: storeRef.current,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/StoreProvider.js",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_s(StoreProvider, "EtiU7pDwGhTDZwMnrKEqZbxjqXE=");
_c = StoreProvider;
var _c;
__turbopack_context__.k.register(_c, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_17806289._.js.map