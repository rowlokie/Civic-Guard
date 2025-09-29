import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/coupons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(res.data);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [token]);

  const claimCoupon = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/coupons/claim/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Error claiming coupon");
    }
  };

  if (loading) return <p className="text-center text-white">Loading coupons...</p>;

  return (
    <div className="max-w-4xl text-center text-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-white mb-4">Available Coupons</h1>

      {coupons.length === 0 ? (
        <p className="text-muted-foreground">No coupons available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <Card key={coupon._id} className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-white">{coupon.code}</h2>
                <p className="text-gray-300">{coupon.description}</p>
                <p className="text-sm text-gray-400">Discount: {coupon.discount}%</p>
                {coupon.expiryDate && (
                  <p className="text-sm text-gray-400">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                )}
                <Button
                  className="mt-2 bg-primary text-white w-full"
                  onClick={() => claimCoupon(coupon._id)}
                >
                  Claim
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;
