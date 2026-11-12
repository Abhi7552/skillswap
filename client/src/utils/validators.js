// Simple form validation helpers. Each returns an object of { field: "message" }.
const emailRe = /^\S+@\S+\.\S+$/;

export const validateLogin = ({ email, password }) => {
  const e = {};
  if (!email.trim()) e.email = "Enter your email address.";
  else if (!emailRe.test(email)) e.email = "Enter a valid email, like name@example.com.";
  if (!password) e.password = "Enter your password.";
  return e;
};

export const validateRegister = ({ name, email, password, confirm }) => {
  const e = validateLogin({ email, password });
  if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";
  if (password && password.length < 6) e.password = "Password must be at least 6 characters.";
  if (confirm !== password) e.confirm = "Passwords do not match.";
  return e;
};

export const validateSkill = ({ title, description }) => {
  const e = {};
  if (title.trim().length < 2) e.title = "Skill name must be at least 2 characters.";
  if (title.length > 80) e.title = "Skill name must be 80 characters or fewer.";
  if (description.length > 500) e.description = "Description must be 500 characters or fewer.";
  return e;
};

export const validateProfile = ({ name, bio }) => {
  const e = {};
  if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";
  if (bio.length > 300) e.bio = "Bio must be 300 characters or fewer.";
  return e;
};

export const validateSwap = ({ offeredSkill, requestedSkill, message }) => {
  const e = {};
  if (!offeredSkill.trim()) e.offeredSkill = "Say which skill you will teach.";
  if (!requestedSkill.trim()) e.requestedSkill = "Say which skill you want to learn.";
  if (message.length > 300) e.message = "Message must be 300 characters or fewer.";
  return e;
};
