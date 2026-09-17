const {
  registerUser,
  loginUser,
} = require("../services/authService");

async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
      organizationName,
      description,
      contactInfo,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "name, email, password and role are required.",
      });
    }

    const user = await registerUser({
      name,
      email,
      password,
      role,
      organizationName,
      description,
      contactInfo,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const result = await loginUser(
      email,
      password
    );

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
}

function getCurrentUser(req, res) {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};