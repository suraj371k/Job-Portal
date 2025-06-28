import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, //limit each Ip to 10 requests per windowMs
    message: {
        success: false,
        message: "To many request , please try again later"
    },
    standardHeaders: true,
    legacyHeaders: true
})