import { Request, Response, NextFunction } from 'express';


export const logger = (req: Request, res: Response, next: NextFunction) => {
  const time = new Date().toISOString();
  console.log(`

Time: ${time}
Method: ${req.method}
URL: ${req.originalUrl}

Body: ${JSON.stringify(req.body)}
Query: ${JSON.stringify(req.query)}
Params: ${JSON.stringify(req.params)}

`);
  
  next();
};
