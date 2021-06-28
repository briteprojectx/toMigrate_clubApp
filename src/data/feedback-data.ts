/**
 * Created by Ashok on 08-06-2016.
 */

export interface FeedbackCategory
{
    id: string;
    name: string;
    displayOrder: number;
}

export interface Feedback
{
    id: number;
    category: FeedbackCategory;
    fromEmail: string;
    toEmail: string;
    subject: string;
    message: string;
    status: string;
    messageSent: any;
    fromUser: number;
    toUser: number;
}
