// @ts-nocheck
import User from '../../models/pg/user';
import Referral from '../../models/pg/referral';


import {  Op  } from 'sequelize';

const getProfile = async (req: any, res: any) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ success: true, profile: user })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' })
  }
}

const updateProfile = async (req: any, res: any) => {
  try {
    const { company, domain, skills, resumeUrl } = req.body

    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Update only allowed fields
    if (user.role === 'PROFESSIONAL' || user.role === 'HR') {
      if (company !== undefined) user.company = company === '' ? null : company
      if (domain !== undefined) user.domain = domain === '' ? null : domain
    }

    if (skills !== undefined) user.skills = skills === '' ? null : skills
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl === '' ? null : resumeUrl

    await user.save()

    res.json({ success: true, profile: user })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error updating profile' })
  }
}

const getUsers = async (req: any, res: any) => {
  try {
    const { role } = req.query
    const whereClause = {}

    if (role) {
      // Handle multiple roles (role=PROFESSIONAL&role=HR)
      const roles = Array.isArray(role) ? role : [role]
      whereClause.role = { [Op.in]: roles }
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'company', 'domain', 'role', 'referralSuccessRate'],
      order: [['name', 'ASC']]
    })

    res.json({ success: true, users })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching users' })
  }
}

const getStats = async (req: any, res: any) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    let stats: any = {}

    if (user.role === 'FRESHER') {
      const totalSent = await Referral.count({ where: { requesterId: user.id } })
      const accepted = await Referral.count({ where: { requesterId: user.id, status: 'ACCEPTED' } })
      const rejected = await Referral.count({ where: { requesterId: user.id, status: 'REJECTED' } })
      
      stats = { totalSent, accepted, rejected }
    } else {
      // PROFESSIONAL or HR
      const totalReceived = await Referral.count({ where: { referrerId: user.id } })
      const completed = await Referral.count({ where: { referrerId: user.id, status: 'COMPLETED' } })
      const pending = await Referral.count({ where: { referrerId: user.id, status: 'PENDING' } })
      
      stats = { 
        totalReceived, 
        completed, 
        pending,
        successRate: user.referralSuccessRate 
      }
    }

    res.json({ success: true, stats })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' })
  }
}

export { getProfile, updateProfile, getUsers, getStats };