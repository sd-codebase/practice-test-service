const axios = require('axios');
import jwt from 'jsonwebtoken';
import { authRoutes } from './auth-routes';
import { SECRETE_KEY, ENV } from './../../config';

const SECRET_KEY = process.env.SECRETE_KEY || SECRETE_KEY;
const ENVR = process.env.ENV || ENV;

export const isAuthRequired = (httpMethod, url) => {
    for (let routeObj of authRoutes) {
    //   if (routeObj.method === httpMethod && routeObj.url === url) {
    //     return true;
    //   }
        if (url.indexOf(routeObj) !== -1) {
            return true;
        }
    }
    return false;
}

export const generateJWTToken = userData => {
    return jwt.sign(userData, SECRET_KEY, { expiresIn: '30d' });
}

export const verifyJWTToken = jwtToken => {
    try{
        return jwt.verify(jwtToken, SECRET_KEY);
     }catch(e){
        return e;
    }
}

export const handleAuth = app => {
    app.use(async (req, res, next) => {
        const apiUrl = req.originalUrl;
        const httpMethod = req.method;
        if (httpMethod !== 'OPTIONS' && isAuthRequired(httpMethod, apiUrl)) {
            let authHeader = req.header('Authorization');
            let sessionID = authHeader && authHeader.split(' ')[1];
            if (sessionID) {
                let url = `https://test-for-all-services.herokuapp.com/api/users/get-user-for-verification`;
                if(ENVR === 'dev') {
                    url = `http://localhost:3000/api/users/get-user-for-verification`;
                }
                try {
                    const request = await axios.post(url,{sessionID});
                    
                    if(request.data.status !== 1) {
                        throw {re: request}
                    }
                } catch (e) {
                    res.status(401).send({
                        error: {
                            reason: "Unauthorized Access",
                            code: 401,
                            e
                        }
                    });
                }
            } else {
                res.status(401).send({
                    error: {
                        reason: "Missing Sessiontoken",
                        code: 401
                      }
                });
            }
        }
        next();
    });
}