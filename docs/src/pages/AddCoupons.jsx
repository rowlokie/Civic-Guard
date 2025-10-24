import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminCoupons = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    description: "",
    maxUses: "",
    expiryDate: "",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createCoupon = async () => {
    try {
      await axios.post("https://civic-guard-3tds.onrender.com/api/coupons", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Coupon created!");
      setForm({ code: "", discount: "", description: "", maxUses: "", expiryDate: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Error creating coupon");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg space-y-4">
      <h1 className="text-2xl font-bold text-white">Create Coupon</h1>
      <Input name="code" placeholder="Code" value={form.code} onChange={handleChange} />
      <Input name="discount" placeholder="Discount %" value={form.discount} onChange={handleChange} />
      <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <Input name="maxUses" placeholder="Max Uses" value={form.maxUses} onChange={handleChange} />
      <Input
        type="date"
        name="expiryDate"
        placeholder="Expiry Date"
        value={form.expiryDate}
        onChange={handleChange}
      />
      <Button className="w-full bg-primary text-white" onClick={createCoupon}>
        Add Coupon
      </Button>
    </div>
  );
};

export default AdminCoupons;
