import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const tsHandlerPath = "./src";
const jsHandlerPath = "./dist";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cinéma API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              description: "Description de l'erreur",
              type: "string",
            },
          },
          required: ["error"],
        },
        AuthTokens: {
          type: "object",
          properties: {
            accessToken: {
              description: "Token d'accès JWT pour les requêtes authentifiées",
              type: "string",
            },
            refreshToken: {
              description: "Token de rafraîchissement pour obtenir un nouveau token d'accès",
              type: "string",
            },
          },
          required: ["accessToken", "refreshToken"],
        },
      },
    },
  },
  apis: [
    tsHandlerPath + "/routes.ts",
    tsHandlerPath + "/modules/**/*.ts",
    jsHandlerPath + "/routes.js",
    jsHandlerPath + "/modules/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: number | string) {
  app.get("/openapi.json", (_req: Request, res: Response) => res.json(swaggerSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`Docs available at http://localhost:${port}/docs`);
}
