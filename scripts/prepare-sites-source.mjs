// Create/update a small source snapshot for Sites; full portfolio history stays on GitHub.
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { resolve, relative, join } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const target = process.argv[2] && resolve(process.argv[2]);
if (!target || target === root || !relative(root, target).startsWith('..'))
  throw new Error('Provide a separate directory outside this repository.');
if (
  execFileSync('git', ['status', '--porcelain'], {
    cwd: root,
    encoding: 'utf8',
  }).trim()
)
  throw new Error(
    'Commit the source and portfolio changes before creating the snapshot.',
  );
const project = JSON.parse(
  readFileSync(join(root, '.openai/hosting.json'), 'utf8'),
);
const existing = join(target, '.openai/hosting.json');
if (
  existsSync(target) &&
  !existsSync(existing) &&
  readdirSync(target).some((name) => name !== '.git')
)
  throw new Error(
    'Use an empty directory or the existing checkout of this Site.',
  );
if (
  existsSync(existing) &&
  JSON.parse(readFileSync(existing, 'utf8')).project_id !== project.project_id
)
  throw new Error('The target belongs to another Site.');
mkdirSync(target, { recursive: true });
const files = execFileSync('git', ['ls-files', '-z'], {
  cwd: root,
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean);
const omitted =
  /^(docs\/(assets|audits|screenshots|video)\/|docs\/qa-.*\.json$)/;
for (const path of files.filter((path) => !omitted.test(path))) {
  const destination = join(target, path);
  mkdirSync(resolve(destination, '..'), { recursive: true });
  cpSync(join(root, path), destination);
}
const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
}).trim();
writeFileSync(
  join(target, 'SOURCE.json'),
  JSON.stringify(
    {
      repository: 'https://github.com/JakubLewosz/sekiforma',
      commit,
      omitted: [
        'portfolio media and audit/test JSON; available in the GitHub repository',
      ],
      note: 'Application source and lockfile are copied unchanged. Separate source history avoids the Sites receive-pack size limit.',
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify({
    target,
    project_id: project.project_id,
    github_commit: commit,
    files: files.filter((path) => !omitted.test(path)).length,
  }),
);
