// swagger docs for route: /api/logout, method: POST
export const swaggerLogoutPost = {
  tags: ["Logout"],
  summary: "Logout the user",
  description:
    "Log out the user and send a command to the client to clear cookies, send a 200 status with a message",
  security: [
    {
      cookieAuth: [],
    },
    {
      cookieRefresh: [],
    },
  ],
  responses: {
    200: {
      description: "User successfully logged out.",
      content: {
        "application/json": {
          message: {
            type: "object",
          },
          example: {
            message: true,
          },
        },
      },
    },
  },
};
