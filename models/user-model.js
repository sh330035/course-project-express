const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024, // 經過hash長度會很長
  },
  role: {
    type: String,
    // enumerate 列舉
    enum: ["student", "instructor", "admin"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// 身分確認，製作 API 時會用到
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};
userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};

// mongoose schma middleware
// pre save -> 儲存資料之前，希望系統執行以下函式 -> 加密
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

// 確認密碼
// password；this.password：前者為使用者輸入的；後者為hash後的
// isMatch 會檢查 未加密的password與加密後的 this.password是否相同
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("user", userSchema);
