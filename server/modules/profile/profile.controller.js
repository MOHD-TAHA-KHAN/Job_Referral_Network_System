const User = require('../../models/pg/User')
const { Op } = require('sequelize')

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
      
    res.json({ success: true, profile: user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { company, domain, skills, resumeUrl } = req.body
    
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Update only allowed fields
    if (user.role === 'PROFESSIONAL' || user.role === 'HR') {
      if (company !== undefined) user.company = company
      if (domain !== undefined) user.domain = domain
    }
    
    if (skills !== undefined) user.skills = skills
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl

    await user.save()

    res.json({ success: true, profile: user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating profile' })
  }
}

const getUsers = async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching users' })
  }
}

module.exports = { getProfile, updateProfile, getUsers }
