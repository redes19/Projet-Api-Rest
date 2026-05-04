import { Request, Response, Application } from "express";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  ListUsers,
  UpdateUser,
} from "./modules/user/user-handler.js";
import {
  CreateRoom,
  DeleteRoom,
  GetRoom,
  ListRooms,
  UpdateRoom,
  GetRoomScreenings,
} from "./modules/room/room-handler.js";
import {
  CreateMovie,
  DeleteMovie,
  GetMovie,
  ListMovies,
  UpdateMovie,
  GetMovieScreenings,
} from "./modules/movie/movie-handler.js";
import {
  CreateScreening,
  DeleteScreening,
  GetScreening,
  ListScreenings,
  UpdateScreening,
  GetScreeningStats,
} from "./modules/screening/screening-handler.js";
import {
  BuyTicket,
  CreateTicket,
  DeleteTicket,
  GetTicket,
  ListTicketUsages,
  ListTickets,
  UpdateTicket,
  UseTicket,
} from "./modules/ticket/ticket-handler.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";
import { Login, Register, Refresh, Logout } from "./modules/auth/auth-handler.js";
import { RequireRole } from "./middleware/role.middleware.js";
import { UserRole } from "./database/entities/user.js";
import { DepositBalance, GetBalance, WithdrawBalance } from "./modules/balance/balance-handler.js";
import { ListTransactions } from "./modules/transaction/transaction-handler.js";

export const initHandlers = (app: Application) => {
  app.get("/", (req: Request, res: Response) => {
    res.status(200);
    return res.send({
      message: "API Cinéma",
      status: "ONLINE",
    });
  });

  // ======================================
  //                  USER
  // ======================================

  /**
   * @openapi
   * /users:
   *  get:
   *    tags: [Users]
   *    summary: Liste tous les utilisateurs (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Numéro de page
   *      - in: query
   *        name: size
   *        schema:
   *          type: integer
   *          minimum: 1
   *          maximum: 100
   *        description: Nombre d'éléments par page
   *      - in: query
   *        name: balanceMax
   *        schema:
   *          type: number
   *          minimum: 0
   *        description: Solde maximum
   *    responses:
   *      200:
   *        description: Liste des utilisateurs.
   *      401:
   *        description: Non autorisé.
   */
  app.get("/users", AuthMiddleware, RequireRole(UserRole.ADMIN), ListUsers);

  /**
   * @openapi
   * /users/{id}:
   *  get:
   *    tags: [Users]
   *    summary: Récupère un utilisateur par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: ID de l'utilisateur à récupérer
   *    responses:
   *      200:
   *        description: Utilisateur trouvé et retourné.
   *      400:
   *        description: Requête invalide.
   *      404:
   *        description: Utilisateur non trouvé.
   */
  app.get("/users/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), GetUser);

  /**
   * @openapi
   * /users/:
   *  post:
   *    tags: [Users]
   *    summary: Crée un nouvel utilisateur (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         required:
   *          - email
   *          - password
   *          - role
   *          - balance
   *         properties:
   *          email:
   *           type: string
   *           format: email
   *          password:
   *           type: string
   *           format: password
   *           minLength: 6
   *          role:
   *           type: string
   *           enum: [client, employee, admin]
   *          balance:
   *           type: number
   *           minimum: 0
   *          first_name:
   *           type: string
   *           maxLength: 100
   *           nullable: true
   *          last_name:
   *           type: string
   *           maxLength: 100
   *           nullable: true
   *    responses:
   *      201:
   *        description: Utilisateur créé avec succès.
   *      400:
   *        description: Erreur de validation des données envoyées.
   *      409:
   *        description: L'email est déjà utilisé par un autre utilisateur.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/users/", AuthMiddleware, RequireRole(UserRole.ADMIN), CreateUser);

  /**
   * @openapi
   * /users/{id}:
   *  delete:
   *    tags: [Users]
   *    summary: Supprime un utilisateur par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      204:
   *        description: Utilisateur supprimé
   *      400:
   *        description: Requête invalide.
   *      404:
   *        description: Utilisateur non trouvé.
   */
  app.delete("/users/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), DeleteUser);

  /**
   * @openapi
   * /users/{id}:
   *  patch:
   *    tags: [Users]
   *    summary: Met à jour un utilisateur par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         properties:
   *          email:
   *           type: string
   *           format: email
   *          password:
   *           type: string
   *           format: password
   *           minLength: 6
   *          role:
   *            type: string
   *            enum: [client, employee, admin]
   *          balance:
   *            type: number
   *            minimum: 0
   *          first_name:
   *           type: string
   *           maxLength: 100
   *           nullable: true
   *          last_name:
   *           type: string
   *           maxLength: 100
   *           nullable: true
   *    responses:
   *      200:
   *        description: Utilisateur mis à jour avec succès.
   *      400:
   *        description: Requête invalide.
   *      404:
   *        description: Utilisateur non trouvé.
   */
  app.patch("/users/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), UpdateUser);

  // ======================================
  //                  AUTH
  // ======================================

  /**
   * @openapi
   * /auth/register:
   *  post:
   *    tags: [Auth]
   *    summary: Enregistre un nouvel utilisateur
   *    requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         required:
   *          - email
   *          - password
   *         properties:
   *          email:
   *           type: string
   *           format: email
   *          password:
   *           type: string
   *           format: password
   *           minLength: 8
   *          firstName:
   *           type: string
   *           maxLength: 100
   *          lastName:
   *           type: string
   *           maxLength: 100
   *    responses:
   *      201:
   *        description: Utilisateur créé avec succès, retourne les tokens.
   *      400:
   *        description: Erreur de validation des données envoyées.
   *      409:
   *        description: L'email est déjà utilisé par un autre utilisateur.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/auth/register", Register);

  /**
   * @openapi
   * /auth/login:
   *  post:
   *    tags: [Auth]
   *    summary: Connecte un utilisateur existant
   *    requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         required:
   *          - email
   *          - password
   *         properties:
   *          email:
   *           type: string
   *           format: email
   *          password:
   *           type: string
   *           format: string
   *    responses:
   *      200:
   *        description: Connexion réussie, retourne les tokens.
   *      400:
   *        description: Erreur de validation des données envoyées.
   *      401:
   *        description: Identifiants incorrects.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/auth/login", Login);

  /**
   * @openapi
   * /auth/refresh:
   *  post:
   *    tags: [Auth]
   *    summary: Rafraîchit le token d'accès
   *    requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         required:
   *          - refreshToken
   *         properties:
   *          refreshToken:
   *           type: string
   *    responses:
   *      200:
   *        description: Token rafraîchi avec succès.
   *      400:
   *        description: Erreur de validation des données envoyées.
   *      401:
   *        description: Token de rafraîchissement invalide.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/auth/refresh", Refresh);

  /**
   * @openapi
   * /auth/logout:
   *  post:
   *    tags: [Auth]
   *    summary: Déconnecte un utilisateur
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Déconnexion réussie.
   *      401:
   *        description: Token d'accès invalide.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/auth/logout", AuthMiddleware, Logout);

  // ======================================
  //                 ROOM
  // ======================================

  /**
   * @openapi
   * /rooms:
   *  get:
   *    tags: [Rooms]
   *    summary: Liste les salles
   *    security:
   *     - bearerAuth: []
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *          minimum: 1
   *          default: 1
   *        description: Numéro de page (par défaut 1)
   *      - in: query
   *        name: size
   *        schema:
   *          type: integer
   *          minimum: 1
   *          maximum: 100
   *          default: 10
   *        description: Nombre d'éléments par page (par défaut 10)
   *      - in: query
   *        name: capacityMax
   *        schema:
   *          type: integer
   *          minimum: 15
   *          maximum: 30
   *        description: Capacité maximale de la salle
   *      - in: query
   *        name: isMaintenance
   *        schema:
   *          type: boolean
   *        description: Filtrer par salles en maintenance
   *    responses:
   *      200:
   *        description: Liste des salles
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                    example: 1
   *                  name:
   *                    type: string
   *                    example: Salle 1
   *                  description:
   *                    type: string
   *                    nullable: true
   *                  image_url:
   *                    type: string
   *                    nullable: true
   *                  type:
   *                    type: string
   *                    enum: [2D, 3D, IMAX, 4DX, VIP]
   *                  capacity:
   *                    type: integer
   *                    minimum: 15
   *                    maximum: 30
   *                  has_disabled_access:
   *                    type: boolean
   *                  is_maintenance:
   *                    type: boolean
   *                  created_at:
   *                    type: string
   *                    format: date-time
   *                  updated_at:
   *                    type: string
   *                    format: date-time
   *      400:
   *        description: Erreur de validation des paramètres
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      500:
   *        description: Erreur interne du serveur
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   */
  app.get("/rooms", AuthMiddleware, ListRooms);

  /**
   * @openapi
   * /rooms:
   *  post:
   *    tags: [Rooms]
   *    summary: Crée une salle (ADMIN)
   *    security:
   *     - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required: [name, type, capacity]
   *            properties:
   *              name:
   *                type: string
   *                maxLength: 100
   *                example: Salle 1
   *              description:
   *                type: string
   *                nullable: true
   *              image_url:
   *                type: string
   *                format: uri
   *                nullable: true
   *                example: https://example.com/salle1.jpg
   *              type:
   *                type: string
   *                enum: [2D, 3D, IMAX, 4DX, VIP]
   *              capacity:
   *                type: integer
   *                minimum: 15
   *                maximum: 30
   *              has_disabled_access:
   *                type: boolean
   *                default: false
   *              is_maintenance:
   *                type: boolean
   *                default: false
   *    responses:
   *      201:
   *        description: Salle créée
   *      400:
   *        description: Erreur de validation des données envoyées
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      409:
   *        description: Conflit (nom de salle déjà utilisé)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                  example: name is already taken
   *      500:
   *        description: Erreur interne du serveur
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   */
  app.post("/rooms/", AuthMiddleware, RequireRole(UserRole.ADMIN), CreateRoom);

  /**
   * @openapi
   * /rooms/{id}:
   *  get:
   *    tags: [Rooms]
   *    summary: Récupère une salle
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Identifiant de la salle
   *    responses:
   *      200:
   *        description: Salle trouvée
   *      400:
   *        description: Erreur de validation des paramètres
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      404:
   *        description: Salle introuvable
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   */
  app.get("/rooms/:id", AuthMiddleware, GetRoom);

  /**
   * @openapi
   * /rooms/{id}:
   *  patch:
   *    tags: [Rooms]
   *    summary: Met à jour une salle (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Identifiant de la salle
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                maxLength: 100
   *              description:
   *                type: string
   *                nullable: true
   *              image_url:
   *                type: string
   *                format: uri
   *                nullable: true
   *              type:
   *                type: string
   *                enum: [2D, 3D, IMAX, 4DX, VIP]
   *              capacity:
   *                type: integer
   *                minimum: 15
   *                maximum: 30
   *              has_disabled_access:
   *                type: boolean
   *              is_maintenance:
   *                type: boolean
   *    responses:
   *      200:
   *        description: Salle mise à jour
   *      400:
   *        description: Erreur de validation des données envoyées
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      401:
   *        description: Non authentifié
   *      404:
   *        description: Salle introuvable
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      409:
   *        description: Conflit (nom de salle déjà utilisé)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                  example: name is already taken
   *      500:
   *        description: Erreur interne du serveur
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   */
  app.patch("/rooms/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), UpdateRoom);

  /**
   * @openapi
   * /rooms/{id}:
   *  delete:
   *    tags: [Rooms]
   *    summary: Supprime une salle (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Identifiant de la salle
   *    responses:
   *      204:
   *        description: Salle supprimée
   *      400:
   *        description: Erreur de validation des paramètres
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      401:
   *        description: Non authentifié
   *      404:
   *        description: Salle introuvable
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      500:
   *        description: Erreur interne du serveur
   */
  app.delete("/rooms/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), DeleteRoom);

  /**
   * @openapi
   * /rooms/{id}/screenings:
   *  get:
   *    tags: [Rooms]
   *    summary: Liste les séances d'une salle
   *    description: Retourne les séances de la salle (avec les objets movie et room).
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Identifiant de la salle
   *      - in: query
   *        name: from
   *        schema:
   *          type: string
   *          format: date-time
   *        description: Filtre sur la date de début (ISO 8601)
   *      - in: query
   *        name: to
   *        schema:
   *          type: string
   *          format: date-time
   *        description: Filtre sur la date de fin (ISO 8601), doit être > from
   *    responses:
   *      200:
   *        description: Liste des séances
   *      400:
   *        description: Erreur de validation des paramètres
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      404:
   *        description: Salle introuvable (ou en maintenance)
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorResponse'
   *      500:
   *        description: Erreur interne du serveur
   */
  app.get("/rooms/:id/screenings", AuthMiddleware, GetRoomScreenings);

  // ======================================
  //                MOVIE
  // ======================================

  /**
   * @openapi
   * /movies:
   *   get:
   *     tags: [Movies]
   *     summary: Liste les films
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Numéro de page (>= 1)
   *         required: false
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Nombre d'éléments par page
   *         required: false
   *       - in: query
   *         name: durationMax
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Durée maximale du film (en minutes)
   *         required: false
   *       - in: query
   *         name: genre
   *         schema:
   *           type: string
   *           maxLength: 100
   *         description: Genre du film
   *         required: false
   *       - in: query
   *         name: title
   *         schema:
   *           type: string
   *           maxLength: 255
   *         description: Titre du film (recherche partielle)
   *         required: false
   *       - in: query
   *         name: releasedAfter
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Films sortis après cette date (ISO 8601)
   *         required: false
   *       - in: query
   *         name: releasedBefore
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Films sortis avant cette date (ISO 8601)
   *         required: false
   *     responses:
   *       200:
   *         description: Liste des films récupérée avec succès.
   *       400:
   *         description: Paramètres invalides.
   *       401:
   *         description: Non autorisé.
   *       500:
   *         description: Erreur interne du serveur.
   */
  app.get("/movies", AuthMiddleware, ListMovies);

  /**
   * @openapi
   * /movies/{id}:
   *  get:
   *    tags: [Movies]
   *    summary: Récupère un film par son ID
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Identifiant du film
   *    responses:
   *      200:
   *        description: Film récupéré avec succès.
   *      400:
   *        description: Requête invalide (ID incorrect).
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Film non trouvé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.get("/movies/:id", AuthMiddleware, GetMovie);

  /**
   * @openapi
   * /movies/{id}/screenings:
   *  get:
   *    tags: [Movies]
   *    summary: Liste les séances d'un film sur une période
   *    description: Retourne toutes les séances d'un film (avec movie et room en relation), filtrables par période.
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Identifiant du film
   *      - in: query
   *        name: from
   *        schema:
   *          type: string
   *          format: date-time
   *        description: Filtre sur la date de début (ISO 8601)
   *      - in: query
   *        name: to
   *        schema:
   *          type: string
   *          format: date-time
   *        description: Filtre sur la date de fin (ISO 8601), doit être > from
   *    responses:
   *      200:
   *        description: Liste des séances du film
   *      400:
   *        description: Erreur de validation des paramètres
   *      404:
   *        description: Film introuvable
   *      500:
   *        description: Erreur interne du serveur
   */
  app.get("/movies/:id/screenings", AuthMiddleware, GetMovieScreenings);

  /**
   * @openapi
   * /movies/:
   *   post:
   *     tags: [Movies]
   *     summary: Crée un nouveau film (ADMIN)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - duration
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 255
   *               description:
   *                 type: string
   *                 nullable: true
   *               duration:
   *                 type: integer
   *                 minimum: 1
   *               genre:
   *                 type: string
   *                 maxLength: 100
   *                 nullable: true
   *               poster_url:
   *                 type: string
   *                 format: uri
   *                 nullable: true
   *               release_date:
   *                 type: string
   *                 format: date
   *                 nullable: true
   *     responses:
   *       201:
   *         description: Film créé avec succès.
   *       400:
   *         description: Erreur de validation des données envoyées.
   *       401:
   *         description: Non autorisé.
   *       409:
   *         description: Conflit (titre de film déjà utilisé)
   *       500:
   *         description: Erreur interne du serveur.
   */
  app.post("/movies/", AuthMiddleware, RequireRole(UserRole.ADMIN), CreateMovie);

  /**
   * @openapi
   * /movies/{id}:
   *  delete:
   *    tags: [Movies]
   *    summary: Supprime un film par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      204:
   *        description: Film supprimé avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Film non trouvé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.delete("/movies/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), DeleteMovie);

  /**
   * @openapi
   * /movies/{id}:
   *  patch:
   *    tags: [Movies]
   *    summary: Met à jour un film par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              title:
   *                type: string
   *                maxLength: 255
   *              description:
   *                type: string
   *                nullable: true
   *              duration:
   *                type: integer
   *                minimum: 1
   *              genre:
   *                type: string
   *                maxLength: 100
   *                nullable: true
   *              poster_url:
   *                type: string
   *                format: uri
   *                nullable: true
   *              release_date:
   *                type: string
   *                format: date
   *                nullable: true
   *    responses:
   *      200:
   *        description: Film mis à jour avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Film non trouvé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.patch("/movies/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), UpdateMovie);

  // ======================================
  //              SCREENING
  // ======================================

  /**
   * @openapi
   * /screenings:
   *   get:
   *     tags: [Screenings]
   *     summary: Liste les séances
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Numéro de page (>= 1)
   *         required: false
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Nombre d'éléments par page
   *         required: false
   *       - in: query
   *         name: movieId
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: ID du film
   *         required: false
   *       - in: query
   *         name: roomId
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: ID de la salle
   *         required: false
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Séances à partir de cette date/heure
   *         required: false
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Séances jusqu'à cette date/heure
   *         required: false
   *     responses:
   *       200:
   *         description: Liste des séances récupérée avec succès.
   *       400:
   *         description: Requête invalide.
   *       401:
   *         description: Non autorisé.
   */
  app.get("/screenings", AuthMiddleware, ListScreenings);

  /**
   * @openapi
   * /screenings/{id}:
   *  get:
   *    tags: [Screenings]
   *    summary: Récupère une séance par son ID
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      200:
   *        description: Séance récupérée avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Séance non trouvée.
   */
  app.get("/screenings/:id", AuthMiddleware, GetScreening);

  /**
   * @openapi
   * /screenings/{id}/stats:
   *  get:
   *    tags: [Screenings]
   *    summary: Statistiques d'une séance (ADMIN)
   *    description: Retourne le nombre de billets vendus et de spectateurs pour la séance.
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      200:
   *        description: Statistiques de la séance
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      403:
   *        description: Accès interdit.
   *      404:
   *        description: Séance non trouvée.
   */
  app.get(
    "/screenings/:id/stats",
    AuthMiddleware,
    RequireRole(UserRole.ADMIN),
    GetScreeningStats
  );

  /**
   * @openapi
   * /screenings/:
   *  post:
   *    tags: [Screenings]
   *    summary: Crée une nouvelle séance (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - movie_id
   *              - room_id
   *              - start_time
   *              - end_time
   *            properties:
   *              movie_id:
   *                type: integer
   *                minimum: 1
   *              room_id:
   *                type: integer
   *                minimum: 1
   *              start_time:
   *                type: string
   *                format: date-time
   *              end_time:
   *                type: string
   *                format: date-time
   *    responses:
   *      201:
   *        description: Séance créée avec succès.
   *      400:
   *        description: Erreur de validation des données envoyées.
   *      401:
   *        description: Non autorisé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/screenings/", AuthMiddleware, RequireRole(UserRole.ADMIN), CreateScreening);

  /**
   * @openapi
   * /screenings/{id}:
   *  delete:
   *    tags: [Screenings]
   *    summary: Supprime une séance par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      204:
   *        description: Séance supprimée avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Séance non trouvée.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.delete("/screenings/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), DeleteScreening);

  /**
   * @openapi
   * /screenings/{id}:
   *  patch:
   *    tags: [Screenings]
   *    summary: Met à jour une séance par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              movie_id:
   *                type: integer
   *                minimum: 1
   *              room_id:
   *                type: integer
   *                minimum: 1
   *              start_time:
   *                type: string
   *                format: date-time
   *              end_time:
   *                type: string
   *                format: date-time
   *    responses:
   *      200:
   *        description: Séance mise à jour avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Séance non trouvée.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.patch("/screenings/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), UpdateScreening);

  // ======================================
  //                TICKET
  // ======================================

  /**
   * @openapi
   * /tickets:
   *   get:
   *     tags: [Tickets]
   *     summary: Liste les tickets
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Numéro de page (>= 1)
   *         required: false
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Nombre d'éléments par page
   *         required: false
   *       - in: query
   *         name: userId
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: ID de l'utilisateur
   *         required: false
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [normal, super]
   *         description: Type de ticket
   *         required: false
   *       - in: query
   *         name: availableOnly
   *         schema:
   *           type: boolean
   *         description: Filtrer uniquement les tickets disponibles (utilisations restantes > 0)
   *         required: false
   *     responses:
   *       200:
   *         description: Liste des tickets récupérée avec succès.
   *       400:
   *         description: Requête invalide.
   *       401:
   *         description: Non autorisé.
   */
  app.get("/tickets", AuthMiddleware, ListTickets);

  /**
   * @openapi
   * /tickets/{id}:
   *  get:
   *    tags: [Tickets]
   *    summary: Récupère un ticket par son ID
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      200:
   *        description: Ticket récupéré avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Ticket non trouvé.
   */
  app.get("/tickets/:id", AuthMiddleware, GetTicket);

  /**
   * @openapi
   * /tickets/:
   *  post:
   *    tags: [Tickets]
   *    summary: Crée un nouveau ticket (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - user_id
   *              - type
   *            properties:
   *              user_id:
   *                type: integer
   *                minimum: 1
   *              type:
   *                type: string
   *                enum: [normal, super]
   *              remaining_uses:
   *                type: integer
   *                minimum: 0
   *    responses:
   *      201:
   *        description: Ticket créé avec succès.
   *      400:
   *        description: Erreur de validation des données envoyées.
   *      401:
   *        description: Non autorisé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/tickets/", AuthMiddleware, RequireRole(UserRole.ADMIN), CreateTicket);

  /**
   * @openapi
   * /tickets/{id}:
   *  patch:
   *    tags: [Tickets]
   *    summary: Met à jour un ticket par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              user_id:
   *                type: integer
   *                minimum: 1
   *              type:
   *                type: string
   *                enum: [normal, super]
   *              remaining_uses:
   *                type: integer
   *                minimum: 0
   *    responses:
   *      200:
   *        description: Ticket mis à jour avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Ticket non trouvé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.patch("/tickets/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), UpdateTicket);

  /**
   * @openapi
   * /tickets/{id}:
   *  delete:
   *    tags: [Tickets]
   *    summary: Supprime un ticket par son ID (ADMIN)
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    responses:
   *      204:
   *        description: Ticket supprimé avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Ticket non trouvé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.delete("/tickets/:id", AuthMiddleware, RequireRole(UserRole.ADMIN), DeleteTicket);

  /**
   * @openapi
   * /tickets/{id}/use:
   *  post:
   *    tags: [Tickets]
   *    summary: Utiliser un ticket pour une séance
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - screening_id
   *            properties:
   *              screening_id:
   *                type: integer
   *                minimum: 1
   *    responses:
   *      200:
   *        description: Ticket utilisé avec succès.
   *      400:
   *        description: Requête invalide ou plus d'utilisations restantes.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Ticket ou séance non trouvés.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/tickets/:id/use", AuthMiddleware, UseTicket);

  /**
   * @openapi
   * /tickets/{id}/usages:
   *  get:
   *    tags: [Tickets]
   *    summary: Liste les utilisations d'un ticket
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *          minimum: 1
   *      - in: query
   *        name: page
   *        schema:
   *           type: integer
   *           minimum: 1
   *        description: Numéro de page (>= 1)
   *        required: false
   *      - in: query
   *        name: size
   *        schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *        description: Nombre d'éléments par page
   *        required: false
   *    responses:
   *      200:
   *        description: Liste des utilisations trouvées avec succès.
   *      400:
   *        description: Requête invalide.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Ticket introuvable.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.get("/tickets/:id/usages", AuthMiddleware, ListTicketUsages);

  /**
   * @openapi
   * /tickets/buy/{type}:
   *  post:
   *    tags: [Tickets]
   *    summary: Acheter un ticket
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: type
   *        required: true
   *        schema:
   *          type: string
   *          enum: [normal, super]
   *    responses:
   *      201:
   *        description: Ticket acheté avec succès.
   *      400:
   *        description: Requête invalide ou solde insuffisant.
   *      401:
   *        description: Non autorisé.
   *      404:
   *        description: Utilisateur non trouvé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/tickets/buy/:type", AuthMiddleware, BuyTicket);

  // ========================================
  //                BALANCE
  // ========================================

  /**
   * @openapi
   * /balance:
   *  get:
   *    tags: [Balance]
   *    summary: Récupère le solde de l'utilisateur connecté
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Solde récupéré avec succès.
   *      401:
   *        description: Non autorisé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.get("/balance", AuthMiddleware, GetBalance);

  /**
   * @openapi
   * /balance/deposit:
   *  post:
   *    tags: [Balance]
   *    summary: Ajoute de l'argent au solde d'un utilisateur
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - amount
   *            properties:
   *              amount:
   *                type: number
   *                minimum: 0.01
   *                description: Le montant à déposer
   *    responses:
   *      200:
   *        description: Solde mis à jour avec succès.
   *      400:
   *        description: Requête invalide (erreur de validation).
   *      401:
   *        description: Non autorisé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/balance/deposit", AuthMiddleware, DepositBalance);

  /**
   * @openapi
   * /balance/withdraw:
   *  post:
   *    tags: [Balance]
   *    summary: Retire de l'argent du solde de l'utilisateur connecté
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - amount
   *            properties:
   *              amount:
   *                type: number
   *                minimum: 0.01
   *                description: Le montant à retirer
   *    responses:
   *      200:
   *        description: Solde mis à jour avec succès.
   *      400:
   *        description: Requête invalide ou solde insuffisant.
   *      401:
   *        description: Non autorisé.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.post("/balance/withdraw", AuthMiddleware, WithdrawBalance);

  // ========================================
  //              TRANSACTIONS
  // ========================================

  /**
   * @openapi
   * /transactions:
   *  get:
   *    tags: [Transactions]
   *    summary: Liste les transactions
   *    description: Les administrateurs voient toutes les transactions, les utilisateurs voient uniquement les leurs.
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Numero de page
   *      - in: query
   *        name: size
   *        schema:
   *          type: integer
   *          minimum: 1
   *          maximum: 100
   *        description: Nombre d'elements par page
   *      - in: query
   *        name: userId
   *        schema:
   *          type: integer
   *          minimum: 1
   *        description: Filtre par utilisateur (ADMIN)
   *      - in: query
   *        name: type
   *        schema:
   *          type: string
   *          enum: [deposit, withdraw, ticket_purchase]
   *        description: Filtre par type de transaction
   *      - in: query
   *        name: from
   *        schema:
   *          type: string
   *          format: date-time
   *        description: Date de debut (ISO 8601)
   *      - in: query
   *        name: to
   *        schema:
   *          type: string
   *          format: date-time
   *        description: Date de fin (ISO 8601)
   *    responses:
   *      200:
   *        description: Liste des transactions.
   *      400:
   *        description: Requete invalide.
   *      401:
   *        description: Non autorise.
   *      403:
   *        description: Acces interdit.
   *      500:
   *        description: Erreur interne du serveur.
   */
  app.get("/transactions", AuthMiddleware, ListTransactions);
};
