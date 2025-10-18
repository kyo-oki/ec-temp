import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useCart } from "../contexts/CartContext";

export function OrderFormPage() {
  const navigate = useNavigate();
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    city: "",
    stateRegion: "",
    postcode: "",
  });

  const shippingFee = 9.99;
  const subtotal = cartState.total;
  const gst = subtotal * 0.1;
  const total = subtotal + shippingFee + gst;

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = cartState.items.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Order submitted successfully!");
    clearCart(); // Clear cart after successful order
    navigate("/");
  };

  // Handle empty cart state
  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate("/shop")} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-center mb-3">Complete Your Order</h1>
          <p className="text-center text-gray-600 mb-12">
            Fill in your details to finalize your purchase
          </p>

          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <div className="max-w-4xl mx-auto mb-12">
              <h2 className="mb-8">Customer Information</h2>

              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Value"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Value"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Value"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input
                    id="deliveryAddress"
                    name="deliveryAddress"
                    placeholder="Value"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Value"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stateRegion">State/Region</Label>
                  <Input
                    id="stateRegion"
                    name="stateRegion"
                    placeholder="Value"
                    value={formData.stateRegion}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    placeholder="Value"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-center mb-8">Order Summary</h2>

              <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
                {/* Cart Items */}
                {cartState.items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size || ""}-${item.color || ""}`}
                    className={`flex gap-4 mb-6 pb-6 ${
                      index < cartState.items.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                      <ImageWithFallback
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1663683181863-7bd34db211d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDYyODMyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="mb-2">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-gray-600 mb-1">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600 mb-1">
                          Color: {item.color}
                        </p>
                      )}
                      <p className="mb-3 text-blue-600">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-red-100 text-red-600"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Fee</span>
                    <span>${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b text-gray-700">
                    <span>GST (10%)</span>
                    <span>${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button type="submit" size="lg" className="px-12">
                  Confirm & Pay
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
