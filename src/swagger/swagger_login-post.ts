// swagger docs for route: /api/login, method: POST
export const swaggerLoginPost = {
  tags: ["Login"],
  summary: "Login the user",
  description:
    "User can login to the application with email and password, he will receive an access token and a refresh token",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/User",
        },
      },
    },
  },
  security: [],
  responses: {
    200: {
      description:
        "User Successfully authenticated. The session ID is returned in a cookie named `access_token`. You need to include this cookie in subsequent requests. Another cookie named `refresh_token` is returned. You need to include this cookie in subsequent requests.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
              }
            }
          },
          example: {
            email: "admin@pkm.com"
          }
        },
      },
      headers: {
        "Set-Cookie": {
          schema: {
            type: "string",
            example:
              "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...; Path=/; HttpOnly; Secure;",
            description:
              "The session ID is returned in a cookie named `access_token`.",
          },
        },
        "Set-Cookie-2": {
          schema: {
            type: "string",
            example:
              "refresh_token=Y3JldCIsImlhdCI6MT08TcqZjYQyQ0Uw0...; Path=/; HttpOnly; Secure;",
            description: "Another cookie named `refresh_token`.",
          },
        },
      },
    },
  },
};
