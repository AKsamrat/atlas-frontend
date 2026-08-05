import { useCallback, useEffect, useReducer, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Cart Store — Context + Reducer with localStorage persistence       */
/* ------------------------------------------------------------------ */

export interface CartItem {
    /** Unique key: serviceKey + plan name */
    id: string;
    serviceKey: string;
    name: string;
    price: string;
    period: string;
    tagline: string;
    features: string[];
    highlight: boolean;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
    | { type: "REMOVE_ITEM"; payload: { id: string } }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

const CART_STORAGE_KEY = "entra-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((item) => item.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
            };
        }
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload.id),
            };
        case "UPDATE_QUANTITY":
            if (action.payload.quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter((item) => item.id !== action.payload.id),
                };
            }
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case "CLEAR_CART":
            return { items: [] };
        case "LOAD_CART":
            return { items: action.payload };
        default:
            return state;
    }
}

function getStoredCart(): CartState {
    if (typeof window === "undefined") return { items: [] };
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return { items: [] };
        return { items: JSON.parse(raw) };
    } catch {
        return { items: [] };
    }
}

/* ---- Context (lives in useCart.ts) ---- */
import { CartContext } from "./useCart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, undefined, getStoredCart);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }, [state.items]);

    const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
        dispatch({ type: "ADD_ITEM", payload: item });
    }, []);

    const removeItem = useCallback((id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: { id } });
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: "CLEAR_CART" });
    }, []);

    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

    // Parse price strings like "4,999" or "$499" or "2,499" to number
    const parsePrice = (price: string): number => {
        const cleaned = price.replace(/[^0-9.]/g, "");
        return parseFloat(cleaned) || 0;
    };

    const totalPrice = state.items
        .reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)
        .toLocaleString("en-US");

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                totalItems,
                totalPrice,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}


