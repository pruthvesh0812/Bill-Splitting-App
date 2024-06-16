"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
// this function returns true if password is valid .. else error
// the validate option in schema expects a boolean
const validatePassword = (password) => {
    if (password.length < 8) {
        throw new Error("password must be atleast 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error("the password must contain atleast one Uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        throw new Error("the password must contain atleast one lowercase letter");
    }
    if (!/\d/.test(password)) {
        throw new Error("the password must contain atleast one numeric character");
    }
    if (!/[^\w]/.test(password)) {
        throw new Error("the password must contain atleast one special character");
    }
    return true;
};
exports.validatePassword = validatePassword;
