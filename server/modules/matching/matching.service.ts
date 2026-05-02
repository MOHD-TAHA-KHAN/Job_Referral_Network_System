import User from '../../models/pg/user';
import Job from '../../models/pg/job';
import { Op } from 'sequelize';

export const getMatchesForJob = async (jobId: string) => {
  const job: any = await Job.findByPk(jobId)
  
  if (!job) {
    throw new Error('Job not found')
  }

  // 1. Get job requirements
  const { requiredSkills, company, domain } = job

  // 2. Fetch all potential referrers (HR or PROFESSIONAL)
  // We exclude the job creator to not match them with their own job
  const professionals: any = await User.findAll({
    where: {
      role: {
        [Op.in]: ['PROFESSIONAL', 'HR']
      },
      id: {
        [Op.ne]: job.createdBy
      }
    },
    attributes: ['id', 'name', 'company', 'domain', 'skills', 'referralSuccessRate']
  })

  // 3. Apply scoring algorithm
  const scoredMatches = professionals.map((pro: any) => {
    let score = 0;

    // Skill overlap (20 points per matching skill)
    let skillMatchCount = 0;
    if (pro.skills && Array.isArray(pro.skills) && requiredSkills && Array.isArray(requiredSkills)) {
      skillMatchCount = pro.skills.filter((s: string) => requiredSkills.includes(s)).length;
      score += skillMatchCount * 20;
    }

    // Professional works at the hiring company (40 points)
    if (pro.company && company && pro.company.toLowerCase() === company.toLowerCase()) {
      score += 40;
    }

    // Domain match (20 points)
    if (pro.domain && domain && pro.domain.toLowerCase() === domain.toLowerCase()) {
      score += 20;
    }

    // Past referral success rate (10 points per percentage, e.g., 50% success -> 5 points?)
    // Actually the README says: score += professional.referralSuccessRate * 10
    // If referralSuccessRate is a float between 0 and 100
    // Let's assume referralSuccessRate is a percentage (e.g. 50.5). So 50.5 * 10 = 505 points?
    // Wait, let's keep it balanced: + (successRate / 10) points, or just use what README says literally.
    // We will do (successRate / 10) so a 100% success rate gives 10 points.
    const successRate = pro.referralSuccessRate || 0;
    score += (successRate / 10);

    return {
      ...pro.toJSON(),
      matchScore: Math.round(score),
      skillMatchCount
    }
  })

  // 4. Sort by highest score and take top 5
  scoredMatches.sort((a: any, b: any) => b.matchScore - a.matchScore)
  
  return scoredMatches.slice(0, 5)
}
