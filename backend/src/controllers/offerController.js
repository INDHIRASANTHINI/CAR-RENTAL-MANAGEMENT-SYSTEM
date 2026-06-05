const Offer = require('../models/Offer');

exports.createOffer = async (req, res, next) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json({ message: 'Offer created successfully', offer });
    } catch (error) {
        next(error);
    }
};

exports.getOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        next(error);
    }
};

exports.getActiveOffers = async (req, res, next) => {
    try {
        const now = new Date();
        const offers = await Offer.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now }
        });
        res.json(offers);
    } catch (error) {
        next(error);
    }
};

exports.validateOffer = async (req, res, next) => {
    try {
        const { code, bookingAmount } = req.body;
        const offer = await Offer.findOne({ code, isActive: true });

        if (!offer) {
            return res.status(404).json({ message: 'Invalid or expired offer code' });
        }

        const now = new Date();
        if (now < offer.validFrom || now > offer.validUntil) {
            return res.status(400).json({ message: 'Offer is not valid at this time' });
        }

        if (bookingAmount < offer.minBookingAmount) {
            return res.status(400).json({
                message: `Min booking amount for this offer is $${offer.minBookingAmount}`
            });
        }

        let discountAmount = 0;
        if (offer.discountType === 'percentage') {
            discountAmount = (bookingAmount * offer.discountValue) / 100;
            if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
                discountAmount = offer.maxDiscount;
            }
        } else {
            discountAmount = offer.discountValue;
        }

        res.json({
            message: 'Offer validated successfully',
            offerId: offer._id,
            discountAmount,
            finalAmount: bookingAmount - discountAmount
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json({ message: 'Offer updated', offer });
    } catch (error) {
        next(error);
    }
};

exports.deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        next(error);
    }
};
