import jwt from 'jsonwebtoken';

export function validateInput(input) {
    if (input.trim() === '') {
      return true;
    }
    return false;
}


const generateJWT = user => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '5h'
    })
}

export const generateId = () => {
  return Math.random().toString(36).substring(2,6) + Date.now().toString(32).substring(6,10)

  }
  

export default generateJWT;