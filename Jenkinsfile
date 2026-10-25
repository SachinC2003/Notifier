
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

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login \
                            --username "$DOCKERHUB_USER" \
                            --password-stdin
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
