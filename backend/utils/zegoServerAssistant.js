const crypto = require('crypto');

function makeRandomIv() {
    const iv = Buffer.alloc(16);
    for (let i = 0; i < 16; i++) {
        iv[i] = Math.floor(Math.random() * 256);
    }
    return iv;
}

function generateToken(appId, userId, serverSecret, effectiveTimeInSeconds) {
    if (!appId || !userId || !serverSecret || !effectiveTimeInSeconds) {
        return null;
    }

    const createTime = Math.floor(Date.now() / 1000);
    const tokenInfo = {
        app_id: appId,
        user_id: userId,
        nonce: Math.floor(Math.random() * 2147483647),
        ctime: createTime,
        expire: createTime + effectiveTimeInSeconds
    };

    // Convert token info to string
    const plaintextBytes = Buffer.from(JSON.stringify(tokenInfo));
    
    // Use random IV for encryption
    const iv = makeRandomIv();
    
    // Create key from server secret
    const key = crypto.createHash('md5').update(serverSecret).digest();
    
    // Encrypt token info
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(plaintextBytes);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Concatenate IV and encrypted data
    const bytes = Buffer.concat([iv, encrypted]);
    
    // Encode with base64
    const token = bytes.toString('base64').replace(/\+/g, '*').replace(/\//g, '-').replace(/=+$/g, '');
    
    return `04${token}`;
}

module.exports = {
    generateToken
};