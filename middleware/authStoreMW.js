import jwt from 'jsonwebtoken';
import AdminUser from '../MongoDB/models/AdminUser.js';

const checkAuthStore = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.adminUser = await AdminUser.findById(decoded.id).select('-password')
      if(!req.adminUser) return res.status(401).json({ error: 'User not found' })

    //   if(!req.adminUser.superAdmin) res.status(401).json({ error: 'User not allow' })

      return next();
    } catch (e) {
      console.log(`Error: ${e}`);

      const error = new Error(`Invalid Token`);
      return res.status(403).json({ msg: error.message });
    }
  }
  
  if (!token) {
    const error = new Error(`Invalid Token o doesn't exist`);
    return res.status(403).json({ msg: error.message });
  }
}

export default checkAuthStore;