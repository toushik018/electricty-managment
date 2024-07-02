"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("../module/admin/admin.route");
const consumer_route_1 = require("../module/consumer/consumer.route");
const profile_route_1 = require("../module/profile/profile.route");
const router = express_1.default.Router();
const routes = [
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/consumers',
        route: consumer_route_1.ConsumerRoutes,
    },
    {
        path: '/profile',
        route: profile_route_1.ProfileRoutes,
    },
];
routes.forEach((routeEle) => {
    router.use(routeEle.path, routeEle.route);
});
exports.default = router;
