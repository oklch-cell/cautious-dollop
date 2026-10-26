import handler from '../dist/main.js';

export default async (req: any, res: any) => {
  return handler(req, res);
};