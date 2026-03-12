import { Inject, Injectable } from '@nestjs/common';
import { MAIL_PORT } from '../domain/ports/mail.port';
import type { MailPort } from '../domain/ports/mail.port';
import { RetrieveProjectResponseDTO } from 'src/modules/project/application/dtos/response/read-response.dto';
import { ProjectBaseDTO } from 'src/modules/project/application/dtos/base.dto';
import { DateUtilService } from 'src/common/utils/dateUtil';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_PORT) private readonly mailer: MailPort,
    private readonly dateUtil: DateUtilService,
  ) { }

  async sendOTPEmail(to: string, otp: string): Promise<void> {
    await this.mailer.send({
      to,
      subject: 'Reset your password',
      html: `<!DOCTYPE html>
                <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Document</title>
                  </head>
                  <body>
                      <table width="100%" style="background-color:#f4f6f8; padding:40px 0; display: flex; justify-content: center; align-items: center;">
                          <tr>
                              <td>
                                  <table width="500" style="background:#ffffff; border-radius:8px; border-color:#F82237; border-style: solid; border-width: 5px; padding:30px;">
                                      <tr>
                                          <td style="padding-bottom:20px; text-align:center">
                                              <h2 style="margin:0; color:#333;">Change Password</h2>
                                              <h2 style="margin:0; color:#333;">PT. Central Inovasi Digital</h2>
                                          </td>
                                      </tr>

                                      <tr>
                                          <td style="color:#555; font-size:14px; padding-bottom:20px; text-align:justify">
                                              Hello <strong>${to}</strong>
                                              <br/><br/>
                                              We received a request to reset the password for your <strong>Berinovasi HRIS</strong> account. 
                                              Use the verification code below to proceed with the change:
                                          </td>
                                      </tr>

                                      <tr>
                                          <td>
                                              <table width="100%" cellpadding="10" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;">
                                                  <tr style="background:#f9fafb;">
                                                      <td style="font-weight:bold; width:120px;">OTP Code</td>
                                                      <td>${otp}</td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>

                                      <tr>
                                          <td style="padding-top:25px; font-size:12px; color:#888; text-align:center;">
                                              Download the application in the Play Store
                                              <br>
                                              (Berinovasi-HRIS)
                                              <br>
                                              Don't share this OTP code with someone else
                                          </td>
                                      </tr>
                                  </table>

                                  <table width="500" style="margin-top:10px; display: flex; justify-content: center; align-items: center;">
                                      <tr>
                                          <td style="font-size:12px; color:#999; text-align: center">
                                              © PT.Central Inovasi Digital. 
                                              <br>
                                              All rights reserved.
                                          </td>
                                      </tr>
                                  </table>

                              </td>
                          </tr>
                      </table>
                  </body>
                </html>`,
    });
  }

  async sendNewUserCredentials(
    to: string,
    name: string,
    password: string,
  ): Promise<void> {
    await this.mailer.send({
      to,
      subject: 'User Credentials',
      html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <table width="100%" style="background-color:#f4f6f8; padding:40px 0; display: flex; justify-content: center; align-items: center;">
                        <tr>
                            <td>
                                <table width="500" style="background:#ffffff; border-radius:8px; border-color:#F82237; border-style: solid; border-width: 5px; padding:30px;">
                                    <tr>
                                        <td style="padding-bottom:20px; text-align:center">
                                            <h2 style="margin:0; color:#333;">User Credential</h2>
                                            <h2 style="margin:0; color:#333;">PT. Central Inovasi Digital</h2>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="color:#555; font-size:14px; padding-bottom:20px; text-align:justify">
                                            Hello <strong>${name}</strong>
                                            <br/><br/>
                                            Your account has been successfully created. Below are your login credentials:
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <table width="100%" cellpadding="10" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;">
                                                <tr style="background:#f9fafb;">
                                                    <td style="font-weight:bold; width:120px;">Email</td>
                                                    <td>${to}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight:bold;">Password</td>
                                                    <td>${password}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding-top:25px; font-size:12px; color:#888; text-align:center;">
                                            Download the application in the Play Store
                                            <br>
                                            (Berinovasi-HRIS)
                                            <br>
                                            Please change your password after logging in for security reasons.
                                        </td>
                                    </tr>
                                </table>

                                <table width="500" style="margin-top:10px; display: flex; justify-content: center; align-items: center;">
                                    <tr>
                                        <td style="font-size:12px; color:#999; text-align: center">
                                            © PT.Central Inovasi Digital. 
                                            <br>
                                            All rights reserved.
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>
                </body>
            </html>`,
    });
  }

  async sendUserAddedToProject(
    to: string,
    project: ProjectBaseDTO,
  ): Promise<void> {
    const { name, startDate, endDate } = project;
    await this.mailer.send({
      to,
      subject: 'New Project',
      html: `<!DOCTYPE html>
                <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Document</title>
                  </head>
                  <body>
                      <table width="100%" style="background-color:#f4f6f8; padding:40px 0; display: flex; justify-content: center; align-items: center;">
                          <tr>
                              <td>
                                  <table width="500" style="background:#ffffff; border-radius:8px; border-color:#F82237; border-style: solid; border-width: 5px; padding:30px;">
                                      <tr>
                                          <td style="padding-bottom:20px; text-align:center">
                                              <h2 style="margin:0; color:#333;">New Project</h2>
                                              <h2 style="margin:0; color:#333;">PT. Central Inovasi Digital</h2>
                                          </td>
                                      </tr>

                                      <tr>
                                          <td style="color:#555; font-size:14px; padding-bottom:20px; text-align:justify">
                                              Hello <strong>${to}</strong>
                                              <br/><br/>
                                              You have been successfully added to the <strong>${name}</strong> project. 
                                              Your team is waiting for you! Click the button below to view your tasks and start collaborating with your teammates immediately.
                                          </td>
                                      </tr>

                                      <tr>
                                          <td>
                                              <table width="100%" cellpadding="10" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;">
                                                  <tr style="background:#f9fafb;">
                                                      <td style="font-weight:bold;">Project Team</td>
                                                      <td>${name}</td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-weight:bold;">Start Date</td>
                                                      <td>${this.dateUtil.formatLocal(new Date(startDate), 'YYYY-MM-DD')}</td>
                                                  </tr>
                                                  <tr style="background:#f9fafb;">
                                                      <td style="font-weight:bold;">End Date</td>
                                                      <td>${this.dateUtil.formatLocal(new Date(endDate), 'YYYY-MM-DD')}</td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>

                                      <tr>
                                          <td style="padding-top:25px; font-size:12px; color:#888; text-align:center;">
                                              Download the application in the Play Store
                                              <br>
                                              (Berinovasi-HRIS)
                                              <br>
                                              Please log in to the Berinovasi HRIS portal to access project resources and coordinate with your team members.
                                          </td>
                                      </tr>
                                  </table>

                                  <table width="500" style="margin-top:10px; display: flex; justify-content: center; align-items: center;">
                                      <tr>
                                          <td style="font-size:12px; color:#999; text-align: center">
                                              © PT.Central Inovasi Digital. 
                                              <br>
                                              All rights reserved.
                                          </td>
                                      </tr>
                                  </table>

                              </td>
                          </tr>
                      </table>
                  </body>
                  </html>`,
    });
  }
}
