const Referral = require('../../models/pg/referral')
const Job = require('../../models/pg/job')
const User = require('../../models/pg/user')
const { Op } = require('sequelize')

const createReferral = async ({ jobId, referrerId, message, requesterId }) => {
  // Validate that requester is a fresher
  const requester = await User.findByPk(requesterId)
  if (!requester || requester.role !== 'FRESHER') {
    throw new Error('Only freshers can request referrals')
  }

  // Validate that referrer is a professional or HR
  const referrer = await User.findByPk(referrerId)
  if (!referrer || (referrer.role !== 'PROFESSIONAL' && referrer.role !== 'HR')) {
    throw new Error('Can only request referrals from professionals or HRs')
  }

  // Validate that job exists
  const job = await Job.findByPk(jobId)
  if (!job) {
    throw new Error('Job not found')
  }

  // Check if referral already exists
  const existingReferral = await Referral.findOne({
    where: { jobId, requesterId, referrerId }
  })
  if (existingReferral) {
    throw new Error('Referral request already exists for this job and referrer')
  }

  const referral = await Referral.create({
    jobId,
    requesterId,
    referrerId,
    message: message || null
  })

  return referral
}

const getReferralsForUser = async (userId, { status, type } = {}) => {
  // type can be 'sent' (as requester) or 'received' (as referrer)
  const whereClause = {}
  let includeOptions = []

  if (status) {
    whereClause.status = status
  }

  if (type === 'sent') {
    whereClause.requesterId = userId
    includeOptions = [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'company', 'location']
      },
      {
        model: User,
        as: 'referrer',
        attributes: ['id', 'name', 'email', 'company']
      }
    ]
  } else if (type === 'received') {
    whereClause.referrerId = userId
    includeOptions = [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'company', 'location']
      },
      {
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'email']
      }
    ]
  } else {
    // Get all referrals for the user (both sent and received)
    whereClause[Op.or] = [
      { requesterId: userId },
      { referrerId: userId }
    ]
    includeOptions = [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'company', 'location']
      },
      {
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'email']
      },
      {
        model: User,
        as: 'referrer',
        attributes: ['id', 'name', 'email', 'company']
      }
    ]
  }

  const referrals = await Referral.findAll({
    where: whereClause,
    include: includeOptions,
    order: [['createdAt', 'DESC']]
  })

  return referrals
}

const getReferralById = async (id, userId) => {
  const referral = await Referral.findByPk(id, {
    include: [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'description', 'company', 'location', 'requiredSkills']
      },
      {
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'email']
      },
      {
        model: User,
        as: 'referrer',
        attributes: ['id', 'name', 'email', 'company', 'domain']
      }
    ]
  })

  if (!referral) {
    throw new Error('Referral not found')
  }

  // Check if user has permission to view this referral
  if (referral.requesterId !== userId && referral.referrerId !== userId) {
    throw new Error('Unauthorized to view this referral')
  }

  return referral
}

const updateReferralStatus = async (id, userId, { status, responseMessage }) => {
  const referral = await Referral.findByPk(id)
  if (!referral) {
    throw new Error('Referral not found')
  }

  // Only the referrer can update the status
  if (referral.referrerId !== userId) {
    throw new Error('Only the referrer can update the referral status')
  }

  // Validate status transition
  const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  // Prevent invalid transitions
  if (referral.status === 'COMPLETED' && status !== 'COMPLETED') {
    throw new Error('Cannot change status of completed referral')
  }

  if (referral.status === 'REJECTED' && status !== 'REJECTED') {
    throw new Error('Cannot change status of rejected referral')
  }

  referral.status = status
  if (responseMessage !== undefined) {
    referral.responseMessage = responseMessage
  }

  await referral.save()

  // Update referrer's success rate if referral is completed
  if (status === 'COMPLETED') {
    const referrer = await User.findByPk(referral.referrerId)
    if (referrer) {
      // Calculate new success rate based on completed referrals
      const completedReferrals = await Referral.count({
        where: {
          referrerId: referral.referrerId,
          status: 'COMPLETED'
        }
      })
      const totalReferrals = await Referral.count({
        where: { referrerId: referral.referrerId }
      })

      referrer.referralSuccessRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0
      await referrer.save()
    }
  }

  return referral
}

const getReferralsForJob = async (jobId, userId) => {
  // Only HR who created the job or the referrer can see referrals for a job
  const job = await Job.findByPk(jobId)
  if (!job) {
    throw new Error('Job not found')
  }

  if (job.createdBy !== userId) {
    // Check if user is a referrer for this job
    const userReferral = await Referral.findOne({
      where: { jobId, referrerId: userId }
    })
    if (!userReferral) {
      throw new Error('Unauthorized to view referrals for this job')
    }
  }

  const referrals = await Referral.findAll({
    where: { jobId },
    include: [
      {
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'email']
      },
      {
        model: User,
        as: 'referrer',
        attributes: ['id', 'name', 'email', 'company']
      }
    ],
    order: [['createdAt', 'DESC']]
  })

  return referrals
}

module.exports = {
  createReferral,
  getReferralsForUser,
  getReferralById,
  updateReferralStatus,
  getReferralsForJob
}