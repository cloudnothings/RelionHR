import { Client } from "@microsoft/microsoft-graph-client/lib/src/Client";
import { User } from "@microsoft/microsoft-graph-types";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    const token = await getToken({ req });
    if (token) {
      const accessToken = token.accessToken as string;
      const client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });
      const users = await client.api("/users").get();
      console.log(users);
      res.send({
        content: users,
      });
    } else {
      res.send({
        error: "Unable to get token.",
      });
    }
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};

export default restricted;
