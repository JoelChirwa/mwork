import User from '../models/User.js';

export const updateEmployerProfile = async (req, res) => {
  const { companyName, description, frequentHiringAreas, websiteUrl, employerPortfolioUrls } = req.body;
  const user = req.user; // set by requireEmployer

  if (companyName) user.companyName = companyName;
  if (description) user.description = description;
  if (frequentHiringAreas) user.frequentHiringAreas = frequentHiringAreas;
  if (websiteUrl) user.websiteUrl = websiteUrl;

  await user.save();

  return res.status(200).json({ message: 'Employer profile updated', user });
};

export const getEmployerProfile = async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.clerkUserId });
  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.status(200).json({ user });
};
