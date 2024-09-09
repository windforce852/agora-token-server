# README

## Intro
This is a simple agora server which handle GET request from client to generate temp token for the app to call agora to create voice chat session.  

## Methods
In the get method, there are 6 args:   
- `APP_ID` and `APP_CERTIFICATE` are assigned from .env file from the server side. It is created from Agora console. 
- `channelName` and `uid` should be provided by client side. `uid` must be number.  
- `role` and `privilegeExpireTime` can be left blank.  

**Sample request:**  
```
http://localhost:8080/access_token?channelName=test0909&uid=1234
```

**Sample successful response:**  
```
{
    "success": true,
    "token": "12345"
}
```

### Start
`npm run start`