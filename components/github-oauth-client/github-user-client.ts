import { Octokit } from "octokit";
import { retry } from "@octokit/plugin-retry";

export default class GithubUserClient {
    octokit: Octokit
    currentUser: string = ""

    constructor(
        accessToken: string
    ) {
        const ConfiguredOctokit = Octokit.plugin(retry)
        this.octokit = new ConfiguredOctokit({
            auth: accessToken,
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

    async ListWorkflowRunsWithOwnerRepoWorkflowIDSince(owner: string, repo: string, workflow_id: number, since: Date) {
        let page = 1
        const pageSize = 100
        const listWorkflowRunsReponse = await this.octokit.rest.actions.listWorkflowRuns({
            owner: owner,
            repo: repo,
            workflow_id: workflow_id,
            per_page: pageSize,
            page: page,
        });
        if (listWorkflowRunsReponse.data.total_count == 0) {
            return []
        }
        let earliest = new Date(listWorkflowRunsReponse.data.workflow_runs.reduce((prev, current) => (new Date(prev.created_at) > new Date(current.created_at)) ? current : prev).created_at)
        const firstPage = listWorkflowRunsReponse.data.workflow_runs.filter((run) => new Date(run.created_at) > since)

        if (earliest < since) {
            return listWorkflowRunsReponse.data.workflow_runs.filter((run) => new Date(run.created_at) > since)
        }

        const result = [...firstPage]

        for (page = 2; earliest > since; page += 1) {
            const response = await this.octokit.rest.actions.listWorkflowRuns(
                {
                    owner: owner,
                    repo: repo,
                    workflow_id: workflow_id,
                    per_page: pageSize,
                    page: page,
                })
            if (response.data.workflow_runs.length == 0) {
                break
            }
            earliest = new Date(response.data.workflow_runs.reduce((prev, current) => (new Date(prev.created_at) > new Date(current.created_at)) ? current : prev).created_at)
            const restPage = response.data.workflow_runs.filter((run) => new Date(run.created_at) > since)
            result.push(...restPage)
        }

        return result

    }
}

