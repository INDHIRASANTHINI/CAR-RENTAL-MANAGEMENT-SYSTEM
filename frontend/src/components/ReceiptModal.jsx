import React from 'react';
import { FaTimes, FaPrint, FaCar, FaDownload, FaCheckCircle } from 'react-icons/fa';

const ReceiptModal = ({ isOpen, onClose, payment, booking }) => {
    if (!isOpen || !payment) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-[#1d224a] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3c4482] rounded-lg">
                            <FaCar className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">Payment Receipt</h2>
                            <p className="text-xs text-gray-300 font-bold uppercase tracking-widest leading-none mt-1">Aradhya Car Rental</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible" id="receipt-content">

                    {/* Success Badge */}
                    <div className="flex flex-col items-center text-center">
                        <FaCheckCircle className="text-5xl text-green-500 mb-2" />
                        <h3 className="text-2xl font-black text-[#1d224a]">Payment Success</h3>
                        <p className="text-[#3c4482] font-semibold">Transaction ID: {payment.transactionId}</p>
                    </div>

                    {/* Grid Details */}
                    <div className="grid grid-cols-2 gap-8 py-8 border-y-2 border-dashed border-[#d3d6f7]">
                        <div>
                            <p className="text-xs font-bold text-[#3c4482] uppercase tracking-widest mb-1">Customer Details</p>
                            <p className="text-lg font-bold text-[#1d224a]">{booking?.customerId?.firstName} {booking?.customerId?.lastName}</p>
                            <p className="text-xs font-bold text-[#3c4482]">{booking?.customerId?.email}</p>
                            <p className="text-xs font-bold text-[#3c4482]">{booking?.customerId?.phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-[#3c4482] uppercase tracking-widest mb-1">Date</p>
                            <p className="text-lg font-bold text-[#1d224a]">{new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#3c4482] uppercase tracking-widest mb-1">Booking Reference</p>
                            <p className="text-lg font-bold text-[#1d224a]">{booking?.bookingId || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-[#3c4482] uppercase tracking-widest mb-1">Payment Method</p>
                            <p className="text-lg font-bold text-[#1d224a] uppercase">{payment.method}</p>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div>
                        <h4 className="text-sm font-black text-[#1d224a] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaCar className="text-[#3c4482]" /> Vehicle Details
                        </h4>
                        <div className="bg-[#f6f6ff] p-4 rounded-2xl border border-[#d3d6f7] flex justify-between items-center">
                            <div>
                                <p className="font-black text-[#1d224a] text-lg">
                                    {booking?.carId?.year} {booking?.carId?.make} {booking?.carId?.model}
                                </p>
                                <p className="text-sm font-bold text-[#3c4482]">
                                    {new Date(booking?.pickupDate).toLocaleDateString()} - {new Date(booking?.returnDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-[#3c4482] uppercase">Rental Period</p>
                                <p className="font-black text-[#1d224a]">{booking?.rentalDays} Days</p>
                            </div>
                        </div>
                    </div>

                    {/* Amount Breakdown */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold text-[#3c4482]">
                            <span>Base Fare</span>
                            <span>₹{booking?.totalCost + (payment.discountAmount || 0)}</span>
                        </div>
                        {payment.discountAmount > 0 && (
                            <div className="flex justify-between text-sm font-bold text-green-600">
                                <span>Discount Applied</span>
                                <span>-₹{payment.discountAmount}</span>
                            </div>
                        )}
                        <div className="pt-4 border-t-2 border-[#1d224a] flex justify-between items-center">
                            <span className="text-xl font-black text-[#1d224a]">Total Amount Paid</span>
                            <span className="text-3xl font-black text-[#3c4482]">₹{payment.finalAmount || payment.amount}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        Thank you for choosing Aradhya Car Rental
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-[#f8faff] border-t border-[#d3d6f7] flex gap-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-[#d3d6f7] text-[#1d224a] font-bold rounded-xl hover:bg-[#f6f6ff] transition-colors"
                    >
                        <FaPrint /> Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-[#3c4482] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
