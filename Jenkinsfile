pipeline {
    agent any

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
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('frontend') {
                    sh 'npm run test -- --run || true'
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Build failed"
        }
        success {
            echo "✅ Build succeeded"
        }
    }
}