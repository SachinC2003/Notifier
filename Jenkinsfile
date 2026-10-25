
pipeline {
    agent any

    stages {
        stage('Checkout Verification') {
            steps {
                echo 'Notifier source code checked out by Jenkins'
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose -f compose.yml config -q'
                echo 'Docker Compose configuration is valid'
            }
        }

        
        stage('Build and Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set -e

                        echo "$DOCKERHUB_TOKEN" | docker login \
                            --username "$DOCKERHUB_USER" \
                            --password-stdin

                        docker build -t "$DOCKERHUB_USER/notifier-client:latest" ./notifier-client
                        docker build -t "$DOCKERHUB_USER/notifier-server:latest" ./notifier-server

                        docker push "$DOCKERHUB_USER/notifier-client:latest"
                        docker push "$DOCKERHUB_USER/notifier-server:latest"

                        docker logout
                    '''
                }
            }
        }

    }

    post {
        success {
            echo 'Notifier pipeline validation succeeded!'
        }
        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}
