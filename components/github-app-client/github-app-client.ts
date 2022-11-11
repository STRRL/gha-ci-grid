import { createAppAuth } from "@octokit/auth-app";
import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "octokit";
import GitHubAppInstallationClient from "./github-app-installation-client";

export default class GithubAppClient {
    private appId: string
    private privateKey: string
    private octokit: Octokit

    constructor(
        appId: string,
        privateKey: string,
    ) {
        this.appId = appId;
        this.privateKey = privateKey;

        const OctokitWithThrottling = Octokit.plugin(throttling);
        this.octokit = new OctokitWithThrottling({
            authStrategy: createAppAuth,
            auth: {
                appId: appId,
                privateKey: privateKey,
            },
            throttle: {
                enabled: false,
            },
        });
    }

    async spawnInstallationClientForRepo(owner: string, repo: string): Promise<GitHubAppInstallationClient> {
        const getRepoInstallationResponse = await this.octokit.rest.apps.getRepoInstallation({
            owner: owner,
            repo: repo
        })

        const installationID = getRepoInstallationResponse.data.id

        return new GitHubAppInstallationClient(this.appId, this.privateKey, installationID)
    }
}

export function fromENV(): GithubAppClient {
    return new GithubAppClient(
        process.env.GITHUB_APP_ID!,
        process.env.GITHUB_APP_PRIVATE_KEY!
    )
}
