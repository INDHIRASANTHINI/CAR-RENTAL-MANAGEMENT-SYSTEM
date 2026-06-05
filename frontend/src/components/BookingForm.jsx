import React, { useState } from 'react';
import { bookingAPI, paymentAPI } from '../api/client';
import { toast } from 'react-toastify';

function BookingForm({ car, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Downtown Branch',
    returnLocation: 'Downtown Branch',
    insuranceSelected: false,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateCost = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const pickup = new Date(formData.pickupDate);
    const returnD = new Date(formData.returnDate);
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)) || 1;
    const baseCost = car.pricePerDay * days;
    const insurance = formData.insuranceSelected ? car.insuranceCost * days : 0;
    return baseCost + insurance;
  };

  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      const bookingResponse = await bookingAPI.createBooking({
        carId: car._id,
        ...formData
      });
      setBookingData(bookingResponse.data.booking);
      toast.success('Booking created! Proceeding to payment...');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const paymentResponse = await paymentAPI.processPayment({
        bookingId: bookingData._id,
        amount: calculateCost(),
        method: 'stripe',
        cardDetails: { lastFourDigits: '4242' }
      });
      toast.success('Payment successful!');
      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (bookingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
          <div className="mb-6">
            <p className="mb-2"><strong>Booking ID:</strong> {bookingData.bookingId}</p>
            <p className="mb-2"><strong>Car:</strong> {car.year} {car.make} {car.model}</p>
            <p className="mb-2"><strong>Duration:</strong> {bookingData.rentalDays} days</p>
            <p className="text-lg font-bold mt-4">Total: ₹{calculateCost().toFixed(2)}</p>
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <button
            onClick={() => setBookingData(null)}
            className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Book: {car.year} {car.make} {car.model}</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Pickup Date</label>
          <input
            type="datetime-local"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Return Date</label>
          <input
            type="datetime-local"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="insuranceSelected"
              checked={formData.insuranceSelected}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700">Add Insurance (₹{car.insuranceCost}/day)</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Special Requests</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            rows="3"
            placeholder="Any special requirements?"
          ></textarea>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-lg font-bold">Total: ₹{calculateCost().toFixed(2)}</p>
        </div>

        <button
          onClick={handleCreateBooking}
          disabled={loading || !formData.pickupDate || !formData.returnDate}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-2"
        >
          {loading ? 'Creating...' : 'Proceed to Payment'}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default BookingForm;
