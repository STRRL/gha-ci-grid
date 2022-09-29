import { App, Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";

export default class GithubUserClient {
    octokit: Octokit
    currentUser: string = ""

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
        // FIXME: dangerous, getUser() must be invoked at once
        this.currentUser = user.data.login
        return user.data
    }

    async listOrgs() {
        const resposne = await this.octokit.rest.orgs.listForUser({
            username: await (await this.getUser()).login
        })
        console.log(resposne)
        return resposne.data
    }

    async listReposForOwner(owner: string) {
        if (this.currentUser == owner) {
            const response = await this.octokit.rest.repos.listForUser({
                username: owner
            })
            return response.data
        } else {
            const response = await this.octokit.rest.repos.listForOrg({
                org: owner
            })
            return response.data
        }
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

