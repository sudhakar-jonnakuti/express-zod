import { Request, Response, NextFunction } from "express";
import { ZodError, AnyZodObject } from "zod";

const requestValidator = (schema: AnyZodObject) => 
  async (request: Request, response: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: request.body,
      query: request.query,
      params: request.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).json({
        "errorName": 'BAD REQUEST',
        "errorMessage": "The server cannot process the request due to an apparent client error.",
        "errorRawIssues": error.issues
      })
    }
    return response.status(400).json(error)
  }
};

export default requestValidator;
