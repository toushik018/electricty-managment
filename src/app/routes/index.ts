import express from 'express'
import { AdminRoutes } from '../module/admin/admin.route'
import { ConsumerRoutes } from '../module/consumer/consumer.route'
import { ProfileRoutes } from '../module/profile/profile.route'
const router = express.Router()

const routes = [
    {
        path: '/admin',
        route: AdminRoutes,
    },
    {
        path: '/consumers',
        route: ConsumerRoutes,
    },
    {
        path: '/profile',
        route: ProfileRoutes,
    },
]

routes.forEach((routeEle) => {
    router.use(routeEle.path, routeEle.route)
})

export default router
