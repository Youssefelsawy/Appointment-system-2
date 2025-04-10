const axios = require("axios");

const verifyRecaptcha = async (req, res, next) => {
  // 1. Get token from either body or headers
  const token =
    req.body.recaptchaToken || req.body.token || req.headers["recaptcha-token"];

  // 2. Validate token exists
  if (!token) {
    return res.status(400).json({
      success: false,
      error: "reCAPTCHA verification required",
      solution: "Please include recaptchaToken in request body",
    });
  }

  // 3. Verify with Google
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    // 4. Check verification success
    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        error: "reCAPTCHA verification failed",
        errors: response.data["error-codes"] || [],
      });
    }

    // 5. Success - proceed to route handler
    next();
  } catch (err) {
    // 6. Handle API errors
    res.status(500).json({
      success: false,
      error: "reCAPTCHA server error",
      message: err.message,
    });
  }
};

module.exports = verifyRecaptcha;
