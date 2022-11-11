import { createAppAuth } from "@octokit/auth-app";
import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "octokit";

export default class GitHubAppInstallationClient {
    octokit: Octokit

    constructor(
        appId: string,
        privateKey: string,
        installationID: number,
    ) {
        const OctokitWithThrottling = Octokit.plugin(throttling);
        this.octokit = new OctokitWithThrottling({
            authStrategy: createAppAuth,
            auth: {
                appId: appId,
                privateKey: privateKey,
                installationId: installationID,
            },
            throttle: {
                enabled: false,
            },
        });
    }

    async listWorkflowsWithOwnerRepo(owner: string, repo: string) {
        const listWorkflowsResponse = await this.octokit.rest.actions.listRepoWorkflows({
            owner: owner,
            repo: repo
        })
        return listWorkflowsResponse.data
    }

    async listGiHubActionRunsWithOwnerRepoWorklfowID(owner: string, repo: string, workflow_id: number) {
        const listWorkflowRunsReponse = await this.octokit.rest.actions.listWorkflowRuns({
            owner: owner,
            repo: repo,
            workflow_id: workflow_id,
        });

        return listWorkflowRunsReponse.data.workflow_runs
    }
}
