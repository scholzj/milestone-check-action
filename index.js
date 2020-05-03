const core = require('@actions/core');
const github = require('@actions/github');

try {
    switch (github.context.eventName)   {
        case "issues":
            const issue = github.context.payload.issue;
            
            if (issue.data.pull_request != null) {
                console.log('Issue is a PR');

                if (issue.milestone == null)    {
                    console.log('Milestone is not set!');
                    core.setFailed("Please set the milestone!")
                } else {
                    console.log('Milestone is set');
                }
            } else {
                console.log('Issue is not a PR');
            }

            break;
        case "pull_request":
            const pr = github.context.payload.pull_request;

            if (pr.milestone == null)    {
                console.log('Milestone is not set!');
                core.setFailed("Please set the milestone!")
            } else {
                console.log('Milestone is set');
            }

            break;
        default:
            console.log("Unsupported event ${github.context.eventName}")
    }

    if (github.context.eventName == "issues")   {

    } else if ()

    const payload = JSON.stringify(github.context, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    console.log(`Something failed: ${error.message}`);
    core.setFailed(error.message);
}