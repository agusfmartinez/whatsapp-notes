# Deploys y versionado

## Versionado (SemVer)

Formato `MAJOR.MINOR.PATCH`:

- **MAJOR**: cambios que rompen compatibilidad (ej: `v2.0.0`).
- **MINOR**: nuevas funcionalidades compatibles (ej: `v1.2.0` → `v1.3.0`).
- **PATCH**: corrección de bugs / ajustes chicos (ej: `v1.2.1` → `v1.2.2`).

No hace falta versionar cada commit. Se sube versión al cerrar algo estable
(varias features juntas, o cada deploy público). Mantener `package.json` y
`changelog.md` sincronizados.

## Deploys en Vercel

Repo de GitHub conectado a Vercel:

- Cada push a **`main`** (Production Branch) → **Production Deployment**.
- Cada branch / PR (ej: `develop`) → **Preview Deployment** con URL temporal
  tipo `whatsapp-notes-git-develop-usuario.vercel.app`.

Environments y sus variables:

- **Development** → `npm run dev` local.
- **Preview** → branches que no son `main`.
- **Production** → branch `main`.

## Ramas

- **`main`** → producción estable (Production Branch en Vercel).
- **`develop`** → trabajo día a día; base de las branches feature.

## Flujo de trabajo

1. Trabajás en `develop` (o feature branch).
2. Cada push genera URL Preview en Vercel → probás ahí.
3. Cuando validás, mergeás a `main` para disparar producción.

### Cerrar una versión

```bash
# Estás en develop
git checkout main
git merge develop
git push origin main   # 🚀 producción

# Volvés a develop y lo mantenés al día con main
git checkout develop
git merge main         # 🔄 traer lo último de prod
git push origin develop
```
