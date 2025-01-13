const express = require('express');
const axios = require('axios');
const { token, clientId, clientSecret, redirectUri } = require('./config');
const fs = require('fs');


const app = express();
const port = 4000;

app.get('/', async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    return res.send('Authorization code not provided.');
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
      })
    );

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    // Optionally, you can store the tokens in a database or file system
    fs.writeFileSync('tokens.json', JSON.stringify({ accessToken, refreshToken }, null, 2));

    res.send(`
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authorization Success</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0a0a0a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            color: white;
        }

        .background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(41, 196, 255, 0.2), transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(255, 41, 191, 0.2), transparent 40%);
            filter: blur(30px);
            z-index: 0;
        }

        .container {
            position: relative;
            background: rgba(20, 20, 20, 0.8);
            border-radius: 30px;
            padding: 40px;
            width: 90%;
            max-width: 600px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 30px rgba(41, 196, 255, 0.2),
                0 0 30px rgba(255, 41, 191, 0.2);
            z-index: 1;
            animation: cardFloat 6s ease-in-out infinite;
        }

        @keyframes cardFloat {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(1deg); }
        }

        .success-ring {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
        }

        .ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 4px solid transparent;
            border-top-color: #29c4ff;
            animation: ringRotate 2s linear infinite;
        }

        .ring:nth-child(2) {
            border-top-color: #ff29bf;
            animation-delay: 0.5s;
        }

        .ring:nth-child(3) {
            border-top-color: #29ffaf;
            animation-delay: 1s;
        }

        @keyframes ringRotate {
            0% { transform: rotate(0); }
            100% { transform: rotate(360deg); }
        }

        .check-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
            color: #29ffaf;
            animation: checkPulse 2s infinite;
        }

        @keyframes checkPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        h1 {
            font-size: 36px;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #29c4ff, #ff29bf, #29ffaf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
        }

        p {
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin: 40px 0;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .feature-card i {
            font-size: 24px;
            background: linear-gradient(45deg, #29c4ff, #ff29bf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .join-button {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 40px auto 0;
            padding: 18px 30px;
            border-radius: 15px;
            background: linear-gradient(45deg, #29c4ff, #ff29bf, #29ffaf);
            color: white;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .join-button:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 10px 20px rgba(41, 196, 255, 0.3),
                0 6px 6px rgba(255, 41, 191, 0.2);
        }

        .join-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transition: 0.5s;
        }

        .join-button:hover::before {
            left: 100%;
        }

        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        @media (max-width: 768px) {
            .container {
                padding: 30px;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="background"></div>
    <div class="particles"></div>
    <div class="container">
        <div class="success-ring">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
            <i class="fas fa-check check-icon"></i>
        </div>
        
        <h1>Authorization Complete!</h1>
        <p>Your bot has been successfully connected and is now ready for an epic journey!</p>

        

        <p>Join our exclusive Discord community and unlock premium features!</p>
        
        <a href="https://discord.gg/cqGRPXzYHd" class="join-button">
            <i class="fab fa-discord"></i> Join Discord
        </a>
    </div>

    
</body>
</html>
      `);

  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).send('Failed to authorize bot.');
  }
});

app.listen(port, () => {
  console.log(`OAuth2 server running at http://localhost:${port}/`);
});
