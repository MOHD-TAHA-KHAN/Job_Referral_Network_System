import express from 'express';
import { getMatches } from './matching.controller';
import { protect } from '../../middleware/auth';

const router = express.Router();

// All matching routes require authentication
router.use(protect);

router.get('/:jobId', getMatches);

export default router;
