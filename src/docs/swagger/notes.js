/**
 * Documentación Swagger para el recurso de Notas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Nota:
 *       type: object
 *       required:
 *         - nota
 *         - categoria
 *         - autor
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la nota
 *         nota:
 *           type: string
 *           description: Contenido de la nota
 *         categoria:
 *           type: string
 *           description: Categoría de la nota
 *         etiquetas:
 *           type: array
 *           items:
 *             type: string
 *           description: Etiquetas asociadas a la nota
 *         color:
 *           type: string
 *           description: Color de la nota en formato hexadecimal
 *         autor:
 *           type: string
 *           description: Autor de la nota
 *         recordatorio:
 *           type: object
 *           properties:
 *             fecha:
 *               type: string
 *               format: date-time
 *               description: Fecha del recordatorio
 *             hora:
 *               type: string
 *               description: Hora del recordatorio en formato HH:MM
 *             activo:
 *               type: boolean
 *               description: Indica si el recordatorio está activo
 *         estado:
 *           type: string
 *           enum: [pendiente, en_progreso, completada, archivada]
 *           description: Estado actual de la nota
 *         prioridad:
 *           type: string
 *           enum: [baja, media, alta, urgente]
 *           description: Nivel de prioridad de la nota
 *         fechaVencimiento:
 *           type: string
 *           format: date-time
 *           description: Fecha de vencimiento de la nota
 *         adjuntos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de archivos adjuntos a la nota
 *         colaboradores:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de colaboradores de la nota
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la nota
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización de la nota
 */

/**
 * @swagger
 * tags:
 *   name: Notas
 *   description: API para gestionar notas
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Obtener todas las notas
 *     description: Retorna una lista de todas las notas disponibles
 *     tags: [Notas]
 *     responses:
 *       200:
 *         description: Lista de notas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nota'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crear una nueva nota
 *     description: Crea una nueva nota con los datos proporcionados
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nota'
 *     responses:
 *       201:
 *         description: Nota creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Obtener una nota por ID
 *     description: Retorna una nota específica según su ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       404:
 *         description: Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Actualizar una nota
 *     description: Actualiza una nota existente según su ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nota'
 *     responses:
 *       200:
 *         description: Nota actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       404:
 *         description: Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Eliminar una nota
 *     description: Elimina una nota existente según su ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nota eliminada correctamente
 *       404:
 *         description: Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */