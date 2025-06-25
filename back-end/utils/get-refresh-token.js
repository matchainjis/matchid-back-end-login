import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // redirect URI
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://mail.google.com/'],
});

console.log('🔗 Visit this URL to authorize the app:', authUrl);

// After visiting and authorizing, paste the code in below
const readline = await import('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Paste the authorization code here: ', (code) => {
    oauth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        console.log('✅ Refresh token:', token.refresh_token);
        rl.close();
    });
});