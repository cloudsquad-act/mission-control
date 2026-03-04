# Intelligence Report

## Findings on Unauthorized Access Attempts

- Logs show several SSH login attempts and Cron sessions. No unauthorized access detected.

## Bridge Connection Latency

- Pinging convex.dev resulted in:
  - Average response time: 1.966 ms
  - Minimal response time: 1.366 ms
  - Maximum response time: 3.308 ms
  - 0% packet loss
## Additional Findings

### Unauthorized Access Log:

```
2026-02-25T11:17:53.620436+00:00 srv1320855 sudo: squadagent : PWD=/home/squadagent/.openclaw/workspace ; USER=root ; COMMAND=/usr/bin/tail -n 50 /var/log/auth.log
2026-02-25T12:07:39.613065+00:00 srv1320855 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by squadagent(uid=1001)
```

### Bridge Latency Testing:

- **Pinging Results**: Average response time recorded.
