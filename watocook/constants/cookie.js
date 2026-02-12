const COOKIE_NAME = 'wato_cook_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const JWT_EXPIRATION = '7d';

const COOKIE_OPTION =  {
    httpOnly: true,
    secure : true ,
    path : '/',
    maxAge: COOKIE_MAX_AGE * 1000,
    sameSite: 'strict',
}

export { COOKIE_NAME, COOKIE_MAX_AGE, JWT_EXPIRATION };