import { Hono } from 'hono'
import * as controller from '@/modules/materials/material.controller'

const materialAdminRoute = new Hono()
materialAdminRoute.get('/', controller.getAllMaterial)
materialAdminRoute.get('/:id{[0-9]}', controller.getMaterialById)
materialAdminRoute.post('/', controller.createMaterial)
materialAdminRoute.put('/:id{[0-9]+}', controller.updateMaterial)
materialAdminRoute.delete('/:id{[0-9]+}', controller.deleteMaterial)
export { materialAdminRoute }