// api
import { getUsers } from "@src/api/jira/user";

// models
import { Lookup } from "@src/shared/models/form";
import { JiraUser } from "@src/shared/models/user";

// components
import JiraUserTile from "@src/components/JiraUserTile";

export const loadUsers = (
  inputValue: string,
  callback: (options: (JiraUser & Lookup)[]) => void,
) => {
  const trimmedValue = inputValue.trim();
  getUsers(trimmedValue)
    .then((response) => {
      callback(usersToLookup(response.users));
    })
    .catch(() => callback([]));
};

export const usersToLookup = (users: JiraUser[]): (JiraUser & Lookup)[] =>
  users.map(({ accountId, displayName, ...rest }) => ({
    accountId,
    displayName,
    value: accountId,
    label: displayName,
    ...rest,
  }));

export const formatOptionLabelJiraUser = (user: JiraUser & Lookup) => {
  return <JiraUserTile avatarUrl={user.avatarUrl} displayName={user.displayName} />;
};
