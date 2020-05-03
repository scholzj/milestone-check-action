# Milestone Check GitHub action

This was an attempt to reimplement my _Milestone Check_ GitHub App as GitHub action.
It turns out, that this works better as GitHub App, mainly because:
* GitHub App is easier to get working even with PRs from forks, which is where GitHUb Actions seemed to be not so straight forward (the default token doesn't allow me to set additional PR status Checks on PR from fork without providing custom GitHub token)
* The Milestone Check workflow needs to be triggered both for `pull_request` as well as `issues` events (`issues` events are triggered for milestone changes while `pull_request_ are triggered for push events. This causes chaos with regards to the set status. I found out the best was to use separate status for _Milestone Check_ versus for the GitHub action run to be able to reconcile between the two different event triggers.

Apart form the limitation in the fork PRs, this works and you can use it if you for whatever reason prefer it over my [PR Milestone Check GitHub App](https://github.com/marketplace/pr-milestone-check).

## Inputs

### `token`

The token to access the GitHub API.
If not provided, the default GitHub action token will be used.

### `status_context`

The name of the PR status check which will be set by this action.
Defaults to `Milestone Check`.

## Outputs

n/a

## Example usage

```yaml
name: Milestone Check
on: [issues, pull_request]

jobs:
  milestone-check:
    runs-on: ubuntu-latest
    name: Milestone Check
    steps:
    - name: Checking if milestone is set
      id: milestone-check
      uses: scholzj/milestone-check-action@v1
      with:
        status_context: 'Milestone Check'
```