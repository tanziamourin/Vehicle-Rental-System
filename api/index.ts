import type { Request, Response } from 'express';

const app = require('../src/app');

module.exports = function handler(req: Request, res: Response) {
  return app(req, res);
};
