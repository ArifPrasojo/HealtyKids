import { Hono } from 'hono'
import * as controller from '@/modules/materials/material.controller'

const materialAdminRoute = new Hono()
materialAdminRoute.get('/', controller.getAllMaterial)

export { materialAdminRoute }