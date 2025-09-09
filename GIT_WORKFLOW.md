# Git Workflow Guide for Catchpedia

## 🎯 Why Git is Perfect for This Project

Git allows you to:
- **Experiment safely** with new features
- **Rollback instantly** to any working state
- **Track all changes** with detailed history
- **Collaborate** with others in the future
- **Deploy** to GitHub Pages or other platforms

## 📋 Basic Git Commands You'll Use

### 🔍 Check Status
```bash
git status
```
Shows what files have changed since last commit.

### 💾 Save Current State (Commit)
```bash
git add .
git commit -m "Description of what you changed"
```

### 📜 View History
```bash
git log --oneline
```
Shows all your commits in a simple list.

### ⏪ Rollback to Previous State
```bash
# See available commits
git log --oneline

# Rollback to specific commit (replace COMMIT_ID with actual ID)
git reset --hard COMMIT_ID

# Or rollback to previous commit
git reset --hard HEAD~1
```

### 🔄 Create Backup Branch Before Changes
```bash
# Create and switch to backup branch
git checkout -b backup-before-experiment

# Switch back to main branch
git checkout master

# Now make your changes safely
```

## 🚀 Recommended Workflow

### 1. **Before Making Big Changes**
```bash
# Create a backup branch
git checkout -b backup-$(date +%Y%m%d)
git checkout master
```

### 2. **Make Your Changes**
- Edit files as needed
- Test the site

### 3. **If Changes Work Well**
```bash
git add .
git commit -m "Added new feature: description"
```

### 4. **If Changes Break Something**
```bash
# Rollback to last working state
git reset --hard HEAD~1

# Or rollback to backup branch
git checkout backup-$(date +%Y%m%d)
```

## 🎯 Example Scenarios

### Scenario 1: Adding New Feature
```bash
# 1. Create backup
git checkout -b backup-before-new-feature
git checkout master

# 2. Make changes
# ... edit files ...

# 3. Test site
npm run dev

# 4. If working, commit
git add .
git commit -m "Added new search feature"

# 5. If broken, rollback
git reset --hard HEAD~1
```

### Scenario 2: Experimenting with UI
```bash
# 1. Save current state
git add .
git commit -m "Working state before UI experiment"

# 2. Make UI changes
# ... edit CSS/HTML ...

# 3. If you don't like it
git reset --hard HEAD~1

# 4. If you like it
git add .
git commit -m "Updated UI design"
```

## 🔧 Advanced: GitHub Integration

### Push to GitHub (Optional)
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/catchpedia.git
git push -u origin master
```

### Pull from GitHub
```bash
git pull origin master
```

## ⚠️ Important Notes

1. **Always test before committing** - Make sure `npm run dev` works
2. **Use descriptive commit messages** - "Fixed header layout" not "Fixed stuff"
3. **Create backup branches** before major changes
4. **Don't commit broken code** - Test first!

## 🆘 Emergency Rollback

If everything breaks and you need to get back to working state:

```bash
# See all commits
git log --oneline

# Find the last working commit and copy its ID
# Then rollback to it
git reset --hard COMMIT_ID

# Restart server
npm run dev
```

## 📚 Quick Reference

| Command | Purpose |
|---------|---------|
| `git status` | See what changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes |
| `git log --oneline` | See history |
| `git reset --hard HEAD~1` | Undo last commit |
| `git checkout -b new-branch` | Create new branch |

---

**Remember: Git is your safety net! Use it liberally to experiment and never worry about breaking your site again.** 🎣
