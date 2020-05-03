const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const octokit = Octokit(core.getInput('token'));

const pending_state = "pending"
const peding_description = "Please set the milestone!"
const success_state = "success"
const success_description = "Great, the milestone is set."

async function createStatus(owner, repo, sha, state, desc) {
    const status_context = core.getInput('status_context')
    return await octokit.repos.createStatus({owner: owner, repo: repo, sha: sha, state: state, description: desc, context: status_context})
}

async function checkMilestone()  {
    switch (github.context.eventName)   {
        case "issues":
            const issue = github.context.payload.issue;
            
            if (issue.pull_request != null) {
                console.log('Issue is a PR');

                const repository = github.context.payload.repository;
                const { data: pr } = await octokit.pulls.get({owner: repository.owner.login, repo: repository.name, pull_number: issue.number})
                
                const dump = JSON.stringify(pr, undefined, 2)
                console.log(`The event payload: ${dump}`);

                var owner = pr.base.repo.owner.login
                var repo = pr.base.repo.name
                var sha = pr.head.sha

                if (issue.milestone == null)    {
                    console.log('Milestone is not set!');
                    return await createStatus(owner, repo, sha, pending_state, peding_description)
                } else {
                    console.log('Milestone is set');
                    return await createStatus(owner, repo, sha, success_state, success_description)
                }
            } else {
                console.log('Issue is not a PR');
            }

            break;
        case "pull_request":
            const pr = github.context.payload.pull_request;

            var owner = pr.base.repo.owner.login
            var repo = pr.base.repo.name
            var sha = pr.head.sha

            if (pr.milestone == null)    {
                console.log('Milestone is not set!');
                return await createStatus(owner, repo, sha, pending_state, peding_description)
            } else {
                console.log('Milestone is set');
                return await createStatus(owner, repo, sha, success_state, success_description)
            }

            break;
        default:
            console.log("Unsupported event ${github.context.eventName}");
    }
};

try {
    checkMilestone()
} catch (error) {
    console.log(`Something failed: ${error.message}`);
    core.setFailed(error.message);
}