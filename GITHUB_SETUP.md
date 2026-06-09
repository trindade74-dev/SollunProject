# 📤 Push para GitHub — Sollun Project

## ✅ Pré-requisitos

- [ ] Conta GitHub criada (https://github.com/signup)
- [ ] Git configurado localmente
- [ ] SSH key adicionada ao GitHub (recomendado)

---

## 🚀 Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. **Repository name:** `SollunProject`
3. **Description:** (opcional)
   ```
   Landing page e demo interativa para Sollun — Automação de atendimento 24/7 no WhatsApp
   ```
4. **Visibility:** Public (recomendado para portfolio) ou Private
5. **NÃO** inicialize com README (já temos um!)
6. Clique em **Create repository**

---

## 🔧 Passo 2: Configurar Git Remote

### Opção A: SSH (Recomendado)

```bash
cd "c:\Users\trind\OneDrive\Documentos\SollunProject"

# Adicionar remote
git remote add origin git@github.com:SEU_USERNAME/SollunProject.git

# Verificar
git remote -v
```

**Saída esperada:**
```
origin  git@github.com:SEU_USERNAME/SollunProject.git (fetch)
origin  git@github.com:SEU_USERNAME/SollunProject.git (push)
```

### Opção B: HTTPS

Se não tem SSH key configurada:

```bash
git remote add origin https://github.com/SEU_USERNAME/SollunProject.git
```

---

## 📤 Passo 3: Fazer Push

### Primero push (cria branch master no GitHub)

```bash
git branch -M main
git push -u origin main
```

**Saída esperada:**
```
Enumerating objects: 25, done.
Total 4559 (delta 0), reused 4559 (delta 0), pack-reused 0
remote: Create a pull request for 'main' on GitHub by visiting:
remote:      https://github.com/SEU_USERNAME/SollunProject/pull/new/main
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Proximos pushes

```bash
git push
```

---

## ✨ Passo 4: Verificar no GitHub

1. Acesse: https://github.com/SEU_USERNAME/SollunProject
2. Você deve ver:
   - ✅ Código-fonte
   - ✅ README.md renderizado
   - ✅ 25 commits

---

## 🔒 Passo 5: Segurança no GitHub

### 5.1 Branch Protection

1. Vá para **Settings → Branches**
2. Clique em **Add rule**
3. Branch name pattern: `main`
4. Ative:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass

### 5.2 GitHub Secrets

Se usará CI/CD (GitHub Actions):

1. Vá para **Settings → Secrets and variables → Actions**
2. Clique em **New repository secret**
3. Adicione suas credenciais:
   ```
   Name: OPENAI_API_KEY
   Value: sk-proj-...
   ```

### 5.3 Dependabot & Security

1. Vá para **Settings → Security**
2. Ative:
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Secret scanning

---

## 📋 Troubleshooting

### ❌ "fatal: 'origin' does not appear to be a 'git' repository"

```bash
# Verifique se está na pasta certa
cd "c:\Users\trind\OneDrive\Documentos\SollunProject"

# Verifique git config
git config --list | grep remote
```

### ❌ "Permission denied (publickey)"

SSH key não está configurada.

```bash
# Gerar SSH key
ssh-keygen -t ed25519 -C "trindade7474@gmail.com"

# Adicionar ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copie a chave pública e adicione em GitHub:
# Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub
```

### ❌ "remote: error: User X is not allowed to push"

Você não tem permissão de push.

```bash
# Verifique o remote
git remote -v

# Se a URL está errada, remova e adicione de novo
git remote remove origin
git remote add origin https://github.com/SEU_USERNAME/SollunProject.git
```

### ❌ "Updates were rejected because the tip of your current branch is behind"

```bash
# Puxe as mudanças do GitHub
git pull origin main

# Se conflitar, resolva e faça commit
git add .
git commit -m "Merge remote changes"

# Agora pode fazer push
git push origin main
```

---

## 🎯 Próximos Passos

Depois de fazer push:

1. **Adicione tópicos ao repo:**
   - Go para **Settings → General**
   - Adicione: `landing-page`, `whatsapp`, `automation`, `typescript`, `vite`

2. **Crie um arquivo CONTRIBUTING.md:**
   ```bash
   # Para contribuidores saberem como ajudar
   ```

3. **Configure GitHub Pages (opcional):**
   - **Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` / `dist`

4. **Adicione GitHub Actions (CI/CD):**
   ```yaml
   # .github/workflows/build.yml
   name: Build & Test
   on: [push, pull_request]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm ci
         - run: npm run build
   ```

5. **Passe o link para seu portfólio:**
   ```
   https://github.com/SEU_USERNAME/SollunProject
   ```

---

## 📊 Resultado Final

Seu repositório deve ficar assim:

```
SollunProject/
├── 📖 README.md              — Documentação principal
├── 🔐 SECURITY.md            — Política de segurança
├── 📝 CONTRIBUTING.md        — Guia para contribuidores (opcional)
├── .gitignore                — Arquivos a ignorar
├── .env.example              — Template de variáveis
├── Pagina/                   — Landing page (Vite)
├── sollun-animation/         — Canvas animation
├── .github/                  — GitHub Actions (opcional)
└── 📜 LICENSE                — Licença (MIT ou Apache)
```

---

## 🎉 Compartilhar

Agora você pode compartilhar:

```
🌐 GitHub: https://github.com/SEU_USERNAME/SollunProject
📱 Acesse: https://SEU_USERNAME.github.io/SollunProject (via Pages)
```

---

**Sucesso! 🚀**

Tempo estimado: 5-10 minutos

Data: 2026-06-09
