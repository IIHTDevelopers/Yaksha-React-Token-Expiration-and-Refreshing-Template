import { generateJWT, generateRefreshToken, isExpiredToken, refreshToken } from '../../utils/authUtils';

describe('boundary', () => {
    it('HelperFunctions boundary generateJWT should generate a valid JWT', () => {
        const token = generateJWT();
        expect(token).toBeTruthy(); // Ensure token is not null or empty

        const decodedToken = JSON.parse(atob(token));
        expect(decodedToken.userId).toBe('user123');
        expect(decodedToken.role).toBe('user');
    });

    it('HelperFunctions boundary generateRefreshToken should generate a valid refresh token', () => {
        const token = generateRefreshToken();
        expect(token).toBeTruthy(); // Ensure token is not null or empty

        const decodedToken = JSON.parse(atob(token));
        expect(decodedToken.userId).toBe('user123');
        expect(decodedToken.role).toBe('user');
    });

    it('HelperFunctions boundary isExpiredToken should return true for expired token', () => {
        const token = btoa(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) - 60 // expired token
        }));
        expect(isExpiredToken(token)).toBe(true);
    });

    it('HelperFunctions boundary refreshToken should return a new JWT if refresh token is valid', () => {
        const refreshTokenStr = btoa(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + 60 // valid refresh token
        }));
        const newToken = refreshToken(refreshTokenStr);
        expect(newToken).toBeTruthy(); // Ensure new token is not null or empty

        const decodedToken = JSON.parse(atob(newToken));
        expect(decodedToken.userId).toBe('user123');
        expect(decodedToken.role).toBe('user');
    });

    it('HelperFunctions boundary refreshToken should return null if refresh token is expired', () => {
        const refreshTokenStr = btoa(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) - 60 // expired refresh token
        }));
        expect(refreshToken(refreshTokenStr)).toBeNull();
    });
});
