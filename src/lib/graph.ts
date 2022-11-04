import axios from "axios";

export async function getGraphToken(tenantId: string) {
  return await axios({
    method: "post",
    url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: `client_id=${process.env.AZURE_CLIENT_ID}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=${process.env.AZURE_CLIENT_SECRET}&grant_type=client_credentials&tenant=${process.env.AZURE_TENANT_ID}`,
  }).then((res) => res.data.access_token as string);
}

export async function disableUser(userId: string, accessToken: string) {
  return await axios({
    method: "patch",
    url: `https://graph.microsoft.com/v1.0/users/${userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: {
      accountEnabled: false,
    },
  }).then((res) => res.status);
}

export interface RemoveUserFromGroupProps {
  groupId: string;
  userId: string;
  accessToken: string;
}
export async function removeUserFromGroup({
  groupId,
  userId,
  accessToken,
}: RemoveUserFromGroupProps) {
  await axios({
    method: "delete",
    url: `https://graph.microsoft.com/v1.0/groups/${groupId}/members/${userId}/$ref`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.log(error);
    return `Failed to remove ${userId} from ${groupId}`;
  });
  return `Removed ${userId} from ${groupId}`;
}
export interface AssignLicenseProps {
  licenseId: string;
  userId: string;
  accessToken: string;
}
export async function assignLicense({
  licenseId,
  userId,
  accessToken,
}: AssignLicenseProps) {
  await axios({
    method: "post",
    url: `https://graph.microsoft.com/v1.0/users/${userId}/assignLicense`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      addLicenses: [{ skuId: `${licenseId}` }],
      removeLicenses: [],
    }),
  }).catch((error) => {
    console.log(error);
    return "Error assigning license";
  });
  return "Successfully added License";
}
export interface RemoveLicenseProps {
  licenseId: string;
  userId: string;
  accessToken: string;
}
export async function removeLicense({
  licenseId,
  userId,
  accessToken,
}: RemoveLicenseProps) {
  await axios({
    method: "post",
    url: `https://graph.microsoft.com/v1.0/users/${userId}/assignLicense`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      addLicenses: [],
      removeLicenses: [`${licenseId}`],
    }),
  }).catch((error) => {
    console.log(error);
    return "Error while removing license from Graph";
  });
  return "License removed";
}

export interface ResetUserPasswordProps {
  userId: string;
  password: string;
  accessToken: string;
}
export async function resetUserPassword({
  userId,
  password,
  accessToken,
}: ResetUserPasswordProps) {
  const passwordMethodId = await axios({
    method: "get",
    url: `https://graph.microsoft.com/v1.0/users/${userId}/authentication/passwordMethods`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data.value[0].id as string);
  await axios({
    method: "post",
    url: `https://graph.microsoft.com/v1.0/users/${userId}/authentication/passwordMethods/${passwordMethodId}/resetPassword`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      passwordProfile: {
        password,
        forceChangePasswordNextSignIn: false,
      },
    },
  }).catch((error) => {
    console.log(error);
    return "Error while resetting password";
  });
  return "Password reset";
}
async function getNextLink(url: string, accessToken: string) {
  return await axios({
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res);
}

export async function getUsers(accessToken: string) {
  return await axios({
    method: "get",
    url: "https://graph.microsoft.com/v1.0/users?$select=id,assignedLicenses,userPrincipalName,displayName,accountEnabled,onPremisesSyncEnabled,&$top=999",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (res) => {
    if (res.data["@odata.nextLink"]) {
      let users = res.data.value;
      let nextLink = res.data["@odata.nextLink"];
      while (nextLink) {
        await getNextLink(nextLink, accessToken)
          .then((r) => {
            users = users.concat(r.data.value);
            nextLink = r.data["@odata.nextLink"];
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return users;
    } else {
      return res.data.value;
    }
  });
}
