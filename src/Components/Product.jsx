import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  addMultipleToCart,
  fetchCategories,
} from "../Redux/Slice";
import { Car, ShoppingCart } from "lucide-react";
import axios from "axios";

export default function Products() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);
  const cartItems = useSelector((state) => state.products.cart);

  const [flying, setFlying] = useState(false);
  const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });
  const [flyEnd, setFlyEnd] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);

  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const buttonRefs = useRef({});
  const cartIconRef = useRef(null);
  const productSectionRef = useRef(null);
  const cartSectionRef = useRef(null);

  const [showStickyCategory, setShowStickyCategory] = useState(true);

  // ✅ Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await dispatch(fetchCategories());
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    loadCategories();
  }, [dispatch]);

  // ✅ Set default selected category
  useEffect(() => {
    if (categories.length > 0 && selected === null) {
      setSelected(categories[0].id);
    }
  }, [categories, selected]);

  // ✅ Sticky categories toggle
  useEffect(() => {
    const handleScroll = () => {
      const cartTop = cartSectionRef.current?.offsetTop || 0;
      const scrollY = window.scrollY + 100;
      setShowStickyCategory(scrollY < cartTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.Qty, 0);
  const selectedCategory = categories.find((c) => c.id === selected);

  // ✅ Change category
  const handleSelect = (id) => {
    setSelected(id);

    // center category button in view
    if (buttonRefs.current[id]) {
      buttonRefs.current[id].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    // scroll product section to top
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleIncrease = (productId, categoryId) => {
    dispatch(increaseQty({ categoryId, productId }));
  };

  const handleDecrease = (productId, categoryId) => {
    dispatch(decreaseQty({ categoryId, productId }));
  };

  const handleAddToCart = (category, e) => {
    const itemsToAdd = category.items.filter((item) => item.Qty > 0);
    if (itemsToAdd.length === 0) {
      alert("Please increase quantity before adding to cart!");
      return;
    }

    if (cartIconRef.current) {
      const btn = e.currentTarget.getBoundingClientRect();
      const cart = cartIconRef.current.getBoundingClientRect();
      const startX = btn.left + window.scrollX;
      const startY = btn.top + window.scrollY;
      const endX = cart.left + window.scrollX;
      const endY = cart.top + window.scrollY;

      setFlyStart({ x: startX, y: startY });
      setFlyEnd({ x: endX, y: endY });
      setFlying(true);

      setTimeout(() => {
        dispatch(addMultipleToCart({ categoryId: category.id, items: itemsToAdd }));
        setFlying(false);
      }, 1200);
    }
  };

  const handleCartClick = () => {
    if (cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://crackersss-production.up.railway.app/api/orders", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        cart: cartItems.filter((item) => item.Qty > 0),
      });

      if (res.data.success) {
        setShowForm(false);
        setShowPopup(true);
        setFormData({ name: "", phone: "", address: "" });
        setTimeout(() => setShowPopup(false), 3000);
        console.log("✅ Order placed, ID:", res.data.orderId);
      }
    } catch (err) {
      console.error("❌ Order failed:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="scroll-smooth pt-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-4xl font-bold mb-4"
      >
        Our Products
      </motion.h1>

      {/* ✅ Products Section */}
      <section ref={productSectionRef} className="px-6 py-10 min-h-screen">
        {showStickyCategory && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-18 bg-white z-10"
          >
            <div className="flex mx-5 overflow-x-auto gap-4 p-2 scrollbar-hide scroll-smooth">
              {categories.map((item, i) => (
                <motion.button
                  key={item.id}
                  ref={(el) => (buttonRefs.current[item.id] = el)}
                  onClick={() => handleSelect(item.id)}
                  className="flex-shrink-0 flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className={`h-24 w-24 m-2 p-1 rounded-full transition 
                      ${selected === item.id ? "border-4 border-blue-600" : "border"}`}
                  />
                  <h2 className="font-semibold">{item.name}</h2>
                </motion.button>
              ))}
            </div>
            <hr className="my-2" />
          </motion.div>
        )}

        {selectedCategory && (
          <motion.div
            key={selectedCategory.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-10 px-27"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">{selectedCategory.Name}</h2>
              <div ref={cartIconRef} className="relative">
                <button onClick={handleCartClick}>
                  <ShoppingCart className="size-9" />
                </button>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
            </div>
            <div className="divide-y divide-gray-200 relative">
              <div className="max-h-[450px] overflow-y-auto pr-2">
                   {selectedCategory.items.map((item, i) => (
                    <motion.div
                      key={item.id}
                       initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                     className="flex items-center justify-between py-4 border-b last:border-b-0"
    >
      {/* Left: Image + Details */}
      <div className="flex items-center gap-4">
        <img
          src={`https://crackersss-production.up.railway.app/${item.img.replace(/^\/+/, "")}`}
          alt={item.name}
          className="h-20 w-20 object-cover rounded-xl shadow-md border"
        />
        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>

          {/* Old price (per unit) */}
          <p className="text-sm text-gray-400 line-through">
            ₹{item.Mkt_price} <span className="text-xs">(per unit)</span>
          </p>

          {/* Our price (per unit) */}
          <p className="text-green-600 font-bold">
            ₹{item.our_price}{" "}
            <span className="text-xs font-normal text-gray-400">(per unit)</span>
          </p>

          {/* Total Price comparison */}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 line-through">
              ₹{item.Mkt_price * item.Qty}
            </p>
            <p className="text-blue-600 font-semibold">
              Total: ₹{item.our_price * item.Qty}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Quantity controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleDecrease(item.id, selectedCategory.id)}
          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.Qty}</span>
        <button
          onClick={() => handleIncrease(item.id, selectedCategory.id)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          +
        </button>
      </div>
    </motion.div>
  ))}
</div>



              <div className="flex justify-end mt-4 sticky bottom-0 bg-white py-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => handleAddToCart(selectedCategory, e)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg flex gap-3.5 hover:bg-green-700"
                >
                  Add to Cart
                </motion.button>
              </div>

              {/* ✅ Fly animation */}
              <AnimatePresence>
                {flying && (
                  <motion.div
                    style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
                    className="pointer-events-none"
                    initial={{ x: flyStart.x, y: flyStart.y, scale: 1, opacity: 1 }}
                    animate={{ x: flyEnd.x, y: flyEnd.y, scale: 0.6, opacity: 0.9 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  >
                    <ShoppingCart className="size-12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </section>

      {/* Cart Section */}
      <motion.section
        ref={cartSectionRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="px-27 pt-20 bg-gray-100 min-h-screen"
      >
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.filter((item) => item.Qty > 0).length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {cartItems
              .filter((item) => item.Qty > 0)
              .map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
  src={`https://crackersss-production.up.railway.app/${item.img.replace(/^\/+/, '')}`}
  alt={item.name}
  className="h-20 w-20 object-cover rounded-lg border"
/>

                    <div>
                      <h3 className="font-semibold">{item.Name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.Qty}</p>
                      <p className="text-green-600 font-bold">
                        ₹{item.our_price * item.Qty}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">
                ₹
                {cartItems.reduce((sum, item) => sum + item.our_price * item.Qty, 0)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Place Order
            </motion.button>
          </div>
        )}
      </motion.section>

      {/* ✅ Order Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg"
            >
              <h2 className="text-2xl font-bold mb-4">Order Form</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                  >
                    Submit Order
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Success Car Animation */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ x: window.innerWidth, opacity: 1 }}
            animate={{ x: -window.innerWidth }}
            exit={{ opacity: 0 }}
            transition={{ duration: 15, ease: "linear" }}
            className="fixed top-1/2 left-0 transform -translate-y-1/2 flex items-center gap-3 z-50"
          >
            <motion.div
              className="relative"
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Car
                style={{ transform: "scaleX(-1)" }}
                className="text-blue-500 w-10 h-10 animate-pulse"
              />
              <motion.div
                animate={{ width: [20, 50, 30] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-1/2 left-full h-[2px] bg-gray-600"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, delay: 0.5 }}
              className="bg-white shadow-xl p-4 rounded-2xl text-green-600 font-semibold"
            >
              🚚 Order submitted! Delivery soon.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
