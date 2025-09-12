
// import img1 from "../assets/Catagory/oneshot.jpg"
// import img2 from "../assets/Catagory/Chakkars.jpg"
// import img3 from "../assets/Catagory/bgimg4.jpg"
// import img4 from "../assets/Catagory/Sparklers.jpg"
// import img5 from "../assets/Catagory/bgimg3.jpg"
// import img6 from "../assets/Catagory/Bijili Crackers.jpg"
// import img7 from "../assets/Catagory/AtomBombs1.jpg"
// import img8 from "../assets/Catagory/SevenShots.jpg"
// import img9 from "../assets/Catagory/NightAerialFancy.jpg"
// import img10 from "../assets/Catagory/MusicalNovelties.jpg"
// import { createSlice } from "@reduxjs/toolkit"

// const initialState = {
//   categories: [
//     { id: 1, img: img1, Name: "One Sound Crackers", items: [] },
//     { id: 2, img: img2, Name: "Ground Chakkars", items: [] },
//     { id: 3, img: img3, Name: "Flower Pots", items: [] },
//     { id: 4, img: img4, Name: "Sparklers", items: [] },
//     { id: 5, img: img5, Name: "Rockets", items: [] },
//     { id: 6, img: img6, Name: "Bijili Crackers", items: [] },
//     { id: 7, img: img7, Name: "Atom Bombs", items: [] },
//     { id: 8, img: img8, Name: "Mini Aerial Fancy", items: [] },
//     { id: 9, img: img9, Name: "Night Aerial Fancy", items: [] },
//     { id: 10, img: img10, Name: "Musical Novelties", items: [] },
//   ],
//   cart: [],
// };

// const productSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     // Admin adds new product -> force Qty = 0 (admin cannot set qty)
//     addProduct: (state, action) => {
//       const { categoryId, product } = action.payload;
//       const category = state.categories.find((cat) => cat.id === Number(categoryId));
//       if (category) {
//         // strip Qty if present from payload, then force Qty: 0
//         const { Qty: _ignored, ...safe } = product || {};
//         category.items.push({
//           id: Date.now(),
//           ...safe,
//           Qty: 0,
//         });
//       }
//     },

//     // User increases qty
//     increaseQty: (state, action) => {
//       const { categoryId, productId } = action.payload;
//       const category = state.categories.find((cat) => cat.id === Number(categoryId));
//       const product = category?.items.find((p) => p.id === productId);
//       if (product) product.Qty += 1;
//     },

//     // User decreases qty (can go down to 0)
//     decreaseQty: (state, action) => {
//       const { categoryId, productId } = action.payload;
//       const category = state.categories.find((cat) => cat.id === Number(categoryId));
//       const product = category?.items.find((p) => p.id === productId);
//       if (product && product.Qty > 0) product.Qty -= 1;
//     },

//     // Add/Update single product in cart; remove if Qty <= 0
//     addToCart: (state, action) => {
//       const { id, categoryId, Name, our_price, Qty, img } = action.payload;
//       const idx = state.cart.findIndex(
//         (item) => item.id === id && item.categoryId === Number(categoryId)
//       );
//       if (Qty <= 0) {
//         if (idx !== -1) state.cart.splice(idx, 1); // remove if exists
//         return;
//       }
//       if (idx !== -1) {
//         state.cart[idx].Qty = Qty;
//         state.cart[idx].our_price = our_price;
//       } else {
//         state.cart.push({ id, categoryId: Number(categoryId), Name, our_price, Qty, img });
//       }
//     },

//     // Add all selected items from a category and keep cart in sync:
//     // - items with Qty > 0 -> upsert
//     // - items with Qty = 0 -> remove from cart
//     addMultipleToCart: (state, action) => {
//       const { categoryId, items } = action.payload;
//       const catId = Number(categoryId);

//       // Build set of selected item ids with Qty > 0
//       const selectedIds = new Set(items.filter(i => i.Qty > 0).map(i => i.id));

//       // Remove any cart items from this category that are NOT in selectedIds
//       state.cart = state.cart.filter(
//         (ci) => !(ci.categoryId === catId && !selectedIds.has(ci.id))
//       );

//       // Upsert the selected (>0) ones
//       items.forEach(({ id, Name, our_price, Qty, img }) => {
//         if (Qty > 0) {
//           const existing = state.cart.find(
//             (item) => item.id === id && item.categoryId === catId
//           );
//           if (existing) {
//             existing.Qty = Qty;
//             existing.our_price = our_price;
//           } else {
//             state.cart.push({ id, categoryId: catId, Name, our_price, Qty, img });
//           }
//         }
//       });
//     },

//     clearCart: (state) => {
//       state.cart = [];
//       // keep product Qty as is (user selections), or reset if you prefer:
//       // state.categories.forEach((cat) => cat.items.forEach((p) => (p.Qty = 0)));
//     },
//   },
// });

// export const {
//   addProduct,
//   increaseQty,
//   decreaseQty,
//   addToCart,
//   addMultipleToCart,
//   clearCart,
// } = productSlice.actions;

// export default productSlice.reducer;



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk to fetch categories + products from backend
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    const res = await axios.get("https://mysql-production-986b.up.railway.app/api/categories");
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: [],
    cart: [],
    status: "idle", // idle | loading | succeeded | failed
  },
  reducers: {
    // Admin adds new product -> force Qty = 0
    addProduct: (state, action) => {
      const { categoryId, product } = action.payload;
      const category = state.categories.find(
        (cat) => cat.id === Number(categoryId)
      );
      if (category) {
        const { Qty: _ignored, ...safe } = product || {};
        category.items.push({
          id: Date.now(),
          ...safe,
          Qty: 0,
        });
      }
    },

    increaseQty: (state, action) => {
      const { categoryId, productId } = action.payload;
      const category = state.categories.find(
        (cat) => cat.id === Number(categoryId)
      );
      const product = category?.items.find((p) => p.id === productId);
      if (product) product.Qty += 1;
    },

    decreaseQty: (state, action) => {
      const { categoryId, productId } = action.payload;
      const category = state.categories.find(
        (cat) => cat.id === Number(categoryId)
      );
      const product = category?.items.find((p) => p.id === productId);
      if (product && product.Qty > 0) product.Qty -= 1;
    },

    addToCart: (state, action) => {
      const { id, categoryId, Name, our_price, Qty, img } = action.payload;
      const idx = state.cart.findIndex(
        (item) => item.id === id && item.categoryId === Number(categoryId)
      );
      if (Qty <= 0) {
        if (idx !== -1) state.cart.splice(idx, 1);
        return;
      }
      if (idx !== -1) {
        state.cart[idx].Qty = Qty;
        state.cart[idx].our_price = our_price;
      } else {
        state.cart.push({
          id,
          categoryId: Number(categoryId),
          Name,
          our_price,
          Qty,
          img,
        });
      }
    },

    addMultipleToCart: (state, action) => {
      const { categoryId, items } = action.payload;
      const catId = Number(categoryId);

      const selectedIds = new Set(items.filter((i) => i.Qty > 0).map((i) => i.id));

      state.cart = state.cart.filter(
        (ci) => !(ci.categoryId === catId && !selectedIds.has(ci.id))
      );

      items.forEach(({ id, Name, our_price, Qty, img }) => {
        if (Qty > 0) {
          const existing = state.cart.find(
            (item) => item.id === id && item.categoryId === catId
          );
          if (existing) {
            existing.Qty = Qty;
            existing.our_price = our_price;
          } else {
            state.cart.push({ id, categoryId: catId, Name, our_price, Qty, img });
          }
        }
      });
    },

    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        // API already returns categories + items
        state.categories = action.payload.map((cat) => ({
          ...cat,
          items: cat.items.map((p) => ({ ...p, Qty: p.Qty || 0 })),
        }));
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  addProduct,
  increaseQty,
  decreaseQty,
  addToCart,
  addMultipleToCart,
  clearCart,
} = productSlice.actions;

export default productSlice.reducer;
