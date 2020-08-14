const axios = require('axios');
import jwt from 'jsonwebtoken';
import { authRoutes } from './auth-routes';
import { UserService } from './../modules/user/user.service';
import { SECRETE_KEY } from './../../config';

const SECRET_KEY = process.env.SECRETE_KEY || SECRETE_KEY;

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
    return jwt.sign(userData, SECRET_KEY, { expiresIn: '12h' });
}

export const verifyJWTToken = jwtToken => {
    try{
        return jwt.verify(jwtToken, SECRET_KEY);
     }catch(e){
        return null;
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
                let userData = verifyJWTToken(sessionID);
                if (userData) {
                    let user;
                    let url = `https://test-for-all-services.herokuapp.com/api/users/get-user-for-verification?email=${userData.email}`;
                    if (userData.userType === 'Guest') {
                        url = `https://test-for-all-services.herokuapp.com/api/users/get-user-for-verification?email=${userData.email}&isGuest=true`;
                    }
                    try {
                        const request = await axios.get(url);
                        console.log(request.status, reuest.data)
                        if(request.status !== 200) {
                            throw {err:request};
                        }
                        user = request.data;
                    } catch (e) {
                        console.log("1qwert",e)
                        res.status(401).send({
                            error: {
                                reason: "Unauthorized Access",
                                code: 401,
                                e
                            }
                        });
                    }
                    if(user.status !== 1) {
                        console.log("2asddff")
                        res.status(401).send({
                            error: {
                                reason: "Unauthorized Access",
                                code: 401,
                                e: 'User error while finding user'
                            }
                        });
                    }
                } else {
                    console.log("3asddff")
                    res.status(401).send({
                        error: {
                            reason: "Unauthorized Access",
                            code: 401,
                            e: 'Jwt not vwrified'
                          }
                    });
                }
            } else {
                console.log("4asddff")
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