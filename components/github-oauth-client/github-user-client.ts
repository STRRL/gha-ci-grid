import { App, Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";

export default class GithubUserClient {
    octokit: Octokit

    constructor(
        accessToken: string
    ) {
        const OctokitWithThrottling = Octokit.plugin(throttling);
        this.octokit = new OctokitWithThrottling({
            auth: accessToken,
            throttle: {
                enabled: false,
            },
        });
    }
    async getUser() {
        const user = await this.octokit.rest.users.getAuthenticated()
        return user.data
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

