import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;
import e from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 8080;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = e();

const nocache = (req, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidata');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
}

const generateAccessToken = (req, resp) => {
  // set response header
  resp.header('Access-Control-Allow-Origin', '*')
  // get channel name
  const channelName = req.query.channelName;
  if (!channelName) {
    return resp.status(500).json({ 
      'success' : false,
      'error' : 'channel is required' 
    });
  }
  // get uid
  let uid = req.query.uid;
  if(!uid || uid == '') {
    uid = 0;
  }
  // get role
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  }
  // get the expire time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == '') {
    expireTime = 1800;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  console.log(`APP_ID: ${APP_ID}`)
  console.log(`APP_CERTIFICATE: ${APP_CERTIFICATE}`)
  console.log(`channelName: ${channelName}`)
  console.log(`uid: ${uid}`)
  console.log(`role: ${role}`)
  console.log(`privilegeExpireTime: ${privilegeExpireTime}`)

  // build the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID, 
    APP_CERTIFICATE, 
    channelName, 
    uid, 
    role, 
    privilegeExpireTime)
  // return the token
  return resp.json({ 
    'success': true,
    'token': token
  })
}

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})