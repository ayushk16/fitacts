import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const getToken = ({ id, name, email }) => {
    const user = { id, name, email };
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRESIN });
    return { accessToken };
}
export default getToken;