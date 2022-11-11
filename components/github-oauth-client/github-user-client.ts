import { retry } from "@octokit/plugin-retry";
import { Octokit } from "octokit";

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

    async listWorkflowRunsWithOwnerRepoWorklfowID(owner: string, repo: string, workflowID: number) {
        const listWorkflowRunsReponse = await this.octokit.rest.actions.listWorkflowRuns({
            owner: owner,
            repo: repo,
            workflow_id: workflowID,
        });

        return listWorkflowRunsReponse.data.workflow_runs
    }

    async listWorkflowRunsWithOwnerRepoWorkflowIDSince(owner: string, repo: string, workflowID: number, since: Date) {
        let page = 1
        const pageSize = 100
        const listWorkflowRunsResponse = await this.octokit.rest.actions.listWorkflowRuns({
            owner: owner,
            repo: repo,
            workflow_id: workflowID,
            per_page: pageSize,
            page: page,
        });
        if (listWorkflowRunsResponse.data.total_count == 0) {
            return []
        }
        let earliest = new Date(listWorkflowRunsResponse.data.workflow_runs.reduce((prev, current) => (new Date(prev.created_at) > new Date(current.created_at)) ? current : prev).created_at)
        const firstPage = listWorkflowRunsResponse.data.workflow_runs.filter((run) => new Date(run.created_at) > since)

        if (earliest < since) {
            return listWorkflowRunsResponse.data.workflow_runs.filter((run) => new Date(run.created_at) > since)
        }

        const result = [...firstPage]

        for (page = 2; earliest > since; page += 1) {
            const response = await this.octokit.rest.actions.listWorkflowRuns(
                {
                    owner: owner,
                    repo: repo,
                    workflow_id: workflowID,
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

    async listWorkflowRunsForWorkflow(owner: string, repo: string, workflowID: number) {
        const response = await this.octokit.rest.actions.listWorkflowRuns({
            owner: owner,
            repo: repo,
            workflow_id: workflowID,
            per_page: 20,
        })
        return response.data.workflow_runs
    }

    async listJobsWithWorkflowRun(owner: string, repo: string, runID: number) {
        const response = await this.octokit.rest.actions.listJobsForWorkflowRun({
            owner: owner,
            repo: repo,
            run_id: runID
        })
        return response.data.jobs;
    }
}
