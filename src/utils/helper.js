import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Relation from "../models/relations.model.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

export const sendPassMail = async (otp, user) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Your Ancestropedia Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>

        <h2 style="text-align: center; color: #007BFF;">Password Reset Request</h2>

        <p>Hello ${user.firstName || "User"},</p>

        <p>We received a request to reset your password for your Ancestropedia account.</p>

        <p>Please use the following One-Time Password (OTP) to reset your password:</p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="
            font-size: 28px;
            letter-spacing: 6px;
            font-weight: bold;
            color: #222;
            background-color: #f0f0f0;
            padding: 12px 24px;
            border-radius: 8px;
            display: inline-block;
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for <strong>5 minutes</strong>. If you didn’t request this, you can safely ignore this email.</p>

        <p>Stay safe,</p>
        <p><strong>The Ancestropedia Team</strong></p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationMail = async (user) => {
  const otp = generateOtp();

  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Verify Your Ancestropedia Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>

        <h2 style="text-align: center; color: #007BFF;">Email Verification Required</h2>

        <p>Hello ${user.firstName || "User"},</p>

        <p>Thank you for signing up to <strong>Ancestropedia</strong>.</p>

        <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="
            font-size: 28px;
            letter-spacing: 6px;
            font-weight: bold;
            color: #222;
            background-color: #f0f0f0;
            padding: 12px 24px;
            border-radius: 8px;
            display: inline-block;
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP will expire in <strong>5 minutes</strong>. Enter it on the Ancestropedia verification screen to activate your account.</p>

        <p>If you didn’t create an account, please ignore this email.</p>

        <p>Kind regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return otp;
};

export const sendReportReviewMail = async (report, user) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Ancestropedia Report Review Update",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>
        <h2 style="text-align: center; color: #007BFF;">Report Status Update</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>Your submitted report has been reviewed. Here are the details:</p>
        <div style="margin: 24px 0; background: #f4f8fc; padding: 18px; border-radius: 8px;">
          <p><strong>Report ID:</strong> ${report._id}</p>
          <p><strong>Description:</strong> ${report.description}</p>
          <p><strong>Status:</strong> <span style="color: #007BFF; font-weight: bold;">${
            report.status
          }</span></p>
        </div>
        <p>If you have questions or need further assistance, feel free to reply to this email.</p>
        <p>Kind regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendTokenAllotmentMail = async (user, redirectUrl) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "You Have Been Allotted Tree Access Token",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>
        <h2 style="text-align: center; color: #28a745;">Token Allotted</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>You have been successfully allotted a token to access and contribute to a family tree.</p>
        <p>To view and start editing, please click the link below:</p>
        <div style="margin: 20px 0;">
          <a href="${redirectUrl}" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Access Tree</a>
        </div>
        <p>Regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendTokenRemovalMail = async (user, redirectUrl) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Tree Access Token Removed",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>
        <h2 style="text-align: center; color: #dc3545;">Token Access Removed</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>We wanted to let you know that your access to the tree has been revoked.</p>
        <p>If this was unexpected or you believe it’s a mistake, you can contact us.</p>
        <p>To check, please click the link below:</p>
        <div style="margin: 20px 0;">
          <a href="${redirectUrl}" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Access Tree</a>
        </div>
        <p>Regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendTokenRejectionMail = async (user, redirectUrl) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Tree Access Request Rejected",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>
        <h2 style="text-align: center; color: #dc3545;">Access Request Rejected</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>Unfortunately, your request to get the tokens has been rejected by the owner or admin.</p>
        <p>You can reply to this email if you want to appeal or know more about the reason.</p>
        <p>To view and check, please click the link below:</p>
        <div style="margin: 20px 0;">
          <a href="${redirectUrl}" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Access Tree</a>
        </div>
        <p>Regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const getAllEvents = async (persons, marriages, treeId) => {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const events = [];
  const personMap = {};
  persons.forEach((p) => {
    personMap[p._id.toString()] = p;
  });

  const relations = await Relation.find({ treeId });

  const addRelationInfo = (personId) => {
    const related = [];
    relations.forEach((rel) => {
      if (rel.from.toString() === personId.toString()) {
        const toPerson = personMap[rel.to.toString()];
        if (toPerson) {
          related.push({
            type: rel.relationType,
            name: toPerson.name,
            gender: toPerson.gender,
            personId: toPerson._id,
          });
        }
      } else if (rel.to.toString() === personId.toString()) {
        const fromPerson = personMap[rel.from.toString()];
        if (fromPerson) {
          related.push({
            type: rel.relationType,
            name: fromPerson.name,
            gender: fromPerson.gender,
            personId: fromPerson._id,
          });
        }
      }
    });
    return related;
  };

  persons.forEach((person) => {
    if (person.dob) {
      const dob = new Date(person.dob);
      if (
        !isNaN(dob) &&
        dob.getDate() === todayDate &&
        dob.getMonth() === todayMonth
      ) {
        events.push({
          type: "birthday",
          date: dob.toISOString(),
          personId: person._id,
          name: person.name,
          gender: person.gender,
          relations: addRelationInfo(person._id),
        });
      }
    }

    if (person.dod) {
      const dod = new Date(person.dod);
      if (
        !isNaN(dod) &&
        dod.getDate() === todayDate &&
        dod.getMonth() === todayMonth
      ) {
        events.push({
          type: "death anniversary",
          date: dod.toISOString(),
          personId: person._id,
          name: person.name,
          gender: person.gender,
          relations: addRelationInfo(person._id),
        });
      }
    }
  });

  marriages.forEach((marriage) => {
    if (marriage.marriageDate) {
      const md = new Date(marriage.marriageDate);
      if (
        !isNaN(md) &&
        md.getDate() === todayDate &&
        md.getMonth() === todayMonth
      ) {
        events.push({
          type: "marriage anniversary",
          date: md.toISOString(),
          marriageId: marriage._id,
          spouseA: {
            id: marriage.spouseA,
            name: personMap[marriage.spouseA.toString()]?.name,
            gender: personMap[marriage.spouseA.toString()]?.gender,
          },
          spouseB: {
            id: marriage.spouseB,
            name: personMap[marriage.spouseB.toString()]?.name,
            gender: personMap[marriage.spouseB.toString()]?.gender,
          },
          relations: [
            ...addRelationInfo(marriage.spouseA),
            ...addRelationInfo(marriage.spouseB),
          ],
        });
      }
    }
  });

  return events;
};
