const Car = require('../models/Car');

exports.getAllCars = async (req, res, next) => {
  try {
    const { status, minPrice, maxPrice, fuelType, make, model, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    } else if (req.user?.role !== 'admin') {
      filter.status = 'available';
    }

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseFloat(maxPrice);
    }

    if (fuelType) {
      filter.fuelType = new RegExp(`^${fuelType}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { make: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') }
      ];
    } else {
      if (make) filter.make = new RegExp(make, 'i');
      if (model) filter.model = new RegExp(model, 'i');
    }

    const skip = (page - 1) * limit;

    const cars = await Car.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Car.countDocuments(filter);

    res.json({
      cars,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    next(error);
  }
};

exports.addCar = async (req, res, next) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (error) {
    next(error);
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car updated successfully', car });
  } catch (error) {
    next(error);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateCarStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['available', 'rented', 'maintenance', 'sold'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car status updated', car });
  } catch (error) {
    next(error);
  }
};

exports.bulkAddCars = async (req, res, next) => {
  try {
    const carsData = Array.isArray(req.body) ? req.body : [req.body];

    const cars = await Car.insertMany(carsData);

    res.status(201).json({
      message: `${cars.length} cars added successfully`,
      cars
    });
  } catch (error) {
    next(error);
  }
};
