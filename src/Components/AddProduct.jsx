import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProductForm() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    Mkt_price: "",
    our_price: "",
    img: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://crackersss-production.up.railway.app/api/categories");
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: res.data[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files[0]) {
      setFormData((prev) => ({ ...prev, img: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.img) {
      alert("Please select an image!");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      setLoading(true);
      const res = await axios.post("https://crackersss-production.up.railway.app/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("✅ Product added successfully!");
        setFormData({
          categoryId: categories[0]?.id || "",
          name: "",
          Mkt_price: "",
          our_price: "",
          img: null,
        });
        setPreview("");
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("❌ Error adding product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative top-30 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Cracker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Cracker Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="Mkt_price"
          value={formData.Mkt_price}
          onChange={handleChange}
          placeholder="Market Price"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="our_price"
          value={formData.our_price}
          onChange={handleChange}
          placeholder="Our Price"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
          required
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-28 w-28 object-cover rounded mt-2"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
