const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('/home/localUsr/projectmanagementappnotif-firebase-adminsdk-fbsvc-2125592a6b.json');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Transfer = require('../models/Transfer');




const sendNotifs = async (transfer) => {
    // Logic to send notifications based on transfer details
    console.log('sendNotifs called');
    //transfer = {
     //   type: 'requested',
      //  requestingUnitNum: '6062'
    //}
 // For testing purpose
    if(transfer.type === 'requested') {
        console.log('Transfer type is requested');
        console.log('transfer:', transfer);
        const units = await User.distinct('fcmToken');
        console.log(units);
        units.forEach(async u  => {
            const message = {
                notification: {
                    title: `New Transfer Requested`,
                    body: `Unit Number ${transfer.receivingUnit} is requesting ${transfer.item}(s).`,
                },
                //topic: `user_${transfer.userId}`, // Assuming each user has a unique topic
                token: u,
            };
            try {
                const response = await admin.messaging().send(message);
                console.log('Successfully sent notification:', response);
            } catch (error) {
                console.error('Error sending notification:', error);
            }
});
    }else if (transfer.type === 'accepted' || transfer.type === 'in-transit' || transfer.type === 'delivered') {
        console.log(`Transfer type is ${transfer.type}`);
        const units = await User.find({unitNum: transfer.receivingUnit}, 'fcmToken');
        console.log('accepting unit', transfer.receivingUnit);
        units.forEach(async u => {
            const message = {
                notification: {
                    title: `Your Transfer ${transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}`,
                    body: `Your transfer request for ${transfer.item}(s) is now ${transfer.type}.`,
                },
                token: u.fcmToken,
            };
            try {
                const response = await admin.messaging().send(message);
                console.log('Successfully sent notification to', u.fcmToken, ':', response);
            } catch (error) {
                console.error('Error sending notification to', u.fcmToken, ':', error);
            }
        });
    }else if (transfer.type === 'approved') {
        console.log('Transfer type is approved');
        const units = await User.find({unitNum: transfer.receivingUnit}, 'fcmToken');
        units.forEach(async u => {
            const message = {
                notification: {
                    title: `Your Transfer ${transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}`,
                    body: `${transfer.sendingUnitNum} has accepted your transfer for ${transfer.item}(s).`,
                },
                token: u.fcmToken,
            };
            try {
                const response = await admin.messaging().send(message);
                console.log('Successfully sent notification to', u.fcmToken, ':', response);
            } catch (error) {
                console.error('Error sending notification to', u.fcmToken, ':', error);
            }
        });
    }

}

//module.exports = { sendNotifs };

module.exports = sendNotifs;