pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        FRONTEND_IMAGE = 'your-dockerhub-username/p2m-frontend'
        SERVER_IMAGE = 'your-dockerhub-username/p2m-server'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'docker --version'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Server Dependencies') {
                    steps {
                        dir('server') {
                            sh 'pip install --user -r requirements.txt'
                        }
                    }
                }
            }
        }

        stage('Lint and Format') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('frontend') {
                    sh 'npm run test -- --run --coverage'
                }
            }
            post {
                always {
                    publishCoverage adapters: [istanbulCoberturaAdapter('coverage/cobertura-coverage.xml')]
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                    sh "docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} -f Dockerfile ."
                }
            }
        }

        stage('Build Server') {
            steps {
                dir('server') {
                    sh "docker build -t ${SERVER_IMAGE}:${DOCKER_TAG} -f Dockerfile ."
                }
            }
        }

        stage('E2E Tests with Playwright') {
            steps {
                dir('frontend') {
                    sh 'npx playwright install'
                    sh 'npx playwright install-deps'
                    sh 'npx playwright test'
                }
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'docker run --rm -v $(pwd):/src clair-scanner --ip 127.0.0.1 ${FRONTEND_IMAGE}:${DOCKER_TAG}'
                sh 'docker run --rm -v $(pwd):/src clair-scanner --ip 127.0.0.1 ${SERVER_IMAGE}:${DOCKER_TAG}'
            }
        }

        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        docker.image("${FRONTEND_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${SERVER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${FRONTEND_IMAGE}:${DOCKER_TAG}").push('latest')
                        docker.image("${SERVER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh 'docker-compose -f docker-compose.staging.yml up -d'
            }
        }

        stage('Integration Tests') {
            steps {
                sh 'curl -f http://localhost:3000 || exit 1'
                sh 'curl -f http://localhost:8000/docs || exit 1'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            sh 'docker-compose down || true'
            cleanWs()
        }
        success {
            emailext (
                subject: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Good news! The build was successful. Check it out: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        failure {
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Bad news! The build failed. Check it out: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
    }
}