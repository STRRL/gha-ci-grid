// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { fromENV } from 'components/github-app-client/github-app-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const rawClient = fromENV()
  const owner = req.query.owner! as string;
  const repo = req.query.repo! as string;

  const ghClient = await rawClient.spawnInstallationClientForRepo(owner, repo);
  res.status(200).json(await ghClient.listWorkflowsWithOwnerRepo(owner, repo))
}