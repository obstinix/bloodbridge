# Vercel Deployment Guide

This project has been configured for deployment on Vercel. Follow these steps to deploy your Blood Bank Management System.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository (GitHub, GitLab, or Bitbucket)
3. MySQL database (you can use services like PlanetScale, Railway, or AWS RDS)

## Deployment Steps

### 1. Push to Git Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the Python project

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

**Required Environment Variables:**

```
SECRET_KEY=your-secret-key-here
MYSQL_HOST=your-mysql-host
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=blood_bank_db
MYSQL_PORT=3306
FLASK_ENV=production
```

**How to add environment variables:**
1. Go to your project on Vercel
2. Click on "Settings" → "Environment Variables"
3. Add each variable with its value
4. Select the environment (Production, Preview, Development)
5. Click "Save"

### 4. Deploy

Vercel will automatically build and deploy your application when you push to your repository, or you can manually deploy from the Vercel dashboard.

## Project Structure for Vercel

The project has been configured with the following structure:

```
/
├── api/
│   └── index.py          # Vercel serverless function entry point
├── blood_bank_app/
│   ├── app.py            # Main Flask application
│   ├── config.py         # Configuration settings
│   ├── static/           # Static files (CSS, JS)
│   ├── templates/        # HTML templates
│   └── ...
├── vercel.json           # Vercel configuration
├── requirements.txt      # Python dependencies
└── runtime.txt          # Python version specification
```

## Important Notes

### Database Configuration

1. **Use environment variables**: The app reads database credentials from environment variables set in Vercel.

2. **Remote MySQL database**: You'll need a remote MySQL database accessible from the internet. Popular options:
   - **PlanetScale** (recommended for MySQL)
   - **Railway**
   - **AWS RDS**
   - **Google Cloud SQL**

3. **Database initialization**: After deploying, you'll need to run the database schema (`database/schema.sql`) on your remote database.

### Static Files and Templates

The Flask app has been configured to find static files and templates correctly when deployed on Vercel. The paths are set relative to the `blood_bank_app` directory.

### Limitations

1. **Serverless functions**: Vercel uses serverless functions, so database connections should be established per request rather than maintained persistently.

2. **Cold starts**: First request may be slower due to serverless cold starts.

3. **File system**: The file system is read-only except for `/tmp` directory. Don't rely on writing files to disk.

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check that all dependencies in `requirements.txt` are compatible with Python 3.11
2. Ensure `runtime.txt` specifies a supported Python version
3. Check Vercel build logs for specific error messages

### Database Connection Issues

If the app can't connect to the database:
1. Verify all environment variables are set correctly
2. Check that your MySQL host allows connections from Vercel's IP addresses
3. Ensure your database is accessible from the internet (not localhost-only)

### Static Files Not Loading

If static files (CSS/JS) aren't loading:
1. Check that the paths in templates use `url_for('static', ...)`
2. Verify `vercel.json` routes are configured correctly
3. Check browser console for 404 errors

## Testing Locally with Vercel

You can test the Vercel deployment locally using the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

## Support

For Vercel-specific issues, refer to:
- [Vercel Python Documentation](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)
- [Vercel Flask Guide](https://vercel.com/guides/deploying-flask-with-vercel)
