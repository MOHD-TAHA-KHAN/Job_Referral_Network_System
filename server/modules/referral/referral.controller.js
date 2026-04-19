const referralService = require('./referral.service')

const createReferral = async (req, res) => {
  try {
    const { jobId, referrerId, message } = req.body
    const requesterId = req.user.id

    const referral = await referralService.createReferral({
      jobId,
      referrerId,
      message,
      requesterId
    })

    res.status(201).json({
      success: true,
      referral,
      message: 'Referral request sent successfully'
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

const getMyReferrals = async (req, res) => {
  try {
    const { status, type } = req.query
    const referrals = await referralService.getReferralsForUser(req.user.id, { status, type })

    res.json({
      success: true,
      referrals
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching referrals'
    })
  }
}

const getReferralById = async (req, res) => {
  try {
    const referral = await referralService.getReferralById(req.params.id, req.user.id)
    res.json({
      success: true,
      referral
    })
  } catch (err) {
    const statusCode = err.message === 'Referral not found' ? 404 :
                      err.message.includes('Unauthorized') ? 403 : 500
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const updateReferralStatus = async (req, res) => {
  try {
    const { status, responseMessage } = req.body
    const referral = await referralService.updateReferralStatus(req.params.id, req.user.id, {
      status,
      responseMessage
    })

    res.json({
      success: true,
      referral,
      message: `Referral ${status.toLowerCase()} successfully`
    })
  } catch (err) {
    const statusCode = err.message.includes('Unauthorized') || err.message.includes('Only the referrer') ? 403 :
                      err.message === 'Referral not found' ? 404 : 400
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const getReferralsForJob = async (req, res) => {
  try {
    const referrals = await referralService.getReferralsForJob(req.params.jobId, req.user.id)
    res.json({
      success: true,
      referrals
    })
  } catch (err) {
    const statusCode = err.message.includes('Unauthorized') ? 403 :
                      err.message === 'Job not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  createReferral,
  getMyReferrals,
  getReferralById,
  updateReferralStatus,
  getReferralsForJob
}