import { storage } from "./storage";

export const ADMIN_CREDENTIALS = {
    email: "admin@admin.com",
    password: "admin123",
    name: "System Admin",
};

export function createId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function requireUserOrAdmin() {
    const auth = storage.getAuth();
    return auth?.user || auth?.admin;
}

export function requireAdmin() {
    const auth = storage.getAuth();
    return auth?.admin;
}

export function getEffectiveUser() {
    const auth = storage.getAuth();
    return auth?.user;
}
