import { PrismaClient } from "@prisma/client";
import { produceMessage } from "./kafkaConfig.js";

const prisma = new PrismaClient();

const incidentLogsExtension = prisma.$extends({
  query: {
    incidentLogs: {
      create({ args, query }) {
        return query(args).then((result) => {
          const incidentLog = result;
          produceMessage("incident-logs", [
            `New incident log added: ${JSON.stringify(incidentLog)}`,
          ]);
          return result;
        });
      },
    },
  },
});

export default prisma;
export { incidentLogsExtension };
