// src/server.ts

import handler, { createServerEntry } from '@tanstack/react-start/server-entry';

export default createServerEntry({
	fetch(req) {
		return handler.fetch(req);
	},
});
