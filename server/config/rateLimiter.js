import rateLimit from "express-rate-limit";

const loginLimit = rateLimit({
    windowMs: 10*60*1000, // 10 minutes
    max: 5, // 5 login requests from particular IP
    message:{
        message: "Login attempt exceeds. Try again after 10 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export default loginLimit;