import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

const clients = [];

const notifyClients = (data) => {
  clients.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

const listenForNewIncidents = async () => {
  await sql.listen('new_incident', (payload) => {
    const data = JSON.parse(payload);
    console.log('New incident detected:', data);
    // Notify all connected SSE clients
    notifyClients(data);
  });
};

listenForNewIncidents();


export const addSSEClient = (res) => {
  clients.push(res);

  res.on('close', () => {
    clients.splice(clients.indexOf(res), 1);
  });
};

export default sql;
