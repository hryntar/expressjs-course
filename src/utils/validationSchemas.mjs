export const createUserValidationSchema = {
   username: {
      isLength: {
         errorMessage: "Must be 5-32 characters",
         options: { min: 5, max: 32 },
      },
      notEmpty: {
         errorMessage: "Username cannot be empty",
      },
      isString: {
         errorMessage: "Must be a string",
      },
   },
   displayName: {
      notEmpty: {
         errorMessage: "Display name cannot be empty",
      },
      isString: {
         errorMessage: "Must be a string",
      },
   },
};
