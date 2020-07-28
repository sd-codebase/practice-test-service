import jwt from 'jsonwebtoken';
import { authRoutes } from './auth-routes';
import { UserService } from './../modules/user/user.service';

const SECRET_KEY = "JWT_SECRET";

export const isAuthRequired = (httpMethod, url) => {
    for (let routeObj of authRoutes) {
    //   if (routeObj.method === httpMethod && routeObj.url === url) {
    //     return true;
    //   }
        console.log(url, routeObj)
        if (url.indexOf(routeObj) !== -1) {
            return true;
        }
    }
    return false;
}

export const generateJWTToken = userData => {
    return jwt.sign(userData, SECRET_KEY);
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
        // console.log(apiUrl, httpMethod);
        if (httpMethod !== 'OPTIONS' && isAuthRequired(httpMethod, apiUrl)) {
            let authHeader = req.header('Authorization');
            let sessionID = authHeader && authHeader.split(' ')[1];
            if (sessionID) {
                let userData = verifyJWTToken(sessionID);
                if (userData && (await UserService.getUserByDetails({email:userData.email, password: userData.password, _id: userData._id})).status !== 1) {
                    res.status(401).send({
                        error: {
                            reason: "Unauthorized Access",
                            code: 401
                        }
                    });
                } else {
                    res.status(401).send({
                        error: {
                            reason: "Unauthorized Access",
                            code: 401
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
