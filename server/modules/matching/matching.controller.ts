import { Request, Response } from 'express';
import * as matchingService from './matching.service';

export interface AuthRequest extends Request {
  user?: any;
}

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const matches = await matchingService.getMatchesForJob(jobId as string);

    res.json({
      success: true,
      matches,
      message: 'Matches retrieved successfully'
    });
  } catch (err: any) {
    const statusCode = err.message === 'Job not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
}
