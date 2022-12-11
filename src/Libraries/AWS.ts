// class to use sns for send sms
import { SNS } from 'aws-sdk';

export class WebServices {
    public async sendSMS(phoneNumber: string,message: string) {
        const sns = new SNS({
            region: 'ap-south-1',
});
        const params = {
            Message: message,
            PhoneNumber: phoneNumber
        };
        console.log(phoneNumber);
        await sns.publish(params).promise();
    }
}

