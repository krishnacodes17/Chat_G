const { z } = require("zod");

const registerUserSchema = z.object({
  fullName: z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .trim(),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .trim(),
  }),

  email: z.string().email("Please enter a valid email").trim().toLowerCase(),

  password: z.string().min(5, "Password must be at least 5 characters"),
});

const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email").trim().toLowerCase(),

  password: z.string().min(5, "Password must be at least 5 characters"),
});

module.exports = {
  registerUserSchema,
  loginUserSchema
};
