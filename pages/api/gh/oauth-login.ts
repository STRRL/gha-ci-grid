// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OAuthApp } from 'octokit';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const app = new OAuthApp({
        clientType: "oauth-app",
        clientId: process.env.GITHUB_APP_CLIENT_ID!,
        clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    });
    const { url: targetURL } = app.getWebFlowAuthorizationUrl({
        redirectUrl: `${process.env.BASE_URL}/api/gh/oauth-callback`,
        scopes: [
            "user",
            "read:org",
            "workflow"
        ]
    })
    res.status(302).redirect(targetURL)
}