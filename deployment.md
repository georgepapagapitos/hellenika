# Hellenika Deployment Guide

This guide explains how to deploy the Hellenika application to your Linux server.

## Prerequisites

1. Linux server with Docker and Docker Compose installed
2. Nginx Proxy Manager already set up on your server
3. Domain name pointing to your server

## Deployment Steps

### 1. Prepare your project

Clone your repository to your server:

```bash
# Example path - adjust as needed
mkdir -p /srv/docker/hellenika
cd /srv/docker/hellenika
git clone https://your-repo-url.git .
```

### 2. Create .env file

Create a `.env` file in the project root with the following variables:

```
POSTGRES_USER=hellenika
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=hellenika_db
SECRET_KEY=your_secure_secret_key
CORS_ORIGINS=http://localhost:3000,http://localhost:8090,https://your.domain.com
```

Replace the placeholder values with secure passwords and your actual domain.

### 3. Build and Start the Application

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database
- Backend API (FastAPI)
- Frontend (React with Nginx)

### 4. Configure Nginx Proxy Manager

1. Log in to your Nginx Proxy Manager at its admin interface
2. Add a new Proxy Host:
   - Domain: your.domain.com
   - Scheme: http
   - Forward Hostname: hellenika-frontend (or your server's internal IP)
   - Forward Port: 8090
   - Enable SSL with Let's Encrypt

### 5. Access Your Application

Once complete, your application should be accessible at:

- https://your.domain.com

## Maintenance

### View logs

```bash
docker-compose logs -f
```

### Update the application

```bash
git pull
docker-compose down
docker-compose up -d --build
```

### Backup database

```bash
docker exec -t hellenika_db pg_dump -U hellenika hellenika_db > backup_$(date +%Y-%m-%d_%H-%M-%S).sql
```
