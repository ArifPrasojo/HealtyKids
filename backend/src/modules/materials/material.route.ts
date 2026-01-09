import { Hono } from 'hono'
import * as controller from '@/modules/materials/material.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorize } from '@/middlewares/authorize.middleware';

const materialAdminRoute = new Hono()
materialAdminRoute.use('*', authMiddleware)
materialAdminRoute.get('/', authorize(['teacher']), controller.getAllMaterial)
materialAdminRoute.get('/:id{[0-9]}', authorize(['teacher']), controller.getMaterialById)
materialAdminRoute.post('/', controller.createMaterial)
materialAdminRoute.put('/:id{[0-9]+}', authorize(['teacher']), controller.updateMaterial)
materialAdminRoute.delete('/:id{[0-9]+}', authorize(['teacher']), controller.deleteMaterial)
materialAdminRoute.get('/:id{[0-9]+}/sub-material', authorize(['teacher']), controller.getAllSubMaterial)
materialAdminRoute.get('/:id{[0-9]+}/sub-material/:id-sub{[0-9]+}', authorize(['teacher']), controller.getSubMaterialById)
materialAdminRoute.post('/:id{[0-9]+}/sub-material', authorize(['teacher']), controller.createSubMaterial)
materialAdminRoute.put('/:id{[0-9]+}/sub-material/:id-sub{[0-9]+}', authorize(['teacher']), controller.updateSubMaterial)
materialAdminRoute.delete('/:id{[0-9]+}/sub-material/:id-sub{[0-9]+}', authorize(['teacher']), controller.deleteSubMaterial)

const materialStudentRoute = new Hono()
materialStudentRoute.use('*', authMiddleware)
materialStudentRoute.get('/', authorize(['student']), controller.getAllMaterialStudent)
materialStudentRoute.get('/:id{[0-9]+}/sub-material', authorize(['student']), controller.getAllSubMaterialStudent)
materialStudentRoute.post('/:id{[0-9]+}/sub-material/:id-sub{[0-9]+}', authorize(['student']), controller.postProgresStudent)

export { materialAdminRoute, materialStudentRoute }