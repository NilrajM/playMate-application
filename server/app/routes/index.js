import userAuthRouter from '../routes/userAuth-route.js';

export default (app) => {
    app.use('/auth', userAuthRouter);
}