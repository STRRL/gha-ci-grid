// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OAuthApp } from 'octokit';
import { setCookie } from 'cookies-next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const app = new OAuthApp({
    clientType: "oauth-app",
    clientId: process.env.GITHUB_APP_CLIENT_ID!,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
  });
  const resposne = await app.createToken({
    code: req.query.code! as string
  })
  const token = resposne.authentication.token
  setCookie("token", token, { req, res })
  res.status(302).redirect("/")
}