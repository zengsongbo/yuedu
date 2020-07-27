import Vue from 'vue'
import VueRouter from 'vue-router'
import lists from '../views/lists.vue'
import navRight from '../views/nav_right.vue'
import detail from '../views/detail.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/:id',
        name: 'lists',
        components: {
            lists,
            navRight
        }
    },
    {
        path: '/detail/:id',
        components: {
            detail
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router