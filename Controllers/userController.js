const User = require("./../Models/users");
const catchAsync = require("./../utils/CatchAsync");
const AppError = require("./../utils/AppError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

// Configure Multer to use memory storage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to handle image uploads
exports.uploadUserPhoto = upload.single("photo");

// Middleware to resize the uploaded photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Function to filter allowed fields for update
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Middleware to set user ID to params
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Middleware to update user data
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for updating passwords.", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

// Placeholder for user creation route
exports.createUser = (req, res) => {
  res.status(500).json({
    message: "This route is not yet implemented",
  });
};

// Middleware to deactivate a user
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// CRUD operations using factory functions
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
