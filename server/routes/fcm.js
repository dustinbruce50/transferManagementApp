const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('/home/localUsr/projectmanagementappnotif-firebase-adminsdk-fbsvc-2125592a6b.json');
const router = express.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
module.exports = verifyToken => {
    router.post('/send-background', async (req, res) => {
        
        const { token , data } = req.body;
        const message = {
            notification: {
               title: data.title || "title fail",
               body: data.body || "body fail",
           },
           token: token,
           
        };
        try {
            const response = await admin.messaging().send(message);
            //console.log('Successfully sent background message:', response);
            res.status(200).send({ success: true, response });
        } catch (error) {
            //console.error('Error sending background message:', error);
            res.status(500).send({ success: false, error: error.message });
        }
        
    });

    return router;

    
};
