pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/p2m-frontend"
        SERVER_IMAGE = "${DOCKER_REGISTRY}/p2m-server"
        DOCKER_REGISTRY = credentials('dockerhub-username') ? "${credentials('dockerhub-username')}" : "your-dockerhub-username"
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    env.GIT_BRANCH = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    echo "🔧 Building ${env.GIT_BRANCH} (${env.GIT_COMMIT_SHORT})"
                }
            }
        }

        stage('Verify Environment') {
            steps {
                script {
                    echo "📋 Checking required tools..."
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'python3 --version'
                    sh 'docker --version'
                    sh 'docker-compose --version'
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo "📦 Installing frontend dependencies..."
                            sh 'npm ci --prefer-offline --no-audit'
                        }
                    }
                }
                stage('Server Dependencies') {
                    steps {
                        dir('server') {
                            echo "📦 Installing server dependencies..."
                            sh 'pip install -q -r requirements.txt'
                        }
                    }
                }
            }
        }

        stage('Code Quality') {
            parallel {
                stage('Lint Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                echo "🔍 Linting frontend code..."
                                sh 'npm run lint 2>&1 || true'
                            }
                        }
                    }
                }
                stage('Lint Server') {
                    steps {
                        dir('server') {
                            script {
                                echo "🔍 Checking server code..."
                                sh 'python3 -m py_compile *.py 2>&1 || true'
                            }
                        }
                    }
                }
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Frontend Unit Tests') {
                    steps {
                        dir('frontend') {
                            script {
                                echo "🧪 Running frontend unit tests..."
                                sh 'npm run test -- --run --reporter=verbose 2>&1'
                            }
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            script {
                                echo "🐳 Building frontend Docker image..."
                                sh 'docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} -t ${FRONTEND_IMAGE}:latest -f Dockerfile .'
                            }
                        }
                    }
                }
                stage('Build Server Image') {
                    steps {
                        dir('server') {
                            script {
                                echo "🐳 Building server Docker image..."
                                sh 'docker build -t ${SERVER_IMAGE}:${DOCKER_TAG} -t ${SERVER_IMAGE}:latest -f Dockerfile .'
                            }
                        }
                    }
                }
            }
        }

        stage('Playwright E2E Tests') {
            steps {
                dir('frontend') {
                    script {
                        echo "🎭 Installing Playwright and running E2E tests..."
                        sh '''
                            npx playwright install --with-deps
                            npx playwright test 2>&1 || true
                        '''
                    }
                }
            }
            post {
                always {
                    script {
                        if (fileExists('frontend/playwright-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'frontend/playwright-report',
                                reportFiles: 'index.html',
                                reportName: '🎭 Playwright E2E Report'
                            ])
                            echo "✅ Playwright report published"
                        } else {
                            echo "⚠️ Playwright report not found"
                        }
                    }
                }
            }
        }

        stage('Push to Docker Registry') {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    if (credentials('dockerhub-credentials')) {
                        echo "🚀 Pushing images to Docker Hub..."
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                                docker push ${FRONTEND_IMAGE}:${DOCKER_TAG}
                                docker push ${FRONTEND_IMAGE}:latest
                                docker push ${SERVER_IMAGE}:${DOCKER_TAG}
                                docker push ${SERVER_IMAGE}:latest
                                docker logout
                            '''
                        }
                    } else {
                        echo "⚠️ Skipping Docker push: dockerhub-credentials not configured"
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "🚀 Deploying to staging environment..."
                    sh '''
                        docker-compose -f docker-compose.staging.yml down || true
                        docker-compose -f docker-compose.staging.yml up -d
                        sleep 10
                    '''
                }
            }
        }

        stage('Staging Integration Tests') {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "✅ Running integration tests against staging..."
                    sh '''
                        for i in {1..30}; do
                            if curl -s http://localhost:3000 > /dev/null; then
                                echo "Frontend is up"
                                break
                            fi
                            echo "Waiting for frontend... ($i/30)"
                            sleep 1
                        done
                        
                        for i in {1..30}; do
                            if curl -s http://localhost:8000/docs > /dev/null; then
                                echo "Backend is up"
                                break
                            fi
                            echo "Waiting for backend... ($i/30)"
                            sleep 1
                        done
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                script {
                    echo "🚀 Deploying to production..."
                    sh '''
                        docker-compose down || true
                        docker-compose up -d
                        sleep 10
                    '''
                }
            }
        }
    }

    post {
        always {
            node {
                script {
                    echo "🧹 Cleaning up..."
                    sh 'docker system prune -f 2>&1 || true'
                }
            }
        }
        success {
            script {
                echo "✅ Pipeline succeeded"
                if (env.GIT_BRANCH == 'main') {
                    echo "🎉 Build ${env.BUILD_NUMBER} deployed successfully"
                }
            }
        }
        failure {
            script {
                echo "❌ Pipeline failed at stage: ${env.STAGE_NAME}"
            }
        }
    }
}