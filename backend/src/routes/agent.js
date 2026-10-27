import { Router } from 'express';

const router = Router();

// Reports configured identity metadata only. This route does not register an agent onchain.
router.get('/identity', (_req, res) => {
  const agentId = process.env.ERC8004_AGENT_ID || null;
  const registryUrl = process.env.ERC8004_REGISTRY_URL || null;
  res.json({
    registered: Boolean(agentId && registryUrl),
    agentId,
    registryUrl,
    verificationStatus: agentId && registryUrl ? 'configured-not-independently-verified' : 'not-configured',
    note: 'This endpoint does not create or verify an ERC-8004 registration.'
  });
});

export default router;
